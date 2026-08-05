<template>
  <!--
    备份说明大弹窗（占满屏遮罩 + 居中卡片）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    用户可见处禁技术黑话（不出现 JSON / token 等词）。
    Props: open: boolean
    Emits: cancel
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[140] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-[720px] max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-help-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题栏 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-3 shrink-0 border-b border-gray-100 dark:border-gray-700">
          <h2 id="backup-help-title" class="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <HelpCircle :size="18" class="text-blue-600 dark:text-blue-400" />
            {{ t('backup.comp.help.title') }}
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            :aria-label="t('backup.comp.help.close')"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 内容区 -->
        <div class="px-5 py-4 flex-1 overflow-y-auto space-y-4 text-xs text-gray-600 dark:text-gray-300">
          <!-- 什么是备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ t('backup.comp.help.whatIs') }}</h3>
            <p>{{ t('backup.comp.help.whatIsDesc') }}</p>
          </section>

          <!-- 为什么要备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ t('backup.comp.help.whyBackup') }}</h3>
            <p>{{ t('backup.comp.help.whyDesc') }}</p>
          </section>

          <!-- 手动备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ t('backup.comp.help.manual') }}</h3>
            <p>{{ t('backup.comp.help.manualDesc') }}</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{{ t('backup.comp.help.manualWhere') }}</p>
          </section>

          <!-- 自动备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ t('backup.comp.help.auto') }}</h3>
            <p>{{ t('backup.comp.help.autoDesc') }}</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{{ t('backup.comp.help.autoWhere') }}</p>
          </section>

          <!-- 自动监听备份 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ t('backup.comp.help.listen') }}</h3>
            <p>{{ t('backup.comp.help.listenDesc') }}</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{{ t('backup.comp.help.listenNote') }}</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{{ t('backup.comp.help.listenWhere') }}</p>
          </section>

          <!-- 导入 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ t('backup.comp.help.import') }}</h3>
            <p>{{ t('backup.comp.help.importDesc') }}</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{{ t('backup.comp.help.importWhere') }}</p>
          </section>

          <!-- 导出 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ t('backup.comp.help.export') }}</h3>
            <p>{{ t('backup.comp.help.exportDesc') }}</p>
            <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{{ t('backup.comp.help.exportWhere') }}</p>
          </section>

          <!-- 备份和导入导出的区别 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{{ t('backup.comp.help.diffTitle') }}</h3>
            <p>{{ t('backup.comp.help.diffDesc') }}</p>
          </section>

          <!-- 常见问题 -->
          <section>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{{ t('backup.comp.help.faqTitle') }}</h3>
            <div class="space-y-2.5">
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ t('backup.comp.help.faqQ1') }}</p>
                <p class="mt-0.5">{{ t('backup.comp.help.faqA1') }}</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ t('backup.comp.help.faqQ2') }}</p>
                <p class="mt-0.5">{{ tWithParams('backup.comp.help.faqA2', { max: BACKUP_RULES.maxSnapshots, days: BACKUP_RULES.retentionDays, manualMax: BACKUP_RULES.manualMaxSnapshots }) }}</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ t('backup.comp.help.faqQ3') }}</p>
                <p class="mt-0.5">{{ tWithParams('backup.comp.help.faqA3', { max: BACKUP_RULES.maxSnapshots, days: BACKUP_RULES.retentionDays, manualMax: BACKUP_RULES.manualMaxSnapshots }) }}</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ t('backup.comp.help.faqQ4') }}</p>
                <p class="mt-0.5">{{ t('backup.comp.help.faqA4') }}</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ t('backup.comp.help.faqQ5') }}</p>
                <p class="mt-0.5">{{ t('backup.comp.help.faqA5') }}</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ t('backup.comp.help.faqQ6') }}</p>
                <p class="mt-0.5">{{ t('backup.comp.help.faqA6') }}</p>
              </div>
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ t('backup.comp.help.faqQ7') }}</p>
                <p class="mt-0.5">{{ t('backup.comp.help.faqA7') }}</p>
              </div>
            </div>
          </section>
        </div>

        <!-- 底部按钮 -->
        <div class="px-5 py-3 shrink-0 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            class="inline-flex items-center justify-center min-h-[36px] px-5 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >{{ t('backup.comp.help.ack') }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 备份说明大弹窗：纯静态说明内容，无业务逻辑。
 * 守红线：
 * - 单根（Teleport + 单 div）
 * - 用户可见处无技术黑话
 * - 无 fallthrough（emits 声明 cancel）
 */
import { X, HelpCircle } from '@lucide/vue'
import { BACKUP_RULES } from '~lib/backup/backupRules'
import { t, tWithParams } from '~lib/i18n'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

function onCancel() {
  emit('cancel')
}
</script>
