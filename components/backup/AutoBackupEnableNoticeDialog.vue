<template>
  <!--
    「已开启自动备份」提示框（任务 3.1）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    开启自动备份后弹一次，告知"立即进行第一次自动备份，完成后到列表查看"。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auto-backup-enable-notice-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 id="auto-backup-enable-notice-title" class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckCircle :size="18" class="text-emerald-500 shrink-0" />
            {{ t('backup.comp.autoEnable.title') }}
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-label="t('backup.comp.autoEnable.close')"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 正文 -->
        <div class="px-5 pb-3">
          <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            {{ t('backup.comp.autoEnable.body') }}
          </p>
        </div>

        <!-- 底部操作 -->
        <div class="flex justify-end px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-700">
          <button
            class="px-4 py-1.5 min-h-[36px] text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            @click="onConfirm"
          >{{ t('backup.comp.autoEnable.ack') }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 「已开启自动备份」提示框。
 * Props: open
 * Emits: confirm（知道了）/ cancel（关闭/ESC/遮罩）
 */
import { X, CheckCircle } from "@lucide/vue"
import { t } from "~lib/i18n"

defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onConfirm() { emit('confirm') }
function onCancel() { emit('cancel') }
</script>
