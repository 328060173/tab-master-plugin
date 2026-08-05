<template>
  <!--
    首次开启知悉弹窗（轻提示版）- 设计稿 §4.2。
    主区 1-2 句建议；右上角小问号点开折叠「浏览器限制（不是产品缺陷）」全部技术细节；
    主按钮「开启备份」始终可点（不强制看问号）。全删技术黑话。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    存储：tabMasterBackupNoticeAcked 单 bool（开启过=true 不再弹）。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
      @keydown.esc="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-notice-title"
      >
        <!-- 标题行 + 右上角问号 -->
        <div class="flex items-start justify-between gap-2 px-5 pt-5 pb-2">
          <h2 id="backup-notice-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
            {{ t('dialog.backupNotice.title') }}
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-label="expanded ? t('dialog.backupNotice.ariaCollapse') : t('dialog.backupNotice.ariaExpand')"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
          >
            <HelpCircle :size="16" />
          </button>
        </div>

        <!-- 主区：1-2 句建议 -->
        <div class="px-5 pb-3 text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
          <p>{{ t('dialog.backupNotice.intro') }}</p>
          <div class="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
            <p class="flex items-start gap-1.5">
              <span class="text-blue-500 mt-0.5 shrink-0">·</span>
              <span>{{ t('dialog.backupNotice.tipConflict') }}</span>
            </p>
            <p class="flex items-start gap-1.5">
              <span class="text-blue-500 mt-0.5 shrink-0">·</span>
              <span>{{ t('dialog.backupNotice.tipManual') }}</span>
            </p>
          </div>
        </div>

        <!-- 折叠区：浏览器限制（不是产品缺陷） -->
        <transition
          enter-active-class="transition-all duration-200 ease-out motion-reduce:transition-none"
          leave-active-class="transition-all duration-200 ease-out motion-reduce:transition-none"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[400px]"
          leave-from-class="opacity-100 max-h-[400px]"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="expanded" class="mx-5 mb-3 px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg overflow-hidden">
            <p class="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1.5">
              {{ t('dialog.backupNotice.limitTitle') }}
            </p>
            <ul class="space-y-1.5 text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 shrink-0">·</span>
                <span>{{ t('dialog.backupNotice.limitTabMatch') }}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 shrink-0">·</span>
                <span>{{ t('dialog.backupNotice.limitFolder') }}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="mt-0.5 shrink-0">·</span>
                <span>{{ t('dialog.backupNotice.limitMultiDevice') }}</span>
              </li>
            </ul>
          </div>
        </transition>

        <!-- 操作行：主按钮始终可点 -->
        <div class="flex gap-2 justify-end px-5 pb-5 pt-1">
          <button
            class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >
            {{ t('dialog.backupNotice.cancel') }}
          </button>
          <button
            class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            @click="onConfirm"
          >
            {{ t('dialog.backupNotice.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 首次开启知悉弹窗（轻提示版）- 设计稿 §4.2。
 * 主区 1-2 句建议 + 右上角小问号展开「浏览器限制（不是产品缺陷）」。
 * 主按钮「开启备份」始终可点（progressive-disclosure + Onboarding/User Freedom）。
 * 文案全部口语化，禁出现 File System Access API / fingerprint / tabId / setTabValue / SPA / WAL / GFS 等黑话。
 * 不再读写 6 项 boolean 数组，存 tabMasterBackupNoticeAcked 单 bool（由父组件调 svc.setNoticeAcked(true)）。
 */
import { ref, watch } from "vue"
import { HelpCircle } from "@lucide/vue"
import { t } from "~lib/i18n"

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: "confirm"): void
  (e: "cancel"): void
}>()

const expanded = ref(false)

watch(
  () => props.open,
  (v) => {
    if (v) expanded.value = false
  }
)

function onConfirm() {
  emit("confirm")
}
function onCancel() {
  emit("cancel")
}
</script>
