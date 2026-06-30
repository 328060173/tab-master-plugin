export interface TabItem {
  id: number
  title: string
  url: string
  domain: string
  favIconUrl: string
  pinned: boolean
  active: boolean
  audible: boolean
  muted: boolean
  discarded: boolean
  frozen: boolean
  loading: boolean
  recording: boolean
  sharing: boolean
  attention: boolean
  hasUnsavedForm: boolean
  hasConnectedDevice: boolean
  isProtected: boolean
  openedAt: string
  /** 上次访问时间戳（毫秒）。Chrome 121+ 原生提供；老版本由 background.ts 兜底采集 */
  lastAccessed?: number
  number: number
  tags: string[]
  openerTabId?: number
  groupId: number
}

export interface LaterItem extends TabItem {
  laterNote: string
  laterAddedAt: string
}

export interface ClosedTabItem {
  id: number
  title: string
  url: string
  domain: string
  favIconUrl: string
  closedAt: string
}

/** 浏览历史项（来自 chrome.history，需用户授权 optional_permission "history"） */
export interface HistoryItem {
  /** Chrome 历史记录 ID（字符串） */
  id: string
  title: string
  url: string
  domain: string
  favIconUrl: string
  /** 最近一次访问时间（毫秒时间戳） */
  lastVisitTime: number
  /** 访问次数 */
  visitCount: number
}
