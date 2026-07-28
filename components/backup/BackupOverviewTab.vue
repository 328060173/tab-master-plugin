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
      <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">欢迎使用标签备份</h2>
      <div class="space-y-3 text-sm">
        <div class="flex items-start gap-2">
          <Shield :size="16" class="mt-0.5 text-blue-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">标签备份能做什么</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">浏览器闪退、手滑关窗、重启清空，都能从最近备份找回整套标签。多档还原：本窗口 / 新窗口 / 勾选打开。</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <ArrowLeftRight :size="16" class="mt-0.5 text-purple-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">导入 / 导出能干什么</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">把当前标签导出成数据文件备份或转移；可从本插件数据或 OneTab 导入。不开启自动备份也能用。</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <Settings :size="16" class="mt-0.5 text-gray-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">自动备份（可选）</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">开启后定时自动备份，崩溃也能找回。不想自动备份就别开，手动备份 / 导入 / 导出照常能用。</p>
          </div>
        </div>
        <div class="flex items-start gap-2">
          <AlertTriangle :size="16" class="mt-0.5 text-amber-500 shrink-0" />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100">数据存在本地，注意保留</p>
            <p class="text-gray-600 dark:text-gray-300 mt-0.5">备份存在本浏览器内，插件被卸载或删除时本地存储会一起清空，备份会丢失。想长期保留请用「导出」存成数据文件保存到电脑，需要时「导入」恢复。</p>
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          class="relative inline-flex items-center gap-1.5 min-h-[36px] px-4 py-2 text-xs rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          @click="emit('ack-first-visit')"
        >
          知道了
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
        {{ isBackingUp ? '备份中…' : '手动备份' }}
      </button>

      <!-- 自动备份开关 + 设置按钮（同一行） -->
      <div class="inline-flex items-center gap-2 min-h-[44px] px-3 py-1.5 rounded border border-gray-200 dark:border-gray-600">
        <span class="text-xs text-gray-600 dark:text-gray-300">自动备份</span>
        <button
          :class="[
            'relative w-11 h-6 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500',
            enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
          ]"
          role="switch"
          :aria-checked="enabled"
          aria-label="自动备份开关"
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
          自动备份设置
        </button>
      </div>

      <button
        class="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="emit('open-import')"
      >
        <Upload :size="16" />
        导入
      </button>
      <button
        class="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="emit('open-export')"
      >
        <Download :size="16" />
        导出
      </button>
    </div>

    <!-- 已开启：状态块 + 提示条 + 趋势图 -->
    <template v-if="enabled">
      <!-- 状态块：备份概览 -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">备份概览</h3>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div class="flex items-center gap-2">
            <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">自动备份状态</dt>
            <dd class="flex items-center gap-1.5 text-gray-800 dark:text-gray-100">
              <span
                :class="['w-1.5 h-1.5 rounded-full', isBackingUp ? 'bg-blue-500 animate-pulse motion-reduce:animate-none' : 'bg-emerald-500']"
                aria-hidden="true"
              ></span>
              {{ isBackingUp ? '备份中' : '已开启' }}
            </dd>
          </div>
          <div class="flex items-center gap-2">
            <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">下次备份时间</dt>
            <dd class="text-gray-800 dark:text-gray-100">{{ nextBackupLabel }}</dd>
          </div>
          <div class="flex items-center gap-2">
            <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">备份数量</dt>
            <dd class="text-gray-800 dark:text-gray-100">{{ snapshots.length }} 个</dd>
          </div>
          <div class="flex items-center gap-2">
            <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0">备份占用</dt>
            <dd class="text-gray-800 dark:text-gray-100">本地 {{ fmtBytes(state.cacheBytes) }}</dd>
          </div>
          <div class="flex items-start gap-2 sm:col-span-2">
            <dt class="text-gray-500 dark:text-gray-400 w-24 shrink-0 pt-0.5">备份存储</dt>
            <dd class="text-gray-800 dark:text-gray-100 flex-1">
              <p>本地（浏览器内）· 明文存储</p>
              <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">云同步加密将于后续版本上线</p>
            </dd>
          </div>
        </dl>
      </div>

      <!-- §3.3 / §3.2 状态提示条（amber：非阻断，提醒用户） -->
      <div
        v-if="manualOverLimit || lastAutoTruncated || state.lastBackupError"
        class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-1.5"
        role="status"
      >
        <p v-if="manualOverLimit" class="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle :size="14" class="mt-0.5 shrink-0" />
          <span>手动备份已达 {{ LIM.manualMaxSnapshots }} 条上限，请清理之前的手动备份后继续。手动备份不会被自动删除。</span>
        </p>
        <p v-if="lastAutoTruncated" class="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle :size="14" class="mt-0.5 shrink-0" />
          <span>上次自动备份截断：标签数超过上限 {{ LIM.maxTabsPerSnapshot }}，仅备份了 {{ lastAutoTruncated.backed }} / {{ lastAutoTruncated.total }} 个。</span>
        </p>
        <!-- lastBackupError：配额满/目录写失败等综合状态（含配额 gate 拦截消息） -->
        <p v-if="state.lastBackupError" class="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle :size="14" class="mt-0.5 shrink-0" />
          <span>{{ state.lastBackupError }}</span>
        </p>
      </div>

      <!-- 近 7 天备份趋势（P1：柱状图） -->
      <BackupTrendChart />
    </template>

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
import { computed } from "vue"
import { Shield, Save, Settings, Download, Upload, ArrowLeftRight, AlertTriangle } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { useBackupPageAd } from "~composables/useBackupPageAd"
import { currentLimits } from "~types/backup"
import ErrorBoundary from "~components/ErrorBoundary.vue"
import AdSlot from "./AdSlot.vue"
import BackupTrendChart from "./BackupTrendChart.vue"

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
const { state, snapshots, isBackingUp, enabled, nextBackupAt, firstVisitAcked } = svc
// 广告多槽位：取概览主位广告（backup-overview），adMap 由 backup.vue onMounted 单例 fetchAd 拉取
const { getAd } = useBackupPageAd()

/** 开关点击：只 emit，由 backup.vue 统一处理开启/关闭逻辑（接管首次备份+跳列表） */
function onToggleAutoBackup() {
  if (enabled.value) {
    emit('disable-auto')
  } else {
    emit('enable-auto')
  }
}

const nextBackupLabel = computed(() => {
  if (!enabled.value) return '未开启自动备份'
  const ts = nextBackupAt.value
  if (!ts) return '未设定'
  const diff = ts - Date.now()
  if (diff <= 0) return '即将'
  if (diff < 60_000) return `${Math.floor(diff / 1000)} 秒后`
  if (diff < 3_600_000) return `约 ${Math.floor(diff / 60_000)} 分钟后`
  return `约 ${Math.floor(diff / 3_600_000)} 小时后`
})

// §3.3 手动备份超 20 条上限提示（不阻断，持续提示让用户清理）
const LIM = currentLimits()
const manualCount = computed(() => snapshots.value.filter((s) => s.source === 'manual').length)
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

function fmtBytes(b: number): string {
  if (!b || b < 1024) return `${b || 0} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
</script>
