/**
 * 自动监听备份「活档」持续落盘 + onStartup 封存（2026-07-30 MV3 重构 v3）。
 *
 * v3 修复（大模型审查 6 个一致性问题，3 个丢数据）：
 *   P0-1：startupPhase 默认 false（SW 运行中重启时事件直接写不丢）；只 onStartup 入口置 true。
 *   P0-2：archive 失败时把 live 移到 livePendingArchive 保留待下次重试，再清 live 放行——
 *         避免 finally 触发首份写覆盖昨晚活档（最严重丢数据）。
 *   P0-3：dirty 合并到 live 对象（LiveBlob{snapshot,dirty,updatedAt}），删独立 liveDirty key，
 *         markDirty 读改写走 enqueueWrite 串行避免非原子 lost update。
 *   P1-4：scheduleLiveWrite 删 cachedEnabled 短路（开关 ON 时缓存未更新会丢事件）。
 *   P1-5：onRemoved 删 isWindowClosing 过滤（关单窗口标签事件也要落盘）。
 *
 * 架构原则（两个大模型一致建议，用户拍板照办）：
 *   Event driven + Stateless worker + Persistent state + Idempotent writes +
 *   Recovery instead of guarantee。
 *
 * 关键决策（对照需求文档 docs/req/auto-listen-backup.md ALB-01）：
 *   1. 事件入口不依赖内存状态（SW 唤醒后内存重置不可靠）。
 *      scheduleLiveWrite 不检查任何内存 flag（含 cachedEnabled），总是调度防抖；开关校验交给
 *      writeLiveSnapshot 内部 readBackupSettings（cachedEnabled 仅用于诊断/其他优化，不当 event gate）。
 *   2. 纯 setTimeout 500ms 防抖——高频操作自然撑活 SW；停手 500ms 后写完，下次操作再唤醒。
 *   3. 持久化 dirty 标志（合并到 LiveBlob 对象）+ 5 分钟 recovery alarm——SW 休眠丢 timer 时
 *      recovery 兜底补写（Recovery instead of guarantee，不追求 100% 保证）。
 *   4. Promise queue (writeChain) 串行写，替代 isWriting/pendingWrite 互斥锁。
 *      markDirty 读改写也走此队列，与 writeLiveSnapshot 互斥（P0-3 避免交叉覆盖）。
 *   5. startupPhase guard（默认 false）——仅 onStartup 入口置 true 防 archive 期间并发写，
 *      finally 置 false 放行。SW 运行中重启（非浏览器启动，onStartup 不触发）时 startupPhase
 *      本就是 false，事件直接写不丢（P0-1）。
 *
 * 守红线：
 *   - 监听器只在 background.ts 顶层注册一次（SW 上下文唯一注册点）
 *   - 活档写入用 safeSet + toPure；不静默吞错（虚假功能零容忍）
 *   - 封存走 enqueueBackupOperation（runBackupWithCoordination）统一收口（M3 保留）
 *   - 封存顺序不能反（R4）：onStartup 先读活档封存（旧数据）→ 清 → 再开始新会话
 *   - recovery alarm name 用 LIVE_RECOVERY_ALARM_NAME（≠ BACKUP_ALARM_NAME 定时备份闹钟）
 */

/** 活档防抖间隔（D2=500ms，需求文档 §9 决策） */
const LIVE_DEBOUNCE_MS = 500
/**
 * Recovery alarm 间隔（分钟）。chrome.alarms 生产最小 0.5（30s），见
 * docs/googledocs/alarms.md line 517。用 5 分钟周期：SW 休眠丢 setTimeout timer 时
 * recovery 兜底读持久化 dirty 补写（Recovery instead of guarantee 原则，不追求 100%）。
 */
const LIVE_RECOVERY_ALARM_MIN = 5
/**
 * Recovery alarm name。≠ BACKUP_ALARM_NAME（'tabMasterBackupTimer' 定时备份闹钟），
 * 避免与定时备份闹钟冲突（两套独立闹钟，互不干扰）。
 */
export const LIVE_RECOVERY_ALARM_NAME = 'live_backup_recovery'

/**
 * 开关缓存（诊断/优化用，P1-4 后不再当 event gate）。
 * - SW 启动时 ensureLiveBackupStarted fire-and-forget 读 settings 初始化
 * - storage.onChanged 监听 settings 变化时同步更新
 * - scheduleLiveWrite 不再检查此值（避免开关 ON 时缓存未更新丢事件）；writeLiveSnapshot 内部
 *   readBackupSettings 二次校验开关，并同步刷新此缓存
 * - 保留供 startLiveBackup/stopLiveBackup/initLiveBackupController 等诊断路径使用
 */
let cachedEnabled: boolean | null = null

/** 防抖 timer 句柄（setTimeout 500ms） */
let liveTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 写盘串行队列（Promise chain）。所有写路径（含 markDirty 读改写）都走 enqueueWrite，天然串行。
 * 替代旧 isWriting/pendingWrite 互斥锁——更简洁，且 archive.finally 的首份写也串入此队列，
 * 与防抖写互斥（不会并发写 storage.local 活档）。P0-3：markDirty 读改写也入队，避免与
 * writeLiveSnapshot 交叉覆盖 snapshot lost update。
 */
let writeChain: Promise<unknown> = Promise.resolve()
function enqueueWrite(task: () => Promise<void>): Promise<void> {
  // then(task, task)：无论上一任务 resolve/reject 都执行本任务（链不因单次失败中断）
  const next = writeChain.then(task, task)
  // 吞掉错误由 task 内部记日志，链继续；返回原始 next 让调用方可选 catch
  writeChain = next.catch(() => {})
  return next
}

/**
 * dirty 标志的内存缓存（减少 storage.local.set 次数）。
 * true = 有未落盘变更待写；writeLiveSnapshot 成功后置 false。
 * 持久化 dirty 已合并到 LiveBlob.dirty（P0-3，删独立 liveDirty key）。
 * SW 重启后内存丢失，recovery 回调从 LiveBlob.dirty 读取同步此缓存。
 */
let dirtyCached = false

/**
 * startupPhase guard（P0-1 重构 v3，默认 false）。
 * 浏览器启动时 onStartup 封存与顶层 SW 启动并发，若抢先写盘会把当前刚开的标签覆盖
 * 昨晚活档→封存成 1 标签（R4）。archiveLiveOnStartup 入口置 true 防 archive 期间并发写，
 * finally 置 false 放行。
 * 默认 false（v2 是 true）：SW 运行中重启（非浏览器启动，onStartup 不触发）时事件直接写不丢，
 * 不再需要 2s 兜底放行——昨晚活档在 storage 里没被动，事件写的是当前刚开标签不会覆盖昨晚数据。
 */
let startupPhase = false

/**
 * 采集当前标签：每次 chrome.tabs.query({}) 全量拉取（不用 tabMirror 镜像）。
 * 镜像是增量维护，SW 唤醒竞态下可能漏新标签/含幽灵标签 → 活档数据不准。
 * 全量 query 每次拿真实状态，即使丢一两个事件，下次事件来时数据自愈。
 */
async function collectTabs(): Promise<chrome.tabs.Tab[]> {
  return chrome.tabs.query({})
}

/**
 * 写 state.lastBackupError（配额满等错误提示给 UI，UI 通过 storage.onChanged 同步显示）。
 */
async function persistLiveError(msg: string): Promise<void> {
  try {
    const data = await chrome.storage.local.get(BACKUP_KEYS.state)
    const cur = sanitizeState(data[BACKUP_KEYS.state])
    cur.lastBackupError = msg
    await safeSet({ [BACKUP_KEYS.state]: toPure(cur) }, "backup")
  } catch {
    // 静默：写错误失败不应阻塞主流程
  }
}

/**
 * 设持久化 dirty=true（P0-3：合并到 LiveBlob 对象，走 enqueueWrite 串行避免非原子 lost update）。
 * 内存缓存 dirtyCached 已 true 时跳过 IO（高频事件去重）。
 * 读改写：读当前 LiveBlob → 设 dirty=true → 原子写回整个对象。
 *   串行队列保证此 read-modify-write 与 writeLiveSnapshot 的 write 互斥，
 *   不会出现"markDirty 读旧 blob → writeLiveSnapshot 写新 blob → markDirty 写回旧 blob 覆盖新 snapshot"。
 * 无活档（首次）时跳过——等 writeLiveSnapshot 创建。
 */
function markDirty(): void {
  if (dirtyCached) return
  dirtyCached = true
  void enqueueWrite(async () => {
    const data = await chrome.storage.local.get(BACKUP_KEYS.live)
    const blob = sanitizeLiveBlob(data[BACKUP_KEYS.live])
    if (!blob) return // 无活档（首次），等 writeLiveSnapshot 创建
    if (blob.dirty) return // 已 dirty，无需重复写
    blob.dirty = true
    blob.updatedAt = Date.now()
    await safeSet({ [BACKUP_KEYS.live]: toPure(blob) }, "backup.live")
  }).catch((e) => console.warn('[backup] 设 dirty 失败', e))
}

/**
 * 清 dirty（P0-3：合并到 LiveBlob 对象）。
 * 内存缓存 dirtyCached 已 false 时跳过（success path 写完 blob{dirty:false} 后调，无重复 IO）。
 * 读改写：读当前 LiveBlob → dirty 已 false 跳过 / 否则设 false 原子写回。
 *   覆盖 0 标签跳过场景（writeLiveSnapshot 未写新 blob，但 live blob 的 dirty 仍 true，
 *   不清会导致 recovery alarm 每 5 分钟重复触发 0 标签写——虽幂等不致命但浪费 IO）。
 */
function clearDirty(): void {
  if (!dirtyCached) return
  dirtyCached = false
  void enqueueWrite(async () => {
    const data = await chrome.storage.local.get(BACKUP_KEYS.live)
    const blob = sanitizeLiveBlob(data[BACKUP_KEYS.live])
    if (!blob || !blob.dirty) return
    blob.dirty = false
    blob.updatedAt = Date.now()
    await safeSet({ [BACKUP_KEYS.live]: toPure(blob) }, "backup.live")
  }).catch((e) => console.warn('[backup] 清 dirty 失败', e))
}

/**
 * 写一份活档到 storage.local（覆盖写，幂等——同状态多次写结果一致）。
 * - startupPhase=true 时跳过（R4：等 onStartup 封存完成放行）
 * - readBackupSettings 二次校验开关（防 cachedEnabled 过期）；同步刷新 cachedEnabled
 * - 0 标签跳过并清 dirty
 * - 写成功清 dirty；配额超限广播 UI + stopLiveBackup，不静默丢
 */
async function writeLiveSnapshot(): Promise<void> {
  if (startupPhase) {
    // 浏览器启动时 onStartup 封存与顶层 SW 启动并发，等 archive 完成放行（R4）
    return
  }

  const settings = await readBackupSettings()
  // 二次校验开关（防 cachedEnabled 过期；开关关时不写）
  if (!settings.listenBackupEnabled) {
    cachedEnabled = false
    return
  }
  cachedEnabled = true

  const allTabs = await collectTabs()
  const backupable = filterBackupableTabs(allTabs)
  if (backupable.length === 0) {
    console.info(`[backup] 活档写入跳过：无标签（query ${allTabs.length} 个，可备份 0 个）`)
    clearDirty()
    return
  }

  const deviceId = await readOrCreateDeviceId()
  const lim = currentLimits()
  const file = await buildBackupFileFromTabs(
    allTabs,
    'auto.listen' as SnapshotSource,
    deviceId,
    'auto.listen',
    { truncateAt: lim.maxTabsPerSnapshot, totalTabCount: allTabs.length },
  )
  // 活档固定哨兵 id 覆盖设计——buildBackupFileFromTabs 生成的 uuid 立即被 LIVE_SNAPSHOT_ID
  //   覆盖。活档是覆盖写（不进 IndexedDB），用固定哨兵 id 供 UI 识别；封存时才生成新 uuid。
  file.snapshot.id = LIVE_SNAPSHOT_ID

  try {
    // P0-3：活档存 LiveBlob{snapshot, dirty, updatedAt} 一个对象原子覆盖写。
    //   dirty=false（已落盘）；dirty 字段随 snapshot 同对象写入，避免独立 liveDirty key 的非原子 lost update。
    const blob: LiveBlob = {
      snapshot: toPure(file),
      dirty: false,
      updatedAt: Date.now(),
    }
    await safeSet({ [BACKUP_KEYS.live]: toPure(blob) }, "backup.live")
    clearDirty()
    console.info(`[backup] 活档写入 source=live tabsCount=${allTabs.length}`)
    chrome.runtime.sendMessage({ type: "backup:changed", op: "live", traceId: "live" }).catch(() => {})
  } catch (e) {
    // 不静默吞（虚假功能零容忍）。配额超限时停监听 + 提示用户，避免反复失败。
    const msg = e instanceof Error ? e.message : String(e)
    const isQuota = /quota|exceeded|max/i.test(msg)
    console.warn('[backup] 活档写入失败', e)
    if (isQuota) {
      const hint = '自动监听活档过大，已暂停。建议清理标签或关闭自动监听备份。'
      await persistLiveError(hint)
      chrome.runtime.sendMessage({ type: "backup:live-error", error: hint }).catch(() => {})
      stopLiveBackup()
    }
  }
}

/**
 * 调度一次防抖活档写入（纯 setTimeout 500ms，不再用 alarms 防抖）。
 *
 * P1-4：事件入口不检查任何内存 flag（含 cachedEnabled）——开关 ON 时 cachedEnabled 可能
 *   还未由 storage.onChanged 更新，短路会丢事件。开关校验交给 writeLiveSnapshot 内部
 *   readBackupSettings（二次校验，防过期缓存）。开关关时浪费一个 500ms timer + 一次
 *   readSettings，可接受（可靠 > 省 timer）。
 * 设持久化 dirty=true（SW 休眠丢 timer 时 recovery alarm 兜底补写）。
 * 高频操作自然撑活 SW（用户连续操作时 SW 不休眠）；停手 500ms 后写完，下次操作再唤醒。
 */
export function scheduleLiveWrite(): void {
  markDirty()
  if (liveTimer) clearTimeout(liveTimer)
  liveTimer = setTimeout(() => {
    liveTimer = null
    void enqueueWrite(() => writeLiveSnapshot()).catch((e) =>
      console.warn('[backup] 活档写入异常', e)
    )
  }, LIVE_DEBOUNCE_MS)
}

/**
 * alarms.onAlarm recovery 回调：LIVE_RECOVERY_ALARM_NAME 触发时读持久化 dirty，
 * 若 true 则补写一次（SW 休眠丢 setTimeout timer 时兜底，Recovery instead of guarantee）。
 * 由 background.ts 顶层 alarms.onAlarm 监听器同步注册后分发到本函数。
 * 走 enqueueWrite 串行，与 setTimeout 主轨防并发。
 * P0-3：dirty 从 LiveBlob.dirty 字段读（合并对象后不再有独立 liveDirty key）。
 */
export function handleLiveBackupAlarm(alarm: chrome.alarms.Alarm): boolean {
  if (alarm.name !== LIVE_RECOVERY_ALARM_NAME) return false
  void enqueueWrite(async () => {
    // 读持久化 dirty（SW 重启后 dirtyCached 内存丢失，以 LiveBlob.dirty 为准）
    const data = await chrome.storage.local.get(BACKUP_KEYS.live)
    const blob = sanitizeLiveBlob(data[BACKUP_KEYS.live])
    const dirty = blob?.dirty === true
    dirtyCached = dirty
    if (!dirty) return
    await writeLiveSnapshot()
  }).catch((e) => console.warn('[backup] recovery 活档写入异常', e))
  return true
}

/**
 * 开关 ON：开启自动监听备份。
 * - 更新 cachedEnabled=true
 * - 立即写一份活档（捕获当前已开标签，用户即时反馈）
 * - 监听器已在 background.ts 顶层同步注册（常驻），本函数不绑监听器。
 *
 * 用户运行时切开关走本函数（initLiveBackupController 路径）。
 */
export async function startLiveBackup(): Promise<void> {
  const settings = await readBackupSettings()
  if (!settings.listenBackupEnabled) {
    console.info('[backup] 开关：startLiveBackup 跳过（listenBackupEnabled=false）')
    return
  }
  cachedEnabled = true
  console.info('[backup] 开关：自动监听备份 ON（listenBackupEnabled=true）')
  // 立即写一份（不等首次事件），捕获当前已开标签。走 enqueueWrite 串行。
  void enqueueWrite(() => writeLiveSnapshot()).catch((e) =>
    console.warn('[backup] 活档首次写入异常', e)
  )
}

/**
 * 开关 OFF：停止自动监听备份。
 * - cachedEnabled=false（诊断缓存更新；P1-4 后 scheduleLiveWrite 不再依赖此值，但保留同步）
 * - 清 pending setTimeout + 清 recovery 闹钟（关开关后不再需要兜底写入）
 * - 清活档 + 清 dirty（P0-3：dirty 合并到 LiveBlob，清 live 即清 dirty；不再有独立 liveDirty key）
 *   用户拍板：列表不再显示「实时」档避免误导；历史档不受影响
 *   不清 livePendingArchive（上次启动 archive 失败遗留的待封存数据，下次启动仍要封存，保留）
 */
export async function stopLiveBackup(): Promise<void> {
  cachedEnabled = false
  if (liveTimer) {
    clearTimeout(liveTimer)
    liveTimer = null
  }
  void chrome.alarms.clear(LIVE_RECOVERY_ALARM_NAME)
  dirtyCached = false
  try {
    await safeRemove([BACKUP_KEYS.live], "backup.live")
    chrome.runtime.sendMessage({ type: "backup:changed", op: "live-cleared", traceId: "live" }).catch(() => {})
  } catch (e) {
    console.warn('[backup] 清活档失败', e)
  }
  console.info('[backup] 开关：自动监听备份 OFF（listenBackupEnabled=false，已清活档+闹钟+dirty）')
}

/**
 * onStartup 封存：把上一会话的活档封存为历史档入 IndexedDB，再清活档开始新会话。
 *
 * P0-1（v3）：入口置 startupPhase=true 防 archive 期间并发写（默认 false，SW 运行中重启不丢）。
 * P0-2（v3）：archive 失败/异常时把 live 移到 livePendingArchive 保留待下次启动重试，
 *   再清 live 放行新会话写——避免 finally 触发的首份写用当前标签覆盖昨晚活档（最严重丢数据）。
 *
 * 顺序（R4 关键，不能反）：
 *   1. 优先封存 livePendingArchive（上次启动 archive 失败遗留）——archivePendingIfNeeded
 *   2. 读活档（旧数据 = 昨天下班时开着标签的状态）
 *   3. 有内容 → 克隆 → 生成新 uuid → 走 coordination 入 IndexedDB → trim FIFO
 *   4. 成功 → 清活档；失败/异常 → 移活档到 livePendingArchive + 清活档（放行新会话不覆盖昨晚数据）
 *   5. finally：startupPhase=false 放行新写 + 触发新会话首份活档写
 *
 * M3：封存走 enqueueBackupOperation（runBackupWithCoordination）统一收口（锁 + WAL + 审计）。
 *   archive 已构建好 file，通过 payload kind='archive' 透传，executeBackupOp 直接返回不重新采集。
 * 不能先清再读：会把当前刚开的 1 个标签覆盖成昨晚活档丢失昨晚 10 个标签。
 * 崩溃/断电后重启：昨晚活档还在 storage（已落盘持久），照样封存；即使封存失败也移到 pending 不丢。
 */
export async function archiveLiveOnStartup(): Promise<void> {
  // P0-1：入口置 true 防 archive 期间并发写（onStartup 触发后置 true，finally 置 false 放行）
  startupPhase = true
  try {
    // P0-2：优先封存上次启动 archive 失败遗留的 pending（不阻塞当前 live 封存）
    await archivePendingIfNeeded()

    const data = await chrome.storage.local.get(BACKUP_KEYS.live)
    const blob = sanitizeLiveBlob(data[BACKUP_KEYS.live])
    if (!blob) {
      console.info('[backup] onStartup 封存：无活档，跳过')
      return
    }
    const file = blob.snapshot
    // 完整性校验：必须有 snapshot + windows（M1 同款口径）
    if (!file.snapshot || !Array.isArray(file.snapshot.windows)) {
      console.warn('[backup] onStartup 封存：活档损坏，跳过并清理', file)
      await safeRemove(BACKUP_KEYS.live, "backup.live")
      return
    }
    // 克隆并生成新 uuid（活档哨兵 id 不能进 IndexedDB，会与下次活档冲突）
    const archived: BackupFile = toPure(file)
    archived.snapshot = { ...archived.snapshot, id: uuidV4() }
    // M3：走 coordination 统一收口（锁 + WAL + 审计 + persistSnapshot + trim + 广播）
    const r = await enqueueBackupOperation('backup', { kind: 'archive', file: archived })
    if (!r.ok) {
      // P0-2：封存失败 → 移活档到 livePendingArchive 保留待下次启动重试，再清 live 放行新会话写
      //   （不覆盖昨晚数据；昨晚数据在 livePendingArchive 里下次启动封存）
      console.warn('[backup] onStartup 封存：coordination 失败，移活档到 livePendingArchive 待下次重试', r.error)
      await moveToPendingArchive(blob)
      return
    }
    // 清活档（旧数据已封存）
    await safeRemove(BACKUP_KEYS.live, "backup.live")
    console.info(`[backup] onStartup 封存：已封存 ${archived.snapshot.stats.tabCount} 个标签的历史档`)
  } catch (e) {
    // P0-2：封存异常 → 同样移活档到 pending，避免 finally 覆盖昨晚活档
    console.warn('[backup] onStartup 封存异常，移活档到 livePendingArchive', e)
    try {
      const data = await chrome.storage.local.get(BACKUP_KEYS.live)
      const blob = sanitizeLiveBlob(data[BACKUP_KEYS.live])
      if (blob) await moveToPendingArchive(blob)
    } catch (e2) {
      console.warn('[backup] 移活档到 livePendingArchive 失败（昨晚活档可能仍留在 live）', e2)
    }
  } finally {
    // 放行活档写盘 + 触发新会话首份活档写（走 enqueueWrite 串行，与防抖写互斥）
    startupPhase = false
    void enqueueWrite(() => writeLiveSnapshot()).catch((e) =>
      console.warn('[backup] 封存后首份活档写入异常', e)
    )
  }
}

/**
 * P0-2：把当前 live blob 移到 livePendingArchive（保留待下次启动重试封存），再清 live。
 * 调用前应已确认 live 存在且有效。清 live 后 finally 的首份写不会覆盖昨晚数据（昨晚数据已在 pending）。
 */
async function moveToPendingArchive(blob: LiveBlob): Promise<void> {
  await safeSet({ [BACKUP_KEYS.livePendingArchive]: toPure(blob) }, "backup.livePendingArchive")
  await safeRemove(BACKUP_KEYS.live, "backup.live")
}

/**
 * P0-2：封存上次启动 archive 失败遗留的 livePendingArchive。
 * 成功则清 pending；失败则保留待下次启动（不阻塞当前 live 封存流程）。
 * 损坏的 pending 直接清理（不丢——本就是失败遗留，损坏无意义保留）。
 */
async function archivePendingIfNeeded(): Promise<void> {
  try {
    const data = await chrome.storage.local.get(BACKUP_KEYS.livePendingArchive)
    const blob = sanitizeLiveBlob(data[BACKUP_KEYS.livePendingArchive])
    if (!blob) return
    const file = blob.snapshot
    if (!file.snapshot || !Array.isArray(file.snapshot.windows)) {
      console.warn('[backup] pending archive 损坏，清理', file)
      await safeRemove(BACKUP_KEYS.livePendingArchive, "backup.livePendingArchive")
      return
    }
    const archived: BackupFile = toPure(file)
    archived.snapshot = { ...archived.snapshot, id: uuidV4() }
    const r = await enqueueBackupOperation('backup', { kind: 'archive', file: archived })
    if (r.ok) {
      await safeRemove(BACKUP_KEYS.livePendingArchive, "backup.livePendingArchive")
      console.info('[backup] pending archive 已封存（上次启动遗留）')
    } else {
      // 仍失败，保留 pending 待下次启动重试（不阻塞当前 live 封存）
      console.warn('[backup] pending archive 仍失败，保留待下次启动重试', r.error)
    }
  } catch (e) {
    console.warn('[backup] pending archive 异常，保留待下次启动重试', e)
  }
}

/**
 * SW 启动兜底：初始化开关缓存 + recovery alarm。
 *
 * P0-1（v3）：删除 2s startupPhase 兜底——startupPhase 默认 false，SW 运行中重启
 *   （非浏览器启动，onStartup 不触发）时 startupPhase 本就是 false，事件直接写不丢，
 *   不需要兜底放行。昨晚活档在 storage 里没被动，事件写的是当前刚开标签不会覆盖昨晚数据。
 *   仅 onStartup 触发时 archiveLiveOnStartup 入口置 true 防 archive 期间并发，finally 置 false。
 *
 * 监听器已在 background.ts 顶层同步注册（常驻，SW 重启时顶层重新注册），本函数不绑监听器。
 * 不立即写盘（避免与 onStartup archive 并发竞态，R4）——浏览器启动首份活档由 onStartup.finally 触发；
 *   SW 运行中重启时事件来了自然触发 scheduleLiveWrite（startupPhase=false 不拦）。
 */
export async function ensureLiveBackupStarted(): Promise<void> {
  const settings = await readBackupSettings()
  cachedEnabled = settings.listenBackupEnabled
  // 确保 recovery alarm 存在（SW 启动时 ensure，参考 alarms.md 官方建议：
  //   important alarms should be ensured each time SW starts）
  if (settings.listenBackupEnabled) {
    void chrome.alarms.create(LIVE_RECOVERY_ALARM_NAME, { periodInMinutes: LIVE_RECOVERY_ALARM_MIN })
  }
}

/**
 * 注册 settings storage.onChanged 监听：用户在 UI 切「自动监听备份」开关时，
 * SW 立即 start/stop 活档监听（不必等下次事件或 SW 重启）。
 * 同步更新 cachedEnabled（避免开关切换后缓存过期）。
 * 幂等（controllerBound 守护），由 background.ts SW 启动时调一次。
 */
let controllerBound = false
export function initLiveBackupController(): void {
  if (controllerBound) return
  controllerBound = true
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return
    const change = changes[BACKUP_KEYS.settings]
    if (!change) return
    const oldVal = sanitizeSettings(change.oldValue).listenBackupEnabled
    const newVal = sanitizeSettings(change.newValue).listenBackupEnabled
    // 同步更新开关缓存（无论是否变化，确保缓存与持久化一致）
    cachedEnabled = newVal
    if (oldVal === newVal) return
    // OFF → ON：立即开启（写首份活档）
    // ON → OFF：停止（不再防抖写入；清活档+闹钟+dirty）
    if (newVal) {
      void startLiveBackup()
    } else {
      stopLiveBackup()
    }
  })
}
