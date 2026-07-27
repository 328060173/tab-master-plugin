/**
 * 从内存中的 BackupFile 直接打开标签（不走 IndexedDB，不写回元数据）。
 *
 * 用途：导入预览阶段的「本窗口打开 / 新窗口打开」——用户先看效果，未确认是否
 * 写入备份列表。与 useBackupRestore.openSnapshot 的区别：
 * - 不调用 svc.appendImportedSnapshot（不写 IDB）
 * - 不调用 restoreMeta（不写回标记/稍后/分组）
 * - 仅创建浏览器标签，保留 pinned 状态，跳过已打开同 URL，按多窗口结构还原
 *
 * 用户「确认导入到备份列表」后，可在备份列表里走完整还原流程（含元数据写回）。
 */

import type { BackupFile, TabSnapshot } from "~types/backup"

/**
 * 打开内存中 BackupFile 的指定标签。
 * @param file 待打开的备份文件（来自 parseImport，尚未写 IDB）
 * @param fps 选中的标签指纹集合（fingerprint）
 * @param openInNewWindow true=按快照窗口结构新建窗口还原；false=补开到当前窗口
 * @returns 实际打开的标签数
 */
export async function openTabsFromMemory(
  file: BackupFile,
  fps: Set<string>,
  openInNewWindow: boolean,
): Promise<number> {
  const allTabs = await chrome.tabs.query({})
  const currentUrls = new Set<string>()
  for (const t of allTabs) {
    if (t.url) currentUrls.add(t.url)
  }
  let currentWindowId: number | undefined
  try {
    const cw = await chrome.windows.getCurrent()
    currentWindowId = cw.id
  } catch {
    currentWindowId = undefined
  }

  const windowsToOpen: { tabs: TabSnapshot[]; focused: boolean }[] = []
  let firstFocused = true
  for (const w of file.snapshot.windows) {
    if (w.incognito) continue
    const tabs = w.tabs.filter((t) => fps.has(t.fingerprint) && !currentUrls.has(t.url))
    if (tabs.length > 0) {
      windowsToOpen.push({ tabs, focused: firstFocused })
      firstFocused = false
    }
  }

  if (windowsToOpen.length === 0) return 0

  let openedCount = 0
  if (openInNewWindow) {
    for (const win of windowsToOpen) {
      try {
        const newWin = await chrome.windows.create({
          url: win.tabs[0].url,
          focused: !!win.focused,
        })
        const targetWindowId = typeof newWin.id === "number" ? newWin.id : currentWindowId
        const firstTabId = newWin.tabs?.[0]?.id
        if (typeof firstTabId === "number" && win.tabs[0].pinned) {
          await chrome.tabs.update(firstTabId, { pinned: true }).catch(() => {})
        }
        openedCount++
        for (let i = 1; i < win.tabs.length; i++) {
          try {
            const tab = await chrome.tabs.create({ url: win.tabs[i].url, active: false, windowId: targetWindowId })
            if (win.tabs[i].pinned && typeof tab.id === "number") {
              await chrome.tabs.update(tab.id, { pinned: true }).catch(() => {})
            }
            openedCount++
          } catch (err) {
            console.warn("[openTabsFromMemory] 打开 tab 失败", win.tabs[i].url, err)
          }
        }
      } catch (err) {
        console.warn("[openTabsFromMemory] 新建窗口失败", err)
      }
    }
  } else {
    for (const win of windowsToOpen) {
      for (const t of win.tabs) {
        try {
          const tab = await chrome.tabs.create({ url: t.url, active: false, windowId: currentWindowId })
          if (t.pinned && typeof tab.id === "number") {
            await chrome.tabs.update(tab.id, { pinned: true }).catch(() => {})
          }
          openedCount++
        } catch (err) {
          console.warn("[openTabsFromMemory] 打开 tab 失败", t.url, err)
        }
      }
    }
  }
  return openedCount
}
