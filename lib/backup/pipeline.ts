/**
 * 备份执行管道 - 抽离自 useBackupService.ts（红线 .ts ≤ 500）
 *
 * 把 runBackup 的核心步骤（采集 + 构建 + 写 IndexedDB + 写目录 + 保留策略清理 + 状态更新）
 * 抽成纯函数，接收所需依赖（settings/state/snapshots 的 ref + 持久化回调）。
 * 调用方（useBackupService）传入 refs，函数返回最终结果。
 *
 * P0-4：快照真值落 IndexedDB（snapshotStore），不再写 storage.local cache。
 */

import { type Ref } from "vue"
import { APP_VERSION_CODE, APP_VERSION_NAME } from "~lib/api-config"
import { t, tWithParams } from "~lib/i18n"
import { collectMeta, buildSnapshot, type BuildSnapshotOptions } from "./snapshotBuilder"
import {
  BACKUP_KIND,
  BACKUP_SCHEMA_VERSION,
  currentLimits,
  type BackupFile,
  type BackupSettings,
  type BackupState,
  type SnapshotSource,
  type SnapshotSummary,
} from "~types/backup"
import {
  persistSnapshot,
  trimExpiredSnapshots,
  trimToMaxSnapshots,
  listSnapshotSummaries,
} from "./snapshotStore"
import { toSummary } from "./sanitize"
import { uuidV4 } from "./fingerprint"
import { filterBackupableTabs } from "./urlFilter"

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
async function buildBackupFile(
  deps: PipelineDeps,
  source: string,
  lastProgress: Ref<string>,
  options?: { selectedTabIds?: number[] },
): Promise<BackupFile> {
  lastProgress.value = t("backup.lib.collectTabs")
  const allTabs = await chrome.tabs.query({})
  lastProgress.value = t("backup.lib.readMeta")
  const meta = await collectMeta()
  lastProgress.value = t("backup.lib.buildSnapshot")
  const snapSource = mapSnapSource(source)
  // §10.8：手动备份选部分标签 → 传 selectedTabIds 子集
  // §3.2：非手动路径（auto.*/preRestore/import）超 maxTabsPerSnapshot → 自动截断到前 N 个
  const isManual = source === 'manual'
  let buildOpts: BuildSnapshotOptions | undefined
  if (options?.selectedTabIds && options.selectedTabIds.length > 0) {
    buildOpts = { selectedTabIds: options.selectedTabIds, totalTabCount: allTabs.length }
  } else if (!isManual) {
    buildOpts = { truncateAt: currentLimits().maxTabsPerSnapshot, totalTabCount: allTabs.length }
  }
  const snapshot = await buildSnapshot(allTabs, meta, snapSource, buildOpts)
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
  lastProgress.value = t("backup.lib.writeDir")
  const r = await deps.writeSnapshotToDirSafe(file)
  return r.ok ? null : (r.error || t("backup.lib.dirWriteFailed"))
}

/**
 * 构造失败快照（§2.2 失败也落库）。
 * 备份执行失败时构造一条 status='failed' 的记录写入 IndexedDB，让列表能显示失败记录。
 * - windows=[]（无标签数据）
 * - stats 全 0（无实际标签统计）
 * - status='failed'，errorMessage=失败原因
 * - 不计入保留上限（trimToMaxSnapshots / trimExpiredSnapshots / getManualOverLimitCount 均跳过 status='failed'）
 */
async function buildFailedFile(
  deps: PipelineDeps,
  source: string,
  errorMessage: string,
): Promise<BackupFile> {
  const now = Date.now()
  const snapSource = mapSnapSource(source)
  const deviceId = await deps.getDeviceId()
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appVersionCode: APP_VERSION_CODE,
    appVersionName: APP_VERSION_NAME,
    kind: BACKUP_KIND,
    deviceId,
    customer: { id: null, type: 'anonymous' },
    snapshot: {
      id: uuidV4(),
      createdAt: now,
      createdAtISO: new Date(now).toISOString(),
      source: snapSource as SnapshotSource,
      trigger: source,
      label: null,
      status: 'failed',
      errorMessage,
      windows: [],
      meta: {
        customTags: [],
        tabTagsMap: {},
        tabGroups: [],
        laterTabs: [],
        recentlyClosed: [],
        settings: null,
      },
      stats: {
        tabCount: 0,
        windowCount: 0,
        pinnedCount: 0,
        groupCount: 0,
        taggedCount: 0,
        laterCount: 0,
      },
    },
    signature: { algo: null, value: null },
  }
}

/** runBackupPipeline 的可选参数（§10.8 手动备份选部分标签） */
export interface RunPipelineOptions {
  /**
   * 手动备份选了哪些标签（按 tabId）。仅 manual 路径使用。
   * 不传 / 空数组 = 全量备份（自动备份/事件备份/preRestore/import 路径行为不变）。
   */
  selectedTabIds?: number[]
}

/**
 * 执行一次备份。
 * @param source 触发源（auto.timer / auto.event.* / manual / preRestore / import）
 * @param options §10.8 手动备份选部分标签时传 selectedTabIds
 */
export async function runBackupPipeline(
  deps: PipelineDeps,
  source: string,
  options?: RunPipelineOptions,
): Promise<PipelineResult> {
  const { state, snapshots, isBackingUp, lastProgress } = deps
  if (isBackingUp.value) return { ok: false, error: t("backup.lib.backingUp") }
  // 配额 gate（2026-07-28 立）：超 cacheQuotaBytes 则不自动备份，提示用户清理手动备份。
  // - 只对自动备份生效（source !== 'manual'）。手动备份不受限（用户主动操作，让他备）。
  // - 失败不落库（这是配额拦截，不是备份失败，不该进失败列表）。
  // - 不拼魔法值，阈值用 settings.cacheQuotaBytes（默认 30MB，会员档 80MB 预留）。
  // - 提示文案落到 state.lastBackupError（BackupOverviewTab amber 状态条会显示）。
  if (source !== 'manual') {
    const used = await deps.getCacheBytesInUse()
    const quota = deps.settings.value.cacheQuotaBytes
    if (used >= quota) {
      const usedMB = Math.round(used / 1024 / 1024)
      const quotaMB = Math.round(quota / 1024 / 1024)
      state.value.lastBackupError = tWithParams("backup.lib.cacheFull", { used: usedMB, quota: quotaMB })
      await deps.saveState()
      return { ok: false, error: t("backup.lib.cacheFullShort") }
    }
  }
  // 0 标签 gate（2026-07-28 立）：自动/事件/preRestore 后台备份，无标签不落空快照。
  // - 只对非 manual 生效（manual 走 UI 层 toast 阻断，让用户主动路径有明确提示）。
  // - 失败不落库（这是数据空拦截，不是备份失败，不该进失败列表）。
  // - buildBackupFile 内部也 query，这里多查一次（UI 上下文，轻），可接受。
  if (source !== 'manual') {
    const allTabs = await chrome.tabs.query({})
    if (filterBackupableTabs(allTabs).length === 0) {
      return { ok: false, error: t("backup.lib.noTabs") }
    }
  }
  isBackingUp.value = true
  try {
    const file = await buildBackupFile(deps, source, lastProgress, options)
    // P0-4: 持久化（IndexedDB + checksum + 回读校验）由外层 coordination 统一负责，
    // pipeline 只负责 build + 目录写 + 保留策略清理 + state，避免双写（修 D18）
    const dirError = await writeDir(deps, file, lastProgress)
    // 保留策略清理（2026-07-28 重构：废 GFS 分层，改纯按条数 + 按天数）
    // - trimExpiredSnapshots：删超过 retentionDays 的 auto.* 非失败项
    // - trimToMaxSnapshots：auto.* 项超 cacheMaxSnapshots 时删最早的
    // 手动/导入/preRestore 永不自动删；失败快照不参与裁剪。
    lastProgress.value = t("backup.lib.cleanOldSnapshots")
    await trimExpiredSnapshots(deps.settings.value.retentionDays)
    await trimToMaxSnapshots(deps.settings.value.cacheMaxSnapshots)
    // 更新状态 + UI 列表
    const cacheBytes = await deps.getCacheBytesInUse()
    const summaries = await listSnapshotSummaries()
    state.value = {
      lastBackupAt: file.snapshot.createdAt,
      lastBackupSource: file.snapshot.source as BackupState["lastBackupSource"],
      lastBackupError: dirError ? tWithParams("backup.lib.dirError", { error: dirError }) : null,
      snapshotCount: summaries.length,
      cacheBytes,
    }
    await deps.saveState()
    snapshots.value = summaries
    const justWritten = summaries.find((s) => s.id === file.snapshot.id)
    return { ok: true, snapshot: justWritten ?? toSummary(file), file }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    // §2.2 失败也落库：构造 failed 快照写入 IndexedDB，让列表能显示失败记录。
    // 失败快照不计入保留上限（trimToMaxSnapshots 跳过 status='failed'），不挤掉成功备份。
    // persistSnapshot 失败不影响主流程（已在 catch 中，不再抛）。
    try {
      const failedFile = await buildFailedFile(deps, source, msg)
      const persist = await persistSnapshot(failedFile)
      if (persist.ok) {
        // 失败快照不触发 trim（跳过保留策略裁剪，避免误删成功备份）
        // 刷新 UI 列表（让用户看到失败记录）
        const summaries = await listSnapshotSummaries()
        snapshots.value = summaries
        const cacheBytes = await deps.getCacheBytesInUse()
        state.value = {
          lastBackupAt: failedFile.snapshot.createdAt,
          lastBackupSource: failedFile.snapshot.source as BackupState["lastBackupSource"],
          lastBackupError: msg,
          snapshotCount: summaries.length,
          cacheBytes,
        }
        await deps.saveState()
        return { ok: false, error: msg, snapshot: toSummary(failedFile) }
      }
    } catch (inner) {
      console.warn("[backup pipeline] 失败快照落库也失败", inner)
    }
    state.value.lastBackupError = msg
    await deps.saveState()
    console.warn("[backup pipeline] 失败", e)
    return { ok: false, error: msg }
  } finally {
    isBackingUp.value = false
    lastProgress.value = ""
  }
}
