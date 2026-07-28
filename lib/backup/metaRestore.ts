/**
 * 元数据合并写回 - 导入 / 还原统一入口（2026-07-28 重构）。
 *
 * 用户决策（2026-07-28 重构）：导入与还原合并逻辑统一——
 * 原两份重复逻辑（importers/ours.ts:mergeImportedMeta + metaRestore.ts:restoreMeta）
 * 合并成本文件的 mergeMeta 一套逻辑（追加去重 + tabId key），删 mode 分支。
 *
 * 用户硬要求第7条："标记、稍后处理等其他设置，这些也要能存储导入和导出，也要预留出来云同步"
 * → 导入/还原快照时不仅恢复 tab（URL），还要恢复标记/稍后处理/分组等元数据。
 *
 * mergeMeta 写回策略（保守，不丢用户数据）：
 * - customTags：并集（用户现有 + 快照的，去重）
 * - tabTagsMap：按 fingerprint 关联回恢复的标签。
 *   仅对 fpToTabId.keys()（用户实际恢复的 fingerprint）+ 新增标记名才写；
 *   已存在的标记名跳过（不动已有关联）。
 *   ⚠️ sidepanel 运行时 tabTagsMap 按 **tabId** 作 key（useTabManager.ts 一致），
 *   备份/导出按 fingerprint 作 key（跨会话稳定）——还原时必须把 fingerprint key 转成
 *   当前新 tabId key 写 storage，否则 sidepanel 重读时 savedTags[String(tabId)] 查不到 →
 *   标签 tags 空、计数 0（bug 根因）。
 * - laterTabs：按 url 去重并集；快照项转 LaterItem 形状（补齐 TabItem 必填字段，id 用负数避免与真实 tabId 冲突）
 *
 * 分组重建（restoreTabGroups）保留为独立导出函数：
 * - 用 chrome.tabs.group + chrome.tabGroups.update 重建原生分组（按 tabFingerprints 找新 tabId）
 * - 调用方（executeRestore / writeBackMeta）在 mergeMeta 之外按需调用
 *
 * 守红线：
 * - 所有写走 safeSet + toPure
 * - 不调 chrome.sessions.setTabValue
 * - 不动 useTabManager 单例结构，只写 storage key（useTabManager 的 storage.onChanged 自动同步）
 * - chrome.tabs.group / chrome.tabGroups.update 用法已查 docs/googledocs 核实
 */

import { safeSet } from "~lib/safeStorage"
import { toPure } from "~lib/toPure"
import type { BackupFile, TabGroupSnapshot } from "~types/backup"
import type { LaterItem } from "~types/tab"

/** mergeMeta 返回结果（导入 / 还原共用） */
export interface MetaMergeResult {
  /** 新增的 customTags 数量（并集后比原来多的） */
  tagsAdded: number
  /** 成功写回 tabTagsMap 的标记关联数（新增标记名 × 恢复的标签） */
  tagsApplied: number
  /** 合并新增的 laterTabs 数 */
  laterAdded: number
  /** 错误信息（失败时填） */
  error?: string
}

/** 分组重建结果（独立于 mergeMeta，按需调用） */
export interface GroupRestoreResult {
  /** 成功重建的原生分组数 */
  groupsRestored: number
  /** 跳过的分组数（无匹配 tab 或重建失败） */
  groupsSkipped: number
  /** 错误信息（失败时填） */
  error?: string
}

function deriveDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/** 快照 LaterTabSnapshot → 当前 LaterItem 形状（补齐 TabItem 必填字段） */
function toLaterItem(
  lt: { url: string; title: string; addedAt: number; note: string | null },
  id: number
): LaterItem {
  const nowBase = Date.now()
  return {
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
  }
}

/**
 * 合并快照元数据到 storage.local（导入 / 还原统一入口）。
 *
 * 写回 customTags + tabTagsMap + laterTabs（追加去重 + tabId key）。
 * 分组重建请调用方另行调 restoreTabGroups。
 *
 * @param file 要合并的快照
 * @param fpToTabId fingerprint → 新 tabId 的映射（由开 tab 时建立）。
 *   调用方负责把 manualAssignments 等额外映射合并进本参数后再传入（保持函数纯）。
 * @returns { tagsAdded, laterAdded, tagsApplied }
 */
export async function mergeMeta(
  file: BackupFile,
  fpToTabId: Map<string, number>
): Promise<MetaMergeResult> {
  const result: MetaMergeResult = {
    tagsAdded: 0,
    tagsApplied: 0,
    laterAdded: 0,
  }
  const meta = file?.snapshot?.meta
  if (!meta) return result

  try {
    const data = await chrome.storage.local.get([
      "customTags",
      "tabTagsMap",
      "laterTabs",
    ])

    // 1. customTags 追加去重；newTagSet 记录本次新增的标记名（仅用于 tagsAdded 计数）
    const existingTags: string[] = Array.isArray(data.customTags)
      ? data.customTags.filter(
          (x): x is string => typeof x === "string" && x.length > 0
        )
      : []
    const tagSet = new Set(existingTags)
    const importedTags: string[] = Array.isArray(meta.customTags)
      ? meta.customTags.filter(
          (x): x is string => typeof x === "string" && x.length > 0
        )
      : []
    const newTagSet = new Set<string>()
    for (const t of importedTags) {
      if (!tagSet.has(t)) {
        tagSet.add(t)
        newTagSet.add(t)
        result.tagsAdded++
      }
    }
    const newTags = Array.from(tagSet)

    // 2. tabTagsMap 追加：遍历导入的（key=fingerprint）→ 转 tabId key 写回
    //    仅对 fpToTabId 里实际恢复的 fingerprint 才处理；标记名关联到实际恢复的 tabId（按 tab 去重，不依赖标记名是否预存）。
    const importedTabTagsMap =
      meta.tabTagsMap &&
      typeof meta.tabTagsMap === "object" &&
      !Array.isArray(meta.tabTagsMap)
        ? (meta.tabTagsMap as Record<string, unknown>)
        : {}
    const existingTabTagsMap: Record<string, unknown> =
      data.tabTagsMap &&
      typeof data.tabTagsMap === "object" &&
      !Array.isArray(data.tabTagsMap)
        ? (data.tabTagsMap as Record<string, unknown>)
        : {}
    const mergedTabTagsMap: Record<string, string[]> = {}
    // 先把现有的规整成 string[] 拷贝过来（避免改到原对象）。现有 key 已是 tabId key。
    for (const [k, val] of Object.entries(existingTabTagsMap)) {
      mergedTabTagsMap[k] = Array.isArray(val)
        ? val.filter((x): x is string => typeof x === "string" && x.length > 0)
        : []
    }
    // 遍历导入的 tabTagsMap（key=fingerprint）
    for (const [fp, rawVal] of Object.entries(importedTabTagsMap)) {
      // 仅当用户实际恢复了该 fingerprint 的标签才处理；取对应的新 tabId
      const tabId = fpToTabId.get(fp)
      if (typeof tabId !== "number") continue
      const importedTagNames: string[] = Array.isArray(rawVal)
        ? rawVal.filter(
            (x): x is string => typeof x === "string" && x.length > 0
          )
        : []
      if (importedTagNames.length === 0) continue
      // 写回时 key 用 String(tabId)（sidepanel 运行时按 tabId 查）
      const tabIdKey = String(tabId)
      const currentArr = mergedTabTagsMap[tabIdKey] ?? []
      const currentSet = new Set(currentArr)
      for (const tagName of importedTagNames) {
        // 该 tabId 已有该标记则跳过（per-tab 去重）；不因标记名已预存而跳过关联。
        if (currentSet.has(tagName)) continue
        currentSet.add(tagName)
        result.tagsApplied++
      }
      mergedTabTagsMap[tabIdKey] = Array.from(currentSet)
    }

    // 3. laterTabs 按 url 去重追加
    const existingLater = Array.isArray(data.laterTabs) ? data.laterTabs : []
    const existingLaterUrls = new Set(
      existingLater
        .map((x: unknown) =>
          x && typeof x === "object" && "url" in x
            ? String((x as { url: unknown }).url)
            : ""
        )
        .filter(Boolean)
    )
    const importedLater = Array.isArray(meta.laterTabs) ? meta.laterTabs : []
    const mergedLater = [...existingLater]
    const nowBase = Date.now()
    let idx = 0
    for (const lt of importedLater) {
      if (!lt || typeof lt.url !== "string" || !lt.url) continue
      if (existingLaterUrls.has(lt.url)) continue
      mergedLater.push(toLaterItem(lt, -(nowBase + idx)))
      idx++
      result.laterAdded++
    }

    await safeSet(
      {
        customTags: toPure(newTags),
        tabTagsMap: toPure(mergedTabTagsMap),
        laterTabs: toPure(mergedLater),
      },
      "backup.mergeMeta"
    )
    return result
  } catch (e) {
    result.error = e instanceof Error ? e.message : String(e)
    console.warn("[mergeMeta] 失败", e)
    return result
  }
}

/**
 * 重建原生分组：按 fingerprint 找新 tabId → chrome.tabs.group → chrome.tabGroups.update。
 *
 * 独立于 mergeMeta（chrome.* 调用，与 storage 合并语义分离）。
 * 调用方（executeRestore / writeBackMeta）在 mergeMeta 之后按需调用。
 *
 * @param groups 快照里的原生分组列表
 * @param fpToTabId fingerprint → 新 tabId 的映射（含手动指派合并后的）
 */
export async function restoreTabGroups(
  groups: TabGroupSnapshot[],
  fpToTabId: Map<string, number>
): Promise<GroupRestoreResult> {
  const result: GroupRestoreResult = {
    groupsRestored: 0,
    groupsSkipped: 0,
  }
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
      console.warn("[restoreTabGroups] 重建分组失败", g.title, e)
      result.groupsSkipped++
    }
  }
  return result
}
