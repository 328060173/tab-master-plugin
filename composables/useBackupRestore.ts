/**
 * 备份恢复流程 composable - 基于 useBackupService 单例
 * 职责：恢复预览（含冲突检测）+ 恢复执行（三选一）+ 撤销
 *
 * 守红线：
 * - 绝不自动合并；冲突永远 UI 让用户逐项选
 * - 隐身窗口默认不恢复（不问，预览告知）
 * - 仅"整体替换"提供撤销路径
 */

import { ref } from "vue"
import { useBackupService } from "./useBackupService"
import { showToast } from "./useToast"
import {
  collectCurrentTabs,
  previewRestore,
  resolveConflicts,
  executeRestore,
  type CurrentTab,
} from "~lib/backup/restore"
import { computeFingerprint, computeWeakFingerprint, uuidV4 } from "~lib/backup/fingerprint"
import { tryAcquireCoord, releaseCoord } from "~lib/backup/coordination"
import { APP_VERSION_CODE, APP_VERSION_NAME } from "~lib/api-config"
import { buildSnapshot, collectMeta } from "~lib/backup/snapshotBuilder"
import type { MetaRestoreResult } from "~lib/backup/metaRestore"
import type {
  BackupFile,
  ConflictItem,
  FpUnmatchedItem,
  RestoreMode,
  RestorePreview,
} from "~types/backup"

// 单例化（修 R-1：backup.vue 与 BackupRestorePanel.vue 各调一次会拿到不同实例，
// 导致 preview/conflicts/unmatched 不共享，execute 侧永远拿空，手动指派/全部接受推荐失效）
let _restoreInstance: ReturnType<typeof useBackupRestoreImpl> | null = null

export function useBackupRestore() {
  if (!_restoreInstance) {
    _restoreInstance = useBackupRestoreImpl()
  }
  return _restoreInstance
}

function useBackupRestoreImpl() {
  const svc = useBackupService()

  const preview = ref<RestorePreview | null>(null)
  const isPreviewing = ref(false)
  const isRestoring = ref(false)
  const conflicts = ref<ConflictItem[]>([])
  const unmatched = ref<FpUnmatchedItem[]>([])

  /** 生成恢复预览（含冲突检测 + fingerprint 匹配） */
  async function generatePreview(snapshotId: string): Promise<RestorePreview | null> {
    isPreviewing.value = true
    try {
      const file = await svc.getSnapshotFile(snapshotId)
      if (!file) return null
      const allTabs = await chrome.tabs.query({})
      const currentTabs: CurrentTab[] = await collectCurrentTabs(
        allTabs,
        computeFingerprint,
        computeWeakFingerprint
      )
      const p = previewRestore(file, currentTabs)
      preview.value = p
      conflicts.value = p.conflicts.map((c) => ({ ...c }))
      unmatched.value = p.unmatched.map((u) => ({ ...u }))
      return p
    } finally {
      isPreviewing.value = false
    }
  }

  function setConflictChoice(id: string, choice: ConflictItem["choice"]) {
    const c = conflicts.value.find((x) => x.id === id)
    if (c) c.choice = choice
  }
  function acceptAllRecommended() {
    for (const c of conflicts.value) c.choice = c.recommended
  }
  function setUnmatchedAssign(id: string, tabId: number | null) {
    const u = unmatched.value.find((x) => x.id === id)
    if (u) u.assignTo = tabId
  }

  /** 从未匹配项提取用户手动指派的 fingerprint→tabId 映射（P0-3：手动指派结果写回） */
  function buildManualAssignments(items: FpUnmatchedItem[]): Map<string, number> {
    const m = new Map<string, number>()
    for (const u of items) {
      // assignTo === -1 表示用户选"跳过"，不写回；null 表示未指派
      if (typeof u.assignTo === "number" && u.assignTo > 0 && u.fingerprint) {
        m.set(u.fingerprint, u.assignTo)
      }
    }
    return m
  }

  /**
   * 执行恢复
   * @param snapshotId 要恢复的快照 id
   * @param mode 恢复方式
   * @returns 恢复结果（含元数据写回统计）
   */
  async function execute(
    snapshotId: string,
    mode: RestoreMode
  ): Promise<{ ok: boolean; openedCount: number; closedCount: number; error?: string; canUndo: boolean; metaResult?: MetaRestoreResult }> {
    // P0-4 协调锁：恢复也是写操作（开/关 tab + 写元数据），防并发
    const traceId = uuidV4()
    if (!(await tryAcquireCoord(traceId))) {
      return { ok: false, openedCount: 0, closedCount: 0, error: "备份进行中，请稍后再试", canUndo: false }
    }
    isRestoring.value = true
    try {
      const file = await svc.getSnapshotFile(snapshotId)
      if (!file) return { ok: false, openedCount: 0, closedCount: 0, error: "快照不存在", canUndo: false }
      const allTabs = await chrome.tabs.query({})
      const currentTabs = await collectCurrentTabs(
        allTabs,
        computeFingerprint,
        computeWeakFingerprint
      )
      const { windows, tabsToOpen, closeCurrentTabIds } = resolveConflicts(
        file,
        currentTabs,
        conflicts.value,
        mode
      )
      // 整体替换：先保存恢复前快照
      let canUndo = false
      if (mode === "replace") {
        const meta = await collectMeta()
        const preSnapshot = await buildSnapshot(allTabs, meta, "preRestore")
        const preFile: BackupFile = {
          schemaVersion: file.schemaVersion,
          appVersionCode: APP_VERSION_CODE,
          appVersionName: APP_VERSION_NAME,
          kind: file.kind,
          deviceId: file.deviceId,
          customer: file.customer,
          snapshot: preSnapshot,
          signature: { algo: null, value: null },
        }
        await svc.setUndoSnapshot(preFile)
        canUndo = true
      }
      // 元数据写回（用户硬要求第7条：标记/稍后处理/设置也要能恢复）
      const restoreMetaOn = svc.settings.value.restoreMetaOnRestore !== false
      const snapMeta = file.snapshot.meta
      if (restoreMetaOn) {
        const tagCount = Object.keys(snapMeta.tabTagsMap).length
        const laterCount = snapMeta.laterTabs.length
        const groupCount = snapMeta.tabGroups.length
        showToast(`正在恢复 ${tagCount} 个标记 / ${laterCount} 个稍后处理 / ${groupCount} 个分组…`)
      }
      const r = await executeRestore(tabsToOpen, closeCurrentTabIds, {
        restoreMeta: restoreMetaOn,
        snapshot: file,
        // 元数据按 mode 分发（设计稿 §4.3：replace=覆盖 / append=只加 / mergeAuto·selected=并集）
        metaOptions: { mode },
        // 手动指派结果写回（P0-3）：用户在未匹配界面指派的 fingerprint→tabId
        manualAssignments: buildManualAssignments(unmatched.value),
      }, windows)
      return { ...r, ok: !r.error, canUndo }
    } catch (e) {
      return { ok: false, openedCount: 0, closedCount: 0, error: e instanceof Error ? e.message : String(e), canUndo: false }
    } finally {
      isRestoring.value = false
      await releaseCoord()
    }
  }

  /** 撤销恢复（仅整体替换方式有效） */
  async function undoRestore(): Promise<{ ok: boolean; openedCount: number; closedCount: number; error?: string }> {
    const u = svc.undo.value
    if (!u.preRestoreSnapshot) return { ok: false, openedCount: 0, closedCount: 0, error: "无可撤销的恢复" }
    const file = u.preRestoreSnapshot
    await svc.clearUndo()
    // 用恢复前快照执行一次 replace（同时写回元数据以完全还原）
    const allTabs = await chrome.tabs.query({})
    const currentTabs = await collectCurrentTabs(
      allTabs,
      computeFingerprint,
      computeWeakFingerprint
    )
    const { windows, tabsToOpen, closeCurrentTabIds } = resolveConflicts(file, currentTabs, [], "replace")
    const restoreMetaOn = svc.settings.value.restoreMetaOnRestore !== false
    const r = await executeRestore(tabsToOpen, closeCurrentTabIds, {
      restoreMeta: restoreMetaOn,
      snapshot: file,
    }, windows)
    return { ...r, ok: !r.error }
  }

  return {
    preview,
    isPreviewing,
    isRestoring,
    conflicts,
    unmatched,
    generatePreview,
    setConflictChoice,
    acceptAllRecommended,
    setUnmatchedAssign,
    execute,
    undoRestore,
  }
}
