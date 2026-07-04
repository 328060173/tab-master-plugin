<template>
  <div v-if="items.length" class="shrink-0 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60 px-2 pb-1.5">
    <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide pt-1 pb-1 flex items-center gap-1">
      <Pin :size="9" />已固定 ({{ items.length }})
    </p>
    <div class="flex flex-wrap gap-1">
      <div v-for="item in items" :key="item.id"
        :class="['flex items-center gap-1 px-1.5 py-1 rounded-lg border cursor-pointer transition-colors flex-1 min-w-[120px] max-w-[220px] select-none',
          item.active ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/60 dark:hover:bg-blue-900/20',
          dragState.sourceId === item.id ? 'opacity-50' : '',
          dragState.overId === item.id ? 'ring-2 ring-blue-400' : '']"
        draggable="true"
        @click="emit('activate', item.id)"
        @contextmenu.prevent="emit('ctx', $event, item)"
        @dragstart="onDragStart($event, item)"
        @dragover.prevent="onDragOver($event, item)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, item)"
        @dragend="onDragEnd">
        <GripVertical :size="14" class="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing shrink-0" />
        <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="getHighestPriorityStatus(item)?.icon" />
        <span :class="['text-[11px] font-medium truncate flex-1 min-w-0', item.active ? 'text-blue-900 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200']">{{ item.title }}</span>
        <button class="shrink-0 p-0.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" @click.stop="onMenuClick($event, item)" title="更多操作"><Menu :size="12" :stroke-width="2.25" /></button>
        <button class="shrink-0 p-0.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" @click.stop="emit('close', item.id)" title="关闭"><X :size="12" :stroke-width="2.5" /></button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <!-- 固定标签不支持标记，hover 卡隐藏「标记」按钮（节省空间，固定标签场景下标记意义不大）-->
    <TabHoverCard v-if="currentItem" :hoverCardId="hoverCardId" :item="currentItem" :hide-add-tag="true"
      @refresh="onAction('refresh')"
      @copy="onAction('copy')"
      @pin="onAction('pin')"
      @later="onAction('later')"
      @updateNumber="onUpdateNumber($event)"
      @updateTags="onUpdateTags"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Pin, X, Menu, GripVertical } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import TabHoverCard from "./TabHoverCard.vue"
import { getHighestPriorityStatus } from "~lib/statusPriority"
import { usePopoverManager } from "~composables/usePopoverManager"

defineProps<{ items: TabItem[] }>()
const emit = defineEmits<{
  activate: [id: number]; close: [id: number]; later: [id: number]
  copy: [url: string]; refresh: [id: number]; pin: [id: number]
  updateNumber: [id: number, n: number]; ctx: [e: MouseEvent, item: TabItem]
  move: [sourceId: number, targetId: number]; updateTags: [id: number, tags: string[]]
}>()

const popover = usePopoverManager()
const currentItem = ref<TabItem | null>(null)
const hoverCardId = computed(() => currentItem.value ? `hover-card-${currentItem.value.id}` : "")

const dragState = ref<{ sourceId: number | null; overId: number | null }>({
  sourceId: null,
  overId: null
})

const onMenuClick = (e: MouseEvent, item: TabItem) => {
  currentItem.value = item
  popover.toggle(`hover-card-${item.id}`, e.currentTarget as HTMLElement)
}

const onAction = (action: 'refresh' | 'copy' | 'pin' | 'later') => {
  if (!currentItem.value) return
  if (action === 'copy') emit('copy', currentItem.value.url)
  else emit(action, currentItem.value.id)
}
const onUpdateNumber = (n: number) => { if (currentItem.value) emit('updateNumber', currentItem.value.id, n) }
const onUpdateTags = (tags: string[]) => { if (currentItem.value) emit('updateTags', currentItem.value.id, tags) }

const onDragStart = (e: DragEvent, item: TabItem) => {
  dragState.value.sourceId = item.id
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(item.id))
  }
}

const onDragOver = (e: DragEvent, item: TabItem) => {
  if (dragState.value.sourceId === item.id) return
  dragState.value.overId = item.id
}

const onDragLeave = () => {
  dragState.value.overId = null
}

const onDrop = (e: DragEvent, item: TabItem) => {
  const sourceId = dragState.value.sourceId
  if (sourceId && sourceId !== item.id) {
    emit('move', sourceId, item.id)
  }
  onDragEnd()
}

const onDragEnd = () => {
  dragState.value.sourceId = null
  dragState.value.overId = null
}
</script>
