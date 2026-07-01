<template>
  <button
    ref="triggerRef"
    :class="['rounded transition-colors', buttonClass]"
    :title="popover.isOpen(popoverId) ? '收起标记' : '添加标记'"
    @click.stop="popover.toggle(popoverId, triggerRef)">
    <Tag :size="iconSize" />
  </button>

  <!-- 统一标记选择浮层 -->
  <TagSelectPopover
    :id="popoverId"
    :currentTags="currentTags"
    :allTags="allTags"
    mode="single"
    placement="bottom-right"
    @toggle="emit('update', currentTags.includes($event) ? currentTags.filter(t => t !== $event) : [...currentTags, $event])"
    @create="handleCreate"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Tag } from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import TagSelectPopover from "~components/TagSelectPopover.vue"

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

const popoverId = computed(() => `tag-picker-${props.tabId}`)

// 创建标记：同时添加到全局和当前标签
const handleCreate = (tag: string) => {
  emit("addTag", tag)
  if (!props.currentTags.includes(tag)) {
    emit("update", [...props.currentTags, tag])
  }
}

// 暴露给父组件：让外部触发（如 hover 卡上的「标记」按钮）能打开此 picker
defineExpose({
  openFromAnchor: (anchorEl: HTMLElement) => {
    popover.open(popoverId.value, anchorEl)
  },
})
</script>
