<template>
  <!--
    还原下拉菜单（设计稿 §3.2 / §8.6 OneTab 风格三档）。
    单根（外层 div），所有事件声明在 emits，无 fallthrough。
    三档：本窗口打开（全部） / 新窗口打开（全部） / 勾选打开…
    下拉用 Teleport + fixed 定位（避免被表格 overflow-x-auto 裁剪）。
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
      <span>{{ t('backup.comp.restoreMenu.label') }}</span>
      <ChevronDown :size="10" />
    </button>

    <Teleport to="body">
      <div
        v-if="open"
        data-popover-content
        class="fixed z-[90] min-w-[160px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1"
        :style="menuPos"
        role="menu"
        @click.stop
      >
        <button
          type="button"
          class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          role="menuitem"
          @click="onSelect('current')"
        >{{ t('backup.comp.restoreMenu.current') }}</button>
        <button
          type="button"
          class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          role="menuitem"
          @click="onSelect('newWindow')"
        >{{ t('backup.comp.restoreMenu.newWindow') }}</button>
        <button
          type="button"
          class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          role="menuitem"
          @click="onSelect('selected')"
        >{{ t('backup.comp.restoreMenu.selected') }}</button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 还原下拉菜单（设计稿 §3.2）。
 * 触发按钮点击切换；下拉 Teleport 到 body + fixed 定位（防表格 overflow 裁剪）。
 * 选中项 emit('select', target)，由父组件调 useBackupRestore.openSnapshot。
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { RotateCcw, ChevronDown } from '@lucide/vue'
import type { OpenTarget } from '~composables/useBackupRestore'
import { t } from '~lib/i18n'

defineProps<{ disabled?: boolean }>()
const emit = defineEmits<{ (e: 'select', target: OpenTarget): void }>()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const menuPos = ref<{ left: string; top: string }>({ left: '0px', top: '0px' })

function toggle() {
  open.value = !open.value
  if (open.value) {
    void nextTick(() => updatePos())
  }
}

function updatePos() {
  if (!rootRef.value) return
  const r = rootRef.value.getBoundingClientRect()
  // 下拉右对齐到按钮右边，下方展开；防溢出右边：若右边放不下就左移
  const menuW = 160
  let left = r.right - menuW
  if (left < 4) left = 4
  let top = r.bottom + 2
  // 防溢出底部（粗略）
  if (top + 120 > window.innerHeight) top = Math.max(4, r.top - 122)
  menuPos.value = { left: `${left}px`, top: `${top}px` }
}

function close() {
  open.value = false
}

function onSelect(target: OpenTarget) {
  open.value = false
  emit('select', target)
}

// 点击外部关闭（捕获阶段）
function onWindowMouseDown(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as Node | null
  if (rootRef.value && target && !rootRef.value.contains(target)) {
    // Teleport 出去的下拉标了 data-popover-content，点它不算外部
    if (!(target instanceof Element && target.closest('[data-popover-content]'))) {
      close()
    }
  }
}

onMounted(() => {
  window.addEventListener('mousedown', onWindowMouseDown, true)
})
onUnmounted(() => {
  window.removeEventListener('mousedown', onWindowMouseDown, true)
})
</script>
