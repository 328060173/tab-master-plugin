/**
 * WAL（Write-Ahead Log）+ 崩溃恢复 - P0-4 L3
 *
 * 借鉴 SQLite WAL 模式（非 MySQL 2PC）：
 * - 追加 pending 帧（操作开始，先写日志）
 * - 执行操作
 * - 追加 committed 帧（操作成功，提交帧最后写）
 * - 崩溃恢复：扫 pending 未 committed → 删半成品快照 → 改 aborted
 *
 * 配合 IndexedDB 事务（db.txMulti）保证"WAL pending→快照→WAL committed"三步原子。
 * 崩溃在事务中间 → 事务回滚 → 三步都没写。崩溃在事务后 → committed 已落盘，下次无需恢复。
 *
 * 守红线：不引 fsync（IndexedDB 事务是 JS 层原子）；不依赖 CAS。
 */

import { putWal, getWalByTraceId, getAllWal, deleteWal } from "./db"
import { sha256 } from "./integrity"
import type { WalEntry, BackupOp } from "./types"
import { deleteSnapshotFromDb, getSnapshot } from "./db"

/**
 * 写 WAL pending 帧（操作开始时调）。
 * payloadDigest 是操作参数的 SHA-256（帧校验和，检测撕裂）。
 */
export async function writeWalPending(
  traceId: string,
  op: BackupOp,
  payload: unknown,
  snapshotId?: string
): Promise<WalEntry> {
  const entry: WalEntry = {
    traceId,
    timestamp: Date.now(),
    op,
    status: "pending",
    payloadDigest: await sha256(stableStringify(payload)),
    snapshotId,
  }
  await putWal(entry)
  return entry
}

/**
 * 写 WAL committed 帧（操作成功后调，提交帧最后写）。
 */
export async function writeWalCommitted(traceId: string): Promise<void> {
  const existing = await getWalByTraceId(traceId)
  if (!existing) {
    console.warn("[wal] commit 时找不到 pending 帧", traceId)
    return
  }
  const entry: WalEntry = { ...existing, status: "committed", timestamp: Date.now() }
  await putWal(entry)
}

/**
 * 写 WAL aborted 帧（操作失败/回滚后调）。
 */
export async function writeWalAborted(traceId: string, error?: string): Promise<void> {
  const existing = await getWalByTraceId(traceId)
  if (!existing) return
  const entry: WalEntry = { ...existing, status: "aborted", timestamp: Date.now(), error }
  await putWal(entry)
}

/**
 * 崩溃恢复 - SW 启动/install 时调一次。
 *
 * 扫所有 WAL，找 status="pending" 的（操作开始但未 commit/abort）：
 * - 若有 snapshotId 且快照存在但 checksum 不匹配（半成品）→ 删快照
 * - WAL 改 aborted
 * - 返回回滚的条目数（供审计日志记录）
 *
 * 无 pending → 直接返回 0（正常启动）。
 */
export async function recoverFromWal(): Promise<WalEntry[]> {
  const all = await getAllWal()
  const pendings = all.filter((e) => e.status === "pending")
  if (!pendings.length) return []

  const rolledback: WalEntry[] = []
  for (const p of pendings) {
    // 若关联快照存在，校验完整性；不匹配（半成品）→ 删除
    if (p.snapshotId) {
      const snap = await getSnapshot(p.snapshotId)
      if (snap) {
        // 半成品快照：checksum 缺失或不匹配（崩溃在写快照中途）
        const { verifySnapshot } = await import("./integrity")
        const ok = await verifySnapshot(snap)
        if (!ok) {
          await deleteSnapshotFromDb(p.snapshotId)
          console.warn(`[wal:recover] 删除半成品快照 ${p.snapshotId}（traceId=${p.traceId}）`)
        }
      }
    }
    // WAL 改 aborted
    await writeWalAborted(p.traceId, "崩溃恢复：操作未完成自动回滚")
    rolledback.push(p)
  }
  return rolledback
}

/**
 * 清理已 committed/aborted 的旧 WAL（保留最近 100 条，防 store 膨胀）。
 * SW 启动时调。
 */
export async function purgeOldWal(keepRecent = 100): Promise<void> {
  const all = await getAllWal()
  // 只清理已完成的（committed/aborted），pending 保留（等恢复）
  const done = all
    .filter((e) => e.status !== "pending")
    .sort((a, b) => b.timestamp - a.timestamp)
  if (done.length <= keepRecent) return
  const toRemove = done.slice(keepRecent)
  for (const e of toRemove) {
    await deleteWal(e.traceId)
  }
}

/** 稳定序列化（与 integrity.ts 一致，防 payload 顺序不同导致 digest 漂移） */
function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value))
}

function sortKeysDeep(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value
  if (Array.isArray(value)) return value.map(sortKeysDeep)
  const obj = value as Record<string, unknown>
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeysDeep(obj[key])
  }
  return sorted
}
