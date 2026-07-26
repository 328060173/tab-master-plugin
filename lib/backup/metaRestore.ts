/**
 * 恢复元数据写回 - 修复"恢复流程不写回元数据"缺陷。
 *
 * 用户硬要求第7条："标记、稍后处理等其他设置，这些也要能存储导入和导出，也要预留出来云同步"
 * → 恢复快照时不仅恢复 tab（URL），还要恢复标记/稍后处理/最近关闭/分组/设置等元数据。
 *
 * 写回策略（保守，不丢用户数据）：
 * - customTags：并集（用户现有 + 快照的，去重）
 * - tabTagsMap：快照按 fingerprint 存，恢复时用 newTabId 重建映射（快照覆盖该 tabId 的现有标记）
 *   未匹配 fingerprint（快照有但当前浏览器没恢复出对应 tab）→ 跳过，计入 unmatchedTags
 * - laterTabs：按 url 去重并集；快照项转 LaterItem 形状（补齐 TabItem 必填字段，id 用负数避免与真实 tabId 冲突）
 * - recentlyClosed：按 url 去重并集，限长 50（稳定性红线①）
 * - tabMasterSettings：默认合并（只填空缺，不覆盖现有）；restoreSettings=true 时才动
 * - tabGroups：用 chrome.tabs.group + chrome.tabGroups.update 重建原生分组（按 tabFingerprints 找新 tabId）
 *
 * 守红线：
 * - 所有写走 safeSet + toPure
 * - 不调 chrome.sessions.setTabValue
 * - 不动 useTabManager 单例结构，只写 storage key（useTabManager 的 storage.onChanged 自动同步）
 * - chrome.tabs.group / chrome.tabGroups.update 用法已查 docs/googledocs 核实
 */

import { safeSet } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import type {
  BackupFile,
  TabGroupSnapshot,
} from "~types/backup"
import type { ClosedTabItem, LaterItem } from "~types/tab"

export interface MetaRestoreOptions {
  /** 是否恢复 tabMasterSettings 子集。默认 false（只动标记/稍后处理/分组） */
  restoreSettings?: boolean
  /** 是否恢复原生分组。默认 true */
  restoreGroups?: boolean
  /**
   * 用户在冲突界面手动指派的 fingerprint → tabId 映射（修 P0-3：手动指派结果写回）。
   * 这些是开 tab 时未自动匹配、用户手动选了"指派到当前某 tab"的项；
   * restoreMeta 合并进 fpToTabId，让这些标记也写回到用户指派的 tabId。
   */
  manualAssignments?: Map<string, number>
}

export interface MetaRestoreResult {
  /** 新增的 customTags 数量（并集后比原来多的） */
  customTagsMerged: number
  /** 成功写回 tabTagsMap 的条目数（按新 tabId） */
  tabTagsRestored: number
  /** 快照有标记但当前无对应 tab 的 fingerprint 数（未匹配） */
  tabTagsUnmatched: number
  /** 合并新增的 laterTabs 数 */
  laterTabsMerged: number
  /** 合并新增的 recentlyClosed 数 */
  recentlyClosedMerged: number
  /** 成功重建的原生分组数 */
  groupsRestored: number
  /** 跳过的分组数（无匹配 tab 或重建失败） */
  groupsSkipped: number
  /** 合并的 settings key 数（仅 restoreSettings=true 时有值） */
  settingsKeysMerged: number
  error?: string
}

function deriveDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/**
 * 恢复快照元数据到 storage.local + 重建原生分组。
 *
 * @param snapshot 要恢复的快照
 * @param fpToTabId fingerprint → 新 tabId 的映射（由 executeRestore 在开 tab 时建立）
 * @param opts 选项
 */
export async function restoreMeta(
  snapshot: BackupFile,
  fpToTabId: Map<string, number>,
  opts: MetaRestoreOptions = {}
): Promise<MetaRestoreResult> {
  const result: MetaRestoreResult = {
    customTagsMerged: 0,
    tabTagsRestored: 0,
    tabTagsUnmatched: 0,
    laterTabsMerged: 0,
    recentlyClosedMerged: 0,
    groupsRestored: 0,
    groupsSkipped: 0,
    settingsKeysMerged: 0,
  }
  const meta = snapshot.snapshot.meta
  const restoreGroups = opts.restoreGroups !== false

  // 合并用户手动指派（P0-3）：手动指派的 fingerprint→tabId 优先级高于自动匹配
  // 不直接改入参 fpToTabId（保持纯函数），用 merged map
  const mergedFpToTabId = new Map(fpToTabId)
  if (opts.manualAssignments) {
    for (const [fp, tabId] of opts.manualAssignments) {
      if (typeof tabId === "number") mergedFpToTabId.set(fp, tabId)
    }
  }

  try {
    const data = await chrome.storage.local.get([
      "customTags",
      "tabTagsMap",
      "laterTabs",
      "recentlyClosed",
      "tabMasterSettings",
    ])

    // 1. customTags 并集
    const existingCustomTags: string[] = Array.isArray(data.customTags)
      ? data.customTags.filter((x): x is string => typeof x === "string" && x.length > 0)
      : []
    const customTagsSet = new Set(existingCustomTags)
    for (const t of meta.customTags) {
      if (typeof t === "string" && t.length > 0 && !customTagsSet.has(t)) {
        customTagsSet.add(t)
        result.customTagsMerged++
      }
    }
    const newCustomTags = Array.from(customTagsSet)
    await safeSet({ customTags: toPure(newCustomTags) }, "backup.restore")

    // 2. tabTagsMap 按 fingerprint → 新 tabId 写回（快照覆盖该 tabId 现有标记）
    const existingTagsMap: Record<string, string[]> =
      data.tabTagsMap && typeof data.tabTagsMap === "object" && !Array.isArray(data.tabTagsMap)
        ? (data.tabTagsMap as Record<string, string[]>)
        : {}
    const newTagsMap: Record<string, string[]> = { ...existingTagsMap }
    for (const [fp, tags] of Object.entries(meta.tabTagsMap)) {
      if (!Array.isArray(tags)) continue
      const cleaned = tags.filter((x): x is string => typeof x === "string" && x.length > 0)
      if (!cleaned.length) continue
      const newTabId = mergedFpToTabId.get(fp)
      if (typeof newTabId !== "number") {
        result.tabTagsUnmatched++
        continue
      }
      // 快照覆盖（用户意图回到快照状态）
      newTagsMap[String(newTabId)] = cleaned
      result.tabTagsRestored++
    }
    await safeSet({ tabTagsMap: toPure(newTagsMap) }, "backup.restore")

    // 3. laterTabs 并集（按 url 去重）
    const existingLater: LaterItem[] = Array.isArray(data.laterTabs)
      ? (data.laterTabs as LaterItem[])
      : []
    const existingLaterUrls = new Set(
      existingLater.map((x) => (x && typeof x.url === "string" ? x.url : "")).filter(Boolean)
    )
    const mergedLater: LaterItem[] = [...existingLater]
    const nowBase = Date.now()
    for (let i = 0; i < meta.laterTabs.length; i++) {
      const lt = meta.laterTabs[i]
      if (!lt || typeof lt.url !== "string") continue
      if (existingLaterUrls.has(lt.url)) continue
      const id = -(nowBase + i) // 负数 id 避免与真实 tabId 冲突
      mergedLater.push({
        id,
        title: lt.title || lt.url,
        url: lt.url,
        domain: deriveDomain(lt.url),
        favIconUrl: "",
        pinned: false,
        active: false,
        audible: false,
        muted: false,
        discarded: false,
        frozen: false,
        loading: false,
        recording: false,
        sharing: false,
        attention: false,
        hasUnsavedForm: false,
        hasConnectedDevice: false,
        isProtected: false,
        openedAt: "",
        number: 0,
        tags: [],
        groupId: -1,
        laterNote: lt.note || "",
        laterAddedAt: new Date(lt.addedAt || nowBase).toISOString(),
      })
      result.laterTabsMerged++
    }
    await safeSet({ laterTabs: toPure(mergedLater) }, "backup.restore")

    // 4. recentlyClosed 并集（按 url 去重，限长 50）
    const existingClosed: ClosedTabItem[] = Array.isArray(data.recentlyClosed)
      ? (data.recentlyClosed as ClosedTabItem[])
      : []
    const existingClosedUrls = new Set(
      existingClosed.map((x) => (x && typeof x.url === "string" ? x.url : "")).filter(Boolean)
    )
    const mergedClosed: ClosedTabItem[] = [...existingClosed]
    for (let i = 0; i < meta.recentlyClosed.length; i++) {
      const ct = meta.recentlyClosed[i]
      if (!ct || typeof ct.url !== "string") continue
      if (existingClosedUrls.has(ct.url)) continue
      mergedClosed.push({
        id: -(nowBase + i + 10000),
        title: ct.title || ct.url,
        url: ct.url,
        domain: deriveDomain(ct.url),
        favIconUrl: "",
        closedAt: new Date(ct.closedAt || nowBase).toISOString(),
      })
      result.recentlyClosedMerged++
    }
    const trimmedClosed = mergedClosed.slice(0, 50)
    await safeSet({ recentlyClosed: toPure(trimmedClosed) }, "backup.restore")

    // 5. tabMasterSettings 合并（默认只填空缺，不覆盖现有）
    if (opts.restoreSettings && meta.settings && typeof meta.settings === "object") {
      const existingSettings: Record<string, unknown> =
        data.tabMasterSettings && typeof data.tabMasterSettings === "object"
          ? (data.tabMasterSettings as Record<string, unknown>)
          : {}
      const mergedSettings: Record<string, unknown> = { ...existingSettings }
      for (const [k, v] of Object.entries(meta.settings)) {
        if (!(k in mergedSettings)) {
          mergedSettings[k] = v
          result.settingsKeysMerged++
        }
      }
      await safeSet({ tabMasterSettings: toPure(mergedSettings) }, "backup.restore")
    }

    // 6. tabGroups 重建原生分组
    if (restoreGroups) {
      await restoreTabGroups(meta.tabGroups, mergedFpToTabId, result)
    }

    return result
  } catch (e) {
    result.error = e instanceof Error ? e.message : String(e)
    console.warn("[metaRestore] 失败", e)
    return result
  }
}

/** 重建原生分组：按 fingerprint 找新 tabId → chrome.tabs.group → chrome.tabGroups.update */
async function restoreTabGroups(
  groups: TabGroupSnapshot[],
  fpToTabId: Map<string, number>,
  result: MetaRestoreResult
): Promise<void> {
  for (const g of groups) {
    if (!g || !Array.isArray(g.tabFingerprints) || !g.tabFingerprints.length) {
      result.groupsSkipped++
      continue
    }
    const tabIds: number[] = []
    for (const fp of g.tabFingerprints) {
      const tid = fpToTabId.get(fp)
      if (typeof tid === "number") tabIds.push(tid)
    }
    if (!tabIds.length) {
      result.groupsSkipped++
      continue
    }
    try {
      // chrome.tabs.group: tabs 必须同窗口（恢复时所有新 tab 都在当前窗口，OK）
      const groupId = await chrome.tabs.group({ tabIds })
      // chrome.tabGroups.update: title/color/collapsed 可选；undefined 表示不改
      await chrome.tabGroups.update(groupId, {
        title: g.title || undefined,
        color: (g.color as chrome.tabGroups.Color | undefined) || undefined,
        collapsed: !!g.collapsed,
      })
      result.groupsRestored++
    } catch (e) {
      console.warn("[metaRestore] 重建分组失败", g.title, e)
      result.groupsSkipped++
    }
  }
}
