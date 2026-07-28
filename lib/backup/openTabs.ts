/**
 * 统一「打开标签」收口函数 - PRD §F / D09
 *
 * 三处调用方原本各自写 chrome.windows.create + chrome.tabs.create + pinned 处理 +
 * 跳过已开同 URL，逻辑高度重复。本模块收口为单一实现：
 * - lib/backup/openFromMemory（已删）：导入预览纯打开
 * - lib/backup/restore.executeRestore：还原 + 元数据写回（用 onTabOpened 收集 fp→tabId）
 * - composables/useBackupRestore.openSnapshot：UI 还原入口 + 元数据/审计/撤销
 *
 * 对外行为不变（本窗口/新窗口/pinned/跳过重复）；元数据写回、审计、撤销由调用方
 * 通过 onTabOpened 回调自行收集 fingerprint→tabId 映射后处理。
 *
 * 错误处理：单个 tab / 单个窗口失败用 console.warn 不抛，不阻断后续。
 */

import { isDev } from "~lib/env"

/** 要打开的单个 tab 描述 */
export interface OpenTabItem {
  url: string
  pinned?: boolean
  /** 调用方用于关联元数据的指纹（可选；纯打开场景不传） */
  fingerprint?: string
}

/** 要打开的窗口分组（按快照窗口结构） */
export interface OpenWindowGroup {
  tabs: OpenTabItem[]
  /** 是否聚焦该窗口（快照里第一个非隐身窗口聚焦） */
  focused?: boolean
  /** 窗口状态（从快照恢复时透传给 chrome.windows.create） */
  state?: "normal" | "maximized" | "minimized"
  /**
   * 该组是否新建窗口打开（覆盖全局 openInNewWindow）。
   * - 省略：用全局 openInNewWindow
   * - false：该组开到当前窗口（restore.replace 复用当前窗口作首窗口）
   * - true：该组新建窗口
   */
  openInNewWindow?: boolean
}

export interface OpenTabsOptions {
  /** 要打开的标签（按窗口分组）。每个 window 一组 tabs */
  windows: OpenWindowGroup[]
  /** true=按窗口结构新建窗口还原；false=全开到当前窗口 */
  openInNewWindow: boolean
  /** 跳过当前已打开的同 URL（默认 true） */
  skipDuplicateUrls?: boolean
  /** 进度回调（每打开一个 tab 调一次） */
  onProgress?: (opened: number) => void
  /** 每个 tab 打开后回调（用于元数据写回收集 fingerprint→tabId） */
  onTabOpened?: (item: OpenTabItem, tabId: number | undefined) => void
}

/**
 * 统一打开标签。返回实际打开数。
 *
 * 实现要点：
 * - 当前窗口查 chrome.windows.getCurrent()（失败则 currentWindowId=undefined，
 *   tabs.create 不传 windowId 会开到活动窗口，不阻断）
 * - skipDuplicateUrls=true 时查当前所有 url，过滤掉已开同 url + 空 url
 * - openInNewWindow=true：每组建窗口，首 tab 用 windows.create（避免多 1 个 New Tab），
 *   其余 tabs.create 补到该窗口；窗口创建失败退化为当前窗口继续开（不丢 tab）
 * - openInNewWindow=false：全部 tabs.create 到当前窗口
 * - pinned 在 tab 打开后单独 update
 */
export async function openTabs(opts: OpenTabsOptions): Promise<number> {
  const {
    windows,
    openInNewWindow,
    skipDuplicateUrls = true,
    onProgress,
    onTabOpened,
  } = opts
  if (!windows.length) return 0

  // 当前窗口 id（tabs.create 兜底目标）
  let currentWindowId: number | undefined
  try {
    const cw = await chrome.windows.getCurrent()
    currentWindowId = cw.id
  } catch {
    currentWindowId = undefined
  }

  // 收集当前所有 url（skipDuplicateUrls 时跳过已开同 url）
  const currentUrls = new Set<string>()
  if (skipDuplicateUrls) {
    try {
      const allTabs = await chrome.tabs.query({})
      for (const t of allTabs) {
        if (t.url) currentUrls.add(t.url)
      }
    } catch {
      // 查询失败不阻断，按不跳过处理
    }
  }

  // 过滤每个 window 的 tabs：跳过空 url + 跳过已开同 url
  const filteredWindows: OpenWindowGroup[] = []
  for (const w of windows) {
    const tabs = w.tabs.filter(
      (t) => !!t.url && (!skipDuplicateUrls || !currentUrls.has(t.url))
    )
    if (tabs.length > 0) {
      filteredWindows.push({ tabs, focused: w.focused, state: w.state })
    }
  }
  if (filteredWindows.length === 0) return 0

  let openedCount = 0

  const reportOpened = (item: OpenTabItem, tabId: number | undefined): void => {
    openedCount++
    onProgress?.(openedCount)
    onTabOpened?.(item, tabId)
  }

  /** 在指定窗口开一个 tab（windowId=undefined 时开到活动窗口） */
  const openOneTab = async (
    item: OpenTabItem,
    windowId: number | undefined
  ): Promise<void> => {
    try {
      const tab = await chrome.tabs.create({ url: item.url, active: false, windowId })
      if (item.pinned && typeof tab.id === "number") {
        await chrome.tabs.update(tab.id, { pinned: true }).catch(() => {})
      }
      reportOpened(item, typeof tab.id === "number" ? tab.id : undefined)
    } catch (e) {
      console.warn("[openTabs] 打开 tab 失败", item.url, e)
    }
  }

  if (openInNewWindow) {
    for (const win of filteredWindows) {
      // per-group 覆盖：undefined → 全局 true；否则用组内值
      const shouldNewWindow =
        typeof win.openInNewWindow === "boolean" ? win.openInNewWindow : true
      if (!shouldNewWindow) {
        // 该组开到当前窗口（restore.replace 首窗口复用当前窗口）
        for (const t of win.tabs) {
          await openOneTab(t, currentWindowId)
        }
        continue
      }
      const firstTab = win.tabs[0]
      let targetWindowId: number | undefined
      let firstOpened = false
      // windowCreatedOk 区分两种情况：
      //   true  = windows.create 成功（浏览器已把 firstTab.url 作为新窗口首个 tab 打开），
      //           此时即使 tabId 取不到也不能再 openOneTab（会重复开 tab），仅跳过标记关联。
      //   false = windows.create 整体失败（窗口没建成），需 openOneTab 真正首开首个 tab。
      let windowCreatedOk = false
      try {
        const newWin = await chrome.windows.create({
          url: firstTab.url,
          focused: !!win.focused,
          state: win.state,
        })
        if (typeof newWin.id === "number") {
          targetWindowId = newWin.id
          windowCreatedOk = true
          // windows.create 传了 url → 浏览器已开首个 tab；取真实 tabId
          // （Edge 某些版本/时机下 newWin.tabs 为空或 tab.id 未填充，用 query 兜底）
          let firstTabId = newWin.tabs?.[0]?.id
          if (typeof firstTabId !== "number") {
            const tabsInWin = await chrome.tabs.query({ windowId: newWin.id })
            firstTabId = tabsInWin[0]?.id
          }
          if (typeof firstTabId === "number") {
            if (firstTab.pinned) {
              await chrome.tabs.update(firstTabId, { pinned: true }).catch(() => {})
            }
            reportOpened(firstTab, firstTabId)
            firstOpened = true
          } else {
            // query 也拿不到（极端）：窗口已开首个 tab 但 id 取不到，
            // 跳过该 tab 的标记关联，不重复开 tab
            if (isDev) {
              console.warn(
                "[openTabs] 新窗口首个 tab id 取不到，跳过该 tab 的标记关联（不重复开 tab）",
                firstTab.url
              )
            }
          }
        }
      } catch (e) {
        // windows.create 整体失败：窗口没建成，落到当前窗口开首个 tab
        // （这才是真正的首次开 tab，不重复）
        if (isDev) console.warn("[openTabs] 新窗口创建失败，改用当前窗口", e)
        targetWindowId = currentWindowId
      }
      // 只有窗口没建成时才 openOneTab 首开；窗口已建成时首个 tab 已在窗口里，不重复开
      if (!windowCreatedOk && !firstOpened) {
        await openOneTab(firstTab, targetWindowId)
      }
      // 其余 tab 补到该窗口
      for (let i = 1; i < win.tabs.length; i++) {
        await openOneTab(win.tabs[i], targetWindowId)
      }
    }
  } else {
    for (const win of filteredWindows) {
      for (const t of win.tabs) {
        await openOneTab(t, currentWindowId)
      }
    }
  }

  return openedCount
}
