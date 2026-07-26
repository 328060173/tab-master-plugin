<template>
  <!--
    Tab3 导入导出 - PRD §4.1 / §5.5
    单根。主内容：导出/导入主操作按钮 + 格式 select 下拉；次要：拖拽区 + OneTab 文本粘贴。
  -->
  <div class="space-y-4">
    <!-- 导出 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <Download :size="14" class="text-blue-600 dark:text-blue-400" />
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">导出备份</p>
      </div>
      <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300 mb-3">从快照列表选择一条，选择格式后导出文件。</p>
      <div class="flex items-center gap-2 flex-wrap">
        <select
          v-model="exportSnapshotId"
          class="text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 flex-1 min-w-[180px]"
        >
          <option value="">— 选择快照 —</option>
          <option v-for="s in snapshots" :key="s.id" :value="s.id">
            {{ fmtFull(s.createdAt) }} · {{ s.stats.tabCount }} 标签
          </option>
        </select>
        <select
          v-model="exportFormat"
          class="text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800"
          title="选择导出格式"
        >
          <option value="json">我们自己的 JSON（默认 · 完整）</option>
          <option value="markdown">Markdown（人类可读 · 不可回导入）</option>
          <option value="onetab">OneTab 兼容（仅 URL 列表）</option>
        </select>
        <button
          :disabled="!exportSnapshotId || isExporting"
          class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          @click="onExport"
        >导出</button>
      </div>
      <p class="text-[11px] text-gray-500 dark:text-gray-300 mt-2">
        JSON 含完整元数据（标记/分组/稍后/关闭历史/设置）；Markdown 人类可读不可回导入；OneTab 仅 URL+标题（与 OneTab 原生一致）。
      </p>
    </div>

    <!-- 导入 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <Upload :size="14" class="text-blue-600 dark:text-blue-400" />
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">导入备份</p>
      </div>
      <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300 mb-3">
        支持本插件 JSON / OneTab / NiceTab / Toby / VertiTab；自动嗅探格式。导入后走与"恢复"相同的预览+冲突流程。
      </p>

      <!-- 拖拽区 + 选文件 -->
      <div
        class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
        :class="dragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''"
        @click="onPickFile"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <Upload :size="22" class="mx-auto text-gray-500 dark:text-gray-300 mb-1" />
        <p class="text-xs text-gray-600 dark:text-gray-300">点击或拖拽文件到此处</p>
        <p class="text-xs text-gray-500 dark:text-gray-300 mt-0.5">支持 .json / .txt / .md</p>
        <input
          ref="fileInputEl"
          type="file"
          accept=".json,.txt,.md,application/json,text/plain,text/markdown"
          class="hidden"
          @change="onFileChange"
        />
      </div>

      <!-- OneTab 文本粘贴 -->
      <details class="mt-3">
        <summary class="text-[11px] text-gray-500 cursor-pointer">粘贴 OneTab 文本（每行 `标题 | URL`，空行分隔）</summary>
        <textarea
          v-model="pasteText"
          class="w-full mt-2 text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 font-mono"
          rows="5"
          placeholder="GitHub | https://github.com/foo&#10;Google | https://google.com"
        ></textarea>
        <div class="flex items-center gap-2 mt-2">
          <button
            :disabled="!pasteText.trim() || isImporting"
            class="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            @click="onImportPasteAuto"
          >导入文本（自动嗅探）</button>
          <button
            :disabled="!pasteText.trim() || isImporting"
            class="text-xs px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            @click="onImportPasteOneTab"
          >按 OneTab 解析</button>
        </div>
      </details>

      <!-- 导入结果 -->
      <div v-if="lastImportResult" class="mt-3 text-[11px] p-2 rounded" :class="lastImportResult.ok ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'">
        <p v-if="lastImportResult.ok">
          ✓ 已解析为「{{ formatLabel(lastImportResult.format) }}」格式 · {{ lastImportResult.file?.snapshot.stats.tabCount }} 标签
          <span v-if="lastImportResult.skipped"> · 跳过 {{ lastImportResult.skipped }} 个无效条目</span>
        </p>
        <p v-else>✗ {{ lastImportResult.error }}</p>
        <ul v-if="lastImportResult.warnings.length" class="mt-1 list-disc list-inside text-gray-500">
          <li v-for="(w, i) in lastImportResult.warnings" :key="w + '-' + i">{{ w }}</li>
        </ul>
        <p v-if="lastImportResult.ok" class="mt-1 text-gray-500">导入后请到「恢复与冲突」Tab 选这条导入快照进行恢复。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Tab3 导入导出 - PRD §5.5
 * 导出：JSON / Markdown / OneTab；导入：拖拽 + 选文件 + OneTab 文本粘贴。
 */
import { ref } from "vue"
import { Download, Upload } from "@lucide/vue"
import { useBackupIO } from "~composables/useBackupIO"
import { useBackupService } from "~composables/useBackupService"
import { showToast } from "~composables/useToast"
import type { SnapshotSummary, ExportFormat, ImportResult } from "~types/backup"

const svc = useBackupService()
const { isExporting, isImporting, lastImportResult, exportSnapshot, importFile, importText } = useBackupIO()

const snapshots = svc.snapshots as unknown as { value: SnapshotSummary[] }

const exportSnapshotId = ref("")
const exportFormat = ref<ExportFormat>("json")
const pasteText = ref("")
const dragging = ref(false)
const fileInputEl = ref<HTMLInputElement | null>(null)

async function onExport() {
  if (!exportSnapshotId.value) return
  const r = await exportSnapshot(exportSnapshotId.value, exportFormat.value)
  showToast(r.ok ? "已导出" : r.error || "导出失败")
}

function onPickFile() {
  fileInputEl.value?.click()
}

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const r = await importFile(file)
  showToast(r.ok ? `已导入 ${r.file?.snapshot.stats.tabCount} 标签` : r.error || "导入失败")
  target.value = ""
}

async function onDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  const r = await importFile(file)
  showToast(r.ok ? `已导入 ${r.file?.snapshot.stats.tabCount} 标签` : r.error || "导入失败")
}

async function onImportPasteAuto() {
  if (!pasteText.value.trim()) return
  const r = await importText(pasteText.value, false)
  showToast(r.ok ? `已导入 ${r.file?.snapshot.stats.tabCount} 标签` : r.error || "导入失败")
}

async function onImportPasteOneTab() {
  if (!pasteText.value.trim()) return
  const r = await importText(pasteText.value, true)
  showToast(r.ok ? `已导入 ${r.file?.snapshot.stats.tabCount} 标签` : r.error || "导入失败")
}

function formatLabel(f: ImportResult["format"]): string {
  switch (f) {
    case "ours": return "本插件 JSON"
    case "onetab": return "OneTab"
    case "nicetab": return "NiceTab"
    case "toby": return "Toby"
    case "vertitab": return "VertiTab"
    default: return "未知"
  }
}

function fmtFull(ts: number) {
  try {
    const d = new Date(ts)
    const p = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
  } catch {
    return ""
  }
}
</script>
