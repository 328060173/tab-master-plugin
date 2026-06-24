<template>
  <div
    :class="['flex flex-col gap-1 p-2 rounded-lg border cursor-pointer transition-colors',
      item.active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50']"
    @click="emit('activate')"
  >
    <!-- 行1：编号 + 图标 + 标题 -->
    <div class="flex items-center gap-1.5 min-w-0">
      <span class="text-[10px] text-gray-400 shrink-0 w-4 text-right leading-none">{{ item.number || '' }}</span>
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
      <p :class="['flex-1 text-xs font-medium truncate leading-tight', item.active ? 'text-blue-900' : 'text-gray-800']">{{ item.title }}</p>
      <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="shrink-0 cursor-pointer" />
    </div>
    <!-- 行2：状态 + 时间 + 标记 + 操作 -->
    <div class="flex items-center gap-1 min-w-0">
      <StatusBadge :item="item" />
      <span class="text-[10px] text-gray-400 shrink-0">{{ item.openedAt }}</span>
      <span v-if="item.tags.length" class="text-[10px] bg-blue-50 text-blue-600 px-1 py-0.5 rounded border border-blue-100 truncate max-w-[40px] shrink-0">{{ item.tags[0] }}</span>
      <span v-if="item.tags.length > 1" class="text-[10px] text-gray-400 shrink-0">···</span>
      <div class="ml-auto flex items-center gap-0.5 shrink-0">
        <button class="p-0.5 text-gray-400 hover:text-amber-500 rounded" @click.stop="emit('later')" title="稍后处理"><Clock :size="11" /></button>
        <button class="p-0.5 text-gray-400 hover:text-blue-500 rounded" @click.stop="emit('copy')" title="复制URL"><Link :size="11" /></button>
        <button class="p-0.5 text-gray-400 hover:text-red-500 rounded" @click.stop="emit('close')" title="关闭"><X :size="11" /></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Link, X } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"

defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[] }>()
const emit = defineEmits(["activate", "toggle", "later", "close", "copy", "updateTags", "addTag", "updateNumber"])
</script>
