/**
 * 广告相关共享类型
 *
 * 两个 storage key 各司其职：
 * - tabMasterAdCache：广告素材 + hideAd 标志（SW 写入，sidepanel 只读）
 * - tabMasterAdState：展示去重状态（shownCount/interactedAdIds，sidepanel 读写）
 *
 * 架构（2026-07-16 重设计）：
 * - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 * - 缓存写入：SW 写 chrome.storage.local.tabMasterAdCache，sendMessage 通知 sidepanel
 * - 广告渲染：sidepanel 只读缓存，禁止任何 fetch 广告请求
 */

/** 后端 AdItemVO 字段（广告素材） */
export interface AdItem {
  id: number
  title: string
  imageUrl: string
  linkUrl: string
  duration: number       // 展示时长（秒）
  startTime: string
  endTime: string
}

/** 暴露给 UI 的广告信息（AdItem 的 UI 投影） */
export interface AdInfo {
  id: number
  title: string
  imageUrl: string
  linkUrl: string
  duration: number
}

/** SW 写入 storage 的广告缓存（key=tabMasterAdCache） */
export interface AdCacheData {
  hideAd: boolean              // 是否隐藏广告（VIP/登录用户 true）
  expireTime: number | null    // 免广告到期时间戳（ms），hideAd=true 时有效
  adData: AdItem | null        // 广告素材，无更新可为 null（消费后置 null，本窗口不再弹）
  lastSync: number             // 上次成功同步时间戳（ms）
  serverTime: number | null    // 后端返回的服务器时间
  // 后端下发的下次拉取间隔（分钟），SW 据此设闹钟；null 时 SW 用 480 兜底
  nextSyncIntervalMinutes: number | null
}

/** POST /ad/list 响应体（SW 拉取，body 含 customerType/platform/appCode/position/trigger，后端返回） */
export interface AdSyncResponse {
  code: number
  msg: string
  data: {
    hideAd: boolean
    expireTime: number | null
    adData: AdItem | null
    serverTime: number | null
    // 下次拉取间隔（分钟，banner 位=480），SW 据此设闹钟；缺失时 SW 兜底 480
    nextSyncIntervalMinutes: number | null
  } | null
}
