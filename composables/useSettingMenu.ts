/**
 * 设置菜单（"更多"组）管理
 *
 * 两套使用场景（2026-07-20 架构纠正）：
 *
 * 1. sidepanel 设置菜单（settingType=1）—— SW 缓存模式（保留不动）
 *    - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 *      POST /setting/menu-list 由 SW 发（body 含 customerType/settingType），写 storage，sendMessage 通知
 *    - 菜单渲染：sidepanel HeaderMenu 只读缓存，禁止任何 fetch 设置菜单请求
 *    - 通过 useSettingMenu() 访问；前置 4 项固定菜单（文档/FAQ/意见&需求反馈/联系我们）+ 后端追加
 *    - 单例 composable：监听器在初始化时注册一次（不在 onMounted/onUnmounted，避免永久丢失），
 *      详见 [[singleton-composable-listener-lifecycle]]
 *
 * 2. options.html 设置 tab 菜单（settingType=2）—— 直接请求模式（不走 SW 缓存）
 *    - 原因：options 是用户主动操作页（/my/道具/签到/兑换都是直接发后端），菜单查询也应直接发；
 *      走 SW 缓存是过度设计，引入延迟和不一致
 *    - 调用方（SettingMenuOptionsList.vue）在 onMounted 调 fetchOptionsMenus()
 *      POST /setting/menu-list body 含 customerType/settingType=2
 *    - 通过 useSettingMenuOptions() 访问；无固定菜单，仅渲染后端下发的动态菜单
 *    - 不注册 onMessage 监听器（不依赖 SW 广播）
 *
 * 渲染策略（sidepanel）：
 * - 固定 4 项始终渲染在前，后端下发的自定义菜单追加其后（不替换、不减少）
 * - 缓存未拉到（空数组）时，menus 自然只剩固定 4 项——符合"固定菜单始终在"
 * - 固定项 id 用负数（-1~-4），后端下发 id 为正数，v-for :key 不冲突
 * - options 无固定菜单，空数组时调用方应 v-if 隐藏整个区块
 *
 * logo 渲染：
 * - settingLogo 是后端配置的图片 URL，渲染前用 isRenderableImgSrc 校验（过滤占位/测试域名）
 * - 校验通过用 <img> 加载，加载失败/无 logo → 显示默认图标（LinkIcon）
 * - 跳转前用 isSafeExternalLink 校验 settingUrl，非 http(s) 不跳（防 javascript: 等危险协议）
 */

import { ref, computed } from 'vue'
import type { SettingMenuResponse, SettingMenuCacheData, SettingMenuItem } from '~types/setting'
import { API_URIS, MENU_SITE_URL } from '~lib/api-config'
import { isRenderableImgSrc, isSafeExternalLink } from '~lib/external-resource'
import { post } from '~lib/api'
import { useAuth } from '~composables/useAuth'
import { BUSINESS_CONFIG } from '~config/app-config'

const SETTING_MENU_CACHE_KEY = 'tabMasterSettingMenuCache'
const SETTING_MENU_UPDATED_MSG = 'settingMenuCacheUpdated'


// 固定菜单项，始终渲染在前，后端 /setting/menu-list 下发的自定义菜单追加其后（不替换、不减少）
// URL 用 MENU_SITE_URL（lib/api-config.ts，默认生产官网 ouu365.com）。
// - local：localhost:5173（本地联调官网 dev server）
// - prod ：www.ouu365.com
// 如需菜单固定指向生产官网而 API/其它地址走 local，设 PLASMO_PUBLIC_MENU_SITE=https://www.ouu365.com
// defaultIcon：settingLogo 为空时前端用内置 lucide 图标（后端 setting_logo 未配时用）
// id 用负数（-1~-4），与后端下发的正数 id 不冲突，v-for :key 天然唯一
const FIXED_MENUS: SettingMenuItem[] = [
  { id: -1, settingLogo: '', settingName: '', settingNameKey: 'menu.doc', settingUrl: `${MENU_SITE_URL}/contents/docs?app-code=app_1001`, settingSort: 1, defaultIcon: 'book' },
  { id: -2, settingLogo: '', settingName: '', settingNameKey: 'menu.faq', settingUrl: `${MENU_SITE_URL}/contents/faq?app-code=app_1001`, settingSort: 2, defaultIcon: 'help-circle' },
  { id: -3, settingLogo: '', settingName: '', settingNameKey: 'menu.feedback', settingUrl: `${MENU_SITE_URL}/contents/feedback?app-code=app_1001`, settingSort: 3, defaultIcon: 'message-square' },
  { id: -4, settingLogo: '', settingName: '', settingNameKey: 'menu.contact', settingUrl: `${MENU_SITE_URL}/contents/contact?app-code=app_1001`, settingSort: 4, defaultIcon: 'mail' }
]

// 清洗单条菜单项（SW 写入，UI 读时校验）
function sanitizeMenuItem(raw: unknown): SettingMenuItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const x = raw as Record<string, unknown>
  if (typeof x.id !== 'number' || typeof x.settingName !== 'string' || typeof x.settingUrl !== 'string') return null
  return {
    id: x.id,
    settingLogo: typeof x.settingLogo === 'string' ? x.settingLogo : '',
    settingName: x.settingName,
    settingUrl: x.settingUrl,
    settingSort: typeof x.settingSort === 'number' ? x.settingSort : 0
  }
}

// 清洗缓存数据（SW 写入，UI 读时校验）
function sanitizeCache(raw: unknown): SettingMenuCacheData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>
  // 缺少 lastSync 视为无效缓存
  if (typeof o.lastSync !== 'number') return null
  const menusRaw = Array.isArray(o.menus) ? o.menus : []
  const menus = menusRaw
    .map(sanitizeMenuItem)
    .filter((x): x is SettingMenuItem => x !== null)
    .sort((a, b) => a.settingSort - b.settingSort)
  return {
    menus,
    nextSyncIntervalMinutes: typeof o.nextSyncIntervalMinutes === 'number' ? o.nextSyncIntervalMinutes : null,
    lastSync: o.lastSync
  }
}

/**
 * 判断 settingLogo 是否可渲染为 <img>（过滤占位/测试域名）
 */
function canRenderLogo(url: string): boolean {
  return isRenderableImgSrc(url)
}

/**
 * 点击菜单项：校验 settingUrl 为合法 http(s) 外链后在新标签打开
 * 非 http(s)（如 javascript:/data:）一律拦截，防危险协议；
 * 不查测试域名黑名单（dev 环境官网在 localhost，菜单跳转需放行）
 */
function onMenuClick(item: SettingMenuItem) {
  if (!isSafeExternalLink(item.settingUrl)) {
    console.warn('[setting-menu] 菜单项 URL 校验失败，拒绝跳转', item.settingName, item.settingUrl)
    return
  }
  try {
    chrome.tabs.create({ url: item.settingUrl })
  } catch (e) {
    console.warn('[setting-menu] 打开菜单链接失败', e)
  }
}

// -------- sidepanel 用（settingType=1，SW 缓存模式 + 固定菜单 4 项） --------
/**
 * 设置菜单 composable（sidepanel 用）
 * - cacheKey：SW 写入的 storage key
 * - msgType：SW 广播的 message type（监听此 type 重读缓存）
 * - fixedMenus：前置固定菜单
 *
 * 单例 composable：监听器在初始化时注册一次（不在 onMounted/onUnmounted，避免永久丢失）
 */
function createSettingMenuImpl(opts: {
  cacheKey: string
  msgType: string
  fixedMenus: SettingMenuItem[]
}) {
  // SW 写入的缓存菜单（空数组表示尚未拉取）
  const cachedMenus = ref<SettingMenuItem[]>([])

  // 展示列表：固定项始终在前 + 后端下发缓存追加在后（不替换、不减少固定项）
  // 缓存未拉到（空数组）时，menus 自然只剩固定项——符合"固定菜单始终在"
  const menus = computed<SettingMenuItem[]>(() =>
    [...opts.fixedMenus, ...cachedMenus.value]
  )

  // 读取 SW 写入的设置菜单缓存
  async function loadSettingMenuCache() {
    try {
      const data = await chrome.storage.local.get(opts.cacheKey)
      const cache = sanitizeCache(data[opts.cacheKey])
      cachedMenus.value = cache ? cache.menus : []
    } catch (e) {
      console.warn(`[setting-menu] 加载设置菜单缓存失败 (key=${opts.cacheKey})`, e)
      cachedMenus.value = []
    }
  }

  // 监听 SW 缓存更新通知 -> 重读缓存
  // 单例 composable，监听器在初始化时注册一次（不在 onMounted/onUnmounted，避免永久丢失）
  chrome.runtime.onMessage.addListener((msg: unknown) => {
    if (msg && typeof msg === 'object' && !Array.isArray(msg)
      && (msg as Record<string, unknown>).type === opts.msgType) {
      loadSettingMenuCache()
    }
  })

  // 初始化：加载设置菜单缓存
  loadSettingMenuCache()

  return {
    menus,
    canRenderLogo,
    onMenuClick
  }
}

let _instance: ReturnType<typeof createSettingMenuImpl> | null = null
export function useSettingMenu() {
  if (!_instance) {
    _instance = createSettingMenuImpl({
      cacheKey: SETTING_MENU_CACHE_KEY,
      msgType: SETTING_MENU_UPDATED_MSG,
      fixedMenus: FIXED_MENUS
    })
  }
  return _instance
}

// -------- options.html 用（settingType=2，直接请求模式，无固定菜单） --------
/**
 * options.html 设置 tab 菜单 composable（settingType=2）
 *
 * 直接请求后端，不走 SW 缓存：options 是用户主动操作页（/my/道具/签到/兑换都直接发后端），
 * 菜单查询同样直接发；走 SW 缓存是过度设计，引入延迟和不一致。
 *
 * 调用方（SettingMenuOptionsList.vue）在 onMounted 调 fetchOptionsMenus()：
 *   POST /setting/menu-list body={ customerType, settingType:2 }
 * 静默失败：不重试、不抛错、menus 保持空（区块 v-if 隐藏）
 *
 * 单例（options 只有一个实例使用，模块级缓存复用即可）
 */
interface SettingMenuOptionsHandle {
  menus: ReturnType<typeof ref<SettingMenuItem[]>>
  loading: ReturnType<typeof ref<boolean>>
  canRenderLogo: typeof canRenderLogo
  onMenuClick: typeof onMenuClick
  fetchOptionsMenus: () => Promise<void>
}

let _optionsInstance: SettingMenuOptionsHandle | null = null
export function useSettingMenuOptions(): SettingMenuOptionsHandle {
  if (_optionsInstance) return _optionsInstance

  const menus = ref<SettingMenuItem[]>([])
  const loading = ref(false)

  async function fetchOptionsMenus(): Promise<void> {
    if (loading.value) return
    loading.value = true
    try {
      // customerType 从 useAuth 登录态推导（与 background.ts getAuthHeaders 一致：登录=1，未登录=0）
      // useAuth 是单例，options.vue setup 已初始化，这里共享同一实例
      const { isLoggedIn } = useAuth()
      const customerType = isLoggedIn.value ? 1 : 0
      const response = await post<SettingMenuResponse>(
        API_URIS.settingMenuList,
        { customerType, settingType: 2 },
        { silent: true, timeout: BUSINESS_CONFIG.noticeFetchTimeout }
      )
      if (response.code !== 200) {
        console.warn(`[setting-menu-options] 接口返回 code=${response.code}，跳过菜单更新`)
        return
      }
      const menusRaw = Array.isArray(response.data?.menus) ? response.data!.menus! : []
      menus.value = menusRaw
        .map(sanitizeMenuItem)
        .filter((x): x is SettingMenuItem => x !== null)
        .sort((a, b) => a.settingSort - b.settingSort)
    } catch (e) {
      // 静默失败：menus 保持空（区块 v-if 隐藏）
      console.warn('[setting-menu-options] 拉取设置菜单失败（静默，不影响使用）', e)
    } finally {
      loading.value = false
    }
  }

  _optionsInstance = {
    menus,
    loading,
    canRenderLogo,
    onMenuClick,
    fetchOptionsMenus
  }
  return _optionsInstance
}

// 向后兼容：类型导出
export type { SettingMenuItem } from '~types/setting'
