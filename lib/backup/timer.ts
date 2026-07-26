/**
 * 备份定时器 + deviceId 工具 - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * 纯函数：接收所需依赖（settings/nextBackupAt 的 ref），不直接持状态。
 */

import type { Ref } from "vue"
import { safeSet } from "~lib/safeStorage"
import { uuidV4 } from "./fingerprint"
import { BACKUP_KEYS, BACKUP_ALARM_NAME, type BackupSettings } from "~types/backup"

/** 获取或生成 deviceId（首次生成后持久化） */
export async function getDeviceId(): Promise<string> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.deviceId)
  const existing = data[BACKUP_KEYS.deviceId]
  if (typeof existing === "string" && existing) return existing
  const id = uuidV4()
  await safeSet({ [BACKUP_KEYS.deviceId]: id }, "backup")
  return id
}

/**
 * 应用定时备份设置：根据 enabled/timerMinutes 创建或清除 chrome.alarms。
 * 已存在且周期相同则不重设（避免重启时重置）。
 */
export async function applyTimer(
  settings: Ref<BackupSettings>,
  nextBackupAt: Ref<number | null>
): Promise<void> {
  try {
    const existing = await chrome.alarms.get(BACKUP_ALARM_NAME)
    if (!settings.value.enabled || settings.value.timerMinutes <= 0) {
      if (existing) await chrome.alarms.clear(BACKUP_ALARM_NAME)
      nextBackupAt.value = null
      return
    }
    const periodMin = settings.value.timerMinutes
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
    console.warn("[backup timer] applyTimer 失败", e)
  }
}

/** 刷新下次备份时间（alarm 被系统清除后重读） */
export async function refreshNextBackupTime(
  nextBackupAt: Ref<number | null>
): Promise<void> {
  try {
    const a = await chrome.alarms.get(BACKUP_ALARM_NAME)
    nextBackupAt.value = a?.scheduledTime ?? null
  } catch {
    nextBackupAt.value = null
  }
}
