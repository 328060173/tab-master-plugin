<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center"
      @click.self="emit('cancel')"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[360px] p-5"
        role="dialog"
        :aria-label="title"
      >
        <!-- 标题（danger 模式带警告 emoji） -->
        <h3 :class="['text-sm font-bold mb-3 text-gray-900 dark:text-gray-100', centerTitle && 'text-center']">
          <span v-if="danger">⚠️ </span>{{ title }}
        </h3>

        <!-- 正文（主体说明） -->
        <div
          v-if="message"
          class="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed mb-2 whitespace-pre-line"
        >{{ message }}</div>

        <!-- 重点提示（强调原因等关键信息，amber 警示框，比 hint 蓝框更醒目） -->
        <div
          v-if="highlight"
          class="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mt-2 mb-3"
        >
          <p class="text-[13px] text-amber-800 dark:text-amber-200 leading-relaxed">⚠️ {{ highlight }}</p>
        </div>

        <!-- 提示框（撤销路径等关键信息） -->
        <div
          v-if="hint"
          class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 mt-2 mb-3"
        >
          <p class="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">💡 {{ hint }}</p>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2 mt-4 justify-end">
          <button
            class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            @click="emit('cancel')"
          >{{ cancelText || '取消' }}</button>
          <button
            :class="[
              'px-4 py-1.5 text-sm rounded-lg text-white',
              danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            ]"
            @click="emit('confirm')"
          >{{ confirmText || '确认' }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 通用二次确认弹窗。
 *
 * 设计取舍：
 * - 视觉风格沿用 LaterDialog（圆角 xl + 遮罩 + Teleport）
 * - hint 用蓝色提示框（区分于 LaterDialog 的 amber 警示）—— 这里 hint 多用于撤销路径提示，是信息而非警告
 * - danger=true 时确认按钮变红，用于「关闭 N 个标签」这种破坏性操作
 * - 不支持自定义 slot，所有内容走 props —— 让调用方零样板代码
 *
 * 调用方：sidepanel.vue 的清理菜单（路径见 docs/prd/cleanup-toolbar.md §4.5）
 */

import { onMounted, onUnmounted, watch } from "vue"

const props = defineProps<{
  open: boolean
  title: string
  message?: string
  highlight?: string
  hint?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  centerTitle?: boolean
}>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()

// ESC 关闭：弹窗打开时挂全局监听，关闭时摘掉（避免影响其他组件）
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.open) emit("cancel")
}
watch(() => props.open, (v) => {
  if (v) document.addEventListener("keydown", onKey)
  else document.removeEventListener("keydown", onKey)
})
onUnmounted(() => document.removeEventListener("keydown", onKey))
</script>
