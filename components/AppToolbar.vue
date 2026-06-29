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

      <!-- 视图切换 -->
      <button
        ref="viewTriggerRef"
        :class="['ml-auto flex items-center gap-1 px-2 py-1 text-xs border rounded transition-colors',
          popover.isOpen('toolbar-view') ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50']"
        @click.stop="onViewTriggerClick">
        <component :is="currentView.icon" :size="12" />{{ currentView.label }}<ChevronDown :size="10" class="text-gray-400" />
      </button>

      <!-- 排序切换 -->
      <button
        ref="sortTriggerRef"
        :disabled="viewMode === 'tree'"
        :class="['flex items-center gap-1 px-2 py-1 text-xs border rounded transition-colors',
          viewMode === 'tree' ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
            : popover.isOpen('toolbar-sort') ? 'border-blue-400 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:bg-gray-50']"
        :title="viewMode === 'tree' ? '树形视图下排序不可用' : ''"
        @click.stop="onSortTriggerClick">
        <ArrowUpDown :size="11" />{{ SORT_OPTIONS.find(o => o.value === sortMode)?.label }}
      </button>

      <!-- 清理 -->
      <button
        ref="cleanTriggerRef"
        :class="['flex items-center gap-1 px-2 py-1 text-xs border rounded transition-colors',
          popover.isOpen('toolbar-clean') ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50']"
        @click.stop="onCleanTriggerClick">
        <Trash2 :size="12" />清理
      </button>

    </template>
  </div>

  <!-- ============ Popover 内容（Teleport 到 body，fixed 定位）============ -->
  <Teleport to="body">
    <!-- 视图下拉 -->
    <div
      v-if="popover.isOpen('toolbar-view')"
      :style="viewPos"
      class="fixed z-[60] w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop>
      <button v-for="o in VIEW_OPTIONS" :key="o.value"
        :class="['flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
          viewMode === o.value ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30' : '']"
        @click="onViewOptionClick(o.value)">
        <component :is="o.icon" :size="12" />{{ o.label }}
      </button>
    </div>

    <!-- 排序下拉 -->
    <div
      v-if="popover.isOpen('toolbar-sort') && viewMode !== 'tree'"
      :style="sortPos"
      class="fixed z-[60] w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop>
      <button v-for="o in SORT_OPTIONS" :key="o.value"
        :class="['flex w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
          sortMode === o.value ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30' : '']"
        @click="onSortOptionClick(o.value)">{{ o.label }}</button>
    </div>

    <!-- 清理下拉 -->
    <div
      v-if="popover.isOpen('toolbar-clean')"
      :style="cleanPos"
      class="fixed z-[60] w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop>
      <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">直接关闭</p>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="onCleanOptionClick('closeUnpinned')"><X :size="12" />关闭非固定标签</button>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="onCleanOptionClick('closeOthers')"><X :size="12" />关闭其他标签（除当前页）</button>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="onCleanOptionClick('closeFrozenDiscarded')"><Snowflake :size="12" />关闭已冻结/已舍弃标签</button>
      <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
      <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">检测后选择</p>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="onCleanOptionClick('detectDuplicates')"><Search :size="12" />检测重复标签</button>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="onCleanOptionClick('detectUnused')"><Clock :size="12" />检测长期未使用标签</button>
    </div>

  </Teleport>
</template>

<script setup lang="ts">
/**
 * 工具栏（视图 / 排序 / 清理 / 批量 / 新建 / 刷新 / 前后导航）。
 *
 * 重要变更（2026-06-29 批量菜单重构）：
 * - 批量按钮改为下拉触发器，点击进入批量并展开菜单
 * - 批量菜单包含选择操作（全选/反选）和批量动作（关闭/稍后/分组/标记）
 * - 分组/标记使用 hover 二级子菜单，参考 HeaderMenu 的实现方式
 * - 新增 canBatch prop 用于在聚焦选择态时禁用批量按钮
 */
import { ref, computed, watch } from "vue"
import {
  Plus, Trash2, LayoutGrid, List, Grid2X2, GitFork, ArrowUpDown,
  X, Search, Clock, Snowflake,
  ChevronLeft, ChevronRight, ChevronDown, RotateCw
} from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"

const props = defineProps<{
  isLaterPage: boolean
  viewMode: string
  sortMode: string
  canGoBack: boolean
  canGoForward: boolean
}>()

const emit = defineEmits<{
  (e: "newTab"): void
  (e: "viewChange", mode: string): void
  (e: "sortChange", mode: string): void
  (e: "closeUnpinned"): void
  (e: "closeOthers"): void
  (e: "closeFrozenDiscarded"): void
  (e: "detectDuplicates"): void
  (e: "detectUnused"): void
  (e: "goBack"): void
  (e: "goForward"): void
  (e: "refreshCurrent"): void
}>()

const popover = usePopoverManager()

const viewTriggerRef = ref<HTMLElement | null>(null)
const sortTriggerRef = ref<HTMLElement | null>(null)
const cleanTriggerRef = ref<HTMLElement | null>(null)

// fixed 定位计算
const viewPos = computed(() => {
  if (!popover.isOpen("toolbar-view") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 112 }, "bottom-left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
const sortPos = computed(() => {
  if (!popover.isOpen("toolbar-sort") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 128 }, "bottom-left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
const cleanPos = computed(() => {
  if (!popover.isOpen("toolbar-clean") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 224 }, "bottom-left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})

// 视图/排序/清理触发：用 $event.currentTarget 直接拿 DOM，绕开 ref 模板 unwrap 不确定性
const onViewTriggerClick = (e: MouseEvent) => {
  popover.toggle("toolbar-view", e.currentTarget as HTMLElement)
}
const onSortTriggerClick = (e: MouseEvent) => {
  if (props.viewMode === "tree") return
  popover.toggle("toolbar-sort", e.currentTarget as HTMLElement)
}
const onCleanTriggerClick = (e: MouseEvent) => {
  popover.toggle("toolbar-clean", e.currentTarget as HTMLElement)
}

const onViewOptionClick = (value: string) => {
  emit("viewChange", value)
  popover.close("toolbar-view")
}

const onSortOptionClick = (value: string) => {
  emit("sortChange", value)
  popover.close("toolbar-sort")
}

const onCleanOptionClick = (action: "closeUnpinned" | "closeOthers" | "closeFrozenDiscarded" | "detectDuplicates" | "detectUnused") => {
  emit(action)
  popover.close("toolbar-clean")
}

// 切到树形视图时，自动关闭"排序"浮层
watch(() => props.viewMode, (mode) => {
  if (mode === "tree" && popover.isOpen("toolbar-sort")) popover.close("toolbar-sort")
})

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
