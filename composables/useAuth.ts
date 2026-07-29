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

import { toPure } from "~lib/toPure"
import { isDev } from "~lib/env"
import { ref, computed } from 'vue'
import { setTokenGetter, setLoggedInGetter, setAuthExpiredHandler, post, get } from '~lib/api'
import { API_URIS, AUTH_STORAGE_KEY } from '~lib/api-config'

// storage key（单一来源：api-config.ts 的 AUTH_STORAGE_KEY，api.ts 缓存层与本文件共用）
const AUTH_KEY = AUTH_STORAGE_KEY

// auth 数据类型
interface User {
  id: string
  email: string
  isVip: boolean
  vipExpiresAt: string | null
  // 以下字段由 /customer/my 返回（2026-07-17 个人中心/签到用）
  // 注：continuousDays 不再由 /my 返回（后端 2026-07-17 重构移除），签到即时反馈走 /customer/checkin 返回值
  points: number
  todayCheckedIn: boolean
  lastCheckInTime: string | null
  registerTime: string | null
  // 性别（2026-07-18 性别头像用）：0=男 1=女 2=未知；null=未获取/脏数据兜底（用默认头像）
  sex: 0 | 1 | 2 | null
  // 签到可获得积分数（/my 返回，用于显示「签到可获得X积分」提示）
  checkinAwardPoints: number
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
        vipExpiresAt: typeof u.vipExpiresAt === 'string' ? u.vipExpiresAt : null,
        // 新字段兜底（旧 storage 数据可能无这些字段，按默认值补齐）
        points: typeof u.points === 'number' ? u.points : 0,
        todayCheckedIn: typeof u.todayCheckedIn === 'boolean' ? u.todayCheckedIn : false,
        lastCheckInTime: typeof u.lastCheckInTime === 'string' ? u.lastCheckInTime : null,
        registerTime: typeof u.registerTime === 'string' ? u.registerTime : null,
        // sex 兜底：仅 0/1/2 合法，其余（含旧 storage 无此字段）一律 null
        sex: u.sex === 0 || u.sex === 1 || u.sex === 2 ? u.sex : null,
        // checkinAwardPoints 兜底：旧 storage 无此字段默认 10（与后端写死值一致）
        checkinAwardPoints: typeof u.checkinAwardPoints === 'number' ? u.checkinAwardPoints : 10
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
    if (isDev) console.log('[auth] 退出登录')
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

  // 从后端获取用户信息
  async function fetchUser() {
    try {
      const res = await get<{
        code: number
        msg: string
        data: {
          id: number
          userName: string
          nickName: string
          email: string
          phonenumber: string
          sex: number
          avatar: string
          status: string
          loginDate: string
          customerType: string
          isVip: number
          // 2026-07-17 个人中心扩展字段（CustomerMyVO）
          // 注：continuousDays 已由后端重构移除，签到即时反馈走 /customer/checkin 返回值
          points?: number | null
          todayCheckedIn?: boolean
          lastCheckInTime?: string | null
          registerTime?: string | null
          // 签到可得积分数（后端 2026-07-20 加，写死 10；兜底默认 10）
          checkinAwardPoints?: number
        }
      }>(API_URIS.customerMy, { silent: true })

      if (res.code === 200 && res.data) {
        const vo = res.data
        const newUser: User = {
          id: String(vo.id),
          email: vo.email,
          isVip: vo.isVip === 1,
          vipExpiresAt: null,
          // 新字段：后端 null/缺省时按默认值兜底（points null→0）
          points: typeof vo.points === 'number' ? vo.points : 0,
          todayCheckedIn: vo.todayCheckedIn === true,
          lastCheckInTime: typeof vo.lastCheckInTime === 'string' ? vo.lastCheckInTime : null,
          registerTime: typeof vo.registerTime === 'string' ? vo.registerTime : null,
          // 后端 OuuCustomer.sex 是 Integer（0/1/2）；非 0/1/2 兜底 null（用默认头像）
          sex: vo.sex === 0 || vo.sex === 1 || vo.sex === 2 ? vo.sex : null,
          // 签到可得积分：后端返回非数字时兜底 10（与后端写死值一致）
          checkinAwardPoints: typeof vo.checkinAwardPoints === 'number' ? vo.checkinAwardPoints : 10
        }
        auth.value.user = newUser
        await chrome.storage.local.set({
          [AUTH_KEY]: toPure(auth.value)
        })
        return newUser
      }
    } catch (e) {
      console.warn('[useAuth] fetchUser 失败', e)
      // 静默失败，不抛错（调用方决定是否提示用户）
    }
    return null
  }

  // 监听 storage 变化：options 页登录/登出/签到更新 storage 后，sidepanel 自动同步内存态
  // 单例 composable：监听器初始化时注册一次，**不放 onMounted/onUnmounted**（否则永久丢失，
  // 见 [[singleton-composable-listener-lifecycle]]）。loadAuth 只读 storage 不写，不会触发新的
  // onChanged → 无循环。自己 saveAuth 写 storage 也会触发回调，但读到一样的值（幂等）。
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return
    if (changes[AUTH_KEY]) {
      loadAuth()
    }
  })

  // 立即加载
  loadAuth()

  return {
    isLoggedIn,
    user,
    sessionExpired,
    login,
    logout,
    getToken,
    clearSessionExpired,
    fetchUser
  }
}

// 导出单例
export function useAuth() {
  if (!_instance) {
    _instance = useAuthImpl()
  }
  return _instance
}
