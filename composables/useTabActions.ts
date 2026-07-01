import { useTabManager } from "./useTabManager"

export function useTabActions(options: { showToast: (msg: string) => void }) {
  const { showToast } = options
  const {
    tabs,
    refreshTab,
    duplicateTab,
    pinTab,
    muteTab,
    closeTab,
    closeTabsExcept,
    moveToLater,
    addToGroup,
    removeFromGroup,
    createGroup,
  } = useTabManager()

  // ========== 单标签操作 ==========
  const refresh = (id: number) => {
    refreshTab(id)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    showToast("已复制URL")
  }

  const togglePin = (id: number) => {
    const tab = tabs.value.find(t => t.id === id)
    if (tab) {
      pinTab(id, !tab.pinned)
    }
  }

  const toggleMute = (id: number) => {
    const tab = tabs.value.find(t => t.id === id)
    if (tab) {
      muteTab(id, !tab.muted)
    }
  }

  const duplicate = (id: number) => {
    duplicateTab(id)
  }

  const close = (id: number) => {
    closeTab(id)
  }

  const closeOthers = (id: number) => {
    closeTabsExcept(id)
  }

  const addToGroupSingle = (tabId: number, groupId: number) => {
    addToGroup([tabId], groupId)
    showToast("已加入分组")
  }

  const removeFromGroupSingle = (tabId: number) => {
    removeFromGroup([tabId])
    showToast("已移出分组")
  }

  const newGroupSingle = async (tabId: number, name: string = "新分组", color: string = "blue") => {
    const id = await createGroup([tabId], name, color)
    if (id !== null) {
      showToast("已创建分组")
    }
  }

  // ========== 批量操作 ==========
  const batchClose = async (ids: number[]) => {
    const n = ids.length
    for (const id of ids) {
      await closeTab(id)
    }
    if (n) {
      showToast(`已关闭 ${n} 个标签`)
    }
  }

  const batchLater = async (ids: number[]) => {
    const n = ids.length
    for (const id of ids) {
      await moveToLater(id, "")
    }
    if (n) {
      showToast(`已加入稍后处理（${n}）`)
    }
  }

  const batchAddToGroup = async (ids: number[], groupId: number) => {
    const n = ids.length
    await addToGroup(ids, groupId)
    if (n) {
      showToast(`已加入分组（${n}）`)
    }
  }

  const batchNewGroup = async (ids: number[], name: string, color: string = "blue") => {
    const n = ids.length
    const id = await createGroup(ids, name, color)
    if (id !== null) {
      showToast(`已新建分组「${name}」（${n}）`)
    }
  }

  return {
    // 单标签操作
    refresh,
    copyUrl,
    togglePin,
    toggleMute,
    duplicate,
    close,
    closeOthers,
    addToGroupSingle,
    removeFromGroupSingle,
    newGroupSingle,
    // 批量操作
    batchClose,
    batchLater,
    batchAddToGroup,
    batchNewGroup,
  }
}
