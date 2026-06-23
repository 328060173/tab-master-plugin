<template>
  <div class="flex items-center gap-1">
    <button class="p-1 rounded hover:bg-amber-50 hover:text-amber-600 text-gray-400 transition-colors" title="稍后处理" @click.stop="emit('later')">
      <Clock :size="13" />
    </button>
    <button class="p-1 rounded hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors" title="复制链接" @click.stop="emit('copy')">
      <Copy :size="13" />
    </button>
    <button class="p-1 rounded hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors" title="关闭" @click.stop="emit('close')">
      <X :size="13" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Clock, Copy, X } from "@lucide/vue"
const emit = defineEmits(["later", "close", "copy"])
</script>
