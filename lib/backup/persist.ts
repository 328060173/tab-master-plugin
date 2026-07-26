/**
 * 备份持久化辅助 - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * 把 saveXxx 系列短函数集中，接收 ref 写 storage.local。
 * 纯函数：不持状态，传入什么写什么。
 */

import type { Ref } from "vue"
import { safeSet, safeRemove } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import {
  BACKUP_KEYS,
  type BackupSettings,
  type BackupState,
  type BackupDirMeta,
  type BackupUndo,
  type BackupFile,
} from "~types/backup"

export async function saveSettings(settings: Ref<BackupSettings>): Promise<void> {
  await safeSet({ [BACKUP_KEYS.settings]: toPure(settings.value) }, "backup")
}

export async function saveState(state: Ref<BackupState>): Promise<void> {
  await safeSet({ [BACKUP_KEYS.state]: toPure(state.value) }, "backup")
}

export async function saveCache(list: BackupFile[]): Promise<void> {
  await safeSet({ [BACKUP_KEYS.cache]: toPure(list) }, "backup")
}

export async function saveDirMeta(dirMeta: Ref<BackupDirMeta>): Promise<void> {
  await safeSet({ [BACKUP_KEYS.dirMeta]: toPure(dirMeta.value) }, "backup")
}

/** 写入首次开启知悉确认状态（单 bool，设计稿 §4.2） */
export async function saveNoticeAcked(noticeAcked: Ref<boolean>): Promise<void> {
  await safeSet({ [BACKUP_KEYS.noticeAcked]: !!noticeAcked.value }, "backup")
}

export async function saveUndo(undo: Ref<BackupUndo>): Promise<void> {
  if (undo.value.preRestoreSnapshot || undo.value.deletedSnapshot) {
    await safeSet({ [BACKUP_KEYS.undo]: toPure(undo.value) }, "backup")
  } else {
    await safeRemove(BACKUP_KEYS.undo, "backup")
  }
}
