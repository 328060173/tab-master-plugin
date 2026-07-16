/**
 * 版本检查相关共享类型（纯类型，无 Vue 依赖）
 *
 * 架构（2026-07-16 重设计，与广告同模式）：
 * - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 * - 缓存写入：SW 写 chrome.storage.local.tabMasterVersionCache，sendMessage({type:'versionCacheUpdated'}) 通知
 * - 版本横幅渲染：sidepanel 只读缓存，禁止任何 fetch 版本请求
 *
 * 两个 storage key 各司其职：
 * - tabMasterVersionCache：版本数据缓存（SW 写入，sidepanel 只读）
 * - tabMasterVersionCheck：用户关闭记录 dismissedVersionCode（sidepanel 读写）
 */

/** 后端 OuuAppsVersion 字段（版本数据） */
export interface VersionData {
  appCode: string
  platform: number
  versionCode: number
  versionName: string
  forceFlag: 0 | 1
  changeLog: string
}

/** /version/check-version 响应体（SW 拉取，后端返回） */
export interface CheckVersionResponse {
  code: number
  msg: string
  data: {
    updateFlag: 1 | 2  // 1=有更新, 2=无更新
    versionData: VersionData | null
    // 下次拉取间隔（分钟，version=1440/24h），SW 据此设闹钟；缺失时 SW 兜底 1440
    nextSyncIntervalMinutes: number | null
  } | null
}

/** SW 写入 storage 的版本缓存（key=tabMasterVersionCache） */
export interface VersionCacheData {
  updateFlag: 1 | 2            // 1=有更新, 2=无更新
  versionData: VersionData | null
  // 后端下发的下次拉取间隔（分钟），SW 据此设闹钟；null 时 SW 用 1440 兜底
  nextSyncIntervalMinutes: number | null
  lastSync: number             // 上次成功同步时间戳（ms）
}

/** 暴露给 UI 的更新信息（VersionData 的 UI 投影） */
export interface UpdateInfo {
  hasUpdate: boolean
  forceFlag: 0 | 1
  versionName: string
  versionCode: number
  changeLog: string
}
