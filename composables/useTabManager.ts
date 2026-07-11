import { ref, watch } from "vue"
import { useSettings } from "~composables/useSettings"
import type { TabItem, LaterItem, ClosedTabItem } from "~types/tab"
import { validateTag } from "~lib/tagValidate"

function getDomain(url: string) {
  try { return new URL(url).hostname } catch { return url }
}
function nowTime() {
  return new Date().toISOString()
}
function isProtectedUrl(url: string) {
  return url.startsWith("chrome://") || url.startsWith("edge://") || url.startsWith("about:") || url.startsWith("chrome-extension://")
}
// chrome.storage.local.set 内部用结构化克隆序列化参数；Vue reactive proxy 数组会被克隆成
// 数字键对象（["工作"] → {"0":"工作"}），读回时 Array.isArray 失败被当脏数据丢弃（标记全丢）。
// 所有写 storage 前用此函数转成纯 JSON 值，杜绝 proxy 污染。
const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))
// 清洗 tabTagsMap：外层必须是普通 object，每个 value 必须是 string 数组；坏的都丢
// 历史脏数据（旧版本 / 调试残留）会让 tab.tags 变 Object，导致 Vue render 函数对 .tags 做 spread/迭代时全局崩溃
function sanitizeTabTagsMap(raw: unknown): Record<string, string[]> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  const out: Record<string, string[]> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(v)) {
      const cleaned = v.filter((x): x is string => typeof x === "string" && x.length > 0)
      if (cleaned.length) out[k] = cleaned
    }
  }
  return out
}
function chromeTabToItem(t: chrome.tabs.Tab, savedTags: Record<string, string[]>, savedNumbers: Record<string, number>, savedOpenedAt: Record<string, string>): TabItem {
  const url = t.url || ""
  const sid = String(t.id!)
  // Chrome 121+ 原生提供 tab.lastAccessed（毫秒）；老版本是 undefined，由 useTabManager 用 SW 采集的 map 兜底
  const nativeLastAccessed = (t as any).lastAccessed as number | undefined
  return {
    id: t.id!, title: t.title || "(无标题)", url, domain: getDomain(url), favIconUrl: t.favIconUrl || "",
    pinned: t.pinned, active: t.active, audible: t.audible || false, muted: t.mutedInfo?.muted || false,
    discarded: t.discarded || false, frozen: (t as any).frozen || false, loading: t.status === "loading",
    recording: false, sharing: false, attention: false, hasUnsavedForm: false, hasConnectedDevice: false,
    isProtected: isProtectedUrl(url), openedAt: savedOpenedAt[sid] ?? nowTime(),
    lastAccessed: nativeLastAccessed,
    number: savedNumbers[sid] ?? 0,
    tags: Array.isArray(savedTags[sid]) ? savedTags[sid].filter((x): x is string => typeof x === "string") : [], openerTabId: t.openerTabId,
    groupId: t.groupId ?? chrome.tabGroups.TAB_GROUP_ID_NONE,
  }
}

// 单例缓存：useTabManager 非单例会导致子组件（TagBar/useTabActions/TabHoverCard 等）
// 拿到独立空实例 → UI 不更新 + storage 被覆盖（数据破坏）。模块级缓存让所有调用共享同一实例。
// 见 [[lesson-usetabmanager-not-singleton]]
let _instance: ReturnType<typeof useTabManagerImpl> | null = null
function useTabManagerImpl() {
  const { settings } = useSettings()
  const tabs = ref<TabItem[]>([])
  const currentWindowId = ref<number>(-1)
  const laterTabs = ref<LaterItem[]>([])
  const customTags = ref<string[]>([])
  const tabTagsMap = ref<Record<string, string[]>>({})
  const tabNumberMap = ref<Record<string, number>>({})
  const tabOpenedAtMap = ref<Record<string, string>>({})
  // SW 采集的 lastAccessed 兜底（Chrome <121 走这里；121+ 用 tab.lastAccessed 原生）
  // 数据源：background.ts 监听 onActivated，写 chrome.storage.local.tabLastAccessedMap
  const tabLastAccessedMap = ref<Record<string, number>>({})
  const recentlyClosed = ref<ClosedTabItem[]>([])
  const treeParentMap = ref<Record<string, number>>({})
  // 标记筛选模式：multi=多选叠加（交集），single=单选。持久化到 storage.local.tagSelectMode
  const tagSelectMode = ref<"multi" | "single">("single")
  // 首次绑标记一次性触发器：用于 sidepanel 弹会话级提示 toast
  const tagBoundFirstTime = ref(false)

  const switchHistory = ref<number[]>([])
  const switchIndex = ref(-1)
  const isNavigating = ref(false)
  const canGoBack = ref(false)
  const canGoForward = ref(false)
  const prevActiveTabId = ref<number | null>(null)
  const activeTabId = ref<number | null>(null)

  const updateNavState = () => {
    canGoBack.value = switchIndex.value > 0
    canGoForward.value = switchIndex.value < switchHistory.value.length - 1
  }
  const saveSwitchHistory = () => {
    try { chrome.storage.session.set({ tabSwitchHistory: switchHistory.value, tabSwitchIndex: switchIndex.value }) } catch {}
  }

  // 父子关系工具：循环检测，防止 A 被设为自己后代的父节点（拖拽 / 回填都要用）
  const wouldCreateCycle = (childId: number, parentId: number, map: Record<string, number>): boolean => {
    if (childId === parentId) return true
    const seen = new Set<number>()
    let cur: number | undefined = parentId
    while (cur !== undefined) {
      if (cur === childId) return true
      if (seen.has(cur)) return true
      seen.add(cur)
      cur = map[String(cur)]
    }
    return false
  }

  const loadTabs = async () => {
    try {
      const raw = await chrome.tabs.query({ currentWindow: true })

      // 诊断日志：开始 loadTabs
      if (!!(import.meta as any).env?.DEV) {
        console.debug("[tab-master:tags] loadTabs 开始", {
          queryTabsCount: raw.length,
          currentTabTagsMapKeys: Object.keys(tabTagsMap.value).length,
          currentTabTagsMap: tabTagsMap.value
        })
      }

      // 从查询结果推导当前窗口 ID（避免依赖 chrome.windows.getCurrent，零额外 API/权限风险）
      if (raw.length && raw[0].windowId !== undefined) {
        currentWindowId.value = raw[0].windowId
      }
      // 为首次见到的标签推算打开时间：按 tab.id 升序（id 越小越早打开）分配递增时间
      const unseenTabs = raw.filter(t => !tabOpenedAtMap.value[String(t.id!)]).sort((a, b) => a.id! - b.id!)
      const newEntries: Record<string, string> = {}
      if (unseenTabs.length) {
        const baseTime = Date.now()
        unseenTabs.forEach((t, i) => {
          // id 最小 → 最早，每个标签间隔 1 分钟，最新的标签取当前时间
          newEntries[String(t.id!)] = new Date(baseTime - (unseenTabs.length - 1 - i) * 60000).toISOString()
        })
        tabOpenedAtMap.value = { ...tabOpenedAtMap.value, ...newEntries }
        chrome.storage.local.set({ tabOpenedAtMap: toPure(tabOpenedAtMap.value) })
      }

      // 父子关系回填：扩展首次安装 / 数据被清空 / 跨会话后，treeParentMap 可能没记录
      // 这些标签的 openerTabId 仍可能由 Chrome 返回（前提是 opener 还活着），借此补全树关系
      const validIds = new Set(raw.map(t => t.id!))
      const parentBackfill: Record<string, number> = {}
      for (const t of raw) {
        const sid = String(t.id!)
        if (treeParentMap.value[sid] !== undefined) continue // 已有记录，尊重之
        if (!t.openerTabId || !validIds.has(t.openerTabId)) continue
        if (wouldCreateCycle(t.id!, t.openerTabId, { ...treeParentMap.value, ...parentBackfill })) continue
        parentBackfill[sid] = t.openerTabId
      }
      if (Object.keys(parentBackfill).length) {
        treeParentMap.value = { ...treeParentMap.value, ...parentBackfill }
        chrome.storage.local.set({ treeParentMap: toPure(treeParentMap.value) })
      }

      tabs.value = raw.map((t) => {
        const item = chromeTabToItem(t, tabTagsMap.value, tabNumberMap.value, tabOpenedAtMap.value)
        // 原生 lastAccessed 缺失时（Chrome <121），用 SW 采集的兜底
        if (item.lastAccessed === undefined) {
          const v = tabLastAccessedMap.value[String(t.id!)]
          if (typeof v === "number") item.lastAccessed = v
        }
        return item
      })

      // 诊断日志：回填完成
      if (!!(import.meta as any).env?.DEV) {
        const tabsWithTags = tabs.value.filter(t => t.tags.length > 0)
        console.debug("[tab-master:tags] loadTabs 回填完成", {
          totalTabs: tabs.value.length,
          tabsWithTagsCount: tabsWithTags.length,
          tabsWithTags: tabsWithTags.map(t => ({ id: t.id, title: t.title, tags: t.tags })),
          tabTagsMapKeysUsed: tabs.value
            .map(t => String(t.id))
            .filter(id => id in tabTagsMap.value).length
        })
      }

      const active = raw.find(t => t.active)
      if (active) activeTabId.value = active.id
    } catch (e) {
      console.error("[tab-master] loadTabs 异常", e)
      if (!chrome.runtime?.id) window.location.reload()
    }
  }
  const loadLater = async () => {
    try {
      const data = await chrome.storage.local.get(["laterTabs", "customTags", "tabTagsMap", "tabNumberMap", "recentlyClosed", "treeParentMap", "tabOpenedAtMap", "tabLastAccessedMap", "tagSelectMode", "tagsSessionNoticeShown"])

      // 诊断日志：读取到的数据
      if (!!(import.meta as any).env?.DEV) {
        console.debug("[tab-master:tags] loadLater 读取 storage 成功", {
          tabTagsMapKeys: Object.keys(data.tabTagsMap || {}).length,
          customTagsLength: (data.customTags || []).length,
          rawCustomTagsType: typeof data.customTags,
          rawCustomTagsIsArray: Array.isArray(data.customTags),
          rawTabTagsMapType: typeof data.tabTagsMap,
          rawTabTagsMap: data.tabTagsMap
        })
      }


      laterTabs.value = Array.isArray(data.laterTabs) ? data.laterTabs : []
      // customTags 防御性校验：旧版本数据 / 调试时人为塞过对象都会导致 prop 类型错（Vue 报 "Expected Array, got Object"）
      // 这里强制只接受数组里的字符串，其他一律丢弃；并自动写回 storage 治愈污染（不影响主流程）
      const rawTags = data.customTags
      const cleanTags = Array.isArray(rawTags) ? rawTags.filter((t): t is string => typeof t === "string" && t.length > 0) : []
      customTags.value = cleanTags
      if (rawTags !== undefined && !Array.isArray(rawTags)) {
        console.warn("[tab-master] customTags 在 storage 中被存成了非数组，已自动重置", rawTags)
        // storage.set 失败不能阻塞主流程（否则 loadTabs 永远不会被调用，UI 上所有标签消失）
        chrome.storage.local.set({ customTags: cleanTags }).catch(e => console.warn("[tab-master] auto-heal customTags failed:", e))
      }
      tabTagsMap.value = sanitizeTabTagsMap(data.tabTagsMap)
      tabNumberMap.value = (data.tabNumberMap && typeof data.tabNumberMap === "object" && !Array.isArray(data.tabNumberMap)) ? data.tabNumberMap : {}
      recentlyClosed.value = Array.isArray(data.recentlyClosed) ? data.recentlyClosed : []
      treeParentMap.value = (data.treeParentMap && typeof data.treeParentMap === "object" && !Array.isArray(data.treeParentMap)) ? data.treeParentMap : {}
      tabOpenedAtMap.value = (data.tabOpenedAtMap && typeof data.tabOpenedAtMap === "object" && !Array.isArray(data.tabOpenedAtMap)) ? data.tabOpenedAtMap : {}
      tabLastAccessedMap.value = (data.tabLastAccessedMap && typeof data.tabLastAccessedMap === "object" && !Array.isArray(data.tabLastAccessedMap)) ? data.tabLastAccessedMap : {}
      // 标记筛选模式：只认 'multi'，其他一律兜底 'single'（默认单选）
      tagSelectMode.value = data.tagSelectMode === "multi" ? "multi" : "single"

      // 诊断日志：处理后的数据
      if (!!(import.meta as any).env?.DEV) {
        console.debug("[tab-master:tags] loadLater 处理完成", {
          tabTagsMapKeysAfter: Object.keys(tabTagsMap.value).length,
          customTagsLengthAfter: customTags.value.length,
          tabTagsMapAfter: tabTagsMap.value
        })
      }
    } catch (e) {
      console.warn("[tab-master] loadLater 失败，保留当前内存数据；loadTabs 会继续执行不阻塞 UI：", e)

      // 诊断日志：异常情况
      if (!!(import.meta as any).env?.DEV) {
        console.error("[tab-master:tags] loadLater 异常，保留当前内存数据", { error: e })
      }

      // 不重置内存状态，保留已有数据（标记名称永远展示）
      // 仅 tagSelectMode 给兜底值，防止 undefined 导致筛选逻辑异常
      if (tagSelectMode.value === undefined || tagSelectMode.value === null) {
        tagSelectMode.value = "single"
      }
    }
  }
  const loadSwitchHistory = async () => {
    try {
      const data = await chrome.storage.session.get(["tabSwitchHistory", "tabSwitchIndex"])
      if (data.tabSwitchHistory?.length) {
        switchHistory.value = data.tabSwitchHistory
        switchIndex.value = data.tabSwitchIndex ?? switchHistory.value.length - 1
        updateNavState()
      }
    } catch {}
  }

  // 只调 API，让 onTabRemoved 作为唯一数据源，避免双重 Vue 更新
  const closeTab = async (id: number) => {
    try {
      await chrome.tabs.remove(id)
    } catch (e) {
      // 标签可能已被关闭/不存在（幽灵 tab），不抛错避免 ErrorBoundary 降级；
      // 触发带防抖的全量对账，让列表与浏览器实际状态一致
      console.warn('[tab-manager] closeTab failed, scheduling resync:', e)
      scheduleResync()
    }
  }
  const activateTab = async (id: number) => {
    try {
      await chrome.tabs.update(id, { active: true })
    } catch (e) {
      console.warn('[tab-manager] activateTab failed, scheduling resync:', e)
      scheduleResync()
    }
  }
  const restoreTab = async (url: string) => { await chrome.tabs.create({ url }) }

  const moveToLater = async (id: number, note: string) => {
    const tab = tabs.value.find(t => t.id === id)
    if (!tab) return
    laterTabs.value = [...laterTabs.value, { ...tab, laterNote: note, laterAddedAt: nowTime() }]
    await chrome.storage.local.set({ laterTabs: toPure(laterTabs.value) })
    await closeTab(id)
  }
  const removeLater = async (id: number) => {
    laterTabs.value = laterTabs.value.filter(t => t.id !== id)
    await chrome.storage.local.set({ laterTabs: toPure(laterTabs.value) })
  }
  const removeRecentlyClosed = async (id: number) => {
    recentlyClosed.value = recentlyClosed.value.filter(t => t.id !== id)
    await chrome.storage.local.set({ recentlyClosed: toPure(recentlyClosed.value) })
  }

  // 编号管理：新编号唯一，冲突时旧标签编号清零
  const updateTabNumber = async (id: number, num: number) => {
    const newMap = { ...tabNumberMap.value }
    if (num > 0) {
      // 清除已有相同编号
      for (const [k, v] of Object.entries(newMap)) {
        if (v === num && k !== String(id)) {
          delete newMap[k]
          const idx = tabs.value.findIndex(t => t.id === parseInt(k))
          if (idx !== -1) tabs.value[idx] = { ...tabs.value[idx], number: 0 }
        }
      }
      newMap[String(id)] = num
    } else {
      delete newMap[String(id)]
    }
    tabNumberMap.value = newMap
    const idx = tabs.value.findIndex(t => t.id === id)
    if (idx !== -1) tabs.value[idx] = { ...tabs.value[idx], number: num }
    await chrome.storage.local.set({ tabNumberMap: toPure(newMap) })
  }

  const updateTabTags = async (id: number, tags: string[]) => {
    const idx = tabs.value.findIndex(t => t.id === id)
    if (idx !== -1) tabs.value[idx] = { ...tabs.value[idx], tags }
    tabTagsMap.value = { ...tabTagsMap.value, [String(id)]: tags }

    // 诊断日志：写入前
    if (!!(import.meta as any).env?.DEV) {
      console.debug("[tab-master:tags] updateTabTags 写入 storage", {
        tabId: id,
        tags: tags,
        tabTagsMapKeysBefore: Object.keys(tabTagsMap.value).length
      })
    }

    await chrome.storage.local.set({ tabTagsMap: toPure(tabTagsMap.value) })

    // 诊断日志：写入后回读验证
    if (!!(import.meta as any).env?.DEV) {
      const verifyData = await chrome.storage.local.get(["tabTagsMap"])
      console.debug("[tab-master:tags] updateTabTags 回读验证", {
        tabId: id,
        verifyHasTabId: String(id) in (verifyData.tabTagsMap || {}),
        verifyTagsForTab: (verifyData.tabTagsMap || {})[String(id)],
        verifyTabTagsMapKeys: Object.keys(verifyData.tabTagsMap || {}).length,
        verifyTabTagsMap: verifyData.tabTagsMap
      })
    }

    // 首次给标签绑定标记时，触发提示（一次性，异步、不阻塞主流程）
    // 改用 storage.local 持久化：用户首次绑标记只提示一次，清缓存才重置（详见 sidepanel onTagsSessionNoticeChanged）
    if (tags.length > 0 && !tagBoundFirstTime.value) {
      chrome.storage.local.get(["tagsSessionNoticeShown"]).then(d => {
        if (!d.tagsSessionNoticeShown) {
          tagBoundFirstTime.value = true
          chrome.storage.local.set({ tagsSessionNoticeShown: true }).catch(() => {})
        }
      }).catch(() => {})
    }
  }

  // 意图式 API：调用方只传意图（加/删/切哪个 tag），内部用主实例 tabs.value 查当前 tags 再算。
  // 避免调用方依赖 props.currentTags / props.item.tags 计算新数组——props 经过 Teleport + 多层
  // computed 传递可能旧值，用旧值 filter/concat 会删错/加错（如删一个标记把别的也带没）。
  const addTabTag = async (id: number, tag: string) => {
    const cur = tabs.value.find(t => t.id === id)?.tags ?? []
    if (cur.includes(tag)) return
    await updateTabTags(id, [...cur, tag])
  }
  const removeTabTag = async (id: number, tag: string) => {
    const cur = tabs.value.find(t => t.id === id)?.tags ?? []
    await updateTabTags(id, cur.filter(t => t !== tag))
  }
  const toggleTabTag = async (id: number, tag: string) => {
    const cur = tabs.value.find(t => t.id === id)?.tags ?? []
    const next = cur.includes(tag) ? cur.filter(t => t !== tag) : [...cur, tag]
    await updateTabTags(id, next)
  }

  // 设置标记筛选模式（multi/single）并持久化
  const setTagSelectMode = (m: "multi" | "single") => {
    tagSelectMode.value = m
    chrome.storage.local.set({ tagSelectMode: m }).catch(() => {})
  }
  const addCustomTag = async (tag: string): Promise<boolean> => {
    const r = validateTag(tag, customTags.value)
    if (!r.ok) return false
    customTags.value = [...customTags.value, r.name]
    await chrome.storage.local.set({ customTags: toPure(customTags.value) })
    return true
  }
  const removeCustomTag = async (tag: string) => {
    customTags.value = customTags.value.filter(t => t !== tag)
    // 从所有标签中移除该标记
    const newTagsMap: Record<string, string[]> = {}
    for (const [k, v] of Object.entries(tabTagsMap.value)) {
      const filtered = v.filter(tg => tg !== tag)
      if (filtered.length > 0) newTagsMap[k] = filtered
    }
    tabTagsMap.value = newTagsMap
    // 更新内存中的标签
    tabs.value = tabs.value.map(t => ({
      ...t,
      tags: t.tags.filter(tg => tg !== tag)
    }))
    await chrome.storage.local.set({ customTags: toPure(customTags.value), tabTagsMap: toPure(newTagsMap) })
  }
  const renameCustomTag = async (oldTag: string, newTag: string) => {
    const trimmedNewTag = newTag.trim()
    if (!trimmedNewTag || trimmedNewTag.length > 15 || oldTag === trimmedNewTag) return
    if (customTags.value.includes(trimmedNewTag)) return
    customTags.value = customTags.value.map(t => t === oldTag ? trimmedNewTag : t)
    // 更新所有标签的 tags
    tabs.value = tabs.value.map(t => ({
      ...t,
      tags: t.tags.map(tg => tg === oldTag ? trimmedNewTag : tg)
    }))
    const newTagsMap: Record<string, string[]> = {}
    for (const [k, v] of Object.entries(tabTagsMap.value)) {
      newTagsMap[k] = v.map(tg => tg === oldTag ? trimmedNewTag : tg)
    }
    tabTagsMap.value = newTagsMap
    await chrome.storage.local.set({ customTags: toPure(customTags.value), tabTagsMap: toPure(newTagsMap) })
  }
  const reorderCustomTags = async (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || fromIndex >= customTags.value.length) return
    if (toIndex < 0 || toIndex >= customTags.value.length) return
    if (fromIndex === toIndex) return
    const newTags = [...customTags.value]
    const [removed] = newTags.splice(fromIndex, 1)
    newTags.splice(toIndex, 0, removed)
    customTags.value = newTags
    await chrome.storage.local.set({ customTags: toPure(customTags.value) })
  }

  const refreshTab = async (id: number) => {
    try {
      await chrome.tabs.reload(id)
    } catch (e) {
      console.warn('[tab-manager] refreshTab failed, scheduling resync:', e)
      scheduleResync()
    }
  }
  const duplicateTab = async (id: number) => {
    try {
      await chrome.tabs.duplicate(id)
    } catch (e) {
      console.warn('[tab-manager] duplicateTab failed, scheduling resync:', e)
      scheduleResync()
    }
  }
  const pinTab = async (id: number, pinned: boolean) => {
    try {
      await chrome.tabs.update(id, { pinned })
      const idx = tabs.value.findIndex(t => t.id === id)
      if (idx !== -1) tabs.value[idx] = { ...tabs.value[idx], pinned }
    } catch (e) {
      console.warn('[tab-manager] pinTab failed, scheduling resync:', e)
      scheduleResync()
    }
  }
  const muteTab = async (id: number, muted: boolean) => {
    try {
      await chrome.tabs.update(id, { muted })
      const idx = tabs.value.findIndex(t => t.id === id)
      if (idx !== -1) tabs.value[idx] = { ...tabs.value[idx], muted }
    } catch (e) {
      console.warn('[tab-manager] muteTab failed, scheduling resync:', e)
      scheduleResync()
    }
  }
  const closeTabsExcept = async (id: number) => {
    const ids = tabs.value.filter(t => t.id !== id).map(t => t.id)
    if (!ids.length) return
    try {
      await chrome.tabs.remove(ids)
      tabs.value = tabs.value.filter(t => t.id === id)
    } catch (e) {
      console.warn('[tab-manager] closeTabsExcept failed, scheduling resync:', e)
      scheduleResync()
    }
  }
  const groupTab = async (id: number) => {
    // chrome.tabs.group 仅在 Chrome 89+ / Edge 89+ 支持；包了 try 兜底，老版本静默忽略
    try { await chrome.tabs.group({ tabIds: [id] }) } catch {}
  }

  // 树形拖拽：更新父子关系（含循环检测，防止用户把节点拖到自己后代下）
  const updateTreeParent = async (tabId: number, parentId: number | null) => {
    const newMap = { ...treeParentMap.value }
    if (parentId === null) {
      delete newMap[String(tabId)]
    } else {
      if (wouldCreateCycle(tabId, parentId, newMap)) {
        // 静默拒绝；UI 层无需提示——拖拽手势会自然回弹
        return
      }
      newMap[String(tabId)] = parentId
    }
    treeParentMap.value = newMap
    await chrome.storage.local.set({ treeParentMap: toPure(newMap) })
  }

  // 树形拖拽：调整标签顺序（调用 Chrome API）
  const moveTabToIndex = async (tabId: number, targetIndex: number) => {
    try { await chrome.tabs.move(tabId, { index: targetIndex }) } catch {}
  }

  const closeUnpinned = async () => { for (const id of tabs.value.filter(t => !t.pinned).map(t => t.id)) await closeTab(id) }
  const closeOthers = async () => { for (const id of tabs.value.filter(t => !t.active).map(t => t.id)) await closeTab(id) }
  const closeFrozenDiscarded = async () => { for (const id of tabs.value.filter(t => t.frozen || t.discarded).map(t => t.id)) await closeTab(id) }

  const goBack = async () => {
    if (!canGoBack.value) return
    switchIndex.value--; isNavigating.value = true
    const targetId = switchHistory.value[switchIndex.value]
    try {
      await chrome.tabs.update(targetId, { active: true })
      saveSwitchHistory(); updateNavState(); isNavigating.value = false
    } catch (e) {
      console.warn('[tab-manager] goBack failed, cleaning invalid id and scheduling resync:', e)
      // 回滚状态
      switchIndex.value++
      isNavigating.value = false
      // 清理无效 id
      switchHistory.value = switchHistory.value.filter(h => h !== targetId)
      switchIndex.value = Math.min(switchIndex.value, switchHistory.value.length - 1)
      saveSwitchHistory(); updateNavState()
      scheduleResync()
    }
  }
  const goForward = async () => {
    if (!canGoForward.value) return
    switchIndex.value++; isNavigating.value = true
    const targetId = switchHistory.value[switchIndex.value]
    try {
      await chrome.tabs.update(targetId, { active: true })
      saveSwitchHistory(); updateNavState(); isNavigating.value = false
    } catch (e) {
      console.warn('[tab-manager] goForward failed, cleaning invalid id and scheduling resync:', e)
      // 回滚状态
      switchIndex.value--
      isNavigating.value = false
      // 清理无效 id
      switchHistory.value = switchHistory.value.filter(h => h !== targetId)
      switchIndex.value = Math.min(switchIndex.value, switchHistory.value.length - 1)
      saveSwitchHistory(); updateNavState()
      scheduleResync()
    }
  }

  const onTabRemoved = (id: number) => {
    const tab = tabs.value.find(t => t.id === id)
    const storageUpdate: Record<string, any> = {}
    if (tab && tab.url && !isProtectedUrl(tab.url)) {
      recentlyClosed.value = [{ id, title: tab.title, url: tab.url, domain: tab.domain, favIconUrl: tab.favIconUrl, closedAt: nowTime() }, ...recentlyClosed.value].slice(0, 50)
      storageUpdate.recentlyClosed = recentlyClosed.value
    }
    tabs.value = tabs.value.filter(t => t.id !== id)
    // 将被关闭标签的子标签迁移到其父节点
    const removedParent = treeParentMap.value[String(id)]
    const newMap = { ...treeParentMap.value }
    delete newMap[String(id)]
    for (const [k, v] of Object.entries(newMap)) {
      if (v === id) { if (removedParent) newMap[k] = removedParent; else delete newMap[k] }
    }
    treeParentMap.value = newMap
    storageUpdate.treeParentMap = newMap
    // 清理打开时间记录
    const atMap = { ...tabOpenedAtMap.value }
    delete atMap[String(id)]
    tabOpenedAtMap.value = atMap
    storageUpdate.tabOpenedAtMap = atMap
    // 一次性写入，减少 I/O
    chrome.storage.local.set(toPure(storageUpdate))
    const filtered = switchHistory.value.filter(h => h !== id)
    if (filtered.length !== switchHistory.value.length) {
      switchHistory.value = filtered; switchIndex.value = Math.min(switchIndex.value, filtered.length - 1)
      saveSwitchHistory(); updateNavState()
    }
  }
  const onTabCreated = (t: chrome.tabs.Tab) => {
    // 只处理当前窗口的标签
    if (currentWindowId.value !== -1 && t.windowId !== currentWindowId.value) {
      return
    }

    // 父子关系：background.ts 是主写入方（永久监听），UI 这里是兜底（同窗口才挂亲子，含循环检测）
    if (t.openerTabId && tabs.value.some(tab => tab.id === t.openerTabId)) {
      if (!wouldCreateCycle(t.id!, t.openerTabId, treeParentMap.value)) {
        const newMap = { ...treeParentMap.value, [String(t.id!)]: t.openerTabId }
        treeParentMap.value = newMap
        chrome.storage.local.set({ treeParentMap: toPure(newMap) })
      }
    }
    const sid = String(t.id!)
    const openedAt = nowTime()
    tabOpenedAtMap.value = { ...tabOpenedAtMap.value, [sid]: openedAt }
    chrome.storage.local.set({ tabOpenedAtMap: toPure(tabOpenedAtMap.value) })
    tabs.value = [...tabs.value, chromeTabToItem(t, tabTagsMap.value, tabNumberMap.value, tabOpenedAtMap.value)]
  }
  const onTabUpdated = (_: number, change: chrome.tabs.TabChangeInfo, t: chrome.tabs.Tab) => {
    const idx = tabs.value.findIndex(x => x.id === t.id)
    if (idx === -1) return
    // URL 可能在会话内变化（地址栏输入新地址 / SPA 跳转）。必须同步重算 domain / isProtected，
    // 否则按域名分组时会沿用旧域名（如 newtab、edge://extensions/），导致分组错乱、域名显示错误。
    const nextUrl = t.url || tabs.value[idx].url
    tabs.value[idx] = {
      ...tabs.value[idx],
      title: t.title || tabs.value[idx].title,
      url: nextUrl,
      domain: getDomain(nextUrl),
      isProtected: isProtectedUrl(nextUrl),
      favIconUrl: t.favIconUrl || tabs.value[idx].favIconUrl,
      audible: t.audible || false,
      muted: t.mutedInfo?.muted || false,
      discarded: t.discarded || false,
      loading: t.status === "loading",
      active: t.active,
      pinned: t.pinned,
      groupId: t.groupId ?? tabs.value[idx].groupId,
    }
  }
  const onTabActivated = (info: chrome.tabs.TabActiveInfo) => {
    // 只更新两个变化的 tab，避免全量 map 重建数组
    const prevIdx = tabs.value.findIndex(t => t.active)
    if (prevIdx !== -1) {
      if (tabs.value[prevIdx].id === info.tabId) return // 无变化
      prevActiveTabId.value = tabs.value[prevIdx].id
      tabs.value[prevIdx] = { ...tabs.value[prevIdx], active: false }
    }
    const nextIdx = tabs.value.findIndex(t => t.id === info.tabId)
    if (nextIdx !== -1) {
      // 立即更新 lastAccessed（不等 SW 写盘 → storage.onChanged 往返），让本会话内的「检测未用」立即生效
      tabs.value[nextIdx] = { ...tabs.value[nextIdx], active: true, lastAccessed: Date.now() }
    }
    activeTabId.value = info.tabId
    if (!isNavigating.value) {
      const trimmed = switchHistory.value.slice(0, switchIndex.value + 1)
      if (trimmed[trimmed.length - 1] !== info.tabId) {
        switchHistory.value = [...trimmed, info.tabId].slice(-50)
        switchIndex.value = switchHistory.value.length - 1
        saveSwitchHistory(); updateNavState()
      }
    }
  }

  // 标签移动时重新加载标签列表
  const onTabMoved = () => {
    loadTabs()
  }

  // 防抖重载：多个事件短时间内集中触发时只 loadTabs 一次
  let resyncTimer: ReturnType<typeof setTimeout> | null = null
  const scheduleResync = () => {
    if (resyncTimer) clearTimeout(resyncTimer)
    resyncTimer = setTimeout(() => { loadTabs() }, 200)
  }
  // 60s 定时对账安全网：即使所有事件都丢失，也能保证 60s 内自愈一次
  let reconcileTimer: ReturnType<typeof setInterval> | null = null

  // 控制定时对账的启动与停止
  const startReconcileTimer = () => {
    if (reconcileTimer) return
    if (!settings.value.autoReconcile) return
    reconcileTimer = setInterval(() => scheduleResync(), 60000)
  }
  const stopReconcileTimer = () => {
    if (reconcileTimer) { clearInterval(reconcileTimer); reconcileTimer = null }
  }

  // 睡眠唤醒/锁屏解锁时：优先检测扩展上下文是否仍有效，失效则整页重载（保证所有功能正常）
  const onVisibilityChange = () => {
    if (document.visibilityState !== 'visible') return

    // 诊断日志：visibilitychange 触发
    if (!!(import.meta as any).env?.DEV) {
      console.debug("[tab-master:tags] onVisibilityChange 触发", {
        hasRuntimeId: !!chrome.runtime?.id,
        currentTabTagsMapKeys: Object.keys(tabTagsMap.value).length
      })
    }

    if (!chrome.runtime?.id) { window.location.reload(); return }
    loadTabs(); loadLater()
  }

  // SW 写入 tabLastAccessedMap 后，跨页同步到本 sidepanel 实例（保证多窗口/popup 之间数据一致）
  const onStorageChanged = (changes: { [k: string]: chrome.storage.StorageChange }, area: string) => {
    if (area !== "local" || !changes.tabLastAccessedMap) return
    tabLastAccessedMap.value = changes.tabLastAccessedMap.newValue || {}
  }

  // 跨窗口标签移动事件监听：触发重载保证一致性
  const onTabAttached = () => {
    scheduleResync()
  }
  const onTabDetached = () => {
    scheduleResync()
  }
  // 预渲染替换 tab（oldId -> newId）：oldId 失效，触发对账消除幽灵 tab
  const onTabReplaced = (_newId: number, _oldId: number) => {
    scheduleResync()
  }

  // 监听器直接在实例创建时立即注册（不依赖组件生命周期）
  chrome.tabs.onRemoved.addListener(onTabRemoved)
  chrome.tabs.onCreated.addListener(onTabCreated)
  chrome.tabs.onUpdated.addListener(onTabUpdated)
  chrome.tabs.onActivated.addListener(onTabActivated)
  chrome.tabs.onMoved.addListener(onTabMoved)
  chrome.tabs.onAttached.addListener(onTabAttached)
  chrome.tabs.onDetached.addListener(onTabDetached)
  chrome.tabs.onReplaced.addListener(onTabReplaced)
  chrome.storage.onChanged.addListener(onStorageChanged)
  document.addEventListener('visibilitychange', onVisibilityChange)
  // 60s 定时对账安全网（受设置控制）
  startReconcileTimer()
  // 监听设置变化，动态启停定时器
  watch(() => settings.value.autoReconcile, (on) => {
    on ? startReconcileTimer() : stopReconcileTimer()
  })

  // 初始化数据（异步执行不阻塞实例创建）
  ;(async () => {
    // loadLater 用 try-catch 单独抓 —— 即使它整个崩了也不阻塞 loadTabs，避免 UI 上所有标签消失
    try { await loadLater() } catch (e) { console.error("[tab-master] loadLater fatal:", e) }
    try { await Promise.all([loadTabs(), loadSwitchHistory()]) } catch (e) { console.error("[tab-master] loadTabs/loadSwitchHistory fatal:", e) }
  })()

  return {
    tabs, laterTabs, customTags, recentlyClosed, treeParentMap, prevActiveTabId, activeTabId,
    canGoBack, canGoForward, goBack, goForward,
    closeTab, activateTab, restoreTab, moveToLater, removeLater, removeRecentlyClosed,
    updateTabNumber, updateTabTags, addTabTag, removeTabTag, toggleTabTag, addCustomTag, removeCustomTag, renameCustomTag, reorderCustomTags,
    closeUnpinned, closeOthers, closeFrozenDiscarded,
    refreshTab, duplicateTab, pinTab, muteTab, closeTabsExcept, groupTab,
    updateTreeParent, moveTabToIndex,
    tagSelectMode, setTagSelectMode, tagBoundFirstTime,
  }
}

// 单例入口：所有 useTabManager() 调用共享同一实例，避免子组件拿到独立空实例
// （UI 不更新 + storage 覆盖）。见 [[lesson-usetabmanager-not-singleton]]
export function useTabManager() {
  if (_instance) return _instance
  _instance = useTabManagerImpl()
  return _instance
}
