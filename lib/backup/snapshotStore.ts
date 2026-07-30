/**
 * 快照存储统一封装 - P0-4 L2
 *
 * 把快照的"写 + 校验 + 上限裁剪 + 列表/读取/删除/修改"集中收口到 IndexedDB。
 * 替代原先散落在 pipeline/swBackup/snapshotMgmt 的 storage.local cache 读写。
 *
 * 设计：
 * - 写：withChecksum 算校验和 → putSnapshot → 回读 verifySnapshot（防事务内撕裂）。
 * - 清理（纯条数 FIFO）：trimExpiredSnapshots 删超 retentionDays 的 auto.* 项 +
 *   trimToMaxSnapshots 在 auto.* 超过 maxSnapshots 时删最早的（先进先出）。
 *
 * 2026-07-30：废 GFS 分层清理（死代码，无调用方，原 selectGfsRemovable/gfsCleanupSnapshots
 * 已删除）——实际清理走纯条数 FIFO，与文案"保留近 X 条"一致。
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
import { toSummary } from "./sanitize"
import type {
  BackupFile,
  BackupSettings,
  SnapshotSummary,
} from "~types/backup"

/** 一天的毫秒数（保留窗口计算用，避免散落魔法值） */
const DAY_MS = 86_400_000

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
 * 按保留天数清理：删除超过 retentionDays 的 auto.* 非失败项。
 *
 * 2026-07-28 重构：废 GFS 分层清理（同小时旧备份被合并导致关标签多次备份只剩 1 条），
 * 改为纯按条数（trimToMaxSnapshots）+ 按天数（本函数）清理。
 *
 * 不删：
 * - 手动备份（source='manual'）：用户主动备份，永不自动删
 * - 导入（source='import'）/ 恢复前（source='preRestore'）：与手动同等保护
 * - 失败快照（status='failed'）：审计性数据，仅手动可删
 *
 * @param retentionDays 保留天数（settings.retentionDays）
 * @returns 被删除的快照 id 列表
 */
export async function trimExpiredSnapshots(
  retentionDays: number
): Promise<string[]> {
  const all = await getAllSnapshots()
  const cut = Date.now() - retentionDays * DAY_MS
  const toRemove = all
    .filter(
      (f) =>
        f.snapshot.source.startsWith('auto.')
        && f.snapshot.status !== 'failed'
        && f.snapshot.createdAt < cut
    )
    .map((f) => f.snapshot.id)
  for (const id of toRemove) {
    await deleteSnapshotFromDb(id)
  }
  return toRemove
}

/**
 * 上限裁剪：自动备份（source: auto.*）超过 cacheMaxSnapshots 时删最早的。
 *
 * §3.3 用户硬要求：手动备份（source: 'manual'）永不自动删。
 * 导入（import）/恢复前（preRestore）同样不参与自动裁剪（与手动同等保护）。
 * cacheMaxSnapshots 仅约束 auto.* 来源。
 *
 * §2.2 失败快照（status='failed'）不计入保留上限也不参与裁剪——
 * 失败记录是审计性数据，不挤占成功备份的保留条数，也不被自动删（仅手动可删）。
 *
 * @param maxSnapshots 自动备份保留条数上限（settings.cacheMaxSnapshots）
 * @returns 被删除的快照 id 列表
 */
export async function trimToMaxSnapshots(
  maxSnapshots: number
): Promise<string[]> {
  const all = await getAllSnapshots()
  // 仅 auto.* 来源 + 成功快照参与条数裁剪（失败快照跳过）
  const autoTrimable = all.filter(
    (f) => f.snapshot.source.startsWith('auto.')
      && f.snapshot.status !== 'failed'
  )
  if (autoTrimable.length <= maxSnapshots) return []
  const overflow = autoTrimable.length - maxSnapshots
  const toRemove = autoTrimable
    .slice()
    .sort((a, b) => a.snapshot.createdAt - b.snapshot.createdAt)
    .slice(0, overflow)
    .map((f) => f.snapshot.id)
  for (const id of toRemove) {
    await deleteSnapshotFromDb(id)
  }
  return toRemove
}

/**
 * 手动备份超限统计（§3.3 trimManualOverLimit）。
 * 手动备份不自动删——仅返回超限数量给 UI 持续提示用户清理。
 *
 * §2.2 失败快照（status='failed'）不计入手动上限统计。
 *
 * @param manualMax 手动备份条数上限（BACKUP_LIMITS.*.manualMaxSnapshots）
 * @returns 超出上限的条数（0 表示未超限）
 */
export async function getManualOverLimitCount(
  manualMax: number
): Promise<number> {
  const all = await getAllSnapshots()
  const manualCount = all.filter(
    (f) => f.snapshot.source === 'manual' && f.snapshot.status !== 'failed'
  ).length
  return Math.max(0, manualCount - manualMax)
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
 * 修改快照（备注等）：读出 → mutate → 重算 checksum → 写回。
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
  await trimExpiredSnapshots(settings.retentionDays)
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
