<template>
  <div
    :class="['relative flex flex-col items-center gap-1 px-2 pt-2 pb-1.5 rounded-lg border-2 bg-white cursor-pointer transition-colors group',
      isBatch && isChecked
        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30'
        : item.active ? 'border-blue-500 bg-blue-100' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50']"
    @click="onCardClick"
  >
  <TabHoverCard
    :hoverCardId="hoverCardId" :item="item"
    @refresh="emit('refresh')" @copy="emit('copy')"
    @pin="emit('pin')" @addTag="onHoverAddTag" @later="emit('later')" @close="emit('close')"
    @updateNumber="emit('updateNumber', $event)"
    @removeTag="emit('removeTag', $event)"
  />
    <input v-if="isBatch" type="checkbox" :checked="isChecked"
      class="absolute top-1 left-1 w-4 h-4 cursor-pointer z-10 accent-blue-600"
      @click.stop @change.stop="emit('toggle')" />
    <span v-if="isPrev" class="absolute top-0.5 left-0.5 text-[8px] font-semibold text-blue-600 bg-blue-100 border border-blue-200 px-1 py-px rounded leading-none z-10" title="上一个访问的标签">Prev</span>
    <div class="absolute top-0.5 right-0.5 flex items-center gap-0.5">
      <TagPicker ref="tagPickerRef"
        :tabId="item.id" :currentTags="item.tags" :allTags="customTags"
        button-class="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        :icon-size="13"
        @update="emit('updateTags', $event)" @addTag="emit('addTag', $event)" />
      <button :class="['p-1 rounded', popover.isOpen(hoverCardId) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700']" @click.stop="onMenuClick" title="更多操作"><Menu :size="14" :stroke-width="2.25" /></button>
      <button class="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" @click.stop="emit('close')" title="关闭"><X :size="14" :stroke-width="2.5" /></button>
    </div>
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="lg" :badge="statusBadge" />
    <p :class="['text-[11px] text-center leading-tight w-full truncate px-0.5', item.active ? 'text-blue-700 font-semibold' : 'text-gray-800 dark:text-gray-100']" :title="item.title">{{ item.title || item.domain }}</p>
    <p :class="['text-[10px] text-center leading-tight w-full truncate px-0.5', item.active ? 'text-blue-600' : 'text-gray-500']" :title="item.domain">{{ item.domain.toLowerCase() }}</p>
    <StatusBadge :item="item" mini />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { Menu, X } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import TabHoverCard from "./TabHoverCard.vue"
import TagPicker from "./TagPicker.vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { getHighestPriorityStatus } from "~lib/statusPriority"

const props = defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[]; isPrev?: boolean }>()
const emit = defineEmits(["activate", "toggle", "refresh", "pin", "copy", "addTag", "later", "close", "updateNumber", "updateTags", "removeTag"])

const popover = usePopoverManager()
const hoverCardId = `hover-card-${props.item.id}`

const onMenuClick = (e: MouseEvent) => {
  popover.toggle(hoverCardId, e.currentTarget as HTMLElement)
}

const statusBadge = computed(() => getHighestPriorityStatus(props.item)?.icon)

const tagPickerRef = ref<{ openFromAnchor: (el: HTMLElement) => void } | null>()
const onHoverAddTag = (anchorEl: HTMLElement) => {
  tagPickerRef.value?.openFromAnchor(anchorEl)
}

const onCardClick = () => {
  if (props.isBatch) {
    emit('toggle')
  } else {
    emit('activate')
  }
}
</script>
