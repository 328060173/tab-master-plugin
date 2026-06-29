<template>
  <div ref="containerRef" class="border-b border-gray-100 px-3 py-2 shrink-0">
    <!-- 空状态引导 -->
    <div v-if="tags.length === 0" class="flex items-center justify-center">
      <button
        class="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        @click="showAdd = true"
      >
        <Plus :size="12" />
        添加标记来分类标签
      </button>
    </div>

    <!-- 有标记状态 -->
    <div v-else class="flex items-center gap-2">
      <!-- 全部按钮 -->
      <button
        :class="['shrink-0 px-2 py-0.5 text-xs rounded-full border transition-colors',
          activeTags.length === 0 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50']"
        @click="emit('apply', [])"
      >
        全部
      </button>

      <!-- 可见的标记 chips -->
      <div class="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
        <button
          v-for="tag in visibleTags" :key="tag"
          :title="tag"
          :class="['shrink-0 px-2 py-0.5 text-xs rounded-full border transition-colors flex items-center gap-1',
            activeTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50']"
          @click="toggleTag(tag)"
        >
          <span class="truncate">{{ tag }}</span>
          <span class="opacity-60">{{ tabCountByTag[tag] ?? 0 }}</span>
          <X v-if="activeTags.includes(tag)" :size="11" class="cursor-pointer hover:opacity-80" />
        </button>
      </div>

      <!-- 更多 / 管理按钮：始终显示（有标记时），溢出显示「更多(N)」，否则显示「···」管理入口 -->
      <button
        ref="moreTriggerRef"
        :class="['shrink-0 px-2 py-0.5 text-xs rounded-full border transition-colors flex items-center gap-1',
          popover.isOpen('tag-filter') ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50']"
        :title="hiddenTags.length > 0 ? '展开全部标记 / 管理' : '管理标记（编辑 / 删除）'"
        @click.stop="openMorePanel"
      >
        <template v-if="hiddenTags.length > 0">
          <ChevronDown :size="11" />
          更多({{ hiddenTags.length }})
        </template>
        <MoreHorizontal v-else :size="13" />
      </button>

      <!-- 添加按钮 -->
      <button
        v-if="!showAdd"
        :class="['shrink-0 w-6 h-6 flex items-center justify-center rounded-full border transition-colors',
          'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-blue-400']"
        @click="showAdd = true"
        title="添加标记"
      >
        <Plus :size="12" />
      </button>
    </div>

    <!-- 原位添加输入框 -->
    <div v-if="showAdd" class="flex items-center gap-2 mt-2">
      <input
        ref="addInputRef"
        v-model="newTag"
        maxlength="15"
        placeholder="标记名称（最多15字）"
        class="flex-1 text-xs border border-blue-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
        @keyup.enter="doAdd"
        @keyup.escape="cancelAdd"
        @blur="onAddInputBlur"
      />
      <button
        class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 shrink-0"
        @click="doAdd"
        :disabled="!newTag.trim()"
      >
        确认
      </button>
      <button
        class="text-xs text-gray-400 hover:text-gray-600 shrink-0"
        @click="cancelAdd"
      >
        <X :size="13" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue"
import { Plus, X, ChevronDown, MoreHorizontal } from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"

const props = defineProps<{
  tags: string[]
  activeTags: string[]
  tabCountByTag: Record<string, number>
}>()
const emit = defineEmits<{
  apply: [tags: string[]]
  addTag: [tag: string]
}>()

const popover = usePopoverManager()
const containerRef = ref<HTMLElement | null>(null)
const moreTriggerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(300)

const showAdd = ref(false)
const newTag = ref("")
const addInputRef = ref<HTMLInputElement | null>(null)

// 溢出检测逻辑（参考 FooterStats）
const visibleTags = computed(() => props.tags.slice(0, visibleCount.value))
const hiddenTags = computed(() => props.tags.slice(visibleCount.value))

const visibleCount = computed(() => {
  // 估算可用宽度：容器宽度 - "全部"按钮宽度 - "更多"按钮宽度 - "添加"按钮宽度 - 间距
  const available = containerWidth.value - 50 - 80 - 30 - 20
  let used = 0
  let count = 0
  for (const tag of props.tags) {
    const countNum = props.tabCountByTag[tag] ?? 0
    // 估算每个 chip 的宽度：标记名 + 数字 + 边框 + 内边距
    const w = tag.length * 10 + String(countNum).length * 7 + 32
    if (used + w > available) break
    used += w + 8
    count++
  }
  return Math.max(0, count)
})

const toggleTag = (tag: string) => {
  const newActive = props.activeTags.includes(tag)
    ? props.activeTags.filter(t => t !== tag)
    : [...props.activeTags, tag]
  emit("apply", newActive)
}

const doAdd = () => {
  const t = newTag.value.trim()
  if (t) {
    emit("addTag", t)
    newTag.value = ""
    showAdd.value = false
  }
}

const cancelAdd = () => {
  showAdd.value = false
  newTag.value = ""
}

const onAddInputBlur = () => {
  // 延迟关闭，让点击"确认"按钮有机会先触发
  setTimeout(() => {
    if (showAdd.value && !newTag.value.trim()) {
      cancelAdd()
    }
  }, 150)
}

const openMorePanel = (e: MouseEvent) => {
  popover.toggle("tag-filter", e.currentTarget as HTMLElement)
}

// 当 showAdd 变为 true 时自动聚焦输入框
watch(showAdd, async (val) => {
  if (val) {
    await nextTick()
    addInputRef.value?.focus()
  }
})

let ro: ResizeObserver | null = null
onMounted(() => {
  if (containerRef.value) {
    ro = new ResizeObserver(e => {
      containerWidth.value = e[0].contentRect.width
    })
    ro.observe(containerRef.value)
    containerWidth.value = containerRef.value.clientWidth
  }
})
onUnmounted(() => ro?.disconnect())
</script>
