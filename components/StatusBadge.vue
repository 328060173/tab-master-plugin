<template>
  <span v-if="label" :class="['inline-flex items-center px-1.5 py-0 h-5 rounded text-[10px] font-medium border shrink-0', colorClass]">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { TabItem } from "~types/tab"

const props = defineProps<{ item: TabItem; mini?: boolean }>()

const label = computed(() => {
  if (props.item.active) return "激活"
  if (props.item.audible) return "播放"
  if (props.item.pinned) return "固定"
  if (props.item.discarded) return "舍弃"
  return ""
})

const colorClass = computed(() => {
  if (props.item.active) return "bg-green-50 text-green-700 border-green-200"
  if (props.item.audible) return "bg-blue-50 text-blue-700 border-blue-200"
  if (props.item.pinned) return "bg-purple-50 text-purple-700 border-purple-200"
  if (props.item.discarded) return "bg-gray-50 text-gray-500 border-gray-200"
  return ""
})
</script>
