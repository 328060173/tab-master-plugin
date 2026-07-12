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
  extraHeaders?: Record<string, string>
  timeout?: number
}

// 超时时间默认 15 秒
const DEFAULT_TIMEOUT = 15000

// ============ 鉴权拦截器（由 useAuth 注册）============
// token 获取器：返回当前 token 或 null
let tokenGetter: (() => string | null) | null = null
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
 * 注册 401 鉴权过期处理（useAuth 初始化时调用）
 * 收到 401 时自动调用，清登录态 + 标记 sessionExpired
 */
export function setAuthExpiredHandler(fn: () => void) {
  authExpiredHandler = fn
}

/**
 * 统一构建请求头（后续新增公共头都在这里加）
 * 优先级：默认头 < APP_HEADERS < Authorization(登录态) < extraHeaders(调用方覆盖)
 */
function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  // 公共应用头（platform/appCode/versionCode）
  Object.entries(APP_HEADERS).forEach(([key, value]) => {
    headers[key] = String(value)
  })
  // 登录态：有 token 就带 Authorization（后端按接口判断是否需要鉴权，@Anonymous 接口忽略）
  const token = tokenGetter?.()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
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
 */
async function request<T extends BaseResponse = BaseResponse>({
  method,
  uri,
  body,
  extraHeaders,
  timeout = DEFAULT_TIMEOUT
}: RequestOptions): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const url = `${API_BASE_URL}${uri}`
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
      authExpiredHandler?.()
      throw new Error('登录已过期，请重新登录')
    }

    const result: T = await response.json()

    // 业务层 401（部分接口可能用 code=401 而非 HTTP 401）
    if (result.code === 401) {
      authExpiredHandler?.()
      throw new Error('登录已过期，请重新登录')
    }

    if (result.code === 200) {
      return result
    } else {
      throw new Error(result.msg || '请求失败')
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('请求超时，请稍后再试')
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * 便捷 GET 方法
 * 泛型 T 表示完整响应体类型（含 code/msg）
 */
export function get<T extends BaseResponse = BaseResponse>(uri: string, options?: Omit<RequestOptions, 'method' | 'uri' | 'body'>) {
  return request<T>({ method: 'GET', uri, ...options })
}

/**
 * 便捷 POST 方法
 * 泛型 T 表示完整响应体类型（含 code/msg）
 */
export function post<T extends BaseResponse = BaseResponse>(uri: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'uri' | 'body'>) {
  return request<T>({ method: 'POST', uri, body, ...options })
}
