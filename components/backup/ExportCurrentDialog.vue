<template>
  <!--
    导出当前标签弹框（备份概览「导出」用）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    流程：抓当前浏览器全部标签 → 勾选（默认全选非隐身）→ 下一步 → 大 JSON 面板（复制 / 下载到文件夹）。
    不写 IndexedDB，纯导出当前标签。
    复用：chrome.tabs.query + collectMeta + buildSnapshot + exportByFormat + downloadExportWithPicker。
    预览区复用 TabSelectPanel（按窗口分组 + 三态勾选统一组件），选中态用 fingerprint(string)。
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
            {{ t('backup.comp.export.title') }}
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-label="t('backup.comp.export.close')"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 步骤 1：标签勾选 -->
        <div v-if="step === 'select'" class="px-5 pb-5 flex-1 overflow-y-auto">
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
            {{ t('backup.comp.export.skipIncognito') }}<span v-if="loading" class="ml-1">{{ t('backup.comp.export.loading') }}</span>
          </p>
          <TabSelectPanel
            :windows="selectWindows"
            v-model="selectedFps"
            :empty-hint="t('backup.comp.export.emptyTabs')"
            max-height="50vh"
          />
        </div>

        <!-- 步骤 2：数据大面板（高度自适应内容，超过 70vh 才固定+滚动） -->
        <div v-else class="px-5 pb-5 flex-1 overflow-y-auto">
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-2">{{ tWithParams('backup.comp.export.dataHint', { count: selectedCount }) }}</p>
          <p class="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded px-2 py-1.5 mb-2">
            {{ t('backup.comp.export.metaWarning') }}
          </p>
          <textarea
            class="w-full border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/40 text-xs font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            :style="{ height: textareaHeight }"
            readonly
            :value="jsonContent"
            :aria-label="t('backup.comp.export.dataAria')"
          ></textarea>
        </div>

        <!-- 操作行 -->
        <div class="flex items-center gap-2 justify-end px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-700 shrink-0 flex-wrap">
          <button
            class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >{{ t('backup.comp.export.cancel') }}</button>
          <button
            v-if="step === 'select'"
            :disabled="selectedCount === 0 || generating"
            class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onGenerate"
          >{{ generating ? t('backup.comp.export.generating') : t('backup.comp.export.generate') }}</button>
          <template v-else>
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onCopy"
            >{{ t('backup.comp.export.copy') }}</button>
            <button
              :disabled="downloading"
              class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="onDownload"
            >{{ downloading ? t('backup.comp.export.downloading') : t('backup.comp.export.download') }}</button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 导出当前标签弹框（备份概览「导出」用）。
 * chrome.tabs.query 当前全部标签 → 计算 fingerprint → 勾选 → buildSnapshot → JSON。
 * 选中态用 fingerprint(string) 对接 TabSelectPanel；提交时按 fingerprint 反查 tab.id 喂 buildBackupFileFromTabs。
 * 不写 IDB，纯导出。复用 collectMeta/buildSnapshot/exportByFormat/downloadExportWithPicker/computeFingerprint。
 */
import { ref, computed, watch } from 'vue'
import { X } from '@lucide/vue'
import { showToast } from '~composables/useToast'
import { buildBackupFileFromTabs, serializeBackupJson, downloadExportWithPicker } from '~lib/backup/exporters'
import { getDeviceId } from '~lib/backup/timer'
import { computeFingerprint } from '~lib/backup/fingerprint'
import { isBackupableUrl, NO_TABS_HINT } from '~lib/backup/urlFilter'
import TabSelectPanel from '~components/backup/TabSelectPanel.vue'
import { t, tWithParams } from '~lib/i18n'

/** TabSelectPanel 期望的窗口分组形状（结构兼容，无需导入） */
interface SelectTabItem {
  fingerprint: string
  title: string
  url: string
  domain: string
  favIconUrl?: string
}
interface SelectWindow {
  windowId: number
  tabs: SelectTabItem[]
}

/** 浏览器实时标签条目：原始 chrome.tabs.Tab + 预算 fingerprint/domain，供反查与喂 TabSelectPanel */
interface LiveTabEntry {
  tab: chrome.tabs.Tab
  fingerprint: string
  domain: string
  windowId: number
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'cancel'): void }>()

const loading = ref(false)
const generating = ref(false)
const downloading = ref(false)
const step = ref<'select' | 'json'>('select')
const liveTabs = ref<LiveTabEntry[]>([])
const selectedFps = ref<Set<string>>(new Set())
const jsonContent = ref('')

watch(() => props.open, async (v) => {
  if (v) {
    step.value = 'select'
    jsonContent.value = ''
    selectedFps.value = new Set()
    await loadTabs()
  }
})

async function loadTabs() {
  loading.value = true
  try {
    const allTabs = await chrome.tabs.query({})
    const items: LiveTabEntry[] = []
    for (const t of allTabs) {
      if (typeof t.id !== 'number') continue
      if (t.incognito) continue // 跳过隐身
      // 过滤插件内部页（chrome-extension:// / chrome:// / edge:// / about:），无备份意义
      if (!isBackupableUrl(t.url)) continue
      const url = t.url || ''
      const title = t.title || ''
      items.push({
        tab: t,
        fingerprint: await computeFingerprint(url, title),
        domain: safeDomain(url),
        windowId: typeof t.windowId === 'number' ? t.windowId : -1,
      })
    }
    liveTabs.value = items
    // 默认全选
    const fps = new Set<string>()
    for (const it of items) fps.add(it.fingerprint)
    selectedFps.value = fps
  } catch (e) {
    console.warn('[ExportCurrentDialog] 加载标签失败', e)
    showToast(t('backup.comp.export.loadFailed'))
  } finally {
    loading.value = false
  }
}

/** 按窗口分组喂给 TabSelectPanel（结构兼容 SelectWindow[]） */
const selectWindows = computed<SelectWindow[]>(() => {
  const map = new Map<number, SelectTabItem[]>()
  for (const e of liveTabs.value) {
    if (!map.has(e.windowId)) map.set(e.windowId, [])
    map.get(e.windowId)!.push({
      fingerprint: e.fingerprint,
      title: e.tab.title || '',
      url: e.tab.url || '',
      domain: e.domain,
      favIconUrl: e.tab.favIconUrl || '',
    })
  }
  const wids = Array.from(map.keys()).sort((a, b) => a - b)
  return wids.map((wid) => ({ windowId: wid, tabs: map.get(wid)! }))
})

const selectedCount = computed(() => selectedFps.value.size)

/** textarea 高度：按内容行数估算，最小 200px，最大 70vh（超过滚动）。自适应内容量，不固定大面板。 */
const textareaHeight = computed(() => {
  if (!jsonContent.value) return '200px'
  const lines = jsonContent.value.split('\n').length
  const est = lines * 18 + 24 // 每行 ~18px + padding
  const max = Math.floor(window.innerHeight * 0.7)
  return `${Math.min(Math.max(est, 200), max)}px`
})

/** 生成数据：按 selectedFps 反查 LiveTabEntry → 取原始 chrome.tabs.Tab 喂 buildBackupFileFromTabs */
async function onGenerate() {
  // 0 标签阻断（2026-07-28 立）：toast 提示而非静默 return
  if (selectedCount.value === 0) {
    showToast(NO_TABS_HINT)
    return
  }
  if (generating.value) return
  generating.value = true
  try {
    const fpSet = new Set(selectedFps.value)
    // 按 liveTabs 顺序（窗口/索引顺序）保留选中
    const entries = liveTabs.value.filter((e) => fpSet.has(e.fingerprint))
    const selectedTabs: chrome.tabs.Tab[] = entries.map((e) => e.tab)
    const ids = entries
      .map((e) => e.tab.id)
      .filter((x): x is number => typeof x === 'number')
    const deviceId = await getDeviceId()
    const file = await buildBackupFileFromTabs(selectedTabs, 'manual', deviceId, 'export', {
      selectedTabIds: ids,
      totalTabCount: liveTabs.value.length,
    })
    jsonContent.value = serializeBackupJson(file)
    step.value = 'json'
  } catch (e) {
    console.warn('[ExportCurrentDialog] 生成数据失败', e)
    showToast(t('backup.comp.export.generateFailed'))
  } finally {
    generating.value = false
  }
}

function onCopy() {
  try {
    navigator.clipboard.writeText(jsonContent.value).then(
      () => showToast(t('backup.toast.copied')),
      () => showToast(t('backup.toast.copyFailedManual')),
    )
  } catch {
    showToast(t('backup.toast.copyFailedManual'))
  }
}

async function onDownload() {
  if (downloading.value) return
  downloading.value = true
  try {
    const out = { fileName: `tabmaster-export-${isoNow()}.json`, mime: 'application/json', content: jsonContent.value }
    const r = await downloadExportWithPicker(out)
    if (r.ok) {
      showToast(r.fallback ? t('backup.toast.downloadedDefault') : t('backup.toast.exportedToPicked'))
    } else if (r.error && r.error !== t('backup.lib.userCancelled')) {
      showToast(r.error || t('backup.toast.downloadFailed'))
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
</script>
