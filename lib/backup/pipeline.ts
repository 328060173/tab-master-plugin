/**
 * 备份执行管道 - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * 把 runBackup 的核心步骤（采集 + 构建 + 写缓存 + 写目录 + GFS 清理 + 状态更新）
 * 抽成纯函数，接收所需依赖（settings/state/snapshots 的 ref + 持久化回调）。
 * 调用方（useBackupService）传入 refs，函数返回最终结果。
 */

import { ref, type Ref } from "vue"
import { APP_VERSION_CODE, APP_VERSION_NAME } from "~lib/api-config"
import { collectMeta, buildSnapshot } from "./snapshotBuilder"
import { uuidV4 } from "./fingerprint"
import { selectGfsRemovable } from "./gfs"
import { safeSet } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import {
  BACKUP_KEYS,
  BACKUP_KIND,
  BACKUP_SCHEMA_VERSION,
  type BackupFile,
  type BackupSettings,
  type BackupState,
  type SnapshotSummary,
} from "~types/backup"
import {
  sanitizeSnapshotList,
  toSummary,
} from "./sanitize"

export interface PipelineDeps {
  settings: Ref<BackupSettings>
  state: Ref<BackupState>
  snapshots: Ref<SnapshotSummary[]>
  isBackingUp: Ref<boolean>
  lastProgress: Ref<string>
  /** 写缓存数组到 storage.local */
  saveCache: (list: BackupFile[]) => Promise<void>
  saveState: () => Promise<void>
  /** 写快照到用户目录（双写降级） */
  writeSnapshotToDirSafe: (file: BackupFile) => Promise<{ ok: boolean; error?: string }>
  /** 获取缓存大小（getBytesInUse 或估算） */
  getCacheBytesInUse: () => Promise<number>
  /** 获取/生成 deviceId */
  getDeviceId: () => Promise<string>
}

export interface PipelineResult {
  ok: boolean
  error?: string
  snapshot?: SnapshotSummary
}

/**
 * 执行一次备份。
 * @param source 触发源（auto.timer / auto.event.* / manual / preRestore / import）
 */
export async function runBackupPipeline(
  deps: PipelineDeps,
  source: string
): Promise<PipelineResult> {
  const { settings, state, snapshots, isBackingUp, lastProgress } = deps
  if (isBackingUp.value) return { ok: false, error: "正在备份中…" }
  isBackingUp.value = true
  lastProgress.value = "采集标签…"
  try {
    const allTabs = await chrome.tabs.query({})
    lastProgress.value = "读取元数据…"
    const meta = await collectMeta()
    lastProgress.value = "构建快照…"
    // source 映射到 snapshot.source（SnapshotSource 类型）
    const snapSource: "auto.timer" | "auto.event" | "manual" | "preRestore" | "import" =
      source === "auto.timer" ? "auto.timer"
      : source.startsWith("auto.event") ? "auto.event"
      : source === "manual" ? "manual"
      : source === "preRestore" ? "preRestore"
      : "import"
    const snapshot = await buildSnapshot(allTabs, meta, snapSource)
    snapshot.trigger = source
    const deviceId = await deps.getDeviceId()
    const file: BackupFile = {
      schemaVersion: BACKUP_SCHEMA_VERSION,
      appVersionCode: APP_VERSION_CODE,
      appVersionName: APP_VERSION_NAME,
      kind: BACKUP_KIND,
      deviceId,
      customer: { id: null, type: "anonymous" },
      snapshot,
      signature: { algo: null, value: null },
    }
    // 写缓存（如开启）
    let cacheList: BackupFile[] = []
    if (settings.value.cacheEnabled) {
      lastProgress.value = "写入缓存…"
      const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
      cacheList = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
      cacheList.push(file)
      while (cacheList.length > settings.value.cacheMaxSnapshots) {
        const idx = cacheList.findIndex((f) => !f.snapshot.locked)
        if (idx === -1) break
        cacheList.splice(idx, 1)
      }
      await deps.saveCache(cacheList)
    } else {
      const data = await chrome.storage.local.get(BACKUP_KEYS.cache)
      cacheList = sanitizeSnapshotList(data[BACKUP_KEYS.cache])
    }
    // 写目录（如开启）
    let dirError: string | null = null
    if (settings.value.dirEnabled) {
      lastProgress.value = "写入目录…"
      const r = await deps.writeSnapshotToDirSafe(file)
      if (!r.ok) dirError = r.error || "目录写入失败"
    }
    // GFS 清理
    lastProgress.value = "清理旧快照…"
    const removable = selectGfsRemovable(cacheList, Date.now(), settings.value.retentionDays)
    if (removable.length) {
      cacheList = cacheList.filter((f) => !removable.includes(f.snapshot.id))
      if (settings.value.cacheEnabled) await deps.saveCache(cacheList)
    }
    // 更新状态
    const cacheBytes = await deps.getCacheBytesInUse()
    state.value = {
      lastBackupAt: snapshot.createdAt,
      lastBackupSource: snapSource as BackupState["lastBackupSource"],
      lastBackupError: dirError ? `目录：${dirError}（本地缓存已写入）` : null,
      snapshotCount: cacheList.length,
      cacheBytes,
    }
    await deps.saveState()
    snapshots.value = cacheList.map(toSummary).sort((a, b) => b.createdAt - a.createdAt)
    return { ok: true, snapshot: toSummary(file) }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    state.value.lastBackupError = msg
    await deps.saveState()
    console.warn("[backup pipeline] 失败", e)
    return { ok: false, error: msg }
  } finally {
    isBackingUp.value = false
    lastProgress.value = ""
  }
}

/** 手动备份持久化辅助：写缓存数组到 storage.local */
export async function persistCacheList(list: BackupFile[]): Promise<void> {
  await safeSet({ [BACKUP_KEYS.cache]: toPure(list) }, "backup")
}
