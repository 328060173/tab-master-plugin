/**
 * 设置菜单（“更多”组）管理 - 单例模式（只读缓存）
 *
 * 架构（2026-07-16，与广告/通知同模式）：
 * - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 *   GET /setting/menu-list 由 SW 发，写 tabMasterSettingMenuCache，sendMessage({type:'settingMenuCacheUpdated'}) 通知
 * - 菜单渲染：HeaderMenu 只读缓存，禁止任何 fetch 设置菜单请求
 *
 * 渲染策略（2026-07-17 调整：固定项 + 后端追加，不再替换）：
 * - 固定 4 项（文档/FAQ/意见&需求反馈/联系我们）始终渲染在前
 * - 后端 /setting/menu-list 下发的自定义菜单追加在固定项后面，不替换、不减少固定项
 * - 缓存未拉到（空数组）时，menus 自然只剩固定 4 项——符合"固定菜单始终在"
 * - 固定项 id 用负数（-1~-4），后端下发 id 为正数，v-for :key 不冲突
 *
 * logo 渲染：
 * - settingLogo 是后端配置的图片 URL，渲染前用 isRenderableImgSrc 校验（过滤占位/测试域名）
 * - 校验通过用 <img> 加载，加载失败/无 logo → 显示默认图标（LinkIcon）
 * - 跳转前用 isSafeExternalLink 校验 settingUrl，非 http(s) 不跳（防 javascript: 等危险协议；不查黑名单，dev 环境 localhost 官网可跳）
 */

import { ref, computed } from 'vue'
import type { SettingMenuCacheData, SettingMenuItem } from '~types/setting'
import { MENU_SITE_URL } from '~lib/api-config'
import { isRenderableImgSrc, isSafeExternalLink } from '~lib/external-resource'

const SETTING_MENU_CACHE_KEY = 'tabMasterSettingMenuCache'

const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))

// 固定菜单项，始终渲染在前，后端 /setting/menu-list 下发的自定义菜单追加其后（不替换、不减少）
// URL 用 MENU_SITE_URL（lib/api-config.ts，默认生产官网 ouu365.com）。
// - local：localhost:5173（本地联调官网 dev server）
// - prod ：www.ouu365.com
// 如需菜单固定指向生产官网而 API/其它地址走 local，设 PLASMO_PUBLIC_MENU_SITE=https://www.ouu365.com
// defaultIcon：settingLogo 为空时前端用内置 lucide 图标（后端 setting_logo 未配时用）
// id 用负数（-1~-4），与后端下发的正数 id 不冲突，v-for :key 天然唯一
const FIXED_MENUS: SettingMenuItem[] = [
  { id: -1, settingLogo: '', settingName: '文档', settingUrl: `${MENU_SITE_URL}/contents/docs?app-code=app_1001`, settingSort: 1, defaultIcon: 'book' },
  { id: -2, settingLogo: '', settingName: 'FAQ', settingUrl: `${MENU_SITE_URL}/contents/faq?app-code=app_1001`, settingSort: 2, defaultIcon: 'help-circle' },
  { id: -3, settingLogo: '', settingName: '意见和需求反馈', settingUrl: `${MENU_SITE_URL}/contents/feedback?app-code=app_1001`, settingSort: 3, defaultIcon: 'message-square' },
  { id: -4, settingLogo: '', settingName: '联系我们', settingUrl: `${MENU_SITE_URL}/contents/contact?app-code=app_1001`, settingSort: 4, defaultIcon: 'mail' }
]

// 清洗单条菜单项（SW 写入，sidepanel 读时校验）
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

// 清洗缓存数据（SW 写入，sidepanel 读时校验）
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

let _instance: ReturnType<typeof useSettingMenuImpl> | null = null

function useSettingMenuImpl() {
  // SW 写入的缓存菜单（空数组表示尚未拉取）
  const cachedMenus = ref<SettingMenuItem[]>([])

  // 展示列表：固定 4 项始终在前 + 后端下发缓存追加在后（不替换、不减少固定项）
  // 缓存未拉到（空数组）时，menus 自然只剩固定 4 项——符合"固定菜单始终在"
  const menus = computed<SettingMenuItem[]>(() =>
    [...FIXED_MENUS, ...cachedMenus.value]
  )

  // 读取 SW 写入的设置菜单缓存
  async function loadSettingMenuCache() {
    try {
      const data = await chrome.storage.local.get(SETTING_MENU_CACHE_KEY)
      const cache = sanitizeCache(data[SETTING_MENU_CACHE_KEY])
      cachedMenus.value = cache ? cache.menus : []
    } catch (e) {
      console.warn('[setting-menu] 加载设置菜单缓存失败', e)
      cachedMenus.value = []
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

  // 监听 SW 缓存更新通知 -> 重读缓存
  // 单例 composable，监听器在初始化时注册一次（不在 onMounted/onUnmounted，避免永久丢失）
  chrome.runtime.onMessage.addListener((msg: unknown) => {
    if (msg && typeof msg === 'object' && !Array.isArray(msg)
      && (msg as Record<string, unknown>).type === 'settingMenuCacheUpdated') {
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

export function useSettingMenu() {
  if (!_instance) {
    _instance = useSettingMenuImpl()
  }
  return _instance
}

// 向后兼容：类型导出
export type { SettingMenuItem } from '~types/setting'
