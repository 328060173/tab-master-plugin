<template>
  <span v-if="group" class="flex items-center gap-1 text-[10px]">
    <span :class="[colorClass, 'w-2 h-2 rounded-full']"></span>
    <span class="text-gray-500 truncate max-w-[60px]">{{ group.title }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { GROUP_COLOR_CLASSES } from "~composables/useTabGroups"

const props = defineProps<{ group: chrome.tabGroups.TabGroup | null | undefined }>()

const colorClass = computed(() => {
  if (!props.group) return ""
  return GROUP_COLOR_CLASSES[props.group.color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
})
</script>
