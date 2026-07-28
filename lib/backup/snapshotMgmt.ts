/**
 * 备份快照管理（增删改查） - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * P0-4：所有读写改为 IndexedDB（经 snapshotStore），不再读写 storage.local cache。
 * 纯函数，不持状态；调用方传入持久化回调（state 仍在 storage.local）。
 */

import { type Ref } from "vue"
import { type BackupFile, type BackupSettings, type BackupState, type SnapshotSummary } from "~types/backup"
import {
  deleteSnapshotById,
  getSnapshotFile as getSnapshotFileFromStore,
  mutateSnapshot,
  appendImportedSnapshot as appendImportedToStore,
  listSnapshotSummaries,
  persistSnapshot,
} from "./snapshotStore"

export interface SnapshotMgmtDeps {
  settings: Ref<BackupSettings>
  state: Ref<BackupState>
  snapshots: Ref<SnapshotSummary[]>
  /** 写状态到 storage.local（snapshotCount/cacheBytes 同步） */
  saveState: () => Promise<void>
  /** 缓存大小（用于 UI 占用展示） */
  getCacheBytesInUse: () => Promise<number>
}

/** 重新加载快照摘要列表 + 同步 state.snapshotCount */
async function reloadSummaries(deps: SnapshotMgmtDeps): Promise<void> {
  deps.snapshots.value = await listSnapshotSummaries()
  deps.state.value.snapshotCount = deps.snapshots.value.length
  deps.state.value.cacheBytes = await deps.getCacheBytesInUse()
  await deps.saveState()
}

/** 删除单个快照（由 UI 二次确认把关） */
export async function deleteSnapshot(deps: SnapshotMgmtDeps, id: string): Promise<boolean> {
  try {
    const ok = await deleteSnapshotById(id)
    if (!ok) return false
    await reloadSummaries(deps)
    return true
  } catch (e) {
    console.warn("[snapshotMgmt] 删除失败", e)
    return false
  }
}

/** 设置快照自定义标签 */
export async function setSnapshotLabel(
  deps: SnapshotMgmtDeps,
  id: string,
  label: string | null
): Promise<boolean> {
  try {
    const ok = await mutateSnapshot(id, (file) => {
      file.snapshot.label = label
    })
    if (!ok) return false
    deps.snapshots.value = await listSnapshotSummaries()
    return true
  } catch (e) {
    console.warn("[snapshotMgmt] 设置标签失败", e)
    return false
  }
}

/** 获取完整快照（恢复/导出用） */
export async function getSnapshotFile(id: string): Promise<BackupFile | null> {
  return getSnapshotFileFromStore(id)
}

/** 写入外部导入的快照（IndexedDB + checksum + GFS + 上限裁剪） */
export async function appendImportedSnapshot(
  deps: SnapshotMgmtDeps,
  file: BackupFile
): Promise<void> {
  try {
    await appendImportedToStore(file, deps.settings.value)
    await reloadSummaries(deps)
  } catch (e) {
    console.warn("[snapshotMgmt] 追加导入快照失败", e)
  }
}

/**
 * 写入并持久化单个快照（导入流程用，含 checksum + 校验）。
 * 返回 ok=false 表示校验失败（损坏）。
 */
export async function persistImportedSnapshot(file: BackupFile): Promise<{ ok: boolean; error?: string }> {
  return persistSnapshot(file)
}
