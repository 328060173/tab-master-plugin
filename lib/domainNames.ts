import domainConfig from "../config/domain-config.json"

interface DomainEntry {
  domain: string
  name: string
  comment: string
}

const entries: DomainEntry[] = domainConfig

const MAP: Record<string, string> = {}
entries.forEach((entry) => {
  MAP[entry.domain.toLowerCase()] = entry.name
})

export function getDomainLabel(domain: string): string {
  if (!domain) return ""
  // 子域名向上回溯：buy.cloud.tencent.com → cloud.tencent.com → tencent.com
  // 找到的第一个匹配就是最具体的（最长后缀）品牌名
  let host = domain.toLowerCase()
  while (host.includes(".")) {
    const hit = MAP[host]
    if (hit) return hit
    host = host.slice(host.indexOf(".") + 1)
  }
  return ""
}