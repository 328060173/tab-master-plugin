export interface TabItem {
  id: number
  title: string
  url: string
  domain: string
  favIconUrl: string
  pinned: boolean
  active: boolean
  audible: boolean
  discarded: boolean
  openedAt: string
  number: number
}

export interface LaterItem extends TabItem {
  laterNote: string
  laterAddedAt: string
}
