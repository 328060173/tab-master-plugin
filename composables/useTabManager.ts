import { ref, onMounted, onUnmounted } from "vue"
import type { TabItem, LaterItem } from "~types/tab"

function getDomain(url: string) {
  try { return new URL(url).hostname } catch { return url }
}

function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`
}

function chromeTabToItem(t: chrome.tabs.Tab, number: number): TabItem {
  return {
    id: t.id!,
    title: t.title || "(无标题)",
    url: t.url || "",
    domain: getDomain(t.url || ""),
    favIconUrl: t.favIconUrl || "",
    pinned: t.pinned,
    active: t.active,
    audible: t.audible || false,
    discarded: t.discarded || false,
    openedAt: nowTime(),
    number,
  }
}

export function useTabManager() {
  const tabs = ref<TabItem[]>([])
  const laterTabs = ref<LaterItem[]>([])

  const loadTabs = async () => {
    const raw = await chrome.tabs.query({ currentWindow: true })
    tabs.value = raw.map((t, i) => chromeTabToItem(t, i + 1))
  }

  const loadLater = async () => {
    const { laterTabs: stored } = await chrome.storage.local.get("laterTabs")
    laterTabs.value = stored || []
  }

  const closeTab = async (id: number) => {
    await chrome.tabs.remove(id)
    tabs.value = tabs.value.filter(t => t.id !== id)
  }

  const activateTab = async (id: number) => {
    await chrome.tabs.update(id, { active: true })
  }

  const moveToLater = async (id: number, note: string) => {
    const tab = tabs.value.find(t => t.id === id)
    if (!tab) return
    const item: LaterItem = { ...tab, laterNote: note, laterAddedAt: nowTime() }
    laterTabs.value = [...laterTabs.value, item]
    await chrome.storage.local.set({ laterTabs: laterTabs.value })
    await closeTab(id)
  }

  const removeLater = async (id: number) => {
    laterTabs.value = laterTabs.value.filter(t => t.id !== id)
    await chrome.storage.local.set({ laterTabs: laterTabs.value })
  }

  const onTabRemoved = (id: number) => {
    tabs.value = tabs.value.filter(t => t.id !== id)
  }

  const onTabCreated = (t: chrome.tabs.Tab) => {
    tabs.value = [...tabs.value, chromeTabToItem(t, tabs.value.length + 1)]
  }

  const onTabUpdated = (_: number, change: chrome.tabs.TabChangeInfo, t: chrome.tabs.Tab) => {
    if (change.title || change.favIconUrl || change.status) {
      const idx = tabs.value.findIndex(x => x.id === t.id)
      if (idx !== -1) {
        tabs.value[idx] = { ...tabs.value[idx], title: t.title || tabs.value[idx].title, favIconUrl: t.favIconUrl || tabs.value[idx].favIconUrl }
      }
    }
  }

  onMounted(async () => {
    await Promise.all([loadTabs(), loadLater()])
    chrome.tabs.onRemoved.addListener(onTabRemoved)
    chrome.tabs.onCreated.addListener(onTabCreated)
    chrome.tabs.onUpdated.addListener(onTabUpdated)
  })

  onUnmounted(() => {
    chrome.tabs.onRemoved.removeListener(onTabRemoved)
    chrome.tabs.onCreated.removeListener(onTabCreated)
    chrome.tabs.onUpdated.removeListener(onTabUpdated)
  })

  return { tabs, laterTabs, closeTab, activateTab, moveToLater, removeLater }
}
