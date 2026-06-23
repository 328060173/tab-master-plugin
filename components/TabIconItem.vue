<template>
  <div class="relative flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow cursor-pointer" @click="emit('activate')">
    <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="absolute top-1 left-1 cursor-pointer" />
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="lg" />
    <p class="text-[10px] text-gray-600 text-center line-clamp-2 leading-tight w-full">{{ item.domain }}</p>
    <StatusBadge :item="item" mini />
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"

defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean }>()
const emit = defineEmits(["activate", "toggle"])
</script>
