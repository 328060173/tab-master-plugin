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
              备份详情<span v-if="fileLabel"> · {{ fileLabel }}</span>
            </h2>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              {{ sourceLabel }} · {{ fileTimeLabel }}
            </p>
          </div>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
            aria-label="关闭"
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
            <span class="text-gray-500 dark:text-gray-400 shrink-0">备注：</span>
            <template v-if="!editingLabel">
              <span class="text-gray-800 dark:text-gray-100">{{ fileLabel || '--' }}</span>
              <button
                class="inline-flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="修改备注"
                title="改备注"
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
              >保存</button>
              <button
                class="px-2 py-1 min-h-[28px] text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="editingLabel = false"
              >取消</button>
            </template>
          </div>
        </div>

        <!-- 视图切换 -->
        <div class="px-5 py-2 border-y border-gray-100 dark:border-gray-700 shrink-0 flex items-center gap-1">
          <button
            v-for="t in VIEW_TABS"
            :key="t.key"
            :class="[
              'px-3 py-1 text-xs transition-colors border-b-2 -mb-px focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t',
              view === t.key
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200',
            ]"
            @click="view = t.key"
          >
            {{ t.label }}
          </button>
        </div>

        <!-- 主体 -->
        <div class="flex-1 overflow-y-auto px-5 py-3 min-h-[260px]">
          <!-- 加载态 -->
          <div v-if="loading" class="py-12 text-center text-xs text-gray-500 dark:text-gray-400">
            正在读取备份内容…
          </div>

          <!-- 标签视图 -->
          <template v-else-if="view === 'tabs' && file">
            <!-- 全选 -->
            <div class="flex items-center gap-2 mb-2 text-xs">
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  :indeterminate.prop="someSelected && !allSelected"
                  @change="onToggleAll"
                />
                <span>全选</span>
              </label>
              <span class="text-[11px] text-gray-500 dark:text-gray-400">已选 {{ selectedCount }} / {{ totalCount }} 个标签</span>
            </div>

            <!-- 按窗口分组列出（当前页） -->
            <div
              v-for="w in pagedWindowGroups"
              :key="w.windowId"
              class="mb-3"
            >
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
              <ul class="mt-1 divide-y divide-gray-50 dark:divide-gray-700/50">
                <li
                  v-for="tab in w.tabs"
                  :key="tab.fingerprint"
                >
                  <label class="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded">
                    <input
                      type="checkbox"
                      :checked="selectedFps.has(tab.fingerprint)"
                      @change="onToggleTab(tab.fingerprint)"
                    />
                    <FavIcon :src="tab.favIconUrl || ''" :domain="tab.domain" size="sm" />
                    <span class="flex-1 min-w-0 truncate text-gray-800 dark:text-gray-100">{{ tab.title || '(无标题)' }}</span>
                    <span class="text-[10px] text-gray-400 shrink-0 truncate max-w-[160px]" :title="tab.url">{{ tab.domain }}</span>
                  </label>
                </li>
              </ul>
            </div>

            <!-- 空状态 -->
            <div v-if="pagedWindowGroups.length === 0" class="py-8 text-center text-xs text-gray-500 dark:text-gray-400">
              此备份无标签数据
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
          </template>

          <!-- JSON 视图 -->
          <template v-else-if="view === 'json' && file">
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-2">完整 JSON 串，可全选复制：</p>
            <textarea
              ref="jsonTextareaRef"
              class="w-full h-[360px] border border-gray-200 dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-900/40 text-[11px] font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              readonly
              :value="jsonContent"
              aria-label="完整 JSON 串"
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
            >本窗口打开选中</button>
            <button
              :disabled="selectedCount === 0 || restoring"
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="onOpenSelected(true)"
            >新窗口打开选中</button>
          </template>

          <!-- JSON 视图：复制 + 下载 -->
          <template v-if="view === 'json'">
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onCopyJson"
            >全选复制</button>
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onDownloadJson"
            >下载为文件</button>
          </template>

          <div class="ml-auto flex gap-2">
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onCancel"
            >关闭</button>
          </div>
        </div>
      </div>
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
import { ref, computed, watch, reactive, nextTick } from 'vue'
import { X, Pencil } from '@lucide/vue'
import FavIcon from '~components/FavIcon.vue'
import { useBackupService } from '~composables/useBackupService'
import { useBackupRestore } from '~composables/useBackupRestore'
import { showToast } from '~composables/useToast'
import { exportByFormat, downloadExportWithPicker } from '~lib/backup/exporters'
import type { BackupFile, TabSnapshot } from '~types/backup'

const props = defineProps<{ open: boolean; snapshotId: string | null }>()
const emit = defineEmits<{ (e: 'cancel'): void; (e: 'restored'): void }>()

const svc = useBackupService()
const restoreSvc = useBackupRestore()

type ViewTab = 'tabs' | 'json'
const VIEW_TABS: { key: ViewTab; label: string }[] = [
  { key: 'tabs', label: '标签视图' },
  { key: 'json', label: 'JSON 视图' },
]

const PAGE_SIZE = 50

const view = ref<ViewTab>('tabs')
const loading = ref(false)
const restoring = ref(false)
const file = ref<BackupFile | null>(null)
const selectedFps = reactive<Set<string>>(new Set())
const page = ref(1)

// 备注 inline 编辑
const editingLabel = ref(false)
const labelDraft = ref('')
const labelInputRef = ref<HTMLInputElement | null>(null)
const jsonTextareaRef = ref<HTMLTextAreaElement | null>(null)

// 加载快照
watch(() => props.open, async (v) => {
  if (v && props.snapshotId) {
    view.value = 'tabs'
    page.value = 1
    selectedFps.clear()
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
    case 'manual': return '手动备份'
    case 'auto.timer': return '自动备份（定时）'
    case 'auto.event.tabRemoved':
    case 'auto.event.windowRemoved':
    case 'auto.event.idle':
    case 'auto.event.startup':
      return '自动备份（事件）'
    case 'import': return '导入'
    case 'preRestore': return '还原前快照'
    default: return s || ''
  }
})

const summaryText = computed(() => {
  const f = file.value
  if (!f) return ''
  const s = f.snapshot.stats
  const meta = f.snapshot.meta
  const parts: string[] = [
    `${s.tabCount} 标签`,
    `${s.windowCount} 窗口`,
  ]
  if (s.taggedCount > 0) parts.push(`${s.taggedCount} 标记`)
  if (s.laterCount > 0) parts.push(`${s.laterCount} 稍后`)
  if (s.groupCount > 0) parts.push(`${s.groupCount} 分组`)
  // 元数据补充：标记/稍后/分组实际数（stats 可能未填）
  const tagMapCount = Object.keys(meta.tabTagsMap).length
  const laterCount = meta.laterTabs.length
  const groupCount = meta.tabGroups.length
  if (tagMapCount && tagMapCount !== s.taggedCount) {
    parts.push(`${tagMapCount} 标记`)
  }
  if (laterCount && laterCount !== s.laterCount) {
    parts.push(`${laterCount} 稍后`)
  }
  if (groupCount && groupCount !== s.groupCount) {
    parts.push(`${groupCount} 分组`)
  }
  // 去重
  const seen = new Set<string>()
  return parts.filter((p) => {
    if (seen.has(p)) return false
    seen.add(p)
    return true
  }).join(' · ')
})

// ===== 标签视图：按窗口分组 =====
interface TabItem {
  fingerprint: string
  title: string
  url: string
  domain: string
  favIconUrl: string
  windowId: number
  incognito: boolean
}

interface WindowGroup {
  windowId: number
  index: number
  incognito: boolean
  tabs: TabItem[]
}

const allTabs = computed<TabItem[]>(() => {
  const f = file.value
  if (!f) return []
  const out: TabItem[] = []
  for (const w of f.snapshot.windows) {
    for (const t of w.tabs) {
      out.push({
        fingerprint: t.fingerprint,
        title: t.title || '',
        url: t.url || '',
        domain: safeDomain(t.url),
        favIconUrl: '', // 备份不存 favIconUrl，用 domain 首字母占位
        windowId: w.windowId,
        incognito: w.incognito,
      })
    }
  }
  return out
})

const windowGroups = computed<WindowGroup[]>(() => {
  const map = new Map<number, TabItem[]>()
  for (const t of allTabs.value) {
    if (!map.has(t.windowId)) map.set(t.windowId, [])
    map.get(t.windowId)!.push(t)
  }
  const wids = Array.from(map.keys()).sort((a, b) => a - b)
  return wids.map((wid, idx) => {
    const ts = map.get(wid)!
    return {
      windowId: wid,
      index: idx,
      incognito: ts.some((t) => t.incognito),
      tabs: ts,
    }
  })
})

const totalCount = computed(() => allTabs.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)))
const pagedTabs = computed<TabItem[]>(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return allTabs.value.slice(start, start + PAGE_SIZE)
})
const pagedWindowGroups = computed<WindowGroup[]>(() => {
  const ids = new Set(pagedTabs.value.map((t) => t.fingerprint))
  return windowGroups.value
    .map((w) => ({ ...w, tabs: w.tabs.filter((t) => ids.has(t.fingerprint)) }))
    .filter((w) => w.tabs.length > 0)
})

const selectedCount = computed(() => selectedFps.size)
const allSelected = computed(() => totalCount.value > 0 && selectedFps.size === totalCount.value)
const someSelected = computed(() => selectedFps.size > 0)

function onToggleAll() {
  if (allSelected.value) {
    selectedFps.clear()
  } else {
    selectedFps.clear()
    for (const t of allTabs.value) selectedFps.add(t.fingerprint)
  }
}

function onToggleTab(fp: string) {
  if (selectedFps.has(fp)) selectedFps.delete(fp)
  else selectedFps.add(fp)
}

function isWindowAllSelected(windowId: number): boolean {
  const w = windowGroups.value.find((x) => x.windowId === windowId)
  if (!w || w.tabs.length === 0) return false
  return w.tabs.every((t) => selectedFps.has(t.fingerprint))
}

function isWindowSomeSelected(windowId: number): boolean {
  const w = windowGroups.value.find((x) => x.windowId === windowId)
  if (!w || w.tabs.length === 0) return false
  const sel = w.tabs.filter((t) => selectedFps.has(t.fingerprint)).length
  return sel > 0 && sel < w.tabs.length
}

function onToggleWindow(windowId: number) {
  const w = windowGroups.value.find((x) => x.windowId === windowId)
  if (!w) return
  if (isWindowAllSelected(windowId)) {
    for (const t of w.tabs) selectedFps.delete(t.fingerprint)
  } else {
    for (const t of w.tabs) selectedFps.add(t.fingerprint)
  }
}

// ===== JSON 视图 =====
const jsonContent = computed(() => {
  const f = file.value
  if (!f) return ''
  return JSON.stringify(f, null, 2)
})

function onCopyJson() {
  const ta = jsonTextareaRef.value
  if (!ta) return
  ta.select()
  try {
    const ok = document.execCommand('copy')
    if (ok) {
      showToast('已复制到剪贴板')
      return
    }
  } catch (e) {
    console.warn('[BackupDetailDialog] 复制失败', e)
  }
  // 降级：navigator.clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonContent.value).then(
      () => showToast('已复制到剪贴板'),
      () => showToast('复制失败，请手动全选复制'),
    )
  } else {
    showToast('复制失败，请手动全选复制')
  }
}

function onDownloadJson() {
  const f = file.value
  if (!f) return
  const out = exportByFormat(f, 'json')
  void downloadExportWithPicker(out).then((r) => {
    if (r.ok) {
      showToast(r.fallback ? '已下载到默认目录' : '已保存到所选位置')
    } else if (r.error && r.error !== '用户取消') {
      showToast(r.error || '下载失败')
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
    showToast('已修改备注')
  } else {
    showToast('修改备注失败')
  }
  editingLabel.value = false
}

// ===== 勾选还原 =====
async function onOpenSelected(openInNewWindow: boolean) {
  if (!props.snapshotId || selectedCount.value === 0) return
  if (restoring.value) return
  restoring.value = true
  try {
    const r = await restoreSvc.openSnapshot(props.snapshotId, 'selected', {
      selectedFingerprints: new Set(selectedFps),
      openInNewWindow,
    })
    if (r.ok) {
      showToast(`已打开 ${r.openedCount} 个标签` + (r.metaResult ? `（标记 ${r.metaResult.tabTagsRestored} / 稍后 ${r.metaResult.laterTabsMerged} / 分组 ${r.metaResult.groupsRestored}）` : ''))
      emit('restored')
    } else {
      showToast(r.error || '打开失败')
    }
  } finally {
    restoring.value = false
  }
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
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} 天前`
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>
