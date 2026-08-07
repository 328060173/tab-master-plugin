<template>
  <!--
    备份详情弹框（设计稿 §3.3）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    两视图切换：[标签视图] [JSON 视图]
    - 标签视图：按窗口分组列出标签 + 分页 50/页 + 勾选还原（本窗口/新窗口打开选中）
    - JSON 视图：完整 BackupFile JSON 串（可全选复制 / 下载为文件）
    可改备注（inline 编辑，≤20字）。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-detail-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2 shrink-0 gap-2">
          <div class="flex-1 min-w-0">
            <h2 id="backup-detail-title" class="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
              {{ t('backup.comp.detail.title') }}<span v-if="fileLabel">{{ t('backup.comp.detail.titleSep') }}{{ fileLabel }}</span>
            </h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {{ sourceLabel }} · {{ fileTimeLabel }}
            </p>
          </div>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
            :aria-label="t('backup.comp.detail.close')"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 摘要 + 备注 -->
        <div class="px-5 pb-2 shrink-0 space-y-2">
          <p class="text-xs text-gray-700 dark:text-gray-200">
            {{ summaryText }}
          </p>
          <div class="flex items-center gap-2 text-xs">
            <span class="text-gray-500 dark:text-gray-400 shrink-0">{{ t('backup.comp.detail.noteLabel') }}</span>
            <template v-if="!editingLabel">
              <span class="text-gray-800 dark:text-gray-100">{{ fileLabel || '--' }}</span>
              <button
                class="inline-flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                :aria-label="t('backup.comp.detail.noteEditAria')"
                :title="t('backup.comp.detail.noteEditTitle')"
                @click="onStartEditLabel"
              >
                <Pencil :size="12" />
              </button>
            </template>
            <template v-else>
              <input
                ref="labelInputRef"
                v-model="labelDraft"
                type="text"
                maxlength="20"
                class="flex-1 min-w-0 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                @keydown.enter="onSaveLabel"
                @keydown.esc="editingLabel = false"
              />
              <button
                class="px-2 py-1 min-h-[28px] text-[11px] rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="onSaveLabel"
              >{{ t('backup.comp.detail.save') }}</button>
              <button
                class="px-2 py-1 min-h-[28px] text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="editingLabel = false"
              >{{ t('backup.comp.detail.cancel') }}</button>
            </template>
          </div>
        </div>

        <!-- 视图切换 -->
        <div class="px-5 py-2 border-y border-gray-100 dark:border-gray-700 shrink-0 flex items-center gap-1">
          <button
            v-for="tab in VIEW_TABS"
            :key="tab.key"
            :class="[
              'px-3 py-1 text-xs transition-colors border-b-2 -mb-px focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t',
              view === tab.key
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200',
            ]"
            @click="view = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 主体 -->
        <div class="flex-1 overflow-y-auto px-5 py-3 min-h-[260px]">
          <!-- 加载态 -->
          <div v-if="loading" class="py-12 text-center text-xs text-gray-500 dark:text-gray-400">
            {{ t('backup.comp.detail.loading') }}
          </div>

          <!-- 标签视图 -->
          <template v-else-if="view === 'tabs' && file">
            <TabSelectPanel
              :windows="selectWindows"
              v-model="selectedFps"
              :empty-hint="t('backup.comp.detail.emptyTabs')"
              max-height="50vh"
            />
          </template>

          <!-- JSON 视图 -->
          <template v-else-if="view === 'json' && file">
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-2">{{ t('backup.comp.detail.jsonHint') }}</p>
            <textarea
              ref="jsonTextareaRef"
              class="w-full h-[360px] border border-gray-200 dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-900/40 text-[11px] font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              readonly
              :value="jsonContent"
              :aria-label="t('backup.comp.detail.jsonAria')"
            ></textarea>
          </template>
        </div>

        <!-- 底部操作 -->
        <div class="flex items-center gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-700 shrink-0 flex-wrap">
          <!-- 标签视图：勾选还原按钮 -->
          <template v-if="view === 'tabs'">
            <button
              :disabled="selectedCount === 0 || restoring"
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="onOpenSelected(false)"
            >{{ t('backup.comp.detail.openCurrent') }}</button>
            <button
              :disabled="selectedCount === 0 || restoring"
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="onOpenSelected(true)"
            >{{ t('backup.comp.detail.openNew') }}</button>
          </template>

          <!-- JSON 视图：复制 + 下载 -->
          <template v-if="view === 'json'">
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onCopyJson"
            >{{ t('backup.comp.detail.copyAll') }}</button>
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onDownloadJson"
            >{{ t('backup.comp.detail.downloadFile') }}</button>
          </template>

          <div class="ml-auto flex gap-2">
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onCancel"
            >{{ t('backup.comp.detail.close') }}</button>
          </div>
        </div>
      </div>

      <!-- 还原确认弹框（勾选还原有重复时让用户选去重 / 全部打开 / 取消） -->
      <RestoreConfirmDialog
        :open="restorePreview.open"
        :total="restorePreview.total"
        :duplicate="restorePreview.duplicate"
        :to-open="restorePreview.toOpen"
        :target="restorePreview.openInNewWindow ? 'newWindow' : 'current'"
        @confirm="onRestoreConfirm"
        @cancel="restorePreview.open = false"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 备份详情弹框（设计稿 §3.3）。
 * - 打开时 svc.getSnapshotFile(id) 加载完整 BackupFile
 * - 标签视图：按 windows[] 分组，分页 50/页，勾选 fingerprint → 本窗口/新窗口打开选中
 * - JSON 视图：完整 JSON 串 textarea 只读，全选复制 + 下载为文件
 * - 可改备注（inline 编辑，调 svc.setSnapshotLabel）
 * 守红线：禁 v-html（URL/标题用 {{ }} 文本插值）；textarea 只读防 XSS。
 */
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { X, Pencil } from '@lucide/vue'
import { useBackupService } from '~composables/useBackupService'
import { t, tWithParams } from '~lib/i18n'
import { useBackupRestore, type OpenTarget } from '~composables/useBackupRestore'
import { showToast } from '~composables/useToast'
import { exportByFormat, downloadExportWithPicker } from '~lib/backup/exporters'
import { NO_TABS_HINT } from '~lib/backup/urlFilter'
import TabSelectPanel from '~components/backup/TabSelectPanel.vue'
import RestoreConfirmDialog from '~components/backup/RestoreConfirmDialog.vue'
import type { BackupFile } from '~types/backup'

const props = defineProps<{ open: boolean; snapshotId: string | null }>()
const emit = defineEmits<{ (e: 'cancel'): void; (e: 'restored'): void }>()

const svc = useBackupService()
const restoreSvc = useBackupRestore()

type ViewTab = 'tabs' | 'json'
const VIEW_TABS = computed<{ key: ViewTab; label: string }[]>(() => [
  { key: 'tabs', label: t('backup.comp.detail.viewTabs') },
  { key: 'json', label: t('backup.comp.detail.viewJson') },
])

const view = ref<ViewTab>('tabs')
const loading = ref(false)
const restoring = ref(false)
const file = ref<BackupFile | null>(null)
const selectedFps = ref<Set<string>>(new Set())

// 备注 inline 编辑
const editingLabel = ref(false)
const labelDraft = ref('')
const labelInputRef = ref<HTMLInputElement | null>(null)
const jsonTextareaRef = ref<HTMLTextAreaElement | null>(null)

// 加载快照
watch(() => props.open, async (v) => {
  if (v && props.snapshotId) {
    view.value = 'tabs'
    selectedFps.value = new Set()
    editingLabel.value = false
    loading.value = true
    try {
      file.value = await svc.getSnapshotFile(props.snapshotId)
    } catch (e) {
      console.warn('[BackupDetailDialog] 加载失败', e)
      file.value = null
    } finally {
      loading.value = false
    }
  } else {
    file.value = null
  }
})

const fileLabel = computed(() => file.value?.snapshot.label || null)
const fileTimeLabel = computed(() => {
  const ts = file.value?.snapshot.createdAt
  if (!ts) return ''
  return formatRelative(ts)
})

const sourceLabel = computed(() => {
  const s = file.value?.snapshot.source
  switch (s) {
    case 'manual': return t('backup.comp.detail.sourceManual')
    case 'auto.timer': return t('backup.comp.detail.sourceTimer')
    case 'auto.event':
      return t('backup.comp.detail.sourceEvent')
    case 'import': return t('backup.comp.detail.sourceImport')
    case 'preRestore': return t('backup.comp.detail.sourcePreRestore')
    default: return s || ''
  }
})

const summaryText = computed(() => {
  const f = file.value
  if (!f) return ''
  const s = f.snapshot.stats
  const meta = f.snapshot.meta
  const parts: string[] = [
    tWithParams('backup.comp.detail.statTabs', { count: s.tabCount }),
    tWithParams('backup.comp.detail.statWindows', { count: s.windowCount }),
  ]
  if (s.taggedCount > 0) parts.push(tWithParams('backup.comp.detail.statTags', { count: s.taggedCount }))
  if (s.laterCount > 0) parts.push(tWithParams('backup.comp.detail.statLater', { count: s.laterCount }))
  if (s.groupCount > 0) parts.push(tWithParams('backup.comp.detail.statGroups', { count: s.groupCount }))
  // 元数据补充：标记/稍后/分组实际数（stats 可能未填）
  const tagMapCount = Object.keys(meta.tabTagsMap).length
  const laterCount = meta.laterTabs.length
  const groupCount = meta.tabGroups.length
  if (tagMapCount && tagMapCount !== s.taggedCount) {
    parts.push(tWithParams('backup.comp.detail.statTags', { count: tagMapCount }))
  }
  if (laterCount && laterCount !== s.laterCount) {
    parts.push(tWithParams('backup.comp.detail.statLater', { count: laterCount }))
  }
  if (groupCount && groupCount !== s.groupCount) {
    parts.push(tWithParams('backup.comp.detail.statGroups', { count: groupCount }))
  }
  // 去重
  const seen = new Set<string>()
  return parts.filter((p) => {
    if (seen.has(p)) return false
    seen.add(p)
    return true
  }).join(' · ')
})

// ===== 标签视图：按窗口分组喂给 TabSelectPanel =====
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

/** 当前快照所有标签按窗口分组（保留隐身窗口分组，与原行为一致：用户可选隐身标签还原） */
const selectWindows = computed<SelectWindow[]>(() => {
  const f = file.value
  if (!f) return []
  const map = new Map<number, SelectTabItem[]>()
  for (const w of f.snapshot.windows) {
    for (const t of w.tabs) {
      if (!map.has(w.windowId)) map.set(w.windowId, [])
      map.get(w.windowId)!.push({
        fingerprint: t.fingerprint,
        title: t.title || '',
        url: t.url || '',
        domain: safeDomain(t.url),
        favIconUrl: '', // 备份不存 favIconUrl，FavIcon 退化为首字母色块
      })
    }
  }
  const wids = Array.from(map.keys()).sort((a, b) => a - b)
  return wids.map((wid) => ({ windowId: wid, tabs: map.get(wid)! }))
})

const selectedCount = computed(() => selectedFps.value.size)

// ===== JSON 视图 =====
const jsonContent = computed(() => {
  const f = file.value
  if (!f) return ''
  return JSON.stringify(f, null, 2)
})

function onCopyJson() {
  // 0 标签阻断（2026-07-28 立）：空快照不复制空串
  const tabCount = file.value?.snapshot.stats?.tabCount ?? 0
  if (tabCount === 0) {
    showToast(t(NO_TABS_HINT))
    return
  }
  const ta = jsonTextareaRef.value
  if (!ta) return
  ta.select()
  try {
    const ok = document.execCommand('copy')
    if (ok) {
      showToast(t('backup.toast.copied'))
      return
    }
  } catch (e) {
    console.warn('[BackupDetailDialog] 复制失败', e)
  }
  // 降级：navigator.clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonContent.value).then(
      () => showToast(t('backup.toast.copied')),
      () => showToast(t('backup.toast.copyFailedManual')),
    )
  } else {
    showToast(t('backup.toast.copyFailedManual'))
  }
}

function onDownloadJson() {
  const f = file.value
  if (!f) return
  // 0 标签阻断（2026-07-28 立）：空快照不下载空文件
  const tabCount = f.snapshot.stats?.tabCount ?? 0
  if (tabCount === 0) {
    showToast(t(NO_TABS_HINT))
    return
  }
  const out = exportByFormat(f, 'json')
  void downloadExportWithPicker(out).then((r) => {
    if (r.ok) {
      showToast(r.fallback ? t('backup.toast.downloadedDefault') : t('backup.toast.exportedToPicked'))
    } else if (r.error && r.error !== t('backup.lib.userCancelled')) {
      showToast(r.error || t('backup.toast.downloadFailed'))
    }
  })
}

// ===== 备注 inline 编辑 =====
function onStartEditLabel() {
  labelDraft.value = fileLabel.value || ''
  editingLabel.value = true
  void nextTick(() => {
    labelInputRef.value?.focus()
    labelInputRef.value?.select()
  })
}

async function onSaveLabel() {
  const trimmed = labelDraft.value.trim().slice(0, 20)
  if (!props.snapshotId) return
  const ok = await svc.setSnapshotLabel(props.snapshotId, trimmed || null)
  if (ok) {
    // 重新加载 file（label 已变）
    file.value = await svc.getSnapshotFile(props.snapshotId)
    showToast(t('backup.comp.list.noteSaved'))
  } else {
    showToast(t('backup.comp.list.noteSaveFailed'))
  }
  editingLabel.value = false
}

// ===== 勾选还原（先预览重复数，有重复弹 RestoreConfirmDialog 让用户选） =====
const restorePreview = reactive<{
  open: boolean
  openInNewWindow: boolean
  total: number
  duplicate: number
  toOpen: number
}>({
  open: false,
  openInNewWindow: false,
  total: 0,
  duplicate: 0,
  toOpen: 0,
})

async function onOpenSelected(openInNewWindow: boolean) {
  if (!props.snapshotId || selectedCount.value === 0) return
  if (restoring.value) return
  // 先预览重复数
  const p = await restoreSvc.previewRestore(props.snapshotId, 'selected', {
    selectedFingerprints: new Set(selectedFps.value),
  })
  if (!p.ok) {
    showToast(p.error || t('backup.comp.detail.openFailed'))
    return
  }
  // 有重复 → 弹框让用户选
  if (p.duplicate > 0) {
    restorePreview.open = true
    restorePreview.openInNewWindow = openInNewWindow
    restorePreview.total = p.total
    restorePreview.duplicate = p.duplicate
    restorePreview.toOpen = p.toOpen
    return
  }
  // 无重复 → 直接执行
  await doOpenSelected(openInNewWindow, true)
}

async function doOpenSelected(openInNewWindow: boolean, skipDuplicate: boolean) {
  if (!props.snapshotId || selectedCount.value === 0) return
  if (restoring.value) return
  restoring.value = true
  try {
    const r = await restoreSvc.openSnapshot(props.snapshotId, 'selected', {
      selectedFingerprints: new Set(selectedFps.value),
      openInNewWindow,
      skipDuplicateUrls: skipDuplicate,
    })
    if (r.ok) {
      showToast(r.metaResult
        ? tWithParams('backup.comp.detail.openedToast', { count: r.openedCount, tags: r.metaResult.tagsApplied, later: r.metaResult.laterAdded, groups: r.metaResult.groupsRestored })
        : tWithParams('backup.comp.list.openedToast', { count: r.openedCount }))
      emit('restored')
    } else {
      showToast(r.error || t('backup.comp.detail.openFailed'))
    }
  } finally {
    restoring.value = false
  }
}

async function onRestoreConfirm(payload: { skipDuplicate: boolean }) {
  const inNewWin = restorePreview.openInNewWindow
  restorePreview.open = false
  await doOpenSelected(inNewWin, payload.skipDuplicate)
}

function onCancel() {
  emit('cancel')
}

function safeDomain(url: string): string {
  try {
    return new URL(url).hostname || '?'
  } catch {
    return '?'
  }
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return t('backup.comp.detail.relJustNow')
  if (diff < 3_600_000) return tWithParams('backup.comp.detail.relMinAgo', { count: Math.floor(diff / 60_000) })
  if (diff < 86_400_000) return tWithParams('backup.comp.detail.relHourAgo', { count: Math.floor(diff / 3_600_000) })
  if (diff < 7 * 86_400_000) return tWithParams('backup.comp.detail.relDayAgo', { count: Math.floor(diff / 86_400_000) })
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>
