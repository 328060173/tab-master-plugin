/**
 * HTTP 请求工具
 * 封装 fetch，统一处理超时、错误等
 * 本层返回完整响应体，调用方按接口实际结构取字段
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    // 注入应用请求头
    Object.entries(APP_HEADERS).forEach(([key, value]) => {
      headers[key] = String(value)
    })

    // 额外请求头覆盖（放在后面，允许覆盖默认 appCode 等）
    if (extraHeaders) {
      Object.entries(extraHeaders).forEach(([key, value]) => {
        headers[key] = String(value)
      })
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    })

    const result: T = await response.json()

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
