<template>
  <div class="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer" @click="emit('activate')">
    <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="cursor-pointer" />
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
    </div>
    <span class="text-xs text-gray-400 w-20 text-right shrink-0">{{ item.openedAt }}</span>
    <span class="text-xs text-gray-400 w-28 truncate shrink-0">{{ item.domain }}</span>
    <StatusBadge :item="item" />
    <ActionButtons @later="emit('later')" @close="emit('close')" @copy="emit('copy')" />
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
