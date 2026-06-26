import { ref, onMounted, onUnmounted } from "vue"
import type { TabItem, LaterItem, ClosedTabItem } from "~types/tab"

function getDomain(url: string) {
  try { return new URL(url).hostname } catch { return url }
}
function nowTime() {
  return new Date().toISOString()
}
function isProtectedUrl(url: string) {
  return url.startsWith("chrome://") || url.startsWith("edge://") || url.startsWith("about:") || url.startsWith("chrome-extension://")
}
function chromeTabToItem(t: chrome.tabs.Tab, savedTags: Record<string, string[]>, savedNumbers: Record<string, number>, savedOpenedAt: Record<string, string>): TabItem {
  const url = t.url || ""
  const sid = String(t.id!)
  return {
    id: t.id!, title: t.title || "(无标题)", url, domain: getDomain(url), favIconUrl: t.favIconUrl || "",
    pinned: t.pinned, active: t.active, audible: t.audible || false, muted: t.mutedInfo?.muted || false,
    discarded: t.discarded || false, frozen: (t as any).frozen || false, loading: t.status === "loading",
    recording: false, sharing: false, attention: false, hasUnsavedForm: false, hasConnectedDevice: false,
    isProtected: isProtectedUrl(url), openedAt: savedOpenedAt[sid] ?? nowTime(),
    number: savedNumbers[sid] ?? 0,
    tags: savedTags[sid] || [], openerTabId: t.openerTabId,
  }
}

export function useTabManager() {
  const tabs = ref<TabItem[]>([])
  const laterTabs = ref<LaterItem[]>([])
  const customTags = ref<string[]>([])
  const tabTagsMap = ref<Record<string, string[]>>({})
  const tabNumberMap = ref<Record<string, number>>({})
  const tabOpenedAtMap = ref<Record<string, string>>({})
  const recentlyClosed = ref<ClosedTabItem[]>([])
  const treeParentMap = ref<Record<string, number>>({})

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

  const loadTabs = async () => {
    try {
      const raw = await chrome.tabs.query({ currentWindow: true })
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
        chrome.storage.local.set({ tabOpenedAtMap: tabOpenedAtMap.value })
      }
      tabs.value = raw.map((t) => chromeTabToItem(t, tabTagsMap.value, tabNumberMap.value, tabOpenedAtMap.value))
      const active = raw.find(t => t.active)
      if (active) activeTabId.value = active.id
    } catch {
      if (!chrome.runtime?.id) window.location.reload()
    }
  }
  const loadLater = async () => {
    const data = await chrome.storage.local.get(["laterTabs", "customTags", "tabTagsMap", "tabNumberMap", "recentlyClosed", "treeParentMap", "tabOpenedAtMap"])
    laterTabs.value = data.laterTabs || []
    customTags.value = data.customTags || []
    tabTagsMap.value = data.tabTagsMap || {}
    tabNumberMap.value = data.tabNumberMap || {}
    recentlyClosed.value = data.recentlyClosed || []
    treeParentMap.value = data.treeParentMap || {}
    tabOpenedAtMap.value = data.tabOpenedAtMap || {}
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
  const closeTab = async (id: number) => { await chrome.tabs.remove(id) }
  const activateTab = async (id: number) => { await chrome.tabs.update(id, { active: true }) }
  const restoreTab = async (url: string) => { await chrome.tabs.create({ url }) }

  const moveToLater = async (id: number, note: string) => {
    const tab = tabs.value.find(t => t.id === id)
    if (!tab) return
    laterTabs.value = [...laterTabs.value, { ...tab, laterNote: note, laterAddedAt: nowTime() }]
    await chrome.storage.local.set({ laterTabs: laterTabs.value })
    await closeTab(id)
  }
  const removeLater = async (id: number) => {
    laterTabs.value = laterTabs.value.filter(t => t.id !== id)
    await chrome.storage.local.set({ laterTabs: laterTabs.value })
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
    await chrome.storage.local.set({ tabNumberMap: newMap })
  }

  const updateTabTags = async (id: number, tags: string[]) => {
    const idx = tabs.value.findIndex(t => t.id === id)
    if (idx !== -1) tabs.value[idx] = { ...tabs.value[idx], tags }
    tabTagsMap.value = { ...tabTagsMap.value, [String(id)]: tags }
    await chrome.storage.local.set({ tabTagsMap: tabTagsMap.value })
  }
  const addCustomTag = async (tag: string) => {
    if (!customTags.value.includes(tag)) {
      customTags.value = [...customTags.value, tag]
      await chrome.storage.local.set({ customTags: customTags.value })
    }
  }
  const removeCustomTag = async (tag: string) => {
    customTags.value = customTags.value.filter(t => t !== tag)
    await chrome.storage.local.set({ customTags: customTags.value })
  }
  const renameCustomTag = async (oldTag: string, newTag: string) => {
    if (!newTag.trim() || oldTag === newTag) return
    customTags.value = customTags.value.map(t => t === oldTag ? newTag : t)
    // 更新所有标签的 tags
    tabs.value = tabs.value.map(t => ({
      ...t,
      tags: t.tags.map(tg => tg === oldTag ? newTag : tg)
    }))
    const newTagsMap: Record<string, string[]> = {}
    for (const [k, v] of Object.entries(tabTagsMap.value)) {
      newTagsMap[k] = v.map(tg => tg === oldTag ? newTag : tg)
    }
    tabTagsMap.value = newTagsMap
    await chrome.storage.local.set({ customTags: customTags.value, tabTagsMap: newTagsMap })
  }

  const refreshTab = (id: number) => chrome.tabs.reload(id)
  const duplicateTab = (id: number) => chrome.tabs.duplicate(id)
  const pinTab = async (id: number, pinned: boolean) => {
    await chrome.tabs.update(id, { pinned })
    const idx = tabs.value.findIndex(t => t.id === id)
    if (idx !== -1) tabs.value[idx] = { ...tabs.value[idx], pinned }
  }
  const muteTab = async (id: number, muted: boolean) => {
    await chrome.tabs.update(id, { muted })
    const idx = tabs.value.findIndex(t => t.id === id)
    if (idx !== -1) tabs.value[idx] = { ...tabs.value[idx], muted }
  }
  const closeTabsExcept = async (id: number) => {
    const ids = tabs.value.filter(t => t.id !== id).map(t => t.id)
    if (ids.length) await chrome.tabs.remove(ids)
    tabs.value = tabs.value.filter(t => t.id === id)
  }
  const groupTab = async (id: number) => {
    try { await (chrome.tabs as any).group({ tabIds: [id] }) } catch {}
  }

  // 树形拖拽：更新父子关系
  const updateTreeParent = async (tabId: number, parentId: number | null) => {
    const newMap = { ...treeParentMap.value }
    if (parentId === null) delete newMap[String(tabId)]
    else newMap[String(tabId)] = parentId
    treeParentMap.value = newMap
    await chrome.storage.local.set({ treeParentMap: newMap })
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
    await chrome.tabs.update(switchHistory.value[switchIndex.value], { active: true })
    saveSwitchHistory(); updateNavState(); isNavigating.value = false
  }
  const goForward = async () => {
    if (!canGoForward.value) return
    switchIndex.value++; isNavigating.value = true
    await chrome.tabs.update(switchHistory.value[switchIndex.value], { active: true })
    saveSwitchHistory(); updateNavState(); isNavigating.value = false
  }

  const onTabRemoved = (id: number) => {
    const tab = tabs.value.find(t => t.id === id)
    const storageUpdate: Record<string, any> = {}
    if (tab && tab.url && !isProtectedUrl(tab.url)) {
      recentlyClosed.value = [{ id, title: tab.title, url: tab.url, domain: tab.domain, favIconUrl: tab.favIconUrl, closedAt: nowTime() }, ...recentlyClosed.value].slice(0, 20)
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
    chrome.storage.local.set(storageUpdate)
    const filtered = switchHistory.value.filter(h => h !== id)
    if (filtered.length !== switchHistory.value.length) {
      switchHistory.value = filtered; switchIndex.value = Math.min(switchIndex.value, filtered.length - 1)
      saveSwitchHistory(); updateNavState()
    }
  }
  const onTabCreated = (t: chrome.tabs.Tab) => {
    // 自动捕获 openerTabId，写入 treeParentMap 作为唯一数据源
    if (t.openerTabId && tabs.value.some(tab => tab.id === t.openerTabId)) {
      const newMap = { ...treeParentMap.value, [String(t.id!)]: t.openerTabId }
      treeParentMap.value = newMap
      chrome.storage.local.set({ treeParentMap: newMap })
    }
    const sid = String(t.id!)
    const openedAt = nowTime()
    tabOpenedAtMap.value = { ...tabOpenedAtMap.value, [sid]: openedAt }
    chrome.storage.local.set({ tabOpenedAtMap: tabOpenedAtMap.value })
    tabs.value = [...tabs.value, chromeTabToItem(t, tabTagsMap.value, tabNumberMap.value, tabOpenedAtMap.value)]
  }
  const onTabUpdated = (_: number, change: chrome.tabs.TabChangeInfo, t: chrome.tabs.Tab) => {
    const idx = tabs.value.findIndex(x => x.id === t.id)
    if (idx === -1) return
    tabs.value[idx] = { ...tabs.value[idx], title: t.title || tabs.value[idx].title, favIconUrl: t.favIconUrl || tabs.value[idx].favIconUrl, audible: t.audible || false, muted: t.mutedInfo?.muted || false, discarded: t.discarded || false, loading: t.status === "loading", active: t.active, pinned: t.pinned }
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
    if (nextIdx !== -1) tabs.value[nextIdx] = { ...tabs.value[nextIdx], active: true }
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

  // 睡眠唤醒/锁屏解锁时：优先检测扩展上下文是否仍有效，失效则整页重载（保证所有功能正常）
  const onVisibilityChange = () => {
    if (document.visibilityState !== 'visible') return
    if (!chrome.runtime?.id) { window.location.reload(); return }
    loadTabs(); loadLater()
  }

  onMounted(async () => {
    await loadLater(); await Promise.all([loadTabs(), loadSwitchHistory()])
    chrome.tabs.onRemoved.addListener(onTabRemoved)
    chrome.tabs.onCreated.addListener(onTabCreated)
    chrome.tabs.onUpdated.addListener(onTabUpdated)
    chrome.tabs.onActivated.addListener(onTabActivated)
    document.addEventListener('visibilitychange', onVisibilityChange)
  })
  onUnmounted(() => {
    chrome.tabs.onRemoved.removeListener(onTabRemoved)
    chrome.tabs.onCreated.removeListener(onTabCreated)
    chrome.tabs.onUpdated.removeListener(onTabUpdated)
    chrome.tabs.onActivated.removeListener(onTabActivated)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  })

  return {
    tabs, laterTabs, customTags, recentlyClosed, treeParentMap, prevActiveTabId, activeTabId,
    canGoBack, canGoForward, goBack, goForward,
    closeTab, activateTab, restoreTab, moveToLater, removeLater,
    updateTabNumber, updateTabTags, addCustomTag, removeCustomTag, renameCustomTag,
    closeUnpinned, closeOthers, closeFrozenDiscarded,
    refreshTab, duplicateTab, pinTab, muteTab, closeTabsExcept, groupTab,
    updateTreeParent, moveTabToIndex,
  }
}
