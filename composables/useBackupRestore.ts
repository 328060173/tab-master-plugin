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
  previewRestore as computeRestorePreview,
  resolveConflicts,
  executeRestore,
  type CurrentTab,
  type TabToOpen,
} from "~lib/backup/restore"
import { computeFingerprint, computeWeakFingerprint, uuidV4 } from "~lib/backup/fingerprint"
import { tryAcquireCoord, releaseCoord } from "~lib/backup/coordination"
import { restoreMeta, type MetaRestoreOptions, type MetaRestoreResult } from "~lib/backup/metaRestore"
import { openTabs } from "~lib/backup/openTabs"
import { APP_VERSION_CODE, APP_VERSION_NAME } from "~lib/api-config"
import { buildSnapshot, collectMeta } from "~lib/backup/snapshotBuilder"
import type { BackupFile, ConflictItem, FpUnmatchedItem, RestoreMode, RestorePreview, TabSnapshot, WindowSnapshot } from "~types/backup"

/** 简化还原目标（§8.6 OneTab 风格三档） */
export type OpenTarget = 'current' | 'newWindow' | 'selected'

export interface OpenSnapshotOptions {
  /** target='selected' 时必填：用户勾选的 fingerprint 集合 */
  selectedFingerprints?: Set<string>
  /** target='selected' 时：true=新窗口打开选中，false=本窗口打开选中 */
  openInNewWindow?: boolean
  /** 是否跳过当前已打开的同 URL 标签。默认 true（去重）。false=全部重新打开（含重复） */
  skipDuplicateUrls?: boolean
}

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
      const p = computeRestorePreview(file, currentTabs)
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

  /**
   * 简化还原（§8.6 OneTab 风格三档，§10.6 方案 A 自动写回元数据）。
   * - target='current'：把该备份标签补开到当前窗口（同 URL 已存在不重开），不关任何当前 tab
   * - target='newWindow'：按备份 windows[] 结构新建窗口还原（每个非隐身窗口一个新窗口），不关任何当前 tab
   * - target='selected'：仅打开用户勾选的标签（selectedFingerprints），openInNewWindow 决定本窗口/新窗口
   * 元数据方案 A：还原后自动写回标记/稍后/分组（走 restoreMeta 合并语义），用户无感
   */
  async function openSnapshot(
    snapshotId: string,
    target: OpenTarget,
    options: OpenSnapshotOptions = {},
  ): Promise<{ ok: boolean; openedCount: number; closedCount: number; error?: string; metaResult?: MetaRestoreResult }> {
    const traceId = uuidV4()
    if (!(await tryAcquireCoord(traceId))) {
      return { ok: false, openedCount: 0, closedCount: 0, error: '备份进行中，请稍后再试' }
    }
    isRestoring.value = true
    try {
      const file = await svc.getSnapshotFile(snapshotId)
      if (!file) return { ok: false, openedCount: 0, closedCount: 0, error: '快照不存在' }
      const allTabs = await chrome.tabs.query({})
      const currentUrls = new Set<string>()
      for (const t of allTabs) {
        if (t.url) currentUrls.add(t.url)
      }
      const selFps = options.selectedFingerprints
      const skipDup = options.skipDuplicateUrls !== false
      const filterTab = (tab: TabSnapshot): boolean => {
        if (target === 'selected') {
          return !!selFps && selFps.has(tab.fingerprint)
        }
        return true
      }
      // 构建要打开的窗口分组（保留快照多窗口结构；skipDup=true 跳过已存在同 URL，false 全开含重复）
      const snapshotWindows: WindowSnapshot[] = file.snapshot.windows.filter((w) => !w.incognito)
      const windowsToOpen: { tabs: TabToOpen[]; focused: boolean }[] = []
      let firstFocused = true
      for (const w of snapshotWindows) {
        const winTabs: TabToOpen[] = []
        for (const t of w.tabs) {
          if (!filterTab(t)) continue
          if (skipDup && currentUrls.has(t.url)) continue
          winTabs.push({ url: t.url, pinned: t.pinned, title: t.title, fingerprint: t.fingerprint })
        }
        if (winTabs.length > 0) {
          windowsToOpen.push({ tabs: winTabs, focused: firstFocused })
          firstFocused = false
        }
      }
      // current / selected+本窗口：合并到当前窗口
      if (target === 'current' || (target === 'selected' && !options.openInNewWindow)) {
        const allTabsToOpen: TabToOpen[] = windowsToOpen.flatMap((w) => w.tabs)
        if (allTabsToOpen.length === 0) {
          return { ok: true, openedCount: 0, closedCount: 0 }
        }
        return await doOpenInCurrentWindow(file, allTabsToOpen)
      }
      // newWindow / selected+新窗口：按窗口分组新建窗口还原
      if (windowsToOpen.length === 0) {
        return { ok: true, openedCount: 0, closedCount: 0 }
      }
      return await doOpenInNewWindows(file, windowsToOpen)
    } catch (e) {
      return { ok: false, openedCount: 0, closedCount: 0, error: e instanceof Error ? e.message : String(e) }
    } finally {
      isRestoring.value = false
      await releaseCoord()
    }
  }

  /**
   * 预览还原：返回备份里标签总数 / 当前已打开（重复）数 / 待打开数。不实际打开标签。
   * target='selected' 时按 selectedFingerprints 过滤；隐身窗口标签不计入（与 openSnapshot 一致）。
   */
  async function previewRestore(
    snapshotId: string,
    target: OpenTarget,
    options: OpenSnapshotOptions = {},
  ): Promise<{ ok: boolean; total: number; duplicate: number; toOpen: number; error?: string }> {
    try {
      const file = await svc.getSnapshotFile(snapshotId)
      if (!file) return { ok: false, total: 0, duplicate: 0, toOpen: 0, error: '快照不存在' }
      const allTabs = await chrome.tabs.query({})
      const currentUrls = new Set<string>()
      for (const t of allTabs) {
        if (t.url) currentUrls.add(t.url)
      }
      const selFps = options.selectedFingerprints
      const filterTab = (tab: TabSnapshot): boolean => {
        if (target === 'selected') {
          return !!selFps && selFps.has(tab.fingerprint)
        }
        return true
      }
      let total = 0
      let duplicate = 0
      for (const w of file.snapshot.windows) {
        if (w.incognito) continue
        for (const t of w.tabs) {
          if (!filterTab(t)) continue
          total++
          if (currentUrls.has(t.url)) duplicate++
        }
      }
      return { ok: true, total, duplicate, toOpen: total - duplicate }
    } catch (e) {
      return { ok: false, total: 0, duplicate: 0, toOpen: 0, error: e instanceof Error ? e.message : String(e) }
    }
  }

  /** 把标签补开到当前窗口 + 写回元数据（元数据方案 A） */
  async function doOpenInCurrentWindow(
    file: BackupFile,
    tabsToOpen: TabToOpen[],
  ): Promise<{ ok: boolean; openedCount: number; closedCount: number; error?: string; metaResult?: MetaRestoreResult }> {
    const fpToTabId = new Map<string, number>()
    try {
      // 调用方已按 currentUrls 过滤过重复 url，这里 skipDuplicateUrls=false 直接开
      const openedCount = await openTabs({
        windows: [{ tabs: tabsToOpen.map((t) => ({ url: t.url, pinned: t.pinned, fingerprint: t.fingerprint })) }],
        openInNewWindow: false,
        skipDuplicateUrls: false,
        onTabOpened: (item, tabId) => {
          if (item.fingerprint && typeof tabId === 'number') {
            fpToTabId.set(item.fingerprint, tabId)
          }
        },
      })
      const metaResult = await writeBackMeta(file, fpToTabId)
      return { ok: true, openedCount, closedCount: 0, metaResult }
    } catch (e) {
      return { ok: false, openedCount: 0, closedCount: 0, error: e instanceof Error ? e.message : String(e) }
    }
  }

  /** 按窗口分组新建窗口还原 + 写回元数据（守 C1：多窗口分别 create） */
  async function doOpenInNewWindows(
    file: BackupFile,
    windowsToOpen: { tabs: TabToOpen[]; focused: boolean }[],
  ): Promise<{ ok: boolean; openedCount: number; closedCount: number; error?: string; metaResult?: MetaRestoreResult }> {
    const fpToTabId = new Map<string, number>()
    try {
      const openedCount = await openTabs({
        windows: windowsToOpen.map((w) => ({
          tabs: w.tabs.map((t) => ({ url: t.url, pinned: t.pinned, fingerprint: t.fingerprint })),
          focused: w.focused,
        })),
        openInNewWindow: true,
        skipDuplicateUrls: false,
        onTabOpened: (item, tabId) => {
          if (item.fingerprint && typeof tabId === 'number') {
            fpToTabId.set(item.fingerprint, tabId)
          }
        },
      })
      const metaResult = await writeBackMeta(file, fpToTabId)
      return { ok: true, openedCount, closedCount: 0, metaResult }
    } catch (e) {
      return { ok: false, openedCount: 0, closedCount: 0, error: e instanceof Error ? e.message : String(e) }
    }
  }

  /** 元数据方案 A：写回标记/稍后/分组（走 restoreMeta 合并语义，用户无感） */
  async function writeBackMeta(file: BackupFile, fpToTabId: Map<string, number>): Promise<MetaRestoreResult | undefined> {
    const restoreMetaOn = svc.settings.value.restoreMetaOnRestore !== false
    if (!restoreMetaOn) return undefined
    const tagCount = Object.keys(file.snapshot.meta.tabTagsMap).length
    const laterCount = file.snapshot.meta.laterTabs.length
    const groupCount = file.snapshot.meta.tabGroups.length
    if (tagCount || laterCount || groupCount) {
      showToast(`正在恢复 ${tagCount} 个标记 / ${laterCount} 个稍后处理 / ${groupCount} 个分组…`)
    }
    const opts: MetaRestoreOptions = { mode: 'mergeAuto' }
    return await restoreMeta(file, fpToTabId, opts)
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
    openSnapshot,
    previewRestore,
  }
}
