<template>
  <!--
    导入弹框（备份概览用，§3.4）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    定位：备份概览里完成「我们自己的 JSON」导入，不跳页面。
    流程：选文件 / 粘贴 JSON → 自动解析预览（标签列表勾选）→ 导入到备份列表 / 立即打开。
    底部小字「其他格式导入 →」跳导入管理菜单（OneTab/Nice-Tab/Toby/VertiTab/粘贴文本）。
    复用：lib/backup/importers.parseImport（嗅探，命中 ours）+ svc.appendImportedSnapshot + openTabsFromMemory。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-dialog-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
          <h2 id="import-dialog-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
            导入备份
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="px-5 pb-5 flex-1 overflow-y-auto space-y-3">
          <!-- 来源切换 -->
          <div class="flex items-center gap-2 flex-wrap text-xs">
            <button
              type="button"
              :class="[
                'inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
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
                'inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1.5 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                sourceMode === 'paste'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                  : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
              ]"
              @click="onSwitchSource('paste')"
            >
              <Clipboard :size="12" />
              粘贴 JSON
            </button>
            <span v-if="fileName" class="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[200px]" :title="fileName">
              {{ fileName }}
            </span>
            <input
              v-if="sourceMode === 'file'"
              ref="fileInputRef"
              type="file"
              accept=".json,.txt"
              class="hidden"
              @change="onFileChange"
            />
          </div>

          <!-- 内容框 -->
          <textarea
            v-model="content"
            class="w-full min-h-[100px] max-h-[200px] border border-gray-200 dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-900/40 text-[11px] font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            :placeholder="sourceMode === 'file' ? '点上方「选择文件」加载备份文件…' : '粘贴本插件导出的 JSON 串到这里…'"
            aria-label="导入内容"
          ></textarea>

          <!-- 操作行：解析 / 清空 -->
          <div class="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              :disabled="previewLoading || !content.trim()"
              class="inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="onPreview"
            >
              <Search :size="12" />
              {{ previewLoading ? '解析中…' : '解析预览' }}
            </button>
            <button
              v-if="content || previewFile"
              type="button"
              class="inline-flex items-center gap-1.5 min-h-[32px] px-2 py-1.5 text-[11px] rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onClear"
            >清空</button>
            <span v-if="previewError" class="text-[11px] text-red-600 dark:text-red-400">{{ previewError }}</span>
          </div>

          <!-- 预览区 -->
          <div
            v-if="previewFile"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-gray-900 dark:text-gray-100">
                预览<span v-if="detectedFormatLabel" class="text-[11px] text-gray-500 dark:text-gray-400 font-normal ml-1">· {{ detectedFormatLabel }}</span>
              </span>
              <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ previewSummaryText }}</span>
            </div>

            <!-- 全选 + 计数 -->
            <div class="flex items-center gap-2 text-xs">
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

            <!-- 标签列表（按窗口分组，仅非隐身） -->
            <div class="max-h-[220px] overflow-y-auto border border-gray-100 dark:border-gray-700 rounded">
              <div
                v-for="(g, idx) in previewWindowGroups"
                :key="idx"
                class="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
              >
                <div class="flex items-center gap-2 px-2 py-1 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 sticky top-0">
                  <label class="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="isWindowAllSelected(g)"
                      :indeterminate.prop="isWindowSomeSelected(g)"
                      @change="onToggleWindow(g)"
                    />
                    <span>窗口{{ idx + 1 }}（{{ g.tabs.length }} 个标签）</span>
                  </label>
                </div>
                <ul class="divide-y divide-gray-50 dark:divide-gray-700/50">
                  <li
                    v-for="tab in g.tabs"
                    :key="tab.fingerprint"
                  >
                    <label class="flex items-center gap-2 px-2 py-1 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40">
                      <input
                        type="checkbox"
                        :checked="selectedFps.has(tab.fingerprint)"
                        @change="onToggleTab(tab.fingerprint)"
                      />
                      <span class="flex-1 min-w-0 truncate text-gray-800 dark:text-gray-100">{{ tab.title || '(无标题)' }}</span>
                      <span class="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 truncate max-w-[140px]" :title="tab.url">{{ tab.domain }}</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div v-if="previewWindowGroups.length === 0" class="py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                无可预览的标签（已自动跳过隐身窗口）
              </div>
            </div>
          </div>
        </div>

        <!-- 操作行 -->
        <div class="flex items-center gap-2 justify-end px-5 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700 shrink-0 flex-wrap">
          <!-- 预览后次操作：立即打开（不写备份列表） -->
          <button
            v-if="previewFile"
            type="button"
            :disabled="selectedCount === 0 || opening || importing"
            class="inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onOpenSelected(false)"
          >本窗口打开</button>
          <button
            v-if="previewFile"
            type="button"
            :disabled="selectedCount === 0 || opening || importing"
            class="inline-flex items-center gap-1 min-h-[36px] px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onOpenSelected(true)"
          >新窗口打开</button>
          <button
            type="button"
            class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >取消</button>
          <button
            :disabled="!previewFile || selectedCount === 0 || importing || opening"
            class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onConfirmImport"
          >{{ importing ? '导入中…' : '导入到备份列表' }}</button>
        </div>

        <!-- 底部：其他格式导入入口 -->
        <div class="px-5 pb-4 -mt-1 shrink-0">
          <button
            type="button"
            class="text-[11px] text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            @click="emit('other-formats')"
          >其他格式导入（OneTab / Nice-Tab / Toby / VertiTab）→</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 导入弹框（备份概览用）。
 * 完成我们自己的 JSON 导入：选文件/粘贴 → 解析预览 → 导入到备份列表 / 立即打开。
 * 底部「其他格式导入」emit('other-formats') 由父组件跳导入管理菜单。
 * 复用 parseImport（自动嗅探，命中 ours）+ svc.appendImportedSnapshot + openTabsFromMemory。
 */
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { X, FileUp, Clipboard, Search } from '@lucide/vue'
import { useBackupService } from '~composables/useBackupService'
import { showToast } from '~composables/useToast'
import { parseImport, readFileText } from '~lib/backup/importers'
import { openTabsFromMemory } from '~lib/backup/openFromMemory'
import type { BackupFile } from '~types/backup'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'imported', snapshotId: string): void
  (e: 'other-formats'): void
}>()

const svc = useBackupService()

type SourceMode = 'file' | 'paste'
const sourceMode = ref<SourceMode>('file')
const content = ref('')
const fileName = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// 打开时重置
watch(() => props.open, (v) => {
  if (v) {
    sourceMode.value = 'file'
    content.value = ''
    fileName.value = null
    previewFile.value = null
    previewError.value = null
    selectedFps.clear()
  }
})

function onSwitchSource(mode: SourceMode) {
  sourceMode.value = mode
  // 切到 file 模式直接弹文件框（一步到位，少一次点击）
  if (mode === 'file') {
    void nextTick(() => fileInputRef.value?.click())
  }
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
    // 选完文件自动解析预览（减少一步操作）
    void onPreview()
  } catch (err) {
    console.warn('[ImportDialog] 读取文件失败', err)
    showToast('读取文件失败')
  }
  input.value = ''
}

function onClear() {
  content.value = ''
  fileName.value = null
  previewFile.value = null
  previewError.value = null
  selectedFps.clear()
}

// ===== 预览 =====
const previewLoading = ref(false)
const previewFile = ref<BackupFile | null>(null)
const previewError = ref<string | null>(null)
const detectedFormat = ref<string>('')
const selectedFps = reactive<Set<string>>(new Set())

const FORMAT_LABEL_MAP: Record<string, string> = {
  ours: '本插件 JSON',
  onetab: 'OneTab',
  nicetab: 'Nice-Tab',
  toby: 'Toby',
  vertitab: 'VertiTab',
  unknown: '未识别',
}

async function onPreview() {
  const text = content.value.trim()
  if (!text) {
    previewError.value = '请先选择文件或粘贴 JSON 串'
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
    // 非本插件格式软提示（概览主推我们 JSON；其他格式引导去导入管理）
    if (r.format !== 'ours' && r.format !== 'unknown') {
      showToast(`识别为 ${FORMAT_LABEL_MAP[r.format]}，可继续导入；如需更多格式选项点底部「其他格式导入」`)
    }
    previewFile.value = r.file
    detectedFormat.value = r.format
    selectedFps.clear()
    for (const w of r.file.snapshot.windows) {
      if (w.incognito) continue
      for (const t of w.tabs) selectedFps.add(t.fingerprint)
    }
  } catch (err) {
    console.warn('[ImportDialog] 预览失败', err)
    previewError.value = err instanceof Error ? err.message : '解析失败'
    previewFile.value = null
  } finally {
    previewLoading.value = false
  }
}

const detectedFormatLabel = computed(() => {
  if (!detectedFormat.value) return ''
  return FORMAT_LABEL_MAP[detectedFormat.value] || detectedFormat.value
})

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
    if (tabs.length > 0) groups.push({ windowId: w.windowId, tabs })
  }
  return groups
})

const totalCount = computed(() => previewWindowGroups.value.reduce((n, g) => n + g.tabs.length, 0))
const selectedCount = computed(() => selectedFps.size)
const allSelected = computed(() => totalCount.value > 0 && selectedFps.size === totalCount.value)
const someSelected = computed(() => selectedFps.size > 0)

const previewSummaryText = computed(() => {
  const f = previewFile.value
  if (!f) return ''
  const s = f.snapshot.stats
  const parts: string[] = [`${s.tabCount} 标签`]
  if (s.windowCount > 0) parts.push(`${s.windowCount} 窗口`)
  return parts.join(' · ')
})

function onToggleAll() {
  if (allSelected.value) {
    selectedFps.clear()
  } else {
    selectedFps.clear()
    for (const g of previewWindowGroups.value) {
      for (const t of g.tabs) selectedFps.add(t.fingerprint)
    }
  }
}
function onToggleTab(fp: string) {
  if (selectedFps.has(fp)) selectedFps.delete(fp)
  else selectedFps.add(fp)
}
function isWindowAllSelected(g: PreviewWindowGroup): boolean {
  return g.tabs.length > 0 && g.tabs.every((t) => selectedFps.has(t.fingerprint))
}
function isWindowSomeSelected(g: PreviewWindowGroup): boolean {
  const sel = g.tabs.filter((t) => selectedFps.has(t.fingerprint)).length
  return sel > 0 && sel < g.tabs.length
}
function onToggleWindow(g: PreviewWindowGroup) {
  if (isWindowAllSelected(g)) {
    for (const t of g.tabs) selectedFps.delete(t.fingerprint)
  } else {
    for (const t of g.tabs) selectedFps.add(t.fingerprint)
  }
}

// ===== 立即打开（不写备份列表，仅创建浏览器标签） =====
const opening = ref(false)
async function onOpenSelected(openInNewWindow: boolean) {
  const f = previewFile.value
  if (!f || selectedCount.value === 0 || opening.value) return
  opening.value = true
  try {
    const count = await openTabsFromMemory(f, new Set(selectedFps), openInNewWindow)
    if (count > 0) showToast(`已打开 ${count} 个标签`)
    else showToast('选中的标签都已打开，无需重复打开')
  } catch (err) {
    console.warn('[ImportDialog] 打开失败', err)
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
    const formatTag = detectedFormat.value || 'unknown'
    f.snapshot.trigger = `import:${formatTag}`
    await svc.appendImportedSnapshot(f)
    const newId = f.snapshot.id
    showToast(`已导入 ${f.snapshot.stats.tabCount} 个标签到备份列表`)
    emit('imported', newId)
  } catch (err) {
    console.warn('[ImportDialog] 导入失败', err)
    showToast('导入失败，请重试')
  } finally {
    importing.value = false
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

// 暴露 onPickFile 给模板（sourceMode=file 时点「选择文件」按钮触发）
defineExpose({ onPickFile })
</script>
