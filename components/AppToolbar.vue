<template>
  <div class="flex items-center gap-1 px-3 py-1.5 border-b border-gray-100 flex-wrap">
    <template v-if="!isLaterPage">
      <button class="p-1 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900" title="新建标签" @click="emit('newTab')">
        <Plus :size="15" :stroke-width="2.5" />
      </button>
      <button class="p-1 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900" title="刷新当前标签" @click="emit('refreshCurrent')">
        <RotateCw :size="14" :stroke-width="2.25" />
      </button>
      <button class="p-1 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900 disabled:opacity-30" :disabled="!canGoBack" @click="emit('goBack')" title="上一个标签"><ChevronLeft :size="15" :stroke-width="2.5" /></button>
      <button class="p-1 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900 disabled:opacity-30" :disabled="!canGoForward" @click="emit('goForward')" title="下一个标签"><ChevronRight :size="15" :stroke-width="2.5" /></button>
      <div class="relative ml-auto">
        <button class="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50" @click.stop="viewOpen = !viewOpen">
          <component :is="currentView.icon" :size="12" />{{ currentView.label }}<ChevronDown :size="10" class="text-gray-400" />
        </button>
        <div v-if="viewOpen" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 w-28 py-1" v-click-outside="() => viewOpen = false">
          <button v-for="o in VIEW_OPTIONS" :key="o.value"
            :class="['flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50', viewMode === o.value ? 'text-blue-600 font-medium bg-blue-50' : '']"
            @click="emit('viewChange', o.value); viewOpen=false">
            <component :is="o.icon" :size="12" />{{ o.label }}
          </button>
        </div>
      </div>
      <div class="relative">
        <button
          :disabled="viewMode === 'tree'"
          :class="['flex items-center gap-1 px-2 py-1 text-xs border rounded', viewMode === 'tree' ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50' : 'border-gray-200 hover:bg-gray-50']"
          :title="viewMode === 'tree' ? '树形视图下排序不可用' : ''"
          @click.stop="viewMode !== 'tree' && (sortOpen = !sortOpen)">
          <ArrowUpDown :size="11" />{{ SORT_OPTIONS.find(o => o.value === sortMode)?.label }}
        </button>
        <div v-if="sortOpen && viewMode !== 'tree'" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 w-32 py-1" v-click-outside="() => sortOpen = false">
          <button v-for="o in SORT_OPTIONS" :key="o.value" :class="['flex w-full px-3 py-1.5 text-xs hover:bg-gray-50', sortMode === o.value ? 'text-blue-600 font-medium' : '']" @click="emit('sortChange', o.value); sortOpen=false">{{ o.label }}</button>
        </div>
      </div>
      <div class="relative">
        <button class="flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50" @click.stop="cleanOpen = !cleanOpen">
          <Trash2 :size="12" />清理
        </button>
        <div v-if="cleanOpen" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 w-52 py-1" v-click-outside="() => cleanOpen = false">
          <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">关闭标签</p>
          <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50" @click="emit('closeUnpinned'); cleanOpen=false"><X :size="12" />关闭非固定标签</button>
          <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50" @click="emit('closeOthers'); cleanOpen=false"><X :size="12" />关闭其他标签（除当前页）</button>
          <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50" @click="emit('closeFrozenDiscarded'); cleanOpen=false"><X :size="12" />关闭已冻结/已舍弃标签</button>
          <div class="border-t border-gray-100 my-1"></div>
          <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">检测</p>
          <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50" @click="emit('detectDuplicates'); cleanOpen=false"><Search :size="12" />检测重复标签</button>
          <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50" @click="emit('detectUnused'); cleanOpen=false"><Search :size="12" />检测长时间未使用标签</button>
        </div>
      </div>
      <button :class="['flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors', isBatchMode ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 hover:bg-gray-50']" @click="emit('toggleBatch')">
        <component :is="isBatchMode ? XSquare : CheckSquare" :size="11" />{{ isBatchMode ? '取消' : '批量' }}
      </button>
      <button v-if="isBatchMode && selectedCount" class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600" @click="emit('batchClose')">
        关闭({{ selectedCount }})
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Plus, Trash2, LayoutGrid, List, Grid2X2, GitFork, ArrowUpDown, CheckSquare, XSquare, X, Search, ChevronLeft, ChevronRight, ChevronDown, RotateCw } from "@lucide/vue"
import { vClickOutside } from "~lib/clickOutside"

const props = defineProps<{
  isLaterPage: boolean; isBatchMode: boolean; selectedCount: number
  viewMode: string; sortMode: string; canGoBack: boolean; canGoForward: boolean
}>()
const emit = defineEmits(["newTab", "viewChange", "sortChange", "toggleBatch", "batchClose", "closeUnpinned", "closeOthers", "closeFrozenDiscarded", "detectDuplicates", "detectUnused", "goBack", "goForward", "refreshCurrent"])

const cleanOpen = ref(false)
const viewOpen = ref(false)
const sortOpen = ref(false)

const VIEW_OPTIONS = [
  { value: "tile", label: "平铺", icon: LayoutGrid },
  { value: "list", label: "列表", icon: List },
  { value: "icon", label: "图标", icon: Grid2X2 },
  { value: "tree", label: "树形", icon: GitFork },
]
const SORT_OPTIONS = [
  { value: "domain", label: "按域名" },
  { value: "timeAsc", label: "时间正序" },
  { value: "timeDesc", label: "时间倒序" },
]
const currentView = computed(() => VIEW_OPTIONS.find(o => o.value === props.viewMode) || VIEW_OPTIONS[1])
</script>
