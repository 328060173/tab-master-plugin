<template>
  <!--
    「开启自动备份」确认框（任务 3.1）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    开关 ON 后弹出，告知限制 + 当前设置；点「确认开启」才真开启 + 首次备份；点「取消」开关回弹（不开启）。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auto-backup-confirm-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 id="auto-backup-confirm-title" class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Settings :size="18" class="text-blue-600 dark:text-blue-400 shrink-0" />
            开启自动备份
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 正文 -->
        <div class="px-5 pb-3 space-y-3 text-xs text-gray-600 dark:text-gray-300">
          <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            开启后插件将按设定自动备份标签，崩溃也能找回。
          </p>

          <!-- 当前设置 -->
          <div class="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 space-y-1">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-200">当前设置：</p>
            <ul class="space-y-0.5 text-[11px] text-gray-600 dark:text-gray-300">
              <li>• 备份频次：每 {{ timerMinutes }} 分钟</li>
              <li>• 自动保留：{{ cacheMaxSnapshots }} 条</li>
              <li>• 保留天数：{{ retentionDays }} 天</li>
            </ul>
          </div>

          <!-- 说明 -->
          <div class="space-y-1 text-[11px] text-gray-500 dark:text-gray-400">
            <p>• 自动备份受保留条数和天数限制，超出自动清理</p>
            <p>• 数据存在本地，插件卸载会丢失，请用导出留底</p>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="flex justify-end gap-2 px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-700">
          <button
            class="px-4 py-1.5 min-h-[36px] text-sm rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >取消</button>
          <button
            class="px-4 py-1.5 min-h-[36px] text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            @click="onConfirm"
          >确认开启</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 「开启自动备份」确认框（2026-07-30 重构）。
 * Props: open + 当前设置值（timerMinutes/cacheMaxSnapshots/retentionDays）
 * Emits: confirm（确认开启）/ cancel（取消/关闭/ESC/遮罩）
 * 事件触发开关已搬概览页「关闭浏览器备份」独立行，不再此处展示。
 */
import { X, Settings } from "@lucide/vue"

defineProps<{
  open: boolean
  timerMinutes: number
  cacheMaxSnapshots: number
  retentionDays: number
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onConfirm() { emit('confirm') }
function onCancel() { emit('cancel') }
</script>
