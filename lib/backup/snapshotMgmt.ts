/**
 * 备份快照管理（增删改查 + 锁定） - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * 纯 storage 操作，不持状态；调用方传入持久化回调。
 */

import { type Ref } from "vue"
import { safeSet } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import { BACKUP_KEYS, type BackupFile, type BackupSettings, type SnapshotSummary } from "~types/backup"
import { sanitizeSnapshotList, toSummary } from "./sanitize"

export interface SnapshotMgmtDeps {
  settings: Ref<BackupSettings>
  snapshots: Ref<SnapshotSummary[]>
  /** 写缓存数组 */
  saveCache: (list: BackupFile[]) => Promise<void>
  saveState: () => Promise<void>
  getCacheBytesInUse: () => Promise<number>
  setSnapshotCount: (count: number, bytes: number) => void
}

/** 删除单个快照（locked 项也允许删，由 UI 二次确认把关） */
export async function deleteSnapshot(deps: SnapshotMgmtDeps, id: string): Promise<boolean> {
  try {
    const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
    const list = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
    const next = list.filter((f) => f.snapshot.id !== id)
    if (next.length === list.length) return false
    await deps.saveCache(next)
    const bytes = await deps.getCacheBytesInUse()
    deps.setSnapshotCount(next.length, bytes)
    await deps.saveState()
    deps.snapshots.value = next.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
    return true
  } catch (e) {
    console.warn("[snapshotMgmt] 删除失败", e)
    return false
  }
}

/** 切换锁定（locked 项不被 GFS 删） */
export async function toggleLock(
  deps: SnapshotMgmtDeps,
  id: string,
  locked: boolean,
  reason?: string
): Promise<boolean> {
  try {
    const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
    const list = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
    const idx = list.findIndex((f) => f.snapshot.id === id)
    if (idx === -1) return false
    list[idx].snapshot.locked = locked
    list[idx].snapshot.lockedReason = locked ? (reason ?? null) : null
    await deps.saveCache(list)
    deps.snapshots.value = list.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
    return true
  } catch (e) {
    console.warn("[snapshotMgmt] 切换锁定失败", e)
    return false
  }
}

/** 设置快照自定义标签 */
export async function setSnapshotLabel(
  deps: SnapshotMgmtDeps,
  id: string,
  label: string | null
): Promise<boolean> {
  try {
    const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
    const list = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
    const idx = list.findIndex((f) => f.snapshot.id === id)
    if (idx === -1) return false
    list[idx].snapshot.label = label
    await deps.saveCache(list)
    deps.snapshots.value = list.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
    return true
  } catch (e) {
    console.warn("[snapshotMgmt] 设置标签失败", e)
    return false
  }
}

/** 获取完整快照（恢复/导出用） */
export async function getSnapshotFile(id: string): Promise<BackupFile | null> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
  const list = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
  return list.find((f) => f.snapshot.id === id) || null
}

/** 写入外部导入的快照到缓存 */
export async function appendImportedSnapshot(
  deps: SnapshotMgmtDeps,
  file: BackupFile
): Promise<void> {
  const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
  const list = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
  list.push(file)
  while (list.length > deps.settings.value.cacheMaxSnapshots) {
    const idx = list.findIndex((f) => !f.snapshot.locked)
    if (idx === -1) break
    list.splice(idx, 1)
  }
  await deps.saveCache(list)
  const bytes = await deps.getCacheBytesInUse()
  deps.setSnapshotCount(list.length, bytes)
  await deps.saveState()
  deps.snapshots.value = list.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
}

/** 写缓存数组到 storage.local（持久化辅助） */
export async function persistCache(list: BackupFile[]): Promise<void> {
  await safeSet({ [BACKUP_KEYS.cache]: toPure(list) }, "backup")
}
