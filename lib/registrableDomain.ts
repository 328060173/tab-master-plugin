/**
 * 提取注册域名（eTLD+1，"site"概念）
 *
 * 设计取舍：
 * - 不引 `tldts` / `psl` 等第三方库（~50KB+ 太重，不值得）
 * - 内置一份中文+国际常见复合后缀清单（约 30 条），覆盖 99% 国内用户场景
 * - 罕见 ccTLD（如 .gov.tr / .com.ua）漏掉退化为"末两段"，可接受
 *
 * 用法：
 *   getRegistrableDomain("buy.cloud.tencent.com")  // → "tencent.com"
 *   getRegistrableDomain("www.bbc.co.uk")          // → "bbc.co.uk"
 *   getRegistrableDomain("weibo.com.cn")           // → "weibo.com.cn"
 *   getRegistrableDomain("localhost")              // → "localhost"
 *
 * 参考：Public Suffix List（https://publicsuffix.org/list/）—— 这里是它的极小化子集
 */

// 双段公共后缀：末两段都是"伪 TLD"，eTLD+1 应取末三段
const TWO_PART_PUBLIC_SUFFIXES = new Set([
  // 中国大陆
  "com.cn", "net.cn", "org.cn", "gov.cn", "edu.cn", "ac.cn", "mil.cn",
  // 香港
  "com.hk", "org.hk", "edu.hk", "gov.hk", "net.hk",
  // 台湾
  "com.tw", "org.tw", "edu.tw", "gov.tw", "net.tw",
  // 日本
  "co.jp", "ne.jp", "or.jp", "ac.jp", "go.jp",
  // 韩国
  "co.kr", "or.kr", "go.kr",
  // 英国
  "co.uk", "org.uk", "gov.uk", "ac.uk", "me.uk",
  // 澳新
  "com.au", "org.au", "gov.au", "edu.au", "net.au", "co.nz", "org.nz",
  // 东南亚
  "com.sg", "com.my", "com.ph",
  // 印度
  "co.in", "org.in", "net.in",
  // 拉美
  "com.br", "com.mx", "com.ar", "com.co",
  // 欧洲杂项
  "com.tr", "com.ua", "co.il",
])

export function getRegistrableDomain(host: string): string {
  if (!host) return ""
  // 清理：小写 + 去末尾点 + 去端口
  let h = host.toLowerCase().replace(/\.$/, "").replace(/:\d+$/, "")
  // IPv4 直接返回（不是真域名）
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return h
  const parts = h.split(".")
  if (parts.length < 2) return h
  const last2 = parts.slice(-2).join(".")
  if (parts.length >= 3 && TWO_PART_PUBLIC_SUFFIXES.has(last2)) {
    return parts.slice(-3).join(".")
  }
  return last2
}
