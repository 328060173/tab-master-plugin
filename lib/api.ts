/**
 * HTTP 请求工具（统一拦截器）
 *
 * 集中处理：
 * 1. 请求头构建（buildHeaders）：公共头（platform/appCode/versionCode）+ 登录态（Authorization Bearer）+ 调用方额外头
 *    - 后续新增公共头统一加到 buildHeaders 或 api-config.ts 的 APP_HEADERS
 * 2. 登录态注入：useAuth 初始化时调 setTokenGetter 注册 token 获取器，本层自动注入 Authorization
 * 3. 401 鉴权过期：自动调 authExpiredHandler（useAuth 注册，清登录态 + 标记 sessionExpired）
 * 4. 超时/错误：AbortController 超时；错误归一为 NetworkError / ApiError；NetworkError 自动重试 1 次
 *
 * 错误归一（L1）：
 * - NetworkError：网络层（fetch TypeError=Failed to fetch / AbortError=超时 / 其他传输层异常）。可重试。
 * - ApiError：HTTP 401 / 业务码非 200。不重试。
 * - 调用方拿到的永远是这两个类型之一（不再裸 Error），便于 L3 全局捕获区分「业务错误 vs 代码崩溃」。
 *
 * 本层返回完整响应体（不自动取 .data），调用方按接口实际结构取字段
 */

import { API_BASE_URL, APP_HEADERS } from './api-config'
import { isDev } from './env'

// ============ 错误类型（L1 归一，导出供 L3 useLogger instanceof 判别）============
/**
 * 网络层错误：fetch 抛 TypeError（Failed to fetch）/ AbortError（超时）/ 其他传输层异常。
 * 可重试（fetchWithRetry 会重试 1 次）。
 */
export class NetworkError extends Error {
  readonly kind = 'network'
  readonly url: string
  readonly elapsed: number
  constructor(message: string, url: string, elapsed: number) {
    super(message)
    this.name = 'NetworkError'
    this.url = url
    this.elapsed = elapsed
  }
}

/**
 * 业务层错误：HTTP 401（鉴权过期）或响应体 code 非 200。不重试。
 */
export class ApiError extends Error {
  readonly kind = 'api'
  readonly code: number
  readonly httpStatus: number
  readonly msg: string
  constructor(
    message: string,
    opts: { code: number; httpStatus: number; msg?: string }
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = opts.code
    this.httpStatus = opts.httpStatus
    this.msg = opts.msg ?? message
  }
}

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

// 网络错误重试退避（1 秒）
const RETRY_BACKOFF_MS = 1000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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
 *
 * 错误归一：网络层 → NetworkError（自动重试 1 次、退避 1s）；HTTP 401 / 业务码非 200 → ApiError（不重试）。
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
  // 拼 query 参数（GET 常用，如 /ad/list?position=banner）
  let queryString = ''
  if (params) {
    const sp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => sp.append(k, String(v)))
    queryString = '?' + sp.toString()
  }
  const url = API_BASE_URL + uri + queryString
  const startedAt = Date.now()
  // 请求发出日志（仅 dev；prod 不打，避免 SW 刷屏）
  if (isDev) console.log(`[api] → ${method} ${uri}`, body ? { body } : '')

  // 单次尝试：发 fetch + 解析 + 状态/业务码检查，失败归一为 NetworkError / ApiError 抛出
  const attempt = async (): Promise<T> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
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
        const elapsed = Date.now() - startedAt
        console.warn(`[api] ← ${method} ${uri} 401 (${elapsed}ms) 登录过期`)
        authExpiredHandler?.()
        throw new ApiError('登录已过期，请重新登录', {
          code: 401,
          httpStatus: 401,
          msg: '登录已过期，请重新登录'
        })
      }

      const result: T = await response.json()

      // 业务层 401（部分接口可能用 code=401 而非 HTTP 401）
      if (result.code === 401) {
        const elapsed = Date.now() - startedAt
        console.warn(`[api] ← ${method} ${uri} code=401 (${elapsed}ms) 登录过期`)
        authExpiredHandler?.()
        throw new ApiError('登录已过期，请重新登录', {
          code: 401,
          httpStatus: response.status,
          msg: '登录已过期，请重新登录'
        })
      }

      if (result.code === 200) {
        const elapsed = Date.now() - startedAt
        if (isDev) console.log(`[api] ← ${method} ${uri} 200 (${elapsed}ms)`)
        return result
      }

      // 业务码非 200：归一为 ApiError（不重试）
      const elapsed = Date.now() - startedAt
      if (isDev) console.log(`[api] ← ${method} ${uri} code=${result.code} (${elapsed}ms) ${result.msg}`)
      throw new ApiError(result.msg || '请求失败', {
        code: result.code,
        httpStatus: response.status,
        msg: result.msg
      })
    } catch (error) {
      // 已归一的业务错误直接抛（不在 attempt 内重复打日志，统一由外层 catch 处理）
      if (error instanceof ApiError) throw error
      // 网络层：AbortError（超时）/ TypeError（Failed to fetch）/ 其他传输异常 → NetworkError
      const elapsed = Date.now() - startedAt
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('请求超时，请稍后再试', url, elapsed)
      }
      if (error instanceof Error && error.name === 'TypeError') {
        throw new NetworkError('网络请求失败，请检查网络连接', url, elapsed)
      }
      // 其他传输层异常（如 response.json 解析失败）也归一为 NetworkError（可重试）
      const msg = error instanceof Error ? error.message : '网络请求失败'
      throw new NetworkError(msg, url, elapsed)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // fetchWithRetry：只对 NetworkError 重试 1 次、退避 1s；ApiError 不重试。对调用方无感。
  const fetchWithRetry = async (): Promise<T> => {
    try {
      return await attempt()
    } catch (error) {
      if (error instanceof NetworkError) {
        console.warn(
          `[api] ← ${method} ${uri} 网络失败 (${error.elapsed}ms, ${error.kind})，${RETRY_BACKOFF_MS}ms 后重试`,
          error.message
        )
        await sleep(RETRY_BACKOFF_MS)
        return await attempt()
      }
      throw error
    }
  }

  try {
    return await fetchWithRetry()
  } catch (error) {
    const elapsed = Date.now() - startedAt
    if (error instanceof NetworkError) {
      // 网络错误：silent 降级为 warn（含 url/耗时/kind），否则 error
      if (silent) {
        console.warn(
          `[api] ← ${method} ${uri} 失败 (${elapsed}ms, ${error.kind}, 静默)`,
          error.message
        )
      } else {
        console.error(`[api] ← ${method} ${uri} 失败 (${elapsed}ms, ${error.kind})`, error)
      }
      throw error
    }
    if (error instanceof ApiError) {
      // ApiError 日志已在 attempt 内打过（[api] ← code=...）；silent 时补一行 warn 便于排查
      if (silent) {
        console.warn(
          `[api] ← ${method} ${uri} 业务失败 code=${error.code} (${elapsed}ms, 静默)`,
          error.message
        )
      }
      throw error
    }
    // 兜底（理论不可达）：归一为 NetworkError
    throw new NetworkError(
      error instanceof Error ? error.message : '网络请求失败',
      url,
      elapsed
    )
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
