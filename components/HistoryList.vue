<template>
  <div class="flex flex-col h-full">
    <!-- 标题行：当前模式标题 + 功能说明问号 + 计数 -->
    <div class="flex items-center gap-1.5 px-3 pt-2 pb-1">
      <h2 class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ mode === 'closed' ? t('history.closed.title') : t('history.browse.title') }}</h2>
      <button
        ref="helpTriggerRef"
        :class="['p-0.5 rounded transition-colors',
          popover.isOpen('history-help') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600']"
        :title="t('common.whatIsThis')"
        @click.stop="onHelpTriggerClick"
      >
        <HelpCircle :size="13" />
      </button>
      <span class="ml-auto text-[10px] text-gray-400">
        {{ mode === 'closed' ? tWithParams('history.count.closed', { count: props.items.length }) : tWithParams('history.count.browse', { count: props.historyItems.length }) }}
      </span>
    </div>

    <!-- 分段切换（仅已授权时显示）：最近关闭 / 浏览历史 -->
    <div v-if="props.hasPermission" class="flex items-center gap-2 px-3 pb-1.5">
      <div class="flex rounded-md bg-gray-100 dark:bg-gray-700 p-0.5 text-xs">
        <button
          :class="['px-2.5 py-1 rounded transition-colors', mode === 'closed' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium shadow-sm' : 'text-gray-500 dark:text-gray-300']"
          @click="mode = 'closed'"
        >
          {{ t('history.tab.closed') }}
        </button>
        <button
          :class="['px-2.5 py-1 rounded transition-colors', mode === 'history' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium shadow-sm' : 'text-gray-500 dark:text-gray-300']"
          @click="mode = 'history'"
        >
          {{ t('history.tab.browse') }}
        </button>
      </div>
      <button
        v-if="mode === 'history'"
        class="ml-auto text-[10px] text-gray-400 hover:text-red-500 underline decoration-dotted"
        :title="t('history.revoke.tooltip')"
        @click.stop="emit('revokePermission')"
      >
        {{ t('history.revoke') }}
      </button>
    </div>

    <!-- 顶部工具栏：搜索 + 排序 -->
    <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
      <div class="relative flex-1">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="mode === 'closed' ? t('history.search.closed') : t('history.search.browse')"
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
      <!-- 引导卡片：未授权时，介绍并申请「完整浏览历史」权限 -->
      <div
        v-if="mode === 'closed' && props.historySupported && !props.hasPermission"
        class="mb-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3"
      >
        <div class="flex items-center gap-1.5 mb-1">
          <Unlock :size="14" class="text-blue-600 dark:text-blue-400 shrink-0" />
          <p class="text-xs font-semibold text-blue-800 dark:text-blue-200">{{ t('history.guide.title') }}</p>
        </div>
        <p class="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed mb-1" v-html="t('history.guide.body')">
        </p>
        <p class="text-[10px] text-blue-500 dark:text-blue-400 leading-relaxed mb-2">
          {{ t('history.guide.privacy') }}
        </p>
        <button
          class="w-full text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded px-3 py-1.5 transition-colors"
          @click.stop="emit('requestPermission')"
        >
          {{ t('history.guide.cta') }}
        </button>
        <p class="text-[10px] text-blue-400 text-center mt-1">{{ t('history.guide.ctaHint') }}</p>
      </div>

      <!-- 空态 / 无结果 / 加载中 -->
      <div v-if="props.historyLoading && mode === 'history'" class="text-center text-gray-400 text-xs py-12">
        {{ t('history.loading') }}
      </div>
      <div v-else-if="!filteredRows.length" class="text-center text-gray-400 text-xs py-12">
        <template v-if="searchQuery">
          <p class="mb-1 font-medium">{{ t('history.empty.search') }}</p>
        </template>
        <template v-else-if="mode === 'history'">
          <p class="mb-1 font-medium text-gray-500 dark:text-gray-300">{{ t('history.empty.browse.title') }}</p>
          <p class="leading-relaxed" v-html="t('history.empty.browse.body')"></p>
        </template>
        <template v-else>
          <p class="mb-1 font-medium text-gray-500 dark:text-gray-300">{{ t('history.empty.closed.title') }}</p>
          <p class="leading-relaxed" v-html="t('history.empty.closed.body')"></p>
          <p class="mt-1.5 text-[10px] text-gray-300 leading-relaxed" v-html="t('history.empty.closed.foot')"></p>
        </template>
      </div>

      <!-- 按分组渲染（时间分组 或 域名分组）-->
      <template v-else>
        <div v-for="group in groups" :key="group.key" class="mb-3">
          <p class="text-[10px] font-bold text-gray-400 tracking-wide mb-1">{{ group.label }}</p>
          <div class="flex flex-col gap-1">
            <div
              v-for="row in group.items" :key="row.key"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors group/hist"
              :title="tWithParams('history.row.restore.title', { url: row.url })"
              @click="emit('restore', row.url)"
            >
              <FavIcon :src="row.favIconUrl" :domain="row.domain" size="sm" />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{{ row.title || t('history.row.noTitle') }}</p>
                <p class="text-[10px] text-gray-400 truncate">
                  {{ row.domain }}<span v-if="row.visitCount > 1">{{ tWithParams('history.row.visits', { count: row.visitCount }) }}</span>
                </p>
              </div>
              <span class="text-[10px] text-gray-400 shrink-0">{{ formatRelativeTime(row.time) }}</span>
              <!-- 最近关闭：仅移出列表；浏览历史：真正从浏览器历史删除（二次确认） -->
              <button
                v-if="mode === 'closed'"
                class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 text-gray-400 shrink-0"
                :title="t('history.row.removeClosed.title')"
                @click.stop="removeClosed(row)"
              >
                <X :size="12" />
              </button>
              <button
                v-else-if="pendingDeleteUrl === row.url"
                class="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] shrink-0"
                :title="t('history.row.delete.confirmTitle')"
                @click.stop="confirmDelete(row.url)"
              >
                {{ t('history.row.delete.confirm') }}
              </button>
              <button
                v-else
                class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 text-gray-400 shrink-0"
                :title="t('history.row.delete.title')"
                @click.stop="pendingDeleteUrl = row.url"
              >
                <Trash2 :size="12" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 功能说明气泡 -->
    <Teleport to="body">
      <div
        v-if="popover.isOpen('history-help')"
        :style="helpPos"
        class="fixed z-[70] w-[240px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300"
        @click.stop
      >
        <template v-if="mode === 'history'">
          <p class="font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{{ t('history.help.browse.title') }}</p>
          <p class="mb-1.5" v-html="t('history.help.browse.intro')"></p>
          <ul class="list-disc pl-4 space-y-1">
            <li v-html="t('history.help.browse.step1')"></li>
            <li v-html="t('history.help.browse.step2')"></li>
            <li v-html="t('history.help.browse.step3')"></li>
            <li v-html="t('history.help.browse.step4')"></li>
          </ul>
        </template>
        <template v-else>
          <p class="font-semibold text-gray-800 dark:text-gray-100 mb-1.5">{{ t('history.help.closed.title') }}</p>
          <p class="mb-1.5" v-html="t('history.help.closed.intro')"></p>
          <ul class="list-disc pl-4 space-y-1">
            <li v-html="t('history.help.closed.step1')"></li>
            <li v-html="t('history.help.closed.step2')"></li>
            <li v-html="t('history.help.closed.step3')"></li>
            <li v-html="t('history.help.closed.step4')"></li>
            <li v-html="t('history.help.closed.step5')"></li>
          </ul>
          <p class="mt-1.5 text-[10px] text-gray-400">{{ t('history.help.closed.foot') }}</p>
        </template>
      </div>
    </Teleport>

    <!-- 排序下拉 -->
    <Teleport to="body">
      <div
        v-if="popover.isOpen('history-sort')"
        :style="sortPos"
        class="fixed z-[60] w-[128px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
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
 * 历史页 —— 渐进式双模式：
 * - 「最近关闭」：零权限，复用 useTabManager 的 recentlyClosed（最多 50 条）
 * - 「浏览历史」：需用户授权 optional_permission "history"，由 useHistory 提供数据
 * 未授权时在「最近关闭」上方展示引导卡片申请权限；授权后顶部出现分段切换。
 * 搜索（标题/URL/域名）+ 排序（时间新→旧 / 旧→新 / 按域名）。时间排序按 今天/昨天/更早 分组。
 */
import { ref, computed, watch } from "vue"
import { X, Trash2, ArrowUpDown, HelpCircle, Unlock } from "@lucide/vue"
import FavIcon from "./FavIcon.vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"
import { getRegistrableDomain } from "~lib/registrableDomain"
import { getDomainLabel } from "~lib/domainNames"
import { t, tWithParams } from "~lib/i18n"
import type { ClosedTabItem, HistoryItem } from "~types/tab"

const props = defineProps<{
  items: ClosedTabItem[]
  hasPermission: boolean
  historyItems: HistoryItem[]
  historyLoading: boolean
  historySupported: boolean
}>()
const emit = defineEmits<{
  restore: [url: string]
  remove: [id: number]
  requestPermission: []
  revokePermission: []
  deleteHistory: [url: string]
}>()

type SortMode = "timeDesc" | "timeAsc" | "domain"
type Mode = "closed" | "history"

// 统一行结构（关闭记录 / 浏览历史共用渲染）
interface Row {
  key: string
  title: string
  url: string
  domain: string
  favIconUrl: string
  time: number          // 关闭时间 或 最近访问时间（毫秒）
  visitCount: number    // 浏览历史的访问次数；关闭记录恒为 1
  closedId: number | null // 关闭记录的 id（用于移除）；浏览历史为 null
}

const searchQuery = ref("")
const sortMode = ref<SortMode>("timeDesc")
const mode = ref<Mode>("closed")
const pendingDeleteUrl = ref<string | null>(null) // 浏览历史删除二次确认
const sortTriggerRef = ref<HTMLElement | null>(null)
const helpTriggerRef = ref<HTMLElement | null>(null)
const popover = usePopoverManager()

// 权限被撤销时强制回到「最近关闭」，并清掉历史搜索词残留
watch(() => props.hasPermission, (granted) => {
  if (!granted && mode.value === "history") mode.value = "closed"
})
// 切换模式 / 搜索时重置删除确认态，避免误删
watch([mode, searchQuery], () => { pendingDeleteUrl.value = null })

const SORT_OPTIONS = computed<{ value: SortMode; label: string }[]>(() => [
  { value: "timeDesc", label: t("history.sort.timeDesc") },
  { value: "timeAsc", label: t("history.sort.timeAsc") },
  { value: "domain", label: t("sort.domain") },
])
const currentSortLabel = computed(() => SORT_OPTIONS.value.find(o => o.value === sortMode.value)?.label ?? "")

// 当前模式的原始行
const sourceRows = computed<Row[]>(() => {
  if (mode.value === "history") {
    return props.historyItems.map(h => ({
      key: `h${h.id}`, title: h.title, url: h.url, domain: h.domain,
      favIconUrl: h.favIconUrl, time: h.lastVisitTime, visitCount: h.visitCount, closedId: null,
    }))
  }
  return props.items.map(c => ({
    key: `c${c.id}`, title: c.title, url: c.url, domain: c.domain,
    favIconUrl: c.favIconUrl, time: new Date(c.closedAt).getTime(), visitCount: 1, closedId: c.id,
  }))
})

// 搜索过滤 + 排序
const filteredRows = computed(() => {
  let list = [...sourceRows.value]
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.url.toLowerCase().includes(q) ||
      r.domain.toLowerCase().includes(q)
    )
  }
  if (sortMode.value === "timeDesc") {
    list.sort((a, b) => b.time - a.time)
  } else if (sortMode.value === "timeAsc") {
    list.sort((a, b) => a.time - b.time)
  } else {
    list.sort((a, b) => a.domain.localeCompare(b.domain))
  }
  return list
})

// 时间分组 key
const getTimeGroupKey = (time: number): string => {
  const date = new Date(time)
  const now = new Date()
  const sameDay = now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()
  if (sameDay) return "today"
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  if (diffHours < 48) return "yesterday"
  return "earlier"
}
const getTimeGroupLabel = (key: string): string => {
  switch (key) {
    case "today": return t("history.group.today")
    case "yesterday": return t("history.group.yesterday")
    case "earlier": return t("history.group.earlier")
    default: return key
  }
}

// 统一的分组结构：时间排序按时间分组，域名排序按域名分组
const groups = computed(() => {
  const map = new Map<string, { key: string; label: string; items: Row[] }>()
  const byDomain = sortMode.value === "domain"
  for (const row of filteredRows.value) {
    let key: string
    let label: string
    if (byDomain) {
      key = getRegistrableDomain(row.domain)
      const name = getDomainLabel(key)
      label = name ? `${name} · ${key}` : key
    } else {
      key = getTimeGroupKey(row.time)
      label = getTimeGroupLabel(key)
    }
    if (!map.has(key)) map.set(key, { key, label, items: [] })
    map.get(key)!.items.push(row)
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
const formatRelativeTime = (time: number): string => {
  const date = new Date(time)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const sameDay = now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()
  if (diffMin < 1) return t("history.relative.justNow")
  if (diffMin < 60) return tWithParams("history.relative.minutesAgo", { count: diffMin })
  if (sameDay) return tWithParams("history.relative.hoursAgo", { count: diffHours })
  const yd = new Date(now); yd.setDate(now.getDate() - 1)
  const isYesterday = yd.getDate() === date.getDate() && yd.getMonth() === date.getMonth() && yd.getFullYear() === date.getFullYear()
  const hh = String(date.getHours()).padStart(2, "0")
  const mi = String(date.getMinutes()).padStart(2, "0")
  if (isYesterday) return tWithParams("history.relative.yesterdayAt", { hh, mi })
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return tWithParams("history.relative.mdhm", { mm, dd, hh, mi })
}

const confirmDelete = (url: string) => {
  emit("deleteHistory", url)
  pendingDeleteUrl.value = null
}

// 移除最近关闭项（closedId 在最近关闭模式下必为数字；判空仅为类型收窄，避免模板内 TS 断言）
const removeClosed = (row: Row) => {
  if (row.closedId !== null) emit("remove", row.closedId)
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

// 功能说明气泡：定位在问号按钮下方左对齐
const helpPos = computed(() => {
  if (!popover.isOpen("history-help") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 240 }, "bottom-left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
const onHelpTriggerClick = (e: MouseEvent) => popover.toggle("history-help", e.currentTarget as HTMLElement)
</script>
