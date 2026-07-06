import type { TabItem } from "~types/tab"
import { getDomainLabel } from "~lib/domainNames"
import { getRegistrableDomain } from "~lib/registrableDomain"

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
    // 按 eTLD+1 排序，让 www.volcengine.com / console.volcengine.com 相邻
    // 同一注册域内再按完整 host 子排序（让同子域的标签也聚拢），最后按打开时间正序（新打开的在后）
    return s.sort((a, b) => {
      const ra = getRegistrableDomain(a.domain)
      const rb = getRegistrableDomain(b.domain)
      const d1 = ra.localeCompare(rb)
      if (d1 !== 0) return d1
      const d2 = a.domain.toLowerCase().localeCompare(b.domain.toLowerCase())
      if (d2 !== 0) return d2
      return parseTime(a.openedAt) - parseTime(b.openedAt)
    })
  }
  if (mode === "timeAsc") return s.sort((a, b) => parseTime(a.openedAt) - parseTime(b.openedAt))
  if (mode === "timeDesc") return s.sort((a, b) => parseTime(b.openedAt) - parseTime(a.openedAt))
  return s
}

export function groupByDomain(tabs: TabItem[]) {
  // 分组 key = 注册域（eTLD+1），让 www. / console. / buy. 等子域归到一起
  const map: Record<string, TabItem[]> = {}
  tabs.forEach(t => {
    const key = getRegistrableDomain(t.domain)
    if (!map[key]) map[key] = []
    map[key].push(t)
  })
  return Object.entries(map)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([domain, items]) => {
      // 展示名：优先用品牌名（最长后缀匹配），否则用注册域本身
      const name = getDomainLabel(domain)
      return { domain, displayName: name ? `${name} · ${domain}` : domain, items }
    })
}
