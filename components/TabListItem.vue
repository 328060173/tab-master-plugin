<template>
  <div
    :class="['group flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer relative',
      isBatch && isChecked
        ? 'border-blue-400 bg-blue-100 dark:bg-blue-900/30'
        : item.active
          ? 'border-blue-400 bg-blue-300 hover:bg-blue-300'
          : 'border-gray-200 bg-white hover:bg-blue-50']"
    :style="item.groupId !== TAB_GROUP_ID_NONE && group ? { borderLeftColor: '', borderLeftWidth: '4px', paddingLeft: '8px' } : {}"
    @click="onCardClick"
  >
    <div v-if="item.groupId !== TAB_GROUP_ID_NONE && group"
         :class="[colorClass, 'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg']"
    ></div>
  <TabHoverCard
    :hoverCardId="hoverCardId" :item="item"
    @refresh="emit('refresh')" @copy="emit('copy')"
    @pin="emit('pin')" @addTag="onHoverAddTag" @later="emit('later')" @close="emit('close')"
    @updateNumber="emit('updateNumber', $event)"
    @removeTag="emit('removeTag', $event)"
  />
    <!-- 上一个访问标记 -->
    <span v-if="isPrev" class="absolute -top-1 -left-1 text-[8px] font-semibold text-blue-600 bg-blue-100 border border-blue-200 px-1 py-px rounded leading-none z-10" title="上一个访问的标签">Prev</span>
    <!-- 批量态 checkbox：仅多加一个，卡片其他视觉/交互完全保留 -->
    <input v-if="isBatch" type="checkbox" :checked="isChecked"
      class="w-4 h-4 cursor-pointer shrink-0 accent-blue-600"
      @click.stop @change.stop="emit('toggle')" />
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" :badge="statusBadge" />
    <div class="flex-1 min-w-0 flex flex-col gap-0.5">
      <div class="flex items-center gap-1.5">
        <p :class="['text-sm font-medium truncate', item.active ? 'text-blue-900 font-semibold' : 'text-gray-900 dark:text-gray-100']">{{ item.title }}</p>
        <template v-if="item.tags.length">
          <span class="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 shrink-0">{{ item.tags[0] }}</span>
          <span v-if="item.tags.length > 1" class="text-[10px] text-gray-400 shrink-0">+{{ item.tags.length - 1 }}</span>
        </template>
      </div>
      <div class="flex items-center gap-2">
        <GroupBadge :group="group" />
        <span class="text-xs text-gray-400 truncate">{{ item.domain.toLowerCase() }}</span>
      </div>
    </div>
    <StatusBadge :item="item" />
    <!-- 右侧操作按钮：批量态也保留，让用户能临时单条操作 -->
    <div class="flex items-center gap-0.5 shrink-0">
      <button class="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="复制链接" @click.stop="emit('copy')"><Link :size="13" /></button>
      <TagPicker ref="tagPickerRef"
        :tabId="item.id" :currentTags="item.tags" :allTags="customTags"
        @update="emit('updateTags', $event)" @addTag="emit('addTag', $event)" />
      <button class="p-1 text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="稍后处理" @click.stop="emit('later')"><Clock :size="13" /></button>
      <button :class="['p-1 rounded', popover.isOpen(hoverCardId) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700']" title="更多操作" @click.stop="onMenuClick"><Menu :size="14" :stroke-width="2.25" /></button>
      <button class="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" @click.stop="emit('close')" title="关闭"><X :size="13" :stroke-width="2.5" /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 列表视图卡片项。
 *
 * 批量模式（isBatch=true）的变化（按 docs/prd/batch-toolbar.md 第 4 节）：
 * - 卡片左侧多一个 checkbox（accent-blue-600）—— 仅此一处视觉变化
 * - 卡片右侧操作按钮组、hover 卡、状态徽章、Prev 角标全部保留
 * - 卡片点击 = 激活标签（不变），只有 checkbox 点击才切换选中状态
 * - 选中态视觉：浅蓝底 + 蓝边
 */
import { computed, inject, ref } from "vue"
import { Menu, X, Link, Clock } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import TabHoverCard from "./TabHoverCard.vue"
import GroupBadge from "./GroupBadge.vue"
import TagPicker from "./TagPicker.vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { getHighestPriorityStatus } from "~lib/statusPriority"
import { GROUP_COLOR_CLASSES, TAB_GROUP_ID_NONE } from "~composables/useTabGroups"

const props = defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[]; isPrev?: boolean }>()
const emit = defineEmits(["activate", "toggle", "later", "close", "copy", "updateTags", "removeTag", "addTag", "updateNumber", "refresh", "pin"])

const popover = usePopoverManager()
const hoverCardId = `hover-card-${props.item.id}`

const onMenuClick = (e: MouseEvent) => {
  popover.toggle(hoverCardId, e.currentTarget as HTMLElement)
}

const statusBadge = computed(() => getHighestPriorityStatus(props.item)?.icon)

const getGroupById = inject<(groupId: number) => chrome.tabGroups.TabGroup | undefined>("getGroupById")
const group = computed(() => {
  if (props.item.groupId === TAB_GROUP_ID_NONE) return undefined
  return getGroupById?.(props.item.groupId)
})

const colorClass = computed(() => {
  if (!group.value) return ""
  return GROUP_COLOR_CLASSES[group.value.color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
})

const tagPickerRef = ref<{ openFromAnchor: (el: HTMLElement) => void } | null>(null)
const onHoverAddTag = (anchorEl: HTMLElement) => {
  tagPickerRef.value?.openFromAnchor(anchorEl)
}

const onCardClick = () => {
  if (props.isBatch) {
    emit('toggle')
  } else {
    emit('activate')
  }
}
</script>
