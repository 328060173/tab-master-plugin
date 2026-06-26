<template>
  <div
    :class="['relative flex flex-col p-2 rounded-lg border cursor-pointer transition-colors h-[90px] group',
      item.active ? 'border-blue-500 bg-blue-100' : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50']"
    @click="emit('activate')"
  >
    <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="absolute top-1.5 left-1.5 cursor-pointer z-10" />
    <!-- 上一个访问标记 -->
    <span v-if="isPrev" class="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-blue-500 z-10" title="上一个访问的标签"></span>
    <!-- 顶部：图标（含状态角标）+ 标记 -->
    <div class="flex items-start justify-between gap-1 mb-1">
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="md" :badge="statusBadge" class="shrink-0" />
      <div class="flex flex-wrap gap-0.5 justify-end min-w-0 flex-1 pt-0.5">
        <span v-if="item.tags[0]" class="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded border border-blue-100 truncate max-w-[60px] leading-none">{{ item.tags[0] }}</span>
        <span v-if="item.tags.length > 1" class="text-[9px] text-gray-400 leading-none">···</span>
      </div>
    </div>
    <!-- 中部：标题 2行截断 -->
    <p :class="['flex-1 text-[11px] leading-tight line-clamp-2 overflow-hidden',
      item.active ? 'text-blue-900 font-semibold' : 'text-gray-800']">{{ item.title }}</p>
    <!-- 底部：打开时间 + 三点菜单 + 关闭 -->
    <div class="flex items-center justify-between mt-1">
      <span class="text-[9px] text-gray-400">{{ formatOpenedAt(item.openedAt) }}</span>
      <div class="flex items-center gap-0.5">
        <button :class="['p-0.5 rounded', hovered ? 'bg-blue-100 text-blue-500' : 'text-gray-400 hover:text-blue-500']" @click.stop="toggle" title="更多操作"><MoreHorizontal :size="12" /></button>
        <button class="p-0.5 text-gray-300 hover:text-red-500 rounded" @click.stop="emit('close')"><X :size="10" /></button>
      </div>
    </div>
  </div>

  <TabHoverCard
    :show="hovered" :item="item" :x="cardPos.x" :y="cardPos.y"
    @stay="clearLeave" @leave="startLeave"
    @refresh="emit('refresh')" @copy="emit('copy')"
    @pin="emit('pin')" @addTag="emit('addTag')" @later="emit('later')" @close="emit('close')"
    @updateNumber="emit('updateNumber', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"
import { X, MoreHorizontal } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import TabHoverCard from "./TabHoverCard.vue"
import { getHighestPriorityStatus } from "~lib/statusPriority"
import { formatOpenedAt } from "~lib/timeFormat"
import { useHoverCard } from "~composables/useHoverCard"

const props = defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[]; isPrev?: boolean }>()
const emit = defineEmits(["activate", "toggle", "later", "close", "copy", "refresh", "pin", "addTag", "updateTags", "updateNumber"])

const { hovered, cardPos, toggle, clearLeave, startLeave } = useHoverCard()
const statusBadge = computed(() => getHighestPriorityStatus(props.item)?.icon)
</script>
