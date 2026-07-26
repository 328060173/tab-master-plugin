/**
 * 备份执行锁 - 协调 SW 裸备份路径 与 UI runBackupPipeline 不并发。
 *
 * 背景：alarm 触发时 SW 走裸备份路径，UI 也可能同时执行手动/事件备份。
 * 通过 storage.local 的 inProgress 标志位（{ at: number }）互斥：
 * 任一方开始备份前先 acquireBackupLock()，成功才执行；完成/失败都释放。
 * 锁带 5 分钟 TTL 防死锁（异常崩溃时下次 alarm 也能恢复）。
 *
 * 守红线：不引入新 chrome.* API，纯 storage.local 读写。
 */

import { safeSet, safeRemove } from "~lib/safeStorage"
import { BACKUP_KEYS } from "~types/backup"

const LOCK_TTL_MS = 5 * 60 * 1000 // 5 分钟

interface LockValue {
  at: number
}

function parseLock(raw: unknown): LockValue | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  if (typeof o.at !== "number" || !Number.isFinite(o.at)) return null
  return { at: o.at }
}

/**
 * 尝试获取备份锁。
 * @returns true=获取成功可执行；false=锁被占用（5min 内有备份在跑）
 */
export async function acquireBackupLock(): Promise<boolean> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.inProgress)
  const existing = parseLock(data[BACKUP_KEYS.inProgress])
  if (existing) {
    if (Date.now() - existing.at < LOCK_TTL_MS) {
      // 锁仍在有效期内
      return false
    }
    // 锁已过期，继续覆盖
  }
  await safeSet({ [BACKUP_KEYS.inProgress]: { at: Date.now() } }, "backup.lock")
  return true
}

/** 释放备份锁（备份完成/失败后调用） */
export async function releaseBackupLock(): Promise<void> {
  await safeRemove(BACKUP_KEYS.inProgress, "backup.lock")
}

/** 清理过期锁（SW 启动/install 时调一次，防历史残留） */
export async function cleanupExpiredBackupLock(): Promise<void> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.inProgress)
  const existing = parseLock(data[BACKUP_KEYS.inProgress])
  if (existing && Date.now() - existing.at >= LOCK_TTL_MS) {
    await safeRemove(BACKUP_KEYS.inProgress, "backup.lock")
  }
}
