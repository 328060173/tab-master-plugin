<template>
  <!--
    备份状态条（设计稿 §0 整体骨架：顶栏下方 32px 常驻）。
    文案：`● 已开启 · 上次 X · 本地 XMB · N 快照 · 明文本地`
    全页常驻可见，主色按备份健康度（绿/红/蓝脉冲/灰）。
    单根（外层 div），无 props，从 useBackupService 单例取数。
  -->
  <div class="h-8 px-4 flex items-center gap-2 text-[11px] bg-gray-50 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 overflow-hidden">
    <!-- 状态点 -->
    <span
      :class="[
        'w-1.5 h-1.5 rounded-full shrink-0',
        statusDotClass,
      ]"
      :aria-label="statusLabel"
    ></span>

    <span class="font-medium" :class="statusTextClass">{{ statusLabel }}</span>
    <span class="text-gray-300 dark:text-gray-600">·</span>

    <template v-if="enabled">
      <span v-if="state.lastBackupAt">上次 {{ fmtRelative(state.lastBackupAt) }}</span>
      <span v-else>尚未备份</span>
      <span class="text-gray-300 dark:text-gray-600">·</span>
      <span>本地 {{ fmtBytes(state.cacheBytes) }}</span>
      <span class="text-gray-300 dark:text-gray-600">·</span>
      <span>{{ snapshots.length }} 快照</span>
      <span class="text-gray-300 dark:text-gray-600">·</span>
      <span>明文本地</span>
    </template>

    <template v-else>
      <span>未开启自动备份</span>
      <span class="text-gray-300 dark:text-gray-600">·</span>
      <span>{{ snapshots.length }} 快照</span>
      <span class="text-gray-300 dark:text-gray-600">·</span>
      <span>明文本地</span>
    </template>

    <!-- 备份中实时进度（右侧） -->
    <span
      v-if="isBackingUp"
      class="ml-auto inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 truncate"
    >
      <svg class="animate-spin h-3 w-3 motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
      </svg>
      <span class="truncate">{{ lastProgress || '备份中…' }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * 备份状态条（设计稿 §0：顶栏下方 32px 常驻）。
 * 仅呈现，无操作。文案守 §2 术语（禁黑话）。
 */
import { computed } from "vue"
import { useBackupService } from "~composables/useBackupService"

const svc = useBackupService()
const { state, snapshots, isBackingUp, lastProgress, enabled } = svc

const statusDotClass = computed(() => {
  if (isBackingUp.value) return 'bg-blue-500 animate-pulse motion-reduce:animate-none'
  if (!enabled.value) return 'bg-gray-400'
  if (state.value.lastBackupError) return 'bg-red-500'
  if (!state.value.lastBackupAt) return 'bg-amber-500'
  return 'bg-emerald-500'
})

const statusTextClass = computed(() => {
  if (isBackingUp.value) return 'text-blue-600 dark:text-blue-400'
  if (!enabled.value) return 'text-gray-500 dark:text-gray-400'
  if (state.value.lastBackupError) return 'text-red-600 dark:text-red-400'
  if (!state.value.lastBackupAt) return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
})

const statusLabel = computed(() => {
  if (isBackingUp.value) return '备份中'
  if (!enabled.value) return '未开启'
  if (state.value.lastBackupError) return '上次失败'
  if (!state.value.lastBackupAt) return '已开启 · 待备份'
  return '已开启'
})

function fmtRelative(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return `${Math.floor(diff / 86_400_000)} 天前`
}

function fmtBytes(b: number): string {
  if (!b || b < 1024) return `${b || 0} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
</script>
