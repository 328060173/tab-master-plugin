<template>
  <div class="flex flex-col h-full">
    <!-- 顶部工具栏：搜索 + 排序 -->
    <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索已关闭的标签..."
          class="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2.5 py-1.5 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button v-if="searchQuery" class="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded" @click.stop="searchQuery = ''">
          <X :size="12" />
        </button>
      </div>
      <button
        ref="sortTriggerRef"
        :class="['flex items-center gap-1 px-2 py-1 text-xs border rounded transition-colors',
          popover.isOpen('history-sort') ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700']"
        @click.stop="onSortTriggerClick"
      >
        <ArrowUpDown :size="11" />{{ currentSortLabel }}
      </button>
    </div>

    <!-- 列表内容 -->
    <div class="flex-1 overflow-y-auto px-3 py-2">
      <!-- 空态 / 无结果 -->
      <div v-if="!filteredItems.length" class="text-center text-gray-400 text-xs py-12">
        <p class="mb-1 font-medium">{{ searchQuery ? '没有找到匹配的记录' : '暂无关闭的标签' }}</p>
        <p v-if="!searchQuery">关闭标签后会出现在这里</p>
      </div>

      <!-- 按分组渲染（时间分组 或 域名分组）-->
      <template v-else>
        <div v-for="group in groups" :key="group.key" class="mb-3">
          <p class="text-[10px] font-bold text-gray-400 tracking-wide mb-1">{{ group.label }}</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="item in group.items" :key="item.id"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors group/hist"
              :title="`点击恢复：${item.url}`"
              @click="emit('restore', item.url)"
            >
              <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{{ item.title || '(无标题)' }}</p>
                <p class="text-[10px] text-gray-400 truncate">{{ item.domain }}</p>
              </div>
              <span class="text-[10px] text-gray-400 shrink-0">{{ formatRelativeTime(item.closedAt) }}</span>
              <button
                class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 text-gray-400 shrink-0"
                title="从历史中移除"
                @click.stop="emit('remove', item.id)"
              >
                <X :size="12" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 排序下拉 -->
    <Teleport to="body">
      <div
        v-if="popover.isOpen('history-sort')"
        :style="sortPos"
        class="fixed z-[60] w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
        @click.stop
      >
        <button
          v-for="o in SORT_OPTIONS" :key="o.value"
          :class="['flex w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700',
            sortMode === o.value ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30' : '']"
          @click="onSortOptionClick(o.value)"
        >
          {{ o.label }}
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 历史页（P0·最近关闭）—— 零权限，复用 useTabManager 的 recentlyClosed。
 * 列表形式：搜索（标题/URL/域名）+ 排序（关闭时间新→旧 / 旧→新 / 按域名）。
 * 时间排序按 今天/昨天/更早 分组；域名排序按域名分组。
 */
import { ref, computed } from "vue"
import { X, ArrowUpDown } from "@lucide/vue"
import FavIcon from "./FavIcon.vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"
import { getRegistrableDomain } from "~lib/registrableDomain"
import { getDomainLabel } from "~lib/domainNames"
import type { ClosedTabItem } from "~types/tab"

const props = defineProps<{ items: ClosedTabItem[] }>()
const emit = defineEmits<{ restore: [url: string]; remove: [id: number] }>()

type SortMode = "timeDesc" | "timeAsc" | "domain"

const searchQuery = ref("")
const sortMode = ref<SortMode>("timeDesc")
const sortTriggerRef = ref<HTMLElement | null>(null)
const popover = usePopoverManager()

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "timeDesc", label: "时间（新→旧）" },
  { value: "timeAsc", label: "时间（旧→新）" },
  { value: "domain", label: "按域名" },
]
const currentSortLabel = computed(() => SORT_OPTIONS.find(o => o.value === sortMode.value)?.label ?? "")

// 搜索过滤 + 排序
const filteredItems = computed(() => {
  let list = [...props.items]
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.url.toLowerCase().includes(q) ||
      item.domain.toLowerCase().includes(q)
    )
  }
  if (sortMode.value === "timeDesc") {
    list.sort((a, b) => new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime())
  } else if (sortMode.value === "timeAsc") {
    list.sort((a, b) => new Date(a.closedAt).getTime() - new Date(b.closedAt).getTime())
  } else {
    list.sort((a, b) => a.domain.localeCompare(b.domain))
  }
  return list
})

// 时间分组 key
const getTimeGroupKey = (closedAt: string): string => {
  const date = new Date(closedAt)
  const now = new Date()
  const sameDay = now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()
  if (sameDay) return "today"
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  if (diffHours < 48) return "yesterday"
  return "earlier"
}
const TIME_GROUP_LABELS: Record<string, string> = { today: "今天", yesterday: "昨天", earlier: "更早" }

// 统一的分组结构：时间排序按时间分组，域名排序按域名分组
const groups = computed(() => {
  const map = new Map<string, { key: string; label: string; items: ClosedTabItem[] }>()
  const byDomain = sortMode.value === "domain"
  for (const item of filteredItems.value) {
    let key: string
    let label: string
    if (byDomain) {
      key = getRegistrableDomain(item.domain)
      const name = getDomainLabel(key)
      label = name ? `${name} · ${key}` : key
    } else {
      key = getTimeGroupKey(item.closedAt)
      label = TIME_GROUP_LABELS[key] ?? key
    }
    if (!map.has(key)) map.set(key, { key, label, items: [] })
    map.get(key)!.items.push(item)
  }
  const arr = [...map.values()]
  if (byDomain) {
    arr.sort((a, b) => a.key.localeCompare(b.key))
  } else {
    const order = ["today", "yesterday", "earlier"]
    arr.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
  }
  return arr
})

// 相对时间显示
const formatRelativeTime = (closedAt: string): string => {
  const date = new Date(closedAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const sameDay = now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()
  if (diffMin < 1) return "刚刚"
  if (diffMin < 60) return `${diffMin}分钟前`
  if (sameDay) return `${diffHours}小时前`
  const yd = new Date(now); yd.setDate(now.getDate() - 1)
  const isYesterday = yd.getDate() === date.getDate() && yd.getMonth() === date.getMonth() && yd.getFullYear() === date.getFullYear()
  const hh = String(date.getHours()).padStart(2, "0")
  const mi = String(date.getMinutes()).padStart(2, "0")
  if (isYesterday) return `昨天 ${hh}:${mi}`
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${mm}-${dd} ${hh}:${mi}`
}

// 排序下拉
const sortPos = computed(() => {
  if (!popover.isOpen("history-sort") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 128 }, "bottom-right")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
const onSortTriggerClick = (e: MouseEvent) => popover.toggle("history-sort", e.currentTarget as HTMLElement)
const onSortOptionClick = (value: SortMode) => {
  sortMode.value = value
  popover.close("history-sort")
}
</script>
