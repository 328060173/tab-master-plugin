<template>
  <div
    :class="['group flex items-center gap-2 px-3 py-2 rounded-lg border-l-2 border transition-colors cursor-pointer relative',
      item.active
        ? 'border-l-blue-800 border-y-blue-400 border-r-blue-400 bg-blue-300 hover:bg-blue-300'
        : 'border-l-transparent border-gray-200 bg-white hover:bg-blue-50 hover:border-l-blue-200']"
    @click="emit('activate')"
  >
  <TabHoverCard
    :show="hovered" :item="item" :x="cardPos.x" :y="cardPos.y"
    @stay="clearLeave" @leave="startLeave"
    @refresh="emit('refresh')" @copy="emit('copy')"
    @pin="emit('pin')" @addTag="emit('addTag')" @later="emit('later')" @close="emit('close')"
    @updateNumber="emit('updateNumber', $event)"
  />
    <!-- 上一个访问标记 -->
    <span v-if="isPrev" class="absolute -top-1 -left-1 text-[8px] font-semibold text-blue-600 bg-blue-100 border border-blue-200 px-1 py-px rounded leading-none z-10" title="上一个访问的标签">Prev</span>
    <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="cursor-pointer shrink-0" />
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="statusBadge" />
    <div class="flex-1 min-w-0 flex items-center gap-1.5">
      <p :class="['text-sm font-medium truncate', item.active ? 'text-blue-900 font-semibold' : 'text-gray-900']">{{ item.title }}</p>
      <template v-if="item.tags.length">
        <span class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-200 shrink-0">{{ item.tags[0] }}</span>
        <span v-if="item.tags.length > 1" class="text-[10px] text-gray-400 shrink-0">+{{ item.tags.length - 1 }}</span>
      </template>
    </div>
    <span class="text-xs text-gray-400 w-24 truncate shrink-0 hidden sm:block">{{ item.domain.toLowerCase() }}</span>
    <StatusBadge :item="item" />
    <div class="flex items-center gap-0.5 shrink-0">
      <button class="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded" title="刷新" @click.stop="emit('refresh')"><RefreshCw :size="13" /></button>
      <button class="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded" title="复制链接" @click.stop="emit('copy')"><Link :size="13" /></button>
      <button class="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded" title="标记" @click.stop="emit('addTag')"><Tag :size="13" /></button>
      <button class="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded" title="稍后处理" @click.stop="emit('later')"><Clock :size="13" /></button>
      <button :class="['p-1 rounded', hovered ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100']" title="更多操作" @click.stop="toggle"><Menu :size="14" :stroke-width="2.25" /></button>
      <button class="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded" @click.stop="emit('close')" title="关闭"><X :size="13" :stroke-width="2.5" /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { Menu, X, RefreshCw, Link, Tag, Clock } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import TabHoverCard from "./TabHoverCard.vue"
import { useHoverCard } from "~composables/useHoverCard"
import { getHighestPriorityStatus } from "~lib/statusPriority"

const props = defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[]; isPrev?: boolean }>()
const emit = defineEmits(["activate", "toggle", "later", "close", "copy", "updateTags", "addTag", "updateNumber", "refresh", "pin"])
const { hovered, cardPos, toggle, clearLeave, startLeave } = useHoverCard()
const statusBadge = computed(() => getHighestPriorityStatus(props.item)?.icon)
</script>
