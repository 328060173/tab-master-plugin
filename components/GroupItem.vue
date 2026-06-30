<template>
  <div class="mb-2 border border-gray-200 rounded-lg overflow-hidden">
    <!-- 分组标题栏 -->
    <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer" @click="toggleCollapse">
      <span :class="[colorClass, 'w-3 h-3 rounded-full']"></span>
      <span class="flex-1 text-sm font-medium text-gray-900">{{ group.title || "未命名分组" }}</span>
      <span class="text-xs text-gray-500">{{ tabs.length }}</span>
      <button
        v-if="canDropIn"
        class="px-1.5 py-0.5 text-[10px] bg-blue-600 text-white rounded hover:bg-blue-700 shrink-0"
        :title="`把选中的 ${dropInCount} 个标签放入此分组`"
        @click.stop="emit('dropIn', group.id)">
        ← 放入
      </button>
      <button class="p-1 rounded hover:bg-gray-200" @click.stop="toggleCollapse">
        <ChevronDown :size="14" :class="collapsed ? '-rotate-90' : ''" class="transition-transform" />
      </button>
      <div>
        <button
          ref="menuTriggerRef"
          class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          @click.stop="popover.toggle(menuPopoverId, menuTriggerRef)">
          <MoreHorizontal :size="14" />
        </button>
        <Teleport to="body">
          <div
            v-if="popover.isOpen(menuPopoverId)"
            :style="menuPos"
            class="fixed z-[60] w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
            @click.stop>
            <button :class="btn" @click="startRename"><Edit :size="12" />重命名</button>
            <div class="relative group/colorsubmenu">
              <button :class="btn" @click="">
                <Palette :size="12" />改颜色
                <ChevronRight :size="12" class="ml-auto" />
              </button>
              <div class="absolute left-full top-0 ml-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1 px-2 hidden group-hover/colorsubmenu:block">
                <div class="flex flex-wrap gap-1">
                  <button v-for="c in GROUP_COLORS" :key="c"
                          :class="[colorClassFor(c), 'w-6 h-6 rounded-full border-2 transition-transform hover:scale-110', group.color === c ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-transparent']"
                          @click="changeColor(c)"
                  ></button>
                </div>
              </div>
            </div>
            <button :class="btn" @click="onToggleCollapseFromMenu">
              <Eye v-if="collapsed" :size="12" />
              <EyeOff v-else :size="12" />
              {{ collapsed ? "展开" : "折叠" }}
            </button>
            <hr class="my-1 border-gray-100 dark:border-gray-700" />
            <button :class="[btn, 'text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/30']" @click="confirmUngroup"><FolderMinus :size="12" />解散分组</button>
            <button :class="[btn, 'text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/30']" @click="confirmCloseAll"><X :size="12" />关闭全部标签</button>
          </div>
        </Teleport>
      </div>
    </div>

    <!-- 标签列表 -->
    <div v-show="!collapsed" class="py-1">
      <TabListItem v-for="tab in tabs" :key="tab.id"
        :item="tab"
        :is-batch="isBatchMode"
        :is-checked="selectedIds.includes(tab.id)"
        :custom-tags="[]"
        @activate="activateTab(tab.id)"
        @toggle="toggleSelect(tab.id)"
        @close="closeTab(tab.id)"
      />
    </div>

    <!-- 重命名输入框 -->
    <Teleport to="body">
      <div v-if="showRenameDialog" class="fixed inset-0 z-[100] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="showRenameDialog = false"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-72 p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">重命名分组</h3>
          <input v-model="renameValue" type="text" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" @keyup.enter="finishRename" />
          <div class="flex justify-end gap-2">
            <button class="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" @click="showRenameDialog = false">取消</button>
            <button class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700" @click="finishRename">确定</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 确认对话框 -->
    <Teleport to="body">
      <div v-if="showConfirmDialog" class="fixed inset-0 z-[100] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="showConfirmDialog = false"></div>
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-72 p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ confirmTitle }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-300 mb-4">{{ confirmMessage }}</p>
          <div class="flex justify-end gap-2">
            <button class="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" @click="showConfirmDialog = false">取消</button>
            <button class="px-3 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700" @click="handleConfirm">确定</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { ChevronDown, ChevronRight, MoreHorizontal, Edit, Palette, Eye, EyeOff, FolderMinus, X } from "@lucide/vue"
import TabListItem from "./TabListItem.vue"
import { GROUP_COLORS, GROUP_COLOR_CLASSES, type GroupColor } from "~composables/useTabGroups"
import type { TabItem } from "~types/tab"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"

const props = defineProps<{
  group: chrome.tabGroups.TabGroup
  tabs: TabItem[]
  isBatchMode?: boolean
  selectedIds?: number[]
  canDropIn?: boolean
  dropInCount?: number
}>()

const emit = defineEmits<{
  activateTab: [id: number]
  toggleSelect: [id: number]
  closeTab: [id: number]
  renameGroup: [id: number, name: string]
  changeGroupColor: [id: number, color: GroupColor]
  toggleGroupCollapse: [id: number, collapsed: boolean]
  ungroup: [id: number]
  closeGroupTabs: [id: number]
  dropIn: [groupId: number]
}>()

const btn = "flex items-center gap-2 w-full px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-left text-gray-700 dark:text-gray-200 text-xs"
const collapsed = ref(props.group.collapsed ?? false)
const showRenameDialog = ref(false)
const renameValue = ref("")
const showConfirmDialog = ref(false)
const confirmTitle = ref("")
const confirmMessage = ref("")
let confirmAction: (() => void) | null = null

const popover = usePopoverManager()
const menuTriggerRef = ref<HTMLElement | null>(null)
const menuPopoverId = computed(() => `group-menu-${props.group.id}`)

const menuPos = computed(() => {
  if (!popover.isOpen(menuPopoverId.value) || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  // 菜单宽 w-40=160，从触发按钮的 bottom-right 弹出
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 160, height: 220 }, "bottom-right")
  return { left: `${p.left}px`, top: `${p.top}px` }
})

const colorClass = computed(() => {
  return GROUP_COLOR_CLASSES[props.group.color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
})

const colorClassFor = (color: string) => {
  return GROUP_COLOR_CLASSES[color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
}

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  emit("toggleGroupCollapse", props.group.id, collapsed.value)
}
// 菜单里点折叠/展开的入口：先关菜单再做动作
const onToggleCollapseFromMenu = () => {
  popover.close(menuPopoverId.value)
  toggleCollapse()
}

const startRename = () => {
  popover.close(menuPopoverId.value)
  renameValue.value = props.group.title || ""
  showRenameDialog.value = true
}

const finishRename = () => {
  if (renameValue.value.trim()) {
    emit("renameGroup", props.group.id, renameValue.value.trim())
  }
  showRenameDialog.value = false
}

const changeColor = (color: GroupColor) => {
  emit("changeGroupColor", props.group.id, color)
}

const confirmUngroup = () => {
  popover.close(menuPopoverId.value)
  confirmTitle.value = "解散分组"
  confirmMessage.value = "确定要解散这个分组吗？标签不会被关闭。"
  confirmAction = () => emit("ungroup", props.group.id)
  showConfirmDialog.value = true
}

const confirmCloseAll = () => {
  popover.close(menuPopoverId.value)
  confirmTitle.value = "关闭全部标签"
  confirmMessage.value = `确定要关闭这个分组的 ${props.tabs.length} 个标签吗？`
  confirmAction = () => emit("closeGroupTabs", props.group.id)
  showConfirmDialog.value = true
}

const handleConfirm = () => {
  confirmAction?.()
  showConfirmDialog.value = false
}
</script>
