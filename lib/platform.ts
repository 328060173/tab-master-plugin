export const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
export const modKey = isMac ? '⌥' : 'Alt+'

/**
 * 快捷键编号的完整提示文案。
 * 用 chrome.commands API 全局注册：Mac=Command+Shift+N，Windows/Linux=Ctrl+Shift+N。
 * 浏览器层面捕获，任何焦点下都生效（不必先点 sidepanel）。
 */
export const shortcutHint = (n: number | string) => isMac ? `⌘⇧${n}` : `Ctrl+Shift+${n}`
