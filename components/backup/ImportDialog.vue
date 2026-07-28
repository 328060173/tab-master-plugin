<template>
  <!--
    导入弹框（备份概览用，§3.4）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    弹框壳（标题/关闭/取消）+ 内部 ImportPanel（左右布局导入流程，支持 ours + onetab）。
    底部「OneTab 格式导入 →」跳导入管理菜单（用户想用完整页面可跳）。
    复用 ImportPanel（导入流程收口）。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-dialog-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
          <h2 id="import-dialog-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
            导入数据
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 导入流程主体（ImportPanel 随 v-if 重建，状态天然重置） -->
        <div class="px-5 pb-3 flex-1 overflow-y-auto">
          <ImportPanel
            :formats="FORMATS"
            :default-format="DEFAULT_FORMAT"
          />
        </div>

        <!-- 操作行 -->
        <div class="flex items-center gap-2 justify-end px-5 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700 shrink-0 flex-wrap">
          <button
            type="button"
            class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >取消</button>
        </div>

        <!-- 底部：其他格式导入入口 -->
        <div class="px-5 pb-4 -mt-1 shrink-0">
          <button
            type="button"
            class="text-[11px] text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            @click="emit('other-formats')"
          >OneTab 格式导入 →</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 导入弹框（备份概览用）。
 * 弹框壳 + ImportPanel（左右布局导入流程，支持本插件数据 + OneTab）。
 * 底部「其他格式导入」emit('other-formats') 由父组件跳导入管理菜单。
 */
import { X } from '@lucide/vue';
import ImportPanel from './ImportPanel.vue';

defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'other-formats'): void;
}>();

// 格式选项（常量，禁魔法值）
const FORMATS: { value: string; label: string }[] = [
  { value: 'ours', label: '本插件数据' },
  { value: 'onetab', label: 'OneTab' },
];
const DEFAULT_FORMAT = 'ours';

function onCancel(): void {
  emit('cancel');
}
</script>
