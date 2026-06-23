<template>
  <div class="h-screen flex flex-col bg-white text-gray-900 overflow-hidden text-sm">
    <!-- Header -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-gray-200">
      <h1 class="text-sm font-bold">标签大师</h1>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-400">{{ tabs.length }} 个标签</span>
      </div>
    </div>

    <!-- Search -->
    <div class="px-3 py-2 border-b border-gray-100">
      <input
        v-model="search"
        type="text"
        placeholder="搜索标签..."
        class="w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- NavTabs -->
    <div class="flex border-b border-gray-100 px-3">
      <button
        v-for="nav in navItems"
        :key="nav.key"
        :class="['px-3 py-1.5 text-xs transition-colors border-b-2 -mb-px', activeNav === nav.key ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800']"
        @click="activeNav = nav.key"
      >
        {{ nav.label }}
        <span v-if="nav.key === 'later' && laterTabs.length" class="ml-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded-full">{{ laterTabs.length }}</span>
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between px-3 py-1.5 border-b border-gray-100">
      <div class="flex items-center gap-1">
        <!-- 视图切换 -->
        <div class="relative">
          <button class="p-1 rounded hover:bg-gray-100 text-gray-600" @click.stop="viewOpen = !viewOpen">
            <LayoutGrid :size="14" />
          </button>
          <div v-if="viewOpen" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-28 py-1" v-click-outside="() => viewOpen = false">
            <button v-for="o in VIEW_OPTIONS" :key="o.value" :class="['flex w-full px-3 py-1.5 text-xs hover:bg-gray-50', viewMode === o.value ? 'text-blue-600 font-medium' : '']" @click="viewMode = o.value; viewOpen = false">{{ o.label }}</button>
          </div>
        </div>
        <!-- 排序 -->
        <div class="relative">
          <button class="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50" @click.stop="sortOpen = !sortOpen">
            <ArrowUpDown :size="11" />{{ SORT_OPTIONS.find(o => o.value === sortMode)?.label }}
          </button>
          <div v-if="sortOpen" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-28 py-1" v-click-outside="() => sortOpen = false">
            <button v-for="o in SORT_OPTIONS" :key="o.value" :class="['flex w-full px-3 py-1.5 text-xs hover:bg-gray-50', sortMode === o.value ? 'text-blue-600 font-medium' : '']" @click="sortMode = o.value; sortOpen = false">{{ o.label }}</button>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <button
          :class="['flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors', isBatchMode ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 hover:bg-gray-50']"
          @click="toggleBatch"
        >
          <CheckSquare :size="11" />批量
        </button>
        <button v-if="isBatchMode && selectedIds.length" class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600" @click="batchClose">
          关闭({{ selectedIds.length }})
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto min-h-0 px-3 py-2">
      <!-- Later -->
      <LaterList v-if="activeNav === 'later'" :items="laterTabs" @remove="removeLater" />

      <!-- Home -->
      <template v-else>
        <!-- Pinned -->
        <template v-if="pinnedItems.length">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">已固定</p>
          <div :class="gridClass" class="mb-3">
            <component :is="itemComponent" v-for="item in pinnedItems" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
          </div>
        </template>

        <!-- Normal tabs -->
        <div v-if="!normalItems.length && !pinnedItems.length" class="text-center text-gray-400 text-xs py-12">暂无标签</div>

        <template v-if="sortMode === 'domain' && viewMode !== 'icon'">
          <div v-for="group in domainGroups" :key="group.domain" class="mb-3">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{{ group.domain }}</p>
            <div :class="gridClass">
              <component :is="itemComponent" v-for="item in group.items" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
            </div>
          </div>
        </template>
        <template v-else>
          <div :class="gridClass">
            <component :is="itemComponent" v-for="item in sortedNormalItems" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
          </div>
        </template>
      </template>
    </div>

    <!-- Footer -->
    <FooterStats :stats="stats" :activeFilter="activeFilter" @filter="activeFilter = $event" />

    <!-- Dialog -->
    <LaterDialog :open="laterDialogOpen" @close="laterDialogOpen = false" @confirm="confirmLater" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { LayoutGrid, ArrowUpDown, CheckSquare } from "@lucide/vue"
import { useTabManager } from "~composables/useTabManager"
import { useTabStats } from "~composables/useTabStats"
import { sortTabs, groupByDomain } from "~lib/sortUtils"
import TabTileItem from "~components/TabTileItem.vue"
import TabListItem from "~components/TabListItem.vue"
import TabIconItem from "~components/TabIconItem.vue"
import LaterList from "~components/LaterList.vue"
import LaterDialog from "~components/LaterDialog.vue"
import FooterStats from "~components/FooterStats.vue"

const { tabs, laterTabs, closeTab, activateTab, moveToLater, removeLater } = useTabManager()
const stats = computed(() => useTabStats(tabs).value)

const activeNav = ref("home")
const viewMode = ref("list")
const sortMode = ref("domain")
const search = ref("")
const isBatchMode = ref(false)
const selectedIds = ref<number[]>([])
const activeFilter = ref("all")
const laterDialogOpen = ref(false)
const pendingLaterTabId = ref<number | null>(null)
const viewOpen = ref(false)
const sortOpen = ref(false)

const VIEW_OPTIONS = [
  { value: "tile", label: "平铺" },
  { value: "list", label: "列表" },
  { value: "icon", label: "图标" },
]
const SORT_OPTIONS = [
  { value: "domain", label: "按域名" },
  { value: "timeAsc", label: "时间↑" },
  { value: "timeDesc", label: "时间↓" },
]

const navItems = [
  { key: "home", label: "全部标签" },
  { key: "later", label: "稍后处理" },
]

const itemComponent = computed(() => {
  if (viewMode.value === "tile") return TabTileItem
  if (viewMode.value === "icon") return TabIconItem
  return TabListItem
})

const gridClass = computed(() => {
  if (viewMode.value === "tile") return "grid grid-cols-1 gap-2"
  if (viewMode.value === "icon") return "grid grid-cols-4 gap-2"
  return "flex flex-col gap-1"
})

const filteredTabs = computed(() => {
  let list = tabs.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(t => t.title.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q))
  }
  if (activeFilter.value !== "all") {
    if (activeFilter.value === "active") list = list.filter(t => t.active)
    else if (activeFilter.value === "playing") list = list.filter(t => t.audible)
    else if (activeFilter.value === "pinned") list = list.filter(t => t.pinned)
    else if (activeFilter.value === "discarded") list = list.filter(t => t.discarded)
  }
  return list
})

const pinnedItems = computed(() => filteredTabs.value.filter(t => t.pinned))
const normalItems = computed(() => filteredTabs.value.filter(t => !t.pinned))
const sortedNormalItems = computed(() => sortTabs(normalItems.value, sortMode.value))
const domainGroups = computed(() => groupByDomain(sortedNormalItems.value))

const toggleSelect = (id: number) => {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter(i => i !== id)
    : [...selectedIds.value, id]
}
const toggleBatch = () => {
  isBatchMode.value = !isBatchMode.value
  if (!isBatchMode.value) selectedIds.value = []
}
const batchClose = async () => {
  for (const id of selectedIds.value) await closeTab(id)
  selectedIds.value = []
  isBatchMode.value = false
}
const openLater = (id: number) => {
  pendingLaterTabId.value = id
  laterDialogOpen.value = true
}
const confirmLater = async (note: string) => {
  if (pendingLaterTabId.value !== null) await moveToLater(pendingLaterTabId.value, note)
  pendingLaterTabId.value = null
  laterDialogOpen.value = false
}
const copyUrl = (url: string) => navigator.clipboard.writeText(url)

const vClickOutside = {
  mounted(el: any, binding: any) {
    el._out = (e: MouseEvent) => { if (!el.contains(e.target)) binding.value() }
    document.addEventListener("click", el._out)
  },
  unmounted(el: any) { document.removeEventListener("click", el._out) },
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
</style>
