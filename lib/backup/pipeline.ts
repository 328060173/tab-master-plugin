/**
 * 备份执行管道 - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * 把 runBackup 的核心步骤（采集 + 构建 + 写 IndexedDB + 写目录 + GFS 清理 + 状态更新）
 * 抽成纯函数，接收所需依赖（settings/state/snapshots 的 ref + 持久化回调）。
 * 调用方（useBackupService）传入 refs，函数返回最终结果。
 *
 * P0-4：快照真值落 IndexedDB（snapshotStore），不再写 storage.local cache。
 */

import { type Ref } from "vue"
import { APP_VERSION_CODE, APP_VERSION_NAME } from "~lib/api-config"
import { collectMeta, buildSnapshot } from "./snapshotBuilder"
import {
  BACKUP_KIND,
  BACKUP_SCHEMA_VERSION,
  type BackupFile,
  type BackupSettings,
  type BackupState,
  type SnapshotSummary,
} from "~types/backup"
import {
  gfsCleanupSnapshots,
  trimToMaxSnapshots,
  listSnapshotSummaries,
} from "./snapshotStore"
import { toSummary } from "./sanitize"

export interface PipelineDeps {
  settings: Ref<BackupSettings>
  state: Ref<BackupState>
  snapshots: Ref<SnapshotSummary[]>
  isBackingUp: Ref<boolean>
  lastProgress: Ref<string>
  /** 写状态到 storage.local（state 是元信息，仍在 storage.local） */
  saveState: () => Promise<void>
  /** 写快照到用户目录（双写降级） */
  writeSnapshotToDirSafe: (file: BackupFile) => Promise<{ ok: boolean; error?: string }>
  /** 获取缓存大小（getBytesInUse 或估算，用于 UI 占用展示） */
  getCacheBytesInUse: () => Promise<number>
  /** 获取/生成 deviceId */
  getDeviceId: () => Promise<string>
}

export interface PipelineResult {
  ok: boolean
  error?: string
  snapshot?: SnapshotSummary
  /** 完整快照文件（P0-4：供上层 coordination 写 IndexedDB / 校验） */
  file?: BackupFile
}

/** source 字符串映射到 SnapshotSource 类型 */
function mapSnapSource(source: string): "auto.timer" | "auto.event" | "manual" | "preRestore" | "import" {
  if (source === "auto.timer") return "auto.timer"
  if (source.startsWith("auto.event")) return "auto.event"
  if (source === "manual") return "manual"
  if (source === "preRestore") return "preRestore"
  return "import"
}

/** 采集标签 + 元数据 + 构建快照文件 */
async function buildBackupFile(deps: PipelineDeps, source: string, lastProgress: Ref<string>): Promise<BackupFile> {
  lastProgress.value = "采集标签…"
  const allTabs = await chrome.tabs.query({})
  lastProgress.value = "读取元数据…"
  const meta = await collectMeta()
  lastProgress.value = "构建快照…"
  const snapSource = mapSnapSource(source)
  const snapshot = await buildSnapshot(allTabs, meta, snapSource)
  snapshot.trigger = source
  const deviceId = await deps.getDeviceId()
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appVersionCode: APP_VERSION_CODE,
    appVersionName: APP_VERSION_NAME,
    kind: BACKUP_KIND,
    deviceId,
    customer: { id: null, type: "anonymous" },
    snapshot,
    signature: { algo: null, value: null },
  }
}

/** 写用户目录（双写降级），返回错误信息（null=成功/未开启） */
async function writeDir(deps: PipelineDeps, file: BackupFile, lastProgress: Ref<string>): Promise<string | null> {
  if (!deps.settings.value.dirEnabled) return null
  lastProgress.value = "写入目录…"
  const r = await deps.writeSnapshotToDirSafe(file)
  return r.ok ? null : (r.error || "目录写入失败")
}

/**
 * 执行一次备份。
 * @param source 触发源（auto.timer / auto.event.* / manual / preRestore / import）
 */
export async function runBackupPipeline(
  deps: PipelineDeps,
  source: string
): Promise<PipelineResult> {
  const { state, snapshots, isBackingUp, lastProgress } = deps
  if (isBackingUp.value) return { ok: false, error: "正在备份中…" }
  isBackingUp.value = true
  try {
    const file = await buildBackupFile(deps, source, lastProgress)
    // P0-4: 持久化（IndexedDB + checksum + 回读校验）由外层 coordination 统一负责，
    // pipeline 只负责 build + 目录写 + GFS + state，避免双写（修 D18）
    const dirError = await writeDir(deps, file, lastProgress)
    // GFS 清理 + 上限裁剪
    lastProgress.value = "清理旧快照…"
    await gfsCleanupSnapshots(deps.settings.value.retentionDays)
    await trimToMaxSnapshots(deps.settings.value.cacheMaxSnapshots)
    // 更新状态 + UI 列表
    const cacheBytes = await deps.getCacheBytesInUse()
    const summaries = await listSnapshotSummaries()
    state.value = {
      lastBackupAt: file.snapshot.createdAt,
      lastBackupSource: file.snapshot.source as BackupState["lastBackupSource"],
      lastBackupError: dirError ? `目录：${dirError}（本地缓存已写入）` : null,
      snapshotCount: summaries.length,
      cacheBytes,
    }
    await deps.saveState()
    snapshots.value = summaries
    const justWritten = summaries.find((s) => s.id === file.snapshot.id)
    return { ok: true, snapshot: justWritten ?? toSummary(file), file }
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
