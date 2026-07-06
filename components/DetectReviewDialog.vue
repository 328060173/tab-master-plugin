<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4"
      @click.self="emit('cancel')"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[480px] max-w-full max-h-[80vh] flex flex-col"
        role="dialog"
        :aria-label="title"
      >
        <!-- 头部：标题 + 摘要 -->
        <div class="px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
            <component :is="mode === 'duplicates' ? Search : Clock" :size="14" />
            {{ title }}
          </h3>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{{ summary }}</p>

          <!-- 阈值切换（只有 unused 模式显示）：快捷 chips + 自定义输入 1-30 天 -->
          <div v-if="mode === 'unused'" class="flex items-center gap-1.5 mt-2 flex-wrap">
            <label class="text-[11px] text-gray-600 dark:text-gray-300">阈值：</label>
            <button
              v-for="opt in UNUSED_THRESHOLDS"
              :key="opt.ms"
              :class="[
                'px-1.5 py-0.5 text-[10px] rounded border transition-colors',
                thresholdMs === opt.ms
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400'
              ]"
              @click="emit('changeThreshold', opt.ms)"
            >{{ opt.label }}</button>
            <input
              :value="customDays"
              type="number"
              min="1"
              max="30"
              step="1"
              class="w-12 text-[11px] border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 bg-white dark:bg-gray-700 dark:text-gray-200 text-center"
              title="自定义天数（1-30 正整数）"
              @change="onCustomDaysInput"
            />
            <span class="text-[10px] text-gray-400">天</span>
            <span class="text-[10px] text-gray-400 ml-auto">已排除固定/当前页/正播放</span>
          </div>
        </div>

        <!-- 全选/反选 -->
        <div class="px-5 py-2 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button
            class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
            @click="toggleAll"
          >{{ allSelected ? '取消全选' : '全选' }}</button>
          <span class="text-[11px] text-gray-500 dark:text-gray-400">已选 {{ selectedCount }} / {{ totalCount }}</span>
        </div>

        <!-- 列表主体（可滚动） -->
        <div class="flex-1 overflow-y-auto px-3 py-2">
          <!-- 空状态（理论上 sidepanel 已拦截，但兜底） -->
          <div v-if="totalCount === 0" class="text-center py-8 text-xs text-gray-400">
            {{ mode === 'duplicates' ? '未检测到重复标签' : `暂无超过 ${customDays} 天未使用标签` }}
          </div>

          <!-- duplicates 模式：按 URL 分组 -->
          <template v-else-if="mode === 'duplicates'">
            <div v-for="(g, gi) in groups" :key="g.url" :class="['mb-3', gi > 0 ? 'pt-3 border-t border-gray-100 dark:border-gray-700' : '']">
              <p class="text-[10px] text-gray-400 truncate mb-1 px-1" :title="g.url">{{ g.url }} （{{ g.items.length }} 个）</p>
              <div v-for="(item, idx) in g.items" :key="item.id" class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(item.id)"
                  @change="toggleId(item.id)"
                  class="cursor-pointer shrink-0"
                />
                <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-800 dark:text-gray-200 truncate">{{ item.title }}</p>
                  <p class="text-[10px] text-gray-400 truncate">{{ accessLabelFor(item) }}</p>
                </div>
                <!-- 每组首条（最新）标"建议保留" -->
                <span v-if="idx === 0" class="text-[9px] text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded shrink-0">建议保留</span>
              </div>
            </div>
          </template>

          <!-- unused 模式：扁平列表，按未访问时长排序 -->
          <template v-else>
            <div v-for="item in items" :key="item.id" class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                :checked="selectedIds.has(item.id)"
                @change="toggleId(item.id)"
                class="cursor-pointer shrink-0"
              />
              <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-800 dark:text-gray-200 truncate">{{ item.title }}</p>
                <p class="text-[10px] text-gray-400 truncate">{{ accessLabelFor(item) }} · {{ item.domain }}</p>
              </div>
            </div>
          </template>
        </div>

        <!-- 底部操作 -->
        <div class="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex gap-2 justify-end items-center">
          <p class="text-[10px] text-gray-400 mr-auto">💡 可用 Ctrl+Shift+T 逐个恢复</p>
          <button
            class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            @click="emit('cancel')"
          >取消</button>
          <button
            :disabled="selectedCount === 0"
            :class="[
              'px-4 py-1.5 text-sm rounded-lg text-white',
              selectedCount === 0 ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            ]"
            @click="confirmClose"
          >关闭选中 {{ selectedCount }} 个</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 检测后预览弹窗 —— 重复检测 / 长期未用检测 两种 mode 共用。
 *
 * 设计取舍：
 * - 一个组件两种 mode：DRY；列表渲染分支只在主体段 ~10 行差异，外层骨架完全相同
 * - 勾选状态在弹窗内独立维护（Set<id>），不污染父组件；点取消直接丢弃
 * - "建议保留"标记只在重复模式给每组首条（最新）—— 视觉强化"默认保留谁"
 * - 阈值切换走 emit 不走内部 state：让父组件控制 items 数据源，避免组件耦合检测逻辑
 *
 * 依赖路径：
 * - composables/useCleanup.ts — UNUSED_THRESHOLDS / DuplicateGroup / formatUnusedDuration / getEffectiveAccessTime
 * - components/FavIcon.vue — 图标渲染
 *
 * 调用方：sidepanel.vue 的 @detect-duplicates / @detect-unused（路径见 docs/prd/cleanup-toolbar.md §4.5）
 */

import { ref, computed, watch } from "vue"
import { Search, Clock } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import {
  UNUSED_THRESHOLDS,
  formatUnusedDuration,
  getEffectiveAccessTime,
  type DuplicateGroup,
} from "~composables/useCleanup"
import FavIcon from "./FavIcon.vue"

const props = defineProps<{
  open: boolean
  mode: "duplicates" | "unused"
  // duplicates 模式用
  groups?: DuplicateGroup[]
  // unused 模式用
  items?: TabItem[]
  thresholdMs?: number
}>()
const emit = defineEmits<{
  confirm: [ids: number[]]
  cancel: []
  /** 仅 unused 模式：用户切换阈值 */
  changeThreshold: [ms: number]
}>()

// 选中的 tab id 集合（弹窗内独立 state）
const selectedIds = ref<Set<number>>(new Set())

// 重新计算"默认勾选"：
// - duplicates: 每组除最新（首条）外全部勾上（建议关闭那些重复的）
// - unused: 全部勾上（已经被检测函数过滤过了，符合阈值的都建议关）
//   但 lastAccessed 完全缺失的项默认不勾（保守，避免误关常用标签）
const computeDefaultSelected = (): Set<number> => {
  const s = new Set<number>()
  if (props.mode === "duplicates") {
    for (const g of props.groups || []) {
      g.items.forEach((it, idx) => { if (idx > 0) s.add(it.id) })
    }
  } else {
    for (const it of props.items || []) {
      if (getEffectiveAccessTime(it) !== undefined) s.add(it.id)
    }
  }
  return s
}

// 弹窗打开 / 数据源切换 时重置勾选
watch([() => props.open, () => props.groups, () => props.items], () => {
  if (props.open) selectedIds.value = computeDefaultSelected()
}, { immediate: true })

const allItems = computed<TabItem[]>(() => {
  if (props.mode === "duplicates") return (props.groups || []).flatMap(g => g.items)
  return props.items || []
})
const totalCount = computed(() => allItems.value.length)
const selectedCount = computed(() => selectedIds.value.size)
const allSelected = computed(() => totalCount.value > 0 && selectedCount.value === totalCount.value)

const toggleId = (id: number) => {
  // 不直接 mutate Set 的话 Vue 不会触发更新，所以 new 一个
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}
const toggleAll = () => {
  if (allSelected.value) selectedIds.value = new Set()
  else selectedIds.value = new Set(allItems.value.map(t => t.id))
}
const confirmClose = () => {
  if (selectedCount.value === 0) return
  emit("confirm", [...selectedIds.value])
}
// 自定义天数输入：1-30 正整数。非法（空/小数/<1/>30）则复位到当前 thresholdMs 对应天数
const DAYS_MS = 24 * 60 * 60 * 1000
const customDays = ref(1)
watch(() => props.thresholdMs, (ms) => {
  customDays.value = Math.round((ms || DAYS_MS) / DAYS_MS)
}, { immediate: true })
const onCustomDaysInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const raw = input.value
  const v = Number(raw)
  if (raw === "" || !Number.isInteger(v) || v < 1 || v > 30) {
    input.value = String(customDays.value)
    return
  }
  emit("changeThreshold", v * DAYS_MS)
}

const title = computed(() =>
  props.mode === "duplicates"
    ? `检测到 ${props.groups?.length || 0} 组重复 · 共 ${totalCount.value} 个标签`
    : totalCount.value === 0
      ? `暂无超过 ${customDays.value} 天未使用标签`
      : `检测到 ${totalCount.value} 个长期未用标签`,
)
const summary = computed(() =>
  props.mode === "duplicates"
    ? "已按 URL 完全相同分组；每组默认保留最新打开的一个"
    : "按未访问时长降序排列；缺少访问数据的标签默认不勾选",
)

// 列表单条"上次访问"标签的文案
const accessLabelFor = (item: TabItem): string => {
  const t = getEffectiveAccessTime(item)
  if (t === undefined) return "上次访问未知"
  const diff = Date.now() - t
  if (diff < 60_000) return "刚刚访问"
  return `未访问 ${formatUnusedDuration(diff)}`
}
</script>
