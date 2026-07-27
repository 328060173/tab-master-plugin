<template>
  <!--
    导出弹框（设计稿 §3.4 / §8.8）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    2 种去向：下载到文件夹（showSaveFilePicker 或降级 <a download>）/ 展示 JSON 串。
    复用 lib/backup/exporters.ts（exportByFormat + downloadExportWithPicker）。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
          <h2 id="export-dialog-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
            导出备份<span v-if="snapshotLabel"> · {{ snapshotLabel }}</span>
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="px-5 pb-5 space-y-4 overflow-y-auto">
          <!-- 快照选择（概览导出无上下文快照时显示） -->
          <div v-if="needSelectSnapshot" class="space-y-1.5">
            <label class="text-xs font-medium text-gray-700 dark:text-gray-200">选择备份</label>
            <select
              v-model="selectedSnapshotId"
              class="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null" disabled>请选择要导出的备份…</option>
              <option v-for="s in snapshotOptions" :key="s.id" :value="s.id">
                {{ formatSnapshotOption(s) }}
              </option>
            </select>
            <p v-if="snapshotOptions.length === 0" class="text-[11px] text-gray-400 dark:text-gray-500">暂无备份可导出，请先创建备份</p>
          </div>

          <!-- 格式 -->
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-700 dark:text-gray-200">导出格式</label>
            <div class="flex items-center gap-2 text-xs">
              <select
                v-model="format"
                class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="opt in FORMAT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ formatHint }}</span>
            </div>
          </div>

          <!-- 去向 -->
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-700 dark:text-gray-200">导出去向</label>
            <div class="space-y-1.5">
              <label class="flex items-start gap-2 cursor-pointer text-xs p-2 rounded border transition-colors"
                :class="destination === 'download' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'"
              >
                <input
                  type="radio"
                  v-model="destination"
                  value="download"
                  class="mt-0.5"
                />
                <div class="flex-1">
                  <p class="text-gray-800 dark:text-gray-100">下载到文件夹</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">选择保存位置（推荐）；不支持的浏览器直接下载到默认目录</p>
                </div>
              </label>
              <label class="flex items-start gap-2 cursor-pointer text-xs p-2 rounded border transition-colors"
                :class="destination === 'display' ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-700' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'"
              >
                <input
                  type="radio"
                  v-model="destination"
                  value="display"
                  class="mt-0.5"
                />
                <div class="flex-1">
                  <p class="text-gray-800 dark:text-gray-100">展示 JSON 串</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">弹框显示完整 JSON 可复制，不落地文件</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- 操作行 -->
        <div class="flex gap-2 justify-end px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-700 shrink-0">
          <button
            class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >取消</button>
          <button
            :disabled="exporting"
            class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onExport"
          >{{ primaryBtnText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 导出弹框（设计稿 §3.4 / §8.8）。
 * - 格式：JSON / Markdown / OneTab（复用 exportByFormat）
 * - 去向：下载到文件夹（downloadExportWithPicker）/ 展示 JSON 串（emit display-json）
 * - 下载完成 toast；展示 JSON 串由父组件再弹一个查看框（或复用详情弹框的 JSON 视图）
 */
import { ref, watch, computed } from 'vue'
import { X } from '@lucide/vue'
import { exportByFormat, downloadExportWithPicker } from '~lib/backup/exporters'
import { useBackupService } from '~composables/useBackupService'
import { showToast } from '~composables/useToast'
import type { BackupFile, ExportFormat } from '~types/backup'

const props = defineProps<{
  open: boolean
  snapshotId: string | null
  snapshotLabel?: string | null
}>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'display-json', content: string, label: string | null): void
}>()

const svc = useBackupService()

/** 概览导出无上下文快照（snapshotId=null）时需让用户选哪个备份导出 */
const needSelectSnapshot = computed(() => !props.snapshotId)
const selectedSnapshotId = ref<string | null>(null)
const snapshotOptions = computed(() => svc.snapshots.value)
const effectiveSnapshotId = computed(() => props.snapshotId ?? selectedSnapshotId.value)
const effectiveLabel = computed(() => {
  if (props.snapshotId) return props.snapshotLabel ?? null
  const s = snapshotOptions.value.find((x) => x.id === selectedSnapshotId.value)
  return s?.label ?? null
})

function formatSnapshotOption(s: { id: string; createdAt: number; label: string | null; stats: { tabCount: number } }): string {
  const d = new Date(s.createdAt)
  const p = (n: number) => String(n).padStart(2, '0')
  const time = `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
  const label = s.label ? ` · ${s.label}` : ''
  return `${time} · ${s.stats.tabCount} 标签${label}`
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'json', label: 'JSON（完整，可回导入）' },
  { value: 'markdown', label: 'Markdown（人类可读）' },
  { value: 'onetab', label: 'OneTab（仅 URL）' },
]

const format = ref<ExportFormat>('json')
const destination = ref<'download' | 'display'>('download')
const exporting = ref(false)

// 打开时重置默认值
watch(() => props.open, (v) => {
  if (v) {
    format.value = 'json'
    destination.value = 'download'
    exporting.value = false
    // 概览导出：默认选最新一条（若有）
    selectedSnapshotId.value = snapshotOptions.value[0]?.id ?? null
  }
})

const formatHint = computed(() => {
  switch (format.value) {
    case 'json': return '完整备份，可重新导入还原'
    case 'markdown': return '人类可读，不可回导入'
    case 'onetab': return '仅 URL 列表，兼容 OneTab'
    default: return ''
  }
})

/** 主按钮文案：下载=「导出」；展示JSON串=「查看 JSON 串」（不是导出文件，是查看） */
const primaryBtnText = computed(() => {
  if (exporting.value) return '导出中…'
  return destination.value === 'display' ? '查看 JSON 串' : '导出'
})

async function onExport() {
  if (exporting.value) return
  const id = effectiveSnapshotId.value
  if (!id) {
    showToast('未选定备份')
    return
  }
  exporting.value = true
  try {
    const file: BackupFile | null = await svc.getSnapshotFile(id)
    if (!file) {
      showToast('备份不存在')
      return
    }
    const out = exportByFormat(file, format.value)
    if (destination.value === 'display') {
      // 展示 JSON 串（无论 format 是什么，display 总是展示 JSON；其他格式意义不大，强制 JSON）
      const jsonContent = format.value === 'json' ? out.content : JSON.stringify(file, null, 2)
      emit('display-json', jsonContent, effectiveLabel.value)
      emit('cancel')
      return
    }
    // 下载到文件夹
    const r = await downloadExportWithPicker(out)
    if (r.ok) {
      showToast(r.fallback ? '已下载到默认目录' : '已导出到所选位置')
      emit('cancel')
    } else if (r.error && r.error !== '用户取消') {
      showToast(r.error || '导出失败')
    }
  } catch (e) {
    console.warn('[ExportDialog] 导出失败', e)
    showToast('导出失败，请重试')
  } finally {
    exporting.value = false
  }
}

function onCancel() {
  emit('cancel')
}
</script>
