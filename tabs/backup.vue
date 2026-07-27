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
    <!-- 顶栏 40px -->
    <header class="h-10 px-4 flex items-center gap-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <Shield :size="16" class="text-blue-600 dark:text-blue-400" />
      <h1 class="text-sm font-semibold">标签备份</h1>
      <button
        class="ml-auto inline-flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="关闭页面"
        title="关闭"
        @click="onClose"
      >
        <X :size="16" />
      </button>
    </header>

    <!-- 状态条 32px（顶部，全页常驻） -->
    <BackupStatusBar />

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
                  'px-3 py-1.5 text-xs transition-colors border-b-2 -mb-px focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t',
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
                @open-import="importDialogOpen = true"
                @open-export="onOpenExportOverview"
                @request-enable="onRequestEnable"
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

          <!-- 云同步占位 -->
          <div v-else-if="activeMenu === 'cloud'" class="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <Cloud :size="24" class="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p class="text-xs text-gray-500 dark:text-gray-400">云同步即将上线</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">多设备同步 · 端到端加密 · 会员功能（阶段二）</p>
          </div>

          <!-- 导入管理（§8.7：导入区+预览区+导入记录列表） -->
          <ErrorBoundary v-else-if="activeMenu === 'import'" scope="backup.import">
            <BackupImportTab
              ref="importTabRef"
              @imported="onImported"
            />
          </ErrorBoundary>

          <!-- 回收站占位 -->
          <div v-else-if="activeMenu === 'trash'" class="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
            <Trash2 :size="24" class="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p class="text-xs text-gray-500 dark:text-gray-400">回收站即将完成</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-1">软删 30s 撤销走备份列表 toast，独立回收站列表后续补</p>
          </div>
        </div>
      </main>
    </div>

    <!-- 首次开启知悉弹窗（复用现有组件，零回归） -->
    <BackupNoticeDialog
      :open="noticeOpen"
      @confirm="onNoticeConfirm"
      @cancel="noticeOpen = false"
    />

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

    <!-- 备份详情弹框（P1） -->
    <BackupDetailDialog
      :open="detailDialogOpen"
      :snapshot-id="detailSnapshotId"
      @cancel="detailDialogOpen = false"
      @restored="onDetailRestored"
    />

    <!-- 导出弹框（P1）：列表导出传具体 snapshotId；概览导出传 null（弹框内选快照） -->
    <ExportDialog
      :open="exportDialogOpen"
      :snapshot-id="exportSnapshotId"
      :snapshot-label="exportSnapshotLabel"
      @cancel="exportDialogOpen = false"
      @display-json="onDisplayJson"
    />

    <!-- 导入弹框（概览用，我们自己的 JSON 导入；其他格式跳导入管理） -->
    <ImportDialog
      :open="importDialogOpen"
      @cancel="importDialogOpen = false"
      @imported="onImportedFromDialog"
      @other-formats="onOtherFormatsFromDialog"
    />

    <!-- JSON 串查看弹框（导出"展示 JSON 串"去向） -->
    <Teleport to="body">
      <div
        v-if="jsonViewOpen"
        class="fixed inset-0 z-[130] bg-black/40 flex items-center justify-center p-4"
        @click.self="jsonViewOpen = false"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="json-view-title"
          tabindex="-1"
          @keydown.esc="jsonViewOpen = false"
        >
          <div class="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
            <h2 id="json-view-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">
              JSON 串<span v-if="jsonViewLabel"> · {{ jsonViewLabel }}</span>
            </h2>
            <button
              class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="关闭"
              @click="jsonViewOpen = false"
            >
              <X :size="16" />
            </button>
          </div>
          <div class="px-5 pb-5 flex-1 overflow-hidden flex flex-col">
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mb-2">完整 JSON 串，可全选复制：</p>
            <textarea
              ref="jsonViewTextareaRef"
              class="flex-1 w-full min-h-[300px] border border-gray-200 dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-900/40 text-[11px] font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              readonly
              :value="jsonViewContent"
              aria-label="完整 JSON 串"
            ></textarea>
            <div class="flex justify-end gap-2 mt-3">
              <button
                class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="onCopyJsonView"
              >全选复制</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 本地 toast -->
    <Teleport to="body">
      <div
        v-if="toastMsg"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded shadow-lg max-w-[90vw]"
      >
        {{ toastMsg }}
      </div>
    </Teleport>
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
import { ref, onMounted, onUnmounted } from "vue"
import { Shield, X, Cloud, Trash2 } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { useBackupPageAd } from "~composables/useBackupPageAd"
import { showToast, useToast } from "~composables/useToast"
import BackupSidebar, { type BackupMenuKey } from "~components/backup/BackupSidebar.vue"
import BackupStatusBar from "~components/backup/BackupStatusBar.vue"
import BackupOverviewTab from "~components/backup/BackupOverviewTab.vue"
import BackupListTab from "~components/backup/BackupListTab.vue"
import BackupImportTab from "~components/backup/BackupImportTab.vue"
import BackupDetailDialog from "~components/backup/BackupDetailDialog.vue"
import ExportDialog from "~components/backup/ExportDialog.vue"
import ImportDialog from "~components/backup/ImportDialog.vue"
import ManualBackupDialog from "~components/backup/ManualBackupDialog.vue"
import AutoBackupSettingsDialog from "~components/backup/AutoBackupSettingsDialog.vue"
import BackupNoticeDialog from "~components/BackupNoticeDialog.vue"
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

// 弹框开关
const manualBackupOpen = ref(false)
const autoSettingsOpen = ref(false)
const noticeOpen = ref(false)

// 详情弹框（P1）
const detailDialogOpen = ref(false)
const detailSnapshotId = ref<string | null>(null)

// 导出弹框（P1）
const exportDialogOpen = ref(false)
const exportSnapshotId = ref<string | null>(null)
const exportSnapshotLabel = ref<string | null>(null)

// 导入弹框（概览用，我们自己的 JSON 导入）
const importDialogOpen = ref(false)

// JSON 串查看弹框（导出"展示 JSON 串"去向）
const jsonViewOpen = ref(false)
const jsonViewContent = ref('')
const jsonViewLabel = ref<string | null>(null)
const jsonViewTextareaRef = ref<HTMLTextAreaElement | null>(null)

// 手动备份弹框 ref（用于重置 submitting 态）
const manualBackupDialogRef = ref<InstanceType<typeof ManualBackupDialog> | null>(null)

// 导入管理 Tab ref（用于高亮新导入记录）
const importTabRef = ref<InstanceType<typeof BackupImportTab> | null>(null)

// ===== 首次开启告知弹窗 =====
function onRequestEnable() {
  // 已确认过（单 bool）→ 直接开；否则弹知悉弹窗
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
  showToast('已开启标签备份 · 立即创建首个快照')
  // 触发首次备份（全量）
  void svc.runManualBackup().then((r) => {
    if (r.ok && r.snapshot) {
      showToast(`已备份 ${r.snapshot.stats.tabCount} 标签`)
    }
  }).catch(() => {})
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

// ===== 导入还原（P2：跳导入管理菜单） =====
function onOtherFormatsFromDialog() {
  // 概览导入弹框底部「其他格式导入」→ 关弹框，跳导入管理菜单
  importDialogOpen.value = false
  activeMenu.value = 'import'
}

// ===== 导入成功回调（§8.7：跳备份列表 Tab + 高亮新记录） =====
function onImported(snapshotId: string) {
  // 跳备份管理 → 备份列表 Tab，让用户看到刚导入的记录
  activeMenu.value = 'manage'
  manageTab.value = 'list'
  // 高亮新记录（BackupListTab 暴露 highlightRecord；导入管理页也可高亮）
  // 注：BackupListTab 高亮由其内部 watch snapshots 自动定位，这里仅切视图
  void snapshotId
}

/** 概览导入弹框导入成功：关弹框 + 跳备份列表（复用 onImported 跳转） */
function onImportedFromDialog(snapshotId: string) {
  importDialogOpen.value = false
  onImported(snapshotId)
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
function onOpenExport(snapshotId: string, label: string | null) {
  exportSnapshotId.value = snapshotId
  exportSnapshotLabel.value = label
  exportDialogOpen.value = true
}

/** 概览导出：无上下文快照，传 null 让 ExportDialog 显示快照选择下拉 */
function onOpenExportOverview() {
  exportSnapshotId.value = null
  exportSnapshotLabel.value = null
  exportDialogOpen.value = true
}

function onDisplayJson(content: string, label: string | null) {
  jsonViewContent.value = content
  jsonViewLabel.value = label
  jsonViewOpen.value = true
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
  // 刷新页面 = 重新挂载 = 自动触发；切 Tab 不重复请求（共享单例 adData + 并发去重）。
  void backupPageAd.fetchAd()
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
