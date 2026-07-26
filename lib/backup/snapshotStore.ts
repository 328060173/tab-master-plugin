/**
 * 快照存储统一封装 - P0-4 L2
 *
 * 把快照的"写 + 校验 + GFS 清理 + 上限裁剪 + 列表/读取/删除/修改"集中收口到 IndexedDB。
 * 替代原先散落在 pipeline/swBackup/snapshotMgmt 的 storage.local cache 读写。
 *
 * 设计：
 * - 写：withChecksum 算校验和 → putSnapshot → 回读 verifySnapshot（防事务内撕裂）。
 * - GFS：selectGfsRemovable 算保留集 → 逐个 deleteSnapshotFromDb。
 * - 上限：超 cacheMaxSnapshots 时剔除非锁定项（与原 storage.local 逻辑等价）。
 *
 * 守红线：不直写 storage.local（快照真值只在 IndexedDB）；storage 写 reactive 必 toPure（本模块不写 reactive）。
 */

import {
  putSnapshot,
  getSnapshot,
  getAllSnapshots,
  deleteSnapshotFromDb,
  clearSnapshots,
} from "./db"
import { withChecksum, verifySnapshot } from "./integrity"
import { selectGfsRemovable } from "./gfs"
import { toSummary } from "./sanitize"
import type {
  BackupFile,
  BackupSettings,
  SnapshotSummary,
} from "~types/backup"

/**
 * 持久化单个快照到 IndexedDB：算 checksum → 写 → 回读校验。
 * 失败（校验不通过）自动删除半成品，返回 ok=false。
 */
export async function persistSnapshot(
  file: BackupFile
): Promise<{ ok: boolean; error?: string }> {
  const withCs = await withChecksum(file)
  await putSnapshot(withCs)
  const reRead = await getSnapshot(withCs.snapshot.id)
  if (!reRead || !(await verifySnapshot(reRead))) {
    await deleteSnapshotFromDb(withCs.snapshot.id)
    return { ok: false, error: "写入后校验失败（快照损坏）" }
  }
  return { ok: true }
}

/**
 * GFS 清理：按 retentionDays 算保留集，删除可移除的非锁定项。
 * @returns 被删除的快照 id 列表
 */
export async function gfsCleanupSnapshots(
  retentionDays: number
): Promise<string[]> {
  const all = await getAllSnapshots()
  const removable = selectGfsRemovable(all, Date.now(), retentionDays)
  for (const id of removable) {
    await deleteSnapshotFromDb(id)
  }
  return removable
}

/**
 * 上限裁剪：超过 cacheMaxSnapshots 时，从非锁定项里删最早的。
 * @returns 被删除的快照 id 列表
 */
export async function trimToMaxSnapshots(
  maxSnapshots: number
): Promise<string[]> {
  const all = await getAllSnapshots()
  if (all.length <= maxSnapshots) return []
  // 非锁定项按时间升序，删最早的
  const nonLocked = all
    .filter((f) => !f.snapshot.locked)
    .sort((a, b) => a.snapshot.createdAt - b.snapshot.createdAt)
  const overflow = all.length - maxSnapshots
  const toRemove = nonLocked.slice(0, overflow).map((f) => f.snapshot.id)
  for (const id of toRemove) {
    await deleteSnapshotFromDb(id)
  }
  return toRemove
}

/**
 * 列出所有快照摘要（按 createdAt 倒序），供 UI snapshots ref 使用。
 */
export async function listSnapshotSummaries(): Promise<SnapshotSummary[]> {
  const all = await getAllSnapshots()
  return all.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
}

/** 获取完整快照（恢复/导出用） */
export async function getSnapshotFile(id: string): Promise<BackupFile | null> {
  const f = await getSnapshot(id)
  return f ?? null
}

/** 删除单个快照（按 id） */
export async function deleteSnapshotById(id: string): Promise<boolean> {
  const existing = await getSnapshot(id)
  if (!existing) return false
  await deleteSnapshotFromDb(id)
  return true
}

/**
 * 修改快照（锁定/标签等）：读出 → mutate → 重算 checksum → 写回。
 * mutate 函数原地修改 file。
 */
export async function mutateSnapshot(
  id: string,
  mutate: (file: BackupFile) => void
): Promise<boolean> {
  const existing = await getSnapshot(id)
  if (!existing) return false
  mutate(existing)
  // 重算 checksum（snapshot 内容已变）
  await withChecksum(existing)
  await putSnapshot(existing)
  return true
}

/** 追加导入的快照（带 checksum 写入 + 上限裁剪） */
export async function appendImportedSnapshot(
  file: BackupFile,
  settings: BackupSettings
): Promise<{ removedCount: number }> {
  const r = await persistSnapshot(file)
  if (!r.ok) return { removedCount: 0 }
  await gfsCleanupSnapshots(settings.retentionDays)
  const removed = await trimToMaxSnapshots(settings.cacheMaxSnapshots)
  return { removedCount: removed.length }
}

/** 清空所有快照（破坏性操作，由 UI 二次确认把关） */
export async function clearAllSnapshots(): Promise<void> {
  await clearSnapshots()
}

/** 当前快照总数 */
export async function getSnapshotCount(): Promise<number> {
  const all = await getAllSnapshots()
  return all.length
}
