/**
 * 版本检查管理 - 单例模式（只读缓存）
 *
 * 架构（2026-07-16 重设计，与广告同模式）：
 * - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 *   POST /version/check-version（body 含 customerType/deviceInfo/versionCode）由 SW 发
 * - 缓存写入：SW 写 chrome.storage.local.tabMasterVersionCache，sendMessage({type:'versionCacheUpdated'}) 通知
 * - 版本横幅渲染：sidepanel 只读缓存，禁止任何 fetch 版本请求
 *
 * sidepanel 仍写 tabMasterVersionCheck（dismissedVersionCode 用户关闭记录）
 *
 * 静默失败策略沿用：无缓存则不显示横幅（不阻塞用户）
 */

import { ref, computed } from 'vue'
import type { UpdateInfo, VersionCacheData, VersionData } from '~types/version'

// Storage key —— 用户关闭记录（sidepanel 读写）
const VERSION_CHECK_KEY = 'tabMasterVersionCheck'
// 版本缓存 key（SW 写入，sidepanel 只读）
const VERSION_CACHE_KEY = 'tabMasterVersionCache'

// 版本检查存储状态类型
interface VersionCheckState {
  lastCheckAt: number | null        // 上次检查时间戳（SW 写缓存时已记录 lastSync，此字段保留兼容旧数据）
  lastForceFlag: 0 | 1 | null       // 上次检查的强制更新标志（保留兼容旧数据）
  dismissedVersionCode: number | null  // 用户已关闭的非强制更新版本号
}

// 默认状态
const DEFAULT_STATE: VersionCheckState = {
  lastCheckAt: null,
  lastForceFlag: null,
  dismissedVersionCode: null
}

// 防 proxy 污染的 toPure 工具
const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))

// 清洗存储数据
function sanitizeState(raw: unknown): VersionCheckState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_STATE }
  }
  const obj = raw as Record<string, unknown>
  return {
    lastCheckAt: typeof obj.lastCheckAt === 'number' ? obj.lastCheckAt : null,
    lastForceFlag: (obj.lastForceFlag === 1 || obj.lastForceFlag === 0) ? obj.lastForceFlag : null,
    dismissedVersionCode: typeof obj.dismissedVersionCode === 'number' ? obj.dismissedVersionCode : null
  }
}

// 清洗 VersionData（后端返回字段）
function sanitizeVersionData(raw: unknown): VersionData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  if (typeof o.versionCode !== 'number' || typeof o.versionName !== 'string') return null
  return {
    appCode: typeof o.appCode === 'string' ? o.appCode : '',
    platform: typeof o.platform === 'number' ? o.platform : 0,
    versionCode: o.versionCode,
    versionName: o.versionName,
    forceFlag: o.forceFlag === 1 ? 1 : 0,
    changeLog: typeof o.changeLog === 'string' ? o.changeLog : ''
  }
}

// 清洗版本缓存数据（SW 写入，sidepanel 读时校验）
function sanitizeVersionCache(raw: unknown): VersionCacheData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  // 缺少 lastSync 视为无效缓存（可能是清空后的空对象）
  if (typeof o.lastSync !== 'number') return null
  const updateFlag: 1 | 2 = o.updateFlag === 1 ? 1 : 2
  return {
    updateFlag,
    versionData: sanitizeVersionData(o.versionData),
    nextSyncIntervalMinutes: typeof o.nextSyncIntervalMinutes === 'number' ? o.nextSyncIntervalMinutes : null,
    lastSync: o.lastSync
  }
}

// 从缓存数据派生 UI 投影
function deriveUpdateInfo(cache: VersionCacheData | null): UpdateInfo | null {
  if (!cache) return null
  if (cache.updateFlag !== 1 || !cache.versionData) return null
  const v = cache.versionData
  return {
    hasUpdate: true,
    forceFlag: v.forceFlag,
    versionName: v.versionName,
    versionCode: v.versionCode,
    changeLog: v.changeLog
  }
}

// 单例缓存
let _instance: ReturnType<typeof useVersionCheckImpl> | null = null

function useVersionCheckImpl() {
  // 响应式状态
  const state = ref<VersionCheckState>({ ...DEFAULT_STATE })
  const updateInfo = ref<UpdateInfo | null>(null)

  // 计算属性：是否显示更新横幅
  const shouldShowBanner = computed(() => {
    if (!updateInfo.value) return false
    const info = updateInfo.value
    // 强制更新：始终显示
    if (info.forceFlag === 1) return true
    // 非强制更新：检查用户是否已关闭此版本
    return info.versionCode !== state.value.dismissedVersionCode
  })

  // 加载存储状态
  async function loadState() {
    try {
      const data = await chrome.storage.local.get(VERSION_CHECK_KEY)
      state.value = sanitizeState(data[VERSION_CHECK_KEY])
    } catch (e) {
      console.warn('[useVersionCheck] 加载状态失败', e)
      state.value = { ...DEFAULT_STATE }
    }
  }

  // 保存状态
  async function saveState() {
    try {
      await chrome.storage.local.set({
        [VERSION_CHECK_KEY]: toPure(state.value)
      })
    } catch (e) {
      console.warn('[useVersionCheck] 保存状态失败', e)
    }
  }

  // 读取 SW 写入的版本缓存并派生 updateInfo
  async function loadVersionCache() {
    try {
      const data = await chrome.storage.local.get(VERSION_CACHE_KEY)
      const cache = sanitizeVersionCache(data[VERSION_CACHE_KEY])
      updateInfo.value = deriveUpdateInfo(cache)
    } catch (e) {
      console.warn('[useVersionCheck] 加载版本缓存失败', e)
      updateInfo.value = null
    }
  }

  /**
   * 关闭非强制更新横幅
   */
  async function dismiss() {
    if (!updateInfo.value || updateInfo.value.forceFlag === 1) return
    state.value.dismissedVersionCode = updateInfo.value.versionCode
    await saveState()
  }

  /**
   * 打开更新页面（Chrome 扩展管理页或商店页）
   */
  function openUpdatePage() {
    // 优先打开 Chrome 扩展管理页
    chrome.tabs.create({ url: 'chrome://extensions' })
  }

  // 监听 SW 版本缓存更新通知 -> 重读缓存
  // 单例 composable，监听器在初始化时注册一次（不在 onMounted/onUnmounted，避免永久丢失）
  chrome.runtime.onMessage.addListener((msg: unknown) => {
    if (msg && typeof msg === 'object' && !Array.isArray(msg)
      && (msg as Record<string, unknown>).type === 'versionCacheUpdated') {
      loadVersionCache()
    }
  })

  // 初始化：加载状态 + 版本缓存
  Promise.all([loadState(), loadVersionCache()])

  return {
    updateInfo,
    shouldShowBanner,
    dismiss,
    openUpdatePage
  }
}

// 导出单例
export function useVersionCheck() {
  if (!_instance) {
    _instance = useVersionCheckImpl()
  }
  return _instance
}

// 向后兼容：UpdateInfo 类型导出（UpdateBanner.vue 引用）
export type { UpdateInfo } from '~types/version'
