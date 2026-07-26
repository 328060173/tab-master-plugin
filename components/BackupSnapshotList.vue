<template>
  <!--
    Tab1 快照列表 - PRD §4.1 信息层级
    主内容（最新快照 + 立即备份 CTA）首屏可见；次要内容（统计行/历史列表）小字。
    单根（外层 div），避免多根 fallthrough。
  -->
  <div>
    <!-- 【主】最新快照卡 + 立即备份 CTA -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-4">
      <div class="flex items-start gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">最新快照</p>
          <template v-if="snapshots.length">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ snapshots[0].stats.tabCount }} 标签 · {{ snapshots[0].stats.windowCount }} 窗口
            </p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ fmtFull(snapshots[0].createdAt) }} · 来源 {{ sourceLabel(snapshots[0].source) }}
            </p>
          </template>
          <template v-else>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-200">尚未有备份</p>
            <p class="text-xs text-gray-500 mt-0.5">点「立即备份」创建第一个快照。</p>
          </template>
        </div>
        <button
          :disabled="isBackingUp"
          :class="[
            'shrink-0 px-4 py-2 text-sm rounded-lg flex items-center gap-1.5 transition-colors',
            isBackingUp
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          ]"
          @click="onBackupNow"
        >
          <Save :size="14" />
          {{ isBackingUp ? '备份中…' : '立即备份' }}
        </button>
      </div>
      <p v-if="isBackingUp" class="mt-2 text-[11px] text-blue-600 dark:text-blue-400">
        {{ lastProgress || '正在备份…' }}
      </p>
      <p v-if="state.lastBackupError" class="mt-2 text-[11px] text-red-500">
        上次备份失败：{{ state.lastBackupError }}
      </p>
    </div>

    <!-- 【次】统计行 -->
    <div class="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mb-3 px-1 flex-wrap">
      <span>本地缓存 {{ fmtBytes(state.cacheBytes) }}</span>
      <span>·</span>
      <span>目录 {{ fmtBytes(dirMeta.dirBytes) }}</span>
      <span>·</span>
      <span>快照 {{ state.snapshotCount }} 个</span>
      <span>·</span>
      <span>锁定 {{ lockedCount }} 个</span>
      <span class="ml-auto text-gray-400">上限 {{ settings.cacheMaxSnapshots }} 个 / {{ fmtBytes(settings.cacheQuotaBytes) }}</span>
    </div>

    <!-- 配额预警 -->
    <div v-if="quotaWarn" class="mb-3 px-3 py-2 rounded-lg text-[11px] flex items-center gap-2" :class="quotaWarn.cls">
      <span class="flex-1">{{ quotaWarn.msg }}</span>
      <button class="underline" @click="$emit('goSettings')">去设置</button>
    </div>

    <!-- 【次】快照列表 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div v-if="!snapshots.length" class="px-5 py-12 text-center text-xs text-gray-400">
        尚未有备份。点上方「立即备份」创建第一个快照。
      </div>
      <div v-else class="divide-y divide-gray-50 dark:divide-gray-700/50">
        <div
          v-for="s in snapshots"
          :key="s.id"
          class="px-5 py-3 flex items-start gap-3 text-xs"
        >
          <div class="shrink-0 mt-1 w-1.5 h-1.5 rounded-full"
            :class="s.locked ? 'bg-amber-500' : 'bg-blue-500'"></div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-800 dark:text-gray-100">
              {{ fmtFull(s.createdAt) }}
              <span class="ml-1 text-[10px] text-gray-400">来源 {{ sourceLabel(s.source) }}</span>
              <span v-if="s.locked" class="ml-1 text-[10px] text-amber-600">已锁定</span>
              <span v-if="s.label" class="ml-1 text-[10px] text-blue-500">「{{ s.label }}」</span>
            </p>
            <p class="text-gray-500 dark:text-gray-400 mt-0.5">
              {{ s.stats.tabCount }} 标签 · {{ s.stats.windowCount }} 窗口 · {{ s.stats.pinnedCount }} 固定 · {{ s.stats.taggedCount }} 标记 · {{ s.stats.groupCount }} 分组
            </p>
          </div>
          <div class="shrink-0 flex items-center gap-1">
            <button
              class="text-[11px] px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="$emit('preview', s.id)"
            >预览</button>
            <button
              class="text-[11px] px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="$emit('export', s.id)"
            >导出</button>
            <button
              class="text-[11px] px-2 py-1 rounded border border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/30"
              @click="$emit('toggleLock', s.id, !s.locked)"
            >{{ s.locked ? '解锁' : '锁定' }}</button>
            <button
              class="text-[11px] px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
              @click="$emit('delete', s.id)"
            >删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Tab1 快照列表 - 主内容（最新快照 + 立即备份 CTA） + 次要（统计行 + 历史列表）。
 */
import { computed } from "vue"
import { Save } from "@lucide/vue"
import type { SnapshotSource, SnapshotSummary, BackupState, BackupSettings, BackupDirMeta } from "~types/backup"

const props = defineProps<{
  snapshots: SnapshotSummary[]
  state: BackupState
  settings: BackupSettings
  dirMeta: BackupDirMeta
  isBackingUp: boolean
  lastProgress: string
}>()

defineEmits<{
  (e: "backupNow"): void
  (e: "preview", id: string): void
  (e: "export", id: string): void
  (e: "toggleLock", id: string, locked: boolean): void
  (e: "delete", id: string): void
  (e: "goSettings"): void
}>()

const lockedCount = computed(() => props.snapshots.filter((s) => s.locked).length)

const quotaWarn = computed(() => {
  const bytes = props.state.cacheBytes
  const quota = props.settings.cacheQuotaBytes
  if (bytes >= quota) {
    return {
      msg: `本地缓存已达上限（${fmtBytes(bytes)} / ${fmtBytes(quota)}），请清理或升级云同步。`,
      cls: "bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
    }
  }
  if (bytes >= quota * 0.8) {
    return {
      msg: `本地缓存将满（${fmtBytes(bytes)} / ${fmtBytes(quota)}），建议清理或升级云同步。`,
      cls: "bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300",
    }
  }
  return null
})

function fmtBytes(b: number) {
  if (!b || b < 1024) return `${b || 0} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

function fmtFull(ts: number) {
  try {
    const d = new Date(ts)
    const p = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
  } catch {
    return ""
  }
}

function sourceLabel(s: SnapshotSource): string {
  switch (s) {
    case "manual": return "手动"
    case "auto.timer": return "定时"
    case "auto.event": return "事件"
    case "preRestore": return "恢复前"
    case "import": return "导入"
    default: return s
  }
}
</script>
