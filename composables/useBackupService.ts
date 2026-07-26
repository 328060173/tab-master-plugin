/**
 * 标签会话备份服务（单例）- 阶段一完整本地闭环
 *
 * 范围：
 * - 设置/状态/缓存/快照列表 持久化
 * - 手动备份 + 定时备份（chrome.alarms） + 事件触发（onRemoved/onWindowRemoved/idle）
 * - 用户目录备份（File System Access API）+ 权限失效检测 + 双写降级
 * - GFS 分层保留 + 快照锁定
 * - 首次开启 5 条限制告知确认状态
 * - 本地占用统计（storage.local.getBytesInUse + 目录扫描缓存 60s）
 *
 * 守红线：
 * - 独立单例，不侵入 useTabManager
 * - 只读老 key（customTags/tabTagsMap/laterTabs/recentlyClosed/tabGroups/tabMasterSettings），不改老 key
 * - 所有写 storage 走 safeSet + toPure
 * - 不调 chrome.sessions.setTabValue（Chrome 不存在）
 * - chrome.tabs.query({}) 全量所有窗口，不经过 sidepanel filteredTabs
 * - 定时器用 chrome.alarms（MV3 SW 重启不丢）
 * - 监听器在单例初始化时注册一次（不在 onMounted/onUnmounted，避免永久丢失）
 *
 * 恢复/冲突解决/导入导出 逻辑在 useBackupRestore / useBackupIO（同样基于本单例的 cache）
 */

import { ref, computed } from "vue"
import { safeSet, safeRemove } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import { isDev } from "~lib/env"
import { APP_VERSION_CODE, APP_VERSION_NAME } from "~lib/api-config"
import { uuidV4, computeFingerprint, computeWeakFingerprint } from "~lib/backup/fingerprint"
import { runBackupPipeline } from "~lib/backup/pipeline"
import { acquireBackupLock, releaseBackupLock } from "~lib/backup/lock"
import {
  deleteSnapshot as deleteSnapshotFn,
  toggleLock as toggleLockFn,
  setSnapshotLabel as setSnapshotLabelFn,
  getSnapshotFile as getSnapshotFileFn,
  appendImportedSnapshot as appendImportedSnapshotFn,
} from "~lib/backup/snapshotMgmt"
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
  DEFAULT_BACKUP_NOTICE_ACK,
  DEFAULT_BACKUP_UNDO,
  type BackupFile,
  type BackupSettings,
  type BackupState,
  type BackupDirMeta,
  type BackupNoticeAck,
  type BackupUndo,
  type BackupTriggerSource,
  type SnapshotSummary,
} from "~types/backup"
import {
  sanitizeSettings,
  sanitizeState,
  sanitizeDirMeta,
  sanitizeNoticeAck,
  sanitizeSnapshotList,
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
  const noticeAck = ref<BackupNoticeAck>({ ...DEFAULT_BACKUP_NOTICE_ACK })
  const undo = ref<BackupUndo>({ ...DEFAULT_BACKUP_UNDO })
  const isBackingUp = ref(false)
  const lastProgress = ref("")
  /** 计算下次定时备份时间（用于 UI 显示） */
  const nextBackupAt = ref<number | null>(null)

  const enabled = computed(() => settings.value.enabled)
  const fsSupported = computed(() => isFsAccessSupported())

  async function loadAll() {
    try {
      const data = await chrome.storage.local.get([
        BACKUP_KEYS.settings,
        BACKUP_KEYS.state,
        BACKUP_KEYS.cache,
        BACKUP_KEYS.deviceId,
        BACKUP_KEYS.dirMeta,
        BACKUP_KEYS.noticeAck,
        BACKUP_KEYS.undo,
      ])
      settings.value = sanitizeSettings(data[BACKUP_KEYS.settings])
      state.value = sanitizeState(data[BACKUP_KEYS.state])
      const list = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
      snapshots.value = list.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
      dirMeta.value = sanitizeDirMeta(data[BACKUP_KEYS.dirMeta])
      noticeAck.value = sanitizeNoticeAck(data[BACKUP_KEYS.noticeAck])
      undo.value = (data[BACKUP_KEYS.undo] && typeof data[BACKUP_KEYS.undo] === "object"
        ? data[BACKUP_KEYS.undo] : DEFAULT_BACKUP_UNDO) as BackupUndo
      // 撤销窗口 30s 过期清理
      if (undo.value.createdAt && Date.now() - undo.value.createdAt > 30_000) {
        undo.value = { ...DEFAULT_BACKUP_UNDO }
        await safeRemove(BACKUP_KEYS.undo, "backup")
      }
      if (typeof data[BACKUP_KEYS.deviceId] !== "string" || !data[BACKUP_KEYS.deviceId]) {
        await safeSet({ [BACKUP_KEYS.deviceId]: uuidV4() }, "backup")
      }
      // 计算下次定时备份时间
      await refreshNextBackupTime()
      // 检查目录权限
      await checkDirPermission()
    } catch (e) {
      console.warn("[useBackupService] loadAll 失败", e)
    }
  }

  async function saveSettings() {
    await safeSet({ [BACKUP_KEYS.settings]: toPure(settings.value) }, "backup")
  }
  async function saveState() {
    await safeSet({ [BACKUP_KEYS.state]: toPure(state.value) }, "backup")
  }
  async function saveCache(list: BackupFile[]) {
    await safeSet({ [BACKUP_KEYS.cache]: toPure(list) }, "backup")
  }
  async function saveDirMeta() {
    await safeSet({ [BACKUP_KEYS.dirMeta]: toPure(dirMeta.value) }, "backup")
  }
  async function saveNoticeAck() {
    await safeSet({ [BACKUP_KEYS.noticeAck]: toPure(noticeAck.value) }, "backup")
  }
  async function saveUndo() {
    if (undo.value.preRestoreSnapshot) {
      await safeSet({ [BACKUP_KEYS.undo]: toPure(undo.value) }, "backup")
    } else {
      await safeRemove(BACKUP_KEYS.undo, "backup")
    }
  }
  async function getDeviceId(): Promise<string> {
    const data = await chrome.storage.local.get(BACKUP_KEYS.deviceId)
    const existing = data[BACKUP_KEYS.deviceId]
    if (typeof existing === "string" && existing) return existing
    const id = uuidV4()
    await safeSet({ [BACKUP_KEYS.deviceId]: id }, "backup")
    return id
  }

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
  async function setNoticeAck(items: boolean[]) {
    noticeAck.value = { items: items.slice(0, 5), ackedAt: Date.now() }
    await saveNoticeAck()
  }
  async function resetNoticeAck() {
    noticeAck.value = { ...DEFAULT_BACKUP_NOTICE_ACK }
    await saveNoticeAck()
  }

  // ===== 定时备份（chrome.alarms）=====
  async function applyTimer() {
    try {
      const existing = await chrome.alarms.get(BACKUP_ALARM_NAME)
      if (!settings.value.enabled || settings.value.timerMinutes <= 0) {
        if (existing) await chrome.alarms.clear(BACKUP_ALARM_NAME)
        nextBackupAt.value = null
        return
      }
      const periodMin = settings.value.timerMinutes
      // 已存在且周期相同 → 不重设（避免重启时重置）
      if (existing && existing.periodInMinutes === periodMin) {
        nextBackupAt.value = existing.scheduledTime
        return
      }
      await chrome.alarms.create(BACKUP_ALARM_NAME, {
        periodInMinutes: periodMin,
        // 立即触发一次的延迟 0（避免新建后等一个周期）
        delayInMinutes: periodMin,
      })
      const fresh = await chrome.alarms.get(BACKUP_ALARM_NAME)
      nextBackupAt.value = fresh?.scheduledTime ?? null
    } catch (e) {
      console.warn("[useBackupService] applyTimer 失败", e)
    }
  }

  async function refreshNextBackupTime() {
    try {
      const a = await chrome.alarms.get(BACKUP_ALARM_NAME)
      nextBackupAt.value = a?.scheduledTime ?? null
    } catch {
      nextBackupAt.value = null
    }
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
    source: BackupTriggerSource
  ): Promise<{ ok: boolean; error?: string; snapshot?: SnapshotSummary }> {
    // 锁协调：防 UI 与 SW 裸备份路径同时执行（5min TTL 防死锁）
    const gotLock = await acquireBackupLock()
    if (!gotLock) {
      return { ok: false, error: "正在备份中（锁被占用）" }
    }
    try {
      const r = await runBackupPipeline(
        {
          settings,
          state,
          snapshots,
          isBackingUp,
          lastProgress,
          saveCache,
          saveState,
          writeSnapshotToDirSafe,
          getCacheBytesInUse,
          getDeviceId,
        },
        source
      )
      if (r.ok && r.snapshot && isDev) {
        console.debug("[useBackupService] 备份完成", {
          source,
          tabCount: r.snapshot.stats.tabCount,
        })
      }
      return r
    } finally {
      await releaseBackupLock()
    }
  }

  /** 手动备份（sidepanel/options 调） */
  async function runManualBackup() {
    return runBackup("manual")
  }

  /** 启动备份（chrome.runtime.onStartup 时由 background 触发） */
  async function runStartupBackup() {
    return runBackup("auto.event.startup")
  }

  // ===== 快照管理（委托给 lib/backup/snapshotMgmt.ts）=====
  function snapshotMgmtDeps() {
    return {
      settings,
      snapshots,
      saveCache,
      saveState,
      getCacheBytesInUse,
      setSnapshotCount: (count: number, bytes: number) => {
        state.value.snapshotCount = count
        state.value.cacheBytes = bytes
      },
    }
  }

  /**
   * 软删快照（P1-1）：删前把完整快照存到 undo.deletedSnapshot，30s 内可撤销。
   * 30s 后过期清理（initUndo 过期检查已覆盖）。
   * 返回 true 表示已软删（UI 应提示"已删除，30s 内可撤销"）。
   */
  async function deleteSnapshot(id: string): Promise<boolean> {
    const file = await getSnapshotFile(id)
    if (!file) return false
    // 存到 undo 供撤销（覆盖上一次软删，restore 的 preRestoreSnapshot 不动）
    undo.value = {
      preRestoreSnapshot: undo.value.preRestoreSnapshot,
      deletedSnapshot: file,
      createdAt: Date.now(),
    }
    await safeSet({ [BACKUP_KEYS.undo]: toPure(undo.value) }, "backup.delete")
    // 30s 后自动清 undo（防泄漏；若用户撤销则取消定时）
    scheduleUndoExpiry()
    return deleteSnapshotFn(snapshotMgmtDeps(), id)
  }

  /** 撤销删除（P1-1）：把软删的快照加回缓存列表 */
  async function undoDelete(): Promise<boolean> {
    const file = undo.value.deletedSnapshot
    if (!file) return false
    try {
      const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
      const list = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
      // 避免重复加回
      if (list.some((f) => f.snapshot.id === file.snapshot.id)) {
        undo.value = { preRestoreSnapshot: undo.value.preRestoreSnapshot, deletedSnapshot: null, createdAt: null }
        await safeSet({ [BACKUP_KEYS.undo]: toPure(undo.value) }, "backup.undoDelete")
        return true
      }
      const next = [...list, file]
      await snapshotMgmtDeps().saveCache(next)
      const bytes = await doGetCacheBytesInUse()
      snapshotMgmtDeps().setSnapshotCount(next.length, bytes)
      await snapshotMgmtDeps().saveState()
      snapshots.value = next.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
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
    return toggleLockFn(snapshotMgmtDeps(), id, locked, reason)
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
    await appendImportedSnapshotFn(snapshotMgmtDeps(), file)
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
    try {
      await safeRemove([BACKUP_KEYS.cache, BACKUP_KEYS.state, BACKUP_KEYS.undo, BACKUP_KEYS.dirMeta, BACKUP_KEYS.noticeAck], "backup")
      await safeSet({ [BACKUP_KEYS.cache]: [], [BACKUP_KEYS.state]: toPure(DEFAULT_BACKUP_STATE) }, "backup")
      snapshots.value = []
      state.value = { ...DEFAULT_BACKUP_STATE }
      undo.value = { ...DEFAULT_BACKUP_UNDO }
      noticeAck.value = { ...DEFAULT_BACKUP_NOTICE_ACK }
      dirMeta.value = { ...DEFAULT_BACKUP_DIR_META, permission: isFsAccessSupported() ? "prompt" : "unsupported" }
      await doUnbindDir()
      return true
    } catch (e) {
      console.warn("[useBackupService] clearAllBackups 失败", e)
      return false
    }
  }

  // ===== 监听 storage 变化（跨页同步）=====
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return
    if (changes[BACKUP_KEYS.settings]) {
      settings.value = sanitizeSettings(changes[BACKUP_KEYS.settings].newValue)
    }
    if (changes[BACKUP_KEYS.state]) {
      state.value = sanitizeState(changes[BACKUP_KEYS.state].newValue)
    }
    if (changes[BACKUP_KEYS.cache]) {
      const list = sanitizeSnapshotList(changes[BACKUP_KEYS.cache].newValue)
      snapshots.value = list.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
    }
    if (changes[BACKUP_KEYS.dirMeta]) {
      dirMeta.value = sanitizeDirMeta(changes[BACKUP_KEYS.dirMeta].newValue)
    }
    if (changes[BACKUP_KEYS.noticeAck]) {
      noticeAck.value = sanitizeNoticeAck(changes[BACKUP_KEYS.noticeAck].newValue)
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

  // ===== 监听 background.ts 广播的 backup:done 消息（SW 裸备份完成后通知 UI 刷新） =====
  // 设计：定时/启动备份由 SW 直接执行（runSwBareBackup），不依赖 UI 是否打开。
  // SW 写完 storage.local 后 storage.onChanged 已自动同步 settings/state/snapshots；
  // 这里收到 backup:done 仅刷新 nextBackupAt + 提示（如果 UI 开着）。
  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || typeof msg !== "object" || Array.isArray(msg)) return
    const m = msg as { type?: string }
    if (m.type !== "backup:done") return
    // storage.onChanged 已同步 reactive 状态；这里只刷新下次备份时间显示
    void refreshNextBackupTime()
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
    noticeAck,
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
    setNoticeAck,
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
