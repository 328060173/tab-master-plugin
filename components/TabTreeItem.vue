<template>
  <div>
    <!-- 分组行（有子项时） -->
    <div v-if="children.length"
      :style="{ paddingLeft: depth * 16 + 'px' }"
      :class="['flex items-center gap-1.5 py-1.5 pr-2 rounded group cursor-pointer relative', dropClass('group'), isBatch && isChecked ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20' : item.active ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800']"
      draggable="true"
      @dragstart.stop="onDragStart"
      @dragover.prevent.stop="onDragOver"
      @dragleave.stop="dropPos = null"
      @drop.stop="onDrop"
      @click="isBatch ? emit('toggle') : emit('activate')">
      <button @click.stop="expanded = !expanded" class="p-0.5 text-gray-400 hover:text-gray-700 shrink-0">
        <ChevronRight :size="12" :class="['transition-transform duration-150', expanded ? 'rotate-90' : '']" />
      </button>
      <!-- 批量复选框 -->
      <input v-if="isBatch" type="checkbox" :checked="isChecked"
        class="w-4 h-4 cursor-pointer shrink-0 accent-blue-600"
        @click.stop @change.stop="emit('toggle')" />
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="statusBadge" />
      <p :class="['flex-1 text-xs truncate font-medium', item.active ? 'text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200']">{{ item.title }}</p>
      <span class="text-[10px] text-gray-400 shrink-0">({{ totalCount }})</span>
      <button :class="['p-0.5 rounded shrink-0', popover.isOpen(hoverCardId) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700']"
        @click.stop="onMenuClick" title="更多操作"><Menu :size="13" :stroke-width="2.25" /></button>
      <button class="p-0.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded shrink-0"
        @click.stop="closeAll" title="关闭全组"><X :size="12" :stroke-width="2.5" /></button>
    </div>

    <!-- 子节点（带连接线） -->
    <div v-if="children.length && expanded" class="relative ml-3 pl-3 border-l border-gray-200 dark:border-gray-700">
      <TabTreeItem v-for="child in children" :key="child.item.id"
        :item="child.item" :children="child.children" :depth="(depth ?? 0) + 1"
        :isBatch="isBatch"
        :isChecked="isChildChecked(child.item.id)"
        @activate="emit('activate-child', child.item.id)"
        @activate-child="emit('activate-child', $event)"
        @close="emit('close-child', child.item.id)"
        @close-child="emit('close-child', $event)"
        @toggle="emit('toggle-child', child.item.id)"
        @toggle-child="emit('toggle-child', $event)" />
    </div>

    <!-- 叶子行（无子项） -->
    <div v-if="!children.length"
      :style="{ paddingLeft: (depth ?? 0) * 16 + 8 + 'px' }"
      :class="['flex items-center gap-1.5 py-1.5 pr-2 rounded cursor-pointer group relative', dropClass('leaf'), isBatch && isChecked ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20' : item.active ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800']"
      draggable="true"
      @dragstart.stop="onDragStart"
      @dragover.prevent.stop="onDragOver"
      @dragleave.stop="dropPos = null"
      @drop.stop="onDrop"
      @click="isBatch ? emit('toggle') : emit('activate')">
      <!-- 批量复选框 -->
      <input v-if="isBatch" type="checkbox" :checked="isChecked"
        class="w-4 h-4 cursor-pointer shrink-0 accent-blue-600"
        @click.stop @change.stop="emit('toggle')" />
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="statusBadge" />
      <p :class="['flex-1 text-xs truncate', item.active ? 'text-blue-900 font-semibold dark:text-blue-400' : 'text-gray-800 dark:text-gray-200']">{{ item.title }}</p>
      <button :class="['p-0.5 rounded shrink-0', popover.isOpen(hoverCardId) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700']"
        @click.stop="onMenuClick" title="更多操作"><Menu :size="13" :stroke-width="2.25" /></button>
      <button class="p-0.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded shrink-0"
        @click.stop="emit('close')" title="关闭"><X :size="12" :stroke-width="2.5" /></button>
    </div>

    <TabHoverCard
      :hoverCardId="hoverCardId" :item="item"
      @refresh="onRefresh"
      @copy="onCopy"
      @pin="onPin"
      @addTag="onAddTag"
      @later="onLater"
      @close="onClose"
      @updateNumber="onUpdateNumber"
      @removeTag="onRemoveTag"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue"
import { ChevronRight, X, Menu } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import TabHoverCard from "./TabHoverCard.vue"
import { getHighestPriorityStatus } from "~lib/statusPriority"
import { usePopoverManager } from "~composables/usePopoverManager"

export interface TreeNode { item: TabItem; children: TreeNode[] }

const props = defineProps<{
  item: TabItem;
  children: TreeNode[];
  depth?: number;
  isBatch?: boolean;
  isChecked?: boolean;
}>()
const emit = defineEmits([
  "activate", "activate-child", "close", "close-child",
  "toggle", "toggle-child"
])

const popover = usePopoverManager()
const hoverCardId = `hover-card-${props.item.id}`

const onMenuClick = (e: MouseEvent) => {
  popover.toggle(hoverCardId, e.currentTarget as HTMLElement)
}

// 递归收集所有子节点的 id
const collectAllChildIds = (nodes: TreeNode[]): number[] => {
  const ids: number[] = []
  for (const node of nodes) {
    ids.push(node.item.id)
    ids.push(...collectAllChildIds(node.children))
  }
  return ids
}

// 检查子节点是否被选中（用于分组行的复选框状态）
// 子节点是否选中 —— 通过 inject 从 sidepanel 拿全局 selectedIds 判断
// 否则递归 TabTreeItem 时子节点拿不到正确的勾选状态（之前误用 props.isChecked）
const isTabSelected = inject<(id: number) => boolean>("isTabSelected", () => false)
const isChildChecked = (childId: number): boolean => isTabSelected(childId)

const treeAction = inject<(action: string, item: TabItem, data?: any) => void>("treeAction")

// 事件处理函数
const onRefresh = () => treeAction?.("refresh", props.item)
const onCopy = () => treeAction?.("copy", props.item)
const onPin = () => treeAction?.("pin", props.item)
const onAddTag = (anchor: HTMLElement) => treeAction?.("addTag", props.item, anchor)
const onLater = () => treeAction?.("later", props.item)
const onClose = () => {
  if (props.children.length) {
    closeAll()
  } else {
    emit("close")
  }
}
const onUpdateNumber = (n: number) => treeAction?.("updateNumber", props.item, n)
const onRemoveTag = (tag: string) => treeAction?.("removeTag", props.item, tag)

const expanded = ref(true)
const dropPos = ref<"before" | "into" | "after" | null>(null)
const statusBadge = computed(() => getHighestPriorityStatus(props.item)?.icon)

// 递归统计所有后代数量
const totalCount = computed(() => {
  const count = (nodes: TreeNode[]): number => nodes.reduce((n, c) => n + 1 + count(c.children), 0)
  return count(props.children)
})

// 关闭整组（含所有后代）
function closeAll() {
  const ids: number[] = []
  const collect = (nodes: TreeNode[]) => nodes.forEach(n => { ids.push(n.item.id); collect(n.children) })
  collect(props.children)
  ids.forEach(id => emit("close-child", id))
  emit("close")
}

// 拖拽：inject 全局 handler（由 sidepanel provide）
const treeDragHandler = inject<(dragId: number, targetId: number, pos: "before" | "into" | "after") => void>("treeDrag")

// 模块级变量存放正在拖动的 tabId（无需响应式）
let dragId: number | null = null

function onDragStart(e: DragEvent) {
  dragId = props.item.id
  e.dataTransfer!.effectAllowed = "move"
  e.dataTransfer!.setData("tabId", String(props.item.id))
}

function onDragOver(e: DragEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const y = e.clientY - rect.top
  const pct = y / rect.height
  if (pct < 0.3) dropPos.value = "before"
  else if (pct > 0.7) dropPos.value = "after"
  else dropPos.value = "into"
}

function onDrop(e: DragEvent) {
  const id = parseInt(e.dataTransfer!.getData("tabId") || "") || dragId
  if (!id || id === props.item.id || !dropPos.value) return
  treeDragHandler?.(id, props.item.id, dropPos.value)
  dropPos.value = null
}

// drop 指示器 CSS
function dropClass(role: "group" | "leaf") {
  if (!dropPos.value) return ""
  if (dropPos.value === "before") return "border-t-2 border-blue-400"
  if (dropPos.value === "after") return "border-b-2 border-blue-400"
  return role === "leaf" ? "ring-1 ring-blue-400 bg-blue-50 dark:bg-blue-900/20" : "ring-1 ring-blue-400"
}
</script>
