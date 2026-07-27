/**
 * 标签会话备份服务（单例）- 阶段一完整本地闭环。
 * 范围：设置/状态/缓存持久化 + 手动/定时(alarms)/事件触发备份 + 用户目录(File System Access)+双写降级
 *   + GFS 分层保留 + 首次5条告知 + 本地占用统计。
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
  toggleLock as toggleLockFn,
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
  toSummary,
} from "~lib/backup/sanitize"
const DEBOUNCE_EVENT_MS = 2000
const DIR_SCAN_CACHE_MS = 60_000

let _instance: ReturnType<typeof useBackupServiceImpl> | null = null

function useBackupServiceImpl() {
  const settings = ref<BackupSettings>({ ...DEFAULT_BACKUP_SETTINGS })
  const state = ref<BackupState>({ ...DEFAULT_BACKUP_STATE })
  const snapshots = ref<SnapshotSummary[]>([])
  const dirMeta = ref<BackupDirMeta>({ ...DEFAULT_BACKUP_DIR_META, permission: isFsAccessSupported() ? "prompt" : "unsupported" })
  const noticeAcked = ref<boolean>(DEFAULT_BACKUP_NOTICE_ACKED)
  const undo = ref<BackupUndo>({ ...DEFAULT_BACKUP_UNDO })
  const isBackingUp = ref(false)
  const lastProgress = ref("")
  /** 计算下次定时备份时间（用于 UI 显示） */
  const nextBackupAt = ref<number | null>(null)

  const enabled = computed(() => settings.value.enabled)
  const fsSupported = computed(() => isFsAccessSupported())

  // loadAll 委托给 lib/backup/loader.ts（拆文件控行数）
  async function loadAll() {
    await loadAllFn({
      settings, state, snapshots, dirMeta, noticeAcked, undo,
      refreshNextBackupTime, checkDirPermission,
    })
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
    // idle 开关变化时重新 bind/unbind 监听器（修 P0-7）
    if ("eventOnIdle" in patch) {
      rebindIdleListener()
    }
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

  // ===== 事件备份（防抖 2s）=====
  let eventBackupTimer: ReturnType<typeof setTimeout> | null = null
  function scheduleEventBackup(source: BackupTriggerSource) {
    if (!settings.value.enabled) return
    if (eventBackupTimer) clearTimeout(eventBackupTimer)
    eventBackupTimer = setTimeout(() => {
      eventBackupTimer = null
      void runBackup(source).catch(() => {})
    }, DEBOUNCE_EVENT_MS)
  }

  // idle 监听器命名引用（可 remove + 重新 bind，修 P0-7：开关 idle 后事件不触发）
  let idleListener: ((state: chrome.idle.IdleState) => void) | null = null

  /** 重新 bind/unbind idle 监听器（开关变化时调） */
  function rebindIdleListener() {
    if (typeof chrome.idle === "undefined") return
    // 先解绑旧的（避免叠加）
    if (idleListener) {
      try {
        chrome.idle.onStateChanged.removeListener(idleListener)
      } catch {}
      idleListener = null
    }
    // 按当前设置决定是否重新绑定
    if (settings.value.eventOnIdle) {
      idleListener = (s) => {
        if (s === "idle") scheduleEventBackup("auto.event.idle")
      }
      try {
        chrome.idle.onStateChanged.addListener(idleListener)
      } catch {}
    }
  }

  function bindEventListeners() {
    try {
      chrome.tabs.onRemoved.addListener(() => {
        if (settings.value.eventOnTabRemoved) scheduleEventBackup("auto.event.tabRemoved")
      })
      chrome.windows.onRemoved.addListener(() => {
        if (settings.value.eventOnWindowRemoved) scheduleEventBackup("auto.event.windowRemoved")
      })
      // idle 监听（可选权限，按需启用；开关变化时走 rebindIdleListener 重新 bind）
      rebindIdleListener()
    } catch (e) {
      console.warn("[useBackupService] bindEventListeners 失败", e)
    }
  }

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

  async function toggleLock(id: string, locked: boolean, reason?: string): Promise<boolean> {
    const traceId = uuidV4()
    if (!(await tryAcquireCoord(traceId))) return false
    try { return await toggleLockFn(snapshotMgmtDeps(), id, locked, reason) }
    finally { await releaseCoord() }
  }

  async function setSnapshotLabel(id: string, label: string | null): Promise<boolean> {
    return setSnapshotLabelFn(snapshotMgmtDeps(), id, label)
  }

  /** 获取完整快照（恢复/导出用） */
  async function getSnapshotFile(id: string): Promise<BackupFile | null> {
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
      await safeRemove([BACKUP_KEYS.state, BACKUP_KEYS.undo, BACKUP_KEYS.dirMeta, BACKUP_KEYS.noticeAcked, BACKUP_KEYS.noticeAck], "backup")
      await safeSet({ [BACKUP_KEYS.state]: toPure(DEFAULT_BACKUP_STATE) }, "backup")
      snapshots.value = []
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
      void refreshNextBackupTime()
    }
  })

  // ===== 初始化 =====
  loadAll()
  bindEventListeners()

  return {
    // 状态
    settings,
    state,
    snapshots,
    dirMeta,
    noticeAcked,
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
    resetNoticeAck,
    // 备份
    runManualBackup,
    runBackup,
    runStartupBackup,
    applyTimer,
    // 快照管理
    deleteSnapshot,
    toggleLock,
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
