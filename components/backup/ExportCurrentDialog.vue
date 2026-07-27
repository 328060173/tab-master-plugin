<template>
  <!--
    导出当前标签弹框（备份概览「导出」用）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    流程：抓当前浏览器全部标签 → 勾选（默认全选非隐身）→ 下一步 → 大 JSON 面板（复制 / 下载到文件夹）。
    不写 IndexedDB，纯导出当前标签。
    复用：chrome.tabs.query + collectMeta + buildSnapshot + exportByFormat + downloadExportWithPicker。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-current-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
          <h2 id="export-current-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
            导出当前标签
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 步骤 1：标签勾选 -->
        <div v-if="step === 'select'" class="px-5 pb-5 flex-1 overflow-y-auto">
          <div class="flex items-center gap-2 mb-3 text-xs">
            <label class="inline-flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" :checked="allSelected" :indeterminate.prop="someSelected && !allSelected" @change="onToggleAll" />
              <span>全选</span>
            </label>
            <span class="text-[11px] text-gray-500 dark:text-gray-400">已选 {{ selectedCount }} / {{ totalCount }} 个标签（已自动跳过隐身窗口）</span>
            <span v-if="loading" class="text-[11px] text-gray-400">加载中…</span>
          </div>
          <div class="max-h-[50vh] overflow-y-auto border border-gray-100 dark:border-gray-700 rounded">
            <div
              v-for="(g, idx) in windowGroups"
              :key="idx"
              class="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
            >
              <div class="flex items-center gap-2 px-2 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 sticky top-0">
                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" :checked="isWindowAllSelected(g)" :indeterminate.prop="isWindowSomeSelected(g)" @change="onToggleWindow(g)" />
                  <span>窗口{{ idx + 1 }}（{{ g.tabs.length }} 个标签）</span>
                </label>
              </div>
              <ul class="divide-y divide-gray-50 dark:divide-gray-700/50">
                <li v-for="tab in g.tabs" :key="tab.id">
                  <label class="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <input type="checkbox" :checked="selectedIds.has(tab.id)" @change="onToggleTab(tab.id)" />
                    <FavIcon :src="tab.favIconUrl" :domain="tab.domain" size="sm" />
                    <span class="flex-1 min-w-0 truncate text-gray-800 dark:text-gray-100">{{ tab.title || '(无标题)' }}</span>
                    <span class="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 truncate max-w-[160px]" :title="tab.url">{{ tab.domain }}</span>
                  </label>
                </li>
              </ul>
            </div>
            <div v-if="windowGroups.length === 0 && !loading" class="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
              没有可导出的标签
            </div>
          </div>
        </div>

        <!-- 步骤 2：数据大面板（高度自适应内容，超过 70vh 才固定+滚动） -->
        <div v-else class="px-5 pb-5 flex-1 overflow-y-auto">
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-2">已选 {{ selectedCount }} 个标签的数据，可复制或下载到文件夹：</p>
          <textarea
            class="w-full border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/40 text-xs font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            :style="{ height: textareaHeight }"
            readonly
            :value="jsonContent"
            aria-label="数据串"
          ></textarea>
        </div>

        <!-- 操作行 -->
        <div class="flex items-center gap-2 justify-end px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-700 shrink-0 flex-wrap">
          <button
            class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >取消</button>
          <button
            v-if="step === 'select'"
            :disabled="selectedCount === 0 || generating"
            class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onGenerate"
          >{{ generating ? '生成中…' : '生成数据' }}</button>
          <template v-else>
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onCopy"
            >复制</button>
            <button
              :disabled="downloading"
              class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="onDownload"
            >{{ downloading ? '下载中…' : '下载到文件夹' }}</button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 导出当前标签弹框（备份概览「导出」用）。
 * chrome.tabs.query 当前全部标签 → 勾选 → buildSnapshot → JSON。
 * 不写 IDB，纯导出。复用 collectMeta/buildSnapshot/exportByFormat/downloadExportWithPicker。
 */
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { X } from '@lucide/vue'
import FavIcon from '~components/FavIcon.vue'
import { showToast } from '~composables/useToast'
import { buildBackupFileFromTabs, serializeBackupJson, downloadExportWithPicker } from '~lib/backup/exporters'
import { getDeviceId } from '~lib/backup/timer'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'cancel'): void }>()

interface TabItem { id: number; title: string; url: string; favIconUrl: string; domain: string }
interface WindowGroup { windowId: number; tabs: TabItem[] }

const loading = ref(false)
const generating = ref(false)
const downloading = ref(false)
const step = ref<'select' | 'json'>('select')
const windowGroups = ref<WindowGroup[]>([])
const selectedIds = reactive<Set<number>>(new Set())
const jsonContent = ref('')

watch(() => props.open, async (v) => {
  if (v) {
    step.value = 'select'
    jsonContent.value = ''
    selectedIds.clear()
    await loadTabs()
  }
})

async function loadTabs() {
  loading.value = true
  try {
    const allTabs = await chrome.tabs.query({})
    const groups: WindowGroup[] = []
    const byWindow = new Map<number, TabItem[]>()
    for (const t of allTabs) {
      if (typeof t.id !== 'number') continue
      if (t.incognito) continue // 跳过隐身
      const wid = typeof t.windowId === 'number' ? t.windowId : -1
      const item: TabItem = {
        id: t.id,
        title: t.title || '',
        url: t.url || '',
        favIconUrl: t.favIconUrl || '',
        domain: safeDomain(t.url || ''),
      }
      if (!byWindow.has(wid)) byWindow.set(wid, [])
      byWindow.get(wid)!.push(item)
    }
    for (const [wid, tabs] of byWindow) groups.push({ windowId: wid, tabs })
    windowGroups.value = groups
    // 默认全选
    selectedIds.clear()
    for (const g of groups) for (const t of g.tabs) selectedIds.add(t.id)
  } catch (e) {
    console.warn('[ExportCurrentDialog] 加载标签失败', e)
    showToast('加载标签失败')
  } finally {
    loading.value = false
  }
}

const totalCount = computed(() => windowGroups.value.reduce((n, g) => n + g.tabs.length, 0))
const selectedCount = computed(() => selectedIds.size)
const allSelected = computed(() => totalCount.value > 0 && selectedIds.size === totalCount.value)
const someSelected = computed(() => selectedIds.size > 0)

/** textarea 高度：按内容行数估算，最小 200px，最大 70vh（超过滚动）。自适应内容量，不固定大面板。 */
const textareaHeight = computed(() => {
  if (!jsonContent.value) return '200px'
  const lines = jsonContent.value.split('\n').length
  const est = lines * 18 + 24 // 每行 ~18px + padding
  const max = Math.floor(window.innerHeight * 0.7)
  return `${Math.min(Math.max(est, 200), max)}px`
})

function onToggleAll() {
  if (allSelected.value) selectedIds.clear()
  else {
    selectedIds.clear()
    for (const g of windowGroups.value) for (const t of g.tabs) selectedIds.add(t.id)
  }
}
function onToggleTab(id: number) {
  if (selectedIds.has(id)) selectedIds.delete(id)
  else selectedIds.add(id)
}
function isWindowAllSelected(g: WindowGroup): boolean {
  return g.tabs.length > 0 && g.tabs.every((t) => selectedIds.has(t.id))
}
function isWindowSomeSelected(g: WindowGroup): boolean {
  const sel = g.tabs.filter((t) => selectedIds.has(t.id)).length
  return sel > 0 && sel < g.tabs.length
}
function onToggleWindow(g: WindowGroup) {
  if (isWindowAllSelected(g)) {
    for (const t of g.tabs) selectedIds.delete(t.id)
  } else {
    for (const t of g.tabs) selectedIds.add(t.id)
  }
}

/** 生成数据：抓选中标签 → buildBackupFileFromTabs 统一构造 → serializeBackupJson 统一序列化 */
async function onGenerate() {
  if (selectedCount.value === 0 || generating.value) return
  generating.value = true
  try {
    const allTabs = await chrome.tabs.query({})
    // ⚠️ selectedIds 是 reactive Set，没有 .value；用 Array.from 复制（new Set(selectedIds.value) 会得到空集合 → windows 空）
    const ids = Array.from(selectedIds)
    const selected = allTabs.filter((t) => typeof t.id === 'number' && ids.includes(t.id))
    const deviceId = await getDeviceId()
    const file = await buildBackupFileFromTabs(selected, 'manual', deviceId, 'export', {
      selectedTabIds: ids,
      totalTabCount: allTabs.length,
    })
    jsonContent.value = serializeBackupJson(file)
    step.value = 'json'
  } catch (e) {
    console.warn('[ExportCurrentDialog] 生成数据失败', e)
    showToast('生成数据失败')
  } finally {
    generating.value = false
  }
}

function onCopy() {
  try {
    navigator.clipboard.writeText(jsonContent.value).then(
      () => showToast('已复制到剪贴板'),
      () => showToast('复制失败，请手动全选复制'),
    )
  } catch {
    showToast('复制失败，请手动全选复制')
  }
}

async function onDownload() {
  if (downloading.value) return
  downloading.value = true
  try {
    const out = { fileName: `tabmaster-export-${isoNow()}.json`, mime: 'application/json', content: jsonContent.value }
    const r = await downloadExportWithPicker(out)
    if (r.ok) {
      showToast(r.fallback ? '已下载到默认目录' : '已导出到所选位置')
    } else if (r.error && r.error !== '用户取消') {
      showToast(r.error || '下载失败')
    }
  } finally {
    downloading.value = false
  }
}

function onCancel() { emit('cancel') }

function safeDomain(url: string): string {
  try { return new URL(url).hostname || '?' } catch { return '?' }
}
function isoNow(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

// 防未用到警告
void nextTick
</script>
