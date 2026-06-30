<template>
  <slot v-if="!errored" />
  <div v-else class="m-3 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-200">
    <p class="font-medium mb-1">⚠️ 此区域出错了</p>
    <p class="mb-2 text-amber-700 dark:text-amber-300 leading-relaxed">已记录到运行日志（设置 → 运行日志可查看）。其它功能不受影响，你可以重试或重新加载。</p>
    <button
      class="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px]"
      @click="reset"
    >
      重新加载此区域
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * 错误边界：捕获插槽内子树的渲染/生命周期错误，显示局部降级 UI + 记日志，
 * 而不是让错误向上冒泡炸掉整个面板（实现「一个功能出问题不影响其他功能」）。
 */
import { ref, onErrorCaptured } from "vue"
import { logError } from "~composables/useLogger"

const props = defineProps<{ scope?: string }>()
const errored = ref(false)

onErrorCaptured((err) => {
  errored.value = true
  logError(props.scope || "ui", err instanceof Error ? err.message : String(err), err)
  return false // 阻止继续向上传播，保护其余区域
})

const reset = () => { errored.value = false }
</script>
