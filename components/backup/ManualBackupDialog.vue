<template>
  <!--
    手动备份弹框（设计稿 §2.1：选标签 + 备注）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    内容：
    - 标签列表按窗口分组（favicon + 标题）—— 复用 TabSelectPanel 统一组件
    - 默认全选；上方「反选」按钮（TabSelectPanel 内置全选/窗口选/单条勾三态）
    - 备注 ≤20 字
    - 已选 X 个标签（计数由 TabSelectPanel 内部展示，此处保留 selectedCount 用于按钮态）
    - [取消] [确认备份]
    选中态用 fingerprint(string) 对接 TabSelectPanel；确认时按 fingerprint 反查 tab.id 喂 svc.runManualBackup({ selectedTabIds })。
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
            {{ t('backup.comp.manual.title') }}
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-label="t('backup.comp.manual.close')"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 加载态 -->
        <div v-if="loading" class="px-5 py-12 text-center text-xs text-gray-500 dark:text-gray-400">
          {{ t('backup.comp.manual.loading') }}
        </div>

        <!-- 主体 -->
        <template v-else>
          <div class="px-5 pb-2 text-xs text-gray-600 dark:text-gray-300 shrink-0 flex items-center justify-between gap-2">
            <span>{{ t('backup.comp.manual.selectHint') }}</span>
            <button
              type="button"
              class="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              @click="onInvert"
            >{{ t('backup.comp.manual.invert') }}</button>
          </div>

          <!-- 标签列表（按窗口分组，TabSelectPanel 内部 max-height 滚动） -->
          <div class="flex-1 overflow-y-auto px-5 pb-3 min-h-[280px]">
            <TabSelectPanel
              :windows="selectWindows"
              v-model="selectedFps"
              :empty-hint="t('backup.comp.manual.emptyTabs')"
              max-height="50vh"
            />
          </div>

          <!-- 底部：备注 + 计数 + 操作 -->
          <div class="px-5 pt-3 pb-5 border-t border-gray-100 dark:border-gray-700 shrink-0 space-y-3">
            <!-- §3.3 手动备份上限提示（X/20，达上限变红） -->
            <p
              :class="['text-[11px] leading-relaxed', manualOverLimit ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400']"
            >
              <template v-if="manualOverLimit">{{ tWithParams('backup.comp.manual.overLimit', { current: manualCount, max: MANUAL_MAX_SNAPSHOTS }) }}</template>
              <template v-else>{{ tWithParams('backup.comp.manual.underLimit', { current: manualCount, max: MANUAL_MAX_SNAPSHOTS }) }}</template>
            </p>
            <div class="flex items-center gap-2 text-xs">
              <label class="text-gray-600 dark:text-gray-300 shrink-0" for="manual-backup-label">{{ t('backup.comp.manual.noteLabel') }}</label>
              <input
                id="manual-backup-label"
                v-model="label"
                type="text"
                maxlength="20"
                :placeholder="t('backup.comp.manual.notePlaceholder')"
                class="flex-1 min-w-0 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] text-gray-500 dark:text-gray-400">
                {{ tWithParams('backup.comp.manual.selectedCount', { count: selectedCount }) }}
              </span>
              <div class="flex gap-2">
                <button
                  class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @click="onCancel"
                >{{ t('backup.comp.manual.cancel') }}</button>
                <button
                  :disabled="selectedCount === 0 || submitting || manualOverLimit"
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
              {{ tWithParams('backup.comp.manual.truncateHint', { selected: selectedCount, max: MAX_TABS_PER_SNAPSHOT }) }}
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
 * - 打开时 chrome.tabs.query({}) 读全量标签，过滤 chrome:// / edge:// / about: 等内部页（保留 file:// 与 http(s))
 * - 计算 fingerprint（sha1(urlNormalized + '|' + titleNorm)）用于 TabSelectPanel 选中态
 * - 默认全选
 * - 确认 emit confirm({ tabIds, label })：按 fingerprint 反查 tab.id；超 maxTabsPerSnapshot 时按窗口顺序截断
 *   父组件调 svc.runManualBackup({ selectedTabIds })
 */
import { ref, computed, watch } from "vue"
import { X } from "@lucide/vue"
import { currentLimits } from "~types/backup"
import { computeFingerprint } from "~lib/backup/fingerprint"
import { isBackupableUrl, NO_TABS_HINT } from "~lib/backup/urlFilter"
import { showToast } from "~composables/useToast"
import { useBackupService } from "~composables/useBackupService"
import TabSelectPanel from "~components/backup/TabSelectPanel.vue"
import { t, tWithParams } from "~lib/i18n"

/** TabSelectPanel 期望的标签项形状（结构兼容，无需导入） */
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

/** 浏览器实时标签条目：原始 chrome.tabs.Tab + 预算 fingerprint/domain，供反查与分组 */
interface LiveTabEntry {
  tab: chrome.tabs.Tab
  fingerprint: string
  domain: string
  windowId: number
}

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'confirm', payload: { tabIds: number[]; label: string | null }): void
  (e: 'cancel'): void
}>()

// §3.3 手动备份上限提示：读 svc.snapshots 统计 source==='manual' 数量
const svc = useBackupService()
const { snapshots } = svc
const MANUAL_MAX_SNAPSHOTS = currentLimits().manualMaxSnapshots
const manualCount = computed(() => snapshots.value.filter((s) => s.source === 'manual').length)
const manualOverLimit = computed(() => manualCount.value >= MANUAL_MAX_SNAPSHOTS)

const loading = ref(false)
const submitting = ref(false)
const liveTabs = ref<LiveTabEntry[]>([])
const selectedFps = ref<Set<string>>(new Set())
const label = ref('')

// 打开时加载标签
watch(() => props.open, async (v) => {
  if (v) {
    label.value = ''
    await loadTabs()
  }
})

async function loadTabs() {
  loading.value = true
  try {
    const all = await chrome.tabs.query({})
    const items: LiveTabEntry[] = []
    for (const t of all) {
      if (typeof t.id !== 'number') continue
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
    console.warn('[ManualBackupDialog] 读取标签失败', e)
    liveTabs.value = []
    selectedFps.value = new Set()
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

// §3.2 单次备份超标签上限：选中数超过 maxTabsPerSnapshot 时按钮文案变化 + 提示
const MAX_TABS_PER_SNAPSHOT = currentLimits().maxTabsPerSnapshot
const overLimit = computed(() => selectedCount.value > MAX_TABS_PER_SNAPSHOT)
const confirmButtonText = computed(() => {
  if (submitting.value) return t('backup.comp.manual.submitting')
  if (manualOverLimit.value) return t('backup.comp.manual.overLimitBtn')
  if (overLimit.value) return tWithParams('backup.comp.manual.truncateBtn', { count: MAX_TABS_PER_SNAPSHOT })
  return t('backup.comp.manual.confirm')
})

/** 反选：对全部 liveTabs 的 fingerprint 取补集 */
function onInvert() {
  const next = new Set<string>()
  const cur = selectedFps.value
  for (const e of liveTabs.value) {
    if (!cur.has(e.fingerprint)) next.add(e.fingerprint)
  }
  selectedFps.value = next
}

function onConfirm() {
  if (submitting.value) return
  // 0 标签阻断（2026-07-28 立）：toast 提示而非静默 return
  if (selectedCount.value === 0) {
    showToast(t(NO_TABS_HINT))
    return
  }
  if (manualOverLimit.value) return
  submitting.value = true
  const fpSet = new Set(selectedFps.value)
  // 按 liveTabs 顺序（chrome.tabs.query 返回顺序，即窗口顺序）保留选中
  const entries = liveTabs.value.filter((e) => fpSet.has(e.fingerprint))
  // §3.2：超 maxTabsPerSnapshot 时截断到前 N 个（按窗口顺序）
  const sliced = entries.length > MAX_TABS_PER_SNAPSHOT ? entries.slice(0, MAX_TABS_PER_SNAPSHOT) : entries
  const tabIds = sliced
    .map((e) => e.tab.id)
    .filter((x): x is number => typeof x === 'number')
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
</script>
