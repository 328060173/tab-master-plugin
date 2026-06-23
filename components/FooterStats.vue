<template>
  <div ref="containerRef" class="flex items-center px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-xs shrink-0">
    <!-- 状态按钮区，overflow-hidden 防止撑出 -->
    <div class="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
      <button
        v-for="s in visibleStats" :key="s.key" :title="s.desc"
        :class="['shrink-0 whitespace-nowrap flex items-center gap-0.5 transition-colors', activeFilter === s.key ? 'text-blue-600 font-bold' : 'text-gray-400 hover:text-gray-700']"
        @click="emit('filter', s.key)"
      ><span>{{ s.icon }}</span>{{ s.label }}({{ s.value }})</button>
    </div>
    <!-- 更多按钮固定在右侧，shrink-0 保证始终可见 -->
    <div v-if="hiddenStats.length" class="shrink-0 pl-2 relative">
      <button class="text-gray-400 hover:text-gray-600 font-medium text-[11px] whitespace-nowrap" @click.stop="showMore = !showMore">更多</button>
      <div v-if="showMore"
        class="fixed bottom-10 right-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 min-w-max"
        v-click-outside="() => showMore = false"
      >
        <button
          v-for="s in hiddenStats" :key="s.key" :title="s.desc"
          :class="['flex items-center gap-2 w-full text-left px-4 py-1.5 text-xs hover:bg-gray-50 whitespace-nowrap', activeFilter === s.key ? 'text-blue-600 font-bold' : 'text-gray-700']"
          @click="emit('filter', s.key); showMore = false"
        >
          <span class="text-sm">{{ s.icon }}</span>
          {{ s.label }}<span class="ml-auto text-gray-400 pl-4">{{ s.value }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"

const props = defineProps<{
  stats: Array<{ key: string; label: string; icon: string; desc: string; value: number }>
  activeFilter: string
}>()
const emit = defineEmits(["filter"])

const showMore = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(300)

// 新顺序：播放中、已静音、录制中、共享中、已冻结、已舍弃、当前激活、加载中、已固定、引起注意、未保存表单、连接设备、受保护
const PRIORITY_ORDER = ["playing","muted","recording","sharing","frozen","discarded","active","loading","pinned","attention","hasUnsavedForm","hasConnectedDevice","isProtected"]

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

// 宽度估算更保守：emoji(18) + 中文字(10px) + 数字(7px) + 内边距(20px)
const visibleCount = computed(() => {
  // 预留更多按钮 56px + 两侧 px-3(24px) = 80px
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

const vClickOutside = {
  mounted(el: any, b: any) { el._o = (e: MouseEvent) => { if (!el.contains(e.target)) b.value() }; document.addEventListener("click", el._o) },
  unmounted(el: any) { document.removeEventListener("click", el._o) },
}
</script>
