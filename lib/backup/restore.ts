/**
 * 恢复 + 冲突检测 + fingerprint 匹配 - PRD §F / §4.2 / §4.7.A
 *
 * 守红线（PRD §9 Non-Goals）：
 * - 绝不自动合并，绝不强行绑定 fingerprint
 * - 冲突永远用户手动裁决（每项 radio）
 * - 未匹配项标红，可手动指派或跳过
 * - 隐身窗口默认不恢复（不问，预览告知）
 *
 * 三种恢复方式（PRD §4.7.B）：
 * - replace：先存恢复前快照→关当前所有标签→按快照重建。提供撤销。
 * - selected：仅替换用户在冲突界面选中的项（最保守）
 * - append：仅追加（不关任何当前标签，只补开快照里有但当前没有的）
 */

import type {
  BackupFile,
  ConflictItem,
  FpUnmatchedItem,
  RestoreMode,
  RestorePreview,
  SnapshotMeta,
  TabSnapshot,
} from "~types/backup"
import {
  mergeMeta,
  restoreTabGroups,
  type MetaMergeResult,
  type GroupRestoreResult,
} from "./metaRestore"
import { openTabs, type OpenWindowGroup } from "./openTabs"
import { t, tWithParams } from "~lib/i18n"

/** 当前浏览器标签（用于冲突检测/匹配） */
export interface CurrentTab {
  tabId: number
  windowId: number
  url: string
  title: string
  fingerprint: string
  fingerprintWeak: string
  pinned: boolean
  index: number
}

/** 收集当前所有非隐身窗口的 tab + 计算指纹（指纹由调用方传入预算好的 map） */
export async function collectCurrentTabs(
  allTabs: chrome.tabs.Tab[],
  fingerprintOf: (url: string, title: string) => Promise<string>,
  weakFingerprintOf: (url: string) => Promise<string>
): Promise<CurrentTab[]> {
  const out: CurrentTab[] = []
  for (const t of allTabs) {
    if (t.incognito) continue
    if (typeof t.id !== "number") continue
    const url = t.url || ""
    const title = t.title || ""
    out.push({
      tabId: t.id,
      windowId: t.windowId,
      url,
      title,
      fingerprint: await fingerprintOf(url, title),
      fingerprintWeak: await weakFingerprintOf(url),
      pinned: !!t.pinned,
      index: t.index ?? 0,
    })
  }
  return out
}

/**
 * 预览恢复：检测冲突 + 列未匹配项
 * 不修改浏览器状态，纯计算。
 */
export function previewRestore(
  snapshot: BackupFile,
  currentTabs: CurrentTab[]
): RestorePreview {
  const conflicts: ConflictItem[] = []
  const unmatched: FpUnmatchedItem[] = []
  // 当前浏览器按 fingerprint 索引（强指纹）
  const currentByFp = new Map<string, CurrentTab>()
  for (const ct of currentTabs) {
    if (ct.fingerprint) currentByFp.set(ct.fingerprint, ct)
  }
  // 当前浏览器按弱指纹分组
  const currentByWeakFp = new Map<string, CurrentTab[]>()
  for (const ct of currentTabs) {
    if (!ct.fingerprintWeak) continue
    const arr = currentByWeakFp.get(ct.fingerprintWeak) || []
    arr.push(ct)
    currentByWeakFp.set(ct.fingerprintWeak, arr)
  }
  // 快照 tab 与当前对比
  const snapshotTabs = snapshot.snapshot.windows.flatMap((w) =>
    w.tabs.map((t) => ({ tab: t, windowIncognito: w.incognito }))
  )
  const nonIncognitoTabs = snapshotTabs.filter((x) => !x.windowIncognito)
  let onlySnapshotCount = 0
  let urlMismatchCount = 0
  for (const { tab } of nonIncognitoTabs) {
    const hit = currentByFp.get(tab.fingerprint)
    if (hit) {
      // 强指纹命中：URL/title 一致，无冲突
      continue
    }
    // 强指纹未命中：检查弱指纹
    const weakHits = tab.fingerprintWeak ? currentByWeakFp.get(tab.fingerprintWeak) || [] : []
    if (weakHits.length === 1) {
      // 弱指纹唯一命中但强指纹不同 → URL 不同冲突
      const cur = weakHits[0]
      conflicts.push({
        id: `cf-${tab.fingerprint.slice(0, 8)}`,
        kind: "url_mismatch",
        recommended: "snapshot",
        choice: "snapshot",
        label: tab.title || tab.url,
        snapshotSide: `${tab.url}`,
        currentSide: `${cur.url}`,
      })
      urlMismatchCount++
    } else if (weakHits.length > 1) {
      // 弱指纹多命中：同 URL 多开，无法 100% 区分（PRD §4.2 第 3 条限制）
      // 列为未匹配让用户手动指派
      unmatched.push({
        id: `um-${tab.fingerprint.slice(0, 8)}`,
        label: tWithParams('restore.conflict.sameUrlMulti', { label: tab.title || tab.url }),
        fingerprint: tab.fingerprint,
        strongHitTabId: null,
        candidates: weakHits.map((c) => ({ tabId: c.tabId, title: c.title, url: c.url })),
        assignTo: null,
      })
    } else {
      // 弱指纹也未命中：仅在快照里
      onlySnapshotCount++
      conflicts.push({
        id: `cf-${tab.fingerprint.slice(0, 8)}`,
        kind: "only_snapshot",
        recommended: "snapshot",
        choice: "snapshot",
        label: tab.title || tab.url,
        snapshotSide: `${tab.url}`,
        currentSide: t('restore.conflict.emptyCurrent'),
      })
    }
  }
  // 当前侧独有的 tab（快照里没有）
  const snapshotFps = new Set(nonIncognitoTabs.map((x) => x.tab.fingerprint))
  for (const ct of currentTabs) {
    if (!snapshotFps.has(ct.fingerprint)) {
      conflicts.push({
        id: `cf-cur-${ct.tabId}`,
        kind: "only_current",
        recommended: "current",
        choice: "current",
        label: ct.title || ct.url,
        snapshotSide: t('restore.conflict.emptySnapshot'),
        currentSide: `${ct.url}`,
      })
    }
  }
  // 未匹配标记：快照里有标记但当前浏览器无对应 fingerprint
  const meta: SnapshotMeta = snapshot.snapshot.meta
  const currentFpSet = new Set(currentTabs.map((c) => c.fingerprint))
  for (const [fp, tags] of Object.entries(meta.tabTagsMap)) {
    if (!currentFpSet.has(fp)) {
      // 找弱指纹候选
      const weakCandidates: CurrentTab[] = []
      // 这里 fp 是强指纹；要从快照 windows 里查它对应的 url/title 才能算弱指纹
      const snapTab = nonIncognitoTabs.find((x) => x.tab.fingerprint === fp)
      if (!snapTab) continue
      const weakFp = snapTab.tab.fingerprintWeak
      const cands = weakFp ? currentByWeakFp.get(weakFp) || [] : []
      weakCandidates.push(...cands)
      unmatched.push({
        id: `um-tag-${fp.slice(0, 8)}`,
        label: tWithParams('restore.unmatched.tagBound', { tags: tags.join('/'), url: snapTab.tab.url }),
        fingerprint: fp,
        strongHitTabId: null,
        candidates: weakCandidates.map((c) => ({ tabId: c.tabId, title: c.title, url: c.url })),
        assignTo: null,
      })
    }
  }
  return {
    snapshotId: snapshot.snapshot.id,
    tabCount: nonIncognitoTabs.length,
    windowCount: snapshot.snapshot.windows.filter((w) => !w.incognito).length,
    incognitoWindowCount: snapshot.snapshot.windows.filter((w) => w.incognito).length,
    taggedCount: Object.keys(meta.tabTagsMap).length,
    conflicts,
    unmatched,
  }
}

/** 要打开的 tab 描述（含 fingerprint 用于元数据写回） */
export interface TabToOpen {
  url: string
  pinned: boolean
  /** 快照里该 tab 的 title（用于元数据写回时的指纹校验） */
  title?: string
  /** 快照里该 tab 的 fingerprint（开新 tab 后用此 fingerprint 关联元数据） */
  fingerprint?: string
}

/** 要重建的窗口（P0-2：多窗口恢复，按快照窗口结构重建） */
export interface WindowToOpen {
  tabs: TabToOpen[]
  /** 是否聚焦该窗口（快照里第一个非隐身窗口聚焦） */
  focused: boolean
  /** 窗口状态（最大化/最小化/正常，从快照恢复） */
  state?: "normal" | "maximized" | "minimized"
}

/**
 * 应用冲突决策（用户在 UI 上选择后调）：根据 choice 重新计算需要恢复的 tab 列表
 * 返回 windows（按快照窗口分组，用于多窗口重建）+ tabsToOpen（扁平，向后兼容）+ 要关闭的当前 tabId
 */
export function resolveConflicts(
  snapshot: BackupFile,
  currentTabs: CurrentTab[],
  conflicts: ConflictItem[],
  mode: RestoreMode
): { windows: WindowToOpen[]; tabsToOpen: TabToOpen[]; closeCurrentTabIds: number[] } {
  const windows: WindowToOpen[] = []
  const closeCurrentTabIds: number[] = []
  // 快照 windows 里 url → tab 快照（用于 selected 模式补 title/fingerprint）
  const snapTabByUrl = new Map<string, { url: string; title: string; fingerprint: string; pinned: boolean }>()
  for (const w of snapshot.snapshot.windows) {
    if (w.incognito) continue
    for (const t of w.tabs) {
      snapTabByUrl.set(t.url, { url: t.url, title: t.title, fingerprint: t.fingerprint, pinned: t.pinned })
    }
  }
  if (mode === "mergeAuto") {
    // 合并(自动) ★推荐（设计稿 §4.3）：
    // - tabs 按 fingerprint 去重保留当前的（不补开同 URL 多开，与 append 区分）
    // - 不关任何当前 tab
    // - 按窗口分组补开快照独有的（保留多窗口结构）
    const currentFpSet = new Set<string>()
    for (const c of currentTabs) {
      if (c.fingerprint) currentFpSet.add(c.fingerprint)
    }
    let firstNonIncognito = true
    for (const w of snapshot.snapshot.windows) {
      if (w.incognito) continue
      const winTabs: TabToOpen[] = []
      for (const t of w.tabs) {
        if (currentFpSet.has(t.fingerprint)) continue // 同 URL 保留当前的，不重开
        winTabs.push({ url: t.url, pinned: t.pinned, title: t.title, fingerprint: t.fingerprint })
      }
      if (winTabs.length) {
        windows.push({ tabs: winTabs, focused: firstNonIncognito, state: w.state })
        firstNonIncognito = false
      }
    }
    const tabsToOpen = windows.flatMap((w) => w.tabs)
    return { windows, tabsToOpen, closeCurrentTabIds }
  }
  if (mode === "append") {
    // 仅追加：不关任何当前标签，补开快照里有但当前不够数量的。
    // 同 URL 多开场景：快照里有 3 个同 fingerprint 的 tab、当前只有 1 个 → 补开 2 个（按数量补差额，不丢 tab）。
    const currentFpCounts = new Map<string, number>()
    for (const c of currentTabs) {
      if (!c.fingerprint) continue
      currentFpCounts.set(c.fingerprint, (currentFpCounts.get(c.fingerprint) || 0) + 1)
    }
    // append 模式按窗口分组补开（保留多窗口结构）
    let firstNonIncognito = true
    for (const w of snapshot.snapshot.windows) {
      if (w.incognito) continue
      const winTabs: TabToOpen[] = []
      for (const t of w.tabs) {
        const remain = currentFpCounts.get(t.fingerprint) || 0
        if (remain > 0) {
          currentFpCounts.set(t.fingerprint, remain - 1)
        } else {
          winTabs.push({ url: t.url, pinned: t.pinned, title: t.title, fingerprint: t.fingerprint })
        }
      }
      if (winTabs.length) {
        windows.push({ tabs: winTabs, focused: firstNonIncognito, state: w.state })
        firstNonIncognito = false
      }
    }
    const tabsToOpen = windows.flatMap((w) => w.tabs)
    return { windows, tabsToOpen, closeCurrentTabIds }
  }
  if (mode === "selected") {
    // 仅替换选中项：只动 choice !== 'current' 的项
    // selected 模式不重建多窗口（只替换零散 tab），全部开到当前窗口
    const tabsToOpen: TabToOpen[] = []
    for (const c of conflicts) {
      if (c.choice === "current") continue
      // 用 fingerprint 精确匹配当前 tab（修 P1-4：原 url 字符串匹配会关错同 URL tab）
      // c.id 格式 cf-cur-<tabId>（only_current）或 cf-<fp前8>（url_mismatch/only_snapshot）
      if (c.id.startsWith("cf-cur-")) {
        const tabId = Number(c.id.replace("cf-cur-", ""))
        if (tabId && c.choice !== "both") closeCurrentTabIds.push(tabId)
      } else {
        // url_mismatch：用 snapshotSide 反查 fingerprint 找当前 tab
        const snap = snapTabByUrl.get(c.snapshotSide)
        if (snap) {
          const curMatch = currentTabs.find((ct) => ct.fingerprint === snap.fingerprint || ct.url === c.currentSide)
          if (curMatch && c.choice !== "both") closeCurrentTabIds.push(curMatch.tabId)
        }
      }
      if (c.snapshotSide && c.snapshotSide !== t('restore.conflict.emptyCurrent')) {
        const snap = snapTabByUrl.get(c.snapshotSide)
        tabsToOpen.push({
          url: c.snapshotSide,
          pinned: false,
          title: snap?.title,
          fingerprint: snap?.fingerprint,
        })
      }
    }
    windows.push({ tabs: tabsToOpen, focused: true })
    return { windows, tabsToOpen, closeCurrentTabIds }
  }
  // replace：整体替换，按快照窗口结构重建多窗口
  let firstNonIncognito = true
  for (const w of snapshot.snapshot.windows) {
    if (w.incognito) continue
    const winTabs: TabToOpen[] = w.tabs.map((t) => ({
      url: t.url,
      pinned: t.pinned,
      title: t.title,
      fingerprint: t.fingerprint,
    }))
    windows.push({ tabs: winTabs, focused: firstNonIncognito, state: w.state })
    firstNonIncognito = false
  }
  // 关闭所有当前 tab
  for (const ct of currentTabs) {
    closeCurrentTabIds.push(ct.tabId)
  }
  const tabsToOpen = windows.flatMap((w) => w.tabs)
  return { windows, tabsToOpen, closeCurrentTabIds }
}

export interface ExecuteRestoreOptions {
  /** 要恢复的快照（用于元数据写回）。提供且 restoreMeta=true 时才写回元数据 */
  snapshot?: BackupFile
  /** 是否写回元数据（标记/稍后处理/分组）。默认 false */
  restoreMeta?: boolean
  /**
   * 用户在冲突界面手动指派的 fingerprint → tabId 映射（P0-3：手动指派结果写回）。
   * 调用方在调 mergeMeta 前合并进 fpToTabId（保持 mergeMeta 纯函数）。
   */
  manualAssignments?: Map<string, number>
}

export interface ExecuteRestoreResult {
  openedCount: number
  closedCount: number
  error?: string
  /** 元数据写回结果（restoreMeta=true 时有值） */
  metaResult?: MetaRestoreResult
}

/** 元数据写回组合结果（mergeMeta + restoreTabGroups 合并） */
export interface MetaRestoreResult extends MetaMergeResult, GroupRestoreResult {}

/**
 * 执行恢复：按窗口结构重建多窗口 + 关闭旧 tab；可选写回元数据。
 * 不直接处理 preRestoreSnapshot（调用方负责保存恢复前快照）。
 *
 * 多窗口重建策略（P0-2）：
 * - 若提供 windows（按快照窗口分组）：第一个窗口复用当前窗口（在其开 tab），后续窗口用 chrome.windows.create 新建
 * - 若未提供 windows（向后兼容 selected/undo）：全部在当前窗口逐个开
 *
 * 元数据写回流程（2026-07-28 重构：mergeMeta + restoreTabGroups 分离）：
 * 1. 开新 tab（按窗口分组），记录 fingerprint → 新 tabId 映射
 * 2. chrome.tabs.remove 关旧 tab
 * 3. 若 restoreMeta=true 且 snapshot 提供：
 *    a. 把 manualAssignments 合并进 fpToTabId（保持 mergeMeta 纯函数）
 *    b. 调 mergeMeta 写回 customTags + tabTagsMap + laterTabs
 *    c. 调 restoreTabGroups 重建原生分组（chrome.tabs.group + chrome.tabGroups.update）
 *    d. 合并两组结果返回
 */
export async function executeRestore(
  tabsToOpen: TabToOpen[],
  closeCurrentTabIds: number[],
  options: ExecuteRestoreOptions = {},
  /** 按窗口分组的 tab 列表（P0-2 多窗口重建）。不提供则全部在当前窗口开。 */
  windows?: WindowToOpen[]
): Promise<ExecuteRestoreResult> {
  let openedCount = 0
  let closedCount = 0
  // fingerprint → 新 tabId 映射（元数据写回用）
  const fpToTabId = new Map<string, number>()
  try {
    // 收口到 openTabs：把 windows（按窗口分组）/ tabsToOpen（扁平，向后兼容）
    // 统一转成 OpenTabsOptions 调用。元数据写回通过 onTabOpened 收集 fp→tabId。
    //
    // 多窗口重建语义（P0-2，保行为不变）：
    // - 有 windows 时：第一个窗口复用当前窗口（openInNewWindow=false），
    //   后续窗口新建（openInNewWindow=true），与原实现一致
    // - 无 windows（selected/undo 扁平路径）：全部开到当前窗口
    const hasWindows = !!windows && windows.length > 0
    const groups: OpenWindowGroup[] = hasWindows
      ? windows!.map((w, idx) => ({
          tabs: w.tabs.map((t) => ({
            url: t.url,
            pinned: t.pinned,
            fingerprint: t.fingerprint,
          })),
          focused: w.focused,
          state: w.state,
          // 第一个窗口复用当前窗口，后续窗口新建（保 P0-2 行为）
          openInNewWindow: idx !== 0,
        }))
      : [
          {
            tabs: tabsToOpen.map((t) => ({
              url: t.url,
              pinned: t.pinned,
              fingerprint: t.fingerprint,
            })),
          },
        ]
    // restore 路径已由 resolveConflicts 算好要开的列表，不重复跳过已开同 url
    openedCount = await openTabs({
      windows: groups,
      // 全局默认 true（被首组的 per-group false 覆盖时复用当前窗口）
      openInNewWindow: hasWindows ? true : false,
      skipDuplicateUrls: false,
      onTabOpened: (item, tabId) => {
        if (item.fingerprint && typeof tabId === "number") {
          fpToTabId.set(item.fingerprint, tabId)
        }
      },
    })
    if (closeCurrentTabIds.length) {
      try {
        await chrome.tabs.remove(closeCurrentTabIds)
        closedCount = closeCurrentTabIds.length
      } catch (e) {
        console.warn("[restore] 关闭 tab 失败", e)
      }
    }
    // 元数据写回（开/关 tab 完成后）
    if (options.restoreMeta && options.snapshot) {
      // 合并用户手动指派（P0-3）：让未匹配的标记也写回到用户指派的 tabId。
      // 在调 mergeMeta 前合并进 fpToTabId（保持 mergeMeta 纯函数，无 opts 参数）
      if (options.manualAssignments) {
        for (const [fp, tabId] of options.manualAssignments) {
          if (typeof tabId === "number") fpToTabId.set(fp, tabId)
        }
      }
      const metaResult = await writeBackMetaCombined(options.snapshot, fpToTabId)
      return { openedCount, closedCount, metaResult }
    }
    return { openedCount, closedCount }
  } catch (e) {
    return { openedCount, closedCount, error: e instanceof Error ? e.message : String(e) }
  }
}

/**
 * 元数据写回组合（mergeMeta + restoreTabGroups）。
 * 导入/还原共用：mergeMeta 写 customTags/tabTagsMap/laterTabs，restoreTabGroups 重建原生分组。
 */
export async function writeBackMetaCombined(
  file: BackupFile,
  fpToTabId: Map<string, number>
): Promise<MetaRestoreResult> {
  const meta = mergeMeta(file, fpToTabId)
  const groups = restoreTabGroups(file.snapshot.meta.tabGroups, fpToTabId)
  const [m, g] = await Promise.all([meta, groups])
  return {
    tagsAdded: m.tagsAdded,
    tagsApplied: m.tagsApplied,
    laterAdded: m.laterAdded,
    error: m.error || g.error,
    groupsRestored: g.groupsRestored,
    groupsSkipped: g.groupsSkipped,
  }
}

/**
 * 计算选中标签里与当前已打开重复的数量（导入预览 / 还原预览共用）。
 *
 * @param tabs 候选标签集合（已按 selectedFps 过滤由调用方做或在此做均可——
 *   本函数按 selectedFps 过滤；隐身窗口由调用方剔除，本函数不再判断）
 * @param selectedFps 用户勾选的 fingerprint 集合；空集表示全选
 * @returns { total, duplicate, toOpen }
 *
 * 守红线：chrome.tabs.query 失败时返回全 0（不抛）；纯计算不改浏览器状态。
 */
export async function computeDuplicateFromTabs(
  tabs: TabSnapshot[],
  selectedFps: Set<string>
): Promise<{ total: number; duplicate: number; toOpen: number }> {
  let allTabs: chrome.tabs.Tab[] = []
  try {
    allTabs = await chrome.tabs.query({})
  } catch {
    return { total: 0, duplicate: 0, toOpen: 0 }
  }
  const currentUrls = new Set<string>()
  for (const t of allTabs) {
    if (t.url) currentUrls.add(t.url)
  }
  const fpsEmpty = selectedFps.size === 0
  let total = 0
  let duplicate = 0
  for (const t of tabs) {
    if (!t || typeof t.url !== "string" || !t.url) continue
    if (!fpsEmpty && !selectedFps.has(t.fingerprint)) continue
    total++
    if (currentUrls.has(t.url)) duplicate++
  }
  return { total, duplicate, toOpen: Math.max(0, total - duplicate) }
}
