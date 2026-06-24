<template>
  <div v-if="items.length" class="shrink-0 border-b border-gray-100 bg-gray-50/60 px-2 pb-1.5">
    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-1 pb-1 flex items-center gap-1">
      <Pin :size="9" />已固定 ({{ items.length }})
    </p>
    <div class="flex flex-wrap gap-1">
      <div v-for="item in items" :key="item.id"
        :class="['flex items-center gap-1 px-1.5 py-1 rounded-lg border cursor-pointer transition-colors flex-1 min-w-[120px] max-w-[220px] select-none',
          item.active ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/60']"
        @click="emit('activate', item.id)"
        @contextmenu.prevent="emit('ctx', $event, item)"
        @mouseenter="onEnter($event, item)"
        @mouseleave="onLeave">
        <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
        <span :class="['text-[11px] font-medium truncate flex-1 min-w-0', item.active ? 'text-blue-900' : 'text-gray-800']">{{ item.title }}</span>
        <button class="shrink-0 p-0.5 text-gray-300 hover:text-red-500 rounded" @click.stop="emit('close', item.id)">
          <X :size="10" />
        </button>
      </div>
    </div>
  </div>

  <!-- Hover 详情弹窗 (Teleport 逃出 overflow-hidden) -->
  <Teleport to="body">
    <div v-if="hovered" class="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl p-2.5 w-56 text-xs"
      :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
      @mouseenter="clearLeave"
      @mouseleave="hovered = null">
      <p class="font-medium text-gray-800 mb-1.5 leading-snug line-clamp-2">{{ hovered.title }}</p>
      <div class="flex items-center gap-1 flex-wrap mb-2">
        <StatusBadge :item="hovered" />
        <span class="text-[10px] text-gray-400">{{ hovered.openedAt }}</span>
        <template v-if="hovered.tags.length">
          <span class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 truncate max-w-[80px]">{{ hovered.tags[0] }}</span>
          <span v-if="hovered.tags.length > 1" class="text-[10px] text-gray-400">+{{ hovered.tags.length - 1 }}</span>
        </template>
      </div>
      <div class="flex gap-1">
        <button class="flex-1 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px]" @click="emit('later', hovered.id); hovered = null">稍后处理</button>
        <button class="flex-1 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 text-[10px]" @click="emit('copy', hovered.url); hovered = null">复制URL</button>
        <button class="py-0.5 px-1.5 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-[10px]" @click="emit('close', hovered.id); hovered = null">关闭</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Pin, X } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"

defineProps<{ items: TabItem[] }>()
const emit = defineEmits<{
  activate: [id: number]; close: [id: number]
  later: [id: number]; copy: [url: string]
  ctx: [e: MouseEvent, item: TabItem]
}>()

const hovered = ref<TabItem | null>(null)
const pos = ref({ x: 0, y: 0 })
let leaveTimer: ReturnType<typeof setTimeout> | null = null

const clearLeave = () => { if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null } }

const onEnter = (e: MouseEvent, item: TabItem) => {
  clearLeave()
  hovered.value = item
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  // 防止弹窗超出右边界
  pos.value = { x: Math.min(r.left, window.innerWidth - 228), y: r.bottom + 4 }
}
const onLeave = () => {
  leaveTimer = setTimeout(() => { hovered.value = null }, 120)
}
</script>
