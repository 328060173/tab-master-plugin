/**
 * SW 裸备份路径 - 不依赖 vue ref（service worker 无法持有 vue 实例）。
 *
 * 用途：chrome.alarms 定时触发 + onStartup 时，UI（sidepanel/options）可能未打开，
 * 原先 SW 只广播 backup:trigger 给 UI，UI 收不到消息 → 定时/启动备份丢失。
 * 本模块让 SW 直接在 service worker 上下文里执行备份：
 * 读设置 → chrome.tabs.query 全量 → collectMeta → buildSnapshot → 返回 file
 * → 由外层 runBackupWithCoordination 统一写 IndexedDB + 保留策略清理 + state。
 *
 * P0-4：本模块只负责"构建快照文件 + 更新 state 元信息"，不再写 storage.local cache。
 * 快照真值落 IndexedDB 由 coordination 层（persistSnapshot）统一处理，避免双写漂移。
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

import { safeSet } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import {
  BACKUP_KEYS,
  currentLimits,
  type BackupFile,
  type BackupSettings,
  type BackupState,
  type BackupTriggerSource,
  type SnapshotSource,
} from "~types/backup"
import { type BuildSnapshotOptions } from "./snapshotBuilder"
import { buildBackupFileFromTabs } from "./exporters"
import {
  sanitizeState,
} from "./sanitize"
import { cleanupExpiredBackupLock } from "./lock"
import { filterBackupableTabs } from "./urlFilter"
import { readBackupSettings, readOrCreateDeviceId } from "./settingsAccess"

/** 读备份设置（M4：统一走 settingsAccess.readBackupSettings，口径与 liveSnapshot/swDispatch 一致） */
async function readSettings(): Promise<BackupSettings> {
  return readBackupSettings()
}

/** 读/生成 deviceId（M4：统一走 settingsAccess.readOrCreateDeviceId） */
async function getDeviceId(): Promise<string> {
  return readOrCreateDeviceId()
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
  return 0
}

function mapSource(source: BackupTriggerSource): SnapshotSource {
  if (source === "auto.timer") return "auto.timer"
  if (source === "auto.event.startup") return "auto.event"
  if (source === "manual") return "manual"
  // m1：auto.listen 不经 runSwBareBackup（活档写入走 liveSnapshot.ts 独立路径，封存走
  //   coordination 透传 file）。此处为类型完备性兜底——运行时不应到达，返回 auto.listen
  //   以防误调用时 source 被错标为 import。
  return "auto.listen"
}

/** SW 侧构建快照文件（复用 buildBackupFileFromTabs，统一 BackupFile 外层包装） */
async function buildSwSnapshotFile(
  source: BackupTriggerSource,
  allTabs: chrome.tabs.Tab[],
): Promise<BackupFile> {
  const snapSource = mapSource(source)
  // §3.2：SW 裸备份只跑 auto.* / startup 路径，超 maxTabsPerSnapshot 自动截断
  const isManual = source === 'manual'
  const buildOpts: BuildSnapshotOptions | undefined = isManual
    ? undefined
    : { truncateAt: currentLimits().maxTabsPerSnapshot, totalTabCount: allTabs.length }
  const deviceId = await getDeviceId()
  return buildBackupFileFromTabs(allTabs, snapSource, deviceId, source, buildOpts)
}

/**
 * SW 侧更新 state 元信息（lastBackupAt/source/error）。
 * snapshotCount/cacheBytes 由 coordination 层在 persistSnapshot + 保留策略清理后刷新。
 * 这里先写 lastBackupAt/source/dirError，让 UI 下次打开能看到上次备份时间。
 */
async function updateSwState(
  snapshot: BackupFile["snapshot"],
  snapSource: string,
  dirError: string | null,
  source: BackupTriggerSource
): Promise<void> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.state)
  const cur = sanitizeState(data[BACKUP_KEYS.state])
  const newState: BackupState = {
    lastBackupAt: snapshot.createdAt,
    lastBackupSource: snapSource as BackupState["lastBackupSource"],
    lastBackupError: dirError,
    snapshotCount: cur.snapshotCount,
    cacheBytes: await getCacheBytesInUse(),
  }
  await safeSet({ [BACKUP_KEYS.state]: toPure(newState) }, "backup")
  // 广播 backup:done 给 UI（coordination 层会再广播 backup:changed 携带最新 count）
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
 * @param source 触发源（auto.timer / auto.event.startup / manual）。
 *   注：「自动监听备份」活档写入不走本函数（活档是 storage.local 覆盖写，见 liveSnapshot.ts）；
 *   活档封存为历史档走 persistSnapshot（IndexedDB），也不经本函数。
 * @returns file 构建出的快照文件（供 coordination 写 IndexedDB）
 */
export async function runSwBareBackup(
  source: BackupTriggerSource
): Promise<{ ok: boolean; error?: string; file?: BackupFile }> {
  const settings = await readSettings()
  console.warn(`[backup] runSwBareBackup 入口 source=${source} enabled=${settings.enabled}`)
  // 开关校验：本函数只服务定时/启动/手动路径，均校验自动备份总开关 enabled。
  // 「自动监听备份」(listenBackupEnabled) 独立于本路径，在 liveSnapshot.ts 自行校验。
  if (!settings.enabled) {
    console.warn('[backup] 跳过：自动备份未开启（settings.enabled=false）')
    return { ok: false, error: '备份未开启' }
  }

  // 标签采集：定时/启动/手动路径走 chrome.tabs.query（实时全量，无需镜像）。
  const allTabs = await chrome.tabs.query({})
  // 0 标签短路（2026-07-28 立）：定时/启动后台备份，无标签不落空快照。
  if (filterBackupableTabs(allTabs).length === 0) {
    console.warn('[backup] 跳过：无标签')
    return { ok: false, error: '无标签，跳过' }
  }

  // P0-4: 锁由外层 runBackupWithCoordination（tryAcquireCoord）统一管理，此处不再单独加锁
  try {
    const file = await buildSwSnapshotFile(source, allTabs)
    const dirError = settings.dirEnabled ? "目录备份待UI侧补" : null
    await updateSwState(file.snapshot, file.snapshot.source, dirError, source)
    console.warn(
      `[backup] 备份结果 ok=true source=${source} tabsCount=${allTabs.length}`
    )
    return { ok: true, file }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    await persistSwError(msg)
    console.warn(`[backup] 备份结果 ok=false source=${source} error=${msg}`, e)
    return { ok: false, error: msg }
  }
}

/** SW 启动时调一次：清理过期锁 */
export async function initSwBackupLock(): Promise<void> {
  await cleanupExpiredBackupLock()
}
