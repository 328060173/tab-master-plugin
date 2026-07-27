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
                @open-auto-settings="onRequestEnable"
                @open-import="importDialogOpen = true"
                @open-export="onOpenExportOverview"
                @ack-first-visit="onAckFirstVisit"
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

    <!-- 导入弹框（概览用，我们自己的 JSON 导入；导入=打开标签，不写备份列表） -->
    <ImportDialog
      :open="importDialogOpen"
      @cancel="importDialogOpen = false"
      @other-formats="onOtherFormatsFromDialog"
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
import { ref, computed, onMounted, onUnmounted } from "vue"
import { Shield, X, Cloud, Trash2 } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { useBackupPageAd } from "~composables/useBackupPageAd"
import { showToast, useToast } from "~composables/useToast"
import BackupSidebar, { type BackupMenuKey } from "~components/backup/BackupSidebar.vue"
import BackupOverviewTab from "~components/backup/BackupOverviewTab.vue"
import BackupListTab from "~components/backup/BackupListTab.vue"
import BackupImportTab from "~components/backup/BackupImportTab.vue"
import BackupDetailDialog from "~components/backup/BackupDetailDialog.vue"
import ExportCurrentDialog from "~components/backup/ExportCurrentDialog.vue"
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

// 导出当前标签弹框（概览「导出」用：抓当前浏览器标签，不选历史快照）
const exportCurrentOpen = ref(false)

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

// ===== 首次引导「知道了」=====
async function onAckFirstVisit() {
  await svc.setFirstVisitAcked(true)
}

// ===== 开启自动备份（点「自动备份」按钮 → 弹确认 → 开启 + 首次自动备份 + 跳列表）=====
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
  showToast('已开启自动备份 · 立即进行第一次自动备份')
  // 首次备份用 auto.event.startup 来源 → 备份列表类型显示「自动备份」（不是手动）
  void svc.runBackup('auto.event.startup').then((r) => {
    if (r.ok && r.snapshot) {
      showToast(`第一次自动备份成功 · 已备份 ${r.snapshot.stats.tabCount} 标签`)
      // 跳备份列表 + 刷新（让用户立即看到这条自动备份）
      manageTab.value = 'list'
      void svc.loadAll()
    } else if (!r.ok) {
      showToast(r.error || '第一次自动备份失败，请重试')
    }
  }).catch(() => showToast('第一次自动备份失败，请重试'))
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

// ===== 导入成功回调（导入管理菜单 BackupImportTab 写入 IDB 后跳列表） =====
function onImported(snapshotId: string) {
  activeMenu.value = 'manage'
  manageTab.value = 'list'
  void svc.loadAll() // 刷新备份列表
  void snapshotId
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
  // 刷新页面 = 重新挂载 = 自动触发；切 Tab 不重复请求（共享单例 adData + 并发去重）。
  void backupPageAd.fetchAd()
  // 解析 URL query：sidepanel 顶部下拉跳转时带 ?action= 直接打开对应弹框/Tab
  // action: manual=手动备份弹框 / auto=自动备份设置弹框 / import=导入弹框 / export=导出弹框 / manage=备份列表
  try {
    const params = new URLSearchParams(location.search)
    const action = params.get('action')
    if (action === 'manual') manualBackupOpen.value = true
    else if (action === 'auto') autoSettingsOpen.value = true
    else if (action === 'import') importDialogOpen.value = true
    else if (action === 'export') void onOpenExportOverview()
    else if (action === 'manage') { activeMenu.value = 'manage'; manageTab.value = 'list' }
    // 解析后清掉 URL query，防刷新页面又跳回弹框
    if (action && history.replaceState) {
      history.replaceState(null, '', location.pathname)
    }
  } catch (e) {
    console.warn('[backup] 解析 URL action 失败', e)
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
