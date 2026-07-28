<template>
  <!--
    更多…下拉菜单（设计稿 §3.1 操作列）。
    单根（外层 div），所有事件声明在 emits。
    选项：锁定/解锁 / 改备注 / 删除（danger 红）
    下拉 Teleport + fixed（防表格 overflow-x-auto 裁剪）；点击外部自动关闭。
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

    <Teleport to="body">
      <div
        v-if="open"
        data-popover-content
        class="fixed z-[90] min-w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1"
        :style="menuPos"
        role="menu"
        @click.stop
      >
        <button
          type="button"
          class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center gap-1.5"
          role="menuitem"
          @click="onViewDetail"
        >
          <Eye :size="12" />
          <span>查看详情</span>
        </button>
        <button
          type="button"
          class="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 inline-flex items-center gap-1.5"
          role="menuitem"
          :title="locked ? '允许后这条备份可被自动清理' : '禁止后这条备份不会被自动清理（手动备份本就不自动删，主要保护自动备份）'"
          @click="onToggleLock"
        >
          <Lock v-if="!locked" :size="12" />
          <Unlock v-else :size="12" />
          <span>{{ locked ? '允许自动删除' : '禁止自动删除' }}</span>
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 更多…下拉菜单（锁定/改备注/删除）。
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { MoreHorizontal, Lock, Unlock, Pencil, Trash2, Eye } from '@lucide/vue'

defineProps<{ locked?: boolean }>()
const emit = defineEmits<{
  (e: 'view-detail'): void
  (e: 'lock'): void
  (e: 'edit-label'): void
  (e: 'delete'): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const menuPos = ref<{ left: string; top: string }>({ left: '0px', top: '0px' })

function toggle() {
  open.value = !open.value
  if (open.value) void nextTick(() => updatePos())
}

function updatePos() {
  if (!rootRef.value) return
  const r = rootRef.value.getBoundingClientRect()
  const menuW = 140
  let left = r.right - menuW
  if (left < 4) left = 4
  let top = r.bottom + 2
  if (top + 120 > window.innerHeight) top = Math.max(4, r.top - 122)
  menuPos.value = { left: `${left}px`, top: `${top}px` }
}

function close() {
  open.value = false
}

function onViewDetail() { close(); emit('view-detail') }
function onToggleLock() { close(); emit('lock') }
function onEditLabel() { close(); emit('edit-label') }
function onDelete() { close(); emit('delete') }

function onWindowMouseDown(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as Node | null
  if (rootRef.value && target && !rootRef.value.contains(target)) {
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
