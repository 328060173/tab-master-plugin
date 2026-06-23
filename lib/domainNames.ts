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
  return MAP[domain.toLowerCase()] || ""
}

export function getAllDomains(): DomainEntry[] {
  return entries
}