<template>
  <!--
    自动备份设置弹框（设计稿 §2.2）。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    内容：开关 / 频次 / 事件触发 / 保留策略。
    调 svc.updateSettings + svc.setEnabled 保存。
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
          <!-- 总开关 -->
          <div class="flex items-center gap-3 py-1">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">自动备份</p>
              <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                开启后定时 + 事件触发备份，崩溃可找回标签
              </p>
            </div>
            <button
              :class="[
                'relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500',
                draft.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
              ]"
              role="switch"
              :aria-checked="draft.enabled"
              aria-label="自动备份总开关"
              @click="draft.enabled = !draft.enabled"
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                :class="draft.enabled ? 'translate-x-5' : ''"
              ></span>
            </button>
          </div>

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
                />
                <div class="flex-1">
                  <p class="text-gray-800 dark:text-gray-100">空闲时备份</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">浏览器空闲时备份，省电可选</p>
                </div>
              </label>
            </div>
          </div>

          <!-- 保留策略 -->
          <div class="space-y-1.5">
            <p class="text-xs font-medium text-gray-700 dark:text-gray-200">保留策略</p>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">自动保留</label>
                <select
                  v-model.number="draft.cacheMaxSnapshots"
                  class="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="opt in MAX_SNAPSHOTS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div>
                <label class="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">保留天数</label>
                <select
                  v-model.number="draft.retentionDays"
                  class="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="opt in RETENTION_DAYS_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div>
                <label class="text-[11px] text-gray-500 dark:text-gray-400 block mb-1">缓存上限</label>
                <select
                  v-model.number="draft.cacheQuotaBytes"
                  class="w-full border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="opt in CACHE_QUOTA_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
            </div>
            <!-- §3.5 保留策略摘要行（默认配置一目了然，无技术黑话） -->
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              自动保留 {{ draft.cacheMaxSnapshots }} 条 · 保留 {{ draft.retentionDays }} 天 · 缓存 {{ Math.round(draft.cacheQuotaBytes / 1024 / 1024) }} MB
            </p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">仅自动备份受条数限制；手动备份永不自动删除</p>
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
 * 自动备份设置弹框（设计稿 §2.2）。
 * 本地 draft 副本 + 保存时调 svc.updateSettings + svc.setEnabled。
 * 开关 idle 时如缺权限，由 svc 内部 rebindIdleListener 处理；本组件不直接申请权限（P0 简版）。
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

// 备份频次可选项（设计稿 §2.2：5/10/15/30/60 分钟；外加 0=关闭定时与 1/3 兼容旧设置）
// §3.5 默认 10 分钟（普通档）
const TIMER_MINUTES_OPTIONS = [
  { value: 0, label: '关闭定时' },
  { value: 5, label: '5 分钟' },
  { value: 10, label: '10 分钟（默认）' },
  { value: 15, label: '15 分钟' },
  { value: 30, label: '30 分钟' },
  { value: 60, label: '60 分钟' },
] as const

// §3.3 自动保留条数：仅管 auto.* 来源；手动永不删
const MAX_SNAPSHOTS_OPTIONS = [
  { value: 10, label: '10 个' },
  { value: 30, label: '30 个（默认）' },
  { value: 50, label: '50 个' },
  { value: 100, label: '100 个' },
] as const

const RETENTION_DAYS_OPTIONS = [
  { value: 7, label: '7 天（默认）' },
  { value: 14, label: '14 天' },
  { value: 30, label: '30 天' },
  { value: 90, label: '90 天' },
] as const

// §3.4 cacheQuotaBytes 语义重构为 IndexedDB 快照总配额；选项以 MB 为粒度
const MB = 1024 * 1024
const CACHE_QUOTA_OPTIONS = [
  { value: 10 * MB, label: '10 MB' },
  { value: 30 * MB, label: '30 MB（默认）' },
  { value: 50 * MB, label: '50 MB' },
  { value: 80 * MB, label: '80 MB' },
] as const

// 本地草稿（保存时才同步到 svc）——默认值由当前限制档派生（§3.5）
const LIM = currentLimits()
const draft = reactive<Pick<BackupSettings, 'enabled' | 'timerMinutes' | 'eventOnTabRemoved' | 'eventOnWindowRemoved' | 'eventOnIdle' | 'cacheMaxSnapshots' | 'retentionDays' | 'cacheQuotaBytes'>>({
  enabled: false,
  timerMinutes: LIM.defaultTimerMinutes,
  eventOnTabRemoved: true,
  eventOnWindowRemoved: true,
  eventOnIdle: false,
  cacheMaxSnapshots: LIM.autoMaxSnapshots,
  retentionDays: LIM.retentionDays,
  cacheQuotaBytes: LIM.cacheQuotaBytes,
})

const saving = ref(false)

// 打开时同步当前 svc 设置到 draft
watch(() => props.open, (v) => {
  if (v) {
    const s = svc.settings.value
    draft.enabled = s.enabled
    draft.timerMinutes = s.timerMinutes
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
    if (cur.enabled !== draft.enabled) patch.enabled = draft.enabled
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
    // enabled 单独走（内部会 applyTimer）
    if (patch.enabled !== undefined) {
      await svc.setEnabled(patch.enabled)
      delete patch.enabled
    }
    if (Object.keys(patch).length > 0) {
      await svc.updateSettings(patch)
    }
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
