import type { TabItem } from "~types/tab"
import { getDomainLabel } from "~lib/domainNames"

// ISO 字符串或遗留 HH:mm 字符串 → 可比较的时间戳
export function parseTime(t: string): number {
  if (!t) return 0
  const ts = new Date(t).getTime()
  if (!isNaN(ts)) return ts
  // 兼容旧 HH:mm 格式
  const [h, m] = t.split(":").map(Number)
  return (h * 60 + m) * 60000
}

export function sortTabs(tabs: TabItem[], mode: string): TabItem[] {
  const s = [...tabs]
  if (mode === "domain") {
    return s.sort((a, b) => {
      const d = a.domain.toLowerCase().localeCompare(b.domain.toLowerCase())
      return d !== 0 ? d : parseTime(b.openedAt) - parseTime(a.openedAt)
    })
  }
  if (mode === "timeAsc") return s.sort((a, b) => parseTime(a.openedAt) - parseTime(b.openedAt))
  if (mode === "timeDesc") return s.sort((a, b) => parseTime(b.openedAt) - parseTime(a.openedAt))
  return s
}

export function groupByDomain(tabs: TabItem[]) {
  const map: Record<string, TabItem[]> = {}
  tabs.forEach(t => {
    const key = t.domain.toLowerCase()
    if (!map[key]) map[key] = []
    map[key].push(t)
  })
  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([domain, items]) => {
      const name = getDomainLabel(domain)
      return { domain, displayName: name ? `${name} · ${domain}` : domain, items }
    })
}
