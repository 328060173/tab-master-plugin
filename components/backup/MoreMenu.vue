<template>
  <!--
    更多…下拉菜单（设计稿 §3.1 操作列）。
    单根（外层 div），所有事件声明在 emits。
    选项：锁定/解锁 / 改备注 / 删除（danger 红）
    点击外部自动关闭。
  -->
  <div ref="rootRef" class="relative inline-block">
    <button
      type="button"
      class="inline-flex items-center gap-0.5 min-h-[32px] px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click.stop="toggle"
    >
      <MoreHorizontal :size="12" />
      <span>更多</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full mt-1 z-50 min-w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1"
      role="menu"
    >
      <button
        type="button"
        class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center gap-1.5"
        role="menuitem"
        @click="onToggleLock"
      >
        <Lock v-if="!locked" :size="12" />
        <Unlock v-else :size="12" />
        <span>{{ locked ? '解锁' : '锁定' }}</span>
      </button>
      <button
        type="button"
        class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center gap-1.5"
        role="menuitem"
        @click="onEditLabel"
      >
        <Pencil :size="12" />
        <span>改备注</span>
      </button>
      <button
        type="button"
        class="w-full text-left px-3 py-1.5 text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 inline-flex items-center gap-1.5"
        role="menuitem"
        @click="onDelete"
      >
        <Trash2 :size="12" />
        <span>删除</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 更多…下拉菜单（锁定/改备注/删除）。
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { MoreHorizontal, Lock, Unlock, Pencil, Trash2 } from '@lucide/vue'

defineProps<{ locked?: boolean }>()
const emit = defineEmits<{
  (e: 'lock'): void
  (e: 'edit-label'): void
  (e: 'delete'): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function onToggleLock() {
  close()
  emit('lock')
}

function onEditLabel() {
  close()
  emit('edit-label')
}

function onDelete() {
  close()
  emit('delete')
}

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
