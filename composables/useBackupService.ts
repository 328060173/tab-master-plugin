/**
 * 标签会话备份服务（单例）- 阶段一完整本地闭环。
 * 范围：设置/状态/缓存持久化 + 手动/定时(alarms)/事件触发备份 + 用户目录(File System Access)+双写降级
 *   + 纯条数 FIFO 保留（trimExpired + trimToMax）+ 首次5条告知 + 本地占用统计。
 * 守红线：独立单例不侵入 useTabManager；只读老 key；写 storage 走 safeSet+toPure；不调 setTabValue；
 *   chrome.tabs.query({}) 全量；定时器用 alarms；监听器初始化注册一次。
 * 恢复/冲突/导入导出 在 useBackupRestore / useBackupIO（基于本单例 cache）。
 */

import { ref, computed } from "vue"
import { safeSet, safeRemove } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import { isDev } from "~lib/env"
import { computeFingerprint, computeWeakFingerprint } from "~lib/backup/fingerprint"
import { getDeviceId, applyTimer as applyTimerFn, refreshNextBackupTime as refreshNextBackupTimeFn } from "~lib/backup/timer"
import { runBackupPipeline, type RunPipelineOptions } from "~lib/backup/pipeline"
import { tryAcquireCoord, releaseCoord, runBackupWithCoordination } from "~lib/backup/coordination"
import { uuidV4 } from "~lib/backup/fingerprint"
import {
  saveSettings as saveSettingsFn,
  saveState as saveStateFn,
  saveDirMeta as saveDirMetaFn,
  saveNoticeAcked as saveNoticeAckedFn,
  saveUndo as saveUndoFn,
} from "~lib/backup/persist"
import { loadAll as loadAllFn } from "~lib/backup/loader"
import {
  deleteSnapshot as deleteSnapshotFn,
  setSnapshotLabel as setSnapshotLabelFn,
  getSnapshotFile as getSnapshotFileFn,
  appendImportedSnapshot as appendImportedSnapshotFn,
} from "~lib/backup/snapshotMgmt"
import { listSnapshotSummaries } from "~lib/backup/snapshotStore"
import {
  isFsAccessSupported,
} from "~lib/backup/fsAccess"
import {
  checkDirPermission as doCheckDirPermission,
  pickDir as doPickDir,
  reauthorizeDir as doReauthorizeDir,
  unbindDir as doUnbindDir,
  refreshDirSize as doRefreshDirSize,
  writeSnapshotToDirSafe as doWriteSnapshotToDirSafe,
  getCacheBytesInUse as doGetCacheBytesInUse,
} from "~lib/backup/dirOps"
import {
  BACKUP_KEYS,
  BACKUP_ALARM_NAME,
  DEFAULT_BACKUP_SETTINGS,
  DEFAULT_BACKUP_STATE,
  DEFAULT_BACKUP_DIR_META,
  DEFAULT_BACKUP_NOTICE_ACKED,
  DEFAULT_BACKUP_UNDO,
  LIVE_SNAPSHOT_ID,
  type BackupFile,
  type BackupSettings,
  type BackupState,
  type BackupDirMeta,
  type BackupUndo,
  type BackupTriggerSource,
  type SnapshotSummary,
} from "~types/backup"
import {
  sanitizeSettings,
  sanitizeState,
  sanitizeDirMeta,
  sanitizeNoticeAcked,
  sanitizeLiveBlob,
  toSummary,
} from "~lib/backup/sanitize"
const DIR_SCAN_CACHE_MS = 60_000

let _instance: ReturnType<typeof useBackupServiceImpl> | null = null

function useBackupServiceImpl() {
  const settings = ref<BackupSettings>({ ...DEFAULT_BACKUP_SETTINGS })
  const state = ref<BackupState>({ ...DEFAULT_BACKUP_STATE })
  const snapshots = ref<SnapshotSummary[]>([])
  const dirMeta = ref<BackupDirMeta>({ ...DEFAULT_BACKUP_DIR_META, permission: isFsAccessSupported() ? "prompt" : "unsupported" })
  const noticeAcked = ref<boolean>(DEFAULT_BACKUP_NOTICE_ACKED)
  /** backup.html 首次引导是否已阅（点过「知道了」=true） */
  const firstVisitAcked = ref<boolean>(false)
  const undo = ref<BackupUndo>({ ...DEFAULT_BACKUP_UNDO })
  const isBackingUp = ref(false)
  const lastProgress = ref("")
  /** 计算下次定时备份时间（用于 UI 显示） */
  const nextBackupAt = ref<number | null>(null)

  const enabled = computed(() => settings.value.enabled)
  const fsSupported = computed(() => isFsAccessSupported())
  /** 活档摘要（storage.local 独立 key，不进 IndexedDB 列表；UI 列表前置显示「实时」条目） */
  const liveSnapshot = ref<SnapshotSummary | null>(null)

  /** 读活档并刷新 liveSnapshot ref（活档变更/启动时调）。
   *  P0-3 v3：活档存 LiveBlob{snapshot, dirty, updatedAt}，从 blob.snapshot 取 BackupFile。
   *  sanitizeLiveBlob 兼容旧形态（直接 BackupFile 无包裹），迁移期老用户活档也能读。 */
  async function refreshLiveSnapshot(): Promise<void> {
    try {
      const data = await chrome.storage.local.get(BACKUP_KEYS.live)
      const blob = sanitizeLiveBlob(data[BACKUP_KEYS.live])
      if (!blob) {
        liveSnapshot.value = null
        return
      }
      const file = blob.snapshot
      if (!file.snapshot || !Array.isArray(file.snapshot.windows)) {
        liveSnapshot.value = null
        return
      }
      liveSnapshot.value = toSummary(file)
    } catch (e) {
      console.warn("[useBackupService] 读活档失败", e)
    }
  }

  // loadAll 委托给 lib/backup/loader.ts（拆文件控行数）
  async function loadAll() {
    await loadAllFn({
      settings, state, snapshots, dirMeta, noticeAcked, firstVisitAcked, undo,
      refreshNextBackupTime, checkDirPermission,
    })
    // 活档与 IndexedDB 快照独立存储，加载时一并刷新
    await refreshLiveSnapshot()
  }

  // saveXxx 委托给 lib/backup/persist.ts（拆文件控行数）
  async function saveSettings() { await saveSettingsFn(settings) }
  async function saveState() { await saveStateFn(state) }
  async function saveDirMeta() { await saveDirMetaFn(dirMeta) }
  async function saveNoticeAcked() { await saveNoticeAckedFn(noticeAcked) }
  async function saveUndo() { await saveUndoFn(undo) }
  // deviceId / 定时器 / 下次备份时间 委托给 lib/backup/timer.ts（拆文件控行数）
  async function applyTimer() { await applyTimerFn(settings, nextBackupAt) }
  async function refreshNextBackupTime() { await refreshNextBackupTimeFn(nextBackupAt) }

  // ===== 设置变更 =====
  async function setEnabled(v: boolean) {
    settings.value.enabled = v
    await saveSettings()
    await applyTimer()
  }
  async function updateSettings(patch: Partial<BackupSettings>) {
    Object.assign(settings.value, patch)
    await saveSettings()
    if ("timerMinutes" in patch || "enabled" in patch) {
      await applyTimer()
    }
    // 2026-07-30 重构：自动监听备份由 SW 端 liveSnapshot.ts 负责——settings 写入
    //   storage.local 后，SW 的 storage.onChanged 监听（initLiveBackupController）
    //   自动 start/stop 活档监听，UI 侧无需 rebind。
  }
  /** 标记首次开启知悉已确认（设计稿 §4.2：单 bool，开启过=true 不再弹） */
  async function setNoticeAcked(v: boolean) {
    noticeAcked.value = v
    await saveNoticeAcked()
  }
  async function resetNoticeAck() {
    noticeAcked.value = DEFAULT_BACKUP_NOTICE_ACKED
    await saveNoticeAcked()
  }
  /** 标记 backup.html 首次引导已阅（点「知道了」=true，以后不再显示引导块） */
  async function setFirstVisitAcked(v: boolean) {
    firstVisitAcked.value = v
    try {
      await safeSet({ [BACKUP_KEYS.firstVisitAcked]: v }, "backup")
    } catch (e) {
      console.warn("[useBackupService] 保存 firstVisitAcked 失败", e)
    }
  }

  // 2026-07-30 重构：自动监听备份（活档持续落盘 + onStartup 封存）由 SW 端
  //   liveSnapshot.ts 负责，UI 侧通过 storage.onChanged + backup:changed 消息刷新
  //   liveSnapshot ref。定时备份仍走 chrome.alarms → background.ts triggerTimerBackup
  //   → enqueueBackupOperation → runSwBareBackup（IndexedDB 快照）。

  // ===== 用户目录权限（委托给 lib/backup/dirOps.ts）=====
  async function checkDirPermission() {
    await doCheckDirPermission(dirMeta, settings.value.dirEnabled, saveDirMeta)
  }

  async function pickDir(): Promise<{ ok: boolean; error?: string }> {
    return doPickDir(dirMeta, saveDirMeta)
  }

  /** 用户手势触发：重新授权 */
  async function reauthorizeDir(): Promise<{ ok: boolean; error?: string }> {
    return doReauthorizeDir(dirMeta, saveDirMeta)
  }

  async function unbindDir() {
    await doUnbindDir(dirMeta, saveDirMeta)
    settings.value.dirEnabled = false
    await saveSettings()
  }

  // ===== 目录大小扫描（缓存 60s）=====
  async function refreshDirSize(force = false): Promise<void> {
    await doRefreshDirSize(dirMeta, saveDirMeta, force)
  }

  // ===== 缓存大小（getBytesInUse Chrome 136+，降级估算）=====
  async function getCacheBytesInUse(): Promise<number> {
    return doGetCacheBytesInUse(BACKUP_KEYS.cache)
  }

  // ===== 写快照到目录（双写降级）=====
  async function writeSnapshotToDirSafe(file: BackupFile): Promise<{ ok: boolean; error?: string }> {
    return doWriteSnapshotToDirSafe(dirMeta, saveDirMeta, file)
  }

  // ===== 备份执行（委托给 lib/backup/pipeline.ts）=====
  async function runBackup(
    source: BackupTriggerSource,
    options?: RunPipelineOptions,
  ): Promise<{ ok: boolean; error?: string; snapshot?: SnapshotSummary }> {
    // P0-4: 走 coordination 统一入口（内部 tryAcquire/release + WAL + checksum + 审计 + 广播）
    const r = await runBackupWithCoordination(
      "backup",
      { kind: source === "manual" ? "manual-backup" : "auto-backup", source },
      async (_op, _payload, _traceId) => {
        const pr = await runBackupPipeline(
          { settings, state, snapshots, isBackingUp, lastProgress, saveState, writeSnapshotToDirSafe, getCacheBytesInUse, getDeviceId },
          source, options,
        )
        // execute 必须返回 BackupFile（pr.file）给 coordination 持久化（persistSnapshot 期望 BackupFile，
        // 内部访问 file.snapshot 算 checksum）。返回 pr.snapshot（SnapshotSummary）会导致
        // persistSnapshot 把 Summary 当 BackupFile 处理 → crypto.subtle.digest 抛 TypeError → 备份失败。
        return { ok: pr.ok, error: pr.error, snapshot: pr.file }
      }
    )
    if (r.ok && isDev) console.debug("[useBackupService] 备份完成", { source })
    // coordination 持久化后 r.snapshot 是 BackupFile；UI 调用方期望 SnapshotSummary（读 .stats.tabCount），
    // 这里转一下，避免每个调用方自己转。
    const file = r.snapshot as BackupFile | undefined
    return { ok: r.ok, error: r.error, snapshot: file ? toSummary(file) : undefined }
  }

  /** 手动备份（sidepanel/options 调）。§10.8：可传 selectedTabIds 只备份勾选的标签；不传则全量。 */
  async function runManualBackup(options?: RunPipelineOptions) {
    return runBackup("manual", options)
  }

  /** 启动备份（chrome.runtime.onStartup 时由 background 触发） */
  async function runStartupBackup() {
    return runBackup("auto.event.startup")
  }

  // ===== 快照管理（委托给 lib/backup/snapshotMgmt.ts）=====
  function snapshotMgmtDeps() {
    return {
      settings,
      state,
      snapshots,
      saveState,
      getCacheBytesInUse,
    }
  }

  /**
   * 软删快照（P1-1）：删前把完整快照存到 undo.deletedSnapshot，30s 内可撤销。
   * P0-4: 加协调锁防并发写。
   */
  async function deleteSnapshot(id: string): Promise<boolean> {
    const traceId = uuidV4()
    if (!(await tryAcquireCoord(traceId))) return false
    try {
      const file = await getSnapshotFile(id)
      if (!file) return false
      undo.value = {
        preRestoreSnapshot: undo.value.preRestoreSnapshot,
        deletedSnapshot: file,
        createdAt: Date.now(),
      }
      await safeSet({ [BACKUP_KEYS.undo]: toPure(undo.value) }, "backup.delete")
      scheduleUndoExpiry()
      return deleteSnapshotFn(snapshotMgmtDeps(), id)
    } finally {
      await releaseCoord()
    }
  }

  /** 撤销删除（P1-1）：把软删的快照加回 IndexedDB */
  async function undoDelete(): Promise<boolean> {
    const file = undo.value.deletedSnapshot
    if (!file) return false
    try {
      // 已在 IndexedDB 的不重复加回
      const existing = await getSnapshotFile(file.snapshot.id)
      if (existing) {
        undo.value = { preRestoreSnapshot: undo.value.preRestoreSnapshot, deletedSnapshot: null, createdAt: null }
        await safeSet({ [BACKUP_KEYS.undo]: toPure(undo.value) }, "backup.undoDelete")
        return true
      }
      await appendImportedSnapshotFn(snapshotMgmtDeps(), file)
      undo.value = { preRestoreSnapshot: undo.value.preRestoreSnapshot, deletedSnapshot: null, createdAt: null }
      await safeSet({ [BACKUP_KEYS.undo]: toPure(undo.value) }, "backup.undoDelete")
      return true
    } catch (e) {
      console.warn("[useBackupService] undoDelete 失败", e)
      return false
    }
  }

  /** 30s 后自动清 undo（软删/恢复撤销窗口） */
  let undoExpiryTimer: ReturnType<typeof setTimeout> | null = null
  function scheduleUndoExpiry() {
    if (undoExpiryTimer) clearTimeout(undoExpiryTimer)
    undoExpiryTimer = setTimeout(() => {
      undo.value = { ...DEFAULT_BACKUP_UNDO }
      void safeRemove(BACKUP_KEYS.undo, "backup.undoExpiry")
      undoExpiryTimer = null
    }, 30_000)
  }

  async function setSnapshotLabel(id: string, label: string | null): Promise<boolean> {
    return setSnapshotLabelFn(snapshotMgmtDeps(), id, label)
  }

  /**
   * 获取完整快照（恢复/导出用）。活档（id=LIVE_SNAPSHOT_ID）读 storage.local，其余读 IndexedDB。
   * M1：活档读取做完整性校验（snapshot + windows 数组），损坏数据返回 null 不进恢复流程炸 UI。
   *   参照 archiveLiveOnStartup 的校验口径。
   * P0-3 v3：活档存 LiveBlob{snapshot, dirty, updatedAt}，从 blob.snapshot 取 BackupFile。
   *   sanitizeLiveBlob 兼容旧形态（直接 BackupFile 无包裹），迁移期老用户活档也能恢复。
   */
  async function getSnapshotFile(id: string): Promise<BackupFile | null> {
    if (id === LIVE_SNAPSHOT_ID) {
      const data = await chrome.storage.local.get(BACKUP_KEYS.live)
      const blob = sanitizeLiveBlob(data[BACKUP_KEYS.live])
      if (!blob) return null
      const file = blob.snapshot
      // 完整性校验：必须有 snapshot + windows 数组（与 archiveLiveOnStartup 同款口径）
      if (!file.snapshot || !Array.isArray(file.snapshot.windows)) {
        console.warn('[backup] 活档损坏（snapshot/windows 缺失），无法恢复', file)
        return null
      }
      return file
    }
    return getSnapshotFileFn(id)
  }

  /** 写入外部导入的快照到缓存（导入后供恢复流程用） */
  async function appendImportedSnapshot(file: BackupFile): Promise<void> {
    const traceId = uuidV4()
    if (!(await tryAcquireCoord(traceId))) return
    try { await appendImportedSnapshotFn(snapshotMgmtDeps(), file) }
    finally { await releaseCoord() }
  }

  // ===== 撤销恢复（30s 窗口）=====
  async function setUndoSnapshot(file: BackupFile) {
    // 保留 deletedSnapshot（软删撤销窗口），只覆盖 preRestoreSnapshot
    undo.value = { preRestoreSnapshot: file, deletedSnapshot: undo.value.deletedSnapshot, createdAt: Date.now() }
    await saveUndo()
    scheduleUndoExpiry()
  }
  async function clearUndo() {
    // 只清 preRestoreSnapshot，保留 deletedSnapshot（软删撤销独立）
    undo.value = { preRestoreSnapshot: null, deletedSnapshot: undo.value.deletedSnapshot, createdAt: null }
    if (!undo.value.deletedSnapshot) {
      await safeRemove(BACKUP_KEYS.undo, "backup")
    } else {
      await saveUndo()
    }
  }

  // ===== 重置/清除所有备份（破坏性，由 UI 二次确认把关）=====
  async function clearAllBackups(): Promise<boolean> {
    const traceId = uuidV4()
    if (!(await tryAcquireCoord(traceId))) return false
    try {
      // 清空 IndexedDB 快照（P0-4 L2）
      const { clearAllSnapshots } = await import("~lib/backup/snapshotStore")
      await clearAllSnapshots()
      // 清 storage.local 元信息（state/undo/dirMeta/noticeAcked；cache 已废弃不动）
      // P0-2 v3：一并清活档 + 待封存活档（livePendingArchive）；liveDirty 已废弃（dirty 合并到 LiveBlob）
      await safeRemove([BACKUP_KEYS.state, BACKUP_KEYS.undo, BACKUP_KEYS.dirMeta, BACKUP_KEYS.noticeAcked, BACKUP_KEYS.noticeAck, BACKUP_KEYS.firstVisitAcked, BACKUP_KEYS.live, BACKUP_KEYS.livePendingArchive], "backup")
      await safeSet({ [BACKUP_KEYS.state]: toPure(DEFAULT_BACKUP_STATE) }, "backup")
      snapshots.value = []
      liveSnapshot.value = null
      state.value = { ...DEFAULT_BACKUP_STATE }
      undo.value = { ...DEFAULT_BACKUP_UNDO }
      noticeAcked.value = DEFAULT_BACKUP_NOTICE_ACKED
      dirMeta.value = { ...DEFAULT_BACKUP_DIR_META, permission: isFsAccessSupported() ? "prompt" : "unsupported" }
      await doUnbindDir()
      return true
    } catch (e) {
      console.warn("[useBackupService] clearAllBackups 失败", e)
      return false
    } finally {
      await releaseCoord()
    }
  }

  // ===== 监听 storage 变化（跨页同步，仅元信息；快照走 backup:changed 消息）=====
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return
    if (changes[BACKUP_KEYS.settings]) {
      settings.value = sanitizeSettings(changes[BACKUP_KEYS.settings].newValue)
    }
    if (changes[BACKUP_KEYS.state]) {
      state.value = sanitizeState(changes[BACKUP_KEYS.state].newValue)
    }
    if (changes[BACKUP_KEYS.dirMeta]) {
      dirMeta.value = sanitizeDirMeta(changes[BACKUP_KEYS.dirMeta].newValue)
    }
    if (changes[BACKUP_KEYS.noticeAcked]) {
      noticeAcked.value = sanitizeNoticeAcked(changes[BACKUP_KEYS.noticeAcked].newValue)
    }
    if (changes[BACKUP_KEYS.undo]) {
      const v = changes[BACKUP_KEYS.undo].newValue
      undo.value = (v && typeof v === "object" ? v : DEFAULT_BACKUP_UNDO) as BackupUndo
    }
    // 活档变更（SW 写入/封存清空）→ 刷新 liveSnapshot ref
    if (changes[BACKUP_KEYS.live]) {
      void refreshLiveSnapshot()
    }
  })

  // ===== 监听 chrome.alarms.onAlarm（UI 侧兜底；SW 侧 background.ts 也监听）
  // 注意：alarms 在 SW 触发，UI 侧不一定收到。但定时备份逻辑主要在 background.ts 调用本服务的方法。
  // 这里仅做 nextBackupAt 刷新
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === BACKUP_ALARM_NAME) {
      void refreshNextBackupTime()
    }
  })

  // ===== 监听 background.ts 广播的 backup:done / backup:changed 消息 =====
  // 设计：
  // - backup:done：SW 裸备份完成后通知 UI 刷新 nextBackupAt（state 已走 storage.onChanged 同步）
  // - backup:changed：IndexedDB 快照变更（备份/删除/导入后 SW 广播）→ UI 重新读 IndexedDB 摘要列表
  //   （IndexedDB 不触发 storage.onChanged，必须靠 runtime 消息广播刷新 snapshots ref）
  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || typeof msg !== "object" || Array.isArray(msg)) return
    const m = msg as { type?: string }
    if (m.type === "backup:done") {
      void refreshNextBackupTime()
      return
    }
    if (m.type === "backup:changed") {
      // 从 IndexedDB 重新加载快照摘要（IndexedDB 写后 storage.onChanged 不触发）
      void listSnapshotSummaries().then((list) => {
        snapshots.value = list
        // 同步 state.snapshotCount（防漂移）
        if (state.value.snapshotCount !== list.length) {
          state.value.snapshotCount = list.length
        }
      }).catch(() => {})
      // 活档变更（op=live 写入 / op=archive 封存清空）→ 刷新活档摘要
      void refreshLiveSnapshot()
      void refreshNextBackupTime()
      return
    }
    // M2：活档写入配额超限等错误（SW 广播）→ state.lastBackupError 已通过 storage.onChanged 同步，
    //   这里无需额外处理（amber 状态条会显示提示）。保留分支防 fallback warn。
    if (m.type === "backup:live-error") {
      return
    }
  })

  // ===== 初始化 =====
  loadAll()
  // 事件监听已搬 SW（background.ts），本侧通过 chrome.runtime.onMessage 收 backup:event

  return {
    // 状态
    settings,
    state,
    snapshots,
    liveSnapshot,
    dirMeta,
    noticeAcked,
    firstVisitAcked,
    undo,
    isBackingUp,
    lastProgress,
    nextBackupAt,
    enabled,
    fsSupported,
    // 加载/设置
    loadAll,
    setEnabled,
    updateSettings,
    setNoticeAcked,
    setFirstVisitAcked,
    resetNoticeAck,
    // 备份
    runManualBackup,
    runBackup,
    runStartupBackup,
    applyTimer,
    // 快照管理
    deleteSnapshot,
    setSnapshotLabel,
    getSnapshotFile,
    appendImportedSnapshot,
    // 目录
    pickDir,
    reauthorizeDir,
    unbindDir,
    checkDirPermission,
    refreshDirSize,
    getCacheBytesInUse,
    // 撤销
    setUndoSnapshot,
    clearUndo,
    undoDelete,
    // 重置
    clearAllBackups,
    // 指纹工具（供恢复流程复用）
    computeFingerprint,
    computeWeakFingerprint,
  }
}

export function useBackupService() {
  if (!_instance) {
    _instance = useBackupServiceImpl()
  }
  return _instance
}
