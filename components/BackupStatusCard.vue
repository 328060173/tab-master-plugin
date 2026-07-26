<template>
  <!--
    备份入口卡片 - 常驻 sidepanel 首页底部（紧凑态，PRD §4.2 ASCII / §I）。
    单根：避免多根 fallthrough 刷屏崩浏览器（项目零容忍红线）。
    状态数据从 useBackupService 单例读；按钮调服务执行 + toast 反馈。
  -->
  <div class="px-3 py-2 border-t border-gray-100 dark:border-gray-700 shrink-0">
    <div class="flex items-center gap-2">
      <Shield
        :size="14"
        :class="enabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'"
      />
      <span class="text-xs font-medium text-gray-700 dark:text-gray-200">标签备份</span>
      <span v-if="state.lastBackupError" class="w-1.5 h-1.5 rounded-full bg-red-500" title="上次备份失败"></span>
      <span class="flex-1"></span>
      <button
        v-if="!enabled"
        class="text-[11px] px-2 py-0.5 rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        @click="onToggle"
      >
        开启
      </button>
      <button
        v-else
        class="text-[11px] px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        @click="onToggle"
      >
        暂停
      </button>
    </div>

    <!-- 状态行 -->
    <div v-if="enabled" class="mt-1 text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
      <template v-if="isBackingUp">
        <span class="text-blue-600 dark:text-blue-400">{{ lastProgress || '正在备份…' }}</span>
      </template>
      <template v-else-if="state.lastBackupAt">
        上次 {{ fmtRelative(state.lastBackupAt) }}
        <span v-if="nextBackupAt"> · 下次 {{ fmtRelativeNext(nextBackupAt) }}</span>
        · 快照 {{ state.snapshotCount }} 个 · 缓存 {{ fmtBytes(state.cacheBytes) }}
      </template>
      <template v-else>
        已开启，尚未备份
      </template>
      <p v-if="state.lastBackupError" class="text-red-500 mt-0.5">上次备份失败：{{ state.lastBackupError }}</p>
      <p v-if="dirMeta.permission === 'prompt' || dirMeta.permission === 'denied'" class="text-amber-600 dark:text-amber-400 mt-0.5">
        目录权限需重新授权
        <button class="underline ml-1" @click="onReauth">重新授权</button>
      </p>
    </div>
    <div v-else class="mt-1 text-[10px] text-gray-400 leading-relaxed">
      备份已暂停。开启即可保护标签数据。
    </div>

    <!-- 底部操作 -->
    <div class="mt-1.5 flex items-center gap-2">
      <button
        class="text-[11px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-2 hover:underline"
        @click="openManage"
      >管理</button>
      <button
        class="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="这是什么？"
        @click="showHelp = !showHelp"
      >
        <HelpCircle :size="12" />
      </button>
      <span class="flex-1"></span>
      <button
        :disabled="isBackingUp"
        :class="[
          'text-[11px] px-2 py-0.5 rounded transition-colors flex items-center gap-1',
          isBackingUp
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        ]"
        @click="onBackupNow"
      >
        <Save :size="11" />
        {{ isBackingUp ? '备份中…' : '立即备份' }}
      </button>
    </div>

    <!-- 帮助说明（折叠） -->
    <div
      v-if="showHelp"
      class="mt-1.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded text-[10px] leading-relaxed text-blue-800 dark:text-blue-200"
    >
      <p class="mb-0.5"><b>标签备份是什么？</b>把当前所有窗口的标签 + 标记 / 分组 / 稍后 / 设置打包成一个快照存到本机，浏览器崩溃 / 重启 / 误删后可一键恢复。</p>
      <p class="mb-0.5">点「管理」打开管理页查看快照列表与设置。</p>
      <p>🔒 仅本地保存，不上传云端。</p>
    </div>

    <!-- 首次开启 5 条限制告知弹窗（紧凑态触发） -->
    <BackupNoticeDialog
      :open="noticeOpen"
      @confirm="onNoticeConfirm"
      @cancel="noticeOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 备份入口卡片 - sidepanel 首页底部常驻紧凑态。
 * PRD §4.2 ASCII 草图对应实现 + PRD §I 增强（下次时间 + 失败角标 + 重新授权）。
 *
 * 数据源：useBackupService 单例（不侵入 useTabManager）。
 * 错误处理：失败时 toast + 卡片底部红色错误行；不阻塞 sidepanel 其它功能。
 */
import { ref } from "vue"
import { HelpCircle, Save, Shield } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { showToast } from "~composables/useToast"
import BackupNoticeDialog from "~components/BackupNoticeDialog.vue"

const svc = useBackupService()
const { enabled, state, dirMeta, isBackingUp, lastProgress, nextBackupAt } = svc

const showHelp = ref(false)
const noticeOpen = ref(false)

function fmtBytes(b: number) {
  if (!b || b < 1024) return `${b || 0} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

function fmtRelative(ts: number) {
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

async function onToggle() {
  if (!enabled.value) {
    // 开启：先弹首次告知
    if (svc.noticeAck.value.ackedAt && svc.noticeAck.value.items.every((x) => x)) {
      await doEnable()
    } else {
      noticeOpen.value = true
    }
    return
  }
  try {
    await svc.setEnabled(false)
    showToast("已暂停标签备份")
  } catch (e) {
    console.warn("[BackupStatusCard] 切换开关失败", e)
    showToast("切换失败，请重试")
  }
}

async function onNoticeConfirm() {
  noticeOpen.value = false
  await svc.setNoticeAck([true, true, true, true, true])
  await doEnable()
}

async function doEnable() {
  await svc.setEnabled(true)
  showToast("已开启标签备份 · 立即创建首个快照")
  void svc.runManualBackup().then((r) => {
    if (r.ok && r.snapshot) {
      const s = r.snapshot.stats
      showToast(`已备份 ${s.tabCount} 标签 · ${s.taggedCount} 标记`)
    }
  })
}

async function onReauth() {
  const r = await svc.reauthorizeDir()
  showToast(r.ok ? "已重新授权" : r.error || "授权失败")
}

async function onBackupNow() {
  const r = await svc.runManualBackup()
  if (r.ok && r.snapshot) {
    const s = r.snapshot.stats
    showToast(`已备份 ${s.tabCount} 标签 · ${s.taggedCount} 标记`)
  } else {
    showToast(r.error || "备份失败")
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
</script>
