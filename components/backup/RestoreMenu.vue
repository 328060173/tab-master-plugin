<template>
  <!--
    还原下拉菜单（设计稿 §3.2 / §8.6 OneTab 风格三档）。
    单根（外层 div），所有事件声明在 emits，无 fallthrough。
    三档：本窗口打开（全部） / 新窗口打开（全部） / 勾选打开…
    点击外部自动关闭（window mousedown 监听）。
  -->
  <div ref="rootRef" class="relative inline-block">
    <button
      type="button"
      :disabled="disabled"
      class="inline-flex items-center gap-0.5 min-h-[32px] px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click.stop="toggle"
    >
      <RotateCcw :size="12" />
      <span>还原</span>
      <ChevronDown :size="10" />
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1"
      role="menu"
    >
      <button
        type="button"
        class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        role="menuitem"
        @click="onSelect('current')"
      >本窗口打开（全部）</button>
      <button
        type="button"
        class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        role="menuitem"
        @click="onSelect('newWindow')"
      >新窗口打开（全部）</button>
      <button
        type="button"
        class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        role="menuitem"
        @click="onSelect('selected')"
      >勾选打开…</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 还原下拉菜单（设计稿 §3.2）。
 * 触发按钮点击切换；点击外部关闭（window mousedown 捕获阶段）。
 * 选中项 emit('select', target)，由父组件调 useBackupRestore.openSnapshot。
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { RotateCcw, ChevronDown } from '@lucide/vue'
import type { OpenTarget } from '~composables/useBackupRestore'

defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ (e: 'select', target: OpenTarget): void }>()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onSelect(target: OpenTarget) {
  open.value = false
  emit('select', target)
}

// 点击外部关闭（捕获阶段，确保点内部按钮前能正确判断）
function onWindowMouseDown(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as Node | null
  if (rootRef.value && target && !rootRef.value.contains(target)) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('mousedown', onWindowMouseDown, true)
})
onUnmounted(() => {
  window.removeEventListener('mousedown', onWindowMouseDown, true)
})
</script>
