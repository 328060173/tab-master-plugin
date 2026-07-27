<template>
  <!--
    备份列表 Tab（设计稿 §3.1 / §8.5.1）。
    单根（外层 div），所有事件声明在 emits，无 fallthrough。
    内容：
    - 条件查询区：备份时间 + 备份类型 + 备注关键字搜索
    - 表格：备份时间 / 备份类型 / 备注 / 标签数 / 操作（还原▾ / 导出 / 更多…）
    - 分页：50/页（可选 20/50/100）
    - 空状态：还没备份记录 · [手动备份]创建第一个
    数据源：svc.snapshots（SnapshotSummary[]）+ svc.getSnapshotFile(id) 取详情
    搜索/筛选/分页在前端做（snapshots 已全在内存）
  -->
  <div class="space-y-3">
    <!-- 条件查询区 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
      <div class="flex items-center gap-2 flex-wrap text-xs">
        <!-- 备份时间 -->
        <div class="flex items-center gap-1.5">
          <label class="text-gray-500 dark:text-gray-400 shrink-0">备份时间</label>
          <select
            v-model="filters.timeRange"
            class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="opt in TIME_RANGE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <!-- 备份类型 -->
        <div class="flex items-center gap-1.5">
          <label class="text-gray-500 dark:text-gray-400 shrink-0">备份类型</label>
          <select
            v-model="filters.type"
            class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="opt in TYPE_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <!-- 备注 -->
        <div class="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <label class="text-gray-500 dark:text-gray-400 shrink-0">备注</label>
          <input
            v-model="filters.keyword"
            type="text"
            placeholder="关键字搜索（多关键字用 | 分隔）"
            class="flex-1 min-w-0 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter="onSearch"
          />
        </div>
        <!-- 操作按钮 -->
        <button
          class="px-3 py-1 min-h-[32px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="onSearch"
        >查询</button>
        <button
          class="px-3 py-1 min-h-[32px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="onReset"
        >重置</button>
      </div>
      <!-- 自定义时间范围 -->
      <div v-if="filters.timeRange === 'custom'" class="flex items-center gap-2 mt-2 text-xs">
        <label class="text-gray-500 dark:text-gray-400 shrink-0">起</label>
        <input
          v-model="filters.customStart"
          type="date"
          class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label class="text-gray-500 dark:text-gray-400 shrink-0">止</label>
        <input
          v-model="filters.customEnd"
          type="date"
          class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- §3.3 自动保留条数配置入口（只管 auto.* 来源；手动永不删） -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 flex items-center gap-2 text-xs flex-wrap">
      <span class="text-gray-600 dark:text-gray-300 shrink-0">自动备份保留</span>
      <select
        v-model.number="retainCount"
        :disabled="retainSaving"
        class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        @change="onRetainChange(retainCount)"
      >
        <option v-for="opt in RETAIN_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <span class="text-[11px] text-gray-500 dark:text-gray-400">仅自动备份受此限制，手动备份永不自动删除</span>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredSnapshots.length === 0" class="bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center">
      <Inbox :size="32" class="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">还没有备份记录</p>
      <button
        class="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        @click="emit('open-manual-backup')"
      >
        <Save :size="12" />
        手动备份
      </button>
    </div>

    <!-- 表格 -->
    <div v-else class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead class="bg-gray-50 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400">
            <tr>
              <th class="px-3 py-2 text-left font-medium">备份时间</th>
              <th class="px-3 py-2 text-left font-medium">备份类型</th>
              <th class="px-3 py-2 text-left font-medium">备注</th>
              <th class="px-3 py-2 text-right font-medium">标签数</th>
              <th class="px-3 py-2 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700/50">
            <tr
              v-for="s in pagedSnapshots"
              :key="s.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <!-- 备份时间 -->
              <td class="px-3 py-2 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {{ formatRelative(s.createdAt) }}
              </td>
              <!-- 备份类型 -->
              <td class="px-3 py-2">
                <span
                  :class="['inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium', typeBadgeClass(s.source)]"
                >
                  {{ typeLabel(s.source) }}
                </span>
                <span v-if="s.locked" class="ml-1 text-amber-500" title="已锁定">
                  <Lock :size="10" />
                </span>
              </td>
              <!-- 备注（inline 编辑） -->
              <td class="px-3 py-2 text-gray-700 dark:text-gray-200">
                <template v-if="editingId === s.id">
                  <input
                    :ref="(el) => registerLabelInput(s.id, el)"
                    v-model="labelDraft"
                    type="text"
                    maxlength="20"
                    class="w-full min-w-[120px] border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 bg-white dark:bg-gray-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @keydown.enter="onSaveLabel(s.id)"
                    @keydown.esc="editingId = null"
                    @blur="onSaveLabel(s.id)"
                  />
                </template>
                <template v-else>
                  <button
                    class="inline-flex items-center gap-1 text-left hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-0.5 -mx-0.5"
                    :title="s.label || '点 ✏ 添加备注'"
                    @click="onStartEditLabel(s)"
                  >
                    <span v-if="s.label" class="truncate max-w-[180px]">{{ s.label }}</span>
                    <span v-else class="text-gray-400 dark:text-gray-500">--</span>
                    <Pencil :size="10" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 shrink-0" />
                  </button>
                </template>
              </td>
              <!-- 标签数 -->
              <td class="px-3 py-2 text-right text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {{ tabCountDisplay(s) }}
              </td>
              <!-- 操作 -->
              <td class="px-3 py-2 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-1">
                  <RestoreMenu
                    :disabled="restoringId === s.id"
                    @select="(target) => onRestore(s.id, target)"
                  />
                  <button
                    class="inline-flex items-center gap-0.5 min-h-[32px] px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @click="onExport(s)"
                  >
                    <Download :size="12" />
                    <span>导出</span>
                  </button>
                  <MoreMenu
                    :locked="s.locked"
                    @lock="onToggleLock(s.id, !s.locked)"
                    @edit-label="onStartEditLabel(s)"
                    @delete="onDelete(s)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-gray-700 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap gap-2">
        <span>共 {{ filteredSnapshots.length }} 条</span>
        <div class="flex items-center gap-2">
          <select
            v-model.number="pageSize"
            class="border border-gray-200 dark:border-gray-700 rounded px-1.5 py-0.5 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="opt in PAGE_SIZE_OPTIONS" :key="opt" :value="opt">{{ opt }}/页</option>
          </select>
          <div class="flex items-center gap-1">
            <button
              :disabled="page <= 1"
              class="px-2 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="page--"
            >上一页</button>
            <span class="px-1">{{ page }} / {{ totalPages }}</span>
            <button
              :disabled="page >= totalPages"
              class="px-2 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="page++"
            >下一页</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 还原中遮罩 -->
    <div
      v-if="restoringId !== null"
      class="fixed inset-0 z-[130] bg-black/30 flex items-center justify-center"
      aria-live="polite"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl px-5 py-3 flex items-center gap-2 text-xs">
        <svg class="animate-spin h-4 w-4 text-blue-600 motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
        <span class="text-gray-700 dark:text-gray-200">正在还原…</span>
      </div>
    </div>

    <!-- 删除二次确认 -->
    <ConfirmDialog
      :open="deleteConfirm.open"
      :title="deleteConfirm.locked ? '删除锁定的备份？' : '删除此备份？'"
      :message="deleteConfirm.locked ? '此备份已锁定，删除后将无法找回（30 秒内可撤销）。' : '删除后 30 秒内可撤销，超时无法恢复。'"
      :highlight="deleteConfirm.locked ? '锁定备份通常是重要备份，确认要删除？' : undefined"
      confirm-text="删除"
      danger
      @confirm="onConfirmDelete"
      @cancel="deleteConfirm.open = false"
    />

    <!-- 撤销删除 toast（30s 倒计时按钮） -->
    <Teleport to="body">
      <div
        v-if="undoInfo.show"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-3 py-2 rounded shadow-lg flex items-center gap-3 max-w-[90vw]"
      >
        <span>已删除备份</span>
        <button
          class="px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="onUndoDelete"
        >撤销（{{ undoInfo.remainSec }}s）</button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * 备份列表 Tab（设计稿 §3.1 / §8.5.1）。
 * - 条件查询：时间范围 + 类型 + 备注关键字（多关键字用 | 分隔）
 * - 表格：备份时间 / 备份类型（色标） / 备注（inline 编辑） / 标签数（12/34） / 操作
 * - 操作：还原▾（RestoreMenu）/ 导出（ExportDialog）/ 更多…（MoreMenu：锁定/改备注/删除）
 * - 分页：默认 50/页，可选 20/50/100
 * - 删除：软删 30s 撤销（toast 倒计时）
 * 数据源：svc.snapshots（已在内存）+ svc.getSnapshotFile(id) 取详情（详情弹框用）
 */
import { ref, reactive, computed, watch, onUnmounted, nextTick } from 'vue'
import { Inbox, Save, Download, Pencil, Lock } from '@lucide/vue'
import RestoreMenu from './RestoreMenu.vue'
import MoreMenu from './MoreMenu.vue'
import ConfirmDialog from '~components/ConfirmDialog.vue'
import { useBackupService } from '~composables/useBackupService'
import { useBackupRestore, type OpenTarget } from '~composables/useBackupRestore'
import { showToast } from '~composables/useToast'
import { currentLimits, type SnapshotSource, type SnapshotSummary } from '~types/backup'

const emit = defineEmits<{
  (e: 'open-manual-backup'): void
  (e: 'open-detail', snapshotId: string): void
  (e: 'open-export', snapshotId: string, label: string | null): void
}>()

const svc = useBackupService()
const restoreSvc = useBackupRestore()
const { snapshots } = svc

// ===== 查询条件 =====
type TimeRange = 'all' | 'today' | 'yesterday' | '7d' | '30d' | 'custom'
type TypeFilter = 'all' | 'manual' | 'auto' | 'import'

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: '7d', label: '近 7 天' },
  { value: '30d', label: '近 30 天' },
  { value: 'custom', label: '自定义' },
]

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'manual', label: '手动备份' },
  { value: 'auto', label: '自动备份' },
  { value: 'import', label: '导入' },
]

const PAGE_SIZE_OPTIONS = [20, 50, 100] as const

// §3.3 "保留近 X 条"配置入口（只管 auto.* 保留条数；手动永不删）
const RETAIN_OPTIONS = [
  { value: 10, label: '10 条' },
  { value: 30, label: '30 条（默认）' },
  { value: 50, label: '50 条' },
  { value: 100, label: '100 条' },
] as const
const LIM = currentLimits()
const retainCount = ref<number>(svc.settings.value.cacheMaxSnapshots || LIM.autoMaxSnapshots)
const retainSaving = ref(false)

async function onRetainChange(v: number) {
  if (retainSaving.value) return
  retainSaving.value = true
  try {
    await svc.updateSettings({ cacheMaxSnapshots: v })
    showToast(`已设置自动保留近 ${v} 条`)
  } catch (e) {
    console.warn('[BackupListTab] 设置保留条数失败', e)
    showToast('保存失败，请重试')
    // 回滚
    retainCount.value = svc.settings.value.cacheMaxSnapshots
  } finally {
    retainSaving.value = false
  }
}

// 外部（如设置弹框）改了 settings 时同步本地 ref
watch(() => svc.settings.value.cacheMaxSnapshots, (v) => {
  if (v !== retainCount.value) retainCount.value = v
})

const filters = reactive({
  timeRange: 'all' as TimeRange,
  type: 'all' as TypeFilter,
  keyword: '',
  customStart: '',
  customEnd: '',
})
// 已应用的查询条件（点查询按钮才生效）
const applied = reactive({
  timeRange: 'all' as TimeRange,
  type: 'all' as TypeFilter,
  keyword: '',
  customStart: '',
  customEnd: '',
})

function onSearch() {
  applied.timeRange = filters.timeRange
  applied.type = filters.type
  applied.keyword = filters.keyword.trim()
  applied.customStart = filters.customStart
  applied.customEnd = filters.customEnd
  page.value = 1
}

function onReset() {
  filters.timeRange = 'all'
  filters.type = 'all'
  filters.keyword = ''
  filters.customStart = ''
  filters.customEnd = ''
  onSearch()
}

// ===== 过滤 + 分页 =====
function matchTimeRange(ts: number, range: TimeRange): boolean {
  if (range === 'all') return true
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const DAY_MS = 24 * 60 * 60 * 1000
  if (range === 'today') {
    return ts >= todayStart && ts < todayStart + DAY_MS
  }
  if (range === 'yesterday') {
    return ts >= todayStart - DAY_MS && ts < todayStart
  }
  if (range === '7d') {
    return ts >= todayStart - 6 * DAY_MS && ts <= Date.now()
  }
  if (range === '30d') {
    return ts >= todayStart - 29 * DAY_MS && ts <= Date.now()
  }
  if (range === 'custom') {
    const start = applied.customStart ? new Date(applied.customStart + 'T00:00:00').getTime() : -Infinity
    const end = applied.customEnd ? new Date(applied.customEnd + 'T23:59:59.999').getTime() : Infinity
    return ts >= start && ts <= end
  }
  return true
}

function matchType(source: SnapshotSource, type: TypeFilter): boolean {
  if (type === 'all') return true
  if (type === 'manual') return source === 'manual'
  if (type === 'auto') return source.startsWith('auto.')
  if (type === 'import') return source === 'import'
  return false
}

function matchKeyword(label: string | null, keyword: string): boolean {
  if (!keyword) return true
  // 多关键字用 | 分隔，AND 逻辑（都包含）
  const parts = keyword.split('|').map((s) => s.trim()).filter(Boolean)
  if (parts.length === 0) return true
  const text = (label || '').toLowerCase()
  return parts.every((p) => text.includes(p.toLowerCase()))
}

const filteredSnapshots = computed<SnapshotSummary[]>(() => {
  return snapshots.value.filter((s) => {
    if (!matchTimeRange(s.createdAt, applied.timeRange)) return false
    if (!matchType(s.source, applied.type)) return false
    if (!matchKeyword(s.label, applied.keyword)) return false
    return true
  })
})

const pageSize = ref<number>(50)
const page = ref(1)

watch(pageSize, () => { page.value = 1 })

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSnapshots.value.length / pageSize.value)))

const pagedSnapshots = computed<SnapshotSummary[]>(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredSnapshots.value.slice(start, start + pageSize.value)
})

// ===== 类型色标 =====
function typeLabel(source: SnapshotSource): string {
  switch (source) {
    case 'manual': return '手动备份'
    case 'auto.timer':
    case 'auto.event.tabRemoved':
    case 'auto.event.windowRemoved':
    case 'auto.event.idle':
    case 'auto.event.startup':
      return '自动备份'
    case 'import': return '导入'
    case 'preRestore': return '还原前'
    default: return source
  }
}

function typeBadgeClass(source: SnapshotSource): string {
  if (source === 'manual') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
  if (source === 'import') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
  if (source === 'preRestore') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  // auto.*
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

// ===== 标签数显示（12/34） =====
function tabCountDisplay(s: SnapshotSummary): string {
  const selected = s.stats.selectedTabCount
  const total = s.stats.totalTabCount
  const tabCount = s.stats.tabCount
  // 手动备份选了部分：显示 selected/total（如 12/34）
  if (typeof selected === 'number' && typeof total === 'number' && total > 0 && selected !== total) {
    return `${selected}/${total}`
  }
  // 全量：显示 tabCount/tabCount 或 单数字
  if (typeof total === 'number' && total > 0) return `${tabCount}/${total}`
  return String(tabCount)
}

// ===== 备注 inline 编辑 =====
const editingId = ref<string | null>(null)
const labelDraft = ref('')
const labelInputRefs = new Map<string, HTMLInputElement>()

function registerLabelInput(id: string, el: unknown) {
  // Vue 函数 ref 回调传入 Element | ComponentPublicInstance | null
  if (el instanceof HTMLInputElement) {
    labelInputRefs.set(id, el)
  } else {
    labelInputRefs.delete(id)
  }
}

function onStartEditLabel(s: SnapshotSummary) {
  editingId.value = s.id
  labelDraft.value = s.label || ''
  void nextTick(() => {
    const el = labelInputRefs.get(s.id)
    if (el) {
      el.focus()
      el.select()
    }
  })
}

async function onSaveLabel(id: string) {
  if (editingId.value !== id) return
  const trimmed = labelDraft.value.trim().slice(0, 20)
  const cur = snapshots.value.find((x) => x.id === id)
  if (cur && (cur.label || null) === (trimmed || null)) {
    editingId.value = null
    return
  }
  const ok = await svc.setSnapshotLabel(id, trimmed || null)
  if (ok) {
    showToast('已修改备注')
  } else {
    showToast('修改备注失败')
  }
  editingId.value = null
}

// ===== 还原 =====
const restoringId = ref<string | null>(null)

async function onRestore(snapshotId: string, target: OpenTarget) {
  if (target === 'selected') {
    // 进详情弹框勾选
    emit('open-detail', snapshotId)
    return
  }
  if (restoringId.value) return
  restoringId.value = snapshotId
  try {
    const r = await restoreSvc.openSnapshot(snapshotId, target)
    if (r.ok) {
      const fp = r.metaResult
      let msg = `已打开 ${r.openedCount} 个标签`
      if (fp) {
        const metaBits: string[] = []
        if (fp.tabTagsRestored > 0) metaBits.push(`标记 ${fp.tabTagsRestored}`)
        if (fp.laterTabsMerged > 0) metaBits.push(`稍后 ${fp.laterTabsMerged}`)
        if (fp.groupsRestored > 0) metaBits.push(`分组 ${fp.groupsRestored}`)
        if (metaBits.length > 0) msg += `（已恢复 ${metaBits.join(' / ')}）`
      }
      showToast(msg)
    } else {
      showToast(r.error || '还原失败')
    }
  } finally {
    restoringId.value = null
  }
}

// ===== 锁定/解锁 =====
async function onToggleLock(id: string, locked: boolean) {
  const ok = await svc.toggleLock(id, locked, locked ? '用户手动锁定' : undefined)
  if (ok) {
    showToast(locked ? '已锁定' : '已解锁')
  } else {
    showToast('操作失败')
  }
}

// ===== 删除（软删 30s 撤销） =====
const UNDO_WINDOW_MS = 30_000
const deleteConfirm = reactive<{ open: boolean; id: string | null; locked: boolean }>({
  open: false,
  id: null,
  locked: false,
})

const undoInfo = reactive<{ show: boolean; remainSec: number; id: string | null }>({
  show: false,
  remainSec: 30,
  id: null,
})

let undoTimer: ReturnType<typeof setInterval> | null = null

function onDelete(s: SnapshotSummary) {
  deleteConfirm.id = s.id
  deleteConfirm.locked = !!s.locked
  deleteConfirm.open = true
}

async function onConfirmDelete() {
  const id = deleteConfirm.id
  deleteConfirm.open = false
  deleteConfirm.id = null
  if (!id) return
  const ok = await svc.deleteSnapshot(id)
  if (!ok) {
    showToast('删除失败')
    return
  }
  showToast('已删除')
  // 启动 30s 撤销窗口
  undoInfo.id = id
  undoInfo.remainSec = Math.floor(UNDO_WINDOW_MS / 1000)
  undoInfo.show = true
  if (undoTimer) clearInterval(undoTimer)
  undoTimer = setInterval(() => {
    undoInfo.remainSec--
    if (undoInfo.remainSec <= 0) {
      undoInfo.show = false
      undoInfo.id = null
      if (undoTimer) {
        clearInterval(undoTimer)
        undoTimer = null
      }
    }
  }, 1000)
}

async function onUndoDelete() {
  if (!undoInfo.id) return
  const ok = await svc.undoDelete()
  if (ok) {
    showToast('已撤销删除')
  } else {
    showToast('撤销失败')
  }
  undoInfo.show = false
  undoInfo.id = null
  if (undoTimer) {
    clearInterval(undoTimer)
    undoTimer = null
  }
}

onUnmounted(() => {
  if (undoTimer) clearInterval(undoTimer)
})

// ===== 导出 =====
function onExport(s: SnapshotSummary) {
  emit('open-export', s.id, s.label)
}

// ===== 时间格式化 =====
function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} 天前`
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
</script>
