<template>
  <!--
    备份概览 Tab（设计稿 §1）。
    单根（外层 div）。
    分上中下：3 主按钮 / 状态块 / 趋势图占位 / 广告位主位。
    未开启态：3 卖点 + [开启标签备份] CTA。
  -->
  <div class="space-y-4">
    <!-- 已开启态：3 主按钮 + 状态块 + 趋势 + 广告 -->
    <template v-if="enabled">
      <!-- 3 主按钮（首屏最显眼） -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-2 flex-wrap">
        <button
          :disabled="isBackingUp"
          class="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="emit('open-manual-backup')"
        >
          <Save :size="14" />
          {{ isBackingUp ? '备份中…' : '手动备份' }}
        </button>
        <button
          class="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="emit('open-auto-settings')"
        >
          <Settings :size="14" />
          自动备份设置
        </button>
        <button
          class="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="emit('open-import-restore')"
        >
          <Download :size="14" />
          导入还原
        </button>
      </div>

      <!-- 状态块：备份概览 -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">备份概览</h3>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
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

      <!-- 近 7 天备份趋势（P0 占位，P1 做柱状图） -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">近 7 天备份趋势</h3>
        <div class="h-32 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded">
          趋势图即将完成
        </div>
      </div>

      <!-- 广告位主位 728×90（独立 ErrorBoundary 由父包；延迟加载由父控制） -->
      <ErrorBoundary scope="backup.ad.main">
        <AdSlot
          slot-id="backup-overview-main"
          size="728x90"
          :dismissible="true"
          fallback="placeholder"
        />
      </ErrorBoundary>
    </template>

    <!-- 未开启态：3 卖点 + [开启标签备份] CTA -->
    <template v-else>
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">标签备份能做什么</h2>
        <div class="space-y-3 text-xs">
          <div class="flex items-start gap-2">
            <Shield :size="16" class="mt-0.5 text-blue-500 shrink-0" />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-gray-100">崩溃找回</p>
              <p class="text-gray-600 dark:text-gray-300 mt-0.5">浏览器闪退、手滑关窗、重启清空，都能从最近备份找回整套标签。</p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <LayoutGrid :size="16" class="mt-0.5 text-emerald-500 shrink-0" />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-gray-100">多档还原</p>
              <p class="text-gray-600 dark:text-gray-300 mt-0.5">本窗口还原 / 新窗口还原 / 勾选打开，按你想要的来。</p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <ArrowLeftRight :size="16" class="mt-0.5 text-purple-500 shrink-0" />
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-gray-100">兼容导入</p>
              <p class="text-gray-600 dark:text-gray-300 mt-0.5">可从 OneTab、Nice-Tab、Toby、VertiTab 导入，换工具不丢数据。</p>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <button
            class="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            @click="emit('request-enable')"
          >
            <Shield :size="14" />
            开启标签备份
          </button>
        </div>
      </div>

      <!-- 广告位主位（未开启态也显示） -->
      <ErrorBoundary scope="backup.ad.main">
        <AdSlot
          slot-id="backup-overview-main"
          size="728x90"
          :dismissible="true"
          fallback="placeholder"
        />
      </ErrorBoundary>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * 备份概览 Tab（设计稿 §1）。
 * 已开启态：3 主按钮 + 状态块 + 趋势占位 + 广告位主位
 * 未开启态：3 卖点 + [开启标签备份] CTA + 广告位主位
 * 文案守 §2 术语（禁黑话）。
 */
import { computed } from "vue"
import { Shield, Save, Settings, Download, LayoutGrid, ArrowLeftRight } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import ErrorBoundary from "~components/ErrorBoundary.vue"
import AdSlot from "./AdSlot.vue"

const emit = defineEmits<{
  (e: 'open-manual-backup'): void
  (e: 'open-auto-settings'): void
  (e: 'open-import-restore'): void
  (e: 'request-enable'): void
}>()

const svc = useBackupService()
const { state, snapshots, isBackingUp, enabled, nextBackupAt } = svc

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

function fmtBytes(b: number): string {
  if (!b || b < 1024) return `${b || 0} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
</script>
