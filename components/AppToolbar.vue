<template>
  <div v-bind="$attrs" class="flex items-center gap-1 px-2 py-1.5 border-b border-gray-100 flex-nowrap">
    <template v-if="!isLaterPage">
      <button
        class="p-0.5 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900"
        :title="t('toolbar.newTab')"
        @click="emit('newTab')">
        <Plus :size="13" :stroke-width="2.5" />
      </button>
      <button
        class="p-0.5 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900"
        :title="t('toolbar.refresh')"
        @click="emit('refreshCurrent')">
        <RotateCw :size="12" :stroke-width="2.25" />
      </button>
      <button
        class="p-0.5 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900 disabled:opacity-30"
        :disabled="!canGoBack"
        @click="emit('goBack')"
        :title="t('toolbar.prev')">
        <ChevronLeft :size="13" :stroke-width="2.5" />
      </button>
      <button
        class="p-0.5 rounded hover:bg-gray-100 text-gray-700 hover:text-gray-900 disabled:opacity-30"
        :disabled="!canGoForward"
        @click="emit('goForward')"
        :title="t('toolbar.next')">
        <ChevronRight :size="13" :stroke-width="2.5" />
      </button>

      <!-- 视图切换 -->
      <button
        :class="[
          'ml-0.5 flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border rounded transition-colors whitespace-nowrap min-w-[56px] justify-start',
          popover.isOpen('toolbar-view')
            ? 'border-blue-400 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:bg-gray-50'
        ]"
        @click.stop="onViewTriggerClick">
        <component :is="currentView.icon" :size="11" />{{ currentView.label
        }}<ChevronDown :size="9" class="text-gray-400" />
      </button>

      <!-- 排序切换 -->
      <button
        :disabled="viewMode === 'tree'"
        :class="[
          'flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border rounded transition-colors whitespace-nowrap min-w-[80px] justify-start',
          viewMode === 'tree'
            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
            : popover.isOpen('toolbar-sort')
              ? 'border-blue-400 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:bg-gray-50'
        ]"
        :title="
          viewMode === 'tree'
            ? t('toolbar.sortDisabled')
            : SORT_OPTIONS.find((o) => o.value === sortMode)?.hint || t('toolbar.sortHint')
        "
        @click.stop="onSortTriggerClick">
        <ArrowUpDown :size="10" />{{
          SORT_OPTIONS.find((o) => o.value === sortMode)?.label
        }}
      </button>

      <!-- 整理（点开是一组整理工具菜单，▾ 提示可展开，不是一键删除）-->
      <button
        :class="[
          'flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] border rounded transition-colors whitespace-nowrap',
          popover.isOpen('toolbar-clean')
            ? 'border-blue-400 bg-blue-50 text-blue-700'
            : 'border-gray-200 hover:bg-gray-50'
        ]"
        @click.stop="onCleanTriggerClick">
        <ListChecks :size="11" />{{ t('toolbar.clean') }}<ChevronDown
          :size="9"
          class="text-gray-400" />
      </button>
    </template>
  </div>

  <!-- ============ Popover 内容（Teleport 到 body，fixed 定位）============ -->
  <Teleport to="body">
    <!-- 视图下拉 -->
    <div
      v-if="popover.isOpen('toolbar-view')"
      :style="viewPos"
      class="fixed z-[60] w-[112px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop>
      <button
        v-for="o in VIEW_OPTIONS"
        :key="o.value"
        :class="[
          'flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
          viewMode === o.value
            ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30'
            : ''
        ]"
        @click="onViewOptionClick(o.value)">
        <component :is="o.icon" :size="12" />{{ o.label }}
      </button>
    </div>

    <!-- 排序下拉 -->
    <div
      v-if="popover.isOpen('toolbar-sort') && viewMode !== 'tree'"
      :style="sortPos"
      class="fixed z-[60] w-[128px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop>
      <button
        v-for="o in SORT_OPTIONS"
        :key="o.value"
        :class="[
          'flex w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
          sortMode === o.value
            ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30'
            : ''
        ]"
        :title="o.hint"
        @click="onSortOptionClick(o.value)">
        {{ o.label }}
      </button>
    </div>

    <!-- 整理下拉 -->
    <div
      v-if="popover.isOpen('toolbar-clean')"
      :style="cleanPos"
      class="fixed z-[60] w-[224px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop>
      <p
        class="px-3 pt-1.5 pb-0.5 text-[10px] font-medium tracking-wide text-red-500">
        {{ t('toolbar.clean.directTitle') }}
      </p>
      <button
        class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        @click="onCleanOptionClick('closeUnpinned')">
        <X :size="12" />{{ t('toolbar.closeUnpinned') }}
      </button>
      <button
        class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        @click="onCleanOptionClick('closeOthers')">
        <X :size="12" />{{ t('toolbar.closeOthers') }}
      </button>
      <button
        class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        @click="onCleanOptionClick('closeFrozenDiscarded')">
        <Snowflake :size="12" />{{ t('toolbar.closeFrozenDiscarded') }}
      </button>
      <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
      <p
        class="px-3 pt-1.5 pb-0.5 text-[10px] font-medium tracking-wide text-gray-400">
        {{ t('toolbar.clean.detectTitle') }}
      </p>
      <button
        class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        @click="onCleanOptionClick('detectDuplicates')">
        <Search :size="12" />{{ t('toolbar.detectDuplicates') }}
      </button>
      <button
        class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        @click="onCleanOptionClick('detectUnused')">
        <Clock :size="12" />{{ t('toolbar.detectUnused') }}
      </button>
    </div>
  </Teleport>
</template>

<script lang="ts">
// inheritAttrs:false + 根 div v-bind="$attrs"：显式接收 fallthrough 属性
// （如 sidepanel 传的 data-onboarding-target）。本组件模板为多根
// （主 div + Teleport 兄弟节点 → fragment），自动继承会失败刷
// [Vue warn] Extraneous non-props attributes（零容忍红线），故显式绑定根 div
export default { inheritAttrs: false }
</script>
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
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  GitFork,
  Grid2X2,
  LayoutGrid,
  List,
  ListChecks,
  Plus,
  RotateCw,
  Search,
  Snowflake,
  X
} from "@lucide/vue"
import { computed, watch } from "vue"

import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"
import { t } from "~lib/i18n"

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

// fixed 定位计算
const viewPos = computed(() => {
  if (!popover.isOpen("toolbar-view") || !popover.activeAnchorRect.value)
    return { left: "0px", top: "0px" }
  const p = computePopoverPos(
    popover.activeAnchorRect.value,
    { width: 112 },
    "bottom-left"
  )
  return { left: `${p.left}px`, top: `${p.top}px` }
})
const sortPos = computed(() => {
  if (!popover.isOpen("toolbar-sort") || !popover.activeAnchorRect.value)
    return { left: "0px", top: "0px" }
  const p = computePopoverPos(
    popover.activeAnchorRect.value,
    { width: 128 },
    "bottom-left"
  )
  return { left: `${p.left}px`, top: `${p.top}px` }
})
const cleanPos = computed(() => {
  if (!popover.isOpen("toolbar-clean") || !popover.activeAnchorRect.value)
    return { left: "0px", top: "0px" }
  const p = computePopoverPos(
    popover.activeAnchorRect.value,
    { width: 224 },
    "bottom-left"
  )
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

const onCleanOptionClick = (
  action:
    | "closeUnpinned"
    | "closeOthers"
    | "closeFrozenDiscarded"
    | "detectDuplicates"
    | "detectUnused"
) => {
  // 逐个 emit，避免联合类型无法匹配 emit 重载
  switch (action) {
    case "closeUnpinned":
      emit("closeUnpinned")
      break
    case "closeOthers":
      emit("closeOthers")
      break
    case "closeFrozenDiscarded":
      emit("closeFrozenDiscarded")
      break
    case "detectDuplicates":
      emit("detectDuplicates")
      break
    case "detectUnused":
      emit("detectUnused")
      break
  }
  popover.close("toolbar-clean")
}

// 切到树形视图时，自动关闭"排序"浮层
watch(
  () => props.viewMode,
  (mode) => {
    if (mode === "tree" && popover.isOpen("toolbar-sort"))
      popover.close("toolbar-sort")
  }
)

const VIEW_OPTIONS = computed(() => [
  { value: "tile", label: t("view.tile"), icon: LayoutGrid },
  { value: "list", label: t("view.list"), icon: List },
  { value: "icon", label: t("view.icon"), icon: Grid2X2 },
  { value: "tree", label: t("view.tree"), icon: GitFork }
])
const SORT_OPTIONS = computed(() => [
  { value: "domain", label: t("sort.domain"), hint: t("sort.hint.domain") },
  {
    value: "lastAccessed",
    label: t("sort.recentAccessed"),
    hint: t("sort.hint.recentAccessed")
  },
  { value: "timeAsc", label: t("sort.openedTimeAsc"), hint: t("sort.hint.openedTimeAsc") },
  { value: "timeDesc", label: t("sort.openedTimeDesc"), hint: t("sort.hint.openedTimeDesc") }
])
const currentView = computed(
  () => VIEW_OPTIONS.value.find((o) => o.value === props.viewMode) || VIEW_OPTIONS.value[1]
)
</script>
