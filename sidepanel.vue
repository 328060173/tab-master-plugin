<template>
  <div class="h-screen flex flex-col bg-white text-gray-900 overflow-hidden text-sm">
    <div v-if="toastMsg" class="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-800 text-white text-xs rounded-full shadow-lg pointer-events-none">{{ toastMsg }}</div>

    <!-- Storage Panel -->
    <StoragePanel v-if="showStorage" @close="showStorage = false" @cleared="showToast('已清理')" />

    <!-- Header -->
    <div v-if="!isFocusMode" class="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0">
      <h1 class="text-sm font-bold">标签大师</h1>
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-gray-400">{{ tabs.length }} 个标签</span>
        <button :class="['px-2 py-1 text-xs rounded border transition-colors', isFocusMode ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50']" @click="isFocusMode = !isFocusMode">聚焦</button>
        <div class="relative">
          <button class="p-1 rounded hover:bg-gray-100 text-gray-500" @click.stop="settingsOpen = !settingsOpen"><Settings :size="14" /></button>
          <div v-if="settingsOpen" class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-30 w-44 py-1" v-click-outside="() => settingsOpen = false">
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-600"><LogIn :size="13" />登录账号</button>
            <div class="border-t border-gray-100 my-1"></div>
            <p class="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">界面</p>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-600"><Palette :size="13" />界面主题</button>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-600"><Type :size="13" />字体设置</button>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-600"><Globe2 :size="13" />界面语言</button>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-600"><Layout :size="13" />显示位置</button>
            <div class="border-t border-gray-100 my-1"></div>
            <p class="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">数据</p>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-600"><Cloud :size="13" />云同步</button>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-600"><Camera :size="13" />快照</button>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 text-gray-600" @click="showStorage = true; settingsOpen = false">
              <HardDrive :size="13" />存储空间
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0">
      <span class="text-xs text-gray-500 font-medium">聚焦模式 — {{ tabs.length }} 个标签</span>
      <button class="text-xs text-blue-600 hover:underline" @click="isFocusMode = false">退出</button>
    </div>

    <!-- Nav Tabs（现在在搜索框上方） -->
    <div v-if="!isFocusMode" class="flex border-b border-gray-100 px-3 shrink-0">
      <button v-for="nav in navItems" :key="nav.key"
        :class="['px-3 py-1.5 text-xs transition-colors border-b-2 -mb-px', activeNav === nav.key ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800']"
        @click="activeNav = nav.key">
        {{ nav.label }}
        <span v-if="nav.key === 'later' && laterTabs.length" class="ml-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded-full">{{ laterTabs.length }}</span>
      </button>
    </div>

    <!-- Search + Tag filter（现在在 Nav Tabs 下方） -->
    <div v-if="!isFocusMode" class="flex gap-2 px-3 py-2 border-b border-gray-100 shrink-0">
      <SearchBox v-model="search" class="flex-1" />
      <div class="relative shrink-0" v-click-outside="() => showTagPanel = false">
        <button
          :class="['flex items-center gap-1 px-2.5 py-1.5 text-xs border rounded transition-colors', (activeTagFilters.length || showTagPanel) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50']"
          @click.stop="showTagPanel = !showTagPanel"
        >
          <Tag :size="12" />标记
          <span v-if="activeTagFilters.length" class="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] ml-0.5">{{ activeTagFilters.length }}</span>
        </button>
        <TagFilterPanel
          v-if="showTagPanel"
          :tags="customTags" :activeTags="activeTagFilters" :tabCountByTag="tabCountByTag"
          @close="showTagPanel = false" @apply="activeTagFilters = $event"
          @addTag="addCustomTag" @renameTag="renameCustomTag"
        />
      </div>
    </div>

    <!-- Toolbar -->
    <AppToolbar
      v-if="activeNav === 'home' || isFocusMode"
      :isLaterPage="false" :isBatchMode="isBatchMode" :selectedCount="selectedIds.length"
      :viewMode="viewMode" :sortMode="sortMode" :canGoBack="canGoBack" :canGoForward="canGoForward"
      @viewChange="setViewMode" @sortChange="sortMode = $event"
      @toggleBatch="toggleBatch" @batchClose="batchClose"
      @closeUnpinned="closeUnpinned" @closeOthers="closeOthers" @closeFrozenDiscarded="closeFrozenDiscarded"
      @detectDuplicates="showToast('检测重复标签（开发中）')" @detectUnused="showToast('检测长时间未使用标签（开发中）')"
      @goBack="goBack" @goForward="goForward"
      @newTab="chrome.tabs.create({})"
    />

    <!-- 固定标签置顶栏 -->
    <PinnedBar
      v-if="!search.trim() && (activeNav === 'home' || isFocusMode)"
      :items="pinnedItems"
      @activate="activateTab" @close="closeTab"
      @later="openLater" @copy="copyUrl"
      @ctx="onContextMenu"
    />

    <!-- 搜索结果 -->
    <SearchResults
      v-if="search.trim()"
      :pinned="searchPinned" :open="searchOpen" :closed="searchClosed"
      :query="search.trim()" :customTags="customTags"
      @activate="activateTab($event); search = ''"
      @restore="restoreTab($event); search = ''"
      @later="openLater" @close="closeTab" @copy="copyUrl"
      @updateTags="updateTabTags" @addTag="addCustomTag"
    />

    <!-- 正常内容区 -->
    <div v-else ref="contentRef" class="flex-1 overflow-y-auto min-h-0 px-3 py-2" @scroll="onContentScroll">
      <LaterList v-if="activeNav === 'later'" :items="laterTabs" @remove="removeLater" @open="restoreTab($event)" />
      <div v-else-if="activeNav === 'groups'" class="text-center text-gray-400 text-xs py-12">
        <p class="mb-1 font-medium">分组标签</p><p>需要 chrome.tabGroups API，开发中...</p>
      </div>
      <div v-else-if="activeNav === 'history'" class="text-center text-gray-400 text-xs py-12">
        <p class="mb-1 font-medium">历史记录</p><p>需要 chrome.history API，开发中...</p>
      </div>
      <template v-else>
        <template v-if="viewMode === 'tree'">
          <TabTreeItem v-for="node in treeNodes" :key="node.item.id"
            :item="node.item" :children="node.children" :depth="0"
            @activate="activateTab(node.item.id)" @activate-child="activateTab($event)"
            @later="openLater(node.item.id)" @later-child="openLater($event)"
            @close="closeTab(node.item.id)" @close-child="closeTab($event)"
            @copy="copyUrl(node.item.url)" @copy-child="copyUrl($event)"
          />
        </template>
        <template v-else>
          <div v-if="!normalItems.length" class="text-center text-gray-400 text-xs py-12">暂无标签</div>
          <template v-if="sortMode === 'domain' && viewMode !== 'icon'">
            <div v-for="group in domainGroups" :key="group.domain" class="mb-3">
              <p class="text-[10px] font-bold text-gray-400 tracking-wider mb-1">{{ group.displayName }}</p>
              <div :class="gridClass">
                <component :is="itemComponent" v-for="item in group.items" :key="item.id"
                  :data-tabid="item.id"
                  :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" :customTags="customTags"
                  @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)"
                  @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)"
                  @updateTags="updateTabTags(item.id, $event)" @addTag="addCustomTag($event)"
                  @updateNumber="updateTabNumber(item.id, $event)"
                  @contextmenu.prevent="onContextMenu($event, item)" />
              </div>
            </div>
          </template>
          <template v-else>
            <div :class="gridClass">
              <component :is="itemComponent" v-for="item in sortedNormalItems" :key="item.id"
                :data-tabid="item.id"
                :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" :customTags="customTags"
                @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)"
                @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)"
                @updateTags="updateTabTags(item.id, $event)" @addTag="addCustomTag($event)"
                @updateNumber="updateTabNumber(item.id, $event)"
                @contextmenu.prevent="onContextMenu($event, item)" />
            </div>
          </template>
        </template>
      </template>
    </div>

    <FooterStats :stats="stats" :activeFilter="activeFilter" @filter="activeFilter = $event" />
    <LaterDialog :open="laterDialogOpen" @close="laterDialogOpen = false" @confirm="confirmLater" />

    <!-- 右键菜单 -->
    <TabContextMenu :tab="ctxMenu?.tab ?? null" :x="ctxMenu?.x ?? 0" :y="ctxMenu?.y ?? 0"
      @action="handleCtxAction" @close="ctxMenu = null" />

    <!-- 标记浮层（右键→添加标记） -->
    <div v-if="tagPickerTab" class="fixed z-[9990] bg-white border border-gray-200 rounded-lg shadow-xl w-48 pb-1"
      :style="{ left: `${tagPickerPos.x}px`, top: `${tagPickerPos.y}px` }"
      v-click-outside="() => tagPickerTabId = null" @click.stop>
      <p class="px-2.5 py-1.5 border-b border-gray-100 text-[11px] font-medium text-gray-500">添加标记</p>
      <div class="grid grid-cols-3 gap-1 p-2 max-h-36 overflow-y-auto">
        <button v-for="tag in customTags" :key="tag"
          :class="['px-1 py-0.5 text-[10px] rounded border text-center truncate transition-colors', tagPickerTab.tags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-400']"
          :title="tag"
          @click="updateTabTags(tagPickerTab.id, tagPickerTab.tags.includes(tag) ? tagPickerTab.tags.filter(t=>t!==tag) : [...tagPickerTab.tags, tag])">{{ tag }}</button>
        <p v-if="!customTags.length" class="col-span-3 text-[11px] text-gray-400 text-center py-2">暂无标记</p>
      </div>
    </div>
    <!-- 回到顶部 -->
    <button v-if="scrolled" class="fixed bottom-10 right-3 z-30 p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all" @click="scrollToTop" title="回到顶部">
      <ChevronUp :size="14" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue"
import { Settings, LogIn, Palette, Type, Layout, Cloud, Camera, Tag, HardDrive, Globe as Globe2, ChevronUp } from "@lucide/vue"
import { useTabManager } from "~composables/useTabManager"
import { useTabStats } from "~composables/useTabStats"
import { useTabTree } from "~composables/useTabTree"
import { sortTabs, groupByDomain } from "~lib/sortUtils"
import TabTileItem from "~components/TabTileItem.vue"
import TabListItem from "~components/TabListItem.vue"
import TabIconItem from "~components/TabIconItem.vue"
import TabTreeItem from "~components/TabTreeItem.vue"
import AppToolbar from "~components/AppToolbar.vue"
import LaterList from "~components/LaterList.vue"
import LaterDialog from "~components/LaterDialog.vue"
import FooterStats from "~components/FooterStats.vue"
import TagFilterPanel from "~components/TagFilterPanel.vue"
import SearchResults from "~components/SearchResults.vue"
import SearchBox from "~components/SearchBox.vue"
import StoragePanel from "~components/StoragePanel.vue"
import TabContextMenu from "~components/TabContextMenu.vue"
import PinnedBar from "~components/PinnedBar.vue"
import type { TabItem } from "~types/tab"
import { modKey } from "~lib/platform"

const {
  tabs, laterTabs, customTags, recentlyClosed,
  canGoBack, canGoForward, goBack, goForward,
  closeTab, activateTab, restoreTab, moveToLater, removeLater,
  updateTabNumber, updateTabTags, addCustomTag, removeCustomTag, renameCustomTag,
  closeUnpinned, closeOthers, closeFrozenDiscarded,
  refreshTab, duplicateTab, pinTab, muteTab, closeTabsExcept, groupTab,
} = useTabManager()
const stats = computed(() => useTabStats(tabs).value)
const treeNodes = useTabTree(tabs)

const activeNav = ref("home")
const viewMode = ref(localStorage.getItem("viewMode") || "list")
const sortMode = ref("domain")
const search = ref("")
const isBatchMode = ref(false)
const selectedIds = ref<number[]>([])
const activeFilter = ref("all")
const activeTagFilters = ref<string[]>([])
const laterDialogOpen = ref(false)
const pendingLaterTabId = ref<number | null>(null)
const settingsOpen = ref(false)
const isFocusMode = ref(false)
const showTagPanel = ref(false)
const showStorage = ref(false)
const contentRef = ref<HTMLElement | null>(null)
const toastMsg = ref("")
let toastTimer: ReturnType<typeof setTimeout> | null = null
const ctxMenu = ref<{ tab: TabItem; x: number; y: number } | null>(null)
const tagPickerTabId = ref<number | null>(null)
const tagPickerPos = ref({ x: 0, y: 0 })
const tagPickerTab = computed(() => tagPickerTabId.value !== null ? (tabs.value.find(t => t.id === tagPickerTabId.value) ?? null) : null)

const navItems = [
  { key: "home", label: "首页" },
  { key: "later", label: "稍后处理" },
  { key: "groups", label: "分组" },
  { key: "history", label: "历史" },
]

const showToast = (msg: string) => {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = "" }, 2000)
}
const setViewMode = (v: string) => { viewMode.value = v; localStorage.setItem("viewMode", v) }

const scrolled = ref(false)
const onContentScroll = (e: Event) => { scrolled.value = (e.target as HTMLElement).scrollTop > 80 }
const scrollToTop = () => contentRef.value?.scrollTo({ top: 0, behavior: 'smooth' })

const onKeydown = (e: KeyboardEvent) => {
  if (!e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return
  const n = parseInt(e.key)
  if (n >= 1 && n <= 9) {
    const tab = tabs.value.find(t => t.number === n)
    if (tab) { e.preventDefault(); activateTab(tab.id); showToast(`${modKey}${n} → ${tab.title.slice(0, 20)}`) }
    else showToast(`${modKey}${n} — 暂无对应编号的标签`)
  }
}
onMounted(() => document.addEventListener("keydown", onKeydown))
onUnmounted(() => document.removeEventListener("keydown", onKeydown))

const scrollToActive = async () => {
  await nextTick()
  const activeId = tabs.value.find(t => t.active)?.id
  if (!activeId || !contentRef.value) return
  const el = contentRef.value.querySelector(`[data-tabid="${activeId}"]`) as HTMLElement | null
  el?.scrollIntoView({ block: "center", behavior: "smooth" })
}
watch(() => tabs.value.find(t => t.active)?.id, scrollToActive, { immediate: true })

const itemComponent = computed(() => {
  if (viewMode.value === "tile") return TabTileItem
  if (viewMode.value === "icon") return TabIconItem
  return TabListItem
})
const gridClass = computed(() => {
  if (viewMode.value === "tile") return "grid grid-cols-3 gap-1.5"
  if (viewMode.value === "icon") return "grid grid-cols-4 gap-2"
  return "flex flex-col gap-1"
})

const matchSearch = (q: string, t: { title: string; url: string; domain: string }) => {
  const lq = q.toLowerCase()
  return t.title.toLowerCase().includes(lq) || t.url.toLowerCase().includes(lq) || t.domain.toLowerCase().includes(lq)
}
const searchPinned = computed(() => { const q = search.value.trim(); return q ? tabs.value.filter(t => t.pinned && matchSearch(q, t)) : [] })
const searchOpen = computed(() => { const q = search.value.trim(); return q ? tabs.value.filter(t => !t.pinned && matchSearch(q, t)) : [] })
const searchClosed = computed(() => { const q = search.value.trim(); return q ? recentlyClosed.value.filter(t => matchSearch(q, t)) : [] })

const filteredTabs = computed(() => {
  let list = tabs.value
  if (activeTagFilters.value.length) list = list.filter(t => activeTagFilters.value.every(tag => t.tags.includes(tag)))
  if (activeFilter.value !== "all") {
    const f = activeFilter.value
    const filters: Record<string, (t: typeof list[0]) => boolean> = {
      active: t => t.active, playing: t => t.audible, muted: t => t.muted,
      pinned: t => t.pinned, frozen: t => t.frozen, discarded: t => t.discarded,
      loading: t => t.loading, recording: t => t.recording, sharing: t => t.sharing,
      attention: t => t.attention, hasUnsavedForm: t => t.hasUnsavedForm,
      hasConnectedDevice: t => t.hasConnectedDevice, isProtected: t => t.isProtected,
    }
    if (filters[f]) list = list.filter(filters[f])
  }
  return list
})

const pinnedItems = computed(() => filteredTabs.value.filter(t => t.pinned))
const normalItems = computed(() => filteredTabs.value.filter(t => !t.pinned))
const sortedNormalItems = computed(() => sortTabs(normalItems.value, sortMode.value))
const domainGroups = computed(() => groupByDomain(sortedNormalItems.value))

const tabCountByTag = computed(() => {
  const counts: Record<string, number> = {}
  for (const t of tabs.value) for (const tag of t.tags) counts[tag] = (counts[tag] || 0) + 1
  return counts
})

const toggleSelect = (id: number) => {
  selectedIds.value = selectedIds.value.includes(id) ? selectedIds.value.filter(i => i !== id) : [...selectedIds.value, id]
}
const toggleBatch = () => { isBatchMode.value = !isBatchMode.value; if (!isBatchMode.value) selectedIds.value = [] }
const batchClose = async () => { for (const id of selectedIds.value) await closeTab(id); selectedIds.value = []; isBatchMode.value = false }
const openLater = (id: number) => { pendingLaterTabId.value = id; laterDialogOpen.value = true }
const confirmLater = async (note: string) => {
  if (pendingLaterTabId.value !== null) await moveToLater(pendingLaterTabId.value, note)
  pendingLaterTabId.value = null; laterDialogOpen.value = false
}
const copyUrl = (url: string) => { navigator.clipboard.writeText(url); showToast("已复制URL") }

const onContextMenu = (e: MouseEvent, item: TabItem) => {
  e.preventDefault(); ctxMenu.value = { tab: item, x: e.clientX, y: e.clientY }
}
const handleCtxAction = (action: string) => {
  const tab = ctxMenu.value?.tab; if (!tab) return
  const { x, y } = ctxMenu.value!
  ctxMenu.value = null
  const acts: Record<string, () => void> = {
    refresh: () => refreshTab(tab.id),
    duplicate: () => duplicateTab(tab.id),
    pin: () => pinTab(tab.id, !tab.pinned),
    mute: () => muteTab(tab.id, !tab.muted),
    group: () => groupTab(tab.id),
    tag: () => { tagPickerTabId.value = tab.id; tagPickerPos.value = { x, y } },
    later: () => openLater(tab.id),
    copyUrl: () => copyUrl(tab.url),
    close: () => closeTab(tab.id),
    closeOthers: () => closeTabsExcept(tab.id),
  }
  acts[action]?.()
}

const vClickOutside = {
  mounted(el: any, b: any) { el._o = (e: MouseEvent) => { if (!el.contains(e.target)) b.value() }; document.addEventListener("click", el._o) },
  unmounted(el: any) { document.removeEventListener("click", el._o) },
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
</style>
