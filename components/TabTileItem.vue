<template>
  <div
    :class="['relative flex flex-col p-2 rounded-lg border cursor-pointer transition-colors h-[90px] group',
      isBatch && isChecked
        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/30'
        : item.active ? 'border-blue-500 bg-blue-100' : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50']"
    @click="onCardClick"
  >
    <div v-if="item.groupId !== TAB_GROUP_ID_NONE && group"
         :class="[colorClass, 'absolute left-0 right-0 top-0 h-1 rounded-t-lg']"
    ></div>
    <input v-if="isBatch" type="checkbox" :checked="isChecked"
      class="absolute top-1.5 left-1.5 w-4 h-4 cursor-pointer z-10 accent-blue-600"
      @click.stop @change.stop="emit('toggle')" />
    <span v-if="isPrev" class="absolute top-0.5 left-0.5 text-[8px] font-semibold text-blue-600 bg-blue-100 border border-blue-200 px-1 py-px rounded leading-none z-10" title="上一个访问的标签">Prev</span>
    <div class="flex items-start justify-between gap-1 mb-1">
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="md" :badge="statusBadge" class="shrink-0" />
      <div class="flex flex-wrap gap-0.5 justify-end min-w-0 flex-1 pt-0.5">
        <span v-if="item.tags[0]" class="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded border border-blue-100 truncate max-w-[60px] leading-none">{{ item.tags[0] }}</span>
        <span v-if="item.tags.length > 1" class="text-[9px] text-gray-400 leading-none">···</span>
      </div>
    </div>
    <p :class="['flex-1 text-[11px] leading-tight line-clamp-2 overflow-hidden',
      item.active ? 'text-blue-900 font-semibold' : 'text-gray-800']">{{ item.title }}</p>
    <div class="flex items-center justify-between mt-1">
      <div class="flex items-center gap-1 flex-1 min-w-0">
        <GroupBadge :group="group" />
        <span v-if="!group" class="text-[9px] text-gray-400 truncate">{{ item.domain.toLowerCase() }}</span>
      </div>
      <!-- 批量态保留右侧按钮 -->
      <div class="flex items-center gap-0.5 shrink-0">
        <TagPicker ref="tagPickerRef"
          :tabId="item.id" :currentTags="item.tags" :allTags="customTags"
          button-class="p-0.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          :icon-size="13"
          @update="emit('updateTags', $event)" @addTag="emit('addTag', $event)" />
        <button :class="['p-0.5 rounded', hovered ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100']" @click.stop="toggle" title="更多操作"><Menu :size="13" :stroke-width="2.25" /></button>
        <button class="p-0.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded" @click.stop="emit('close')" title="关闭"><X :size="13" :stroke-width="2.5" /></button>
      </div>
    </div>
  </div>

  <TabHoverCard
    :show="hovered" :item="item" :x="cardPos.x" :y="cardPos.y"
    @stay="clearLeave" @leave="startLeave"
    @refresh="emit('refresh')" @copy="emit('copy')"
    @pin="emit('pin')" @addTag="onHoverAddTag" @later="emit('later')" @close="emit('close')"
    @updateNumber="emit('updateNumber', $event)"
  />
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue"
import { X, Menu } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import TabHoverCard from "./TabHoverCard.vue"
import GroupBadge from "./GroupBadge.vue"
import TagPicker from "./TagPicker.vue"
import { getHighestPriorityStatus } from "~lib/statusPriority"
import { useHoverCard } from "~composables/useHoverCard"
import { GROUP_COLOR_CLASSES, TAB_GROUP_ID_NONE } from "~composables/useTabGroups"

const props = defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[]; isPrev?: boolean }>()
const emit = defineEmits(["activate", "toggle", "later", "close", "copy", "refresh", "pin", "addTag", "updateTags", "updateNumber"])

const { hovered, cardPos, toggle, clearLeave, startLeave } = useHoverCard()
const statusBadge = computed(() => getHighestPriorityStatus(props.item)?.icon)

const getGroupById = inject<(groupId: number) => chrome.tabGroups.TabGroup | undefined>("getGroupById")
const group = computed(() => {
  if (props.item.groupId === TAB_GROUP_ID_NONE) return undefined
  return getGroupById?.(props.item.groupId)
})

const colorClass = computed(() => {
  if (!group.value) return ""
  return GROUP_COLOR_CLASSES[group.value.color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
})

const tagPickerRef = ref<{ openFromAnchor: (el: HTMLElement) => void } | null>(null)
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
