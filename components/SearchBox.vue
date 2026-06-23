<template>
  <div class="relative flex-1" v-click-outside="() => showHistory = false">
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      placeholder="搜索标签、URL..."
      class="w-full text-xs border border-gray-200 rounded px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @input="onInput"
      @focus="onFocus"
      @keyup.enter="onEnter"
    />
    <button v-if="modelValue" class="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded" @click="emit('update:modelValue', ''); showHistory = false">
      <X :size="13" />
    </button>

    <!-- 搜索历史下拉 -->
    <div v-if="showHistory && history.length" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-40 overflow-hidden">
      <div class="flex items-center justify-between px-3 py-1.5 border-b border-gray-100">
        <span class="text-[11px] text-gray-400 font-medium">搜索历史</span>
        <button class="text-[11px] text-gray-400 hover:text-red-500" @click="clearAll">清空</button>
      </div>
      <div class="max-h-48 overflow-y-auto">
        <div v-for="item in history" :key="item" class="flex items-center px-3 py-1.5 hover:bg-gray-50 group">
          <button class="flex items-center gap-2 flex-1 text-left" @click="select(item)">
            <Clock :size="11" class="text-gray-300 shrink-0" />
            <span class="text-xs text-gray-700 truncate">{{ item }}</span>
          </button>
          <button class="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 p-0.5 shrink-0" @click.stop="remove(item)">
            <X :size="11" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { X, Clock } from "@lucide/vue"

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(["update:modelValue"])

const HISTORY_KEY = "tabmaster_search_history"
const MAX = 15

const inputRef = ref<HTMLInputElement | null>(null)
const showHistory = ref(false)
const history = ref<string[]>([])

const loadHistory = () => {
  try { history.value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") } catch { history.value = [] }
}
const saveHistory = (q: string) => {
  if (!q.trim()) return
  const h = [q, ...history.value.filter(i => i !== q)].slice(0, MAX)
  history.value = h
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
}

const onInput = (e: Event) => { emit("update:modelValue", (e.target as HTMLInputElement).value); showHistory.value = false }
const onFocus = () => { if (!props.modelValue) { loadHistory(); showHistory.value = history.value.length > 0 } }
const onEnter = () => { saveHistory(props.modelValue); showHistory.value = false }
const select = (item: string) => { emit("update:modelValue", item); showHistory.value = false; saveHistory(item) }
const remove = (item: string) => {
  history.value = history.value.filter(i => i !== item)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  if (!history.value.length) showHistory.value = false
}
const clearAll = () => { history.value = []; localStorage.removeItem(HISTORY_KEY); showHistory.value = false }

onMounted(loadHistory)

const vClickOutside = {
  mounted(el: any, b: any) { el._o = (e: MouseEvent) => { if (!el.contains(e.target)) b.value() }; document.addEventListener("click", el._o) },
  unmounted(el: any) { document.removeEventListener("click", el._o) },
}
</script>
