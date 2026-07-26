<template>
  <!--
    标签备份独立管理页（Plasmo tabs 页，URL: tabs/backup.html）。
    仿 tabs/logs.vue 范式：全屏 max-w-3xl + sticky header + Tailwind base。
    四个 Tab：①快照列表 ②恢复与冲突 ③导入导出 ④设置。
    信息层级（PRD §4.1）：主内容（最新快照 + 立即备份 CTA）首屏可见居中最大；
                          次要内容（统计行 / 历史列表）折叠 / 小字。
    单根（外层 div），避免多根 fallthrough。
  -->
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <!-- 顶部条 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <Shield :size="18" class="text-blue-600 dark:text-blue-400" />
        <h1 class="text-base font-semibold">TM-标签整理大师 · 标签备份</h1>
        <span class="text-xs text-gray-500 dark:text-gray-300 ml-auto">{{ state.snapshotCount }} 个快照 · {{ fmtBytes(state.cacheBytes) }}</span>
        <button
          class="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          title="帮助"
          @click="showHelp = !showHelp"
        >?</button>
      </div>
      <div v-if="showHelp" class="max-w-3xl mx-auto mt-2 text-[11px] text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded p-2 leading-relaxed">
        <p class="mb-0.5"><b>它是什么？</b>把当前所有窗口的标签 + 标记 / 分组 / 稍后 / 设置打包成快照存到本机。</p>
        <p class="mb-0.5"><b>影响什么？</b>浏览器崩溃 / 重启 / 误删后可一键恢复到任意时间点。</p>
        <p class="mb-0.5"><b>数据存哪？</b>本地缓存（chrome.storage.local）+ 可选用户目录文件。</p>
        <p class="mb-0.5"><b>能否撤销？</b>整体替换恢复有 30s 撤销窗口；其他方式不可撤销。</p>
        <p><b>API 限制？</b>见设置页总开关旁的限制告知弹窗。</p>
      </div>
    </header>

    <!-- 软删撤销条（P1-1 + C4：图标+倒计时+触控目标） -->
    <div v-if="canUndoDelete" class="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-6 py-2">
      <div class="max-w-3xl mx-auto flex items-center gap-3 text-xs">
        <AlertCircle :size="14" class="text-amber-600 dark:text-amber-400 shrink-0" />
        <span class="text-amber-800 dark:text-amber-200 flex-1">已删除快照 · {{ deleteUndoLeftSec }}s 后永久删除</span>
        <button class="px-2.5 py-1.5 min-h-[32px] rounded bg-amber-600 text-white hover:bg-amber-700" @click="onUndoDelete">撤销删除</button>
      </div>
    </div>

    <main class="max-w-3xl mx-auto p-6">
      <!-- 主卡片（设计稿 §3.4）：首屏可见，在 Tab 切换之上常驻。主 CTA = 立即备份 / 开启标签备份 -->
      <section class="mb-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <!-- 已开启态：状态摘要 + 立即备份 + 暂停 -->
        <template v-if="enabled">
          <div class="flex items-start gap-2">
            <span
              :class="[
                'mt-1 w-2 h-2 rounded-full shrink-0',
                isBackingUp ? 'bg-blue-500 animate-pulse motion-reduce:animate-none'
                  : (state.lastBackupError || dirPermissionLost) ? 'bg-red-500'
                  : 'bg-emerald-500'
              ]"
              aria-hidden="true"
            ></span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ mainCardTitle }}
              </p>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {{ mainCardSubtitle }}
              </p>
              <p v-if="state.lastBackupError" class="mt-1 text-xs text-red-600 dark:text-red-400">
                {{ state.lastBackupError }}
              </p>
              <p v-else-if="dirPermissionLost" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                备份文件夹需重新授权
              </p>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <button
              :disabled="isBackingUp"
              :class="[
                'inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
                isBackingUp
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
              @click="onBackupNow"
            >
              <Save :size="13" />
              {{ isBackingUp ? '备份中…' : '立即备份' }}
            </button>
            <button
              :disabled="isBackingUp"
              class="inline-flex items-center min-h-[36px] px-3 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onPauseBackup"
            >
              暂停备份
            </button>
            <span v-if="isBackingUp && lastProgress" class="ml-1 text-[11px] text-blue-600 dark:text-blue-400 truncate">{{ lastProgress }}</span>
          </div>
        </template>

        <!-- 未开启态：「标签备份能做什么」3 条 + [开启标签备份] 唯一主 CTA -->
        <template v-else>
          <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">标签备份能做什么</h2>
          <ul class="mt-2 space-y-1.5 text-xs text-gray-700 dark:text-gray-200">
            <li class="flex items-start gap-1.5">
              <Check :size="13" class="mt-0.5 text-emerald-500 shrink-0" />
              <span>浏览器崩溃/重启后一键恢复所有标签</span>
            </li>
            <li class="flex items-start gap-1.5">
              <Check :size="13" class="mt-0.5 text-emerald-500 shrink-0" />
              <span>误关窗口/标签可找回</span>
            </li>
            <li class="flex items-start gap-1.5">
              <Check :size="13" class="mt-0.5 text-emerald-500 shrink-0" />
              <span>仅本地存储，不上传云端</span>
            </li>
          </ul>
          <div class="mt-3">
            <button
              class="inline-flex items-center gap-1.5 min-h-[36px] px-4 py-1.5 text-xs rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              @click="onRequestEnable"
            >
              <Shield :size="13" />
              开启标签备份
            </button>
          </div>
        </template>
      </section>

      <!-- 撤销恢复条幅（30s 内） -->
      <div v-if="svc.undo.value.preRestoreSnapshot && svc.undo.value.createdAt" class="mb-3 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-[11px] flex items-center gap-2">
        <span class="flex-1 text-amber-700 dark:text-amber-300">
          已恢复 · 撤销窗口剩余 {{ undoLeftSec }}s（恢复前快照：{{ fmtFull(svc.undo.value.preRestoreSnapshot.snapshot.createdAt) }}）
        </span>
        <button class="text-blue-600 underline" @click="onUndoRestore">撤销恢复</button>
      </div>

      <!-- Tab 导航 -->
      <div class="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          v-for="t in tabsWithBadge"
          :key="t.key"
          :class="[
            'px-3 py-1.5 text-xs transition-colors border-b-2 -mb-px',
            activeTab === t.key
              ? 'border-blue-600 text-blue-600 font-medium'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          ]"
          @click="activeTab = t.key"
        >
          {{ t.label }}
          <span v-if="t.badge" class="ml-1 text-xs text-gray-500 dark:text-gray-300">({{ t.badge }})</span>
        </button>
      </div>

      <!-- Tab 1：快照列表（独立 ErrorBoundary，崩了不波及其它 Tab，P1-7） -->
      <ErrorBoundary v-if="activeTab === 'list'" scope="backup.list">
        <BackupSnapshotList
          :snapshots="snapshots"
          :state="state"
          :settings="settings"
          :dir-meta="dirMeta"
          :is-backing-up="isBackingUp"
          :last-progress="lastProgress"
          @backup-now="onBackupNow"
          @preview="onPreview"
          @export="onExportSnapshot"
          @toggle-lock="onToggleLock"
          @delete="onDelete"
          @go-settings="activeTab = 'settings'"
        />
      </ErrorBoundary>

      <!-- Tab 2：恢复与冲突 -->
      <ErrorBoundary v-else-if="activeTab === 'restore'" scope="backup.restore">
        <BackupRestorePanel
          :snapshots="snapshots"
          @restore="onRestoreClick"
        />
      </ErrorBoundary>

      <!-- Tab 3：导入导出 -->
      <ErrorBoundary v-else-if="activeTab === 'io'" scope="backup.io">
        <BackupIOPanel />
      </ErrorBoundary>

      <!-- Tab 4：设置 -->
      <ErrorBoundary v-else scope="backup.settings">
        <BackupSettingsPanel @request-enable="onRequestEnable" />
      </ErrorBoundary>
    </main>

    <!-- 首次开启 5 条限制告知弹窗 -->
    <BackupNoticeDialog
      :open="noticeOpen"
      @confirm="onNoticeConfirm"
      @cancel="noticeOpen = false"
    />

    <!-- 恢复方式三选一弹窗 -->
    <BackupRestoreConfirmDialog
      :open="restoreConfirmOpen"
      :created-at="restoreCreatedAt"
      :tab-count="restoreTabCount"
      :window-count="restoreWindowCount"
      :tagged-count="restoreTaggedCount"
      :incognito-window-count="restoreIncognito"
      @confirm="onRestoreConfirm"
      @cancel="restoreConfirmOpen = false"
    />

    <!-- 本地 toast（backup 是独立 tab，不继承 sidepanel toast） -->
    <Teleport to="body">
      <div v-if="toastMsg" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded shadow-lg max-w-[90vw]">
        {{ toastMsg }}
      </div>
    </Teleport>

    <!-- 恢复中遮罩（P1-9：恢复是破坏性长操作，全屏遮罩+进度，防用户重复操作） -->
    <Teleport to="body">
      <div v-if="restore.isRestoring.value" class="fixed inset-0 z-[150] bg-black/40 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3 shadow-xl">
          <svg class="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
          <span class="text-sm text-gray-700 dark:text-gray-200">正在恢复标签…请勿关闭页面</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 标签备份独立管理页（Plasmo tabs 页，URL: tabs/backup.html）。
 * 入口：sidepanel 首页底部 BackupStatusCard 的「管理」按钮。
 *
 * 四个 Tab：①快照列表 ②恢复与冲突 ③导入导出 ④设置。
 */
import { computed, ref, onMounted, onUnmounted } from "vue"
import { Shield, AlertCircle, Save, Check } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { useBackupRestore } from "~composables/useBackupRestore"
import { useBackupIO } from "~composables/useBackupIO"
import { showToast, useToast } from "~composables/useToast"
import BackupSnapshotList from "~components/BackupSnapshotList.vue"
import BackupRestorePanel from "~components/BackupRestorePanel.vue"
import BackupIOPanel from "~components/BackupIOPanel.vue"
import BackupSettingsPanel from "~components/BackupSettingsPanel.vue"
import BackupNoticeDialog from "~components/BackupNoticeDialog.vue"
import BackupRestoreConfirmDialog from "~components/BackupRestoreConfirmDialog.vue"
import ErrorBoundary from "~components/ErrorBoundary.vue"
import type { RestoreMode } from "~types/backup"

const svc = useBackupService()
const restore = useBackupRestore()
const io = useBackupIO()
const { toastMsg } = useToast()

const { settings, state, snapshots, dirMeta, isBackingUp, lastProgress } = svc

// 主卡片状态摘要（设计稿 §3.4 已开启态）
const enabled = computed(() => svc.enabled.value)
const dirPermissionLost = computed(
  () => dirMeta.value.permission === "prompt" || dirMeta.value.permission === "denied"
)
const mainCardTitle = computed(() => {
  if (isBackingUp.value) return "正在备份…"
  if (state.value.lastBackupError || dirPermissionLost.value) {
    return dirPermissionLost.value ? "备份文件夹需重新授权" : "上次备份失败"
  }
  if (!state.value.lastBackupAt) return "已开启 · 尚未备份"
  return "已开启"
})
const mainCardSubtitle = computed(() => {
  if (isBackingUp.value) return lastProgress.value || "请稍候…"
  if (dirPermissionLost.value) return "点下方管理重新授权文件夹"
  if (state.value.lastBackupError) return "点立即备份重试，或去设置查看原因"
  if (!state.value.lastBackupAt) return "首次备份将很快自动开始"
  const parts = [`上次 ${fmtRelative(state.value.lastBackupAt)}`]
  if (svc.nextBackupAt.value) parts.push(`下次约 ${fmtRelativeNext(svc.nextBackupAt.value)}`)
  parts.push(`快照 ${snapshots.value.length || state.value.snapshotCount} 个`)
  return parts.join(" · ")
})

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

async function onPauseBackup() {
  try {
    await svc.setEnabled(false)
    showToast("已暂停标签备份")
  } catch (e) {
    console.warn("[backup] 暂停失败", e)
    showToast("暂停失败，请重试")
  }
}

// 软删撤销条（P1-1）：undo.deletedSnapshot 存在时显示
const canUndoDelete = computed(() => !!svc.undo.value.deletedSnapshot)
// C4 撤销条倒计时（用 undo.createdAt，30s 窗口）
const deleteUndoLeftSec = computed(() => {
  const u = svc.undo.value
  if (!u.deletedSnapshot || !u.createdAt) return 30
  const left = 30 - Math.floor((now.value - u.createdAt) / 1000)
  return Math.max(0, left)
})

const showHelp = ref(false)
type TabKey = "list" | "restore" | "io" | "settings"
const tabs: { key: TabKey; label: string; badge?: string }[] = [
  { key: "list", label: "快照列表" },
  { key: "restore", label: "恢复与冲突" },
  { key: "io", label: "导入导出" },
  { key: "settings", label: "设置" },
]
const activeTab = ref<TabKey>("list")
// badge 实时计算
const tabsWithBadge = computed(() =>
  tabs.map((t) => ({
    ...t,
    badge: t.key === "list" ? String(state.value.snapshotCount) : undefined,
  }))
)

// 首次开启告知弹窗
const noticeOpen = ref(false)

function onRequestEnable() {
  // 已确认过（单 bool，设计稿 §4.2）→ 直接开；否则弹轻提示弹窗
  if (svc.noticeAcked.value) {
    void doEnable()
  } else {
    noticeOpen.value = true
  }
}

async function onNoticeConfirm() {
  noticeOpen.value = false
  await svc.setNoticeAcked(true)
  await doEnable()
}

async function doEnable() {
  await svc.setEnabled(true)
  showToast("已开启标签备份 · 立即创建首个快照")
  // 触发首次备份
  void svc.runManualBackup().then((r) => {
    if (r.ok && r.snapshot) showToast(`已备份 ${r.snapshot.stats.tabCount} 标签`)
  })
}

// 立即备份
async function onBackupNow() {
  const r = await svc.runManualBackup()
  if (r.ok && r.snapshot) {
    const s = r.snapshot.stats
    showToast(`已备份 ${s.tabCount} 标签 · ${s.taggedCount} 标记`)
  } else {
    showToast(r.error || "备份失败")
  }
}

// 预览（切到 restore tab 并选快照）
function onPreview(_id: string) {
  activeTab.value = "restore"
  showToast("已切换到恢复页，请选择该快照")
}

// 导出
function onExportSnapshot(id: string) {
  activeTab.value = "io"
  // 简单提示去 io tab 操作
  showToast("已切换到导入导出页，请选择该快照导出")
  // 自动选中该快照（BackupIOPanel 内部 v-model 独立，这里仅切换 tab）
  void io.exportSnapshot(id, "json").then((r) => {
    showToast(r.ok ? "已导出" : r.error || "导出失败")
  })
}

// 锁定/解锁
async function onToggleLock(id: string, locked: boolean) {
  const ok = await svc.toggleLock(id, locked)
  showToast(ok ? (locked ? "已锁定 · 此快照将被保留" : "已解锁") : "操作失败")
}

// 删除（软删 30s 可撤销，P1-1）。锁定快照拒绝删除（防误删保留项）。
async function onDelete(id: string) {
  const s = snapshots.value.find((x) => x.id === id)
  if (!s) return
  if (s.locked) {
    showToast("已锁定快照不可删除，请先解锁")
    return
  }
  const hadPrevUndo = !!svc.undo.value.deletedSnapshot
  const ok = await svc.deleteSnapshot(id)
  if (ok) {
    showToast(
      hadPrevUndo
        ? `已删除快照 · 30s 内可撤销（注意：上一次删除已不可撤销）`
        : `已删除快照 · 30s 内点上方"撤销删除"恢复`
    )
  } else {
    showToast("删除失败")
  }
}

// 撤销删除（P1-1）：从 undo.deletedSnapshot 恢复
async function onUndoDelete() {
  const ok = await svc.undoDelete()
  showToast(ok ? "已撤销删除" : "撤销失败")
}

// 恢复
const restoreConfirmOpen = ref(false)
const restoreSnapshotId = ref("")
const restoreCreatedAt = ref(0)
const restoreTabCount = ref(0)
const restoreWindowCount = ref(0)
const restoreTaggedCount = ref(0)
const restoreIncognito = ref(0)

function onRestoreClick(snapshotId: string) {
  const p = restore.preview.value
  if (!p) {
    showToast("请先生成预览")
    return
  }
  restoreSnapshotId.value = snapshotId
  const file = snapshots.value.find((x) => x.id === snapshotId)
  restoreCreatedAt.value = file?.createdAt || 0
  restoreTabCount.value = p.tabCount
  restoreWindowCount.value = p.windowCount
  restoreTaggedCount.value = p.taggedCount
  restoreIncognito.value = p.incognitoWindowCount
  restoreConfirmOpen.value = true
}

async function onRestoreConfirm(mode: RestoreMode) {
  restoreConfirmOpen.value = false
  const r = await restore.execute(restoreSnapshotId.value, mode)
  if (r.ok) {
    const parts: string[] = [`${r.openedCount} 标签`]
    if (r.metaResult) {
      const m = r.metaResult
      if (m.tabTagsRestored) parts.push(`${m.tabTagsRestored} 标记`)
      if (m.laterTabsMerged) parts.push(`${m.laterTabsMerged} 稍后处理`)
      if (m.groupsRestored) parts.push(`${m.groupsRestored} 分组`)
      if (m.tabTagsUnmatched) parts.push(`去指派 ${m.tabTagsUnmatched} 未匹配`)
    }
    if (r.canUndo) parts.push("30s 内可撤销")
    showToast(`已恢复 · ${parts.join(" · ")}`)
  } else {
    showToast(r.error || "恢复失败")
  }
}

// 撤销恢复
async function onUndoRestore() {
  const r = await restore.undoRestore()
  showToast(r.ok ? `已撤销 · 重新打开 ${r.openedCount} 标签` : r.error || "撤销失败")
}

// 撤销窗口倒计时
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

// P0-4: 监听 SW 广播的 backup:changed（其他上下文写完备份后刷新本页列表）
const onBackupChanged = (msg: unknown) => {
  if (!msg || typeof msg !== "object") return
  const type = (msg as { type?: string }).type
  if (type === "backup:changed" || type === "backup:done" || type === "backup:recovered") {
    void svc.loadAll()  // 重新加载快照/状态
  }
}

onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 1000)
  void svc.refreshDirSize()
  chrome.runtime.onMessage.addListener(onBackupChanged)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
  chrome.runtime.onMessage.removeListener(onBackupChanged)
})

const undoLeftSec = computed(() => {
  const u = svc.undo.value
  if (!u.createdAt) return 0
  const left = 30 - Math.floor((now.value - u.createdAt) / 1000)
  return Math.max(0, left)
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
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
:root.fs-normal  { font-size: 16px; }
:root.fs-large   { font-size: 17.5px; }
:root.fs-xlarge  { font-size: 19px; }
/* C1 focus ring（WCAG 2.4.7）：键盘 Tab 可见焦点环，鼠标点击不显示 */
button:focus-visible, select:focus-visible, input:focus-visible, a:focus-visible, [tabindex]:focus-visible, summary:focus-visible {
  outline: 2px solid #3b82f6; /* blue-500 */
  outline-offset: 2px;
  border-radius: 4px;
}
button:focus, select:focus, input:focus, a:focus, summary:focus {
  outline: none;
}
</style>
