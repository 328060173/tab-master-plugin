<template>
  <!--
    手动备份弹框（设计稿 §2.1：选标签 + 备注）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    内容：
    - 标签列表按窗口分组（favicon + 标题 + 打开时间）
    - 顶部批量操作：全选 / 按窗口选 / 反选
    - 默认全选
    - 分页 100/页（P0 简版，不做虚拟滚动；P1 再换虚拟滚动）
    - 备注 ≤20 字
    - 已选 X/Y 个标签
    - [取消] [确认备份]
    确认 → emit confirm({ tabIds, label })
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-backup-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
          <h2 id="manual-backup-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
            手动备份
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 加载态 -->
        <div v-if="loading" class="px-5 py-12 text-center text-xs text-gray-500 dark:text-gray-400">
          正在读取标签列表…
        </div>

        <!-- 主体 -->
        <template v-else>
          <div class="px-5 pb-2 text-xs text-gray-600 dark:text-gray-300 shrink-0">
            选择要备份的标签（默认全选，可按窗口选 / 反选 / 单条勾）
          </div>

          <!-- 批量操作栏 -->
          <div class="mx-5 mb-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/40 rounded-lg flex items-center gap-2 text-xs flex-wrap shrink-0">
            <label class="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate.prop="someSelected && !allSelected"
                class="mt-0"
                @change="onToggleAll"
              />
              <span>全选</span>
            </label>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <button
              class="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              @click="onInvert"
            >反选</button>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <span class="text-gray-500 dark:text-gray-400">按窗口：</span>
            <button
              v-for="w in windowGroups"
              :key="w.windowId"
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onToggleWindow(w.windowId)"
            >
              <span
                :class="['w-1.5 h-1.5 rounded-full', w.incognito ? 'bg-purple-500' : 'bg-blue-500']"
                aria-hidden="true"
              ></span>
              <span>窗口{{ w.index + 1 }}（{{ w.tabs.length }}）</span>
              <span
                v-if="isWindowAllSelected(w.windowId)"
                class="text-[10px] text-emerald-600 dark:text-emerald-400"
              >✓</span>
            </button>
          </div>

          <!-- 标签列表（按窗口分组 + 分页） -->
          <div class="flex-1 overflow-y-auto px-5 pb-3 min-h-[280px]">
            <div
              v-for="w in pagedWindowGroups"
              :key="w.windowId"
              class="mb-3"
            >
              <!-- 窗口分组标题 -->
              <div class="flex items-center gap-2 px-2 py-1 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 rounded sticky top-0">
                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="isWindowAllSelected(w.windowId)"
                    :indeterminate.prop="isWindowSomeSelected(w.windowId)"
                    @change="onToggleWindow(w.windowId)"
                  />
                  <span>窗口{{ w.index + 1 }}（{{ w.tabs.length }} 个标签{{ w.incognito ? ' · 无痕' : '' }}）</span>
                </label>
              </div>
              <!-- 标签条目 -->
              <ul class="mt-1 divide-y divide-gray-50 dark:divide-gray-700/50">
                <li
                  v-for="tab in w.tabs"
                  :key="tab.id"
                >
                  <label class="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded">
                    <input
                      type="checkbox"
                      :checked="selectedSet.has(tab.id)"
                      @change="onToggleTab(tab.id)"
                    />
                    <FavIcon :src="tab.favIconUrl || ''" :domain="tab.domain" size="sm" />
                    <span class="flex-1 min-w-0 truncate text-gray-800 dark:text-gray-100">{{ tab.title || '(无标题)' }}</span>
                    <span class="text-[10px] text-gray-400 shrink-0">{{ fmtRelative(tab.lastAccessed) }}</span>
                  </label>
                </li>
              </ul>
            </div>

            <!-- 空状态 -->
            <div v-if="windowGroups.length === 0" class="py-12 text-center text-xs text-gray-500 dark:text-gray-400">
              没有可备份的标签
            </div>

            <!-- 分页 -->
            <div v-if="totalPages > 1" class="flex items-center justify-between pt-2 text-[11px] text-gray-500 dark:text-gray-400">
              <span>第 {{ page }} / {{ totalPages }} 页 · 每页 {{ PAGE_SIZE }} 个</span>
              <div class="flex items-center gap-1">
                <button
                  :disabled="page <= 1"
                  class="px-2 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @click="page--"
                >上一页</button>
                <button
                  :disabled="page >= totalPages"
                  class="px-2 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @click="page++"
                >下一页</button>
              </div>
            </div>
          </div>

          <!-- 底部：备注 + 计数 + 操作 -->
          <div class="px-5 pt-3 pb-5 border-t border-gray-100 dark:border-gray-700 shrink-0 space-y-3">
            <div class="flex items-center gap-2 text-xs">
              <label class="text-gray-600 dark:text-gray-300 shrink-0" for="manual-backup-label">备注（可选，≤20字）</label>
              <input
                id="manual-backup-label"
                v-model="label"
                type="text"
                maxlength="20"
                placeholder="给这次备份起个名，如 工作日午前"
                class="flex-1 min-w-0 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] text-gray-500 dark:text-gray-400">
                已选 {{ selectedCount }} / {{ totalCount }} 个标签
              </span>
              <div class="flex gap-2">
                <button
                  class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @click="onCancel"
                >取消</button>
                <button
                  :disabled="selectedCount === 0 || submitting"
                  class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="onConfirm"
                >{{ confirmButtonText }}</button>
              </div>
            </div>
            <!-- §3.2 超标签上限提示 -->
            <p
              v-if="overLimit"
              class="text-[11px] text-amber-600 dark:text-amber-400 leading-relaxed"
            >
              当前选中 {{ selectedCount }} 个标签，超过单次备份上限 {{ MAX_TABS_PER_SNAPSHOT }} 个。点击「只备份前 {{ MAX_TABS_PER_SNAPSHOT }} 个」将按窗口顺序只备份前 {{ MAX_TABS_PER_SNAPSHOT }} 个。
            </p>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 手动备份弹框（设计稿 §2.1）。
 * - 打开时 chrome.tabs.query({}) 读全量标签，按 windowId 分组
 * - 默认全选
 * - P0 简版分页 100/页（设计稿要求 >500 虚拟滚动，留 P1 升级）
 * - 确认 emit confirm({ tabIds, label })，父组件调 svc.runManualBackup({ selectedTabIds })
 */
import { ref, computed, watch, reactive } from "vue"
import { X } from "@lucide/vue"
import FavIcon from "~components/FavIcon.vue"
import { currentLimits } from "~types/backup"

interface TabItem {
  id: number
  title: string
  url: string
  favIconUrl: string
  domain: string
  windowId: number
  incognito: boolean
  lastAccessed: number
}

interface WindowGroup {
  windowId: number
  index: number
  incognito: boolean
  tabs: TabItem[]
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'confirm', payload: { tabIds: number[]; label: string | null }): void
  (e: 'cancel'): void
}>()

// 每页标签数（P0 简版分页；P1 换虚拟滚动）
const PAGE_SIZE = 100

const loading = ref(false)
const submitting = ref(false)
const tabs = ref<TabItem[]>([])
const selectedSet = reactive<Set<number>>(new Set())
const label = ref('')
const page = ref(1)

// 打开时加载标签
watch(() => props.open, async (v) => {
  if (v) {
    label.value = ''
    page.value = 1
    await loadTabs()
  }
})

async function loadTabs() {
  loading.value = true
  try {
    const all = await chrome.tabs.query({})
    const items: TabItem[] = []
    for (const t of all) {
      if (typeof t.id !== 'number') continue
      // 过滤 about: / chrome:// 等内部页（无意义备份；保留 file:// 与正常 http(s))
      const url = t.url || ''
      if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:')) continue
      items.push({
        id: t.id,
        title: t.title || '',
        url,
        favIconUrl: t.favIconUrl || '',
        domain: safeDomain(url),
        windowId: t.windowId,
        incognito: !!t.incognito,
        lastAccessed: (t as unknown as { lastAccessed?: number }).lastAccessed ?? Date.now(),
      })
    }
    tabs.value = items
    // 默认全选
    selectedSet.clear()
    for (const it of items) selectedSet.add(it.id)
  } catch (e) {
    console.warn('[ManualBackupDialog] 读取标签失败', e)
    tabs.value = []
  } finally {
    loading.value = false
  }
}

function safeDomain(url: string): string {
  try {
    return new URL(url).hostname || '?'
  } catch {
    return '?'
  }
}

// 按窗口分组
const windowGroups = computed<WindowGroup[]>(() => {
  const map = new Map<number, TabItem[]>()
  for (const t of tabs.value) {
    if (!map.has(t.windowId)) map.set(t.windowId, [])
    map.get(t.windowId)!.push(t)
  }
  const wids = Array.from(map.keys()).sort((a, b) => a - b)
  return wids.map((wid, idx) => {
    const ts = map.get(wid)!.slice().sort((a, b) => a.id - b.id)
    return {
      windowId: wid,
      index: idx,
      incognito: ts.some((t) => t.incognito),
      tabs: ts,
    }
  })
})

// 分页（按所有标签平铺后切片；窗口分组在当前页内展示）
const totalCount = computed(() => tabs.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)))
const pagedTabs = computed<TabItem[]>(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return tabs.value.slice(start, start + PAGE_SIZE)
})

// 当前页涉及的窗口分组
const pagedWindowGroups = computed<WindowGroup[]>(() => {
  const ids = new Set(pagedTabs.value.map((t) => t.id))
  return windowGroups.value
    .map((w) => ({ ...w, tabs: w.tabs.filter((t) => ids.has(t.id)) }))
    .filter((w) => w.tabs.length > 0)
})

const selectedCount = computed(() => selectedSet.size)
const allSelected = computed(() => tabs.value.length > 0 && selectedSet.size === tabs.value.length)
const someSelected = computed(() => selectedSet.size > 0)

// §3.2 单次备份超标签上限：选中数超过 maxTabsPerSnapshot 时按钮文案变化 + 提示
const MAX_TABS_PER_SNAPSHOT = currentLimits().maxTabsPerSnapshot
const overLimit = computed(() => selectedCount.value > MAX_TABS_PER_SNAPSHOT)
const confirmButtonText = computed(() => {
  if (submitting.value) return '备份中…'
  if (overLimit.value) return `只备份前 ${MAX_TABS_PER_SNAPSHOT} 个`
  return '确认备份'
})

function onToggleAll() {
  if (allSelected.value) {
    selectedSet.clear()
  } else {
    selectedSet.clear()
    for (const t of tabs.value) selectedSet.add(t.id)
  }
}

function onToggleTab(id: number) {
  if (selectedSet.has(id)) selectedSet.delete(id)
  else selectedSet.add(id)
}

function isWindowAllSelected(windowId: number): boolean {
  const w = windowGroups.value.find((x) => x.windowId === windowId)
  if (!w || w.tabs.length === 0) return false
  return w.tabs.every((t) => selectedSet.has(t.id))
}

function isWindowSomeSelected(windowId: number): boolean {
  const w = windowGroups.value.find((x) => x.windowId === windowId)
  if (!w || w.tabs.length === 0) return false
  const sel = w.tabs.filter((t) => selectedSet.has(t.id)).length
  return sel > 0 && sel < w.tabs.length
}

function onToggleWindow(windowId: number) {
  const w = windowGroups.value.find((x) => x.windowId === windowId)
  if (!w) return
  if (isWindowAllSelected(windowId)) {
    for (const t of w.tabs) selectedSet.delete(t.id)
  } else {
    for (const t of w.tabs) selectedSet.add(t.id)
  }
}

function onInvert() {
  const newSet = new Set<number>()
  for (const t of tabs.value) {
    if (!selectedSet.has(t.id)) newSet.add(t.id)
  }
  selectedSet.clear()
  for (const id of newSet) selectedSet.add(id)
}

function onConfirm() {
  if (submitting.value) return
  if (selectedCount.value === 0) return
  submitting.value = true
  // §3.2：超 maxTabsPerSnapshot 时截断到前 N 个（按 chrome.tabs.query 返回顺序，即窗口顺序）
  let tabIds = Array.from(selectedSet)
  if (tabIds.length > MAX_TABS_PER_SNAPSHOT) {
    // 按 tabs.value 顺序（窗口/索引顺序）取前 N 个选中
    const limit = new Set(tabIds)
    tabIds = tabs.value.filter((t) => limit.has(t.id)).slice(0, MAX_TABS_PER_SNAPSHOT).map((t) => t.id)
  }
  const trimmed = label.value.trim()
  emit('confirm', { tabIds, label: trimmed ? trimmed.slice(0, 20) : null })
}

// 父组件保存完成后调此方法重置 submitting（避免按钮一直 loading）
function resetSubmitting() {
  submitting.value = false
}

defineExpose({ resetSubmitting })

function onCancel() {
  emit('cancel')
}

function fmtRelative(ts: number): string {
  if (!ts) return ''
  const diff = Date.now() - ts
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return `${Math.floor(diff / 86_400_000)} 天前`
}
</script>
