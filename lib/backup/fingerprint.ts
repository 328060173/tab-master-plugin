/**
 * 标签指纹算法 - PRD §5.1.3
 *
 * 用 URL 规范化 + sha1 组合生成稳定指纹，让标记/分组在 tabId 重启变更后
 * 仍能对得上（不依赖 chrome.sessions.setTabValue，Chrome 无此 API）。
 *
 * 实现要点：
 * - urlNormalized：去 utm_xxx / fbclid / gclid 等追踪参数 + query 排序 + 去 hash + 小写 scheme/host
 * - titleNorm：trim + 折叠空白 + 小写
 * - 主指纹：sha1(urlNormalized + '|' + titleNorm)
 * - 弱指纹：sha1(host + path)，强匹配失败兜底
 * - sha1 用 Web Crypto API（crypto.subtle.digest），MV3 SW 与 sidepanel 均可用
 */

const NOISE_QUERY_KEYS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'utm_id', 'utm_referrer',
  'fbclid', 'gclid', 'gbraid', 'wbraid', 'msclkid', 'yclid', 'mc_eid',
])

/**
 * 规范化 URL：
 * - 去 utm_xxx / fbclid / gclid 等追踪参数
 * - query 参数按键名排序
 * - 去 hash（动态 SPA 锚点不稳定）
 * - 小写 scheme + host
 * - 去除末尾斜杠（除根路径）
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl) return ''
  let u: URL
  try {
    u = new URL(rawUrl)
  } catch {
    return rawUrl
  }
  u.protocol = u.protocol.toLowerCase()
  u.hostname = u.hostname.toLowerCase()
  // 过滤追踪参数 + 排序
  const kept: [string, string][] = []
  u.searchParams.forEach((v, k) => {
    if (!NOISE_QUERY_KEYS.has(k.toLowerCase())) kept.push([k, v])
  })
  kept.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
  const sp = new URLSearchParams()
  for (const [k, v] of kept) sp.append(k, v)
  u.search = sp.toString()
  u.hash = ''
  // 末尾斜杠：仅 path > '/' 时去掉
  let p = u.pathname
  if (p.length > 1 && p.endsWith('/')) p = p.replace(/\/+$/, '')
  u.pathname = p
  return u.toString()
}

/** 规范化标题：trim + 折叠空白 + 小写 */
export function normalizeTitle(title: string): string {
  return (title || '').trim().replace(/\s+/g, ' ').toLowerCase()
}

function bufferToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i++) {
    const h = bytes[i].toString(16)
    s += h.length < 2 ? '0' + h : h
  }
  return s
}

/** 计算主指纹 sha1(urlNormalized + '|' + titleNorm) */
export async function computeFingerprint(url: string, title: string): Promise<string> {
  const text = `${normalizeUrl(url)}|${normalizeTitle(title)}`
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text))
  return bufferToHex(buf)
}

/** 计算弱指纹 sha1(host + path) — 强匹配失败兜底 */
export async function computeWeakFingerprint(url: string): Promise<string> {
  let host = ''
  let path = ''
  try {
    const u = new URL(url)
    host = u.hostname.toLowerCase()
    path = u.pathname
  } catch {
    host = url
  }
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(host + path))
  return bufferToHex(buf)
}

/** 生成 uuid-v4（无 crypto.randomUUID 时降级） */
export function uuidV4(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const h = (i: number) => bytes[i].toString(16).padStart(2, '0')
  return `${h(0)}${h(1)}${h(2)}${h(3)}-${h(4)}${h(5)}-${h(6)}${h(7)}-${h(8)}${h(9)}-${h(10)}${h(11)}${h(12)}${h(13)}${h(14)}${h(15)}`
}
