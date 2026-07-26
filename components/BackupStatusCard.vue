<template>
  <!--
    备份状态条（瘦身版）- 设计稿 §3.2。
    常驻 sidepanel 首页底部，高度 ≤56px：主行（状态点+时间）+ 次行（计数+入口）。
    单根 div：守多根 fallthrough 红线（项目零容忍）。
    4 种状态：未开启 / 已开启正常 / 备份中 / 失败（含目录权限失效合并显示）。
    移除：开关按钮、立即备份按钮、帮助折叠（这些挪独立页）。
    保留：开启入口（触发轻提示弹窗，见 BackupNoticeDialog 块3重写）。
    数据源：useBackupService 单例。
  -->
  <div class="border-t border-gray-100 dark:border-gray-700 px-3 py-2 shrink-0">
    <!-- 主行：状态点 + 状态文本 -->
    <div class="flex items-center gap-1.5 text-xs leading-tight">
      <!-- 状态点：未开启(○灰) / 已开启(●绿) / 备份中(●蓝脉冲) / 失败(⚠红) -->
      <span
        v-if="statusKind === 'off'"
        class="w-1.5 h-1.5 rounded-full border border-gray-400 dark:border-gray-500 shrink-0"
        aria-hidden="true"
      ></span>
      <span
        v-else-if="statusKind === 'ok'"
        class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
        aria-hidden="true"
      ></span>
      <span
        v-else-if="statusKind === 'running'"
        class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0 motion-reduce:animate-none"
        aria-hidden="true"
      ></span>
      <AlertTriangle
        v-else
        :size="12"
        class="text-red-500 shrink-0"
        aria-hidden="true"
      />
      <span
        :class="[
          'min-w-0 truncate',
          statusKind === 'off' ? 'text-gray-700 dark:text-gray-300'
            : statusKind === 'running' ? 'text-blue-600 dark:text-blue-400'
            : statusKind === 'error' ? 'text-red-600 dark:text-red-400'
            : 'text-gray-700 dark:text-gray-200'
        ]"
      >{{ mainText }}</span>
    </div>

    <!-- 次行：计数/提示 + ⇄ + 主入口 -->
    <div class="mt-1 flex items-center gap-1 text-[11px] leading-tight">
      <span class="min-w-0 truncate text-gray-500 dark:text-gray-400">{{ subText }}</span>
      <span class="flex-1"></span>
      <!-- 导入/导出小图标 ⇄（已开启时显示，跳独立页 Tab3） -->
      <button
        v-if="enabled"
        class="inline-flex items-center justify-center min-w-[28px] min-h-[28px] -my-1 px-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="导入或导出备份"
        title="导入 / 导出"
        @click="openIO"
      >
        <ArrowLeftRight :size="12" />
      </button>
      <!-- 主入口：未开启=开启 →；其它=管理 → -->
      <button
        class="inline-flex items-center gap-0.5 min-h-[28px] -my-1 px-1.5 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        :aria-label="enabled ? '打开备份管理' : '开启标签备份'"
        @click="onPrimaryAction"
      >
        <span>{{ enabled ? '管理' : '开启' }}</span>
        <ChevronRight :size="11" />
      </button>
    </div>

    <!-- 首次开启轻提示弹窗（块3重写为 1-2 句建议 + 问号展开） -->
    <BackupNoticeDialog
      :open="noticeOpen"
      @confirm="onNoticeConfirm"
      @cancel="noticeOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 备份状态条（瘦身版）- 设计稿 §3.2 / §7。
 * 仅展示状态 + 入口，所有设置/立即备份/知悉细节都在独立页（tabs/backup.html）。
 * 4 种状态：未开启 / 已开启正常 / 备份中 / 失败（目录权限失效合并）。
 */
import { ref, computed } from "vue"
import { AlertTriangle, ArrowLeftRight, ChevronRight } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { showToast } from "~composables/useToast"
import BackupNoticeDialog from "~components/BackupNoticeDialog.vue"

const svc = useBackupService()
const { enabled, state, dirMeta, isBackingUp, lastProgress, nextBackupAt, snapshots } = svc

const noticeOpen = ref(false)

/** 快照数优先取 snapshots.length（与列表实时一致），fallback state.snapshotCount */
const snapshotCount = computed(() => snapshots.value.length || state.value.snapshotCount || 0)

/** 目录权限失效（需重新授权） */
const dirPermissionLost = computed(
  () => dirMeta.value.permission === "prompt" || dirMeta.value.permission === "denied"
)

type StatusKind = "off" | "ok" | "running" | "error"

/** 状态分类（决定状态点样式 + 主行文案颜色） */
const statusKind = computed<StatusKind>(() => {
  if (!enabled.value) return "off"
  if (isBackingUp.value) return "running"
  if (state.value.lastBackupError || dirPermissionLost.value) return "error"
  return "ok"
})

/** 主行文本 */
const mainText = computed(() => {
  switch (statusKind.value) {
    case "off":
      return "未开启 · 浏览器崩溃将丢失标签数据"
    case "running":
      return lastProgress.value || "正在备份…"
    case "error":
      if (dirPermissionLost.value) return "备份文件夹需重新授权"
      return `上次备份失败 · ${fmtRelative(state.value.lastBackupAt)}`
    case "ok":
    default: {
      if (!state.value.lastBackupAt) return "已开启 · 尚未备份"
      const parts = [`已开启 · 上次 ${fmtRelative(state.value.lastBackupAt)}`]
      if (nextBackupAt.value) parts.push(`下次约 ${fmtRelativeNext(nextBackupAt.value)}`)
      return parts.join(" · ")
    }
  }
})

/** 次行文本 */
const subText = computed(() => {
  switch (statusKind.value) {
    case "off":
      return "建议开启备份"
    case "running":
      return "请稍候…"
    case "error":
      if (dirPermissionLost.value) return "点管理重新授权文件夹"
      return "点管理查看原因并重试"
    case "ok":
    default:
      if (!state.value.lastBackupAt) return "首次备份将很快自动开始"
      return `快照 ${snapshotCount.value} 个`
  }
})

function fmtRelative(ts: number | null) {
  if (!ts) return "刚刚"
  const diff = Date.now() - ts
  if (diff < 60_000) return "刚刚"
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return `${Math.floor(diff / 86_400_000)} 天前`
}

function fmtRelativeNext(ts: number) {
  const diff = ts - Date.now()
  if (diff <= 0) return "即将"
  if (diff < 60_000) return `${Math.floor(diff / 1000)} 秒后`
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟后`
  return `${Math.floor(diff / 3_600_000)} 小时后`
}

/** 主入口点击：未开启→弹轻提示（已 acked 直接开）；其它→跳独立页 */
function onPrimaryAction() {
  if (!enabled.value) {
    // §4.2：已确认过的老用户不再弹窗，直接开
    if (svc.noticeAcked.value) {
      void onNoticeConfirm()
      return
    }
    noticeOpen.value = true
    return
  }
  openManage()
}

async function onNoticeConfirm() {
  noticeOpen.value = false
  try {
    // 标记首次知悉已确认（单 bool，下次不再弹）
    if (!svc.noticeAcked.value) {
      await svc.setNoticeAcked(true)
    }
    await svc.setEnabled(true)
    showToast("已开启标签备份 · 立即创建首个快照")
    void svc.runManualBackup().then((r) => {
      if (r.ok && r.snapshot) {
        const s = r.snapshot.stats
        showToast(`已备份 ${s.tabCount} 标签 · ${s.taggedCount} 标记`)
      }
    })
  } catch (e) {
    console.warn("[BackupStatusCard] 开启失败", e)
    showToast("开启失败，请重试")
  }
}

function openManage() {
  try {
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/backup.html") })
  } catch (e) {
    console.warn("[BackupStatusCard] 打开管理页失败", e)
    showToast("打开管理页失败")
  }
}

function openIO() {
  try {
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/backup.html?tab=io") })
  } catch (e) {
    console.warn("[BackupStatusCard] 打开导入导出失败", e)
    showToast("打开导入导出失败")
  }
}
</script>
