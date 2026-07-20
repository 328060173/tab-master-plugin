/**
 * 设置菜单（“更多”组）共享类型 —— 纯类型，无 Vue 依赖
 *
 * 架构（2026-07-16，与广告/版本/通知同模式）：
 * - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 *   POST /setting/menu-list 由 SW 发（body 含 customerType/versionCode/platform/appCode），写 tabMasterSettingMenuCache，sendMessage({type:'settingMenuCacheUpdated'}) 通知
 * - 菜单渲染：HeaderMenu 只读缓存，禁止任何 fetch 设置菜单请求
 * - 兜底：SW 未拉到缓存（首次/后端挂）时，useSettingMenu 内置默认 4 项（文档/FAQ/意见&需求反馈/联系我们）
 *
 * 后端接口：POST /setting/menu-list（@Anonymous），返回 R<SettingMenuListVO>
 * 后端按登录用户判灰度 + versionCode 过滤（前端传 versionCode=101）。
 */

/** 后端 SettingMenuVO 字段（单条菜单项） */
export interface SettingMenuItem {
  id: number
  /** 菜单项图标图片 URL（后端配置下发，可能为空，为空时前端用内置默认图标） */
  settingLogo: string
  /** 菜单项名称 */
  settingName: string
  /** 点击跳转 URL（http(s)） */
  settingUrl: string
  /** 排序值（升序） */
  settingSort: number
  /**
   * 内置默认图标名（前端兜底用，后端不返回此字段）。
   * settingLogo 为空时，前端按此名匹配内置 lucide 图标；匹配不上用 LinkIcon 兜底。
   */
  defaultIcon?: string
}

/** POST /setting/menu-list 响应体（SW 拉取，body 含 customerType/versionCode/platform/appCode，后端返回 R<SettingMenuListVO>） */
export interface SettingMenuResponse {
  code: number
  msg: string
  data: {
    menus: SettingMenuItem[] | null
    // 下次拉取间隔（分钟，默认 1440/24h），SW 据此设闹钟；缺失时 SW 兜底 1440
    nextSyncIntervalMinutes: number | null
  } | null
}

/** SW 写入 storage 的设置菜单缓存（key=tabMasterSettingMenuCache / tabMasterSettingMenuOptionsCache） */
export interface SettingMenuCacheData {
  menus: SettingMenuItem[]
  // 后端下发的下次拉取间隔（分钟），SW 据此设闹钟；null 时 SW 用 1440 兜底
  nextSyncIntervalMinutes: number | null
  lastSync: number         // 上次成功同步时间戳（ms）
}

/**
 * 菜单类型（后端 /setting/menu-list 的 settingType 参数）
 * - 1 = 插件 sidepanel 设置菜单（缓存 key=tabMasterSettingMenuCache，通知 settingMenuCacheUpdated）
 * - 2 = options.html 设置 tab 菜单（缓存 key=tabMasterSettingMenuOptionsCache，通知 settingMenuOptionsCacheUpdated）
 *
 * 注：cache key / msg type 常量在 background.ts（SW 写入端）与 composables/useSettingMenu.ts（UI 读取端）
 * 各自本地定义（沿用现有模式，不强行集中），改动时需同步三处：types/setting.ts 注释 + background.ts + useSettingMenu.ts
 */
export type SettingMenuType = 1 | 2
