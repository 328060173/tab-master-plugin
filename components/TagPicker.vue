<template>
  <button
    ref="triggerRef"
    :class="['rounded transition-colors', buttonClass]"
    :title="popover.isOpen(popoverId) ? '收起标记' : '添加标记'"
    @click.stop="popover.toggle(popoverId, triggerRef)">
    <Tag :size="iconSize" />
  </button>

  <Teleport to="body">
    <div
      v-if="popover.isOpen(popoverId)"
      :style="pickerStyle"
      class="fixed z-[80] w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl"
      @click.stop>
      <!-- 顶部新增标记 -->
      <div class="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700">
        <Plus :size="11" class="text-gray-400 shrink-0" />
        <input
          v-model="newTag" maxlength="15" placeholder="新增标记（最多15字）"
          class="flex-1 text-[11px] focus:outline-none bg-transparent text-gray-900 dark:text-gray-100"
          @keyup.enter="create"
        />
        <button class="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 shrink-0" @click="create">添加</button>
      </div>
      <!-- 已有标记列表 -->
      <div class="grid grid-cols-4 gap-1.5 p-2.5 max-h-60 overflow-y-auto">
        <button
          v-for="tag in allTags" :key="tag"
          :class="['px-1 py-0.5 text-[10px] rounded border text-center truncate transition-colors',
            currentTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400']"
          :title="tag"
          @click="toggle(tag)"
        >{{ tag }}</button>
        <p v-if="!allTags.length" class="col-span-4 text-[11px] text-gray-400 text-center py-2">暂无标记</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 卡片内标记选择器。
 *
 * 重要变更（2026-06-29 浮层统一改造 + 卡片接入）：
 * - 接入 PopoverManager，id = `tag-picker-${tabId}`（每个卡片独立）
 * - fixed + Teleport，向上弹出（top-right anchor，按钮通常在卡片底部）
 * - 接受 buttonClass / iconSize prop，便于在不同卡片视图里视觉对齐
 *
 * 多个卡片同时打开标记选择器是被全局单例机制天然阻止的（同一时刻只有一个 popover）
 */
import { ref, computed } from "vue"
import { Tag, Plus } from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"

const props = withDefaults(defineProps<{
  currentTags: string[]
  allTags: string[]
  tabId: number
  /** 触发按钮的 class，传入以匹配各卡片视图的按钮样式 */
  buttonClass?: string
  iconSize?: number
}>(), {
  buttonClass: "p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700",
  iconSize: 13,
})

const emit = defineEmits<{ update: [tags: string[]]; addTag: [tag: string] }>()

const popover = usePopoverManager()
const triggerRef = ref<HTMLElement | null>(null)
const newTag = ref("")

const popoverId = computed(() => `tag-picker-${props.tabId}`)

const pickerStyle = computed(() => {
  if (!popover.isOpen(popoverId.value) || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  // 默认从 Tag 图标右下方弹出（更符合直觉），computePopoverPos 会在下方空间不够时
  // 自动翻到上方；横向越界会 clamp 到视窗内
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 288, height: 240 }, "bottom-right")
  return { left: `${p.left}px`, top: `${p.top}px` }
})

const toggle = (tag: string) => {
  emit("update", props.currentTags.includes(tag) ? props.currentTags.filter(t => t !== tag) : [...props.currentTags, tag])
}
const create = () => {
  const t = newTag.value.trim()
  if (!t) return
  // 闭环修复：新增标记后，既要把它加入全局列表（addTag emit），又要赋给当前卡片（update emit）
  // 否则用户在 TagFilterPanel 看到新标记，但点筛选会发现没有卡片带它 —— "添加标记"看似成功实则空操作
  emit("addTag", t)
  if (!props.currentTags.includes(t)) {
    emit("update", [...props.currentTags, t])
  }
  newTag.value = ""
}

/** 暴露给父组件：让外部触发（如 hover 卡上的"标记"按钮）能打开此 picker */
defineExpose({
  openFromAnchor: (anchorEl: HTMLElement) => {
    popover.open(popoverId.value, anchorEl)
  },
})
</script>
