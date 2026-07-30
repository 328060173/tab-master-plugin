<template>
  <!--
    自动备份设置弹框（设计稿 §2.2，2026-07-30 重构）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    内容：仅「备份频次」一项（用户拍板：只配置频次，其他不要）。
    - 事件触发已搬概览页「关闭浏览器备份」独立开关（与自动备份并行）
    - 保留策略锁定默认值不可调，移除展示（概览页/列表已有相关摘要）
    调 svc.updateSettings 保存（总开关由概览页独立管理，本弹框不涉及 enabled）。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auto-backup-settings-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 id="auto-backup-settings-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
            自动备份设置
          </h2>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <div class="px-5 pb-5 space-y-4">
          <!-- 频次（唯一可配置项，2026-07-30 重构） -->
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-gray-700 dark:text-gray-200">备份频次</label>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-gray-500 dark:text-gray-400">每</span>
              <select
                v-model.number="draft.timerMinutes"
                class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option v-for="opt in TIMER_MINUTES_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
              <span class="text-gray-500 dark:text-gray-400">分钟</span>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              自动备份按此间隔定时执行。崩溃/断电后由最近一次定时备份兜底。
            </p>
          </div>

          <!-- 关闭浏览器备份入口提示（该开关已搬概览页，与自动备份并行独立） -->
          <div class="space-y-1.5">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-200">关闭浏览器备份</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              此开关在备份概览页顶部，与自动备份并行独立。开启后关浏览器/窗口时立即备份一份（仅正常关闭生效，断电/崩溃可能不生效）。
            </p>
          </div>
        </div>

        <!-- 操作行 -->
        <div class="flex gap-2 justify-end px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-700">
          <button
            class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onCancel"
          >取消</button>
          <button
            :disabled="saving"
            class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="onSave"
          >{{ saving ? '保存中…' : '保存' }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 自动备份设置弹框（2026-07-30 重构）。
 * 本地 draft 副本 + 保存时调 svc.updateSettings。
 * 总开关（enabled）由概览页独立开关 + 确认框管理，本弹框不涉及。
 * 仅配置备份频次；事件触发（关闭浏览器备份）已搬概览页独立开关。
 */
import { ref, watch, reactive } from "vue"
import { X } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { showToast } from "~composables/useToast"
import { currentLimits, type BackupSettings } from "~types/backup"

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
}>()

const svc = useBackupService()

// 备份频次可选项：最小 10 分钟（普通档锁定，避免高频耗资源）；无"关闭定时"
// （定时是自动备份核心，不想定时请到概览页关闭自动备份总开关）。§3.5 默认 10 分钟
const TIMER_MINUTES_OPTIONS = [
  { value: 10, label: '10 分钟（默认）' },
  { value: 15, label: '15 分钟' },
  { value: 30, label: '30 分钟' },
  { value: 60, label: '60 分钟' },
] as const

// 本地草稿（保存时才同步到 svc）——默认值由当前限制档派生（§3.5）
const LIM = currentLimits()
const draft = reactive<Pick<BackupSettings, 'timerMinutes'>>({
  timerMinutes: LIM.defaultTimerMinutes,
})

const saving = ref(false)

// 打开时同步当前 svc 设置到 draft
watch(() => props.open, (v) => {
  if (v) {
    const s = svc.settings.value
    // clamp：旧值 0(关闭定时)/5(分钟) 不在新选项内 → 提到最小 10 分钟
    // （15/30/60 不变；下次保存会把 clamp 后的值写回 svc，修正旧配置）
    draft.timerMinutes = s.timerMinutes < 10 ? 10 : s.timerMinutes
  }
})

async function onSave() {
  if (saving.value) return
  saving.value = true
  try {
    const cur = svc.settings.value
    const patch: Partial<BackupSettings> = {}
    if (cur.timerMinutes !== draft.timerMinutes) patch.timerMinutes = draft.timerMinutes

    if (Object.keys(patch).length === 0) {
      emit('saved')
      return
    }
    await svc.updateSettings(patch)
    showToast('已保存设置')
    emit('saved')
  } catch (e) {
    console.warn('[AutoBackupSettingsDialog] 保存失败', e)
    showToast('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

function onCancel() {
  emit('cancel')
}
</script>
