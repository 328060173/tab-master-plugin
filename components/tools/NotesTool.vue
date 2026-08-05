<template>
  <div class="flex flex-col gap-2 py-1">
    <!-- 返回 -->
    <button
      type="button"
      class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 self-start px-1 py-0.5"
      @click="emit('back')"
    >
      <ArrowLeft :size="14" />
      {{ t('tools.notes.back') }}
    </button>

    <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-200 px-1">{{ t('tools.notes.title') }}</h2>

    <!-- 功能引导提示 -->
    <p class="text-[11px] text-gray-400 px-1 leading-relaxed">
      {{ t('tools.notes.guide') }}
    </p>

    <!-- 不可关闭的本地存储警示横幅 -->
    <div class="flex items-start gap-2 px-3 py-2.5 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
      <AlertTriangle :size="14" class="mt-0.5 shrink-0" />
      <p class="text-[11px] leading-relaxed">
        {{ t('tools.notes.warning') }}
      </p>
    </div>

    <p class="text-[11px] text-gray-400 px-1">
      {{ tWithParams('tools.notes.fieldLimit', { max: NOTES_MAX_LEN, maxFields: NOTES_MAX_FIELDS }) }}
    </p>

    <!-- 导入 / 导出 -->
    <div class="flex items-center gap-1.5 px-1">
      <button
        type="button"
        class="flex items-center gap-1 px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        @click="onExport"
      >
        <Download :size="12" />
        {{ t('tools.notes.exportBtn') }}
      </button>
      <button
        type="button"
        class="flex items-center gap-1 px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        @click="onPickImport"
      >
        <Upload :size="12" />
        {{ t('tools.notes.importBtn') }}
      </button>
      <input
        ref="fileInputRef"
        type="file"
        accept=".json,application/json"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <!-- 字段列表 -->
    <div class="flex flex-col gap-2">
      <div
        v-for="field in fields"
        :key="field.id"
        class="flex items-center gap-1.5"
      >
        <input
          v-model="field.key"
          type="text"
          :maxlength="NOTES_MAX_LEN"
          :placeholder="t('tools.notes.fieldNamePlaceholder')"
          class="w-24 shrink-0 px-2 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
          @input="scheduleSave"
          @blur="flushSave"
        />
        <input
          v-model="field.value"
          type="text"
          :maxlength="NOTES_MAX_LEN"
          :placeholder="t('tools.notes.contentPlaceholder')"
          class="flex-1 min-w-0 px-2 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
          @input="scheduleSave"
          @blur="flushSave"
        />
        <button
          type="button"
          class="shrink-0 p-1 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          :title="t('tools.notes.copyTitle')"
          @click="onCopyValue(field.value)"
        >
          <Copy :size="14" />
        </button>
        <button
          type="button"
          class="shrink-0 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          :title="t('tools.notes.deleteTitle')"
          @click="removeField(field.id)"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <!-- 添加字段 + 统计 -->
    <div class="flex items-center justify-between pt-1">
      <button
        type="button"
        :disabled="fields.length >= NOTES_MAX_FIELDS"
        class="flex items-center gap-1 px-2.5 py-1 text-xs rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="addField"
      >
        <Plus :size="12" />
        {{ t('tools.notes.addField') }}
      </button>
      <span class="text-[11px] text-gray-400">{{ fields.length }} / {{ NOTES_MAX_FIELDS }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 小便签 —— 本地常用信息速记。
 *
 * - 存 chrome.storage.local（key=tools_notes），无云端。
 * - 首次进入若无记录，种子 6 个默认字段（key 预填、value 空）。
 * - 编辑自动保存（防抖 500ms 或失焦即写），写入用 toPure + safeSet 兜底。
 * - 每行字段可一键复制 value 到剪贴板（填表单粘贴用）。
 * - 支持导入/导出 JSON（导出纯 key/value 数组，导入直接追加，超 50 截断）。
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, AlertTriangle, Plus, Trash2, Copy, Download, Upload } from '@lucide/vue'
import { t, tWithParams } from '~lib/i18n'
import { safeSet } from '~lib/safeStorage'
import { toPure } from '~lib/toPure'
import { uuidV4 } from '~lib/backup/fingerprint'
import { showToast } from '~composables/useToast'
import {
  TOOLS_NOTES_KEY,
  NOTES_MAX_LEN,
  NOTES_MAX_FIELDS,
  NOTES_DEBOUNCE_MS,
  DEFAULT_NOTE_FIELDS,
} from '~lib/tools/constants'
import { notesExportFileName, serializeNotes, parseNotesImport } from '~lib/tools/notesIO'
import type { INoteField } from '~lib/tools/notesTypes'

const emit = defineEmits<{ (e: 'back'): void }>()

const fields = ref<INoteField[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
let saveTimer: ReturnType<typeof setTimeout> | null = null

/** 写入 storage（toPure 转 reactive proxy 为纯值，safeSet 兜底配额/SW 失活） */
const save = () => {
  saveTimer = null
  safeSet({ [TOOLS_NOTES_KEY]: toPure(fields.value) }, 'tools-notes').then(
    () => { /* 静默成功 */ },
    () => showToast(t('tools.notes.saveFailed')),
  )
}

const scheduleSave = () => {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(save, NOTES_DEBOUNCE_MS)
}

const flushSave = () => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    save()
  }
}

const addField = () => {
  if (fields.value.length >= NOTES_MAX_FIELDS) return
  fields.value.push({ id: uuidV4(), key: '', value: '' })
  scheduleSave()
}

const removeField = (id: string) => {
  const idx = fields.value.findIndex((f) => f.id === id)
  if (idx >= 0) {
    fields.value.splice(idx, 1)
    scheduleSave()
  }
}

/** 复制字段 value 到剪贴板 */
const onCopyValue = async (value: string) => {
  if (!value) {
    showToast(t('tools.notes.contentEmpty'))
    return
  }
  try {
    await navigator.clipboard.writeText(value)
    showToast(t('tools.notes.copied'))
  } catch {
    showToast(t('tools.notes.copyFailed'))
  }
}

/** 导出当前字段为 JSON 文件下载（纯 key/value，不含 id） */
const onExport = () => {
  if (fields.value.length === 0) {
    showToast(t('tools.notes.noExportable'))
    return
  }
  let url: string | null = null
  try {
    const blob = new Blob([serializeNotes(fields.value)], { type: 'application/json' })
    url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = notesExportFileName()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    showToast(t('tools.notes.exported'))
  } catch (e) {
    console.warn('[notes] export failed', e)
    showToast(t('tools.notes.exportFailed'))
  } finally {
    if (url) setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}

/** 触发文件选择 */
const onPickImport = () => {
  fileInputRef.value?.click()
}

/** 解析导入的 JSON 文件，直接追加到末尾（不判重），超 50 截断 */
const onFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  // 重置 value 让同一文件可再次选择
  input.value = ''
  if (!file) return

  let entries
  try {
    const text = await file.text()
    entries = parseNotesImport(text)
  } catch {
    showToast(t('tools.notes.fileFormatError'))
    return
  }
  if (entries.length === 0) {
    showToast(t('tools.notes.noValidFields'))
    return
  }

  const incoming: INoteField[] = entries.map((x) => ({ id: uuidV4(), key: x.key, value: x.value }))
  const remaining = NOTES_MAX_FIELDS - fields.value.length
  if (incoming.length > remaining) {
    fields.value.push(...incoming.slice(0, Math.max(0, remaining)))
    showToast(tWithParams('tools.notes.importLimited', { max: NOTES_MAX_FIELDS }))
  } else {
    fields.value.push(...incoming)
    showToast(tWithParams('tools.notes.imported', { count: incoming.length }))
  }
  scheduleSave()
}

onMounted(async () => {
  try {
    const data = await chrome.storage.local.get(TOOLS_NOTES_KEY)
    const raw = data[TOOLS_NOTES_KEY]
    if (Array.isArray(raw)) {
      // 有记录（含用户手动删空的 []）—— 按记录还原，不重新种子
      fields.value = raw
        .filter((x): x is INoteField =>
          !!x && typeof x === 'object' && typeof (x as INoteField).id === 'string' &&
          typeof (x as INoteField).key === 'string' && typeof (x as INoteField).value === 'string'
        )
        .map((x) => ({ id: x.id, key: x.key, value: x.value }))
        .slice(0, NOTES_MAX_FIELDS)
    } else {
      // storage 无任何记录 → 首次进入种子 6 个默认字段（i18n key 翻译为当前语言字段名）
      fields.value = DEFAULT_NOTE_FIELDS.map((k) => ({ id: uuidV4(), key: t(k), value: '' }))
      save()
    }
  } catch {
    showToast(t('tools.notes.loadFailed'))
  }
})

onUnmounted(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    save()
  }
})
</script>
