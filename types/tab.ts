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
  number: number
  tags: string[]
  openerTabId?: number
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
