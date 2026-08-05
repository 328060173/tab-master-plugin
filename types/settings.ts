/**
 * 浏览器标签大师全局设置。
 *
 * 字段说明：
 * - theme: 界面主题。'system' 跟随系统（默认）
 * - fontSize: 字号档位。三档：'normal'(标准 默认) / 'large'(大) / 'xlarge'(超大)
 *   实现原理：改 :root font-size，Tailwind 的 text-xs/sm/base (rem 单位) 自动响应
 * - fontFamily: 字体族。仅 system / mono 两档
 * - defaultView / defaultSort / cardDensity: 列表显示偏好（在 options 独立设置页里调整）
 *
 * 注：旧版本曾有 language 字段，本版本已删除；旧版数据由 useSettings.mergeSettings 自动忽略
 */
export interface TabMasterSettings {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'normal' | 'large' | 'xlarge'
  fontFamily: 'system' | 'mono'
  defaultView: 'tile' | 'list' | 'icon' | 'tree'
  defaultSort: 'domain' | 'time-asc' | 'time-desc'
  cardDensity: 'compact' | 'normal' | 'loose'
  /** 自动数据校正：每 60s 全量校正标签列表与浏览器实际状态，兜底事件丢失。默认开启，用户可在设置-更多设置关闭 */
  autoReconcile: boolean
  /** 首页搜索框是否显示，默认 true */
  homeSearchVisible: boolean
  /** 首页标记栏是否显示，默认 true */
  homeTagBarVisible: boolean
}

export const DEFAULT_SETTINGS: TabMasterSettings = {
  theme: 'system',      // 默认跟随系统主题
  fontSize: 'normal',   // 默认标准字号
  fontFamily: 'system',
  defaultView: 'tile',
  defaultSort: 'time-desc',
  cardDensity: 'normal',
  autoReconcile: true,
  homeSearchVisible: true, // 默认显示搜索框
  homeTagBarVisible: true, // 默认显示标记栏
}
