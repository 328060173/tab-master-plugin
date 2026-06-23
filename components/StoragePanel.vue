<template>
  <div class="fixed inset-0 z-50 bg-black/30" @click="emit('close')"></div>
  <div class="fixed inset-x-3 top-14 bottom-4 z-50 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
      <h2 class="text-sm font-semibold">存储空间使用情况</h2>
      <button class="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100" @click="emit('close')"><X :size="16" /></button>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      <div class="text-xs text-gray-400 mb-3">数据存储在浏览器本地（chrome.storage.local），不上传至云端。</div>
      <div v-for="item in items" :key="item.key" class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50">
        <span class="text-base shrink-0">{{ item.icon }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800">{{ item.label }}</p>
          <p class="text-[11px] text-gray-400">{{ item.count }} 条  ·  {{ item.size }}</p>
        </div>
        <button
          class="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1 rounded transition-colors shrink-0"
          @click="confirmClear(item)"
        >清理</button>
      </div>
      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
        <span class="text-xs font-medium text-blue-700">合计使用</span>
        <span class="text-xs font-bold text-blue-700">{{ totalSize }}</span>
      </div>
    </div>

    <!-- 清理确认弹框 -->
    <div v-if="confirming" class="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50">
      <p class="text-sm font-semibold text-gray-800 mb-2">⚠️ 确认清理「{{ confirming.label }}」</p>
      <p class="text-xs text-red-600 bg-red-50 rounded p-2 mb-4 leading-relaxed">{{ confirming.warning }}</p>
      <div class="flex gap-2 justify-end">
        <button class="px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50" @click="confirming = null">取消</button>
        <button class="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600" @click="doClear">确认清理</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { X } from "@lucide/vue"

const emit = defineEmits(["close", "cleared"])

interface StorageItem {
  key: string; label: string; icon: string; count: number; size: string; warning: string
}
const items = ref<StorageItem[]>([])
const totalSize = ref("0 B")
const confirming = ref<StorageItem | null>(null)

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
function sizeOf(val: unknown) { return new Blob([JSON.stringify(val)]).size }

const DEFS = [
  { key: "laterTabs",     label: "稍后处理列表",   icon: "🕐", warning: "会清空所有稍后处理的标签记录，操作不可恢复。" },
  { key: "customTags",    label: "自定义标记",      icon: "🏷️", warning: "会清空所有自定义标记，同时清除所有标签页上绑定的标记，操作不可恢复。" },
  { key: "tabTagsMap",    label: "标签标记数据",    icon: "🗂️", warning: "会清空所有标签页绑定的标记映射，但不会删除标记名称本身。" },
  { key: "tabNumberMap",  label: "自定义编号",      icon: "🔢", warning: "会清空所有自定义编号，Ctrl+数字快捷键将全部失效。" },
  { key: "recentlyClosed",label: "最近关闭记录",    icon: "📋", warning: "会清空所有最近关闭的标签页记录，搜索时将不再显示关闭历史。" },
]

const loadData = async () => {
  const keys = DEFS.map(d => d.key)
  const data = await chrome.storage.local.get(keys)

  // searchHistory from localStorage
  let shSize = 0; let shCount = 0
  try { const sh = JSON.parse(localStorage.getItem("tabmaster_search_history") || "[]"); shCount = sh.length; shSize = sizeOf(sh) } catch {}

  let total = 0
  items.value = DEFS.map(d => {
    const val = data[d.key] ?? []
    const sz = sizeOf(val); total += sz
    return { ...d, count: Array.isArray(val) ? val.length : Object.keys(val).length, size: fmtBytes(sz) }
  })
  items.value.push({
    key: "__searchHistory__", label: "搜索历史", icon: "🔍", count: shCount, size: fmtBytes(shSize),
    warning: "会清空所有搜索历史记录。"
  })
  total += shSize
  totalSize.value = fmtBytes(total)
}

const confirmClear = (item: StorageItem) => { confirming.value = item }
const doClear = async () => {
  if (!confirming.value) return
  const key = confirming.value.key
  if (key === "__searchHistory__") {
    localStorage.removeItem("tabmaster_search_history")
  } else if (key === "customTags") {
    await chrome.storage.local.set({ customTags: [], tabTagsMap: {} })
  } else {
    const empty = key === "tabTagsMap" || key === "tabNumberMap" ? {} : []
    await chrome.storage.local.set({ [key]: empty })
  }
  confirming.value = null
  emit("cleared")
  await loadData()
}

onMounted(loadData)
</script>
