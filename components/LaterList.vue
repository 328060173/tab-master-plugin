<template>
  <div class="flex flex-col gap-2 px-4 py-2">
    <div v-if="!items.length" class="text-center text-gray-400 text-sm py-12">暂无稍后处理的标签</div>
    <div
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white"
    >
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
        <p v-if="item.laterNote" class="text-xs text-amber-600 truncate mt-0.5">备注：{{ item.laterNote }}</p>
      </div>
      <span class="text-xs text-gray-400 shrink-0">{{ item.laterAddedAt }}</span>
      <button class="p-1 rounded hover:bg-red-50 hover:text-red-600 text-gray-400" @click="emit('remove', item.id)">
        <X :size="13" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from "@lucide/vue"
import type { LaterItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"

defineProps<{ items: LaterItem[] }>()
const emit = defineEmits(["remove"])
</script>
