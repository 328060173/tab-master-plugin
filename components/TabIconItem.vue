<template>
  <div
    :class="['relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 bg-white cursor-pointer transition-colors', item.active ? 'border-blue-500 bg-blue-100' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50']"
    @click="emit('activate')"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
  <TabHoverCard
    :show="hovered" :item="item" :x="cardPos.x" :y="cardPos.y"
    @stay="clearLeave" @leave="startLeave"
    @refresh="emit('refresh')" @copy="emit('copy')"
    @pin="emit('pin')" @addTag="emit('addTag')" @later="emit('later')" @close="emit('close')"
  />
    <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="absolute top-1 left-1 cursor-pointer" />
    <span v-if="isPrev" class="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gray-400 opacity-60" title="上一个访问的标签"></span>
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="lg" :badge="statusBadge" />
    <p :class="['text-[10px] text-center line-clamp-2 leading-tight w-full', item.active ? 'text-blue-700 font-medium' : 'text-gray-600']">{{ item.domain.toLowerCase() }}</p>
    <StatusBadge :item="item" mini />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import TabHoverCard from "./TabHoverCard.vue"
import { useHoverCard } from "~composables/useHoverCard"
import { getHighestPriorityStatus } from "~lib/statusPriority"

const props = defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[]; isPrev?: boolean }>()
const emit = defineEmits(["activate", "toggle", "refresh", "pin", "copy", "addTag", "later", "close"])
const { hovered, cardPos, onEnter, onLeave, clearLeave, startLeave } = useHoverCard()
const statusBadge = computed(() => getHighestPriorityStatus(props.item)?.icon)
</script>
