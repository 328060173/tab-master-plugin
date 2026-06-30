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
    <div class="px-3 py-2 border-b border-gray-100 flex items-center justify-between gap-2 min-h-[40px]">
      <!-- 有选中：选中栏 -->
      <template v-if="hasAnySelected">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-blue-700">已选 {{ ungroupedSelectedIds.length }} 个</span>
          <button class="text-xs text-gray-500 hover:text-gray-800" @click="clearSelection">取消</button>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
            title="用选中的标签创建一个新分组"
            @click="showCreateDialog = true">
            <FolderPlus :size="12" />新建分组
          </button>
          <button :class="['p-0.5 rounded transition-colors', showHelp ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600']" title="这是什么？" @click="showHelp = !showHelp"><HelpCircle :size="14" /></button>
        </div>
      </template>
      <!-- 无选中：提示如何开始 -->
      <template v-else>
        <span class="text-xs text-gray-400">{{ ungroupedTabs.length > 0 ? '勾选下方未分组标签 → 新建分组 / 放入已有分组' : '分组管理' }}</span>
        <button :class="['p-0.5 rounded transition-colors', showHelp ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600']" title="这是什么？" @click="showHelp = !showHelp"><HelpCircle :size="14" /></button>
      </template>
    </div>

    <!-- 功能说明（点问号展开）-->
    <div v-if="showHelp" class="px-3 py-2.5 bg-blue-50 border-b border-blue-100 text-[11px] leading-relaxed text-blue-800">
      <p class="mb-1">把相关标签<b>归到一组</b>，颜色+名称标识，和 Chrome 原生标签组实时同步（标签栏也能看到）。</p>
      <p class="mb-1"><b>怎么用：</b>① 在「未分组」里<b>勾选</b>几个标签 → ② 点顶部<b>「新建分组」</b>起名选色，<b>或</b> hover/点已有分组右侧的<b>「← 放入」</b>并进去。</p>
      <p>每个分组可重命名、改颜色、折叠、解散。🔒 分组关系仅本机/浏览器，不上传。</p>
    </div>

    <!-- 分组列表 -->
    <div class="flex-1 overflow-y-auto px-3 py-2">
      <!-- 临时调试：验证错误捕获链路。点一下应该：① ErrorBoundary 显示错误明文 ② 进运行日志页。验证完删掉 -->
      <button class="mb-2 px-2 py-1 text-[10px] border border-dashed border-red-300 text-red-600 rounded hover:bg-red-50" @click="debugThrow">🐛 点我测试错误捕获</button>
      <GroupItem v-for="group in groups" :key="group.id"
        :group="group"
        :tabs="group.tabs"
        :is-batch-mode="false"
        :can-drop-in="hasAnySelected"
        :drop-in-count="ungroupedSelectedIds.length"
        @activate-tab="activateTab"
        @close-tab="closeTab"
        @rename-group="renameGroup"
        @change-group-color="changeGroupColor"
        @toggle-group-collapse="toggleGroupCollapse"
        @ungroup="ungroup"
        @close-group-tabs="closeGroupTabs"
        @drop-in="handleDropIn"
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
          <!-- 搜索 + 排序（未分组数量多时方便定位）-->
          <div class="flex items-center gap-1.5 px-2 py-1.5 border-b border-gray-100 sticky top-0 bg-white dark:bg-gray-800 z-[1]">
            <div class="relative flex-1">
              <input v-model="searchQuery" type="text" placeholder="搜索未分组标签..."
                class="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 pr-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400" />
              <button v-if="searchQuery" class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700" @click="searchQuery = ''"><X :size="11" /></button>
            </div>
            <button class="flex items-center gap-0.5 px-1.5 py-1 text-[11px] border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 shrink-0" :title="sortMode === 'time' ? '按打开时间倒序，点击切到 ID' : '按标签 ID 倒序，点击切到时间'" @click="sortMode = sortMode === 'time' ? 'id' : 'time'">
              <ArrowUpDown :size="11" />{{ sortMode === 'time' ? '时间' : 'ID' }}
            </button>
          </div>
          <div v-for="tab in filteredUngrouped" :key="tab.id"
               class="group flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer"
               :class="ungroupedSelectedIds.includes(tab.id) && 'bg-blue-50'"
               @click="toggleUngroupedSelect(tab.id)"
          >
            <input type="checkbox" :checked="ungroupedSelectedIds.includes(tab.id)" title="勾选以分组" @click.stop @change.stop="toggleUngroupedSelect(tab.id)" class="cursor-pointer shrink-0" />
            <FavIcon :src="tab.favIconUrl" :domain="tab.domain" size="sm" />
            <div class="flex-1 min-w-0" @click.stop="activateTab(tab.id)">
              <p class="text-sm truncate" :class="tab.active ? 'font-semibold text-blue-900' : 'text-gray-900'">{{ tab.title }}</p>
              <p class="text-xs text-gray-500 truncate">{{ tab.domain.toLowerCase() }}</p>
            </div>
            <button class="p-1 text-gray-500 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 shrink-0" title="关闭标签" @click.stop="closeTab(tab.id)">
              <X :size="14" />
            </button>
          </div>
          <div v-if="!filteredUngrouped.length" class="text-center text-[11px] text-gray-400 py-4">
            {{ searchQuery ? '没匹配到标签' : '暂无未分组标签' }}
          </div>
        </div>
      </div>

      <div v-if="groups.length === 0 && ungroupedTabs.length === 0" class="text-center text-gray-500 text-xs py-12">
        <p class="mb-1 font-medium text-gray-500">还没有标签可分组 🗂️</p>
        <p class="leading-relaxed">打开一些标签后，在「未分组」里勾选几个<br/>就能创建分组，给它们起名、配色</p>
        <p class="mt-1.5 text-[10px] text-gray-300">点右上角 ? 看怎么用</p>
      </div>
    </div>

    <!-- 创建分组对话框 -->
    <CreateGroupDialog :open="showCreateDialog" :title="`新建分组 · 包含 ${ungroupedSelectedIds.length} 个标签`" :create-text="'创建'" @close="showCreateDialog = false" @create="handleCreateGroup" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { ChevronDown, X, FolderPlus, HelpCircle, ArrowUpDown } from "@lucide/vue"
import GroupItem from "./GroupItem.vue"
import CreateGroupDialog from "./CreateGroupDialog.vue"
import FavIcon from "./FavIcon.vue"
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

const ungroupedCollapsed = ref(false)
const ungroupedSelectedIds = ref<number[]>([])
const showCreateDialog = ref(false)
const showHelp = ref(false)
const searchQuery = ref("")
const sortMode = ref<"time" | "id">("time")

const hasAnySelected = computed(() => ungroupedSelectedIds.value.length > 0)

// 未分组标签：搜索过滤 + 排序（时间倒序=打开时间，或 ID 倒序）
const filteredUngrouped = computed(() => {
  let list = [...props.ungroupedTabs]
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(t =>
      (t.title || "").toLowerCase().includes(q) ||
      (t.url || "").toLowerCase().includes(q) ||
      (t.domain || "").toLowerCase().includes(q)
    )
  }
  if (sortMode.value === "id") {
    list.sort((a, b) => b.id - a.id)
  } else {
    // 时间倒序：openedAt 大的在前；openedAt 缺失时退回 id
    list.sort((a, b) => {
      const ta = new Date(a.openedAt).getTime() || 0
      const tb = new Date(b.openedAt).getTime() || 0
      if (ta === tb) return b.id - a.id
      return tb - ta
    })
  }
  return list
})

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

// 临时调试：故意抛错，验证错误捕获链路（ErrorBoundary 显示 + 运行日志记录）。验证完删掉
const debugThrow = () => {
  const arr: number[] = []
  // 数组越界 + 故意访问 undefined 的属性，触发 TypeError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const x: any = arr[5]
  console.log("调试：即将抛错，x =", x.notExist.foo)
}

const toggleUngroupedSelect = (id: number) => {
  const idx = ungroupedSelectedIds.value.indexOf(id)
  if (idx === -1) ungroupedSelectedIds.value.push(id)
  else ungroupedSelectedIds.value.splice(idx, 1)
}

const clearSelection = () => {
  ungroupedSelectedIds.value = []
}

const handleCreateGroup = (name: string, color: string) => {
  // 复选框常显，新建分组按钮只在有选中时出现，所以这里一定有选中
  const tabIds = [...ungroupedSelectedIds.value]
  if (tabIds.length > 0) {
    emit("createGroup", tabIds, name, color)
  }
  showCreateDialog.value = false
  clearSelection()
}

// 点已有分组的「← 放入」：把选中的未分组标签加入该分组
const handleDropIn = (groupId: number) => {
  if (ungroupedSelectedIds.value.length === 0) return
  emit("addToGroup", [...ungroupedSelectedIds.value], groupId)
  clearSelection()
}

// 监听未分组标签变化，清理已不存在的选中
watch(() => props.ungroupedTabs, (tabs) => {
  const existingIds = new Set(tabs.map(t => t.id))
  ungroupedSelectedIds.value = ungroupedSelectedIds.value.filter(id => existingIds.has(id))
}, { deep: true })
</script>
