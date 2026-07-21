<template>
  <Teleport to="body">
    <div
      v-if="popover.isOpen(props.id)"
      ref="popoverRootRef"
      :style="popoverStyle"
      data-popover-content
      class="fixed z-[85] w-[288px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl"
      @click.stop>
      <!-- 顶部新增标记区域 -->
      <div v-if="allTags.length < 15" class="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-gray-700">
        <Plus :size="11" class="text-gray-400 shrink-0" />
        <input
          ref="newTagInputRef"
          v-model="newTag"
          maxlength="15"
          placeholder="新增标记（最多15字）"
          class="flex-1 text-[11px] focus:outline-none bg-transparent text-gray-900 dark:text-gray-100"
          @keyup.enter="handleCreate"
        />
        <button
          :disabled="!newTag.trim() || allTags.includes(newTag.trim())"
          class="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:text-gray-400 disabled:hover:text-gray-400 shrink-0"
          @click="handleCreate">
          添加
        </button>
      </div>
      <div v-else class="px-3 py-2 border-b border-gray-100 dark:border-gray-700 text-[11px] text-gray-400">
        已达15个标记上限
      </div>

      <!-- 标记选择区域 -->
      <div :class="gridClass" class="p-2.5 max-h-[240px] overflow-y-auto">
        <button
          v-for="tag in allTags"
          :key="tag"
          :class="tagButtonClass(tag)"
          :title="tag"
          @click="handleTagClick(tag)">
          {{ tag }}
        </button>
        <p v-if="!allTags.length" class="col-span-full text-[11px] text-gray-400 text-center py-4">
          暂无标记
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"
import { Plus } from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"
import { validateTag } from "~lib/tagValidate"

const props = withDefaults(defineProps<{
  /** 浮层唯一 ID，用于 PopoverManager */
  id: string
  /** 当前标签的已选标记（单标签模式），或批量模式时仅用于显示已选交集 */
  currentTags: string[]
  /** 所有可用标记 */
  allTags: string[]
  /** 模式：single=单标签勾选（可多选标记），batch=批量应用（给多个标签加/删标记） */
  mode: "single" | "batch"
  /** 批量模式下，各选中标签的 tags 数组（用于计算三态） */
  batchTabTags?: string[][]
  /** 弹出位置，默认 'bottom-left' */
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right"
}>(), {
  placement: "bottom-left",
  batchTabTags: () => [],
})

const emit = defineEmits<{
  /** 单标签模式：切换标记 */
  toggle: [tag: string]
  /** 批量模式：应用标记到所有选中标签 */
  apply: [tag: string]
  /** 批量模式：从所有选中标签移除标记 */
  remove: [tag: string]
  /** 新建标记 */
  create: [tag: string]
  /** 关闭浮层 */
  close: []
}>()

const popover = usePopoverManager()
const newTag = ref("")
const newTagInputRef = ref<HTMLInputElement | null>(null)
const popoverRootRef = ref<HTMLElement | null>(null)
// 弹框实际高度：打开后测量，用于翻转/clamp 判断
// 写死 320 会在标记少时误翻转——实际只有 ~120px，却按 320 触发翻转到按钮上方很远，视觉上"飘到最上面"
const measuredHeight = ref(0)

// 自动聚焦输入框 + 测量实际高度
watch(() => popover.isOpen(props.id), async (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      newTagInputRef.value?.focus()
    })
    // 等渲染完成测量实际高度，让 popoverStyle 的翻转判断用真实值而非写死的 320
    await nextTick()
    if (popoverRootRef.value) {
      measuredHeight.value = popoverRootRef.value.offsetHeight
    }
  } else {
    newTag.value = ""
    measuredHeight.value = 0
  }
})

// 计算网格列数
const gridClass = computed(() => {
  if (props.allTags.length <= 5) return "flex flex-col gap-1.5"
  if (props.allTags.length <= 10) return "grid grid-cols-2 gap-1.5"
  return "grid grid-cols-4 gap-1.5"
})

// 批量模式下计算每个标记的状态：none / some / all
const batchTagState = computed(() => {
  const state: Record<string, "none" | "some" | "all"> = {}
  if (props.mode !== "batch" || !props.batchTabTags.length) return state

  const total = props.batchTabTags.length
  for (const tag of props.allTags) {
    let count = 0
    for (const tabTags of props.batchTabTags) {
      if (tabTags.includes(tag)) count++
    }
    if (count === 0) state[tag] = "none"
    else if (count === total) state[tag] = "all"
    else state[tag] = "some"
  }
  return state
})

// 标记按钮样式
const tagButtonClass = (tag: string) => {
  const base = "px-1 py-0.5 text-[10px] rounded border text-center truncate transition-colors"
  if (props.mode === "single") {
    return props.currentTags.includes(tag)
      ? `${base} bg-blue-600 text-white border-blue-600`
      : `${base} border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400`
  } else {
    const state = batchTagState.value[tag] || "none"
    if (state === "all") return `${base} bg-blue-600 text-white border-blue-600`
    if (state === "some") return `${base} bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700`
    return `${base} border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400`
  }
}

// 处理标记点击
const handleTagClick = (tag: string) => {
  if (props.mode === "single") {
    emit("toggle", tag)
  } else {
    const state = batchTagState.value[tag] || "none"
    if (state === "all") {
      emit("remove", tag)
    } else {
      emit("apply", tag)
    }
  }
}

// 处理创建标记：用统一校验 validateTag（与所有入口一致）
const handleCreate = () => {
  const r = validateTag(newTag.value, props.allTags)
  if (!r.ok) return
  emit("create", r.name)
  newTag.value = ""
}

// 浮层位置计算
const popoverStyle = computed(() => {
  if (!popover.isOpen(props.id) || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  // 首次未测量到高度前回退 320（最大估值），测量到后用实际值——避免标记少时误翻转
  const h = measuredHeight.value || 320
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 288, height: h }, props.placement)
  return { left: `${p.left}px`, top: `${p.top}px` }
})
</script>
