<template>
  <div
    :class="['flex items-center gap-2 px-3 py-2 rounded-lg border-l-2 border transition-colors cursor-pointer relative',
      item.active
        ? 'border-l-blue-800 border-y-blue-400 border-r-blue-400 bg-blue-300 hover:bg-blue-300'
        : 'border-l-transparent border-gray-200 bg-white hover:bg-blue-50 hover:border-l-blue-200']"
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
    <!-- 上一个访问标记 -->
    <span v-if="isPrev" class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-gray-400 opacity-60" title="上一个访问的标签"></span>
    <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="cursor-pointer shrink-0" />
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="statusBadge" />
    <div class="flex-1 min-w-0 flex items-center gap-1.5">
      <p :class="['text-sm font-medium truncate', item.active ? 'text-blue-900 font-semibold' : 'text-gray-900']">{{ item.title }}</p>
      <template v-if="item.tags.length">
        <span class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-200 shrink-0">{{ item.tags[0] }}</span>
        <span v-if="item.tags.length > 1" class="text-[10px] text-gray-400 shrink-0">+{{ item.tags.length - 1 }}</span>
      </template>
    </div>
    <span class="text-xs text-gray-400 w-10 text-right shrink-0">{{ formatOpenedAt(item.openedAt) }}</span>
    <span class="text-xs text-gray-400 w-24 truncate shrink-0 hidden sm:block">{{ item.domain.toLowerCase() }}</span>
    <StatusBadge :item="item" />
    <TagPicker :currentTags="item.tags" :allTags="customTags" @update="emit('updateTags', $event)" @addTag="emit('addTag', $event)" />
    <!-- 按钮顺序：稍后 | 复制 | 刷新 | 关闭 -->
    <div class="flex items-center gap-0.5 shrink-0">
      <button class="p-1 text-gray-400 hover:text-amber-500 rounded" title="稍后处理" @click.stop="emit('later')"><Clock :size="12" /></button>
      <button class="p-1 text-gray-400 hover:text-blue-500 rounded" title="复制URL" @click.stop="emit('copy')"><Copy :size="12" /></button>
      <button class="p-1 text-gray-400 hover:text-blue-500 rounded" title="刷新" @click.stop="emit('refresh')"><RefreshCw :size="12" /></button>
      <button class="p-1 text-gray-400 hover:text-red-500 rounded" title="关闭" @click.stop="emit('close')"><X :size="12" /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { RefreshCw, Clock, Copy, X } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import TagPicker from "./TagPicker.vue"
import TabHoverCard from "./TabHoverCard.vue"
import { useHoverCard } from "~composables/useHoverCard"
import { formatOpenedAt } from "~lib/timeFormat"
import { getHighestPriorityStatus } from "~lib/statusPriority"

const props = defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[]; isPrev?: boolean }>()
const emit = defineEmits(["activate", "toggle", "later", "close", "copy", "updateTags", "addTag", "updateNumber", "refresh", "pin"])
const { hovered, cardPos, onEnter, onLeave, clearLeave, startLeave } = useHoverCard()
const statusBadge = computed(() => getHighestPriorityStatus(props.item)?.icon)
</script>
