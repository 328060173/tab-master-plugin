<template>
  <div class="h-screen flex flex-col bg-white text-gray-900 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <h1 class="text-base font-bold">标签大师</h1>
      <div class="flex items-center gap-2">
        <input
          v-model="search"
          type="text"
          placeholder="搜索标签..."
          class="text-xs border border-gray-200 rounded-lg px-3 py-1.5 w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-xs text-gray-400">{{ tabs.length }} 个标签</span>
      </div>
    </div>

    <!-- NavTabs -->
    <div class="flex border-b border-gray-100 px-4">
      <button
        v-for="nav in navItems"
        :key="nav.key"
        :class="['px-4 py-2 text-sm transition-colors border-b-2 -mb-px', activeNav === nav.key ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800']"
        @click="activeNav = nav.key"
      >
        {{ nav.label }}
        <span v-if="nav.key === 'later' && laterTabs.length" class="ml-1 text-[10px] bg-amber-100 text-amber-700 px-1.5 rounded-full">{{ laterTabs.length }}</span>
      </button>
    </div>

    <!-- Toolbar -->
    <AppToolbar
      :isLaterPage="activeNav === 'later'"
      :isBatchMode="isBatchMode"
      :selectedCount="selectedIds.length"
      :viewMode="viewMode"
      :sortMode="sortMode"
      @viewChange="viewMode = $event"
      @sortChange="sortMode = $event"
      @toggleBatch="toggleBatch"
      @batchClose="batchClose"
      @closeUnpinned="closeUnpinned"
      @closeOthers="closeOthers"
    />

    <!-- Content -->
    <div class="flex-1 overflow-y-auto min-h-0 px-4 py-2">
      <!-- Later tab -->
      <LaterList v-if="activeNav === 'later'" :items="laterTabs" @remove="removeLater" />

      <!-- Home tab -->
      <template v-else>
        <!-- Pinned section -->
        <template v-if="pinnedItems.length">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">已固定</p>
          <div :class="gridClass" class="mb-4">
            <TabTileItem v-if="viewMode === 'tile'" v-for="item in pinnedItems" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
            <TabListItem v-else-if="viewMode === 'list'" v-for="item in pinnedItems" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
            <TabIconItem v-else v-for="item in pinnedItems" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" />
          </div>
        </template>

        <!-- Normal tabs -->
        <template v-if="sortMode === 'domain' && viewMode !== 'icon'">
          <div v-for="group in domainGroups" :key="group.domain" class="mb-4">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{{ group.domain }}</p>
            <div :class="gridClass">
              <TabTileItem v-if="viewMode === 'tile'" v-for="item in group.items" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
              <TabListItem v-else v-for="item in group.items" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="!normalItems.length && !pinnedItems.length" class="text-center text-gray-400 text-sm py-12">暂无标签</div>
          <div :class="gridClass">
            <TabTileItem v-if="viewMode === 'tile'" v-for="item in sortedNormalItems" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
            <TabListItem v-else-if="viewMode === 'list'" v-for="item in sortedNormalItems" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" @later="openLater(item.id)" @close="closeTab(item.id)" @copy="copyUrl(item.url)" />
            <TabIconItem v-else v-for="item in sortedNormalItems" :key="item.id" :item="item" :isBatch="isBatchMode" :isChecked="selectedIds.includes(item.id)" @activate="activateTab(item.id)" @toggle="toggleSelect(item.id)" />
          </div>
        </template>
      </template>
    </div>

    <!-- Footer -->
    <FooterStats :stats="stats" :activeFilter="activeFilter" @filter="activeFilter = $event" />

    <!-- Later Dialog -->
    <LaterDialog :open="laterDialogOpen" @close="laterDialogOpen = false" @confirm="confirmLater" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useTabManager } from "~composables/useTabManager"
import { useTabStats } from "~composables/useTabStats"
import { sortTabs, groupByDomain } from "~lib/sortUtils"
import AppToolbar from "~components/AppToolbar.vue"
import TabTileItem from "~components/TabTileItem.vue"
import TabListItem from "~components/TabListItem.vue"
import TabIconItem from "~components/TabIconItem.vue"
import LaterList from "~components/LaterList.vue"
import LaterDialog from "~components/LaterDialog.vue"
import FooterStats from "~components/FooterStats.vue"

const { tabs, laterTabs, closeTab, activateTab, moveToLater, removeLater } = useTabManager()
const statsRef = useTabStats(tabs)
const stats = computed(() => statsRef.value)

const activeNav = ref("home")
const viewMode = ref("tile")
const sortMode = ref("domain")
const search = ref("")
const isBatchMode = ref(false)
const selectedIds = ref<number[]>([])
const activeFilter = ref("all")
const laterDialogOpen = ref(false)
const pendingLaterTabId = ref<number | null>(null)

const navItems = [
  { key: "home", label: "全部标签" },
  { key: "later", label: "稍后处理" },
]

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

const gridClass = computed(() => {
  if (viewMode.value === "tile") return "grid grid-cols-2 gap-2"
  if (viewMode.value === "icon") return "grid grid-cols-6 gap-2"
  return "flex flex-col gap-1.5"
})

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

const closeUnpinned = async () => {
  for (const t of tabs.value.filter(t => !t.pinned && !t.active)) await closeTab(t.id)
}

const closeOthers = async () => {
  for (const t of tabs.value.filter(t => !t.active)) await closeTab(t.id)
}

const openLater = (id: number) => {
  pendingLaterTabId.value = id
  laterDialogOpen.value = true
}

const confirmLater = async (note: string) => {
  if (pendingLaterTabId.value !== null) {
    await moveToLater(pendingLaterTabId.value, note)
    pendingLaterTabId.value = null
  }
  laterDialogOpen.value = false
}

const copyUrl = (url: string) => navigator.clipboard.writeText(url)
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
</style>
