<template>
  <slot v-if="!errored" />
  <div v-else class="m-3 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-200">
    <p class="font-medium mb-1">⚠️ 此区域出错了</p>
    <p class="mb-2 text-amber-700 dark:text-amber-300 leading-relaxed">已记录到运行日志（点顶部 ⚙ 设置菜单 →「运行日志」查看）。其它功能不受影响，你可以重试或重新加载。</p>
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
 * 错误边界：捕获插槽内子树的渲染/生命周期错误，显示局部降级 UI，
 * 而不是让错误炸掉整个面板（「一个功能出问题不影响其他功能」）。
 * 记录交给全局切面——这里直接 console.error 即可被 installGlobalCapture 自动收进运行日志，
 * 不在组件里硬编码依赖 logger（低耦合）。
 */
import { ref, onErrorCaptured } from "vue"

const props = defineProps<{ scope?: string }>()
const errored = ref(false)

onErrorCaptured((err) => {
  errored.value = true
  console.error(`[ErrorBoundary:${props.scope || "ui"}]`, err)
  return false // 阻止继续向上传播，保护其余区域
})

const reset = () => { errored.value = false }
</script>
