/**
 * 旧 storage.local 快照迁移到 IndexedDB - P0-4 §三 向后兼容
 *
 * 旧版本：快照数组存在 chrome.storage.local[BACKUP_KEYS.cache]（无事务、无 checksum）。
 * 新版本：快照真值在 IndexedDB snapshots store（事务原子 + SHA-256 checksum）。
 *
 * 迁移流程：
 * 1. 检查迁移标志 tabMasterBackupMigratedV1，已迁过则跳过
 * 2. tryAcquireCoord 拿协调锁（防并发迁移）
 * 3. 读旧 cache 数组 → 逐个 withChecksum + putSnapshot（已在 IndexedDB 的跳过）
 * 4. 删旧 cache key + 写迁移标志
 *
 * 守红线：迁移失败不删旧 key（保留回退）；storage 写走 safeSet；coordination 锁防并发。
 */

import { BACKUP_KEYS } from "~types/backup"
import { sanitizeSnapshotList } from "./sanitize"
import { withChecksum } from "./integrity"
import { putSnapshot, getAllSnapshots } from "./db"
import { safeSet, safeRemove } from "~lib/safeStorage"
import { tryAcquireCoord, releaseCoord } from "./coordination"
import { uuidV4 } from "./fingerprint"

/** 迁移完成标志 key（独立 key，不与 cache 混用） */
const MIGRATION_FLAG_KEY = "tabMasterBackupMigratedV1"

export interface MigrationResult {
  /** 本次迁移写入 IndexedDB 的快照数（已在 IDB 的不计数） */
  migrated: number
  /** 是否跳过（已迁过 / 别的进程在迁） */
  skipped: boolean
}

/**
 * 把旧 storage.local cache 迁移到 IndexedDB。
 * 幂等：已迁过（标志为 true）直接返回 skipped=true。
 * 并发安全：走 tryAcquireCoord，拿不到锁则跳过（别的进程在迁）。
 */
export async function migrateStorageLocalToIndexedDb(): Promise<MigrationResult> {
  // 1. 检查迁移标志
  const flagData = await chrome.storage.local.get(MIGRATION_FLAG_KEY)
  if (flagData[MIGRATION_FLAG_KEY] === true) {
    return { migrated: 0, skipped: true }
  }

  // 2. 拿协调锁防并发
  const traceId = uuidV4()
  if (!(await tryAcquireCoord(traceId))) {
    return { migrated: 0, skipped: true }
  }
  try {
    // 3. 双检（拿到锁后再查一次标志，防竞态）
    const flagData2 = await chrome.storage.local.get(MIGRATION_FLAG_KEY)
    if (flagData2[MIGRATION_FLAG_KEY] === true) {
      return { migrated: 0, skipped: true }
    }

    // 4. 读旧 cache
    const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
    const oldList = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
    if (!oldList.length) {
      // 无旧数据，直接标记已迁移
      await safeSet({ [MIGRATION_FLAG_KEY]: true }, "backup.migration")
      return { migrated: 0, skipped: false }
    }

    // 5. 已在 IndexedDB 的快照 id（避免重复迁移）
    const existing = await getAllSnapshots()
    const existingIds = new Set(existing.map((f) => f.snapshot.id))

    let count = 0
    for (const file of oldList) {
      if (existingIds.has(file.snapshot.id)) continue
      // 旧快照补 checksum
      const withCs = await withChecksum(file)
      await putSnapshot(withCs)
      count++
    }

    // 6. 删旧 key + 写迁移标志（两步独立 safeSet，任一失败不影响另一）
    await safeRemove(BACKUP_KEYS.cache, "backup.migration")
    await safeSet({ [MIGRATION_FLAG_KEY]: true }, "backup.migration")
    // 通知 UI 重新加载快照列表（IndexedDB 写后 storage.onChanged 不触发）
    if (count > 0) {
      chrome.runtime.sendMessage({ type: "backup:changed", op: "import", traceId, snapshotCount: count }).catch(() => {})
    }
    return { migrated: count, skipped: false }
  } finally {
    await releaseCoord()
  }
}

/** 仅供测试/重置用：清除迁移标志（让迁移可重跑） */
export async function resetMigrationFlag(): Promise<void> {
  await safeRemove(MIGRATION_FLAG_KEY, "backup.migration")
}
