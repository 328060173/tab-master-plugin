/**
 * SW 裸备份路径 - 不依赖 vue ref（service worker 无法持有 vue 实例）。
 *
 * 用途：chrome.alarms 定时触发 + onStartup 时，UI（sidepanel/options）可能未打开，
 * 原先 SW 只广播 backup:trigger 给 UI，UI 收不到消息 → 定时/启动备份丢失。
 * 本模块让 SW 直接在 service worker 上下文里执行备份：
 * 读设置 → chrome.tabs.query 全量 → collectMeta → buildSnapshot → 写 storage.local 缓存
 * → GFS 清理 → 更新 state。完成后广播 backup:done 给 UI（UI 开着则刷新状态，没开则下次打开读到最新 state）。
 *
 * 限制：SW 无 window，不能用 File System Access API（目录写降级跳过，记 lastBackupError
 * 提示「目录备份待UI侧补」，下次 UI 打开走 runManualBackup 时会补写目录）。
 *
 * 守红线：
 * - 不依赖 vue ref（纯 storage.local + chrome.tabs API）
 * - 所有 storage 写走 safeSet + toPure
 * - 锁由外层 runBackupWithCoordination(tryAcquireCoord) 统一管理，本模块不加锁
 * - 不调 chrome.sessions.setTabValue（Chrome 无此 API）
 */

import { APP_VERSION_CODE, APP_VERSION_NAME } from "~lib/api-config"
import { safeSet } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import {
  BACKUP_KEYS,
  BACKUP_KIND,
  BACKUP_SCHEMA_VERSION,
  type BackupFile,
  type BackupSettings,
  type BackupState,
  type BackupTriggerSource,
  type SnapshotSource,
} from "~types/backup"
import { collectMeta, buildSnapshot } from "./snapshotBuilder"
import { uuidV4 } from "./fingerprint"
import { selectGfsRemovable } from "./gfs"
import {
  sanitizeSnapshotList,
  sanitizeSettings,
  sanitizeState,
} from "./sanitize"
import { cleanupExpiredBackupLock } from "./lock"

/** 读备份设置（防御性，防脏数据） */
async function readSettings(): Promise<BackupSettings> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.settings)
  return sanitizeSettings(data[BACKUP_KEYS.settings])
}

/** 读/生成 deviceId */
async function getDeviceId(): Promise<string> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.deviceId)
  const existing = data[BACKUP_KEYS.deviceId]
  if (typeof existing === "string" && existing) return existing
  const id = uuidV4()
  await safeSet({ [BACKUP_KEYS.deviceId]: id }, "backup")
  return id
}

/** 缓存大小（getBytesInUse Chrome 136+，降级估算） */
async function getCacheBytesInUse(): Promise<number> {
  try {
    if (typeof chrome.storage.local.getBytesInUse === "function") {
      return await chrome.storage.local.getBytesInUse()
    }
  } catch {
    // 降级估算
  }
  try {
    const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
    return new Blob([JSON.stringify(data[BACKUP_KEYS.cache] ?? [])]).size
  } catch {
    return 0
  }
}

function mapSource(source: BackupTriggerSource): SnapshotSource {
  if (source === "auto.timer") return "auto.timer"
  if (source.startsWith("auto.event")) return "auto.event"
  if (source === "manual") return "manual"
  if (source === "preRestore") return "preRestore"
  return "import"
}

/** SW 侧构建快照文件（采集 + 元数据 + buildSnapshot） */
async function buildSwSnapshotFile(source: BackupTriggerSource): Promise<BackupFile> {
  const allTabs = await chrome.tabs.query({})
  const meta = await collectMeta()
  const snapSource = mapSource(source)
  const snapshot = await buildSnapshot(allTabs, meta, snapSource)
  snapshot.trigger = source
  const deviceId = await getDeviceId()
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appVersionCode: APP_VERSION_CODE,
    appVersionName: APP_VERSION_NAME,
    kind: BACKUP_KIND,
    deviceId,
    customer: { id: null, type: "anonymous" },
    snapshot,
    signature: { algo: null, value: null },
  }
}

/** SW 侧写缓存：追加 + 超额剔除非锁定项，返回最新列表 */
async function writeSwCache(settings: BackupSettings, file: BackupFile): Promise<BackupFile[]> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
  const cacheList = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
  if (settings.cacheEnabled) {
    cacheList.push(file)
    while (cacheList.length > settings.cacheMaxSnapshots) {
      const idx = cacheList.findIndex((f) => !f.snapshot.locked)
      if (idx === -1) break
      cacheList.splice(idx, 1)
    }
    await safeSet({ [BACKUP_KEYS.cache]: toPure(cacheList) }, "backup")
  }
  return cacheList
}

/** SW 侧 GFS 清理，返回清理后的列表 */
async function applySwGfsCleanup(settings: BackupSettings, cacheList: BackupFile[]): Promise<BackupFile[]> {
  const removable = selectGfsRemovable(cacheList, Date.now(), settings.retentionDays)
  if (!removable.length) return cacheList
  const next = cacheList.filter((f) => !removable.includes(f.snapshot.id))
  if (settings.cacheEnabled) {
    await safeSet({ [BACKUP_KEYS.cache]: toPure(next) }, "backup")
  }
  return next
}

/** SW 侧写状态 + 广播 backup:done */
async function updateSwState(
  snapshot: BackupFile["snapshot"],
  snapSource: string,
  cacheList: BackupFile[],
  dirError: string | null,
  source: BackupTriggerSource
): Promise<void> {
  const cacheBytes = await getCacheBytesInUse()
  const newState: BackupState = {
    lastBackupAt: snapshot.createdAt,
    lastBackupSource: snapSource as BackupState["lastBackupSource"],
    lastBackupError: dirError,
    snapshotCount: cacheList.length,
    cacheBytes,
  }
  await safeSet({ [BACKUP_KEYS.state]: toPure(newState) }, "backup")
  // 广播 backup:done 给 UI（storage.onChanged 已同步 settings/state/snapshots，
  // 这里仅做 nextBackupAt 刷新触发；UI 未打开则下次打开读到最新 state）
  chrome.runtime.sendMessage({ type: "backup:done", source }).catch(() => {})
}

/** SW 侧写错误到 state（UI 下次打开能看到） */
async function persistSwError(msg: string): Promise<void> {
  try {
    const data = await chrome.storage.local.get(BACKUP_KEYS.state)
    const cur = sanitizeState(data[BACKUP_KEYS.state])
    cur.lastBackupError = msg
    await safeSet({ [BACKUP_KEYS.state]: toPure(cur) }, "backup")
  } catch {
    // 静默
  }
}

/**
 * SW 裸备份主入口。
 * @param source 触发源（auto.timer / auto.event.startup / ...）
 */
export async function runSwBareBackup(
  source: BackupTriggerSource
): Promise<{ ok: boolean; error?: string }> {
  const settings = await readSettings()
  if (!settings.enabled) {
    return { ok: false, error: "备份未开启" }
  }

  // P0-4: 锁由外层 runBackupWithCoordination（tryAcquireCoord）统一管理，此处不再单独加锁
  // 调用链：triggerTimer/Startup → enqueueBackupOperation → runBackupWithCoordination(tryAcquireCoord) → executeBackupOp → 本函数
  try {
    const file = await buildSwSnapshotFile(source)
    let cacheList = await writeSwCache(settings, file)
    const dirError = settings.dirEnabled ? "目录备份待UI侧补" : null
    cacheList = await applySwGfsCleanup(settings, cacheList)
    await updateSwState(file.snapshot, file.snapshot.source, cacheList, dirError, source)
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    await persistSwError(msg)
    console.warn("[swBackup] 失败", e)
    return { ok: false, error: msg }
  }
}

/** SW 启动时调一次：清理过期锁 */
export async function initSwBackupLock(): Promise<void> {
  await cleanupExpiredBackupLock()
}
