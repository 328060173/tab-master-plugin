/**
 * 统一协调入口 - P0-4 L1 编排层
 *
 * 所有备份触发源（手动/定时/事件/SW裸/恢复/导入/删除）走 runBackupWithCoordination。
 * 编排：协调状态校验 → WAL pending → 执行（注入）→ checksum → WAL committed → 审计 → 广播。
 *
 * 设计：依赖注入执行函数（不直接 import pipeline/restore），避免循环依赖 + 单测可 mock。
 *
 * 守红线：不直写 storage（执行函数负责写 IndexedDB）；不依赖 CAS。
 */

import { uuidV4 } from "./fingerprint"
import { writeWalPending, writeWalCommitted, writeWalAborted, updateWalSnapshotId } from "./wal"
import { auditStarted, auditSuccess, auditFailed, auditConflict } from "./auditLog"
import {
  persistSnapshot,
  trimExpiredSnapshots,
  trimToMaxSnapshots,
} from "./snapshotStore"
import { getAllSnapshots } from "./db"
import type { BackupFile, BackupSettings } from "~types/backup"
import type { BackupOp, SyncState, BackupOpPayload } from "./types"
import { t } from "~lib/i18n"

const COORD_KEY = "tabMasterBackupCoord"

interface BackupCoord {
  version: number
  syncState: SyncState
  holderTraceId: string | null
  lockAt: number | null
}

const DEFAULT_COORD: BackupCoord = { version: 0, syncState: "idle", holderTraceId: null, lockAt: null }
const LOCK_TIMEOUT_MS = 5 * 60 * 1000

async function readCoord(): Promise<BackupCoord> {
  const data = await chrome.storage.local.get(COORD_KEY)
  const v = data[COORD_KEY]
  if (!v || typeof v !== "object" || Array.isArray(v)) return { ...DEFAULT_COORD }
  const o = v as Record<string, unknown>
  return {
    version: typeof o.version === "number" ? o.version : 0,
    syncState: o.syncState === "syncing" ? "syncing" : "idle",
    holderTraceId: typeof o.holderTraceId === "string" ? o.holderTraceId : null,
    lockAt: typeof o.lockAt === "number" ? o.lockAt : null,
  }
}

async function writeCoord(coord: BackupCoord): Promise<void> {
  await chrome.storage.local.set({ [COORD_KEY]: coord })
}

/**
 * 尝试获取协调锁：状态须为 idle（或超时）才能 → syncing。
 * 调用方（background.ts SW 串行队列 / useBackupService UI 侧）保证串行调，此处读-改-写安全。
 */
export async function tryAcquireCoord(traceId: string): Promise<boolean> {
  const cur = await readCoord()
  if (cur.syncState === "syncing") {
    if (cur.lockAt && Date.now() - cur.lockAt < LOCK_TIMEOUT_MS) return false
  }
  await writeCoord({ version: cur.version + 1, syncState: "syncing", holderTraceId: traceId, lockAt: Date.now() })
  return true
}

export async function releaseCoord(): Promise<void> {
  const cur = await readCoord()
  await writeCoord({ version: cur.version, syncState: "idle", holderTraceId: null, lockAt: null })
}

export type ExecuteFn = (op: BackupOp, payload: BackupOpPayload, traceId: string) => Promise<CoordinationResult>

export interface CoordinationResult {
  ok: boolean
  error?: string
  snapshot?: BackupFile
  broadcast?: unknown
  conflict?: boolean
}

/**
 * 统一协调入口（SW 队列内调）。
 * settings 用于保留策略清理（按天数 + 按条数，backup 操作后维护）。
 */
export async function runBackupWithCoordination(
  op: BackupOp,
  payload: BackupOpPayload,
  execute: ExecuteFn,
  settings?: BackupSettings
): Promise<CoordinationResult> {
  const traceId = uuidV4()
  const startTs = Date.now()
  const curCoord = await readCoord()

  if (!(await tryAcquireCoord(traceId))) {
    await auditConflict(traceId, op, curCoord.syncState, curCoord.version)
    return { ok: false, conflict: true, error: t("backup.lib.coordinating") }
  }

  try {
    const snapshotId = payload.kind === "delete" || payload.kind === "lock" ? payload.snapshotId : undefined
    await writeWalPending(traceId, op, payload, snapshotId)
    await auditStarted(traceId, op, "syncing", curCoord.version + 1)

    const result = await execute(op, payload, traceId)
    if (!result.ok) {
      await writeWalAborted(traceId, result.error)
      await auditFailed(traceId, op, "syncing", curCoord.version + 1, result.error || "执行失败", Date.now() - startTs)
      return result
    }

    if (result.snapshot) {
      // 写 IndexedDB + checksum 校验
      const persist = await persistSnapshot(result.snapshot)
      if (!persist.ok) {
        await writeWalAborted(traceId, persist.error || t("backup.lib.snapshotWriteFailed"))
        await auditFailed(traceId, op, "syncing", curCoord.version + 1, persist.error || t("backup.lib.snapshotWriteFailed"), Date.now() - startTs)
        return { ok: false, error: persist.error || t("backup.lib.snapshotWriteFailed") }
      }
      // 补写 WAL 的 snapshotId（backup 操作时 execute 返回后才知道 id）
      await updateWalSnapshotId(traceId, result.snapshot.snapshot.id)
      // 保留策略清理（纯条数 FIFO：按天数 + 按条数）
      if (settings && (op === "backup" || op === "import")) {
        await trimExpiredSnapshots(settings.retentionDays)
        await trimToMaxSnapshots(settings.cacheMaxSnapshots)
      }
    }

    await writeWalCommitted(traceId)
    await auditSuccess(traceId, op, "syncing", curCoord.version + 1, Date.now() - startTs)

    const snapshots = await getAllSnapshots()
    chrome.runtime.sendMessage({ type: "backup:changed", op, traceId, snapshotCount: snapshots.length }).catch(() => {})

    return result
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    await writeWalAborted(traceId, msg)
    await auditFailed(traceId, op, "syncing", curCoord.version + 1, msg, Date.now() - startTs)
    return { ok: false, error: msg }
  } finally {
    await releaseCoord()
  }
}

export async function getCoordState(): Promise<{ syncState: SyncState; version: number }> {
  const c = await readCoord()
  return { syncState: c.syncState, version: c.version }
}

export async function listSnapshots(): Promise<BackupFile[]> {
  return getAllSnapshots()
}
