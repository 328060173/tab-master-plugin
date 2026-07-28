<template>
  <!--
    导入管理菜单（设计稿 §8.7，mysql 还原隐喻）。
    单根（外层 div），所有事件声明在 emits，无 fallthrough。
    三区：
    1. 导入区：来源格式选择 + 来源（选文件/粘贴 JSON）+ 内容框 + [导入预览]
    2. 预览区：校验格式后显示标签列表（可勾选）+ [本窗口打开][新窗口打开][确认导入到备份列表]
    3. 导入记录列表：svc.snapshots 过滤 source='import'，操作（本窗口/新窗口打开/删除）
    守红线：
    - 禁 v-html（URL/标题用 {{ }} 文本插值）
    - 复用 lib/backup/importers 的 parseImport + svc.appendImportedSnapshot
    - 删除复用 svc.deleteSnapshot + 30s 撤销（软删）
    - storage 写 reactive 走 svc 单例（内部已 toPure）
  -->
  <div class="space-y-4">
    <!-- ===== 导入区 ===== -->
    <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">导入</h3>

      <!-- 来源格式 -->
      <div class="mb-3">
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">来源格式</label>
        <div class="flex items-center gap-3 flex-wrap text-xs">
          <label
            v-for="f in FORMAT_OPTIONS"
            :key="f.value"
            class="inline-flex items-center gap-1.5 cursor-pointer"
          >
            <input
              type="radio"
              :value="f.value"
              v-model="format"
              class="focus:ring-blue-500"
            />
            <span class="text-gray-700 dark:text-gray-200">{{ f.label }}</span>
          </label>
        </div>
        <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">默认本插件数据；其他格式自动嗅探，识别失败会提示</p>
      </div>

      <!-- 来源切换 -->
      <div class="mb-3">
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">来源</label>
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
              sourceMode === 'file'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
            @click="onSwitchSource('file')"
          >
            <FileUp :size="12" />
            选择文件
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
              sourceMode === 'paste'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
            @click="onSwitchSource('paste')"
          >
            <Clipboard :size="12" />
            粘贴数据
          </button>
          <span v-if="fileName" class="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[260px]" :title="fileName">
            {{ fileName }}
          </span>
        </div>
        <!-- 文件选择（sourceMode='file' 时显示） -->
        <input
          v-if="sourceMode === 'file'"
          ref="fileInputRef"
          type="file"
          accept=".json,.txt,.md"
          class="hidden"
          @change="onFileChange"
        />
        <div v-if="sourceMode === 'file'" class="mt-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onPickFile"
          >选择文件…</button>
          <button
            v-if="content || fileName"
            type="button"
            class="ml-2 inline-flex items-center gap-1 min-h-[32px] px-2 py-1.5 text-[11px] rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onClearContent"
          >清空</button>
        </div>
      </div>

      <!-- 内容框 -->
      <div class="mb-3">
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          内容<span v-if="sourceMode === 'file'" class="text-[11px] text-gray-400 dark:text-gray-500">（选中的文件内容，可编辑后预览）</span>
        </label>
        <textarea
          v-model="content"
          class="w-full min-h-[160px] max-h-[320px] border border-gray-200 dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-900/40 text-[11px] font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          :placeholder="sourceMode === 'file' ? '点上方「选择文件…」加载文件内容…' : '粘贴数据到这里…'"
          aria-label="导入内容"
        ></textarea>
        <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">数据为 JSON 格式</p>
      </div>

      <!-- 导入预览按钮 -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          :disabled="previewLoading || !content.trim()"
          class="inline-flex items-center gap-1.5 min-h-[36px] px-4 py-2 text-xs rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="onPreview"
        >
          <Search :size="14" />
          {{ previewLoading ? '解析中…' : '导入预览' }}
        </button>
        <button
          v-if="previewFile"
          type="button"
          class="inline-flex items-center gap-1 min-h-[36px] px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="onClearPreview"
        >清除预览</button>
        <span v-if="previewError" class="text-[11px] text-red-600 dark:text-red-400">{{ previewError }}</span>
      </div>
    </section>

    <!-- ===== 预览区 ===== -->
    <section
      v-if="previewFile"
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
    >
      <div class="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
          预览<span v-if="detectedFormatLabel" class="text-[11px] text-gray-500 dark:text-gray-400 font-normal ml-1">· {{ detectedFormatLabel }}</span>
        </h3>
        <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ previewSummaryText }}</span>
      </div>

      <!-- 全选 + 计数 + 标签列表（按窗口分组，仅非隐身）—— 复用 TabSelectPanel -->
      <TabSelectPanel
        :windows="previewWindowGroups"
        v-model="selectedFps"
        empty-hint="无可预览的标签（已自动跳过隐身窗口）"
        max-height="360px"
      />

      <!-- 操作 -->
      <div class="flex items-center gap-2 mt-3 flex-wrap">
        <button
          type="button"
          :disabled="selectedCount === 0 || opening || importing"
          class="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="onOpenSelected(false)"
        >
          <ExternalLink :size="12" />
          本窗口打开
        </button>
        <button
          type="button"
          :disabled="selectedCount === 0 || opening || importing"
          class="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="onOpenSelected(true)"
        >
          <SquareArrowOutUpRight :size="12" />
          新窗口打开
        </button>
        <button
          type="button"
          :disabled="importing || opening"
          class="inline-flex items-center gap-1.5 min-h-[36px] px-4 py-2 text-xs rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="onConfirmImport"
        >
          <Check :size="14" />
          {{ importing ? '导入中…' : '确认导入到备份列表' }}
        </button>
        <span v-if="openHint" class="text-[11px] text-gray-500 dark:text-gray-400 ml-1">{{ openHint }}</span>
      </div>
    </section>

    <!-- ===== 导入记录列表 ===== -->
    <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">导入记录</h3>
        <span class="text-[11px] text-gray-500 dark:text-gray-400">共 {{ importSnapshots.length }} 条</span>
      </div>

      <!-- 空状态 -->
      <div v-if="importSnapshots.length === 0" class="p-10 text-center">
        <Inbox :size="28" class="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p class="text-xs text-gray-500 dark:text-gray-400">暂无导入记录</p>
        <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">在上方选择文件或粘贴数据后点「导入预览」</p>
      </div>

      <!-- 表格 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead class="bg-gray-50 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400">
            <tr>
              <th class="px-3 py-2 text-left font-medium">时间</th>
              <th class="px-3 py-2 text-left font-medium">来源格式</th>
              <th class="px-3 py-2 text-left font-medium">备注</th>
              <th class="px-3 py-2 text-right font-medium">标签数</th>
              <th class="px-3 py-2 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
            <tr
              v-for="s in importSnapshots"
              :key="s.id"
              :class="['hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors', highlightId === s.id ? 'bg-blue-50 dark:bg-blue-900/20' : '']"
            >
              <td class="px-3 py-2 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {{ formatRelative(s.createdAt) }}
              </td>
              <td class="px-3 py-2">
                <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  {{ importFormatLabel(s) }}
                </span>
              </td>
              <td class="px-3 py-2 text-gray-700 dark:text-gray-200">
                <span v-if="s.label" class="truncate max-w-[160px] inline-block align-bottom" :title="s.label">{{ s.label }}</span>
                <span v-else class="text-gray-400 dark:text-gray-500">--</span>
              </td>
              <td class="px-3 py-2 text-right text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {{ s.stats.tabCount }}
              </td>
              <td class="px-3 py-2 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    :disabled="restoringId === s.id"
                    class="inline-flex items-center gap-0.5 min-h-[28px] px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    @click="onOpenRecord(s.id, false)"
                  >本窗口</button>
                  <button
                    type="button"
                    :disabled="restoringId === s.id"
                    class="inline-flex items-center gap-0.5 min-h-[28px] px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    @click="onOpenRecord(s.id, true)"
                  >新窗口</button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-0.5 min-h-[28px] px-2 py-1 text-[11px] rounded border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    @click="onDeleteRecord(s)"
                  >删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 还原中遮罩 -->
    <Teleport to="body">
      <div
        v-if="restoringId !== null || opening"
        class="fixed inset-0 z-[130] bg-black/30 flex items-center justify-center"
        aria-live="polite"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl px-5 py-3 flex items-center gap-2 text-xs">
          <svg class="animate-spin h-4 w-4 text-blue-600 motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          <span class="text-gray-700 dark:text-gray-200">正在打开标签…</span>
        </div>
      </div>
    </Teleport>

    <!-- 删除二次确认 -->
    <ConfirmDialog
      :open="deleteConfirm.open"
      title="删除此导入记录？"
      message="删除后 30 秒内可撤销，超时无法恢复。"
      confirm-text="删除"
      danger
      @confirm="onConfirmDelete"
      @cancel="deleteConfirm.open = false"
    />

    <!-- 撤销删除 toast（30s 倒计时） -->
    <Teleport to="body">
      <div
        v-if="undoInfo.show"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded shadow-lg flex items-center gap-3 max-w-[90vw]"
      >
        <span>已删除导入记录</span>
        <button
          class="px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="onUndoDelete"
        >撤销（{{ undoInfo.remainSec }}s）</button>
      </div>
    </Teleport>

    <!-- 底部广告位 728×90（独立 ErrorBoundary 降级，崩不波及其它） -->
    <ErrorBoundary scope="backup.ad.import">
      <AdSlot
        slot-id="backup-import-bottom"
        size="728x90"
        :ad="getAd('backup-import')"
        :dismissible="true"
        fallback="placeholder"
      />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
/**
 * 导入管理菜单（§8.7）。
 * - 导入区：格式选 + 来源（选文件/粘贴 JSON）+ 内容框 + [导入预览]
 * - 预览区：parseImport 解析后展示标签列表（勾选）+ [本窗口打开][新窗口打开][确认导入到备份列表]
 * - 导入记录：svc.snapshots 过滤 source='import'，操作（本窗口/新窗口打开/删除）
 * 复用：
 * - lib/backup/importers 的 parseImport / readFileText（嗅探 + 解析）
 * - svc.appendImportedSnapshot（写入 IDB 作为 source='import' 备份）
 * - svc.deleteSnapshot + undoDelete（软删 30s 撤销，与备份列表一致）
 * - useBackupRestore.openSnapshot（导入记录的本窗口/新窗口打开）
 * 预览区「本窗口/新窗口打开」为轻量内联实现（不走 IDB，不写回元数据）：
 * 仅打开 URL，元数据写回需先「确认导入到备份列表」后在备份列表里走还原流程。
 */
import { ref, reactive, computed, onUnmounted } from 'vue'
import { FileUp, Clipboard, Search, ExternalLink, SquareArrowOutUpRight, Check, Inbox } from '@lucide/vue'
import ConfirmDialog from '~components/ConfirmDialog.vue'
import ErrorBoundary from '~components/ErrorBoundary.vue'
import AdSlot from './AdSlot.vue'
import TabSelectPanel from '~components/backup/TabSelectPanel.vue'
import { useBackupService } from '~composables/useBackupService'
import { useBackupRestore } from '~composables/useBackupRestore'
import { useBackupPageAd } from '~composables/useBackupPageAd'
import { showToast } from '~composables/useToast'
import { parseImport, readFileText } from '~lib/backup/importers'
import { openTabs } from '~lib/backup/openTabs'
import type { BackupFile, SnapshotSummary } from '~types/backup'

const emit = defineEmits<{
  (e: 'imported', snapshotId: string): void
}>()

const svc = useBackupService()
const restoreSvc = useBackupRestore()
// 广告多槽位：取导入底位广告（backup-import），adMap 由 backup.vue onMounted 单例 fetchAd 拉取
const { getAd } = useBackupPageAd()

// ===== 格式选项 =====
type ImportFormat = 'auto' | 'ours' | 'onetab' | 'nicetab' | 'toby' | 'vertitab'

const FORMAT_OPTIONS: { value: ImportFormat; label: string }[] = [
  { value: 'ours', label: '本插件数据' },
  { value: 'onetab', label: 'OneTab' },
  { value: 'nicetab', label: 'Nice-Tab' },
  { value: 'toby', label: 'Toby' },
  { value: 'vertitab', label: 'VertiTab' },
]

const FORMAT_LABEL_MAP: Record<string, string> = {
  ours: '本插件数据',
  onetab: 'OneTab',
  nicetab: 'Nice-Tab',
  toby: 'Toby',
  vertitab: 'VertiTab',
  unknown: '未识别',
}

const format = ref<ImportFormat>('ours')

// ===== 来源模式 =====
type SourceMode = 'file' | 'paste'
const sourceMode = ref<SourceMode>('file')
const content = ref('')
const fileName = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function onSwitchSource(mode: SourceMode) {
  sourceMode.value = mode
  // 切换不清空内容，让用户在两种来源间对照
}

function onPickFile() {
  fileInputRef.value?.click()
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  fileName.value = file.name
  try {
    const text = await readFileText(file)
    content.value = text
  } catch (err) {
    console.warn('[BackupImportTab] 读取文件失败', err)
    showToast('读取文件失败')
  }
  // 重置 input value 让同一文件可重选
  input.value = ''
}

function onClearContent() {
  content.value = ''
  fileName.value = null
  previewFile.value = null
  previewError.value = null
}

// ===== 预览 =====
const previewLoading = ref(false)
const previewFile = ref<BackupFile | null>(null)
const previewError = ref<string | null>(null)
const detectedFormat = ref<string>('')
const selectedFps = ref<Set<string>>(new Set())

async function onPreview() {
  const text = content.value.trim()
  if (!text) {
    previewError.value = '请先选择文件或粘贴数据'
    return
  }
  previewLoading.value = true
  previewError.value = null
  try {
    const r = await parseImport(text)
    if (!r.ok || !r.file) {
      previewError.value = r.error || '解析失败，请检查格式'
      previewFile.value = null
      return
    }
    // 格式不匹配提示（仅软提示，不阻断）
    if (format.value !== 'auto' && r.format !== format.value && r.format !== 'unknown') {
      showToast(`所选格式为 ${FORMAT_LABEL_MAP[format.value]}，识别为 ${FORMAT_LABEL_MAP[r.format]}，按识别结果预览`)
    }
    previewFile.value = r.file
    detectedFormat.value = r.format
    // 默认全选非隐身窗口的标签
    const fps = new Set<string>()
    for (const w of r.file.snapshot.windows) {
      if (w.incognito) continue
      for (const t of w.tabs) fps.add(t.fingerprint)
    }
    selectedFps.value = fps
  } catch (err) {
    console.warn('[BackupImportTab] 预览失败', err)
    previewError.value = err instanceof Error ? err.message : '解析失败'
    previewFile.value = null
  } finally {
    previewLoading.value = false
  }
}

function onClearPreview() {
  previewFile.value = null
  previewError.value = null
  selectedFps.value = new Set()
}

const detectedFormatLabel = computed(() => {
  if (!detectedFormat.value) return ''
  return FORMAT_LABEL_MAP[detectedFormat.value] || detectedFormat.value
})

// ===== 预览标签视图（按窗口分组，仅非隐身）喂给 TabSelectPanel =====
interface PreviewTabItem {
  fingerprint: string
  title: string
  url: string
  domain: string
}

interface PreviewWindowGroup {
  windowId: number
  tabs: PreviewTabItem[]
}

const previewWindowGroups = computed<PreviewWindowGroup[]>(() => {
  const f = previewFile.value
  if (!f) return []
  const groups: PreviewWindowGroup[] = []
  for (const w of f.snapshot.windows) {
    if (w.incognito) continue
    const tabs: PreviewTabItem[] = w.tabs.map((t) => ({
      fingerprint: t.fingerprint,
      title: t.title || '',
      url: t.url || '',
      domain: safeDomain(t.url),
    }))
    if (tabs.length > 0) {
      groups.push({ windowId: w.windowId, tabs })
    }
  }
  return groups
})

const selectedCount = computed(() => selectedFps.value.size)

const previewSummaryText = computed(() => {
  const f = previewFile.value
  if (!f) return ''
  const s = f.snapshot.stats
  const parts: string[] = [`${s.tabCount} 标签`]
  if (s.laterCount > 0) parts.push(`${s.laterCount} 稍后`)
  if (s.taggedCount > 0) parts.push(`${s.taggedCount} 标记`)
  if (s.windowCount > 0) parts.push(`${s.windowCount} 窗口`)
  return parts.join(' · ')
})

// ===== 预览区：本窗口/新窗口打开（轻量内联实现，不走 IDB，不写回元数据） =====
const opening = ref(false)
const openHint = ref<string>('')

async function onOpenSelected(openInNewWindow: boolean) {
  const f = previewFile.value
  if (!f || selectedCount.value === 0) return
  if (opening.value) return
  opening.value = true
  openHint.value = ''
  try {
    // 快照 windows → openTabs 的 windows 分组（跳过隐身窗口，按 fingerprint 过滤选中项）
    const fps = new Set(selectedFps.value)
    const windows: { tabs: { url: string; pinned?: boolean }[]; focused?: boolean }[] = []
    let firstFocused = true
    for (const w of f.snapshot.windows) {
      if (w.incognito) continue
      const tabs = w.tabs
        .filter((t) => fps.has(t.fingerprint))
        .map((t) => ({ url: t.url, pinned: t.pinned }))
      if (tabs.length > 0) {
        windows.push({ tabs, focused: firstFocused })
        firstFocused = false
      }
    }
    const count = await openTabs({
      windows,
      openInNewWindow,
      skipDuplicateUrls: true,
    })
    openHint.value = count > 0 ? `已打开 ${count} 个标签` : '选中的标签都已打开，无需重复打开'
    if (count > 0) showToast(`已打开 ${count} 个标签`)
  } catch (err) {
    console.warn('[BackupImportTab] 打开失败', err)
    showToast('打开失败，请重试')
  } finally {
    opening.value = false
  }
}

// ===== 确认导入到备份列表 =====
const importing = ref(false)

async function onConfirmImport() {
  const f = previewFile.value
  if (!f || importing.value) return
  importing.value = true
  try {
    // 把嗅探到的格式编码到 trigger（source 已是 'import'，trigger 原为 'import'）
    // trigger 是自由字符串，不影响备份列表展示（列表按 source 取色标）
    // 格式: 'import:<format>'，导入记录列表据此显示来源格式
    const formatTag = detectedFormat.value || 'unknown'
    f.snapshot.trigger = `import:${formatTag}`
    await svc.appendImportedSnapshot(f)
    const newId = f.snapshot.id
    showToast(`已导入 ${f.snapshot.stats.tabCount} 个标签到备份列表`)
    // 清预览
    previewFile.value = null
    selectedFps.value = new Set()
    content.value = ''
    fileName.value = null
    // 通知父组件：跳备份列表 Tab + 高亮新记录
    emit('imported', newId)
  } catch (err) {
    console.warn('[BackupImportTab] 导入失败', err)
    showToast('导入失败，请重试')
  } finally {
    importing.value = false
  }
}

// ===== 导入记录列表 =====
const importSnapshots = computed<SnapshotSummary[]>(() => {
  return svc.snapshots.value
    .filter((s) => s.source === 'import')
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
})

// 高亮新导入记录（父组件传入）
const highlightId = ref<string | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | null = null

function highlightRecord(id: string) {
  highlightId.value = id
  if (highlightTimer) clearTimeout(highlightTimer)
  highlightTimer = setTimeout(() => {
    highlightId.value = null
  }, 3000)
}

onUnmounted(() => {
  if (highlightTimer) clearTimeout(highlightTimer)
})

function importFormatLabel(s: SnapshotSummary): string {
  // trigger 格式: 'import:<format>' 或旧版 'import' / null
  const trigger = s.trigger
  if (!trigger) return '导入'
  if (trigger.startsWith('import:')) {
    const fmt = trigger.slice('import:'.length)
    return FORMAT_LABEL_MAP[fmt] || fmt
  }
  return '导入'
}

// ===== 导入记录操作：本窗口/新窗口打开（走 restoreSvc，含元数据写回） =====
const restoringId = ref<string | null>(null)

async function onOpenRecord(snapshotId: string, openInNewWindow: boolean) {
  if (restoringId.value) return
  restoringId.value = snapshotId
  try {
    const r = await restoreSvc.openSnapshot(snapshotId, openInNewWindow ? 'newWindow' : 'current')
    if (r.ok) {
      const metaBits: string[] = []
      if (r.metaResult) {
        if (r.metaResult.tabTagsRestored > 0) metaBits.push(`标记 ${r.metaResult.tabTagsRestored}`)
        if (r.metaResult.laterTabsMerged > 0) metaBits.push(`稍后 ${r.metaResult.laterTabsMerged}`)
        if (r.metaResult.groupsRestored > 0) metaBits.push(`分组 ${r.metaResult.groupsRestored}`)
      }
      const metaSuffix = metaBits.length > 0 ? `（已恢复 ${metaBits.join(' / ')}）` : ''
      showToast(`已打开 ${r.openedCount} 个标签${metaSuffix}`)
    } else {
      showToast(r.error || '打开失败')
    }
  } finally {
    restoringId.value = null
  }
}

// ===== 导入记录删除（软删 30s 撤销，与备份列表一致） =====
const UNDO_WINDOW_MS = 30_000
const deleteConfirm = reactive<{ open: boolean; id: string | null }>({
  open: false,
  id: null,
})
const undoInfo = reactive<{ show: boolean; remainSec: number; id: string | null }>({
  show: false,
  remainSec: 30,
  id: null,
})
let undoTimer: ReturnType<typeof setInterval> | null = null

function onDeleteRecord(s: SnapshotSummary) {
  deleteConfirm.id = s.id
  deleteConfirm.open = true
}

async function onConfirmDelete() {
  const id = deleteConfirm.id
  deleteConfirm.open = false
  deleteConfirm.id = null
  if (!id) return
  const ok = await svc.deleteSnapshot(id)
  if (!ok) {
    showToast('删除失败')
    return
  }
  showToast('已删除')
  undoInfo.id = id
  undoInfo.remainSec = Math.floor(UNDO_WINDOW_MS / 1000)
  undoInfo.show = true
  if (undoTimer) clearInterval(undoTimer)
  undoTimer = setInterval(() => {
    undoInfo.remainSec--
    if (undoInfo.remainSec <= 0) {
      undoInfo.show = false
      undoInfo.id = null
      if (undoTimer) {
        clearInterval(undoTimer)
        undoTimer = null
      }
    }
  }, 1000)
}

async function onUndoDelete() {
  if (!undoInfo.id) return
  const ok = await svc.undoDelete()
  if (ok) {
    showToast('已撤销删除')
  } else {
    showToast('撤销失败')
  }
  undoInfo.show = false
  undoInfo.id = null
  if (undoTimer) {
    clearInterval(undoTimer)
    undoTimer = null
  }
}

onUnmounted(() => {
  if (undoTimer) clearInterval(undoTimer)
})

// ===== 工具函数 =====
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

// 暴露给父组件：高亮新导入的记录
defineExpose({
  highlightRecord,
})
</script>
