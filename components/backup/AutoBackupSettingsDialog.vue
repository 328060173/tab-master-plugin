<template>
  <!--
    自动备份设置弹框（设计稿 §2.2）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    内容：频次 / 事件触发 / 保留策略。
    调 svc.updateSettings 保存（总开关由概览页独立管理，本弹框不再涉及 enabled）。
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
          <!-- 频次 -->
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
          </div>

          <!-- 事件触发 -->
          <div class="space-y-1.5">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-200">事件触发</p>
            <div class="space-y-1.5">
              <label class="flex items-start gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  v-model="draft.eventOnTabRemoved"
                  class="mt-0.5"
                  @change="onEventToggle('eventOnTabRemoved', $event)"
                />
                <div class="flex-1">
                  <p class="text-gray-800 dark:text-gray-100">标签关闭时备份</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">防抖 2s，避免连关多标签触发多次</p>
                </div>
              </label>
              <label class="flex items-start gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  v-model="draft.eventOnWindowRemoved"
                  class="mt-0.5"
                  @change="onEventToggle('eventOnWindowRemoved', $event)"
                />
                <div class="flex-1">
                  <p class="text-gray-800 dark:text-gray-100">窗口关闭时备份</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">窗口被关时立即备份一份</p>
                </div>
              </label>
              <label class="flex items-start gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  v-model="draft.eventOnIdle"
                  class="mt-0.5"
                  @change="onEventToggle('eventOnIdle', $event)"
                />
                <div class="flex-1">
                  <p class="text-gray-800 dark:text-gray-100">电脑空闲时备份</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">电脑一段时间没操作时自动备份一份</p>
                </div>
              </label>
            </div>
          </div>

          <!-- 保留策略（普通用户锁定默认值，不可调整；仅展示摘要文案） -->
          <div class="space-y-1.5">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-200">保留策略</p>
            <!-- §3.5 保留策略摘要行（默认配置一目了然，无技术黑话，无数值冲突感）。
                 文案数值统一走 backupRules（Task 3：禁散落魔法值），改规则改一处 -->
            <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ retentionPolicyText }}
            </p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ manualPolicyText }}</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
              {{ overflowText }}
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

    <!-- 事件触发开启确认弹框（勾选时告知代价，2026-07-28） -->
    <ConfirmDialog
      :open="eventConfirmOpen"
      title="开启事件触发备份？"
      :message="eventConfirmMessage"
      confirm-text="确认开启"
      cancel-text="取消"
      @confirm="onEventConfirm"
      @cancel="onEventCancel"
    />
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 自动备份设置弹框（设计稿 §2.2）。
 * 本地 draft 副本 + 保存时调 svc.updateSettings。
 * 总开关（enabled）由概览页独立开关 + 确认框管理，本弹框不再涉及；idle 权限由 svc 内部 rebindIdleListener 处理（P0 简版）。
 */
import { ref, watch, reactive, computed } from "vue"
import { X } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { showToast } from "~composables/useToast"
import { currentLimits, type BackupSettings } from "~types/backup"
import {
  getRetentionPolicyText,
  getManualPolicyText,
  getOverflowText,
} from "~lib/backup/backupRules"
import ConfirmDialog from "~components/ConfirmDialog.vue"

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
// §3.5 保留策略摘要文案统一走 backupRules（Task 3：禁散落魔法值，改规则改一处）
const retentionPolicyText = computed(() => getRetentionPolicyText())
const manualPolicyText = computed(() => getManualPolicyText())
const overflowText = computed(() => getOverflowText())
const draft = reactive<Pick<BackupSettings, 'timerMinutes' | 'eventOnTabRemoved' | 'eventOnWindowRemoved' | 'eventOnIdle' | 'cacheMaxSnapshots' | 'retentionDays' | 'cacheQuotaBytes'>>({
  timerMinutes: LIM.defaultTimerMinutes,
  // 2026-07-28：事件触发默认全关（与 DEFAULT_BACKUP_SETTINGS 一致）
  eventOnTabRemoved: false,
  eventOnWindowRemoved: false,
  eventOnIdle: false,
  cacheMaxSnapshots: LIM.autoMaxSnapshots,
  retentionDays: LIM.retentionDays,
  cacheQuotaBytes: LIM.cacheQuotaBytes,
})

const saving = ref(false)

/**
 * 事件触发开启确认（2026-07-28）。
 * 勾选任一事件触发（关标签/关窗口/空闲）时弹确认框告知代价：
 * 备份记录会随开关标签频次快速增加，较早的自动备份会被清理（保留近 cacheMaxSnapshots 条）。
 * 用户取消则回退勾选；确认则保持。
 */
type EventField = 'eventOnTabRemoved' | 'eventOnWindowRemoved' | 'eventOnIdle'
const eventConfirmOpen = ref(false)
const pendingEventField = ref<EventField | null>(null)
const eventConfirmMessage = computed(() => {
  return `开启后，每次关闭标签/窗口（或电脑空闲）都会自动备份一份。如果一天内开关标签次数多，备份记录会快速增加，较早的自动备份会被自动清理（保留近 ${draft.cacheMaxSnapshots} 条）。`
})

function onEventToggle(field: EventField, e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  // 仅从 false → true 时弹确认；关闭（true → false）直接生效
  if (checked) {
    pendingEventField.value = field
    eventConfirmOpen.value = true
  }
}

function onEventConfirm() {
  // 保持勾选（v-model 已置 true），关闭弹框
  pendingEventField.value = null
  eventConfirmOpen.value = false
}

function onEventCancel() {
  // 回退勾选
  if (pendingEventField.value) {
    draft[pendingEventField.value] = false
  }
  pendingEventField.value = null
  eventConfirmOpen.value = false
}

// 打开时同步当前 svc 设置到 draft
watch(() => props.open, (v) => {
  if (v) {
    const s = svc.settings.value
    // clamp：旧值 0(关闭定时)/5(分钟) 不在新选项内 → 提到最小 10 分钟
    // （15/30/60 不变；下次保存会把 clamp 后的值写回 svc，修正旧配置）
    draft.timerMinutes = s.timerMinutes < 10 ? 10 : s.timerMinutes
    draft.eventOnTabRemoved = s.eventOnTabRemoved
    draft.eventOnWindowRemoved = s.eventOnWindowRemoved
    draft.eventOnIdle = s.eventOnIdle
    draft.cacheMaxSnapshots = s.cacheMaxSnapshots
    draft.retentionDays = s.retentionDays
    draft.cacheQuotaBytes = s.cacheQuotaBytes
  }
})

async function onSave() {
  if (saving.value) return
  saving.value = true
  try {
    const cur = svc.settings.value
    const patch: Partial<BackupSettings> = {}
    if (cur.timerMinutes !== draft.timerMinutes) patch.timerMinutes = draft.timerMinutes
    if (cur.eventOnTabRemoved !== draft.eventOnTabRemoved) patch.eventOnTabRemoved = draft.eventOnTabRemoved
    if (cur.eventOnWindowRemoved !== draft.eventOnWindowRemoved) patch.eventOnWindowRemoved = draft.eventOnWindowRemoved
    if (cur.eventOnIdle !== draft.eventOnIdle) patch.eventOnIdle = draft.eventOnIdle
    if (cur.cacheMaxSnapshots !== draft.cacheMaxSnapshots) patch.cacheMaxSnapshots = draft.cacheMaxSnapshots
    if (cur.retentionDays !== draft.retentionDays) patch.retentionDays = draft.retentionDays
    if (cur.cacheQuotaBytes !== draft.cacheQuotaBytes) patch.cacheQuotaBytes = draft.cacheQuotaBytes

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
