<template>
  <div>
    <!-- 分组行（有子项时） -->
    <div v-if="children.length"
      :style="{ paddingLeft: depth * 16 + 'px' }"
      :class="['flex items-center gap-1.5 py-1.5 pr-2 rounded group cursor-pointer relative', dropClass('group'), item.active ? 'bg-blue-50' : 'hover:bg-gray-50']"
      draggable="true"
      @dragstart.stop="onDragStart"
      @dragover.prevent.stop="onDragOver"
      @dragleave.stop="dropPos = null"
      @drop.stop="onDrop"
      @click="emit('activate')">
      <button @click.stop="expanded = !expanded" class="p-0.5 text-gray-400 hover:text-gray-700 shrink-0">
        <ChevronRight :size="12" :class="['transition-transform duration-150', expanded ? 'rotate-90' : '']" />
      </button>
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="statusBadge" />
      <p :class="['flex-1 text-xs truncate font-medium', item.active ? 'text-blue-700' : 'text-gray-800']">{{ item.title }}</p>
      <span class="text-[10px] text-gray-400 shrink-0">({{ totalCount }})</span>
      <button class="p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 shrink-0"
        @click.stop="closeAll" title="关闭全组"><X :size="11" /></button>
    </div>

    <!-- 子节点（带连接线） -->
    <div v-if="children.length && expanded" class="relative ml-3 pl-3 border-l border-gray-200">
      <TabTreeItem v-for="child in children" :key="child.item.id"
        :item="child.item" :children="child.children" :depth="(depth ?? 0) + 1"
        @activate="emit('activate-child', child.item.id)"
        @activate-child="emit('activate-child', $event)"
        @close="emit('close-child', child.item.id)"
        @close-child="emit('close-child', $event)" />
    </div>

    <!-- 叶子行（无子项） -->
    <div v-if="!children.length"
      :style="{ paddingLeft: (depth ?? 0) * 16 + 8 + 'px' }"
      :class="['flex items-center gap-1.5 py-1.5 pr-2 rounded cursor-pointer group relative', dropClass('leaf'), item.active ? 'bg-blue-50' : 'hover:bg-gray-50']"
      draggable="true"
      @dragstart.stop="onDragStart"
      @dragover.prevent.stop="onDragOver"
      @dragleave.stop="dropPos = null"
      @drop.stop="onDrop"
      @click="emit('activate')">
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="statusBadge" />
      <p :class="['flex-1 text-xs truncate', item.active ? 'text-blue-900 font-semibold' : 'text-gray-800']">{{ item.title }}</p>
      <button class="p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 shrink-0"
        @click.stop="emit('close')"><X :size="11" /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue"
import { ChevronRight, X } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import { getHighestPriorityStatus } from "~lib/statusPriority"

export interface TreeNode { item: TabItem; children: TreeNode[] }

const props = defineProps<{ item: TabItem; children: TreeNode[]; depth?: number }>()
const emit = defineEmits(["activate", "activate-child", "close", "close-child"])

const expanded = ref(true)
const dropPos = ref<'before' | 'into' | 'after' | null>(null)
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
  ids.forEach(id => emit('close-child', id))
  emit('close')
}

// 拖拽：inject 全局 handler（由 sidepanel provide）
const treeDragHandler = inject<(dragId: number, targetId: number, pos: 'before' | 'into' | 'after') => void>('treeDrag')

// 模块级变量存放正在拖动的 tabId（无需响应式）
let dragId: number | null = null

function onDragStart(e: DragEvent) {
  dragId = props.item.id
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('tabId', String(props.item.id))
}

function onDragOver(e: DragEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const y = e.clientY - rect.top
  const pct = y / rect.height
  if (pct < 0.3) dropPos.value = 'before'
  else if (pct > 0.7) dropPos.value = 'after'
  else dropPos.value = 'into'
}

function onDrop(e: DragEvent) {
  const id = parseInt(e.dataTransfer!.getData('tabId') || '') || dragId
  if (!id || id === props.item.id || !dropPos.value) return
  treeDragHandler?.(id, props.item.id, dropPos.value)
  dropPos.value = null
}

// drop 指示器 CSS
function dropClass(role: 'group' | 'leaf') {
  if (!dropPos.value) return ''
  if (dropPos.value === 'before') return 'border-t-2 border-blue-400'
  if (dropPos.value === 'after') return 'border-b-2 border-blue-400'
  return role === 'leaf' ? 'ring-1 ring-blue-400 bg-blue-50' : 'ring-1 ring-blue-400'
}
</script>
