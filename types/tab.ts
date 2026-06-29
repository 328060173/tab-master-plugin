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
