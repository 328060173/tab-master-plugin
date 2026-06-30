import { ref, computed, onMounted, onUnmounted, type Ref } from "vue"
import type { TabItem } from "~types/tab"

// 支持的分组颜色
export const GROUP_COLORS = [
  "grey", "blue", "red", "yellow", "green", "pink", "purple", "cyan", "orange"
] as const
export type GroupColor = typeof GROUP_COLORS[number]

// 颜色映射到 Tailwind 类
export const GROUP_COLOR_CLASSES: Record<GroupColor, string> = {
  grey: "bg-gray-400",
  blue: "bg-blue-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
}

// 带标签的分组类型
export interface TabGroupWithTabs extends chrome.tabGroups.TabGroup {
  tabs: TabItem[]
}

// 检查是否支持 tabGroups API
export const SUPPORTS_TAB_GROUPS = typeof chrome?.tabGroups?.query === "function"

// chrome.tabGroups.TAB_GROUP_ID_NONE 常量值（=-1），在 <template> 里无法访问 chrome
// 全局，所以这里导出一份给模板用
export const TAB_GROUP_ID_NONE = chrome?.tabGroups?.TAB_GROUP_ID_NONE ?? -1

// 过滤掉聚焦模式的隐藏分组
export function isNotFocusGroup(group: chrome.tabGroups.TabGroup): boolean {
  return group.title !== "🌙 已隐藏"
}

export function useTabGroups(tabsRef: Ref<readonly TabItem[]>) {
  const groups = ref<TabGroupWithTabs[]>([])
  const guideShown = ref(false)

  // 获取未分组的标签（tabsRef 是 ref，必须用 .value；并对非数组兜底，避免渲染崩溃）
  const ungroupedTabs = computed(() =>
    (Array.isArray(tabsRef.value) ? tabsRef.value : []).filter(t => t.groupId === TAB_GROUP_ID_NONE)
  )

  // 加载分组
  const loadGroups = async () => {
    if (!SUPPORTS_TAB_GROUPS) return
    try {
      const rawGroups = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT })
      groups.value = rawGroups
        .filter(isNotFocusGroup)
        .map(g => ({
          ...g,
          tabs: tabsRef.value.filter(t => t.groupId === g.id),
        }))
    } catch (e) {
      console.error("Failed to load tab groups:", e)
    }
  }

  // 创建新分组
  const createGroup = async (tabIds: number[], title?: string, color?: GroupColor): Promise<number | null> => {
    if (!SUPPORTS_TAB_GROUPS || tabIds.length === 0) return null
    try {
      // 必须传纯数组：tabIds 多来自 Vue 响应式 ref(.value 是 Proxy)，
      // 直接传给 chrome.tabs.group 会被 Chrome 的类型校验当成 object 拒绝
      const groupId = await chrome.tabs.group({ tabIds: [...tabIds] })
      if (title || color) {
        await chrome.tabGroups.update(groupId, { title, color })
      }
      return groupId
    } catch (e) {
      console.error("Failed to create group:", e)
      return null
    }
  }

  // 将标签添加到现有分组
  const addToGroup = async (tabIds: number[], groupId: number) => {
    if (!SUPPORTS_TAB_GROUPS) return
    try {
      await chrome.tabs.group({ tabIds: [...tabIds], groupId })
    } catch (e) {
      console.error("Failed to add tabs to group:", e)
    }
  }

  // 将标签从分组中移除
  const removeFromGroup = async (tabIds: number[]) => {
    if (!SUPPORTS_TAB_GROUPS) return
    try {
      await chrome.tabs.ungroup([...tabIds])
    } catch (e) {
      console.error("Failed to remove tabs from group:", e)
    }
  }

  // 更新分组
  const updateGroup = async (groupId: number, updates: { title?: string; color?: GroupColor; collapsed?: boolean }) => {
    if (!SUPPORTS_TAB_GROUPS) return
    try {
      await chrome.tabGroups.update(groupId, updates)
    } catch (e) {
      console.error("Failed to update group:", e)
    }
  }

  // 解散分组
  const ungroupAll = async (groupId: number) => {
    if (!SUPPORTS_TAB_GROUPS) return
    try {
      const groupTabs = tabsRef.value.filter(t => t.groupId === groupId).map(t => t.id)
      if (groupTabs.length > 0) {
        await chrome.tabs.ungroup(groupTabs)
      }
    } catch (e) {
      console.error("Failed to ungroup all:", e)
    }
  }

  // 关闭分组内所有标签
  const closeGroupTabs = async (groupId: number) => {
    if (!SUPPORTS_TAB_GROUPS) return
    try {
      const groupTabs = tabsRef.value.filter(t => t.groupId === groupId).map(t => t.id)
      if (groupTabs.length > 0) {
        await chrome.tabs.remove(groupTabs)
      }
    } catch (e) {
      console.error("Failed to close group tabs:", e)
    }
  }

  // 根据 groupId 获取分组
  const getGroupById = (groupId: number): TabGroupWithTabs | undefined => {
    return groups.value.find(g => g.id === groupId)
  }

  // 分组事件监听
  const onGroupCreated = (group: chrome.tabGroups.TabGroup) => {
    if (!isNotFocusGroup(group)) return
    groups.value.push({
      ...group,
      tabs: tabsRef.value.filter(t => t.groupId === group.id),
    })
  }

  const onGroupRemoved = (group: chrome.tabGroups.TabGroup) => {
    const idx = groups.value.findIndex(g => g.id === group.id)
    if (idx !== -1) {
      groups.value.splice(idx, 1)
    }
  }

  const onGroupUpdated = (group: chrome.tabGroups.TabGroup) => {
    if (!isNotFocusGroup(group)) return
    const idx = groups.value.findIndex(g => g.id === group.id)
    if (idx !== -1) {
      groups.value[idx] = {
        ...group,
        tabs: tabsRef.value.filter(t => t.groupId === group.id),
      }
    }
  }

  const onGroupMoved = (group: chrome.tabGroups.TabGroup) => {
    if (!isNotFocusGroup(group)) return
    // 移动后重新加载分组以确保顺序正确
    loadGroups()
  }

  // 加载引导标志
  const loadGuideFlag = async () => {
    try {
      const data = await chrome.storage.local.get(["tabGroupsGuideShown"])
      guideShown.value = !!data.tabGroupsGuideShown
    } catch {}
  }

  // 标记引导已显示
  const markGuideShown = async () => {
    guideShown.value = true
    try {
      await chrome.storage.local.set({ tabGroupsGuideShown: true })
    } catch {}
  }

  onMounted(() => {
    loadGroups()
    loadGuideFlag()
    if (SUPPORTS_TAB_GROUPS) {
      chrome.tabGroups.onCreated.addListener(onGroupCreated)
      chrome.tabGroups.onRemoved.addListener(onGroupRemoved)
      chrome.tabGroups.onUpdated.addListener(onGroupUpdated)
      chrome.tabGroups.onMoved.addListener(onGroupMoved)
    }
  })

  onUnmounted(() => {
    if (SUPPORTS_TAB_GROUPS) {
      chrome.tabGroups.onCreated.removeListener(onGroupCreated)
      chrome.tabGroups.onRemoved.removeListener(onGroupRemoved)
      chrome.tabGroups.onUpdated.removeListener(onGroupUpdated)
      chrome.tabGroups.onMoved.removeListener(onGroupMoved)
    }
  })

  // 当 tabs 变化时更新分组内的标签
  const updateGroupTabs = () => {
    groups.value = groups.value.map(g => ({
      ...g,
      tabs: tabsRef.value.filter(t => t.groupId === g.id),
    }))
  }

  return {
    groups,
    ungroupedTabs,
    guideShown,
    SUPPORTS_TAB_GROUPS,
    loadGroups,
    createGroup,
    addToGroup,
    removeFromGroup,
    updateGroup,
    ungroupAll,
    closeGroupTabs,
    getGroupById,
    markGuideShown,
    updateGroupTabs,
  }
}
