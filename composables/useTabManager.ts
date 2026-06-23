import { ref, onMounted, onUnmounted } from "vue"
import type { TabItem, LaterItem, ClosedTabItem } from "~types/tab"

function getDomain(url: string) {
  try { return new URL(url).hostname } catch { return url }
}
function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`
}
function isProtectedUrl(url: string) {
  return url.startsWith("chrome://") || url.startsWith("edge://") || url.startsWith("about:") || url.startsWith("chrome-extension://")
}
function chromeTabToItem(t: chrome.tabs.Tab, seqNum: number, savedTags: Record<string, string[]>, savedNumbers: Record<string, number>): TabItem {
  const url = t.url || ""
  const sid = String(t.id!)
  return {
    id: t.id!, title: t.title || "(无标题)", url, domain: getDomain(url), favIconUrl: t.favIconUrl || "",
    pinned: t.pinned, active: t.active, audible: t.audible || false, muted: t.mutedInfo?.muted || false,
    discarded: t.discarded || false, frozen: (t as any).frozen || false, loading: t.status === "loading",
    recording: false, sharing: false, attention: false, hasUnsavedForm: false, hasConnectedDevice: false,
    isProtected: isProtectedUrl(url), openedAt: nowTime(),
    number: savedNumbers[sid] ?? seqNum,
    tags: savedTags[sid] || [], openerTabId: t.openerTabId,
  }
}

export function useTabManager() {
  const tabs = ref<TabItem[]>([])
  const laterTabs = ref<LaterItem[]>([])
  const customTags = ref<string[]>([])
  const tabTagsMap = ref<Record<string, string[]>>({})
  const tabNumberMap = ref<Record<string, number>>({})
  const recentlyClosed = ref<ClosedTabItem[]>([])

  const switchHistory = ref<number[]>([])
  const switchIndex = ref(-1)
  const isNavigating = ref(false)
  const canGoBack = ref(false)
  const canGoForward = ref(false)

  const updateNavState = () => {
    canGoBack.value = switchIndex.value > 0
    canGoForward.value = switchIndex.value < switchHistory.value.length - 1
  }
  const saveSwitchHistory = () => {
    try { chrome.storage.session.set({ tabSwitchHistory: switchHistory.value, tabSwitchIndex: switchIndex.value }) } catch {}
  }

  const loadTabs = async () => {
    const raw = await chrome.tabs.query({ currentWindow: true })
    tabs.value = raw.map((t, i) => chromeTabToItem(t, i + 1, tabTagsMap.value, tabNumberMap.value))
  }
  const loadLater = async () => {
    const data = await chrome.storage.local.get(["laterTabs", "customTags", "tabTagsMap", "tabNumberMap", "recentlyClosed"])
    laterTabs.value = data.laterTabs || []
    customTags.value = data.customTags || []
    tabTagsMap.value = data.tabTagsMap || {}
    tabNumberMap.value = data.tabNumberMap || {}
    recentlyClosed.value = data.recentlyClosed || []
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

  const closeTab = async (id: number) => { await chrome.tabs.remove(id); tabs.value = tabs.value.filter(t => t.id !== id) }
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
    if (tab && tab.url && !isProtectedUrl(tab.url)) {
      recentlyClosed.value = [{ id, title: tab.title, url: tab.url, domain: tab.domain, favIconUrl: tab.favIconUrl, closedAt: nowTime() }, ...recentlyClosed.value].slice(0, 20)
      chrome.storage.local.set({ recentlyClosed: recentlyClosed.value })
    }
    tabs.value = tabs.value.filter(t => t.id !== id)
    const filtered = switchHistory.value.filter(h => h !== id)
    if (filtered.length !== switchHistory.value.length) {
      switchHistory.value = filtered; switchIndex.value = Math.min(switchIndex.value, filtered.length - 1)
      saveSwitchHistory(); updateNavState()
    }
  }
  const onTabCreated = (t: chrome.tabs.Tab) => {
    tabs.value = [...tabs.value, chromeTabToItem(t, tabs.value.length + 1, tabTagsMap.value, tabNumberMap.value)]
  }
  const onTabUpdated = (_: number, change: chrome.tabs.TabChangeInfo, t: chrome.tabs.Tab) => {
    const idx = tabs.value.findIndex(x => x.id === t.id)
    if (idx === -1) return
    tabs.value[idx] = { ...tabs.value[idx], title: t.title || tabs.value[idx].title, favIconUrl: t.favIconUrl || tabs.value[idx].favIconUrl, audible: t.audible || false, muted: t.mutedInfo?.muted || false, discarded: t.discarded || false, loading: t.status === "loading", active: t.active }
  }
  const onTabActivated = (info: chrome.tabs.TabActiveInfo) => {
    tabs.value = tabs.value.map(t => ({ ...t, active: t.id === info.tabId }))
    if (!isNavigating.value) {
      const trimmed = switchHistory.value.slice(0, switchIndex.value + 1)
      if (trimmed[trimmed.length - 1] !== info.tabId) {
        switchHistory.value = [...trimmed, info.tabId].slice(-50)
        switchIndex.value = switchHistory.value.length - 1
        saveSwitchHistory(); updateNavState()
      }
    }
  }

  onMounted(async () => {
    await loadLater(); await Promise.all([loadTabs(), loadSwitchHistory()])
    chrome.tabs.onRemoved.addListener(onTabRemoved)
    chrome.tabs.onCreated.addListener(onTabCreated)
    chrome.tabs.onUpdated.addListener(onTabUpdated)
    chrome.tabs.onActivated.addListener(onTabActivated)
  })
  onUnmounted(() => {
    chrome.tabs.onRemoved.removeListener(onTabRemoved)
    chrome.tabs.onCreated.removeListener(onTabCreated)
    chrome.tabs.onUpdated.removeListener(onTabUpdated)
    chrome.tabs.onActivated.removeListener(onTabActivated)
  })

  return {
    tabs, laterTabs, customTags, recentlyClosed,
    canGoBack, canGoForward, goBack, goForward,
    closeTab, activateTab, restoreTab, moveToLater, removeLater,
    updateTabNumber, updateTabTags, addCustomTag, removeCustomTag, renameCustomTag,
    closeUnpinned, closeOthers, closeFrozenDiscarded,
  }
}
