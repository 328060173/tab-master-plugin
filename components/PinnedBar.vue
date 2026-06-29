<template>
  <div v-if="items.length" class="shrink-0 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60 px-2 pb-1.5">
    <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide pt-1 pb-1 flex items-center gap-1">
      <Pin :size="9" />已固定 ({{ items.length }})
    </p>
    <div class="flex flex-wrap gap-1">
      <div v-for="item in items" :key="item.id"
        :class="['flex items-center gap-1 px-1.5 py-1 rounded-lg border cursor-pointer transition-colors flex-1 min-w-[120px] max-w-[220px] select-none',
          item.active ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50/60 dark:hover:bg-blue-900/20']"
        @click="emit('activate', item.id)"
        @contextmenu.prevent="emit('ctx', $event, item)">
        <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="getHighestPriorityStatus(item)?.icon" />
        <span :class="['text-[11px] font-medium truncate flex-1 min-w-0', item.active ? 'text-blue-900 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200']">{{ item.title }}</span>
        <TagPicker :ref="el => registerTagPicker(item.id, el)"
          :tabId="item.id" :currentTags="item.tags" :allTags="customTags"
          button-class="p-0.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          :icon-size="12"
          @update="emit('update-tags', item.id, $event)"
          @add-tag="emit('add-tag', $event)"
        />
        <button class="shrink-0 p-0.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" @click.stop="onMenuClick($event, item)" title="更多操作"><Menu :size="12" :stroke-width="2.25" /></button>
        <button class="shrink-0 p-0.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" @click.stop="emit('close', item.id)" title="关闭"><X :size="12" :stroke-width="2.5" /></button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <TabHoverCard v-if="currentItem" :hoverCardId="hoverCardId" :item="currentItem"
      @refresh="onAction('refresh')"
      @copy="onAction('copy')"
      @pin="onAction('pin')"
      @addTag="onAddTagFromCard"
      @later="onAction('later')"
      @updateNumber="onUpdateNumber($event)"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Pin, X, Menu } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import TabHoverCard from "./TabHoverCard.vue"
import TagPicker from "./TagPicker.vue"
import { getHighestPriorityStatus } from "~lib/statusPriority"
import { usePopoverManager } from "~composables/usePopoverManager"

defineProps<{ items: TabItem[]; customTags: string[] }>()
const emit = defineEmits<{
  activate: [id: number]; close: [id: number]; later: [id: number]
  copy: [url: string]; refresh: [id: number]; pin: [id: number]
  updateNumber: [id: number, n: number]; ctx: [e: MouseEvent, item: TabItem]
  "update-tags": [id: number, tags: string[]]; "add-tag": [tag: string]
}>()

const popover = usePopoverManager()
const currentItem = ref<TabItem | null>(null)
const hoverCardId = computed(() => currentItem.value ? `hover-card-${currentItem.value.id}` : "")

// v-for 里每个固定标签的 TagPicker 实例，用 function ref 存进 id→实例 的 Map
// （string ref 在 v-for 里会变成数组，没法按 tab 取，所以用 function ref）
type TagPickerExpose = { openFromAnchor: (el: HTMLElement) => void }
const tagPickerRefs = new Map<number, TagPickerExpose>()
const registerTagPicker = (id: number, el: unknown) => {
  if (el) tagPickerRefs.set(id, el as TagPickerExpose)
  else tagPickerRefs.delete(id)
}

const onMenuClick = (e: MouseEvent, item: TabItem) => {
  currentItem.value = item
  popover.toggle(`hover-card-${item.id}`, e.currentTarget as HTMLElement)
}

const onAction = (action: 'refresh' | 'copy' | 'pin' | 'later') => {
  if (!currentItem.value) return
  if (action === 'copy') emit('copy', currentItem.value.url)
  else emit(action, currentItem.value.id)
}
// 汉堡菜单「标记」：打开当前固定标签自己的内嵌 TagPicker（anchor = hover card 的标记按钮）
const onAddTagFromCard = (anchor: HTMLElement) => {
  if (!currentItem.value) return
  tagPickerRefs.get(currentItem.value.id)?.openFromAnchor(anchor)
}
const onUpdateNumber = (n: number) => { if (currentItem.value) emit('updateNumber', currentItem.value.id, n) }
</script>
