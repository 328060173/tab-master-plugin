<template>
  <div class="flex flex-col h-full">
    <!-- 引导提示 -->
    <div v-if="!guideShown" class="px-3 py-2 bg-blue-50 border-b border-blue-100">
      <div class="flex items-center justify-between">
        <p class="text-xs text-blue-800">💡 在这里管理所有标签分组，分组数据与 Chrome 原生同步</p>
        <button class="text-xs text-blue-600 hover:underline" @click="markGuideShown">知道了</button>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
      <button v-if="hasUngroupedSelected"
              class="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
              @click="showCreateDialog = true">
        从选中创建分组
      </button>
      <button v-else-if="hasAnySelected"
              class="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
              @click="showAddToGroupDialog = true">
        添加到分组
      </button>
      <button v-else
              class="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="ungroupedTabs.length === 0"
              @click="openNewGroupForUngrouped">
        + 新建分组
      </button>
      <div v-if="hasAnySelected" class="flex items-center gap-2">
        <span class="text-xs text-gray-500">{{ ungroupedSelectedIds.length }} 个选中</span>
        <button class="text-xs text-gray-600 hover:text-gray-800" @click="clearSelection">取消选择</button>
      </div>
    </div>

    <!-- 分组列表 -->
    <div class="flex-1 overflow-y-auto px-3 py-2">
      <GroupItem v-for="group in groups" :key="group.id"
        :group="group"
        :tabs="group.tabs"
        :is-batch-mode="false"
        @activate-tab="activateTab"
        @close-tab="closeTab"
        @rename-group="renameGroup"
        @change-group-color="changeGroupColor"
        @toggle-group-collapse="toggleGroupCollapse"
        @ungroup="ungroup"
        @close-group-tabs="closeGroupTabs"
      />

      <!-- 未分组 -->
      <div v-if="ungroupedTabs.length > 0" class="mb-2 border border-gray-200 rounded-lg overflow-hidden">
        <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer" @click="ungroupedCollapsed = !ungroupedCollapsed">
          <span class="w-3 h-3 rounded-full bg-gray-300"></span>
          <span class="flex-1 text-sm font-medium text-gray-900">未分组</span>
          <span class="text-xs text-gray-500">{{ ungroupedTabs.length }}</span>
          <ChevronDown :size="14" :class="ungroupedCollapsed ? '-rotate-90' : ''" class="transition-transform" />
        </div>
        <div v-show="!ungroupedCollapsed" class="py-1">
          <div v-for="tab in ungroupedTabs" :key="tab.id"
               class="group flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer"
               @click="!isUngroupedBatchMode ? activateTab(tab.id) : toggleUngroupedSelect(tab.id)"
          >
            <input v-if="isUngroupedBatchMode" type="checkbox" :checked="ungroupedSelectedIds.includes(tab.id)" @click.stop @change.stop="toggleUngroupedSelect(tab.id)" class="cursor-pointer" />
            <FavIcon :src="tab.favIconUrl" :domain="tab.domain" size="sm" />
            <div class="flex-1 min-w-0">
              <p class="text-sm truncate" :class="tab.active ? 'font-semibold text-blue-900' : 'text-gray-900'">{{ tab.title }}</p>
              <p class="text-xs text-gray-500 truncate">{{ tab.domain.toLowerCase() }}</p>
            </div>
            <button class="p-1 text-gray-500 hover:text-red-500 rounded opacity-0 group-hover:opacity-100" @click.stop="closeTab(tab.id)">
              <X :size="14" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="groups.length === 0 && ungroupedTabs.length === 0" class="text-center text-gray-500 text-xs py-12">
        暂无标签
      </div>
    </div>

    <!-- 未分组选择模式的底部栏 -->
    <div v-if="isUngroupedBatchMode && ungroupedSelectedIds.length > 0" class="border-t border-gray-100 px-3 py-2 bg-white shrink-0">
      <div class="flex items-center justify-between">
        <button class="text-xs text-gray-600 hover:text-gray-800" @click="clearSelection">取消</button>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">{{ ungroupedSelectedIds.length }} 个选中</span>
          <button class="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700" @click="showCreateDialog = true">
            新建分组
          </button>
          <button class="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50" @click="showAddToGroupDialog = true">
            添加到分组
          </button>
        </div>
      </div>
    </div>

    <!-- 创建分组对话框 -->
    <CreateGroupDialog :open="showCreateDialog" :title="selectedTabIdsForCreate.length > 0 ? '从选中创建分组' : '新建分组'" :create-text="'创建'" @close="showCreateDialog = false" @create="handleCreateGroup" />

    <!-- 添加到分组对话框 -->
    <Teleport to="body">
      <div v-if="showAddToGroupDialog" class="fixed inset-0 z-[100] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30" @click="showAddToGroupDialog = false"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-72 p-4">
          <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600" @click="showAddToGroupDialog = false">
            <X :size="16" />
          </button>
          <h3 class="text-sm font-semibold text-gray-900 mb-4">添加到分组</h3>
          <div class="space-y-1 max-h-64 overflow-y-auto">
            <button v-for="g in groups" :key="g.id" :class="btn" @click="addToExistingGroup(g.id)">
              <span :class="[colorClass(g.color), 'w-3 h-3 rounded-full']"></span>
              {{ g.title || '未命名分组' }}
              <span class="text-gray-400 ml-auto">({{ g.tabs.length }})</span>
            </button>
            <hr v-if="groups.length" class="my-2 border-gray-100" />
            <button :class="[btn, 'text-blue-600']" @click="showAddToGroupDialog = false; showCreateDialog = true">
              <FolderPlus :size="12" />
              新建分组...
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { ChevronDown, X, FolderPlus } from "@lucide/vue"
import GroupItem from "./GroupItem.vue"
import CreateGroupDialog from "./CreateGroupDialog.vue"
import FavIcon from "./FavIcon.vue"
import { GROUP_COLOR_CLASSES } from "~composables/useTabGroups"
import type { TabItem } from "~types/tab"

const props = withDefaults(defineProps<{
  groups: chrome.tabGroups.TabGroup[]
  ungroupedTabs: TabItem[]
  guideShown: boolean
}>(), {
  // 兜底：即使父级传入 undefined（如初始化中途），也按空数组处理，绝不让 .length 崩溃
  groups: () => [],
  ungroupedTabs: () => [],
})

const emit = defineEmits<{
  activateTab: [id: number]
  closeTab: [id: number]
  createGroup: [tabIds: number[], name: string, color: string]
  addToGroup: [tabIds: number[], groupId: number]
  renameGroup: [id: number, name: string]
  changeGroupColor: [id: number, color: string]
  toggleGroupCollapse: [id: number, collapsed: boolean]
  ungroup: [id: number]
  closeGroupTabs: [id: number]
  markGuideShown: []
}>()

const btn = "flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-sm text-gray-700 rounded-md"

const ungroupedCollapsed = ref(false)
const isUngroupedBatchMode = ref(false)
const ungroupedSelectedIds = ref<number[]>([])
const showCreateDialog = ref(false)
const showAddToGroupDialog = ref(false)

const hasAnySelected = computed(() => ungroupedSelectedIds.value.length > 0)
const hasUngroupedSelected = computed(() => ungroupedSelectedIds.value.length > 0)

const selectedTabIdsForCreate = computed(() => ungroupedSelectedIds.value)

const colorClass = (color: string) => {
  return GROUP_COLOR_CLASSES[color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
}

const activateTab = (id: number) => {
  emit("activateTab", id)
}

const closeTab = (id: number) => {
  emit("closeTab", id)
}

const renameGroup = (id: number, name: string) => {
  emit("renameGroup", id, name)
}

const changeGroupColor = (id: number, color: string) => {
  emit("changeGroupColor", id, color)
}

const toggleGroupCollapse = (id: number, collapsed: boolean) => {
  emit("toggleGroupCollapse", id, collapsed)
}

const ungroup = (id: number) => {
  emit("ungroup", id)
}

const closeGroupTabs = (id: number) => {
  emit("closeGroupTabs", id)
}

const markGuideShown = () => {
  emit("markGuideShown")
}

const toggleUngroupedSelect = (id: number) => {
  const idx = ungroupedSelectedIds.value.indexOf(id)
  if (idx === -1) {
    ungroupedSelectedIds.value.push(id)
  } else {
    ungroupedSelectedIds.value.splice(idx, 1)
  }
  // 自动进入选择模式
  if (ungroupedSelectedIds.value.length > 0) {
    isUngroupedBatchMode.value = true
  }
}

const clearSelection = () => {
  ungroupedSelectedIds.value = []
  isUngroupedBatchMode.value = false
}

const openNewGroupForUngrouped = () => {
  // 自动选择第一个未分组标签（因为不能创建空分组）
  if (props.ungroupedTabs.length > 0 && ungroupedSelectedIds.value.length === 0) {
    ungroupedSelectedIds.value = [props.ungroupedTabs[0].id]
  }
  showCreateDialog.value = true
}

const handleCreateGroup = (name: string, color: string) => {
  const tabIds = ungroupedSelectedIds.value.length > 0 ? ungroupedSelectedIds.value : (props.ungroupedTabs.length > 0 ? [props.ungroupedTabs[0].id] : [])
  if (tabIds.length > 0) {
    emit("createGroup", tabIds, name, color)
  }
  showCreateDialog.value = false
  clearSelection()
}

const addToExistingGroup = (groupId: number) => {
  if (ungroupedSelectedIds.value.length > 0) {
    emit("addToGroup", ungroupedSelectedIds.value, groupId)
  }
  showAddToGroupDialog.value = false
  clearSelection()
}

// 监听未分组标签变化，清理不存在的选中
watch(() => props.ungroupedTabs, (tabs) => {
  const existingIds = new Set(tabs.map(t => t.id))
  ungroupedSelectedIds.value = ungroupedSelectedIds.value.filter(id => existingIds.has(id))
  if (ungroupedSelectedIds.value.length === 0) {
    isUngroupedBatchMode.value = false
  }
}, { deep: true })
</script>
