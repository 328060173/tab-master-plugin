/**
 * 消息通知相关共享类型（纯类型，无 Vue 依赖）
 *
 * 架构（2026-07-16 重设计，与广告同模式）：
 * - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 * - 缓存写入：SW 写 chrome.storage.local.tabMasterNoticeCache，sendMessage({type:'noticeCacheUpdated'}) 通知
 * - 通知条渲染：sidepanel 只读缓存，禁止任何 fetch 通知请求
 *
 * 两个 storage key 各司其职：
 * - tabMasterNoticeCache：通知列表缓存（SW 写入，sidepanel 只读）
 * - tabMasterNoticeRead：已读 id 列表（sidepanel 读写，永久保留，已读的不再展示）
 *
 * 后端接口原 @Deprecated 的 R<TableDataInfo> 已改成 R<NoticeSyncVO>（rows/total/nextSyncIntervalMinutes）
 */

/** 通知项（后端 OuuAppsNotice 字段：id/noticeLog/createTime/...） */
export interface NoticeItem {
  id: number
  noticeLog: string       // 通知内容
  createTime: string
}

/** /notice/page-list 响应体（SW 拉取，后端返回 R<NoticeSyncVO>） */
export interface NoticeSyncResponse {
  code: number
  msg: string
  data: {
    rows: NoticeItem[] | null
    total: number
    // 下次拉取间隔（分钟，notice=240/4h），SW 据此设闹钟；缺失时 SW 兜底 240
    nextSyncIntervalMinutes: number | null
  } | null
}

/** SW 写入 storage 的通知缓存（key=tabMasterNoticeCache） */
export interface NoticeCacheData {
  rows: NoticeItem[]
  // 后端下发的下次拉取间隔（分钟），SW 据此设闹钟；null 时 SW 用 240 兜底
  nextSyncIntervalMinutes: number | null
  lastSync: number         // 上次成功同步时间戳（ms）
}
