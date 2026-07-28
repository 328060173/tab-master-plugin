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
  DEFAULT_BACKUP_NOTICE_ACKED,
  type BackupDirMeta,
  type BackupFile,
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

/**
 * 知悉确认状态清洗（设计稿 §4.2 重设计）。
 * 新版单 bool；旧版 6 项 boolean 数组（已迁移）——为兼容老用户，遇到旧 object 形态时
 * 若 items 全 true 则视为已 acked。
 */
export function sanitizeNoticeAcked(raw: unknown): boolean {
  if (typeof raw === "boolean") return raw
  // 兼容旧 object 形态 { items: boolean[6], ackedAt: number | null }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>
    const items = Array.isArray(o.items) ? o.items : []
    if (items.length > 0 && items.every((x) => x === true)) return true
  }
  return DEFAULT_BACKUP_NOTICE_ACKED
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
    // 旧快照（无 status 字段）兜底为 'success'；errorMessage 兜底为 null
    status: s.status === 'failed' ? 'failed' : 'success',
    errorMessage: typeof s.errorMessage === 'string' ? s.errorMessage : null,
  }
}
