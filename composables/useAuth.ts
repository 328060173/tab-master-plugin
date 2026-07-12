/**
 * 登录状态管理 - 单例模式
 *
 * 结构：
 * - token: string | null
 * - user: { id, email, isVip, vipExpiresAt } | null
 * - expiresAt: string | null (ISO 8601)
 *
 * 持久化：chrome.storage.local.tabMasterAuth
 *
 * 关键：storage 写 reactive 数据必须 toPure()
 */

import { ref, computed } from 'vue'
import { setTokenGetter, setLoggedInGetter, setAuthExpiredHandler, post } from '~lib/api'
import { API_URIS } from '~lib/api-config'

// storage key
const AUTH_KEY = 'tabMasterAuth'

// auth 数据类型
interface User {
  id: string
  email: string
  isVip: boolean
  vipExpiresAt: string | null
}

interface TabMasterAuth {
  token: string | null
  user: User | null
  expiresAt: string | null
}

// 默认 auth 状态
const DEFAULT_AUTH: TabMasterAuth = {
  token: null,
  user: null,
  expiresAt: null
}

// 防 proxy 污染的 toPure 工具（与 useTabManager 保持一致）
const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))

// 清洗 auth 数据，防止脏数据导致崩溃
function sanitizeAuth(raw: unknown): TabMasterAuth {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_AUTH }
  }
  const obj = raw as Record<string, unknown>
  // 验证 token
  const token = typeof obj.token === 'string' ? obj.token : null
  // 验证 user
  let user: User | null = null
  if (obj.user && typeof obj.user === 'object' && !Array.isArray(obj.user)) {
    const u = obj.user as Record<string, unknown>
    if (typeof u.id === 'string' && typeof u.email === 'string') {
      user = {
        id: u.id,
        email: u.email,
        isVip: typeof u.isVip === 'boolean' ? u.isVip : false,
        vipExpiresAt: typeof u.vipExpiresAt === 'string' ? u.vipExpiresAt : null
      }
    }
  }
  // 验证 expiresAt
  const expiresAt = typeof obj.expiresAt === 'string' ? obj.expiresAt : null

  return { token, user, expiresAt }
}

// 单例缓存
let _instance: ReturnType<typeof useAuthImpl> | null = null

function useAuthImpl() {
  // 响应式状态
  const auth = ref<TabMasterAuth>({ ...DEFAULT_AUTH })

  // 会话过期标志：401（token 过期/调需登录接口未登录）时置 true
  // 与主动 logout 区分：sidepanel watch 此标志 toast「登录已过期」，主动 logout 不触发
  const sessionExpired = ref(false)

  // computed 暴露
  const isLoggedIn = computed(() => !!auth.value.token && !!auth.value.user)
  const user = computed(() => auth.value.user)

  // 注册到 api.ts 统一拦截器：每次请求自动注入 Authorization: Bearer <token>
  setTokenGetter(() => auth.value.token)
  // 注册登录状态获取器：所有请求带 customerType 头（1=已登录/0=未登录），免登录接口靠此区分
  setLoggedInGetter(() => isLoggedIn.value)
  // 注册 401 处理：鉴权过期时清登录态 + 标记 sessionExpired
  setAuthExpiredHandler(() => {
    auth.value = { ...DEFAULT_AUTH }
    sessionExpired.value = true
    chrome.storage.local.remove(AUTH_KEY).catch(() => {})
  })

  // 加载 auth 状态
  async function loadAuth() {
    try {
      const data = await chrome.storage.local.get(AUTH_KEY)
      auth.value = sanitizeAuth(data[AUTH_KEY])
    } catch (e) {
      console.error('[useAuth] 加载 auth 失败', e)
      auth.value = { ...DEFAULT_AUTH }
    }
  }

  // 登录 - 保存 token 和 user
  async function login(token: string, user: User) {
    auth.value = {
      token,
      user,
      expiresAt: null // 样板阶段暂不处理过期时间
    }
    sessionExpired.value = false
    await chrome.storage.local.set({
      [AUTH_KEY]: toPure(auth.value)
    })
  }

  // 退出登录（主动，非过期）
  // 先调后端 /logout 让 token 失效，无论成败都清前端（保证用户能退出）
  async function logout() {
    console.log('[auth] 退出登录')
    try {
      await post(API_URIS.logout, undefined, { timeout: 5000, silent: true })
    } catch (e) {
      // 后端退出失败也清前端（token 前端删了，后端缓存自然过期）
      console.warn('[auth] 后端退出失败，仍清前端', e)
    }
    auth.value = { ...DEFAULT_AUTH }
    sessionExpired.value = false
    await chrome.storage.local.remove(AUTH_KEY)
  }

  // 获取 token
  function getToken() {
    return auth.value.token
  }

  // 清除会话过期标志（sidepanel toast 后调用）
  function clearSessionExpired() {
    sessionExpired.value = false
  }

  // 立即加载
  loadAuth()

  return {
    isLoggedIn,
    user,
    sessionExpired,
    login,
    logout,
    getToken,
    clearSessionExpired
  }
}

// 导出单例
export function useAuth() {
  if (!_instance) {
    _instance = useAuthImpl()
  }
  return _instance
}
