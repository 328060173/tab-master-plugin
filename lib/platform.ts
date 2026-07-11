export const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
export const modKey = isMac ? '⌥' : 'Alt+'

/**
 * 快捷键编号的完整提示文案。
 * 用 chrome.commands API global 注册：统一 Ctrl+Shift+N（跨平台）。
 * global 命令限制只能 Ctrl+Shift+[0..9]（不能用 Command），且浏览器无焦点也触发。
 */
export const shortcutHint = (n: number | string) => `Ctrl+Shift+${n}`
