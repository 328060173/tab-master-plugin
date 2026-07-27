/**
 * 快照构建器 - 从 chrome.tabs 全量数据 + storage 元数据组装 Snapshot。
 *
 * 抽离自 useBackupService 以控制单文件行数（红线 .ts ≤ 500）。
 * 纯异步函数，不持有状态、不读写 storage（deviceId 由调用方传入）。
 *
 * 守红线：
 * - 只读不写老 key（customTags/tabTagsMap/laterTabs/recentlyClosed/tabGroups/tabMasterSettings）
 * - tabTagsMap 侧用 fingerprint 作 key（不用 tabId），重启后能对得上
 * - 不调 chrome.windows（项目既有约定），incognito 从 Tab.incognito 派生
 */

import {
  computeFingerprint,
  computeWeakFingerprint,
  normalizeUrl,
  uuidV4,
} from "~lib/backup/fingerprint"
import type {
  ClosedTabSnapshot,
  LaterTabSnapshot,
  Snapshot,
  TabGroupSnapshot,
  TabSnapshot,
  WindowSnapshot,
} from "~types/backup"

const META_KEYS_TO_READ = [
  "customTags",
  "tabTagsMap",
  "laterTabs",
  "recentlyClosed",
  "tabGroups",
  "tabMasterSettings",
] as const

/** 读 storage 元数据（不修改老 key） */
export async function collectMeta(): Promise<{
  customTags: string[]
  /** 按 tabId 的映射（待转换为按 fingerprint） */
  tabTagsMapByTabId: Record<string, string[]>
  laterTabsRaw: unknown[]
  recentlyClosedRaw: unknown[]
  settingsRaw: Record<string, unknown> | null
}> {
  const data = await chrome.storage.local.get(META_KEYS_TO_READ as unknown as string[])
  const customTags = Array.isArray(data.customTags)
    ? data.customTags.filter((x): x is string => typeof x === "string" && x.length > 0)
    : []
  const rawTagsMap =
    data.tabTagsMap && typeof data.tabTagsMap === "object" && !Array.isArray(data.tabTagsMap)
      ? (data.tabTagsMap as Record<string, unknown>)
      : {}
  const cleanTagsMap: Record<string, string[]> = {}
  for (const [k, v] of Object.entries(rawTagsMap)) {
    if (Array.isArray(v)) {
      const cleaned = v.filter((x): x is string => typeof x === "string" && x.length > 0)
      if (cleaned.length) cleanTagsMap[k] = cleaned
    }
  }
  return {
    customTags,
    tabTagsMapByTabId: cleanTagsMap,
    laterTabsRaw: Array.isArray(data.laterTabs) ? data.laterTabs : [],
    recentlyClosedRaw: Array.isArray(data.recentlyClosed) ? data.recentlyClosed : [],
    settingsRaw:
      data.tabMasterSettings && typeof data.tabMasterSettings === "object"
        ? (data.tabMasterSettings as Record<string, unknown>)
        : null,
  }
}

/** buildSnapshot 的可选参数（§10.8 手动备份选部分标签） */
export interface BuildSnapshotOptions {
  /**
   * 手动备份选了哪些标签（按 tabId）。提供时：
   * - 仅把这些标签写入快照（窗口结构按这些标签的 windowId 重建，可能只剩部分窗口）
   * - stats.selectedTabCount / totalTabCount 写入，备份列表显示「12/34」
   * 不提供时（自动备份/事件备份/preRestore/import 路径）：保持全量行为不变
   */
  selectedTabIds?: number[]
  /** 当时浏览器全量标签数（用于 totalTabCount 显示），由调用方传入避免重复 query */
  totalTabCount?: number
}

/** 从 chrome.tabs.query({}) 全量 + storage 元数据构建一个 Snapshot */
export async function buildSnapshot(
  allTabs: chrome.tabs.Tab[],
  meta: Awaited<ReturnType<typeof collectMeta>>,
  source: Snapshot["source"],
  options?: BuildSnapshotOptions,
): Promise<Snapshot> {
  // §10.8：手动备份选部分标签 → 过滤 allTabs 只保留选中的（含其窗口结构/标记/稍后）
  const effectiveTabs = options?.selectedTabIds && options.selectedTabIds.length > 0
    ? filterTabsByIds(allTabs, options.selectedTabIds)
    : allTabs
  const selectedCount = options?.selectedTabIds ? options.selectedTabIds.length : effectiveTabs.length
  const totalCount = options?.totalTabCount ?? allTabs.length
  // 1. tabId -> fingerprint（基于实际写入快照的 effectiveTabs，未选中的 tab 不进 fingerprint 表）
  const tabIdToFp = new Map<number, string>()
  const windowsMap = new Map<number, chrome.tabs.Tab[]>()
  for (const t of effectiveTabs) {
    if (typeof t.id !== "number") continue
    const fp = await computeFingerprint(t.url || "", t.title || "")
    tabIdToFp.set(t.id, fp)
    if (!windowsMap.has(t.windowId)) windowsMap.set(t.windowId, [])
    windowsMap.get(t.windowId)!.push(t)
  }
  // 2. tabTagsMap by fingerprint（替换 tabId key）— 仅保留 effectiveTabs 命中的标记
  const newTagsMap: Record<string, string[]> = {}
  let taggedCount = 0
  for (const [tabIdStr, tags] of Object.entries(meta.tabTagsMapByTabId)) {
    const tid = Number(tabIdStr)
    if (!Number.isFinite(tid)) continue
    const fp = tabIdToFp.get(tid)
    if (!fp) continue
    newTagsMap[fp] = tags
    taggedCount++
  }
  // 3. tabGroups 快照（按 fingerprint）— 仅保留 effectiveTabs 命中的分组
  const groupSnapshots: TabGroupSnapshot[] = []
  try {
    const allGroups = await chrome.tabGroups.query({})
    const groupIdToFp = new Map<number, string[]>()
    for (const t of effectiveTabs) {
      if (typeof t.id !== "number" || typeof t.groupId !== "number") continue
      if (t.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) continue
      const fp = tabIdToFp.get(t.id)
      if (!fp) continue
      if (!groupIdToFp.has(t.groupId)) groupIdToFp.set(t.groupId, [])
      groupIdToFp.get(t.groupId)!.push(fp)
    }
    for (const g of allGroups) {
      const fps = groupIdToFp.get(g.id)
      if (!fps || !fps.length) continue
      groupSnapshots.push({
        title: g.title || "",
        color: g.color || "gray",
        collapsed: !!g.collapsed,
        tabFingerprints: fps,
      })
    }
  } catch (e) {
    console.warn("[snapshotBuilder] tabGroups 采集失败", e)
  }
  // 4. WindowSnapshot[]（不调 chrome.windows，incognito 从 Tab 派生）
  const windowIds = Array.from(windowsMap.keys()).sort((a, b) => a - b)
  const windows: WindowSnapshot[] = []
  for (let i = 0; i < windowIds.length; i++) {
    const wid = windowIds[i]
    const tabsInWin = windowsMap
      .get(wid)!
      .slice()
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    const tabSnaps: TabSnapshot[] = []
    let windowIncognito = false
    let windowFocused = false
    for (const t of tabsInWin) {
      const fp = typeof t.id === "number" ? tabIdToFp.get(t.id) || "" : ""
      const weakFp = await computeWeakFingerprint(t.url || "")
      if (t.incognito) windowIncognito = true
      if (t.active) windowFocused = true
      // lastAccessed @types/chrome 0.0.258 未声明，按项目既有模式 as 兜底
      const nativeLastAccessed = (t as unknown as { lastAccessed?: number }).lastAccessed
      tabSnaps.push({
        index: t.index ?? 0,
        url: t.url || "",
        urlNormalized: normalizeUrl(t.url || ""),
        title: t.title || "",
        fingerprint: fp,
        fingerprintWeak: weakFp,
        pinned: !!t.pinned,
        muted: !!t.mutedInfo?.muted,
        groupId: typeof t.groupId === "number" ? t.groupId : chrome.tabGroups.TAB_GROUP_ID_NONE,
        groupTitle: null,
        groupColor: null,
        openerTabFingerprint:
          typeof t.openerTabId === "number" ? tabIdToFp.get(t.openerTabId) || null : null,
        lastAccessed: typeof nativeLastAccessed === "number" ? nativeLastAccessed : null,
        openedAt: null,
      })
    }
    windows.push({
      windowId: wid,
      relativeIndex: i,
      focused: windowFocused,
      state: "normal",
      incognito: windowIncognito,
      tabs: tabSnaps,
    })
  }
  // 5. laterTabs / recentlyClosed 转 fingerprint
  const laterSnaps: LaterTabSnapshot[] = []
  for (const item of meta.laterTabsRaw as Array<{
    url?: string
    title?: string
    laterAddedAt?: string
    laterNote?: string
  }>) {
    if (!item || typeof item.url !== "string") continue
    const fp = await computeFingerprint(item.url, item.title || "")
    laterSnaps.push({
      url: item.url,
      urlNormalized: normalizeUrl(item.url),
      title: item.title || "",
      fingerprint: fp,
      addedAt: item.laterAddedAt ? Date.parse(item.laterAddedAt) || Date.now() : Date.now(),
      note: item.laterNote || null,
    })
  }
  const closedSnaps: ClosedTabSnapshot[] = []
  for (const item of meta.recentlyClosedRaw as Array<{
    url?: string
    title?: string
    closedAt?: string
  }>) {
    if (!item || typeof item.url !== "string") continue
    const fp = await computeFingerprint(item.url, item.title || "")
    closedSnaps.push({
      url: item.url,
      fingerprint: fp,
      title: item.title || "",
      closedAt: item.closedAt ? Date.parse(item.closedAt) || Date.now() : Date.now(),
    })
  }
  // 6. 组装
  const now = Date.now()
  return {
    id: uuidV4(),
    createdAt: now,
    createdAtISO: new Date(now).toISOString(),
    source,
    trigger: null,
    locked: false,
    lockedReason: null,
    label: null,
    windows,
    meta: {
      customTags: meta.customTags,
      tabTagsMap: newTagsMap,
      tabGroups: groupSnapshots,
      laterTabs: laterSnaps,
      recentlyClosed: closedSnaps,
      settings: meta.settingsRaw,
    },
    stats: {
      tabCount: effectiveTabs.length,
      windowCount: windows.length,
      pinnedCount: effectiveTabs.filter((t) => t.pinned).length,
      groupCount: groupSnapshots.length,
      taggedCount,
      laterCount: laterSnaps.length,
      // §10.8：手动备份选部分时记录 selectedTabCount/totalTabCount，备份列表显示「12/34」
      // 全量路径不传 options，两个值保持 undefined（向后兼容老快照读取）
      selectedTabCount: options?.selectedTabIds ? selectedCount : undefined,
      totalTabCount: options?.selectedTabIds ? totalCount : undefined,
    },
  }
}

/**
 * 按 tabId 子集过滤标签（§10.8）。
 * - 保留所有有效 id 的 tab（去重）
 * - 不调 chrome.tabs.get（避免多次 IPC）；调用方已传入全量 tabs
 */
function filterTabsByIds(allTabs: chrome.tabs.Tab[], tabIds: number[]): chrome.tabs.Tab[] {
  const idSet = new Set(tabIds)
  const seen = new Set<number>()
  const out: chrome.tabs.Tab[] = []
  for (const t of allTabs) {
    if (typeof t.id !== "number") continue
    if (!idSet.has(t.id)) continue
    if (seen.has(t.id)) continue
    seen.add(t.id)
    out.push(t)
  }
  return out
}
