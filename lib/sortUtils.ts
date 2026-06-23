import type { TabItem } from "~types/tab"
import { getDomainLabel } from "~lib/domainNames"

export function parseTime(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
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
