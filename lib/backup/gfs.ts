/**
 * GFS (Grandfather-Father-Son) 分层保留策略 - PRD §C / §4.7 / §8.1
 *
 * 分层（PRD §C）：
 * - 近 24h：每小时保留 1 个（最新的一条）
 * - 近 7 天：每天保留 1 个（当天最新的一条）
 * - 近 4 周：每周保留 1 个
 * - 近 12 月：每月保留 1 个
 * - 锁定项永不删
 *
 * 保留天数可调（7/14/30/90），用于裁剪整体保留窗口。
 * 清理时机：每次备份后执行；只删非锁定项。
 */

import type { BackupFile } from "~types/backup"

const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

interface Bucket {
  /** 桶起始时间戳（含） */
  start: number
  /** 桶结束时间戳（不含） */
  end: number
  /** 桶内保留的快照 id（最新一条） */
  keepId: string | null
  /** 桶内最新时间戳 */
  latestAt: number
}

function bucketKeepId(items: BackupFile[], start: number, end: number): Bucket {
  let keepId: string | null = null
  let latestAt = -1
  for (const f of items) {
    const t = f.snapshot.createdAt
    if (t >= start && t < end && t > latestAt) {
      latestAt = t
      keepId = f.snapshot.id
    }
  }
  return { start, end, keepId, latestAt }
}

/**
 * 计算应保留的快照 id 集合。
 * @param items 全部快照
 * @param now 当前时间戳
 * @param retentionDays 保留天数（7/14/30/90）
 *
 * §2.2 失败快照（status='failed'）不参与 GFS 保留计算——既不占桶保留位（避免
 * 失败记录成为桶内最新导致成功备份被淘汰），也不被 GFS 自动删（仅手动可删）。
 */
export function computeGfsKeepIds(
  items: BackupFile[],
  now: number,
  retentionDays: number
): Set<string> {
  const keep = new Set<string>()
  // 0. 失败快照整体排除（不进 GFS 计算流程）
  const valid = items.filter((f) => f.snapshot.status !== 'failed')
  // 1. 锁定项永不删
  for (const f of valid) {
    if (f.snapshot.locked) keep.add(f.snapshot.id)
  }
  // 2. 整体保留窗口之外（>retentionDays）的不保留（除非已锁定，上面已加）
  const retentionMs = retentionDays * DAY_MS
  const retentionCut = now - retentionMs
  const inWindow = valid.filter((f) => f.snapshot.createdAt >= retentionCut)
  // 3. 近 24h：每小时一个桶
  for (let h = 0; h < 24; h++) {
    const start = now - (h + 1) * HOUR_MS
    const end = now - h * HOUR_MS
    const b = bucketKeepId(inWindow, start, end)
    if (b.keepId) keep.add(b.keepId)
  }
  // 4. 近 7 天（已含 24h）：每天一个桶（用当天 0 点对齐）
  for (let d = 1; d < 7; d++) {
    const start = now - (d + 1) * DAY_MS
    const end = now - d * DAY_MS
    const b = bucketKeepId(inWindow, start, end)
    if (b.keepId) keep.add(b.keepId)
  }
  // 5. 近 4 周（已含 7 天）：每周一个桶
  // §4.3 retentionDays 守卫：7~29 天只跑前 2 层（24h + 7d），4w 桶不可达——跳过避免空跑
  if (retentionDays >= 30) {
    for (let w = 1; w < 4; w++) {
      const start = now - (w + 1) * 7 * DAY_MS
      const end = now - w * 7 * DAY_MS
      const b = bucketKeepId(inWindow, start, end)
      if (b.keepId) keep.add(b.keepId)
    }
  }
  // 6. 近 12 月（已含 4 周）：每月一个桶
  // §4.3 retentionDays 守卫：30~89 天只跑前 3 层（24h + 7d + 4w），12m 桶不可达——跳过
  if (retentionDays >= 90) {
    for (let m = 1; m < 12; m++) {
      const start = now - (m + 1) * 30 * DAY_MS
      const end = now - m * 30 * DAY_MS
      const b = bucketKeepId(inWindow, start, end)
      if (b.keepId) keep.add(b.keepId)
    }
  }
  return keep
}

/**
 * 执行 GFS 清理：返回被删除的快照 id 列表（非锁定 + 不在保留集 + 在保留窗口外或被桶淘汰）。
 * 注意：本函数纯计算，不修改原数组；调用方负责实际删除与持久化。
 *
 * §2.2 失败快照（status='failed'）不参与 GFS 清理——仅手动可删。
 */
export function selectGfsRemovable(
  items: BackupFile[],
  now: number,
  retentionDays: number
): string[] {
  const keep = computeGfsKeepIds(items, now, retentionDays)
  return items
    .filter((f) => !keep.has(f.snapshot.id) && f.snapshot.status !== 'failed')
    .map((f) => f.snapshot.id)
}
