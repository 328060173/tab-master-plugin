<template>
  <!--
    按窗口分组 + 勾选标签 统一预览组件（备份模块 5 处去重抽象）。
    单根：外层 div（守多根 fallthrough 红线，零容忍）。
    v-model: Set<string> —— 选中的 fingerprint 集合。emit 时新建 Set 保证响应式。
    调用方职责：①已过滤隐身窗口 ②算好 domain/fingerprint 传入 ③维护 modelValue（默认全选由调用方决定）
  -->
  <div class="tab-select-panel">
    <!-- 全选 + 计数 -->
    <div class="flex items-center gap-2 mb-2 text-xs">
      <label class="inline-flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          :checked="allSelected"
          :indeterminate.prop="someSelected && !allSelected"
          aria-label="全选"
          class="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          @change="onToggleAll"
        />
        <span>全选</span>
      </label>
      <span class="text-[11px] text-gray-500 dark:text-gray-400">
        已选 {{ selectedCount }} / {{ totalCount }} 个标签
      </span>
    </div>

    <!-- 标签列表（按窗口分组） -->
    <div
      class="overflow-y-auto border border-gray-100 dark:border-gray-700 rounded"
      :style="{ maxHeight: maxHeight }"
    >
      <div
        v-for="(g, idx) in windows"
        :key="g.windowId ?? idx"
        class="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
      >
        <!-- 窗口头（sticky） -->
        <div
          class="flex items-center gap-2 px-2 py-1.5 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30 sticky top-0"
        >
          <label class="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              :checked="isWindowAllSelected(g)"
              :indeterminate.prop="isWindowSomeSelected(g)"
              :aria-label="`窗口${idx + 1} 全选`"
              class="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              @change="onToggleWindow(g)"
            />
            <span>窗口{{ idx + 1 }}（{{ g.tabs.length }} 个标签）</span>
          </label>
        </div>

        <!-- 标签行 -->
        <ul class="divide-y divide-gray-50 dark:divide-gray-700/50">
          <li
            v-for="tab in g.tabs"
            :key="tab.fingerprint"
          >
            <label
              class="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 min-h-[28px]"
            >
              <input
                type="checkbox"
                :checked="modelValue.has(tab.fingerprint)"
                :aria-label="tab.title || '(无标题)'"
                class="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                @change="onToggleTab(tab.fingerprint)"
              />
              <FavIcon :src="tab.favIconUrl || ''" :domain="tab.domain" size="sm" />
              <span class="flex-1 min-w-0 truncate text-gray-800 dark:text-gray-100">
                {{ tab.title || '(无标题)' }}
              </span>
              <span
                class="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 truncate max-w-[180px]"
                :title="tab.url"
              >{{ tab.domain }}</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- 空状态 -->
      <div
        v-if="windows.length === 0"
        class="py-8 text-center text-xs text-gray-500 dark:text-gray-400"
      >
        {{ emptyHint }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * TabSelectPanel —— 按窗口分组 + 勾选标签 的统一预览组件。
 * 抽自 ManualBackupDialog/BackupDetailDialog/BackupImportTab/ImportDialog/ExportCurrentDialog 五处重复逻辑。
 * 三层 checkbox：全选 / 窗口选 / 单选，含 indeterminate 三态。
 * v-model(Set<string>) 单向数据流：内部不直接改 props，每次切换 emit 新 Set。
 */
import { computed } from 'vue';
import FavIcon from '~components/FavIcon.vue';

/** 单个标签项（调用方算好 fingerprint/domain 传入） */
interface TabSelectItem {
  fingerprint: string;
  title: string;
  url: string;
  domain: string;
  /** 可选 favicon URL，未提供时 FavIcon 退化为首字母色块 */
  favIconUrl?: string;
}

/** 窗口分组（调用方已过滤隐身窗口） */
interface TabSelectWindow {
  windowId: number;
  tabs: TabSelectItem[];
}

const props = withDefaults(
  defineProps<{
    /** 按窗口分组的标签（调用方已过滤隐身） */
    windows: TabSelectWindow[];
    /** 选中的 fingerprint 集合（v-model） */
    modelValue: Set<string>;
    /** 空状态文案 */
    emptyHint?: string;
    /** 列表最大高度 */
    maxHeight?: string;
  }>(),
  {
    emptyHint: '无可预览的标签',
    maxHeight: '360px',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: Set<string>): void;
}>();

/** 全部 fingerprint 平铺（用于全选/计数） */
const allFingerprints = computed<string[]>(() => {
  const arr: string[] = [];
  for (const g of props.windows) {
    for (const t of g.tabs) arr.push(t.fingerprint);
  }
  return arr;
});

const totalCount = computed(() => allFingerprints.value.length);
const selectedCount = computed(() => props.modelValue.size);
const allSelected = computed(
  () => totalCount.value > 0 && selectedCount.value === totalCount.value,
);
const someSelected = computed(() => selectedCount.value > 0);

function isWindowAllSelected(g: TabSelectWindow): boolean {
  return g.tabs.length > 0 && g.tabs.every((t) => props.modelValue.has(t.fingerprint));
}

function isWindowSomeSelected(g: TabSelectWindow): boolean {
  const sel = g.tabs.filter((t) => props.modelValue.has(t.fingerprint)).length;
  return sel > 0 && sel < g.tabs.length;
}

/** 全选/取消全选 —— emit 新 Set */
function onToggleAll(): void {
  if (allSelected.value) {
    emit('update:modelValue', new Set<string>());
  } else {
    emit('update:modelValue', new Set<string>(allFingerprints.value));
  }
}

/** 单个标签切换 */
function onToggleTab(fp: string): void {
  const next = new Set<string>(props.modelValue);
  if (next.has(fp)) next.delete(fp);
  else next.add(fp);
  emit('update:modelValue', next);
}

/** 窗口级切换 */
function onToggleWindow(g: TabSelectWindow): void {
  const next = new Set<string>(props.modelValue);
  if (isWindowAllSelected(g)) {
    for (const t of g.tabs) next.delete(t.fingerprint);
  } else {
    for (const t of g.tabs) next.add(t.fingerprint);
  }
  emit('update:modelValue', next);
}
</script>
