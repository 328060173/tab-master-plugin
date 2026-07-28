<template>
  <!--
    标签备份独立管理页（Plasmo tabs 页，URL: tabs/backup.html）。
    重做版（2026-07-27）：左右分栏骨架（左菜单 220px + 右内容 + 顶部状态条 32px）。
    守红线：
    - 单根（外层 div，含 Teleport 收在主根内）
    - 改动隔离：不动 sidepanel/聚焦模式/NavTabs/老 Backup* 组件
    - 防白屏 5 步（compileScript / compileTemplate / vue-tsc / TDZ / 多根扫描）
    - 文案守 §2 术语（用户可见处无技术黑话）
    P0 范围：骨架 + 备份概览 Tab + 手动备份弹框 + 自动备份设置弹框 + pipeline 选部分标签
    P1/P2 留：备份列表表格 / 还原多档 / 导入管理 / 回收站 / 趋势柱状图 / 云同步
  -->
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex flex-col">
    <!-- 顶栏 56px（字号放大后调高） -->
    <header class="h-14 px-4 flex items-center gap-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <Shield :size="22" class="text-blue-600 dark:text-blue-400" />
      <h1 class="font-semibold" style="font-size: xx-large;">标签备份</h1>
      <button
        class="inline-flex items-center justify-center w-9 h-9 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="打开备份说明"
        title="说明"
        @click="helpOpen = true"
      >
        <HelpCircle :size="20" />
      </button>
      <button
        class="ml-auto inline-flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="关闭页面"
        title="关闭"
        @click="onClose"
      >
        <X :size="16" />
      </button>
    </header>

    <!-- 主体：左菜单 + 右内容 -->
    <div class="flex-1 flex min-h-0">
      <BackupSidebar v-model:active-key="activeMenu" />

      <!-- 右内容 -->
      <main class="flex-1 min-w-0 overflow-y-auto">
        <div class="max-w-[960px] mx-auto p-4">
          <!-- 备份管理：顶部 Tab 栏（备份概览 / 备份列表） -->
          <template v-if="activeMenu === 'manage'">
            <div class="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                v-for="t in manageTabs"
                :key="t.key"
                :class="[
                  'px-4 py-2 text-sm transition-colors border-b-2 -mb-px focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t',
                  manageTab === t.key
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200',
                ]"
                @click="manageTab = t.key"
              >
                {{ t.label }}
              </button>
            </div>

            <!-- 备份概览 Tab -->
            <ErrorBoundary v-if="manageTab === 'overview'" scope="backup.overview">
              <BackupOverviewTab
                @open-manual-backup="manualBackupOpen = true"
                @open-auto-settings="autoSettingsOpen = true"
                @open-import="onGoToImportPage"
                @open-export="onOpenExportOverview"
                @ack-first-visit="onAckFirstVisit"
                @enable-auto="onEnableAuto"
                @disable-auto="onDisableAuto"
              />
            </ErrorBoundary>

            <!-- 备份列表 Tab（P1：完整表格 + 查询 + 分页） -->
            <ErrorBoundary v-else scope="backup.list">
              <BackupListTab
                @open-manual-backup="manualBackupOpen = true"
                @open-detail="onOpenDetail"
                @open-export="onOpenExport"
              />
            </ErrorBoundary>
          </template>

          <!-- 云同步开发中（催作者） -->
          <ErrorBoundary v-else-if="activeMenu === 'cloud'" scope="backup.cloud">
            <CloudSyncComingTab />
          </ErrorBoundary>

          <!-- 导入管理（§8.7：导入区+预览区） -->
          <ErrorBoundary v-else-if="activeMenu === 'import'" scope="backup.import">
            <BackupImportTab />
          </ErrorBoundary>
        </div>
      </main>
    </div>


    <!-- 手动备份弹框 -->
    <ManualBackupDialog
      ref="manualBackupDialogRef"
      :open="manualBackupOpen"
      @confirm="onManualBackupConfirm"
      @cancel="manualBackupOpen = false"
    />

    <!-- 自动备份设置弹框 -->
    <AutoBackupSettingsDialog
      :open="autoSettingsOpen"
      @saved="autoSettingsOpen = false"
      @cancel="autoSettingsOpen = false"
    />

    <!-- 「开启自动备份」确认框（开关 ON → 弹框 → 确认才真开启） -->
    <AutoBackupConfirmDialog
      :open="autoConfirmOpen"
      :timer-minutes="autoConfirmSettings.timerMinutes"
      :event-on-tab-removed="autoConfirmSettings.eventOnTabRemoved"
      :event-on-window-removed="autoConfirmSettings.eventOnWindowRemoved"
      :event-on-idle="autoConfirmSettings.eventOnIdle"
      :cache-max-snapshots="autoConfirmSettings.cacheMaxSnapshots"
      :retention-days="autoConfirmSettings.retentionDays"
      @confirm="onAutoConfirm"
      @cancel="onAutoCancel"
    />

    <!-- 备份详情弹框（P1） -->
    <BackupDetailDialog
      :open="detailDialogOpen"
      :snapshot-id="detailSnapshotId"
      @cancel="detailDialogOpen = false"
      @restored="onDetailRestored"
    />

    <!-- 导出当前标签弹框（概览「导出」用：抓当前浏览器标签 → 勾选 → JSON 大面板） -->
    <ExportCurrentDialog
      :open="exportCurrentOpen"
      @cancel="exportCurrentOpen = false"
    />

    <!-- JSON 串查看弹框（导出"展示 JSON 串"去向）：大面板，占满屏幕，方便阅读+复制 -->
    <Teleport to="body">
      <div
        v-if="jsonViewOpen"
        class="fixed inset-0 z-[130] bg-black/40 flex items-center justify-center p-4"
        @click.self="jsonViewOpen = false"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="json-view-title"
          tabindex="-1"
          @keydown.esc="jsonViewOpen = false"
        >
          <div class="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
            <h2 id="json-view-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
              数据<span v-if="jsonViewLabel"> · {{ jsonViewLabel }}</span>
            </h2>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1.5 min-h-[32px] text-xs rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="onDownloadJsonView"
              >下载到文件夹</button>
              <button
                class="px-3 py-1.5 min-h-[32px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="onCopyJsonView"
              >复制全部</button>
              <button
                class="inline-flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="关闭"
                @click="jsonViewOpen = false"
              >
                <X :size="16" />
              </button>
            </div>
          </div>
          <div class="px-5 pb-4 flex-1 overflow-y-auto">
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-2">完整数据，可复制或点右上「复制全部」：</p>
            <textarea
              ref="jsonViewTextareaRef"
              class="w-full border border-gray-200 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900/40 text-xs font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              :style="{ height: jsonViewTextareaHeight }"
              readonly
              :value="jsonViewContent"
              aria-label="完整数据串"
            ></textarea>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 本地 toast -->
    <Teleport to="body">
      <div
        v-if="toastMsg"
        class="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded shadow-lg max-w-[90vw]"
      >
        {{ toastMsg }}
      </div>
    </Teleport>

    <!-- 备份说明大弹窗 -->
    <BackupHelpDialog :open="helpOpen" @cancel="helpOpen = false" />
  </div>
</template>

<script setup lang="ts">
/**
 * 标签备份独立管理页（重做版）。
 * 入口：sidepanel 首页 BackupStatusCard「管理」按钮 → chrome.tabs.create(runtime.getURL('tabs/backup.html'))。
 *
 * P0 范围：
 * - 左右分栏骨架（左菜单 4 项 + 右内容顶部 Tab）
 * - 备份概览 Tab：3 主按钮 + 状态块 + 趋势占位 + 广告位
 * - 手动备份弹框（选标签 + 备注，§10.8 选部分标签）
 * - 自动备份设置弹框（开关/频次/事件/保留）
 * - pipeline 加 selectedTabIds 子集参数（默认全量，不动现有调用方）
 * P1/P2 留：备份列表表格 / 还原多档 / 导入管理 / 回收站 / 趋势柱状图 / 云同步
 */
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue"
import { Shield, X, HelpCircle } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { useBackupPageAd } from "~composables/useBackupPageAd"
import { showToast, useToast } from "~composables/useToast"
import { filterBackupableTabs, NO_TABS_HINT } from "~lib/backup/urlFilter"
import BackupSidebar, { type BackupMenuKey } from "~components/backup/BackupSidebar.vue"
import BackupOverviewTab from "~components/backup/BackupOverviewTab.vue"
import BackupListTab from "~components/backup/BackupListTab.vue"
import BackupImportTab from "~components/backup/BackupImportTab.vue"
import CloudSyncComingTab from "~components/backup/CloudSyncComingTab.vue"
import BackupDetailDialog from "~components/backup/BackupDetailDialog.vue"
import ExportCurrentDialog from "~components/backup/ExportCurrentDialog.vue"
import ManualBackupDialog from "~components/backup/ManualBackupDialog.vue"
import AutoBackupSettingsDialog from "~components/backup/AutoBackupSettingsDialog.vue"
import AutoBackupConfirmDialog from "~components/backup/AutoBackupConfirmDialog.vue"
import BackupHelpDialog from "~components/backup/BackupHelpDialog.vue"
import ErrorBoundary from "~components/ErrorBoundary.vue"

const svc = useBackupService()
const { toastMsg } = useToast()
// 独立页广告：单例，左菜单辅位 + 概览主位共享同一次请求
const backupPageAd = useBackupPageAd()

// 左菜单当前选中项（默认备份管理）
const activeMenu = ref<BackupMenuKey>('manage')

// 备份管理下两个 Tab
type ManageTab = 'overview' | 'list'
const manageTabs: { key: ManageTab; label: string }[] = [
  { key: 'overview', label: '备份概览' },
  { key: 'list', label: '备份列表' },
]
const manageTab = ref<ManageTab>('overview')

// ===== URL query 路由持久化（?page=overview|list|import|cloud）=====
// 当前页路由 key（基于 activeMenu + manageTab 推导）
type PageRoute = 'overview' | 'list' | 'import' | 'cloud'
const currentRoute = computed<PageRoute>(() => {
  if (activeMenu.value === 'import') return 'import'
  if (activeMenu.value === 'cloud') return 'cloud'
  // manage 下分 overview / list
  return manageTab.value === 'list' ? 'list' : 'overview'
})

// 内部驱动标记：onMounted 解析 ?page= 时设 true，避免 watch 又写回 URL 造成循环
let routeHydrated = false
watch(currentRoute, (r) => {
  if (!routeHydrated) return
  if (history.replaceState) {
    history.replaceState(null, '', location.pathname + '?page=' + r)
  }
  // 切 tab 重新拉广告（异步不阻塞业务，报错/超时静默显占位）。
  // 首次挂载由 onMounted 调一次；此后每次切 overview/list/import/cloud 都刷新。
  void backupPageAd.fetchAd()
})

// 弹框开关
const manualBackupOpen = ref(false)
const autoSettingsOpen = ref(false)
const helpOpen = ref(false)
// 任务 3.3：开启自动备份确认框（开关 ON → 弹框 → 确认才真开启 + 首次备份；取消则开关回弹）
const autoConfirmOpen = ref(false)
const autoConfirmSettings = reactive({
  timerMinutes: 10,
  eventOnTabRemoved: true,
  eventOnWindowRemoved: true,
  eventOnIdle: false,
  cacheMaxSnapshots: 30,
  retentionDays: 7,
})

// 详情弹框（P1）
const detailDialogOpen = ref(false)
const detailSnapshotId = ref<string | null>(null)

// 导出当前标签弹框（概览「导出」用：抓当前浏览器标签，不选历史快照）
const exportCurrentOpen = ref(false)


// JSON 串查看弹框（导出"展示 JSON 串"去向）
const jsonViewOpen = ref(false)
const jsonViewContent = ref('')
const jsonViewLabel = ref<string | null>(null)
const jsonViewTextareaRef = ref<HTMLTextAreaElement | null>(null)

// 手动备份弹框 ref（用于重置 submitting 态）
const manualBackupDialogRef = ref<InstanceType<typeof ManualBackupDialog> | null>(null)

// ===== 首次引导「知道了」=====
async function onAckFirstVisit() {
  await svc.setFirstVisitAcked(true)
}

// ===== 概览页自动备份开关（任务 3.3：开关 ON → 弹确认框 → 确认才真开启）=====
// 开关绑的 enabled 来自 svc.enabled（只读 computed 基于 settings.enabled）。
// onEnableAuto 不调 setEnabled，enabled.value 仍为 false，开关 UI 保持 OFF。
// 用户点「确认开启」才 setEnabled(true) → enabled 变 true → 开关 ON。
// 点「取消」开关自动回弹（因 enabled 未改）。
async function onEnableAuto() {
  // 填充当前设置到确认框
  const s = svc.settings.value
  autoConfirmSettings.timerMinutes = s.timerMinutes
  autoConfirmSettings.eventOnTabRemoved = s.eventOnTabRemoved
  autoConfirmSettings.eventOnWindowRemoved = s.eventOnWindowRemoved
  autoConfirmSettings.eventOnIdle = s.eventOnIdle
  autoConfirmSettings.cacheMaxSnapshots = s.cacheMaxSnapshots
  autoConfirmSettings.retentionDays = s.retentionDays
  autoConfirmOpen.value = true
  // 不调 doEnableAuto —— 等用户确认
}

function onAutoConfirm() {
  autoConfirmOpen.value = false
  void doEnableAuto()
}

function onAutoCancel() {
  autoConfirmOpen.value = false
  // 开关回弹：enabled 未改（仍 false），开关 UI 自动 OFF
}

async function doEnableAuto() {
  try {
    await svc.setEnabled(true)
    // 标记已确认
    await svc.setNoticeAcked(true)
    // 0 标签阻断（2026-07-28 立）：开启自动备份时若无可备份标签，
    // 仍保留 enabled=true 设置（尊重用户意图），但不执行第一次备份，toast 提示。
    const allTabs = await chrome.tabs.query({})
    if (filterBackupableTabs(allTabs).length === 0) {
      showToast(NO_TABS_HINT)
      return
    }
    // 立即触发第一次自动备份（source=auto.event.startup → 列表显示「自动备份」）
    // runBackup 内部已刷新 snapshots.value（pipeline.ts），再 loadAll 兜底刷新 state/dirMeta
    void svc.runBackup('auto.event.startup').then((r) => {
      if (r.ok && r.snapshot) {
        const n = r.snapshot.stats.selectedTabCount ?? r.snapshot.stats.tabCount
        showToast(`已开启自动备份 · 第一次备份 ${n} 标签`)
        // 跳列表 + 刷新（任务 4：用户能在列表看到新备份）
        manageTab.value = 'list'
        void svc.loadAll()
      } else if (!r.ok) {
        showToast(r.error || '第一次自动备份失败，请重试')
      }
    }).catch(() => showToast('第一次自动备份失败，请重试'))
    // 兜底 1.5s 后强制刷新（防 then 时序/单例 ref 延迟，列表必出新备份）
    setTimeout(() => { void svc.loadAll() }, 1500)
  } catch (e) {
    console.warn('[backup] 开启自动备份失败', e)
    showToast('开启自动备份失败，请重试')
  }
}

async function onDisableAuto() {
  try {
    await svc.setEnabled(false)
    showToast('已关闭自动备份')
  } catch (e) {
    console.warn('[backup] 关闭自动备份失败', e)
    showToast('关闭自动备份失败，请重试')
  }
}

// ===== 手动备份弹框 =====
async function onManualBackupConfirm(payload: { tabIds: number[]; label: string | null }) {
  try {
    // §10.8：传 selectedTabIds 子集；不传 = 全量。这里只传用户选的。
    const r = await svc.runManualBackup({ selectedTabIds: payload.tabIds })
    if (r.ok && r.snapshot) {
      const s = r.snapshot.stats
      // 写备注（如有）
      if (payload.label) {
        await svc.setSnapshotLabel(r.snapshot.id, payload.label)
      }
      // 文案：「已备份 N 标签」（N = 选中数；不显示总数避免误导）
      const n = s.selectedTabCount ?? s.tabCount
      showToast(`已备份 ${n} 标签`)
      // 关弹框 + 跳备份列表 Tab（P0 备份列表是占位，跳了先显占位）
      manualBackupOpen.value = false
      manageTab.value = 'list'
      // 任务 3：强制刷新备份列表（pipeline 内部 snapshots.value 赋值时序不可靠，loadAll 兜底从 IDB 重读）
      void svc.loadAll()
      // 1.5s 后再刷一次，防 then 时序/单例 ref 延迟生效
      setTimeout(() => { void svc.loadAll() }, 1500)
    } else {
      showToast(r.error || '备份失败')
    }
  } catch (e) {
    console.warn('[backup] 手动备份失败', e)
    showToast('备份失败，请重试')
  } finally {
    // 重置弹框 submitting 态（关闭/失败都要复位）
    manualBackupDialogRef.value?.resetSubmitting()
  }
}

// ===== 导入：统一跳导入管理页（/backup.html?page=import） =====
function onGoToImportPage() {
  activeMenu.value = 'import'
  if (history.replaceState) {
    history.replaceState(null, '', location.pathname + '?page=import')
  }
}

// ===== 备份详情弹框（P1） =====
function onOpenDetail(snapshotId: string) {
  detailSnapshotId.value = snapshotId
  detailDialogOpen.value = true
}

function onDetailRestored() {
  // 详情弹框内勾选还原成功后，可选关闭；这里保留弹框让用户继续操作
  // 仅刷新数据（svc 已通过 storage.onChanged / backup:changed 同步）
  void svc.loadAll()
}

// ===== 导出弹框（P1） =====
async function onOpenExport(snapshotId: string, label: string | null) {
  // 列表导出：读快照 → 统一 serializeBackupJson → 大面板（复制/下载）
  try {
    const file = await svc.getSnapshotFile(snapshotId)
    if (!file) {
      showToast('备份不存在')
      return
    }
    // 0 标签阻断（2026-07-28 立）：历史空快照（0 标签）导出也 toast 阻断，不写空文件。
    const tabCount = file.snapshot.stats?.tabCount ?? 0
    if (tabCount === 0) {
      showToast(NO_TABS_HINT)
      return
    }
    const { serializeBackupJson } = await import('~lib/backup/exporters')
    jsonViewContent.value = serializeBackupJson(file)
    jsonViewLabel.value = label
    jsonViewOpen.value = true
  } catch (e) {
    console.warn('[backup] 导出失败', e)
    showToast('导出失败，请重试')
  }
}

/** 概览导出：抓当前浏览器标签（不选历史快照），开 ExportCurrentDialog */
function onOpenExportOverview() {
  exportCurrentOpen.value = true
}

function onDisplayJson(content: string, label: string | null) {
  jsonViewContent.value = content
  jsonViewLabel.value = label
  jsonViewOpen.value = true
}

/** 数据面板 textarea 高度：按内容行数估算，自适应，封顶 70vh 滚动 */
const jsonViewTextareaHeight = computed(() => {
  if (!jsonViewContent.value) return '200px'
  const lines = jsonViewContent.value.split('\n').length
  const est = lines * 18 + 24
  const max = Math.floor(window.innerHeight * 0.7)
  return `${Math.min(Math.max(est, 200), max)}px`
})

/** 下载当前数据面板内容到文件 */
async function onDownloadJsonView() {
  try {
    const { downloadExportWithPicker } = await import('~lib/backup/exporters')
    const out = {
      fileName: `tabmaster-export-${isoNow()}.json`,
      mime: 'application/json',
      content: jsonViewContent.value,
    }
    const r = await downloadExportWithPicker(out)
    if (r.ok) {
      showToast(r.fallback ? '已下载到默认目录' : '已导出到所选位置')
    } else if (r.error && r.error !== '用户取消') {
      showToast(r.error || '下载失败')
    }
  } catch (e) {
    console.warn('[backup] 下载失败', e)
    showToast('下载失败，请重试')
  }
}

function isoNow(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

function onCopyJsonView() {
  const ta = jsonViewTextareaRef.value
  if (!ta) return
  ta.select()
  try {
    const ok = document.execCommand('copy')
    if (ok) {
      showToast('已复制到剪贴板')
      return
    }
  } catch (e) {
    console.warn('[backup] 复制失败', e)
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonViewContent.value).then(
      () => showToast('已复制到剪贴板'),
      () => showToast('复制失败，请手动全选复制'),
    )
  } else {
    showToast('复制失败，请手动全选复制')
  }
}

// ===== 关闭页面 =====
function onClose() {
  window.close()
}

// ===== SW 广播：备份变化时刷新状态 =====
const onBackupChanged = (msg: unknown) => {
  if (!msg || typeof msg !== 'object') return
  const type = (msg as { type?: string }).type
  if (type === 'backup:changed' || type === 'backup:done' || type === 'backup:recovered') {
    void svc.loadAll()
  }
}

onMounted(() => {
  chrome.runtime.onMessage.addListener(onBackupChanged)
  // 进入备份页即异步拉广告（不阻塞业务，报错/超时静默显占位）。
  // 此处负责首次挂载拉取；此后切 Tab（overview/list/import/cloud）由 watch(currentRoute) 触发刷新。
  void backupPageAd.fetchAd()
  // 解析 URL query：
  // - ?page=overview|list|import|cloud 定位页面（刷新可恢复当前 Tab）
  // - ?action=manual|auto|import|export|manage 一次性触发弹框（兼容旧逻辑，解析后清掉 action）
  // 两者可同时存在：page 定位页面、action 开弹框
  try {
    const params = new URLSearchParams(location.search)
    const page = params.get('page')
    if (page === 'list') { activeMenu.value = 'manage'; manageTab.value = 'list' }
    else if (page === 'import') { activeMenu.value = 'import' }
    else if (page === 'cloud') { activeMenu.value = 'cloud' }
    // 'overview' / 无 page → 默认概览（activeMenu='manage' + manageTab='overview' 已是初始值）

    const action = params.get('action')
    if (action === 'manual') manualBackupOpen.value = true
    else if (action === 'auto') autoSettingsOpen.value = true
    else if (action === 'import') { activeMenu.value = 'import'; manageTab.value = 'overview' }
    else if (action === 'export') void onOpenExportOverview()
    // 2026-07-28：manage 跳概览（与 sidepanel openBackupPage pageMap 对齐）
    else if (action === 'manage') { activeMenu.value = 'manage'; manageTab.value = 'overview' }

    // 解析后写回 ?page=（清掉 action 一次性参数，保留 page 供刷新恢复）
    if (history.replaceState) {
      history.replaceState(null, '', location.pathname + '?page=' + currentRoute.value)
    }
  } catch (e) {
    console.warn('[backup] 解析 URL query 失败', e)
  } finally {
    // hydration 完成，后续 currentRoute 变化才同步到 URL
    routeHydrated = true
  }
})
onUnmounted(() => {
  chrome.runtime.onMessage.removeListener(onBackupChanged)
})
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
