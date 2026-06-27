<template>
  <!-- 树形视图常驻小黄条：始终显示，提示用户树形操作不直观，点击查看完整说明 -->
  <button
    class="w-full flex items-center gap-2 px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs hover:bg-amber-100 transition-colors text-left"
    @click="emit('open')"
  >
    <Lightbulb :size="13" class="shrink-0 text-amber-500" :stroke-width="2.25" />
    <span class="flex-1">树形视图支持拖拽改变父子关系，操作不直观？</span>
    <span class="text-amber-700 font-medium hover:underline shrink-0">查看操作说明 →</span>
  </button>
</template>

<script setup lang="ts">
import { Lightbulb } from "@lucide/vue"

const emit = defineEmits<{ open: [] }>()
</script>
