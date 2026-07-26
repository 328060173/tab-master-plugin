/**
 * 备份初始化加载 - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * 一次性读 storage.local 所有备份相关 key，填充到传入的 refs。
 * 纯函数：不持状态，只填充 refs + 调回调。
 */

import type { Ref } from "vue"
import { safeSet, safeRemove } from "~lib/safeStorage"
import { uuidV4 } from "./fingerprint"
import {
  BACKUP_KEYS,
  DEFAULT_BACKUP_UNDO,
  type BackupSettings,
  type BackupState,
  type BackupDirMeta,
  type BackupNoticeAck,
  type BackupUndo,
  type BackupFile,
  type SnapshotSummary,
} from "~types/backup"
import {
  sanitizeSettings,
  sanitizeState,
  sanitizeDirMeta,
  sanitizeNoticeAck,
  sanitizeSnapshotList,
  toSummary,
} from "./sanitize"

export interface LoadAllDeps {
  settings: Ref<BackupSettings>
  state: Ref<BackupState>
  snapshots: Ref<SnapshotSummary[]>
  dirMeta: Ref<BackupDirMeta>
  noticeAck: Ref<BackupNoticeAck>
  undo: Ref<BackupUndo>
  /** 计算下次定时备份时间（load 完调） */
  refreshNextBackupTime: () => Promise<void>
  /** 检查目录权限（load 完调） */
  checkDirPermission: () => Promise<void>
}

/**
 * 一次性加载所有备份状态到 refs。
 * - settings/state/dirMeta/noticeAck/undo 直接填充
 * - cache 转 SnapshotSummary 列表填充
 * - 撤销窗口 30s 过期清理
 * - deviceId 不存在则生成
 * - 末尾刷新下次备份时间 + 检查目录权限
 */
export async function loadAll(deps: LoadAllDeps): Promise<void> {
  const { settings, state, snapshots, dirMeta, noticeAck, undo, refreshNextBackupTime, checkDirPermission } = deps
  try {
    const data = await chrome.storage.local.get([
      BACKUP_KEYS.settings,
      BACKUP_KEYS.state,
      BACKUP_KEYS.cache,
      BACKUP_KEYS.deviceId,
      BACKUP_KEYS.dirMeta,
      BACKUP_KEYS.noticeAck,
      BACKUP_KEYS.undo,
    ])
    settings.value = sanitizeSettings(data[BACKUP_KEYS.settings])
    state.value = sanitizeState(data[BACKUP_KEYS.state])
    const list = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
    snapshots.value = list.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
    dirMeta.value = sanitizeDirMeta(data[BACKUP_KEYS.dirMeta])
    noticeAck.value = sanitizeNoticeAck(data[BACKUP_KEYS.noticeAck])
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
