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

      <!-- 批量按钮：跟其他工具栏按钮视觉一致，激活时蓝底 -->
      <button
        ref="batchTriggerRef"
        :disabled="!canBatch"
        :class="['flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors',
          !canBatch ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50' :
          isBatchMode ? (popover.isOpen('toolbar-batch') ? 'border-blue-400 bg-blue-50 text-blue-700' : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100')
          : 'border-gray-200 hover:bg-gray-50']"
        @click.stop="canBatch && onBatchButtonClick($event)">
        <component :is="isBatchMode ? XSquare : CheckSquare" :size="11" />
        {{ isBatchMode ? '取消批量' : '批量' }}
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
        @click="emit('viewChange', o.value); popover.close('toolbar-view')">
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
        @click="emit('sortChange', o.value); popover.close('toolbar-sort')">{{ o.label }}</button>
    </div>

    <!-- 清理下拉 -->
    <div
      v-if="popover.isOpen('toolbar-clean')"
      :style="cleanPos"
      class="fixed z-[60] w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop>
      <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">直接关闭</p>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('closeUnpinned'); popover.close('toolbar-clean')"><X :size="12" />关闭非固定标签</button>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('closeOthers'); popover.close('toolbar-clean')"><X :size="12" />关闭其他标签（除当前页）</button>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('closeFrozenDiscarded'); popover.close('toolbar-clean')"><Snowflake :size="12" />关闭已冻结/已舍弃标签</button>
      <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
      <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">检测后选择</p>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('detectDuplicates'); popover.close('toolbar-clean')"><Search :size="12" />检测重复标签</button>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('detectUnused'); popover.close('toolbar-clean')"><Clock :size="12" />检测长期未使用标签</button>
    </div>

    <!-- 批量下拉主菜单 -->
    <div
      v-if="popover.isOpen('toolbar-batch')"
      :style="batchPos"
      class="fixed z-[60] w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop
      @mouseleave="activeSubmenu = null">
      <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">选择</p>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('selectAll')">
        <CheckSquare :size="12" />全选可见
      </button>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('invertSelection')">
        <RefreshCw :size="12" />反选
      </button>
      <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
      <p class="px-3 py-1 text-[10px] text-gray-400 font-medium uppercase tracking-wide">操作</p>
      <button
        :disabled="!selectedCount"
        :class="['flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left transition-colors',
          selectedCount ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed']"
        @click="onBatchCloseClick">
        <X :size="12" />
        <span class="flex-1">关闭 {{ selectedCount }} 个</span>
      </button>
      <button
        :disabled="!selectedCount"
        :class="['flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left transition-colors',
          selectedCount ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed']"
        @click="onBatchLaterClick">
        <Clock :size="12" class="text-amber-500" />
        <span class="flex-1">加入稍后处理</span>
      </button>
      <button
        ref="groupRowRef"
        :disabled="!selectedCount"
        :class="['flex items-center justify-between w-full px-3 py-1.5 text-xs text-left transition-colors',
          selectedCount ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed',
          activeSubmenu === 'group' && 'bg-gray-50 dark:bg-gray-700']"
        @mouseenter="selectedCount && onEnterSubmenuRow('group', groupRowRef)">
        <span class="flex items-center gap-2"><Folder :size="12" class="text-blue-500" />加入分组</span>
        <ChevronLeft :size="11" class="text-gray-400" />
      </button>
      <button
        ref="tagRowRef"
        :disabled="!selectedCount"
        :class="['flex items-center justify-between w-full px-3 py-1.5 text-xs text-left transition-colors',
          selectedCount ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed',
          activeSubmenu === 'tag' && 'bg-gray-50 dark:bg-gray-700']"
        @mouseenter="selectedCount && onEnterSubmenuRow('tag', tagRowRef)">
        <span class="flex items-center gap-2"><Tag :size="12" class="text-purple-500" />添加标记</span>
        <ChevronLeft :size="11" class="text-gray-400" />
      </button>
      <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30" @click="emit('exitBatch')">
        <XSquare :size="12" />退出批量
      </button>
    </div>

    <!-- 批量二级子菜单：加入分组 -->
    <div
      v-if="popover.isOpen('toolbar-batch') && activeSubmenu === 'group'"
      :style="groupSubmenuPos"
      class="fixed z-[60] w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop
      @mouseenter="activeSubmenu = 'group'">
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('createNewGroup'); popover.close('toolbar-batch')">
        <Plus :size="12" />新建分组...
      </button>
      <div v-if="groups.length" class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
      <button
        v-for="g in groups" :key="g.id"
        class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        @click="emit('pickGroup', g.id); popover.close('toolbar-batch')">
        <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: g.color ? colorMap[g.color] : '#6b7280' }"></span>
        <span class="flex-1 truncate">{{ g.title || '未命名分组' }}</span>
      </button>
    </div>

    <!-- 批量二级子菜单：添加标记 -->
    <div
      v-if="popover.isOpen('toolbar-batch') && activeSubmenu === 'tag'"
      :style="tagSubmenuPos"
      class="fixed z-[60] w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
      @click.stop
      @mouseenter="activeSubmenu = 'tag'">
      <div v-if="!allTags.length" class="px-3 py-1.5 text-xs text-gray-400">暂无标记</div>
      <button
        v-for="tag in allTags" :key="tag"
        class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        @click="emit('applyTags', [tag])">
        <span class="w-2 h-2 rounded-full bg-purple-500"></span>
        <span class="flex-1 truncate">{{ tag }}</span>
      </button>
      <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
      <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30" @click="showNewTagDialog = true">
        <Plus :size="12" />新建标记...
      </button>
    </div>

    <!-- 新建标记对话框 -->
    <div v-if="showNewTagDialog" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/30" @click.self="showNewTagDialog = false">
      <div class="w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4" @click.stop>
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">新建标记</h3>
        <input
          v-model="newTagName"
          type="text"
          maxlength="15"
          class="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder="输入标记名称"
          @keyup.enter="onNewTagConfirm"
          @keyup.escape="showNewTagDialog = false"
        />
        <div class="flex justify-end gap-2 mt-4">
          <button class="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded" @click="showNewTagDialog = false">取消</button>
          <button class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" :disabled="!newTagName.trim()" @click="onNewTagConfirm">创建</button>
        </div>
      </div>
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
  CheckSquare, XSquare, X, Search, Clock, Snowflake,
  ChevronLeft, ChevronRight, ChevronDown, RotateCw, RefreshCw,
  Folder, Tag, Palette
} from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"

const props = defineProps<{
  isLaterPage: boolean
  isBatchMode: boolean
  selectedCount: number
  viewMode: string
  sortMode: string
  canGoBack: boolean
  canGoForward: boolean
  canBatch: boolean
  groups: chrome.tabGroups.TabGroup[]
  allTags: string[]
}>()

const emit = defineEmits<{
  (e: "newTab"): void
  (e: "viewChange", mode: string): void
  (e: "sortChange", mode: string): void
  (e: "toggleBatch"): void
  (e: "exitBatch"): void
  (e: "selectAll"): void
  (e: "invertSelection"): void
  (e: "batchClose"): void
  (e: "batchLater"): void
  (e: "pickGroup", groupId: number): void
  (e: "createNewGroup"): void
  (e: "applyTags", tags: string[]): void
  (e: "addNewTag", name: string): void
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
const batchTriggerRef = ref<HTMLElement | null>(null)
const groupRowRef = ref<HTMLElement | null>(null)
const tagRowRef = ref<HTMLElement | null>(null)

const activeSubmenu = ref<"group" | "tag" | null>(null)
const submenuAnchorRect = ref<DOMRect | null>(null)
const showNewTagDialog = ref(false)
const newTagName = ref("")

// Chrome 分组颜色到实际颜色的映射
const colorMap: Record<string, string> = {
  grey: "#6b7280",
  blue: "#3b82f6",
  red: "#ef4444",
  yellow: "#eab308",
  green: "#22c55e",
  pink: "#ec4899",
  purple: "#a855f7",
  cyan: "#06b6d4",
  orange: "#f97316",
}

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
const batchPos = computed(() => {
  if (!popover.isOpen("toolbar-batch") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 192, height: 280 }, "bottom-right")
  return { left: `${p.left}px`, top: `${p.top}px` }
})

// 子菜单位置：向左展开
const groupSubmenuPos = computed(() => {
  if (!submenuAnchorRect.value) return { left: "0px", top: "0px" }
  const rect = submenuAnchorRect.value
  let left = rect.left - 180 - 4
  if (left < 4) left = rect.right + 4
  return { left: `${left}px`, top: `${rect.top}px` }
})
const tagSubmenuPos = computed(() => {
  if (!submenuAnchorRect.value) return { left: "0px", top: "0px" }
  const rect = submenuAnchorRect.value
  let left = rect.left - 160 - 4
  if (left < 4) left = rect.right + 4
  return { left: `${left}px`, top: `${rect.top}px` }
})

const onBatchButtonClick = (e: MouseEvent) => {
  if (!props.canBatch) return
  if (props.isBatchMode) {
    // 批量态：点击 = 退出批量 + 关菜单
    popover.close("toolbar-batch")
    emit("exitBatch")
  } else {
    // 普通态：点击 = 进入批量 + 自动展开菜单
    // 用 e.currentTarget 直接拿按钮 DOM，绕开 ref binding 时序不确定性
    emit("toggleBatch")
    popover.open("toolbar-batch", e.currentTarget as HTMLElement)
  }
}

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

// 关闭/稍后/分组/标记 动作：执行后关闭主菜单（除"添加标记"后保留批量模式，由 sidepanel 控制）
const onBatchCloseClick = () => {
  if (!props.selectedCount) return
  emit("batchClose")
  popover.close("toolbar-batch")
}
const onBatchLaterClick = () => {
  if (!props.selectedCount) return
  emit("batchLater")
  popover.close("toolbar-batch")
}

const onEnterSubmenuRow = (type: "group" | "tag", rowEl: HTMLElement | null) => {
  activeSubmenu.value = type
  submenuAnchorRect.value = rowEl?.getBoundingClientRect() ?? null
}

const onNewTagConfirm = () => {
  if (newTagName.value.trim()) {
    emit("addNewTag", newTagName.value.trim())
    showNewTagDialog.value = false
    newTagName.value = ""
  }
}

// 主菜单一关，子菜单跟着归零
watch(() => popover.isOpen("toolbar-batch"), (open) => {
  if (!open) {
    activeSubmenu.value = null
    submenuAnchorRect.value = null
    showNewTagDialog.value = false
    newTagName.value = ""
  }
})

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
