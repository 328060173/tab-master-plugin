<template>
  <!--
    备份概览 Tab（设计稿 §1）。
    单根（外层 div）。
    分上中下：3 主按钮 / 状态块 / 趋势图占位 / 广告位主位。
    未开启态：3 卖点 + [开启标签备份] CTA。
  -->
  <div class="space-y-4">
    <!-- 首次引导块（仅未阅时显示，点「知道了」收起不再出现；导入导出不依赖开启自动备份） -->
    <div
      v-if="!firstVisitAcked"
      class="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg p-5"
    >
      <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">{{ t('backup.comp.overview.welcomeTitle') }}</h2>
      <div class="space-y-3 text-sm">
        <div class="flex items-start gap-2">
          <Shield :size="16" class="mt-0.5 text-blue-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('backup.comp.overview.whatBackup') }}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">{{ t('backup.comp.overview.whatBackupDesc') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <ArrowLeftRight :size="16" class="mt-0.5 text-purple-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('backup.comp.overview.impExpTitle') }}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">{{ t('backup.comp.overview.impExpDesc') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <Settings :size="16" class="mt-0.5 text-gray-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('backup.comp.overview.autoTitle') }}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">{{ t('backup.comp.overview.autoDesc') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <Radio :size="16" class="mt-0.5 text-emerald-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('backup.comp.overview.listenTitle') }}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">{{ t('backup.comp.overview.listenDesc') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <AlertTriangle :size="16" class="mt-0.5 text-amber-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ t('backup.comp.overview.localDataTitle') }}</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">{{ t('backup.comp.overview.localDataDesc') }}</p>
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          class="relative inline-flex items-center gap-1.5 min-h-[36px] px-4 py-2 text-xs rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          @click="emit('ack-first-visit')"
        >
          {{ t('backup.comp.overview.ack') }}
          <!-- 红点：提示用户点此消除所有备份导入导出引导红点 -->
          <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" aria-hidden="true"></span>
        </button>
      </div>
    </div>

    <!-- 4 主按钮（首屏最显眼；不开启自动备份也可用手动/导入/导出） -->
    <!-- 自动备份区：开关 + 设置按钮（任务3：拆成两个独立控件） -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-2 flex-wrap">
      <button
        :disabled="isBackingUp"
        class="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-sm rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="emit('open-manual-backup')"
      >
        <Save :size="16" />
        {{ isBackingUp ? t('backup.comp.overview.backingUp') : t('backup.comp.overview.manualBackup') }}
      </button>

      <!-- 自动备份开关 + 设置按钮（同一行） -->
      <div class="inline-flex items-center gap-2 min-h-[44px] px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600">
        <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('backup.comp.overview.autoBackup') }}</span>
        <button
          :class="[
            'relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500',
            enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
          ]"
          role="switch"
          :aria-checked="enabled"
          :aria-label="t('backup.comp.overview.autoAria')"
          @click="onToggleAutoBackup"
        >
          <span
            class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
            :class="enabled ? 'translate-x-5' : ''"
          ></span>
        </button>
        <button
          class="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="emit('open-auto-settings')"
        >
          <Settings :size="16" />
          {{ t('backup.comp.overview.autoBackupSettings') }}
        </button>
      </div>

      <!-- 自动监听备份（独立开关，与自动备份并行；2026-07-30 重构，需求文档 docs/req/auto-listen-backup.md） -->
      <!-- 独立于自动备份总开关：用户可只开此开关不开自动备份；平时事件驱动落盘 + onStartup 封存 -->
      <div class="inline-flex items-center gap-2 min-h-[44px] px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600">
        <span class="text-xs text-gray-600 dark:text-gray-300">{{ t('backup.comp.overview.listenBackup') }}</span>
        <button
          :class="[
            'relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500',
            listenBackupEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
          ]"
          role="switch"
          :aria-checked="listenBackupEnabled"
          :aria-label="t('backup.comp.overview.listenAria')"
          @click="onToggleListenBackup"
        >
          <span
            class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
            :class="listenBackupEnabled ? 'translate-x-5' : ''"
          ></span>
        </button>
      </div>

      <button
        class="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="emit('open-import')"
      >
        <Upload :size="16" />
        {{ t('backup.comp.overview.importBtn') }}
      </button>
      <button
        class="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="emit('open-export')"
      >
        <Download :size="16" />
        {{ t('backup.comp.overview.exportBtn') }}
      </button>

      <!-- 自动监听备份说明文（独占一行，避免与控件同挤导致窄屏错乱） -->
      <p class="basis-full w-full text-[11px] text-gray-500 dark:text-gray-400 leading-tight -mt-1">
        {{ t('backup.comp.overview.listenDescLong') }}
      </p>
    </div>

    <!-- 状态块：备份概览（常驻展示，未开启自动备份也显示空态/0） -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">{{ t('backup.comp.overview.statusTitle') }}</h3>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div class="flex items-center gap-2">
          <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">{{ t('backup.comp.overview.autoStatus') }}</dt>
          <dd class="flex items-center gap-1.5 text-gray-800 dark:text-gray-100">
            <span
              :class="['w-1.5 h-1.5 rounded-full', isBackingUp ? 'bg-blue-500 animate-pulse motion-reduce:animate-none' : (enabled ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500')]"
              aria-hidden="true"
            ></span>
            {{ isBackingUp ? t('backup.comp.overview.statusBackingUp') : (enabled ? t('backup.comp.overview.statusOn') : t('backup.comp.overview.statusOff')) }}
          </dd>
        </div>
        <!-- 自动监听备份状态（独立于自动备份总开关；显示实时监听标签数） -->
        <div class="flex items-center gap-2">
          <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">{{ t('backup.comp.overview.listenStatus') }}</dt>
          <dd class="flex items-center gap-1.5 text-gray-800 dark:text-gray-100">
            <span
              :class="['w-1.5 h-1.5 rounded-full', listenBackupEnabled ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-500']"
              aria-hidden="true"
            ></span>
            <template v-if="!listenBackupEnabled">{{ t('backup.comp.overview.statusOff') }}</template>
            <template v-else-if="liveSnapshot && liveSnapshot.stats">
              {{ tWithParams('backup.comp.overview.listenOn', { count: liveSnapshot.stats.tabCount ?? 0 }) }}
            </template>
            <template v-else>{{ t('backup.comp.overview.listenSyncing') }}</template>
          </dd>
        </div>
        <div class="flex items-center gap-2">
          <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">{{ t('backup.comp.overview.nextBackup') }}</dt>
          <dd class="text-gray-800 dark:text-gray-100">{{ nextBackupLabel }}</dd>
        </div>
        <div class="flex items-center gap-2">
          <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">{{ t('backup.comp.overview.manualCount') }}</dt>
          <dd class="text-gray-800 dark:text-gray-100">{{ tWithParams('backup.comp.overview.countUnit', { count: manualCount }) }}</dd>
        </div>
        <div class="flex items-center gap-2">
          <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">{{ t('backup.comp.overview.autoCount') }}</dt>
          <dd class="text-gray-800 dark:text-gray-100">{{ tWithParams('backup.comp.overview.countUnit', { count: autoCount }) }}</dd>
        </div>
        <div class="flex items-center gap-2">
          <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">{{ t('backup.comp.overview.listenCount') }}</dt>
          <dd class="text-gray-800 dark:text-gray-100">{{ tWithParams('backup.comp.overview.countUnit', { count: listenCount }) }}</dd>
        </div>
        <div class="flex items-center gap-2">
          <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">{{ t('backup.comp.overview.snapshotCount') }}</dt>
          <dd class="text-gray-800 dark:text-gray-100">{{ tWithParams('backup.comp.overview.countUnit', { count: snapshots.length }) }}</dd>
        </div>
        <div class="flex items-start gap-2 sm:col-span-2">
          <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0 pt-0.5">{{ t('backup.comp.overview.storageTitle') }}</dt>
          <dd class="text-gray-800 dark:text-gray-100 flex-1">
            <p>{{ t('backup.comp.overview.storageLocal') }}</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{{ t('backup.comp.overview.storageCloudHint') }}</p>
          </dd>
        </div>
      </dl>
    </div>

    <!-- §3.3 / §3.2 状态提示条（amber：非阻断，提醒用户；异常态才显示，不常驻） -->
    <div
      v-if="manualOverLimit || lastAutoTruncated || state.lastBackupError"
      class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-1.5"
      role="status"
    >
      <p v-if="manualOverLimit" class="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
        <AlertTriangle :size="14" class="mt-0.5 shrink-0" />
        <span>{{ tWithParams('backup.comp.overview.manualOverLimit', { max: LIM.manualMaxSnapshots }) }}</span>
      </p>
      <p v-if="lastAutoTruncated" class="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
        <AlertTriangle :size="14" class="mt-0.5 shrink-0" />
        <span>{{ tWithParams('backup.comp.overview.autoTruncated', { max: LIM.maxTabsPerSnapshot, backed: lastAutoTruncated.backed, total: lastAutoTruncated.total }) }}</span>
      </p>
      <!-- lastBackupError：配额满/目录写失败等综合状态（含配额 gate 拦截消息） -->
      <p v-if="state.lastBackupError" class="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
        <AlertTriangle :size="14" class="mt-0.5 shrink-0" />
        <span>{{ state.lastBackupError }}</span>
      </p>
    </div>

    <!-- 未开启自动备份时的轻提示 -->
    <!-- 广告位主位 728×90 -->
    <ErrorBoundary scope="backup.ad.main">
      <AdSlot
        slot-id="backup-overview-main"
        size="728x90"
        :ad="getAd('backup-overview')"
        :dismissible="true"
        fallback="placeholder"
      />
    </ErrorBoundary>

    <!-- 自动监听备份首次开启告知弹框（诚实口径，需求文档 §2.4 / §7.1） -->
    <ConfirmDialog
      :open="listenConfirmOpen"
      size="lg"
      :title="t('backup.comp.overview.listenConfirmTitle')"
      :message="listenConfirmMessage"
      :confirm-text="t('backup.comp.overview.listenConfirmOk')"
      :cancel-text="t('backup.comp.autoConfirm.cancel')"
      @confirm="onListenConfirm"
      @cancel="onListenCancel"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 备份概览 Tab（设计稿 §1）。
 * 已开启态：3 主按钮 + 状态块 + 趋势占位 + 广告位主位
 * 未开启态：3 卖点 + [开启标签备份] CTA + 广告位主位
 * 文案守 §2 术语（禁黑话）。
 * 广告数据来自 useBackupPageAd 单例（与左菜单辅位共享同一次请求）。
 */
import { computed, ref } from "vue"
import { Shield, Save, Settings, Download, Upload, ArrowLeftRight, AlertTriangle, Radio } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { useBackupPageAd } from "~composables/useBackupPageAd"
import { currentLimits } from "~types/backup"
import ErrorBoundary from "~components/ErrorBoundary.vue"
import ConfirmDialog from "~components/ConfirmDialog.vue"
import AdSlot from "./AdSlot.vue"
import { t, tWithParams } from "~lib/i18n"

const emit = defineEmits<{
  (e: 'open-manual-backup'): void
  (e: 'open-auto-settings'): void
  (e: 'open-import'): void
  (e: 'open-export'): void
  (e: 'ack-first-visit'): void
  /** 开关 ON：backup.vue 接管开启 + 首次备份 + 跳列表 + 提示框 */
  (e: 'enable-auto'): void
  /** 开关 OFF：backup.vue 调 setEnabled(false) + toast */
  (e: 'disable-auto'): void
}>()

const svc = useBackupService()
const { state, snapshots, isBackingUp, enabled, nextBackupAt, firstVisitAcked, settings, liveSnapshot } = svc
// 广告多槽位：取概览主位广告（backup-overview），adMap 由 backup.vue onMounted 单例 fetchAd 拉取
const { getAd } = useBackupPageAd()

/** 自动监听备份开关（独立于自动备份总开关，绑 settings.listenBackupEnabled） */
const listenBackupEnabled = computed(() => settings.value.listenBackupEnabled)

/**
 * 自动监听备份首次开启告知弹框（诚实口径，需求文档 §2.4 红线）。
 * 开关从 OFF → ON 时弹出，告知能力边界 + 机制；取消则回退不开。
 * 不暗示「关浏览器瞬间备份」（旧方案虚假已废弃）。
 */
const listenConfirmOpen = ref(false)
const listenConfirmMessage = computed(() => t('backup.comp.overview.listenConfirmMsg'))

function onToggleListenBackup() {
  if (listenBackupEnabled.value) {
    // ON → OFF：直接关闭，无需确认
    void svc.updateSettings({ listenBackupEnabled: false }).then(() => {
    }).catch((e) => {
      console.warn('[BackupOverview] 自动监听备份关闭失败', e)
    })
    return
  }
  // OFF → ON：弹告知框，用户确认后才真开启
  listenConfirmOpen.value = true
}

function onListenConfirm() {
  listenConfirmOpen.value = false
  void svc.updateSettings({ listenBackupEnabled: true }).then(() => {
  }).catch((e) => {
    console.warn('[BackupOverview] 自动监听备份开启失败', e)
  })
}

function onListenCancel() {
  listenConfirmOpen.value = false
  // 开关回弹：settings.listenBackupEnabled 未改（仍 false），开关 UI 自动 OFF
}

/** 开关点击：只 emit，由 backup.vue 统一处理开启/关闭逻辑（接管首次备份+跳列表） */
function onToggleAutoBackup() {
  if (enabled.value) {
    emit('disable-auto')
  } else {
    emit('enable-auto')
  }
}

const nextBackupLabel = computed(() => {
  if (!enabled.value) return t('backup.comp.overview.nextNever')
  const ts = nextBackupAt.value
  if (!ts) return t('backup.comp.overview.nextNotSet')
  const diff = ts - Date.now()
  if (diff <= 0) return t('backup.comp.overview.nextSoon')
  if (diff < 60_000) return tWithParams('backup.comp.overview.nextSeconds', { count: Math.floor(diff / 1000) })
  if (diff < 3_600_000) return tWithParams('backup.comp.overview.nextMinutes', { count: Math.floor(diff / 60_000) })
  return tWithParams('backup.comp.overview.nextHours', { count: Math.floor(diff / 3_600_000) })
})

// §3.3 手动备份超 20 条上限提示（不阻断，持续提示让用户清理）
const LIM = currentLimits()
const manualCount = computed(() => snapshots.value.filter((s) => s.source === 'manual').length)
/** 自动备份数量（定时 auto.timer + 事件 auto.event*，不含监听 auto.listen） */
const autoCount = computed(() =>
  snapshots.value.filter((s) => s.source.startsWith('auto.') && s.source !== 'auto.listen').length,
)
/** 监听备份数量（启动封存档 auto.listen） */
const listenCount = computed(() =>
  snapshots.value.filter((s) => s.source === 'auto.listen').length,
)
const manualOverLimit = computed(() => manualCount.value > LIM.manualMaxSnapshots)

// §3.2 上次自动备份截断提示：找最新一条 auto.* 快照，看 stats.truncated
const lastAutoTruncated = computed(() => {
  const autoSnaps = snapshots.value.filter((s) => s.source.startsWith('auto.'))
  if (autoSnaps.length === 0) return null
  // snapshots 已按 createdAt 倒序，取第一条 auto.*
  const latest = autoSnaps[0]
  if (!latest.stats.truncated) return null
  const backed = latest.stats.selectedTabCount ?? latest.stats.tabCount
  const total = latest.stats.totalTabCount ?? latest.stats.tabCount
  return { backed, total }
})
</script>
