/**
 * 备份/导出标签 URL 过滤 - 共用函数
 *
 * 插件内部页（chrome-extension:// / chrome:// / edge:// / about:）无备份意义，
 * 备份/导出/自动备份统一过滤，避免把 sidepanel.html / backup.html / options.html 当成标签存进快照。
 * 保留 file:// 与正常 http(s)。
 */

/** 判断 URL 是否可备份（排除浏览器/扩展内部页） */
export function isBackupableUrl(url: string | undefined): boolean {
  if (!url) return false
  if (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:')
  ) {
    return false
  }
  return true
}

/** 从 chrome.tabs.Tab[] 过滤出可备份的标签（排除内部页 + 无 url） */
export function filterBackupableTabs(tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] {
  return tabs.filter((t) => isBackupableUrl(t.url))
}
