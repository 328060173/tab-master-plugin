/**
 * 备份服务数据清洗（防御性读取，防脏数据炸 UI）
 * 抽离自 useBackupService.ts 以控制单文件行数（红线 .ts ≤ 500）。
 * 纯函数，无副作用，不依赖 vue。
 */

import {
  BACKUP_KIND,
  BACKUP_SCHEMA_VERSION,
  DEFAULT_BACKUP_SETTINGS,
  DEFAULT_BACKUP_STATE,
  DEFAULT_BACKUP_DIR_META,
  DEFAULT_BACKUP_NOTICE_ACK,
  type BackupDirMeta,
  type BackupFile,
  type BackupNoticeAck,
  type BackupSettings,
  type BackupState,
  type SnapshotSummary,
} from "~types/backup"
import { isFsAccessSupported } from "./fsAccess"

export function sanitizeSettings(raw: unknown): BackupSettings {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_BACKUP_SETTINGS }
  }
  const o = raw as Record<string, unknown>
  const num = (v: unknown, def: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : def
  return {
    enabled: o.enabled === true,
    cacheEnabled: o.cacheEnabled !== false,
    dirEnabled: o.dirEnabled === true,
    cacheQuotaBytes: num(o.cacheQuotaBytes, DEFAULT_BACKUP_SETTINGS.cacheQuotaBytes),
    cacheMaxSnapshots: num(o.cacheMaxSnapshots, DEFAULT_BACKUP_SETTINGS.cacheMaxSnapshots),
    timerMinutes: num(o.timerMinutes, DEFAULT_BACKUP_SETTINGS.timerMinutes),
    retentionDays: num(o.retentionDays, DEFAULT_BACKUP_SETTINGS.retentionDays),
    eventOnTabRemoved: o.eventOnTabRemoved !== false,
    eventOnWindowRemoved: o.eventOnWindowRemoved !== false,
    eventOnIdle: o.eventOnIdle === true,
    restoreMetaOnRestore: o.restoreMetaOnRestore !== false,
  }
}

export function sanitizeState(raw: unknown): BackupState {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_BACKUP_STATE }
  }
  const o = raw as Record<string, unknown>
  const numOrNull = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) ? v : null
  return {
    lastBackupAt: numOrNull(o.lastBackupAt),
    lastBackupSource:
      typeof o.lastBackupSource === "string"
        ? (o.lastBackupSource as BackupState["lastBackupSource"])
        : null,
    lastBackupError:
      typeof o.lastBackupError === "string" && o.lastBackupError ? o.lastBackupError : null,
    snapshotCount: typeof o.snapshotCount === "number" ? o.snapshotCount : 0,
    cacheBytes: typeof o.cacheBytes === "number" ? o.cacheBytes : 0,
  }
}

export function sanitizeDirMeta(raw: unknown): BackupDirMeta {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_BACKUP_DIR_META, permission: isFsAccessSupported() ? "prompt" : "unsupported" }
  }
  const o = raw as Record<string, unknown>
  return {
    name: typeof o.name === "string" ? o.name : null,
    dirBytes: typeof o.dirBytes === "number" ? o.dirBytes : 0,
    scannedAt: typeof o.scannedAt === "number" ? o.scannedAt : null,
    permission:
      typeof o.permission === "string"
        ? (o.permission as BackupDirMeta["permission"])
        : isFsAccessSupported() ? "prompt" : "unsupported",
  }
}

export function sanitizeNoticeAck(raw: unknown): BackupNoticeAck {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_BACKUP_NOTICE_ACK }
  }
  const o = raw as Record<string, unknown>
  const items = Array.isArray(o.items) ? o.items.map((x) => x === true).slice(0, 6) : []
  while (items.length < 6) items.push(false)
  return {
    items,
    ackedAt: typeof o.ackedAt === "number" ? o.ackedAt : null,
  }
}

export function sanitizeSnapshotList(raw: unknown): BackupFile[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is BackupFile => {
    if (!x || typeof x !== "object") return false
    const o = x as Record<string, unknown>
    return (
      o.schemaVersion === BACKUP_SCHEMA_VERSION &&
      o.kind === BACKUP_KIND &&
      !!o.snapshot &&
      typeof o.snapshot === "object"
    )
  })
}

export function toSummary(f: BackupFile): SnapshotSummary {
  const s = f.snapshot
  return {
    id: s.id,
    createdAt: s.createdAt,
    createdAtISO: s.createdAtISO,
    source: s.source,
    trigger: s.trigger,
    locked: s.locked,
    label: s.label,
    stats: s.stats,
  }
}
