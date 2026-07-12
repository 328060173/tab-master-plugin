/**
 * 版本检查管理 - 单例模式
 *
 * 功能：
 * - 自动检查版本更新（每天一次）
 * - 静默失败（不影响用户体验）
 * - 支持强制更新和非强制更新
 * - 存储检查状态和用户关闭记录
 */

import { ref, computed } from 'vue'
import { get } from '~lib/api'
import { API_URIS } from '~lib/api-config'

// Storage key
const VERSION_CHECK_KEY = 'tabMasterVersionCheck'

// 版本检查存储状态类型
interface VersionCheckState {
  lastCheckAt: number | null        // 上次检查时间戳
  lastForceFlag: 0 | 1 | null       // 上次检查的强制更新标志
  dismissedVersionCode: number | null  // 用户已关闭的非强制更新版本号
}

// 版本数据类型（来自后端）
interface VersionData {
  appCode: string
  platform: number
  versionCode: number
  versionName: string
  forceFlag: 0 | 1
  changeLog: string
}

// 版本检查响应类型
interface CheckVersionResponse {
  code: number
  msg: string
  data: {
    updateFlag: 1 | 2  // 1=有更新, 2=无更新
    versionData: VersionData | null
  }
}

// 更新信息类型（暴露给 UI）
export interface UpdateInfo {
  hasUpdate: boolean
  forceFlag: 0 | 1
  versionName: string
  versionCode: number
  changeLog: string
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

// 单例缓存
let _instance: ReturnType<typeof useVersionCheckImpl> | null = null

function useVersionCheckImpl() {
  // 响应式状态
  const state = ref<VersionCheckState>({ ...DEFAULT_STATE })
  const updateInfo = ref<UpdateInfo | null>(null)
  const isChecking = ref(false)

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

  // 判断是否需要检查（每天一次，按自然日）
  function shouldCheck(): boolean {
    const lastCheckAt = state.value.lastCheckAt
    if (!lastCheckAt) return true
    return new Date(lastCheckAt).toDateString() !== new Date().toDateString()
  }

  /**
   * 检查版本更新
   *
   * 静默失败策略：
   * - 所有错误都不抛给调用方
   * - 超时设为 3 秒
   * - 失败时如果有历史强制更新记录，仍显示强制更新横幅
   */
  async function checkVersion() {
    // 防抖：避免重复检查
    if (isChecking.value) return
    // 如果不需要检查且已有 updateInfo，直接返回
    if (!shouldCheck() && updateInfo.value) return

    isChecking.value = true
    console.log('[version] 开始检查版本更新')

    try {
      // 调用后端接口，超时 3 秒，静默失败（失败/超时只打 warn 不影响 UI）
      const response = await get<CheckVersionResponse>(API_URIS.checkVersion, {
        timeout: 3000,
        silent: true
      })

      if (response.code !== 200) {
        throw new Error(response.msg || '版本检查失败')
      }

      const { updateFlag, versionData } = response.data

      // 更新 lastCheckAt
      state.value.lastCheckAt = Date.now()

      if (updateFlag === 2 || !versionData) {
        // 无更新
        updateInfo.value = null
        state.value.lastForceFlag = null
        console.log('[version] 无更新')
      } else {
        // 有更新
        updateInfo.value = {
          hasUpdate: true,
          forceFlag: versionData.forceFlag,
          versionName: versionData.versionName,
          versionCode: versionData.versionCode,
          changeLog: versionData.changeLog
        }
        state.value.lastForceFlag = versionData.forceFlag
        console.log(`[version] 发现新版本 v${versionData.versionName}（forceFlag=${versionData.forceFlag}）`)
      }

      // 保存状态
      await saveState()
    } catch (e) {
      // 静默失败，只记录日志（不 toast、不影响 UI）
      console.warn('[version] 检查失败（静默，不影响使用）', e)
      // 失败时检查历史强制更新记录
      if (state.value.lastForceFlag === 1 && updateInfo.value?.forceFlag !== 1) {
        // 不更新 updateInfo，保持之前的强制更新状态（如果有）
      }
    } finally {
      isChecking.value = false
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

  // 初始化：加载状态
  loadState()

  return {
    updateInfo,
    isChecking,
    shouldShowBanner,
    checkVersion,
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
