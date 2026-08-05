import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import type { ComputedRef } from "vue"
import type { TabItem } from "~types/tab"
import { t } from "~lib/i18n"

// 检查浏览器是否支持聚焦模式所需的 API
export const SUPPORTS_FOCUS_MODE = typeof chrome?.storage?.session?.set === 'function'
  && typeof chrome?.tabGroups?.update === 'function'

// 聚焦状态类型
interface FocusState {
  active: boolean
  focusedTabIds: number[]
  hiddenGroupId: number | null
  enteredAt: string
}

// 本地存储标志类型
interface LocalFocusFlags {
  focusModeShown?: boolean
  focusUsageCount?: number
}

// Toast 事件类型
export type FocusToastEvent =
  | { type: 'group_recollapsed' }
  | { type: 'tab_added_to_focus'; tabTitle: string }
  | { type: 'all_focus_closed' }
  | { type: 'enter_focus'; count: number }
  | { type: 'exit_focus' }

export function useFocusMode(tabs: ComputedRef<readonly TabItem[]>) {
  // 三态：普通、选择、聚焦
  const mode = ref<'normal' | 'selecting' | 'focusing'>('normal')
  const selectedTabIds = ref<number[]>([])
  const focusedTabIds = ref<number[]>([])
  const hiddenGroupId = ref<number | null>(null)
  const enteredAt = ref<string>('')
  // showHelpBubble 已迁移到 PopoverManager（id='focus-help'），见 components/FocusHelpBubble.vue
  const isFirstTime = ref(true)

  // Toast 事件发射器（sidepanel 可以 watch 这个来显示 toast）
  const toastEvent = ref<FocusToastEvent | null>(null)

  // 首次使用标志
  const checkFirstTime = async () => {
    if (!SUPPORTS_FOCUS_MODE) return
    const data = await chrome.storage.local.get(['focusModeShown'] as (keyof LocalFocusFlags)[])
    isFirstTime.value = !data.focusModeShown
  }

  const markAsShown = async () => {
    if (!SUPPORTS_FOCUS_MODE) return
    isFirstTime.value = false
    await chrome.storage.local.set({ focusModeShown: true })
  }

  // 过滤掉受保护的标签（不能被分组），并且排除固定标签（固定标签强制在聚焦集合）
  const selectableTabs = computed(() => {
    return tabs.value.filter(t => !t.isProtected && !t.pinned)
  })

  // 已选择标签 + 固定标签 = 最终聚焦标签
  const selectedTabs = computed(() => {
    return tabs.value.filter(t => selectedTabIds.value.includes(t.id))
  })

  // 聚焦中的标签（包括固定标签）
  const focusingTabs = computed(() => {
    return tabs.value.filter(t => focusedTabIds.value.includes(t.id))
  })

  // 受保护标签数量
  const protectedTabCount = computed(() => {
    return tabs.value.filter(t => t.isProtected).length
  })

  // 检查是否有选中标签
  const hasSelected = computed(() => selectedTabIds.value.length > 0)

  // 保存到 session storage
  const saveFocusState = async () => {
    if (!SUPPORTS_FOCUS_MODE) return
    const state: FocusState = {
      active: mode.value === 'focusing',
      focusedTabIds: focusedTabIds.value,
      hiddenGroupId: hiddenGroupId.value,
      enteredAt: enteredAt.value,
    }
    await chrome.storage.session.set({ focusState: state })
  }

  // 从 session storage 恢复
  const restoreFocusState = async () => {
    if (!SUPPORTS_FOCUS_MODE) return
    const data = await chrome.storage.session.get(['focusState'])
    if (data.focusState?.active) {
      // 浏览器重启后分组可能还在，但聚焦状态需要重置
      const savedState = data.focusState as FocusState
      // 检查聚焦的标签是否还存在
      const stillExists = savedState.focusedTabIds.filter(id => tabs.value.some(t => t.id === id))
      if (stillExists.length > 0) {
        // 自动退出聚焦，但保留分组让用户手动处理
        mode.value = 'normal'
        await chrome.storage.session.remove(['focusState'])
        return { wasActive: true, reset: true }
      }
    }
    return { wasActive: false, reset: false }
  }

  // 进入选择态
  const enterSelectMode = () => {
    mode.value = 'selecting'
    selectedTabIds.value = []
  }

  // 退出选择态
  const exitSelectMode = () => {
    mode.value = 'normal'
    selectedTabIds.value = []
  }

  // 切换选择标签
  const toggleSelectTab = (id: number) => {
    const idx = selectedTabIds.value.indexOf(id)
    if (idx === -1) {
      selectedTabIds.value = [...selectedTabIds.value, id]
    } else {
      selectedTabIds.value = selectedTabIds.value.filter(i => i !== id)
    }
  }

  // 开始聚焦
  const startFocusing = async (): Promise<{ needActivateFirst: boolean; firstTabId?: number }> => {
    if (selectedTabIds.value.length === 0) return { needActivateFirst: false }

    // 固定标签强制加入聚焦集合
    const pinnedTabIds = tabs.value.filter(t => t.pinned).map(t => t.id)
    const allFocusedIds = [...new Set([...selectedTabIds.value, ...pinnedTabIds])]

    // 需要隐藏的标签：非聚焦、非固定、非受保护
    const toGroupIds = tabs.value
      .filter(t => !allFocusedIds.includes(t.id) && !t.isProtected && t.id !== undefined)
      .map(t => t.id! as number)

    // 检查是否需要激活第一个标签
    const activeInSelected = tabs.value.find(t => t.active && allFocusedIds.includes(t.id))
    const needActivateFirst = !activeInSelected
    const firstTabId = allFocusedIds.find(id => {
      const tab = tabs.value.find(t => t.id === id)
      return tab && !tab.pinned
    }) ?? allFocusedIds[0]

    let groupId: number | null = null

    // 创建分组并折叠
    if (toGroupIds.length > 0) {
      try {
        groupId = await chrome.tabs.group({ tabIds: toGroupIds })
        await chrome.tabGroups.update(groupId, {
          collapsed: true,
          color: 'grey',
          title: t('focus.hiddenGroupTitle')
        })
      } catch (e) {
        console.error('Failed to group tabs:', e)
      }
    }

    // 更新状态
    mode.value = 'focusing'
    focusedTabIds.value = allFocusedIds
    hiddenGroupId.value = groupId
    enteredAt.value = new Date().toISOString()

    // 保存到 session storage
    await saveFocusState()
    // 标记已使用
    await markAsShown()

    // 发送进入聚焦 toast 事件
    toastEvent.value = { type: 'enter_focus', count: allFocusedIds.length }

    return { needActivateFirst, firstTabId }
  }

  // 退出聚焦模式
  const exitFocusing = async () => {
    // 取消分组
    if (hiddenGroupId.value !== null) {
      try {
        // 获取分组中的所有标签
        const groupTabs = await chrome.tabs.query({ groupId: hiddenGroupId.value })
        if (groupTabs.length > 0) {
          const tabIds = groupTabs.map(t => t.id!).filter(id => id !== undefined) as number[]
          await chrome.tabs.ungroup(tabIds)
        }
      } catch (e) {
        console.error('Failed to ungroup tabs:', e)
      }
    }

    // 清除状态
    mode.value = 'normal'
    selectedTabIds.value = []
    focusedTabIds.value = []
    hiddenGroupId.value = null
    enteredAt.value = ''

    // 清除 session storage
    if (SUPPORTS_FOCUS_MODE) {
      await chrome.storage.session.remove(['focusState'])
    }

    // 发送退出聚焦 toast 事件
    toastEvent.value = { type: 'exit_focus' }
  }

  // 聚焦中关闭标签
  const onFocusTabClosed = async (id: number) => {
    // 从聚焦列表移除
    focusedTabIds.value = focusedTabIds.value.filter(i => i !== id)
    // 如果是最后一个，自动退出
    if (focusedTabIds.value.length === 0) {
      await exitFocusing()
      // 发送所有聚焦标签已关闭 toast
      toastEvent.value = { type: 'all_focus_closed' }
    } else {
      await saveFocusState()
    }
  }

  // 聚焦中打开新标签
  const onNewTabInFocus = async (id: number) => {
    // 自动加入聚焦
    focusedTabIds.value = [...focusedTabIds.value, id]
    await saveFocusState()
    const tab = tabs.value.find(t => t.id === id)
    if (tab) {
      toastEvent.value = { type: 'tab_added_to_focus', tabTitle: tab.title }
    }
  }

  // 监听分组更新事件（用户手动展开灰色分组时自动重新折叠）
  const onTabGroupUpdated = async (group: chrome.tabGroups.TabGroup) => {
    if (mode.value !== 'focusing') return
    if (group.id !== hiddenGroupId.value) return

    // 如果分组被展开了，自动重新折叠
    if (group.collapsed === false) {
      try {
        await chrome.tabGroups.update(group.id, { collapsed: true })
        toastEvent.value = { type: 'group_recollapsed' }
      } catch (e) {
        console.error('Failed to recollapse group:', e)
      }
    }
  }

  // 监听标签激活事件（用户从灰色分组激活标签时，将其加入聚焦集合）
  const onTabActivated = async (activeInfo: chrome.tabs.TabActiveInfo) => {
    if (mode.value !== 'focusing') return
    if (hiddenGroupId.value === null) return

    const tabId = activeInfo.tabId

    // 检查被激活的标签是否在灰色分组里
    try {
      const tab = await chrome.tabs.get(tabId)
      if (tab.groupId === hiddenGroupId.value) {
        // 将标签从分组中移除
        await chrome.tabs.ungroup([tabId])
        // 加入聚焦集合
        focusedTabIds.value = [...focusedTabIds.value, tabId]
        await saveFocusState()
        toastEvent.value = { type: 'tab_added_to_focus', tabTitle: tab.title || '' }
      }
    } catch (e) {
      console.error('Failed to handle tab activation in focus mode:', e)
    }
  }

  onMounted(() => {
    if (!SUPPORTS_FOCUS_MODE) return
    checkFirstTime()
    // 注册监听
    chrome.tabGroups.onUpdated.addListener(onTabGroupUpdated)
    chrome.tabs.onActivated.addListener(onTabActivated)
  })

  onUnmounted(() => {
    if (!SUPPORTS_FOCUS_MODE) return
    // 移除监听
    chrome.tabGroups.onUpdated.removeListener(onTabGroupUpdated)
    chrome.tabs.onActivated.removeListener(onTabActivated)
  })

  return {
    mode,
    selectedTabIds,
    selectedTabs,
    focusingTabs,
    hiddenGroupId,
    selectableTabs,
    protectedTabCount,
    hasSelected,
    isFirstTime,
    toastEvent,
    SUPPORTS_FOCUS_MODE,
    enterSelectMode,
    exitSelectMode,
    toggleSelectTab,
    startFocusing,
    exitFocusing,
    onFocusTabClosed,
    onNewTabInFocus,
    restoreFocusState,
    markAsShown,
  }
}
