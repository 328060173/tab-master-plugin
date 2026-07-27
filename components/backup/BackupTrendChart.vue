<template>
  <!--
    近 7 天备份趋势柱状图（设计稿 §1.1 / §8.4.2）。
    单根（外层 div），无 fallthrough。
    纯 SVG 绘制（不引入图表库，守"不静默引入大依赖"红线）。
    数据源：svc.snapshots 按 createdAt 按天聚合，手动/自动分色堆叠。
  -->
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">近 7 天备份趋势</h3>

    <!-- 空状态 -->
    <div v-if="totalWeekCount === 0" class="h-32 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded">
      暂无备份记录
    </div>

    <!-- 柱状图 SVG -->
    <div v-else class="space-y-2">
      <svg
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        :width="chartWidth"
        :height="chartHeight"
        class="w-full h-auto"
        role="img"
        aria-label="近 7 天备份趋势柱状图"
      >
        <!-- Y 轴参考线（max/2） -->
        <line
          v-for="(gy, i) in gridYs"
          :key="`grid-${i}`"
          :x1="axisLeft"
          :y1="gy"
          :x2="chartWidth - axisRight"
          :y2="gy"
          stroke="currentColor"
          class="text-gray-100 dark:text-gray-700"
          stroke-width="1"
        />
        <!-- 柱子（每天一根，自动底 + 手动顶堆叠） -->
        <g v-for="(d, i) in days" :key="d.key">
          <!-- 自动备份柱（底部，蓝色） -->
          <rect
            :x="barX(i)"
            :y="barY(d.auto)"
            :width="barWidth"
            :height="barHeight(d.auto)"
            :class="d.auto > 0 ? 'fill-blue-500 dark:fill-blue-400' : 'fill-blue-100 dark:fill-blue-900/30'"
            rx="2"
          >
            <title>{{ d.label }} · 自动 {{ d.auto }} 次</title>
          </rect>
          <!-- 手动备份柱（顶部堆叠，绿色） -->
          <rect
            v-if="d.manual > 0"
            :x="barX(i)"
            :y="barY(d.auto + d.manual)"
            :width="barWidth"
            :height="barHeight(d.manual)"
            class="fill-emerald-500 dark:fill-emerald-400"
            rx="2"
          >
            <title>{{ d.label }} · 手动 {{ d.manual }} 次</title>
          </rect>
          <!-- 日期标签 -->
          <text
            :x="barX(i) + barWidth / 2"
            :y="chartHeight - 4"
            text-anchor="middle"
            class="fill-gray-500 dark:fill-gray-400"
            font-size="10"
          >{{ d.label }}</text>
        </g>
      </svg>

      <!-- 图例 + 本周统计 -->
      <div class="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-300">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-sm bg-blue-500 dark:bg-blue-400" aria-hidden="true"></span>
            自动
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400" aria-hidden="true"></span>
            手动
          </span>
        </div>
        <span>本周共 {{ totalWeekCount }} 次（手动 {{ totalManual }} · 自动 {{ totalAuto }}）</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 近 7 天备份趋势柱状图（设计稿 §1.1 / §8.4.2）。
 * - 纯 SVG 绘制，不引入图表库
 * - 数据源：svc.snapshots 按 createdAt 按天聚合
 * - source 映射：manual→手动 / auto.*→自动 / import→不计入手动自动（导入不算备份行为）
 * - 守 reduced-motion（无动画，纯静态）
 */
import { computed } from 'vue'
import { useBackupService } from '~composables/useBackupService'

const svc = useBackupService()
const { snapshots } = svc

// 图表尺寸常量
const CHART_WIDTH = 320
const CHART_HEIGHT = 140
const AXIS_LEFT = 8
const AXIS_RIGHT = 8
const AXIS_TOP = 8
const AXIS_BOTTOM = 20
const BAR_GAP = 8

const chartWidth = CHART_WIDTH
const chartHeight = CHART_HEIGHT
const axisLeft = AXIS_LEFT
const axisRight = AXIS_RIGHT

/** 近 7 天的日期 key + label（含今天，倒序往前 6 天，再正序展示） */
interface DayBucket {
  key: string      // YYYY-MM-DD
  label: string    // M/D
  manual: number
  auto: number
  startTs: number  // 当天 00:00 时间戳
  endTs: number    // 当天 23:59:59.999
}

const days = computed<DayBucket[]>(() => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const DAY_MS = 24 * 60 * 60 * 1000
  const buckets: DayBucket[] = []
  for (let i = 6; i >= 0; i--) {
    const start = todayStart - i * DAY_MS
    const end = start + DAY_MS - 1
    const d = new Date(start)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    buckets.push({ key, label, manual: 0, auto: 0, startTs: start, endTs: end })
  }
  // 聚合 snapshots
  for (const s of snapshots.value) {
    const ts = s.createdAt
    for (const b of buckets) {
      if (ts >= b.startTs && ts <= b.endTs) {
        if (s.source === 'manual') b.manual++
        else if (s.source.startsWith('auto.')) b.auto++
        // import / preRestore 不计入趋势
        break
      }
    }
  }
  return buckets
})

const totalManual = computed(() => days.value.reduce((sum, d) => sum + d.manual, 0))
const totalAuto = computed(() => days.value.reduce((sum, d) => sum + d.auto, 0))
const totalWeekCount = computed(() => totalManual.value + totalAuto.value)

const maxCount = computed(() => {
  let m = 0
  for (const d of days.value) {
    const total = d.manual + d.auto
    if (total > m) m = total
  }
  return Math.max(m, 1)
})

// 绘图区高度（去掉上下边距）
const plotHeight = CHART_HEIGHT - AXIS_TOP - AXIS_BOTTOM

/** 柱子 x 坐标 */
function barX(i: number): number {
  const plotWidth = CHART_WIDTH - AXIS_LEFT - AXIS_RIGHT
  const slot = plotWidth / 7
  return AXIS_LEFT + i * slot + (slot - barWidth) / 2
}

const barWidth = (() => {
  const plotWidth = CHART_WIDTH - AXIS_LEFT - AXIS_RIGHT
  const slot = plotWidth / 7
  return Math.max(slot - BAR_GAP, 8)
})()

/** 柱子顶部 y 坐标（值越大越靠上） */
function barY(value: number): number {
  if (value <= 0) return AXIS_TOP + plotHeight
  const ratio = value / maxCount.value
  return AXIS_TOP + plotHeight - ratio * plotHeight
}

/** 柱子高度 */
function barHeight(value: number): number {
  if (value <= 0) return 0
  const ratio = value / maxCount.value
  return ratio * plotHeight
}

// Y 轴参考线（max / max/2 / 0）
const gridYs = computed<number[]>(() => {
  return [
    AXIS_TOP,
    AXIS_TOP + plotHeight / 2,
    AXIS_TOP + plotHeight,
  ]
})
</script>
