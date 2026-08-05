<template>
  <!--
    ImportPanel —— 统一导入流程共用组件（弹框/非弹框共用）。
    单根（外层 div），所有事件声明在 emits，无 fallthrough（守多根红线）。
    始终左右布局（grid grid-cols-2）：左=文本框（选文件填入/粘贴），右=预览区。
    来源切换（选择文件/粘贴数据）自动清空 content + previewFile + selectedFps（用户硬要求）。
    解析预览 → TabSelectPanel 勾选 → 本窗口/新窗口打开（内部调 openTabs，emit('opened') 通知调用方）。
    复用：lib/backup/importers.parseImport/readFileText + lib/backup/openTabs.openTabs + TabSelectPanel。
  -->
  <div class="space-y-3">
    <!-- 来源格式（多选项时显示） -->
    <div v-if="formats.length > 1" class="flex items-center gap-3 flex-wrap text-xs">
      <span class="text-gray-500 dark:text-gray-400">{{ t('backup.comp.import.formatLabel') }}</span>
      <label
        v-for="f in formats"
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
      <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ t('backup.comp.import.autoDetect') }}</span>
    </div>

    <!-- 来源切换 -->
    <div class="flex items-center gap-2 flex-wrap text-xs">
      <button
        type="button"
        :class="sourceBtnClass('file')"
        @click="onSwitchSource('file')"
      >
        <FileUp :size="14" />
        {{ t('backup.comp.import.fileImport') }}
      </button>
      <button
        type="button"
        :class="sourceBtnClass('paste')"
        @click="onSwitchSource('paste')"
      >
        <Clipboard :size="12" />
        {{ t('backup.comp.import.pasteData') }}
      </button>
      <span
        v-if="fileName"
        class="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[200px]"
        :title="fileName"
      >{{ fileName }}</span>
    </div>

    <!-- 左右布局：左=文本框，右=预览 -->
    <div class="grid grid-cols-2 gap-3 items-start">
      <!-- 左：文件按钮 + 文本框 + 解析 -->
      <div class="space-y-2">
        <!-- file 模式：选择文件按钮 + 清空 -->
        <div v-if="allowFile && sourceMode === 'file'" class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 min-h-[36px] px-4 py-2 text-xs rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onPickFile"
          >{{ t('backup.comp.import.pickFile') }}</button>
          <button
            v-if="content || fileName"
            type="button"
            class="inline-flex items-center gap-1 min-h-[32px] px-2 py-1.5 text-[11px] rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onClear"
          >{{ t('backup.comp.import.clear') }}</button>
          <input
            ref="fileInputRef"
            type="file"
            accept=".json,.txt,.md"
            class="hidden"
            @change="onFileChange"
          />
        </div>

        <!-- 文本框（选文件填入 / 粘贴） -->
        <textarea
          v-model="content"
          class="w-full min-h-[200px] max-h-[360px] border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/40 text-sm font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          :placeholder="sourceMode === 'file' ? t('backup.comp.import.filePlaceholder') : t('backup.comp.import.pastePlaceholder')"
          :aria-label="t('backup.comp.import.contentAria')"
        ></textarea>

        <!-- 解析预览 -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            :disabled="previewLoading || !content.trim()"
            class="inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onPreview"
          >
            <Search :size="12" />
            {{ previewLoading ? t('backup.comp.import.parsing') : t('backup.comp.import.parsePreview') }}
          </button>
          <button
            v-if="previewFile"
            type="button"
            class="inline-flex items-center gap-1 min-h-[32px] px-2 py-1.5 text-[11px] rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="resetPreview"
          >{{ t('backup.comp.import.clearPreview') }}</button>
          <span v-if="previewError" class="text-[11px] text-red-600 dark:text-red-400">{{ previewError }}</span>
        </div>
      </div>

      <!-- 右：预览区 -->
      <div
        v-if="previewFile"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"
      >
        <div class="flex items-center justify-between text-xs gap-2 flex-wrap">
          <span class="font-medium text-gray-900 dark:text-gray-100">
            {{ t('backup.comp.import.previewTitle') }}<span v-if="detectedFormatLabel" class="text-[11px] text-gray-500 dark:text-gray-400 font-normal ml-1">· {{ detectedFormatLabel }}</span>
          </span>
          <span class="text-[11px] text-gray-500 dark:text-gray-400">{{ previewSummaryText }}</span>
        </div>
        <p
          v-if="showMetaImportHint"
          class="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded px-2 py-1.5"
        >
          ⚠️ {{ t('backup.comp.import.metaHint') }}
        </p>
        <TabSelectPanel
          :windows="previewWindowGroups"
          v-model="selectedFps"
          :empty-hint="t('backup.comp.import.previewEmpty')"
          max-height="240px"
        />
      </div>
      <div
        v-else
        class="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-center text-[11px] text-gray-400 dark:text-gray-500 min-h-[200px]"
      >
        {{ t('backup.comp.import.previewPlaceholder') }}
      </div>
    </div>

    <!-- 打开操作（预览后显示，本窗口蓝色默认） -->
    <div v-if="previewFile" class="flex items-center gap-2 justify-end flex-wrap">
      <button
        type="button"
        :disabled="selectedCount === 0 || opening"
        class="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="onOpen(false)"
      >
        <ExternalLink :size="12" />
        {{ t('backup.comp.import.openCurrent') }}
      </button>
      <button
        type="button"
        :disabled="selectedCount === 0 || opening"
        class="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="onOpen(true)"
      >
        <SquareArrowOutUpRight :size="12" />
        {{ opening ? t('backup.comp.import.opening') : t('backup.comp.import.openNew') }}
      </button>
    </div>

    <!-- 重复 URL 确认弹框（与还原共用 RestoreConfirmDialog） -->
    <RestoreConfirmDialog
      :open="restorePreview.open"
      :total="restorePreview.total"
      :duplicate="restorePreview.duplicate"
      :to-open="restorePreview.toOpen"
      :target="restorePreview.target"
      @confirm="onRestoreConfirm"
      @cancel="onRestoreCancel"
    />

    <!-- 打开中遮罩（Teleport 收进主根内，不影响单根） -->
    <Teleport to="body">
      <div v-if="opening" class="fixed inset-0 z-[130] bg-black/30 flex items-center justify-center" aria-live="polite">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl px-5 py-3 flex items-center gap-2 text-xs">
          <svg class="animate-spin h-4 w-4 text-blue-600 motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          <span class="text-gray-700 dark:text-gray-200">{{ t('backup.comp.import.openingMask') }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * ImportPanel —— 统一导入流程共用组件（弹框/非弹框共用）。
 * 始终左右布局：左=文本框（选文件填入/粘贴），右=预览区。
 * 内部调 openTabs 打开选中标签，emit('opened', {count, openInNewWindow}) 通知调用方。
 * 规范：禁 v-html / Promise 必 catch / 单一职责。
 */
import { ref, reactive, computed, nextTick, watch } from 'vue';
import { FileUp, Clipboard, Search, ExternalLink, SquareArrowOutUpRight } from '@lucide/vue';
import { showToast } from '~composables/useToast';
import { parseImport, readFileText } from '~lib/backup/importers';
import { mergeMeta } from '~lib/backup/metaRestore';
import { computeDuplicateFromTabs } from '~lib/backup/restore';
import { openTabs, type OpenWindowGroup } from '~lib/backup/openTabs';
import TabSelectPanel from '~components/backup/TabSelectPanel.vue';
import RestoreConfirmDialog from '~components/backup/RestoreConfirmDialog.vue';
import type { BackupFile, TabSnapshot } from '~types/backup';
import { t, tWithParams } from '~lib/i18n';

type SourceMode = 'file' | 'paste';

const props = withDefaults(
  defineProps<{
    /** 支持的格式选项（>1 时显示格式选择 radio） */
    formats: { value: string; label: string }[];
    /** 默认格式 */
    defaultFormat: string;
    /** 是否允许选文件（默认 true） */
    allowFile?: boolean;
  }>(),
  {
    allowFile: true,
  },
);

const emit = defineEmits<{
  /** 打开完成后通知调用方（count=实际打开数；ImportPanel 已自行 toast） */
  (e: 'opened', payload: { count: number; openInNewWindow: boolean }): void;
}>();

// ===== 格式标签映射（禁魔法值，阿里规范） =====
const FORMAT_LABEL_MAP = computed<Record<string, string>>(() => ({
  ours: t('backup.comp.import.formatOurs'),
  onetab: t('backup.comp.import.formatOnetab'),
  unknown: t('backup.comp.import.formatUnknown'),
}));

const format = ref<string>(props.defaultFormat);
// ===== 来源模式 =====
const sourceMode = ref<SourceMode>('file');
const content = ref('');
const fileName = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// 切换格式（本插件数据 ↔ OneTab）时自动清空文本框 + 预览（两种格式数据不通用）
watch(format, () => {
  content.value = '';
  fileName.value = null;
  resetPreview();
});

function resetPreview(): void {
  previewFile.value = null;
  previewError.value = null;
  selectedFps.value = new Set();
}

function onSwitchSource(mode: SourceMode): void {
  if (sourceMode.value === mode) return;
  sourceMode.value = mode;
  // 切换来源自动清空 content + 预览（用户硬要求）
  content.value = '';
  fileName.value = null;
  resetPreview();
  // 切到 file 模式直接弹文件框（一步到位，少一次点击）
  if (mode === 'file' && props.allowFile) {
    void nextTick(() => fileInputRef.value?.click());
  }
}

function onPickFile(): void {
  fileInputRef.value?.click();
}

async function onFileChange(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  fileName.value = file.name;
  try {
    const text = await readFileText(file);
    content.value = text;
    // 选完文件自动解析预览（减少一步操作）
    void onPreview();
  } catch (err) {
    console.warn('[ImportPanel] 读取文件失败', err);
    showToast(t('backup.comp.import.readFailed'));
  }
  // 重置 input value 让同一文件可重选
  input.value = '';
}

function onClear(): void {
  content.value = '';
  fileName.value = null;
  resetPreview();
}

// ===== 预览 =====
const previewLoading = ref(false);
const previewFile = ref<BackupFile | null>(null);
const previewError = ref<string | null>(null);
const detectedFormat = ref<string>('');
const selectedFps = ref<Set<string>>(new Set());

async function onPreview(): Promise<void> {
  const text = content.value.trim();
  if (!text) {
    previewError.value = t('backup.comp.import.emptyContent');
    return;
  }
  previewLoading.value = true;
  previewError.value = null;
  try {
    const r = await parseImport(text);
    if (!r.ok || !r.file) {
      previewError.value = r.error || t('backup.comp.import.parseFailed');
      previewFile.value = null;
      return;
    }
    // 格式不匹配软提示（不阻断，按识别结果预览）
    if (format.value !== r.format && r.format !== 'unknown') {
      const expected = FORMAT_LABEL_MAP.value[format.value] || format.value;
      const actual = FORMAT_LABEL_MAP.value[r.format] || r.format;
      showToast(tWithParams('backup.comp.import.formatMismatch', { expected, actual }));
    }
    previewFile.value = r.file;
    detectedFormat.value = r.format;
    // 默认全选非隐身窗口的标签
    const fps = new Set<string>();
    for (const w of r.file.snapshot.windows) {
      if (w.incognito) continue;
      for (const t of w.tabs) fps.add(t.fingerprint);
    }
    selectedFps.value = fps;
  } catch (err) {
    console.warn('[ImportPanel] 预览失败', err);
    previewError.value = err instanceof Error ? err.message : t('backup.comp.import.parseFailed');
    previewFile.value = null;
  } finally {
    previewLoading.value = false;
  }
}

const detectedFormatLabel = computed(() => FORMAT_LABEL_MAP.value[detectedFormat.value] || detectedFormat.value);

// ===== 预览标签视图（按窗口分组，仅非隐身）喂给 TabSelectPanel =====
interface PreviewTabItem { fingerprint: string; title: string; url: string; domain: string }
interface PreviewWindowGroup { windowId: number; tabs: PreviewTabItem[] }

const previewWindowGroups = computed<PreviewWindowGroup[]>(() => {
  const f = previewFile.value;
  if (!f) return [];
  const groups: PreviewWindowGroup[] = [];
  for (const w of f.snapshot.windows) {
    if (w.incognito) continue;
    const tabs: PreviewTabItem[] = w.tabs.map((t) => ({
      fingerprint: t.fingerprint,
      title: t.title || '',
      url: t.url || '',
      domain: safeDomain(t.url),
    }));
    if (tabs.length > 0) groups.push({ windowId: w.windowId, tabs });
  }
  return groups;
});

const selectedCount = computed(() => selectedFps.value.size);

// 仅 ours 格式 + 快照含 customTags/laterTabs 时显示导入提示
const showMetaImportHint = computed(() => {
  const f = previewFile.value;
  if (!f) return false;
  if (detectedFormat.value === 'ours') return true;
  const meta = f.snapshot?.meta;
  if (!meta) return false;
  return Array.isArray(meta.customTags) || Array.isArray(meta.laterTabs);
});

const previewSummaryText = computed(() => {
  const f = previewFile.value;
  if (!f) return '';
  const s = f.snapshot.stats;
  const parts: string[] = [tWithParams('backup.comp.import.previewSummary', { tabs: s.tabCount })];
  if (s.windowCount > 0) parts.push(tWithParams('backup.comp.detail.statWindows', { count: s.windowCount }));
  return parts.join(' · ');
});

// ===== 打开（内部调 openTabs，emit('opened') 通知调用方） =====
const opening = ref(false);

// 还原确认弹框状态（与 RestoreConfirmDialog 对齐）
interface RestorePreviewState {
  open: boolean;
  total: number;
  duplicate: number;
  toOpen: number;
  target: 'current' | 'newWindow';
}
const restorePreview = reactive<RestorePreviewState>({
  open: false,
  total: 0,
  duplicate: 0,
  toOpen: 0,
  target: 'current',
});

/**
 * 本地计算选中标签中与当前已打开重复的数量（Task 2：抽 computeDuplicateFromTabs 共用）。
 * 仅按用户勾选的 fingerprint 过滤；隐身窗口不计。
 */
async function computeDuplicate(): Promise<{ total: number; duplicate: number; toOpen: number }> {
  const f = previewFile.value;
  if (!f) return { total: 0, duplicate: 0, toOpen: 0 };
  // 收集非隐身窗口标签，喂给 computeDuplicateFromTabs（按 selectedFps 过滤）
  const tabs: TabSnapshot[] = [];
  for (const w of f.snapshot.windows) {
    if (w.incognito) continue;
    for (const t of w.tabs) tabs.push(t);
  }
  return await computeDuplicateFromTabs(tabs, new Set(selectedFps.value));
}

/**
 * 点「本窗口打开」/「新窗口打开」入口：先预览重复，有重复弹框让用户选；
 * 无重复直接执行（默认去重，因无重复 skipDuplicateUrls 取值不影响结果）。
 */
async function onOpen(openInNewWindow: boolean): Promise<void> {
  const f = previewFile.value;
  if (!f || selectedCount.value === 0 || opening.value) return;
  const p = await computeDuplicate();
  if (p.duplicate > 0) {
    restorePreview.open = true;
    restorePreview.target = openInNewWindow ? 'newWindow' : 'current';
    restorePreview.total = p.total;
    restorePreview.duplicate = p.duplicate;
    restorePreview.toOpen = p.toOpen;
    return;
  }
  await doOpen(openInNewWindow, true);
}

function onRestoreConfirm(payload: { skipDuplicate: boolean }): void {
  restorePreview.open = false;
  void doOpen(restorePreview.target === 'newWindow', payload.skipDuplicate);
}

function onRestoreCancel(): void {
  restorePreview.open = false;
}

/**
 * 实际执行打开（按用户选择决定是否跳过重复 URL）。
 * skipDuplicate=true：跳过已开同 URL（不新建 tab，不触发 onTabOpened → 不打标记）
 * skipDuplicate=false：重复也新建 tab（全部触发 onTabOpened → 都打标记）
 */
async function doOpen(openInNewWindow: boolean, skipDuplicate: boolean): Promise<void> {
  const f = previewFile.value;
  if (!f || selectedCount.value === 0 || opening.value) return;
  opening.value = true;
  try {
    const fps = new Set(selectedFps.value);
    const windows: OpenWindowGroup[] = [];
    let firstFocused = true;
    for (const w of f.snapshot.windows) {
      if (w.incognito) continue;
      const tabs = w.tabs
        .filter((t) => fps.has(t.fingerprint))
        .map((t) => ({ url: t.url, pinned: t.pinned, fingerprint: t.fingerprint }));
      if (tabs.length > 0) {
        windows.push({ tabs, focused: firstFocused });
        firstFocused = false;
      }
    }
    // 用 onTabOpened 收集 fingerprint → 新 tabId 映射（导入元数据时按 tabId key 写 tabTagsMap）
    const fpToTabId = new Map<string, number>()
    const count = await openTabs({
      windows,
      openInNewWindow,
      skipDuplicateUrls: skipDuplicate,
      onTabOpened: (item, tabId) => {
        if (typeof item.fingerprint === 'string' && item.fingerprint && typeof tabId === 'number') {
          fpToTabId.set(item.fingerprint, tabId)
        }
      },
    })
    if (count > 0) showToast(tWithParams('backup.comp.import.openedToast', { count }));
    else showToast(t('backup.comp.import.allOpenToast'));
    // 仅 ours 格式：导入后追加 customTags + tabTagsMap + laterTabs
    const meta = f?.snapshot?.meta;
    const hasMeta =
      (Array.isArray(meta?.customTags) && (meta!.customTags.length > 0)) ||
      (Array.isArray(meta?.laterTabs) && (meta!.laterTabs.length > 0)) ||
      (meta?.tabTagsMap && typeof meta.tabTagsMap === 'object' && Object.keys(meta.tabTagsMap).length > 0);
    if (hasMeta && f) {
      try {
        const r = await mergeMeta(f, fpToTabId);
        // 拼接提示：仅展示非 0 项；全为 0 时单独提示
        const parts: string[] = [];
        if (r.tagsAdded > 0) parts.push(tWithParams('backup.comp.import.metaTagsAdded', { count: r.tagsAdded }));
        if (r.laterAdded > 0) parts.push(tWithParams('backup.comp.import.metaLaterAdded', { count: r.laterAdded }));
        if (r.tagsApplied > 0) parts.push(tWithParams('backup.comp.import.metaTagsApplied', { count: r.tagsApplied }));
        if (parts.length > 0) {
          showToast(parts.join('、'));
        } else {
          showToast(t('backup.comp.import.metaAllExist'));
        }
      } catch (err) {
        console.warn('[ImportPanel] 追加标记/稍后项失败', err);
      }
    }
    emit('opened', { count, openInNewWindow });
  } catch (err) {
    console.warn('[ImportPanel] 打开失败', err);
    showToast(t('backup.comp.import.openFailed'));
  } finally {
    opening.value = false;
  }
}

// ===== 工具函数 =====
function sourceBtnClass(mode: SourceMode): string {
  const base =
    'inline-flex items-center gap-1.5 min-h-[36px] px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  return sourceMode.value === mode
    ? `${base} bg-blue-600 text-white font-medium hover:bg-blue-700`
    : `${base} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700`;
}

function safeDomain(url: string): string {
  try {
    return new URL(url).hostname || '?';
  } catch {
    return '?';
  }
}
</script>
