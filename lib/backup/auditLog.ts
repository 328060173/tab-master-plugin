/**
 * 审计日志 - P0-4 用户要求1（traceId/时间/状态/保留清理）
 *
 * 存 IndexedDB audit store，追加式独立 put（零竞态，调研方案4流水模式）。
 * 字段：traceId + timestamp + op + status + syncState + version + error + durationMs。
 * 保留策略：超 2 天清理（purgeAuditBefore）；最多 500 条（超则删最早）。
 * 查看入口：备份设置页「审计日志」折叠区，展示最近 50 条。
 *
 * 守红线：每条独立 put（不 RMW 数组），事务内写；不依赖 storage.local。
 */

import { putAudit, getRecentAudit, purgeAuditBefore, getAuditCount, deleteOldestAudit } from "./db"
import type { AuditLogEntry, BackupOp, SyncState } from "./types"

const MAX_AUDIT_ENTRIES = 500
const AUDIT_RETENTION_MS = 2 * 24 * 60 * 60 * 1000 // 2 天

/**
 * 追加一条审计日志。
 * 独立 put（不读-改-写数组），零竞态。
 */
export async function appendAudit(entry: Omit<AuditLogEntry, "timestamp">): Promise<void> {
  const full: AuditLogEntry = {
    ...entry,
    timestamp: Date.now(),
  }
  await putAudit(full)
  // 保留策略：超 500 条删最早的
  const count = await getAuditCount()
  if (count > MAX_AUDIT_ENTRIES) {
    await deleteOldestAudit(count - MAX_AUDIT_ENTRIES)
  }
}

/** 快捷：记操作开始 */
export async function auditStarted(
  traceId: string,
  op: BackupOp,
  syncState: SyncState,
  version: number
): Promise<void> {
  await appendAudit({ traceId, op, status: "started", syncState, version })
}

/** 快捷：记操作成功 */
export async function auditSuccess(
  traceId: string,
  op: BackupOp,
  syncState: SyncState,
  version: number,
  durationMs: number
): Promise<void> {
  await appendAudit({ traceId, op, status: "success", syncState, version, durationMs })
}

/** 快捷：记操作失败 */
export async function auditFailed(
  traceId: string,
  op: BackupOp,
  syncState: SyncState,
  version: number,
  error: string,
  durationMs: number
): Promise<void> {
  await appendAudit({ traceId, op, status: "failed", syncState, version, error, durationMs })
}

/** 快捷：记冲突（被拒绝） */
export async function auditConflict(
  traceId: string,
  op: BackupOp,
  syncState: SyncState,
  version: number
): Promise<void> {
  await appendAudit({ traceId, op, status: "conflict", syncState, version })
}

/** 快捷：记崩溃恢复回滚 */
export async function auditRolledback(
  traceId: string,
  op: BackupOp | "recover",
  version: number,
  error?: string
): Promise<void> {
  await appendAudit({ traceId, op, status: "rolledback", syncState: "idle", version, error })
}

/**
 * 清理过期审计日志（超 2 天）。
 * SW 启动 + 每次写日志时调。
 */
export async function purgeExpiredAudit(): Promise<number> {
  const cutoff = Date.now() - AUDIT_RETENTION_MS
  return purgeAuditBefore(cutoff)
}

/**
 * 查询最近 N 条审计日志（按时间倒序）。
 * 设置页查看用。
 */
export async function getRecentAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  // 先清理过期（懒清理）
  await purgeExpiredAudit()
  return getRecentAudit(limit)
}
