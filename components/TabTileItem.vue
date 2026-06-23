<template>
  <div class="flex flex-col gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer" @click="emit('activate')">
    <div class="flex items-start gap-2">
      <FavIcon :src="item.favIconUrl" :domain="item.domain" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{{ item.title }}</p>
        <p class="text-xs text-gray-400 mt-0.5 truncate">{{ item.domain }}</p>
      </div>
      <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="mt-1 cursor-pointer" />
    </div>
    <div class="flex items-center gap-1.5 flex-wrap">
      <StatusBadge :item="item" />
      <span class="ml-auto text-[10px] text-gray-400">{{ item.openedAt }}</span>
    </div>
    <div class="flex justify-end gap-1">
      <ActionButtons @later="emit('later')" @close="emit('close')" @copy="emit('copy')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import ActionButtons from "./ActionButtons.vue"

defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean }>()
const emit = defineEmits(["activate", "toggle", "later", "close", "copy"])
</script>
