/**
 * 外部资源 URL 统一校验出口
 *
 * 背景：后端广告接口曾返回占位测试域名（example.com）的 imageUrl，<img> 加载必然失败，
 * chrome 扩展页"问题/Errors"面板会原生记录资源加载失败（浏览器行为，非 JS 异常，
 * try/catch/preventDefault 拦不住）。本模块集中维护黑名单与校验逻辑，后续加规则只改这里。
 *
 * 两个校验函数：
 * - {@link isValidExternalUrl}：严格校验 http(s) 外部 URL，命中黑名单返回 false。
 *   用于后端返回的外部图片 URL（如 AdBanner 的 ad.imageUrl）。
 * - {@link isRenderableImgSrc}：放宽校验，额外放行浏览器内部协议与 data:image 内联图。
 *   用于收浏览器多协议来源的 <img>（如 FavIcon 的 tab.favIconUrl，可能是 chrome:// /
 *   chrome-extension:// / data:image 等）。
 */

/**
 * 占位/测试域名黑名单——集中维护，后续加域名只改这里。
 * - example.com / example.org / example.net：IANA 保留占位域名，永远无法解析出真实资源
 * - test / localhost / 127.0.0.1 / 0.0.0.0：本地/测试环境，生产扩展不应加载
 */
const BLOCKED_HOSTS: readonly string[] = [
  'example.com',
  'example.org',
  'example.net',
  'test',
  'localhost',
  '127.0.0.1',
  '0.0.0.0'
]

/**
 * 判断 host 是否命中黑名单（支持子域名回溯：foo.example.com 也命中 example.com）。
 */
function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase()
  return BLOCKED_HOSTS.some((b) => h === b || h.endsWith('.' + b))
}

/**
 * 统一校验外部资源 URL：渲染 <img src> 前过滤掉必然失败的占位/测试 URL。
 *
 * 规则：
 * 1. 空 / 非 string → false
 * 2. 非 http(s) 协议 → false（拦 data: blob: javascript: file: 等非外部协议；
 *    data: URI 的场景应走 {@link isRenderableImgSrc}）
 * 3. host 命中 {@link BLOCKED_HOSTS} → false
 * 4. 其余 → true
 *
 * 用途：避免 chrome 扩展 errors 面板被资源加载失败记录污染。
 */
export function isValidExternalUrl(url: unknown): boolean {
  if (typeof url !== 'string' || !url) return false
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return false
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false
  return !isBlockedHost(u.hostname)
}

/**
 * 校验是否为可安全跳转的外部链接（用于菜单/按钮点击 chrome.tabs.create）。
 *
 * 规则：空/非 string → false；非 http(s) 协议 → false（拦 javascript: data: 等）；
 *       其余 → true。
 *
 * 与 {@link isValidExternalUrl} 区别：**不查 BLOCKED_HOSTS 黑名单**。
 * 黑名单是为拦"<img> 去加载占位测试域名"（资源加载场景），但菜单跳转 URL 是用户主动
 * 点击要打开的页面，dev 环境官网就在 localhost:5173，必须放行。跳转只需防危险协议。
 */
export function isSafeExternalLink(url: unknown): boolean {
  if (typeof url !== 'string' || !url) return false
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return false
  }
  return u.protocol === 'http:' || u.protocol === 'https:'
}

/**
 * 浏览器内部协议白名单——这些协议由浏览器自身解析加载，不产生外部网络请求，
 * 也不会触发"资源加载失败"污染 errors 面板。FavIcon 的 tab.favIconUrl 可能返回这些协议。
 */
const BROWSER_INTERNAL_PROTOCOLS: readonly string[] = [
  'chrome:',
  'chrome-extension:',
  'edge:',
  'about:',
  'moz-extension:'
]

/**
 * 判断 <img src> 是否可安全渲染——用于收浏览器多协议来源的场景（如 FavIcon）。
 *
 * 放行：
 * - 通过 {@link isValidExternalUrl} 的 http(s) URL（含黑名单过滤）
 * - 浏览器内部协议（chrome / chrome-extension / edge / about / moz-extension）：
 *   浏览器可自行加载，非外部资源
 * - data:image/* URI：站点内联 favicon（<link rel="icon" href="data:...">），合法
 *
 * 拦截：
 * - 空 / 非 string
 * - blob: / javascript: / file: / vbscript: 等不可信或非图片协议
 * - data: 非 image 子类型
 * - http(s) 命中黑名单的占位/测试域名
 */
export function isRenderableImgSrc(url: unknown): boolean {
  if (typeof url !== 'string' || !url) return false
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return false
  }
  // 浏览器内部协议：放行
  if (BROWSER_INTERNAL_PROTOCOLS.includes(u.protocol)) return true
  // data: 仅放行 image/* 子类型（站点内联 favicon）
  if (u.protocol === 'data:') return /^data:image\//i.test(url)
  // http(s)：走外部 URL 校验（含黑名单）
  if (u.protocol === 'http:' || u.protocol === 'https:') {
    return !isBlockedHost(u.hostname)
  }
  // 其余协议（blob: javascript: file: vbscript: ...）一律拦截
  return false
}
