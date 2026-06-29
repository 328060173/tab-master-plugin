<template>
  <div class="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2">
    <div class="text-amber-600">
      <Zap :size="14" />
    </div>
    <p class="text-xs text-amber-800 font-medium">
      聚焦中 · {{ focusedCount }} 个标签 · 已折叠 {{ hiddenCount }} 个
    </p>
  </div>
</template>

<script setup lang="ts">
import { Zap } from "@lucide/vue"

defineProps<{
  focusedCount: number
  hiddenCount: number
}>()
</script>
