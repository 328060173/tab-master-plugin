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

/**
 * 0 标签统一提示文案（2026-07-28 立）。
 * 用户主动路径（手动备份 / 自动备份首次 / 导出当前 / 列表导出空快照 / 详情下载复制空快照）
 * 检测到 0 个可处理标签时 toast 阻断，复用此 key 避免魔法值。
 * 后台路径（定时/启动/事件/preRestore）不 toast，静默跳过（见 swBackup.ts / pipeline.ts）。
 *
 * 注意：此常量是 i18n key 字符串，消费侧须 `t(NO_TABS_HINT)` 翻译后再 toast。
 */
export const NO_TABS_HINT = 'backup.lib.noTabsHint'
