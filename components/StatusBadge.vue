<template>
  <span v-if="label" :class="['inline-flex items-center gap-0.5 px-1.5 py-0 h-5 rounded text-[10px] font-medium border shrink-0', colorClass]">
    <span>{{ icon }}</span>{{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { TabItem } from "~types/tab"

const props = defineProps<{ item: TabItem; mini?: boolean }>()

// 只展示5种用户明显感知到的状态
const label = computed(() => {
  if (props.item.audible && !props.item.muted) return "播放中"
  if (props.item.muted) return "已静音"
  if (props.item.recording) return "录制中"
  if (props.item.sharing) return "共享中"
  if (props.item.hasConnectedDevice) return "连接设备"
  return ""
})
const icon = computed(() => {
  if (props.item.audible && !props.item.muted) return "🔊"
  if (props.item.muted) return "🔕"
  if (props.item.recording) return "🔴"
  if (props.item.sharing) return "📡"
  if (props.item.hasConnectedDevice) return "🔌"
  return ""
})
const colorClass = computed(() => {
  if (props.item.audible && !props.item.muted) return "bg-blue-50 text-blue-700 border-blue-200"
  if (props.item.muted) return "bg-orange-50 text-orange-600 border-orange-200"
  if (props.item.recording) return "bg-red-50 text-red-600 border-red-200"
  if (props.item.sharing) return "bg-green-50 text-green-600 border-green-200"
  if (props.item.hasConnectedDevice) return "bg-purple-50 text-purple-600 border-purple-200"
  return ""
})
</script>
