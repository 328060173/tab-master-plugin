/**
 * 备份设置 / 设备标识统一读取入口（M4 抽公共函数，2026-07-30 立）。
 *
 * 背景：liveSnapshot.ts / swBackup.ts / swDispatch.ts 三处各自读 settings，
 * 且 swDispatch 用浅合并不调 sanitizeSettings → 口径不一致，脏数据可能进流程。
 * 本模块统一收口：readBackupSettings 走 sanitizeSettings 校验；readOrCreateDeviceId 复用。
 *
 * 守红线：纯读取/生成，不写业务态；safeSet + toPure 守 storage 写。
 */
import { safeSet } from "~lib/safeStorage"
import {
  BACKUP_KEYS,
  DEFAULT_BACKUP_SETTINGS,
  type BackupSettings,
} from "~types/backup"
import { sanitizeSettings } from "./sanitize"
import { uuidV4 } from "./fingerprint"

/**
 * 读备份设置（失败/脏数据兜底默认值，统一走 sanitizeSettings 校验）。
 * 三处（liveSnapshot / swBackup / swDispatch）统一调用，口径一致。
 */
export async function readBackupSettings(): Promise<BackupSettings> {
  try {
    const data = await chrome.storage.local.get(BACKUP_KEYS.settings)
    return sanitizeSettings(data[BACKUP_KEYS.settings])
  } catch {
    return { ...DEFAULT_BACKUP_SETTINGS }
  }
}

/**
 * 读/生成 deviceId（首次备份时自动生成并持久化）。
 * 复用统一入口，避免三处各自实现导致 deviceId 漂移。
 */
export async function readOrCreateDeviceId(): Promise<string> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.deviceId)
  const existing = data[BACKUP_KEYS.deviceId]
  if (typeof existing === "string" && existing) return existing
  const id = uuidV4()
  await safeSet({ [BACKUP_KEYS.deviceId]: id }, "backup")
  return id
}
