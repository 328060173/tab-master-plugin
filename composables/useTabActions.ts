import { useTabManager } from "./useTabManager"
import { t, tWithParams } from "~lib/i18n"

export function useTabActions(options: {
  showToast: (msg: string) => void
  // 分组操作由 useTabGroups 提供（非单例，须由 sidepanel 传入同一实例的函数，
  // 否则从 useTabManager 解构会拿到 undefined -> "addToGroup is not a function"）
  addToGroup: (tabIds: number[], groupId: number) => Promise<void> | void
  removeFromGroup: (tabIds: number[]) => Promise<void> | void
  createGroup: (tabIds: number[], title?: string, color?: string) => Promise<number | null>
}) {
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
  } = { ...useTabManager(), ...options }

  // ========== 单标签操作 ==========
  const refresh = (id: number) => {
    refreshTab(id)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    showToast(t("toast.copied"))
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
    showToast(t("toast.addedToGroup"))
  }

  const removeFromGroupSingle = (tabId: number) => {
    removeFromGroup([tabId])
    showToast(t("toast.removedFromGroup"))
  }

  const newGroupSingle = async (tabId: number, name: string = t("sidepanel.batch.newGroupSingle"), color: string = "blue") => {
    const id = await createGroup([tabId], name, color)
    if (id !== null) {
      showToast(t("toast.groupCreated"))
    }
  }

  // ========== 批量操作 ==========
  const batchClose = async (ids: number[]) => {
    const n = ids.length
    for (const id of ids) {
      await closeTab(id)
    }
    if (n) {
      showToast(tWithParams("toast.closedTabs", { count: n }))
    }
  }

  const batchLater = async (ids: number[]) => {
    const n = ids.length
    for (const id of ids) {
      await moveToLater(id, "")
    }
    if (n) {
      showToast(tWithParams("toast.addedToLater", { count: n }))
    }
  }

  const batchAddToGroup = async (ids: number[], groupId: number) => {
    const n = ids.length
    await addToGroup(ids, groupId)
    if (n) {
      showToast(tWithParams("toast.addedToGroupCount", { count: n }))
    }
  }

  const batchNewGroup = async (ids: number[], name: string, color: string = "blue") => {
    const n = ids.length
    const id = await createGroup(ids, name, color)
    if (id !== null) {
      showToast(tWithParams("toast.newGroupCreated", { name, count: n }))
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
