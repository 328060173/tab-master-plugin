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
        @contextmenu.prevent="emit('ctx', $event, item)">
        <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="getHighestPriorityStatus(item)?.icon" />
        <span :class="['text-[11px] font-medium truncate flex-1 min-w-0', item.active ? 'text-blue-900' : 'text-gray-800']">{{ item.title }}</span>
        <button class="shrink-0 p-0.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded" @click.stop="toggleMenu($event, item)" title="更多操作"><Menu :size="12" :stroke-width="2.25" /></button>
        <button class="shrink-0 p-0.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded" @click.stop="emit('close', item.id)" title="关闭"><X :size="12" :stroke-width="2.5" /></button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <TabHoverCard v-if="menuItem" :show="true" :item="menuItem" :x="pos.x" :y="pos.y"
      @stay="clearLeave" @leave="startLeave"
      @refresh="onAction('refresh')"
      @copy="onAction('copy')"
      @pin="onAction('pin')"
      @addTag="onAddTag"
      @later="onAction('later')"
      @updateNumber="onUpdateNumber($event)"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Pin, X, Menu } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import TabHoverCard from "./TabHoverCard.vue"
import { getHighestPriorityStatus } from "~lib/statusPriority"

defineProps<{ items: TabItem[] }>()
const emit = defineEmits<{
  activate: [id: number]; close: [id: number]; later: [id: number]
  copy: [url: string]; refresh: [id: number]; pin: [id: number]
  updateNumber: [id: number, n: number]; ctx: [e: MouseEvent, item: TabItem]
}>()

const CARD_W = 256, CARD_H = 230, GAP = 6

const menuItem = ref<TabItem | null>(null)
const pos = ref({ x: 0, y: 0 })
let leaveTimer: ReturnType<typeof setTimeout> | null = null

const clearLeave = () => { if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null } }
const startLeave = () => { leaveTimer = setTimeout(() => { menuItem.value = null }, 200) }

const toggleMenu = (e: MouseEvent, item: TabItem) => {
  e.stopPropagation()
  if (menuItem.value?.id === item.id) { menuItem.value = null; return }
  clearLeave()
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const flipX = rect.right + CARD_W > window.innerWidth
  pos.value = { x: flipX ? rect.right - CARD_W : rect.left, y: Math.min(rect.bottom + GAP, window.innerHeight - CARD_H - 4) }
  menuItem.value = item
}

const onAction = (action: 'refresh' | 'copy' | 'pin' | 'later') => {
  if (!menuItem.value) return
  if (action === 'copy') emit('copy', menuItem.value.url)
  else emit(action, menuItem.value.id)
}
const onAddTag = () => { if (menuItem.value) emit('ctx', new MouseEvent('contextmenu'), menuItem.value) }
const onUpdateNumber = (n: number) => { if (menuItem.value) emit('updateNumber', menuItem.value.id, n) }
</script>
