/**
 * 备份模块内部类型（WAL + 审计日志 + 协调状态）- P0-4 L1/L2/L3
 *
 * 这些类型只在 lib/backup/ 内部流转，不暴露给 UI 层，所以放模块内不放全局 types/。
 */

import type { BackupFile } from "~types/backup"

/** M3：archive 透传的已构建快照文件（与 BackupFile 同构，独立命名避免循环依赖） */
export type BackupFileLike = BackupFile

/** 备份操作类型 */
export type BackupOp = "backup" | "restore" | "delete" | "import" | "clear" | "lock"

/** 同步状态机：idle(待同步) → syncing(同步中) → idle */
export type SyncState = "idle" | "syncing"

/**
 * WAL 条目（Write-Ahead Log）- P0-4 L3 崩溃恢复
 *
 * 借鉴 SQLite WAL：追加帧 + 提交帧 + 校验和，不做 MySQL 2PC。
 * - pending：操作开始时写（先写日志）
 * - committed：操作成功后写（提交帧，最后写）
 * - aborted：操作失败/崩溃恢复回滚后写
 *
 * 崩溃恢复：扫 pending 未 committed 的 → 删对应半成品快照 → 改 aborted
 */
export interface WalEntry {
  /** 全局唯一 traceId（事务 ID） */
  traceId: string
  timestamp: number
  op: BackupOp
  status: "pending" | "committed" | "aborted"
  /** 操作内容的 SHA-256（帧校验和，检测撕裂） */
  payloadDigest: string
  /** 关联的快照 id（回滚时定位用） */
  snapshotId?: string
  /** 错误信息（aborted 时） */
  error?: string
}

/**
 * 审计日志条目 - P0-4 用户要求1（traceId/时间/状态/保留清理）
 *
 * 存 IndexedDB audit store，追加式独立 put（零竞态）。
 * 保留策略：超 2 天清理，最多 500 条。
 */
export interface AuditLogEntry {
  traceId: string
  timestamp: number
  op: BackupOp | "recover"
  status: "started" | "success" | "failed" | "conflict" | "rolledback"
  /** 操作时的同步状态 */
  syncState: SyncState
  /** 操作时的协调版本号 */
  version: number
  error?: string
  durationMs?: number
}

/**
 * 协调状态（单点真相源）- P0-4 L1 状态机
 *
 * 存 chrome.storage.local（跨 SW/UI 共享，onChanged 同步）。
 * 注意：storage.local 无 CAS，但配合 SW 串行队列 + IndexedDB 事务兜底。
 */
export interface BackupCoord {
  /** 单调递增版本号 */
  version: number
  /** 同步状态机 */
  syncState: SyncState
  /** 当前持有锁的 traceId */
  holderTraceId: string | null
  /** 进入 syncing 的时间戳（超时兜底） */
  lockAt: number | null
}

export const DEFAULT_BACKUP_COORD: BackupCoord = {
  version: 0,
  syncState: "idle",
  holderTraceId: null,
  lockAt: null,
}

/**
 * SW 消息协议 - P0-4 L1 串行队列通信
 *
 * backup.vue / sidepanel 不直写 storage/IndexedDB，发消息给 SW 代理。
 */
export type BackupMessage =
  | { type: "backup:execute"; op: BackupOp; payload: BackupOpPayload; traceId: string }
  | { type: "backup:read-snapshots"; traceId: string }
  | { type: "backup:read-audit"; limit: number; traceId: string }
  | { type: "backup:recover"; traceId: string }

export type BackupOpPayload =
  | { kind: "manual-backup" }
  | { kind: "auto-backup"; source: string }
  | { kind: "restore"; snapshotId: string; mode: string }
  | { kind: "delete"; snapshotId: string }
  | { kind: "import"; file: unknown; format: string }
  | { kind: "clear" }
  | { kind: "lock"; snapshotId: string; locked: boolean; reason?: string }
  // M3：自动监听备份活档封存——file 已由 archiveLiveOnStartup 构建好（克隆+新 uuid），
  //   透传给 coordination 直接 persistSnapshot，不重新采集（区别于 backup kind 调 runSwBareBackup）
  | { kind: "archive"; file: BackupFileLike }

export interface BackupResponse {
  ok: boolean
  data?: unknown
  error?: string
  traceId: string
}
