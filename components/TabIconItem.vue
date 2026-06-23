<template>
  <div
    :class="['relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 bg-white hover:shadow-md transition-shadow cursor-pointer', item.active ? 'border-blue-400 bg-blue-50/40' : 'border-gray-200']"
    @click="emit('activate')"
  >
    <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="absolute top-1 left-1 cursor-pointer" />
    <span class="absolute top-1 right-1 text-[9px] text-gray-300 font-mono">{{ item.number }}</span>
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="lg" />
    <p :class="['text-[10px] text-center line-clamp-2 leading-tight w-full', item.active ? 'text-blue-700 font-medium' : 'text-gray-600']">{{ item.domain.toLowerCase() }}</p>
    <StatusBadge :item="item" mini />
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"

defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[] }>()
const emit = defineEmits(["activate", "toggle"])
</script>
