/**
 * HTTP 请求工具（统一拦截器）
 *
 * 集中处理：
 * 1. 请求头构建（buildHeaders）：公共头（platform/appCode/versionCode）+ 登录态（Authorization Bearer）+ 调用方额外头
 *    - 后续新增公共头统一加到 buildHeaders 或 api-config.ts 的 APP_HEADERS
 * 2. 登录态注入：useAuth 初始化时调 setTokenGetter 注册 token 获取器，本层自动注入 Authorization
 * 3. 401 鉴权过期：自动调 authExpiredHandler（useAuth 注册，清登录态 + 标记 sessionExpired）
 * 4. 超时/错误：AbortController 超时，code!==200 抛错
 *
 * 本层返回完整响应体（不自动取 .data），调用方按接口实际结构取字段
 */

import { API_BASE_URL, APP_HEADERS } from './api-config'

// 基础响应类型（code/msg 必有，其他字段按接口而定）
export interface BaseResponse {
  code: number
  msg: string
}

// 请求选项
interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  uri: string
  body?: unknown
  params?: Record<string, string | number>  // URL query 参数（GET 常用）
  extraHeaders?: Record<string, string>
  timeout?: number
}

// 超时时间默认 15 秒
const DEFAULT_TIMEOUT = 15000

// ============ 鉴权拦截器（由 useAuth 注册）============
// token 获取器：返回当前 token 或 null
let tokenGetter: (() => string | null) | null = null
// 登录状态获取器：返回是否已登录（决定 customerType 请求头取值）
let loggedInGetter: (() => boolean) | null = null
// 401 处理回调：token 过期/缺失时清登录态
let authExpiredHandler: (() => void) | null = null

/**
 * 注册 token 获取器（useAuth 初始化时调用）
 * 本层每次请求会调它拿 token，非空则注入 Authorization: Bearer <token>
 */
export function setTokenGetter(fn: () => string | null) {
  tokenGetter = fn
}

/**
 * 注册登录状态获取器（useAuth 初始化时调用）
 * 登录后所有请求带 customerType: 1 请求头，未登录带 0
 * 后端免登录接口（版本/广告/通知）靠此头区分登录态，做灰度/统计
 */
export function setLoggedInGetter(fn: () => boolean) {
  loggedInGetter = fn
}

/**
 * 注册 401 鉴权过期处理（useAuth 初始化时调用）
 * 收到 401 时自动调用，清登录态 + 标记 sessionExpired
 */
export function setAuthExpiredHandler(fn: () => void) {
  authExpiredHandler = fn
}

/**
 * 统一构建请求头（后续新增公共头都在这里加）
 * 优先级：默认头 < APP_HEADERS < Authorization(登录态) + customerType < extraHeaders(调用方覆盖)
 */
function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  // 公共应用头（platform/appCode/versionCode）
  Object.entries(APP_HEADERS).forEach(([key, value]) => {
    headers[key] = String(value)
  })
  // 登录态：有 token 就带 Authorization + customerType
  // customerType: 1=已登录, 0=未登录（后端 AccessCustomerTypeEnum，免登录接口靠此区分登录态）
  const token = tokenGetter?.()
  const isLoggedIn = loggedInGetter?.() ?? false
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  headers['customerType'] = isLoggedIn ? '1' : '0'
  // 调用方额外头（覆盖前面，允许针对单次请求覆盖 appCode 等）
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      headers[key] = String(value)
    })
  }
  return headers
}

/**
 * 通用请求函数
 * 返回完整响应体（不自动取 .data），调用方按接口实际结构取字段
 *
 * 统一日志：所有请求自动打 [api] 日志（方法/url/状态/耗时），方便调试确认接口是否发出。
 * 静默失败场景（版本检查/广告）由调用方传 silent:true 抑制错误日志（但仍打一行请求日志）。
 */
async function request<T extends BaseResponse = BaseResponse>({
  method,
  uri,
  body,
  params,
  extraHeaders,
  timeout = DEFAULT_TIMEOUT,
  silent = false
}: RequestOptions & { silent?: boolean }): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  // 拼 query 参数（GET 常用，如 /ad/list?position=banner）
  let queryString = ''
  if (params) {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => sp.append(k, String(v)))
    queryString = '?' + sp.toString()
  }
  const url = API_BASE_URL + uri + queryString
  const startedAt = Date.now()
  // 请求发出日志（让用户能在控制台看到接口确实发了）
  console.log(`[api] → ${method} ${uri}`, body ? { body } : '')

  try {
    const headers = buildHeaders(extraHeaders)

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    })

    // 401 未授权：token 过期或调需登录接口但未登录
    // 后端若依 SecurityConfig 对未登录访问受保护接口返回 401
    if (response.status === 401) {
      console.log(`[api] ← ${method} ${uri} 401 (${Date.now() - startedAt}ms) 登录过期`)
      authExpiredHandler?.()
      throw new Error('登录已过期，请重新登录')
    }

    const result: T = await response.json()

    // 业务层 401（部分接口可能用 code=401 而非 HTTP 401）
    if (result.code === 401) {
      console.log(`[api] ← ${method} ${uri} code=401 (${Date.now() - startedAt}ms) 登录过期`)
      authExpiredHandler?.()
      throw new Error('登录已过期，请重新登录')
    }

    if (result.code === 200) {
      console.log(`[api] ← ${method} ${uri} 200 (${Date.now() - startedAt}ms)`)
      return result
    } else {
      console.log(`[api] ← ${method} ${uri} code=${result.code} (${Date.now() - startedAt}ms) ${result.msg}`)
      throw new Error(result.msg || '请求失败')
    }
  } catch (error) {
    const elapsed = Date.now() - startedAt
    if (error instanceof Error && error.name === 'AbortError') {
      // 超时：silent 模式只打一行 warn（版本检查/广告等非关键路径），否则打 error
      if (silent) console.warn(`[api] ← ${method} ${uri} 超时 (${elapsed}ms, 静默)`)
      else console.error(`[api] ← ${method} ${uri} 超时 (${elapsed}ms)`)
      throw new Error('请求超时，请稍后再试')
    }
    // 其他错误（网络/业务码非200）：silent 模式降级为 warn
    if (silent) console.warn(`[api] ← ${method} ${uri} 失败 (${elapsed}ms, 静默)`, error)
    else console.error(`[api] ← ${method} ${uri} 失败 (${elapsed}ms)`, error)
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * 便捷 GET 方法
 * 泛型 T 表示完整响应体类型（含 code/msg）
 * options.silent=true 时失败/超时降级为 warn 日志（版本检查/广告等非关键路径用）
 */
export function get<T extends BaseResponse = BaseResponse>(uri: string, options?: Omit<RequestOptions, 'method' | 'uri' | 'body'> & { silent?: boolean }) {
  return request<T>({ method: 'GET', uri, ...options })
}

/**
 * 便捷 POST 方法
 * 泛型 T 表示完整响应体类型（含 code/msg）
 * options.silent=true 时失败/超时降级为 warn 日志
 */
export function post<T extends BaseResponse = BaseResponse>(uri: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'uri' | 'body'> & { silent?: boolean }) {
  return request<T>({ method: 'POST', uri, body, ...options })
}
