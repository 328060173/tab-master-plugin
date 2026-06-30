<template>
  <slot v-if="!errored" />
  <div v-else class="m-3 p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-xs text-amber-800 dark:text-amber-200">
    <p class="font-medium mb-1">⚠️ 此区域出错了</p>
    <p class="mb-1 text-amber-700 dark:text-amber-300 leading-relaxed">其它功能不受影响。把下面这条错误发给开发者能帮上大忙 👇</p>
    <p class="mb-2 px-2 py-1.5 rounded bg-amber-100 dark:bg-amber-900/40 text-[11px] text-amber-900 dark:text-amber-100 break-all font-mono">
      {{ errMsg }}
    </p>
    <div class="flex gap-2">
      <button class="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px]" @click="reset">重试此区域</button>
      <button class="px-2.5 py-1 rounded border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-200 text-[11px]" @click="copyErr">{{ copied ? '已复制 ✓' : '复制错误' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 错误边界：捕获子树渲染/生命周期错误，显示局部降级 UI + 把错误明文展示出来。
 * - 插槽内容变化（如 activeNav 切换）时自动重置，避免"一个页面出错后切到别的页面还是错误态"
 * - 记录交给全局切面（console.error 拦截），这里只管展示
 */
import { ref, onErrorCaptured, useSlots, watch } from "vue"

const props = defineProps<{ scope?: string }>()
const slots = useSlots()
const errored = ref(false)
const errMsg = ref("")
const copied = ref(false)

onErrorCaptured((err) => {
  errored.value = true
  const msg = err instanceof Error ? `${err.message}\n${err.stack || ""}` : String(err)
  errMsg.value = `[${props.scope || "ui"}] ${msg}`.slice(0, 600)
  console.error(`[ErrorBoundary:${props.scope || "ui"}]`, err)
  return false
})

// 插槽默认内容变化（v-if 切换导致子组件换人）时自动重置，让别的页面能正常显示
watch(() => slots.default?.(), () => {
  if (errored.value) { errored.value = false; errMsg.value = "" }
})

const reset = () => { errored.value = false; errMsg.value = "" }
const copyErr = async () => {
  try { await navigator.clipboard.writeText(errMsg.value); copied.value = true; setTimeout(() => (copied.value = false), 1500) } catch {}
}
</script>
