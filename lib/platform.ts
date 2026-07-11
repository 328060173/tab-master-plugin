export const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
export const modKey = isMac ? '⌥' : 'Alt+'

/**
 * 快捷键编号的完整提示文案（Mac=⌥⇧N，Windows=Alt+Shift+N）。
 * Alt+数字 被 Chrome 浏览器全局占用（切换标签页），sidepanel 收不到事件，
 * 故用 Alt+Shift+数字 避开冲突。提示语必须与此一致，否则用户按提示操作不生效。
 */
export const shortcutHint = (n: number | string) => isMac ? `⌥⇧${n}` : `Alt+Shift+${n}`
