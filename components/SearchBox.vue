<template>
  <div class="relative flex-1">
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      :placeholder="t('search.placeholder')"
      class="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2.5 py-1.5 pr-7 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @input="onInput"
      @focus="onFocus"
      @keyup.enter="onEnter"
      @click.stop
    />
    <button v-if="modelValue" class="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded" @click.stop="onClear">
      <X :size="13" />
    </button>

    <!-- 搜索历史下拉（fixed + Teleport） -->
    <Teleport to="body">
      <div
        v-if="popover.isOpen('search-history') && history.length"
        :style="historyStyle"
        class="fixed z-[60] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl overflow-hidden"
        @click.stop>
        <div class="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-gray-700">
          <span class="text-[11px] text-gray-400 font-medium">{{ t('search.history') }}</span>
          <button class="text-[11px] text-gray-400 hover:text-red-500" @click="clearAll">{{ t('common.clear') }}</button>
        </div>
        <div class="max-h-48 overflow-y-auto">
          <div v-for="item in history" :key="item" class="flex items-center px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 group">
            <button class="flex items-center gap-2 flex-1 text-left" @click="select(item)">
              <Clock :size="11" class="text-gray-300 shrink-0" />
              <span class="text-xs text-gray-700 dark:text-gray-200 truncate">{{ item }}</span>
            </button>
            <button class="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 p-0.5 shrink-0" @click.stop="remove(item)">
              <X :size="11" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 搜索框 + 搜索历史下拉。
 *
 * 重要变更（2026-06-29 浮层统一改造）：
 * - 搜索历史接入 PopoverManager（id='search-history'）
 * - fixed + Teleport，宽度跟随 input
 * - 输入 / 选中后自动关闭
 */
import { ref, computed, onMounted, onUnmounted } from "vue"
import { X, Clock } from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { t } from "~lib/i18n"

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(["update:modelValue"])

const HISTORY_KEY = "tabmaster_search_history"
const MAX = 15

const popover = usePopoverManager()

const inputRef = ref<HTMLInputElement | null>(null)
const history = ref<string[]>([])

// 历史下拉宽度跟随 input：用 input rect 算 left/top + width
const historyStyle = computed(() => {
  if (!popover.isOpen("search-history") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px", width: "0px" }
  const rect = popover.activeAnchorRect.value
  return {
    left: `${rect.left}px`,
    top: `${rect.bottom + 4}px`,
    width: `${rect.width}px`,
  }
})

const loadHistory = () => {
  try { history.value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") } catch { history.value = [] }
}
const saveHistory = (q: string) => {
  if (!q.trim()) return
  const h = [q, ...history.value.filter(i => i !== q)].slice(0, MAX)
  history.value = h
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
}

const onInput = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value)
  popover.close("search-history")
}
const onFocus = (e: FocusEvent) => {
  if (!props.modelValue) {
    loadHistory()
    if (history.value.length > 0) {
      popover.open("search-history", e.currentTarget as HTMLElement)
    }
  }
}
const onEnter = () => { saveHistory(props.modelValue); popover.close("search-history") }
const onClear = () => { emit("update:modelValue", ""); popover.close("search-history") }
const select = (item: string) => { emit("update:modelValue", item); popover.close("search-history"); saveHistory(item) }
const remove = (item: string) => {
  history.value = history.value.filter(i => i !== item)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  if (!history.value.length) popover.close("search-history")
}
const clearAll = () => { history.value = []; localStorage.removeItem(HISTORY_KEY); popover.close("search-history") }

// 锁屏 / 睡眠 / 长时间挂起后，macOS 上 input 与系统 IME 的连接会失活。
// 解锁恢复可见时，对当前聚焦的 input 做一次 blur+focus 强制重建输入连接。
const onVisibilityChange = () => {
  if (document.visibilityState !== 'visible') return
  const el = inputRef.value
  if (!el || document.activeElement !== el) return
  el.blur()
  requestAnimationFrame(() => el.focus())
}

onMounted(() => {
  loadHistory()
  document.addEventListener('visibilitychange', onVisibilityChange)
})
onUnmounted(() => document.removeEventListener('visibilitychange', onVisibilityChange))
</script>
