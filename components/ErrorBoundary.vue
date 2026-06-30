<template>
  <slot v-if="!errored" />
  <div v-else class="m-3 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-200">
    <p class="font-medium mb-1">⚠️ 此区域出错了</p>
    <p class="mb-2 text-amber-700 dark:text-amber-300 leading-relaxed">其它功能不受影响。可以重试，或在「设置」里点「重新打开」尝试恢复。</p>
    <div class="flex gap-2">
      <button class="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px]" @click="reset">重试此区域</button>
      <button class="px-2.5 py-1 rounded border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-200 text-[11px]" @click="handleReload">去设置重新打开</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 错误边界：捕获子树渲染/生命周期错误，显示局部降级 UI
 * - 每个页面独立一个，错误不会跨页面污染
 * - 只在控制台输出错误，不写入日志页
 */
import { ref, onErrorCaptured } from "vue"

const props = defineProps<{ scope?: string }>()
const emit = defineEmits<{ reload: [] }>()
const errored = ref(false)

onErrorCaptured((err) => {
  errored.value = true
  console.error(`[ErrorBoundary:${props.scope || "ui"}]`, err)
  return false
})

const reset = () => { errored.value = false }
const handleReload = () => { emit("reload") }
</script>
