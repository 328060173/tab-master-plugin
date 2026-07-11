export const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
export const modKey = isMac ? '⌥' : 'Alt+'

/**
 * 快捷键编号的完整提示文案。
 * chrome.commands 注册 Alt+Shift+N（跨平台统一：Mac=Option⌥+Shift⇧+N，Win=Alt+Shift+N）。
 * 浏览器层捕获（不走 keydown），不受 Mac Option 特殊字符影响。
 * 浏览器有焦点时触发（非 global，但用户在浏览器里用标签，够用）。
 */
export const shortcutHint = (n: number | string) => isMac ? `⌥⇧${n}` : `Alt+Shift+${n}`
