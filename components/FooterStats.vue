<template>
  <div ref="containerRef" class="flex items-center px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs shrink-0">
    <!-- 状态按钮区，overflow-hidden 防止撑出 -->
    <div class="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
      <button
        v-for="s in visibleStats" :key="s.key" :title="s.desc"
        :disabled="s.value === 0 && s.key !== 'all'"
        :class="['shrink-0 whitespace-nowrap flex items-center gap-0.5 transition-colors',
                  activeFilter === s.key ? 'text-blue-600 dark:text-blue-400 font-bold' :
                  s.value === 0 && s.key !== 'all' ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' :
                  'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200']"
        @click="emit('filter', s.key)"
      ><span>{{ s.icon }}</span>{{ s.label }}({{ s.value }})</button>
    </div>
    <!-- 更多按钮固定在右侧 -->
    <div v-if="hiddenStats.length" class="shrink-0 pl-2">
      <button
        ref="moreTriggerRef"
        :class="['font-medium text-[11px] whitespace-nowrap transition-colors',
          popover.isOpen('footer-more') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200']"
        @click.stop="popover.toggle('footer-more', moreTriggerRef)"
      >更多</button>
    </div>
  </div>

  <!-- 更多弹层 -->
  <Teleport to="body">
    <div
      v-if="popover.isOpen('footer-more')"
      :style="morePos"
      class="fixed z-[60] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1 w-[200px] max-h-[60vh] overflow-y-auto"
      @click.stop>
      <button
        v-for="s in hiddenStats" :key="s.key" :title="s.desc"
        :disabled="s.value === 0 && s.key !== 'all'"
        :class="['flex items-center gap-2 w-full text-left px-4 py-1.5 text-xs whitespace-nowrap',
          activeFilter === s.key ? 'text-blue-600 dark:text-blue-400 font-bold' :
          s.value === 0 && s.key !== 'all' ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700']"
        @click="emit('filter', s.key); popover.close('footer-more')"
      >
        <span class="text-sm">{{ s.icon }}</span>
        {{ s.label }}<span class="ml-auto text-gray-400 pl-4">{{ s.value }}</span>
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 底部状态栏 —— 状态筛选 + "更多"折叠浮层。
 *
 * 重要变更（2026-06-29 浮层统一改造）：
 * - "更多"浮层接入 PopoverManager（id='footer-more'）
 * - fixed + Teleport 定位，向上弹出（top-right anchor，因为底栏在视窗底部）
 * - z-index 统一到 z-[60]
 */
import { ref, computed, onMounted, onUnmounted } from "vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"

const props = defineProps<{
  stats: Array<{ key: string; label: string; icon: string; desc: string; value: number }>
  activeFilter: string
}>()
const emit = defineEmits(["filter"])

const popover = usePopoverManager()

const moreTriggerRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(300)

// 估算"更多"浮层高度（行高 ~28px，每项一行；max-h 限制 60vh）
const moreEstimatedHeight = computed(() => {
  const lines = Math.max(1, Math.min(hiddenStats.value.length, 12))
  return lines * 28 + 8
})

const morePos = computed(() => {
  if (!popover.isOpen("footer-more") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  // 从触发按钮的右上角向上弹出（底栏在视窗底部，必须向上）
  const p = computePopoverPos(
    popover.activeAnchorRect.value,
    { width: 200, height: moreEstimatedHeight.value },
    "top-right"
  )
  return { left: `${p.left}px`, top: `${p.top}px` }
})

const PRIORITY_ORDER = ["playing","muted","recording","sharing","hasConnectedDevice","frozen","discarded","active","loading","pinned","attention","hasUnsavedForm","isProtected"]

const sortedStats = computed(() => {
  const all = props.stats.find(s => s.key === "all")
  const rest = props.stats.filter(s => s.key !== "all")
  const byOrder = (a: { key: string }, b: { key: string }) => {
    const ai = PRIORITY_ORDER.indexOf(a.key); const bi = PRIORITY_ORDER.indexOf(b.key)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  }
  const withCount = rest.filter(s => s.value > 0).sort(byOrder)
  const withoutCount = rest.filter(s => s.value <= 0).sort(byOrder)
  return all ? [all, ...withCount, ...withoutCount] : [...withCount, ...withoutCount]
})

const visibleCount = computed(() => {
  const available = containerWidth.value - 80
  let used = 0; let count = 0
  for (const s of sortedStats.value) {
    const w = 18 + s.label.length * 10 + String(s.value).length * 7 + 20
    if (used + w > available) break
    used += w + 8; count++
  }
  return Math.max(1, count)
})

const visibleStats = computed(() => sortedStats.value.slice(0, visibleCount.value))
const hiddenStats = computed(() => sortedStats.value.slice(visibleCount.value))

let ro: ResizeObserver | null = null
onMounted(() => {
  if (containerRef.value) {
    ro = new ResizeObserver(e => { containerWidth.value = e[0].contentRect.width })
    ro.observe(containerRef.value); containerWidth.value = containerRef.value.clientWidth
  }
})
onUnmounted(() => ro?.disconnect())
</script>
