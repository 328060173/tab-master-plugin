/**
 * 备份初始化加载 - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * 一次性读 storage.local 所有备份相关 key，填充到传入的 refs。
 * 纯函数：不持状态，只填充 refs + 调回调。
 *
 * P0-4：快照列表从 IndexedDB 读（listSnapshotSummaries），不再读 storage.local cache。
 * 启动时先跑 migrateStorageLocalToIndexedDb 迁移旧数据。
 */

import type { Ref } from "vue"
import { safeSet, safeRemove } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import { uuidV4 } from "./fingerprint"
import {
  BACKUP_KEYS,
  DEFAULT_BACKUP_UNDO,
  DEFAULT_BACKUP_NOTICE_ACKED,
  type BackupSettings,
  type BackupState,
  type BackupDirMeta,
  type BackupUndo,
  type SnapshotSummary,
} from "~types/backup"
import {
  sanitizeSettings,
  sanitizeState,
  sanitizeDirMeta,
  sanitizeNoticeAcked,
} from "./sanitize"
import { listSnapshotSummaries } from "./snapshotStore"
import { migrateStorageLocalToIndexedDb } from "./migration"

export interface LoadAllDeps {
  settings: Ref<BackupSettings>
  state: Ref<BackupState>
  snapshots: Ref<SnapshotSummary[]>
  dirMeta: Ref<BackupDirMeta>
  /** 是否已确认首次开启知悉（单 bool，设计稿 §4.2） */
  noticeAcked: Ref<boolean>
  undo: Ref<BackupUndo>
  /** 计算下次定时备份时间（load 完调） */
  refreshNextBackupTime: () => Promise<void>
  /** 检查目录权限（load 完调） */
  checkDirPermission: () => Promise<void>
}

/**
 * 一次性加载所有备份状态到 refs。
 * - 先迁移旧 storage.local cache → IndexedDB
 * - settings/state/dirMeta/noticeAcked/undo 直接填充（storage.local）
 * - cache 从 IndexedDB 读摘要列表填充
 * - 撤销窗口 30s 过期清理
 * - deviceId 不存在则生成
 * - 末尾刷新下次备份时间 + 检查目录权限
 */
export async function loadAll(deps: LoadAllDeps): Promise<void> {
  const { settings, state, snapshots, dirMeta, noticeAcked, undo, refreshNextBackupTime, checkDirPermission } = deps
  try {
    // 先迁移旧 storage.local cache → IndexedDB（在加载快照列表前）
    try {
      await migrateStorageLocalToIndexedDb()
    } catch (e) {
      console.warn("[backup loader] 迁移旧快照失败（继续用 IndexedDB 现有数据）", e)
    }

    const data = await chrome.storage.local.get([
      BACKUP_KEYS.settings,
      BACKUP_KEYS.state,
      BACKUP_KEYS.deviceId,
      BACKUP_KEYS.dirMeta,
      BACKUP_KEYS.noticeAcked,
      BACKUP_KEYS.noticeAck, // 旧 key 用于迁移
      BACKUP_KEYS.undo,
    ])
    settings.value = sanitizeSettings(data[BACKUP_KEYS.settings])
    state.value = sanitizeState(data[BACKUP_KEYS.state])
    // 快照列表从 IndexedDB 读（P0-4 L2）
    snapshots.value = await listSnapshotSummaries()
    // 同步 state.snapshotCount（防 IndexedDB 与 state 漂移）
    if (state.value.snapshotCount !== snapshots.value.length) {
      state.value.snapshotCount = snapshots.value.length
      await safeSet({ [BACKUP_KEYS.state]: toPure(state.value) }, "backup")
    }
    dirMeta.value = sanitizeDirMeta(data[BACKUP_KEYS.dirMeta])
    // 知悉确认：优先读新 key（单 bool）；新 key 缺失则迁移旧 key（6 项数组）
    const newAcked = data[BACKUP_KEYS.noticeAcked]
    const oldAck = data[BACKUP_KEYS.noticeAck]
    if (typeof newAcked === "boolean") {
      noticeAcked.value = newAcked
    } else if (oldAck !== undefined) {
      // 迁移：旧 6 项数组全 true → acked=true，并写新 key + 删旧 key
      const migrated = sanitizeNoticeAcked(oldAck)
      noticeAcked.value = migrated
      await safeSet({ [BACKUP_KEYS.noticeAcked]: migrated }, "backup")
      await safeRemove(BACKUP_KEYS.noticeAck, "backup")
    } else {
      noticeAcked.value = DEFAULT_BACKUP_NOTICE_ACKED
    }
    undo.value = (data[BACKUP_KEYS.undo] && typeof data[BACKUP_KEYS.undo] === "object"
      ? data[BACKUP_KEYS.undo] : DEFAULT_BACKUP_UNDO) as BackupUndo
    // 撤销窗口 30s 过期清理
    if (undo.value.createdAt && Date.now() - undo.value.createdAt > 30_000) {
      undo.value = { ...DEFAULT_BACKUP_UNDO }
      await safeRemove(BACKUP_KEYS.undo, "backup")
    }
    if (typeof data[BACKUP_KEYS.deviceId] !== "string" || !data[BACKUP_KEYS.deviceId]) {
      await safeSet({ [BACKUP_KEYS.deviceId]: uuidV4() }, "backup")
    }
    // 计算下次定时备份时间
    await refreshNextBackupTime()
    // 检查目录权限
    await checkDirPermission()
  } catch (e) {
    console.warn("[backup loader] loadAll 失败", e)
  }
}
