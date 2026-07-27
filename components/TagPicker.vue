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
    @toggle="emit('toggleTag', $event)"
    @create="handleCreate"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Tag } from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import TagSelectPopover from "~components/TagSelectPopover.vue"
import { validateTag, TAG_INVALID_MSG } from "~lib/tagValidate"
import { showToast } from "~composables/useToast"

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

const emit = defineEmits<{ toggleTag: [tag: string]; addTag: [tag: string] }>()

const popover = usePopoverManager()
const triggerRef = ref<HTMLElement | null>(null)

const popoverId = computed(() => `tag-picker-${props.tabId}`)

// 创建标记：用统一校验 validateTag，通过后才 emit addTag + toggleTag
// toggleTag 让 sidepanel 调 toggleTabTag（主实例 tabs.value 查，新标记不在则加），不依赖 props.currentTags
const handleCreate = (tag: string) => {
  const r = validateTag(tag, props.allTags)
  if (!r.ok) {
    showToast(TAG_INVALID_MSG[r.reason])
    return
  }
  emit("addTag", r.name)
  emit("toggleTag", r.name)
}

// 暴露给父组件：让外部触发（如 hover 卡上的「标记」按钮）能打开此 picker
defineExpose({
  openFromAnchor: (anchorEl: HTMLElement) => {
    popover.open(popoverId.value, anchorEl)
  },
})
</script>
