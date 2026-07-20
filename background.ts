/**
 * Tab Master Pro - Service Worker
 *
 * 职责：
 * 1. 设置 side panel 行为
 * 2. 持续追踪 tab 父子关系（基于 chrome.tabs.onCreated.openerTabId），写入 treeParentMap
 *    —— sidepanel 可能未打开，必须在 SW 层兜底采集，否则会漏关系
 * 3. tab 关闭时级联重连父子关系（避免 sidepanel 未挂载时关系丢失）
 * 4. 采集 lastAccessed 兜底（Chrome 121 之前没有 tab.lastAccessed 原生字段）
 *    —— SW 监听 tabs.onActivated，记录每个 tab 的最近访问时间到 tabLastAccessedMap
 * 5. 广告/版本/通知/设置菜单拉取（2026-07-16 重设计）：SW 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 *    四套独立拉取 + 独立闹钟，onAlarm 按 alarm.name 分发，互不串扰
 *    - 广告：GET /ad/list 写 tabMasterAdCache
 *    - 版本：POST /version/check-version 写 tabMasterVersionCache
 *    - 通知：GET /notice/page-list 写 tabMasterNoticeCache
 *    - 设置菜单：GET /setting/menu-list 写 tabMasterSettingMenuCache
 *    各自 sendMessage 通知 sidepanel 只读缓存 —— sidepanel 禁止任何 fetch 上述请求
 *
 * 兼容：Chrome 88+ / Edge 88+（参见 [[constraint-target-platforms]]）
 */

import { get, post } from '~lib/api'
import { API_URIS, APP_VERSION_CODE, OFFICIAL_SITE_URL } from '~lib/api-config'
import { isDev } from '~lib/env'
import { BUSINESS_CONFIG } from '~config/app-config'
import { collectDeviceInfo, ACCESS_LOC, DEVICE_NUMBER } from '~lib/device-info'
import type { AdCacheData, AdSyncResponse } from '~types/ad'
import type { CheckVersionResponse, VersionCacheData } from '~types/version'
import type { NoticeCacheData, NoticeSyncResponse } from '~types/notice'
import type { SettingMenuResponse, SettingMenuCacheData } from '~types/setting'

const STORAGE_KEY = "treeParentMap"
const LAST_ACCESSED_KEY = "tabLastAccessedMap"
// 节流：onActivated 高频触发（用户快速 Cmd+Tab 切换），debounce 1s 才写盘，减少 IO
const SAVE_DEBOUNCE_MS = 1000

// 内存缓存，减少 storage.get 频次；SW 重启时由 onStartup/onInstalled 回填
let parentMap: Record<string, number> = {}

// lastAccessed 兜底缓存 —— Chrome 121+ 原生有 tab.lastAccessed，无需依赖此 map；
// 老版本 sidepanel 从 storage 读这个 map 注入 TabItem.lastAccessed
let lastAccessedMap: Record<string, number> = {}
let saveLastAccessedTimer: ReturnType<typeof setTimeout> | null = null

async function loadMap(): Promise<void> {
  try {
    const data = await chrome.storage.local.get([STORAGE_KEY, LAST_ACCESSED_KEY])
    parentMap = data[STORAGE_KEY] || {}
    lastAccessedMap = data[LAST_ACCESSED_KEY] || {}
  } catch {
    parentMap = {}
    lastAccessedMap = {}
  }
}

async function saveMap(): Promise<void> {
  try { await chrome.storage.local.set({ [STORAGE_KEY]: parentMap }) } catch {}
}

// 节流写入 lastAccessedMap：高频 onActivated 合并到一次 IO
function scheduleSaveLastAccessed(): void {
  if (saveLastAccessedTimer) return
  saveLastAccessedTimer = setTimeout(async () => {
    saveLastAccessedTimer = null
    try { await chrome.storage.local.set({ [LAST_ACCESSED_KEY]: lastAccessedMap }) } catch {}
  }, SAVE_DEBOUNCE_MS)
}

// 写入父子关系前做循环检测：防止 child 被设为 parent 的祖先
function wouldCreateCycle(childId: number, parentId: number): boolean {
  let cur: number | undefined = parentId
  const seen = new Set<number>()
  while (cur !== undefined) {
    if (cur === childId) return true
    if (seen.has(cur)) return true // 已有环（数据脏），直接拒绝
    seen.add(cur)
    cur = parentMap[String(cur)]
  }
  return false
}

// tab 新建：openerTabId 存在则记录父子关系（这是树关系的核心入口）
async function onTabCreated(tab: chrome.tabs.Tab): Promise<void> {
  if (!tab.id || !tab.openerTabId) return
  // 同窗口才记录，跨窗口的标签不挂亲子关系（避免视觉混乱）
  if (tab.openerTabId === tab.id) return
  if (wouldCreateCycle(tab.id, tab.openerTabId)) return
  parentMap[String(tab.id)] = tab.openerTabId
  await saveMap()
}

// tab 关闭：把所有 parent=removedId 的子节点 reparent 到祖父，自身从 map 移除
async function onTabRemoved(removedId: number): Promise<void> {
  const removedParent = parentMap[String(removedId)]
  const next: Record<string, number> = {}
  let mutated = false
  for (const [k, v] of Object.entries(parentMap)) {
    if (k === String(removedId)) { mutated = true; continue }
    if (v === removedId) {
      if (removedParent !== undefined) next[k] = removedParent
      // else: 没祖父，子节点变孤儿（顶层）
      mutated = true
    } else {
      next[k] = v
    }
  }
  if (mutated) {
    parentMap = next
    await saveMap()
  }
  // 同步清理 lastAccessedMap，避免无效 id 长期堆积
  if (lastAccessedMap[String(removedId)] !== undefined) {
    delete lastAccessedMap[String(removedId)]
    scheduleSaveLastAccessed()
  }
}

// 用户激活某个 tab：更新该 tab 的 lastAccessed 时间戳，让"检测长期未用"能识别它最近用过
function onTabActivated(info: chrome.tabs.TabActiveInfo): void {
  lastAccessedMap[String(info.tabId)] = Date.now()
  scheduleSaveLastAccessed()
}

// 入口绑定 ——
// 1. install / startup：加载 map 到内存
// 2. tabs 事件：持续维护
chrome.runtime.onInstalled.addListener(async () => {
  // chrome.sidePanel 需 Chrome/Edge 114+（侧边栏核心形态，不支持则插件不可用）
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  await loadMap()
  // 广告/版本/通知/设置菜单初始化拉取（fire-and-forget，各模块独立，互不阻塞）
  syncAll('init')
})

chrome.runtime.onStartup.addListener(async () => {
  await loadMap()
  // 浏览器重启：立即拉取广告/版本/通知/设置菜单（fire-and-forget）
  syncAll('init')
})

chrome.tabs.onCreated.addListener(onTabCreated)
chrome.tabs.onRemoved.addListener(onTabRemoved)
chrome.tabs.onActivated.addListener(onTabActivated)

// ============ 统一数据同步入口（多触发源一套业务逻辑） ============
type SyncTrigger = 'init' | 'timer' | 'manual'

/**
 * 统一数据同步入口（多触发源一套业务逻辑）。
 * 各模块独立 fire-and-forget，互不阻塞——不 Promise.all 等全部，一个慢/挂不卡其他。
 * 各 fetch 内部成功后各自广播 xxxCacheUpdated，sidepanel 各模块自监听刷新。
 * 触发源：init(安装/重启) / manual(手动按钮) / 未来可扩展 'open'(打开插件)。
 * 注意：timer(各闹钟定时)不走本函数——各模块定时间隔不同，保持各 alarm 独立调各 fetch；
 *       但调的是同一套 fetchXxxCache 函数，业务逻辑仍是一套。
 */
function syncAll(trigger: SyncTrigger): void {
  void fetchSettingMenuCache(trigger, 1)
  void fetchSettingMenuCache(trigger, 2)
  void fetchAdCache(trigger)
  void fetchVersionCache(trigger)
  void fetchNoticeCache(trigger)
}

// ============ 手动刷新（用户在 options 页点「刷新菜单内容」触发）============
// 设计：sidepanel 不发任何广告/版本/通知/设置菜单网络请求（红线），手动刷新也走 SW。
// ⚠️ manual 单独列项，不调 syncAll——刻意不刷广告：
//    广告有「展示即消费」逻辑（useAd consumeCurrentAd 展示后 adData 置 null，本窗口不再弹），
//    若 manual 触发 fetchAdCache 又拉到新广告会再弹一次，每次点刷新就弹广告，体验差。
//    所以 manual 只刷 菜单/通知/版本（这三类无「展示即消费」副作用），广告仍由 init/timer 正常拉。
// 各 fetch 写缓存后各自广播 xxxCacheUpdated，sidepanel 现有监听自动刷新。
// 同时广播 manualRefreshMy 触发 /my 重拉（/my 架构不同，在 sidepanel 按需拉，未登录则忽略）。
// 不等全部完成、不广播 done——按钮靠 options 页自身短延时恢复（异步不阻塞 UI）。
chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || typeof msg !== 'object' || Array.isArray(msg)) return
  if ((msg as Record<string, unknown>).type !== 'manualRefreshAll') return
  if (isDev) console.log('[sync] 收到手动刷新请求 (manualRefreshAll)，不含广告')
  // 手动刷新不触发广告（避免每次点击都弹广告，体验差）；菜单/通知/版本仍同步
  void fetchSettingMenuCache('manual', 1)
  void fetchSettingMenuCache('manual', 2)
  void fetchNoticeCache('manual')
  void fetchVersionCache('manual')
  // 仅手动触发时通知 sidepanel 重拉 /my（不碰 /my 架构，sidepanel 自行决定已登录才拉）
  chrome.runtime.sendMessage({ type: 'manualRefreshMy' }).catch(() => {})
})


// 用户在 StoragePanel 里清空数据 / 其他扩展页面写入时，同步 SW 内存，避免被旧数据覆盖
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return
  if (changes[STORAGE_KEY]) {
    parentMap = changes[STORAGE_KEY].newValue || {}
  }
  if (changes[LAST_ACCESSED_KEY]) {
    // 注意：这里要排除我们自己写入触发的回调（newValue === lastAccessedMap 内容相同）
    // 简化处理：只在外部清空时同步（newValue 是空对象/undefined）
    const v = changes[LAST_ACCESSED_KEY].newValue
    if (!v || Object.keys(v).length === 0) lastAccessedMap = {}
  }
})

// SW 在没有任何事件的初始化路径上也需要拿到 map（如热重载后第一个事件触发前）
loadMap()

// ============ 广告/版本/通知拉取（SW 定时 + 初始化，sidepanel 只读缓存）============
// 设计：sidepanel 不发任何广告/版本/通知网络请求；SW 靠 chrome.alarms 定时拉 + onInstalled/onStartup 初始化拉
// 三套独立拉取 + 独立闹钟，onAlarm 按 alarm.name 分发，互不串扰
// 详见 [[pattern-sw-as-collector]] + types/ad.ts / types/version.ts / types/notice.ts

const AD_CACHE_KEY = 'tabMasterAdCache'
const AD_ALARM_NAME = 'tabMasterAdSync'

const VERSION_CACHE_KEY = 'tabMasterVersionCache'
const VERSION_ALARM_NAME = 'tabMasterVersionSync'

const NOTICE_CACHE_KEY = 'tabMasterNoticeCache'
const NOTICE_ALARM_NAME = 'tabMasterNoticeSync'

const SETTING_MENU_CACHE_KEY = 'tabMasterSettingMenuCache'
const SETTING_MENU_OPTIONS_CACHE_KEY = 'tabMasterSettingMenuOptionsCache'
const SETTING_MENU_ALARM_NAME = 'tabMasterSettingSync'

// 登录态 storage key（与 useAuth.ts 的 AUTH_KEY 对齐，SW 无法 import useAuth 因其依赖 Vue）
const AUTH_KEY = 'tabMasterAuth'

// 闹钟间隔：后端下发 nextSyncIntervalMinutes（分钟）作为基础间隔 + 0~60 分钟随机偏移
const MAX_OFFSET_MINUTES = 60
// 后端未下发间隔（null）时的兜底间隔（分钟）—— 与后端各接口默认值一致
const DEFAULT_AD_INTERVAL_MINUTES = 480       // 广告 8h
const DEFAULT_VERSION_INTERVAL_MINUTES = 1440 // 版本 24h
const DEFAULT_NOTICE_INTERVAL_MINUTES = 240   // 通知 4h
const DEFAULT_SETTING_MENU_INTERVAL_MINUTES = 1440  // 设置菜单 24h

/**
 * 读取 storage 中的登录态，构建请求头
 * SW 无法使用 useAuth 注册的 tokenGetter（那是 sidepanel 上下文的模块状态），
 * 所以直接读 chrome.storage.local.tabMasterAuth 拿 token + 登录态
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const data = await chrome.storage.local.get(AUTH_KEY)
    const auth = data[AUTH_KEY]
    if (auth && typeof auth === 'object' && !Array.isArray(auth)
      && typeof auth.token === 'string' && auth.token
      && auth.user && typeof auth.user === 'object') {
      return {
        'Authorization': `Bearer ${auth.token}`,
        'customerType': '1'
      }
    }
  } catch {
    // 读取失败按匿名处理
  }
  return { 'customerType': '0' }
}

// -------- 通用闹钟工具（version/notice 复用，广告保留独立函数不动）--------

/**
 * 设置下一次同步闹钟（一次性闹钟，触发后在此重新设置）
 * 下次时间 = 当前 + 基础间隔(后端下发 nextSyncIntervalMinutes，缺失兜底 defaultInterval) + 随机偏移(0~60min)
 */
function scheduleAlarm(name: string, intervalMinutes: number | null, defaultInterval: number): void {
  const base = typeof intervalMinutes === 'number' && intervalMinutes > 0 ? intervalMinutes : defaultInterval
  const offsetMinutes = Math.random() * MAX_OFFSET_MINUTES
  const delayMinutes = base + offsetMinutes
  chrome.alarms.create(name, { delayInMinutes: delayMinutes })
  if (isDev) console.log(`[sync] 下次 ${name} 闹钟: ${delayMinutes.toFixed(1)} 分钟后 (${(delayMinutes / 60).toFixed(1)}h)，基础间隔 ${base}min`)
}

/**
 * 确保闹钟存在（SW 重启后闹钟可能丢失，参考 alarms.md 官方建议）
 * 不触发拉取，只保证下一次闹钟已设置
 * 间隔从缓存读后端下发的 nextSyncIntervalMinutes，读不到用 defaultInterval 兜底
 */
async function ensureAlarm(name: string, cacheKey: string, defaultInterval: number): Promise<void> {
  try {
    const alarm = await chrome.alarms.get(name)
    if (alarm) return
    let intervalMinutes: number | null = null
    try {
      const data = await chrome.storage.local.get(cacheKey)
      const cache = data[cacheKey]
      if (cache && typeof cache === 'object' && typeof cache.nextSyncIntervalMinutes === 'number') {
        intervalMinutes = cache.nextSyncIntervalMinutes
      }
    } catch {
      // 缓存读取失败用兜底
    }
    scheduleAlarm(name, intervalMinutes, defaultInterval)
  } catch {
    scheduleAlarm(name, null, defaultInterval)
  }
}

/**
 * 通用 gap 判断：距 lastSync 是否满 nextSyncIntervalMinutes，不足则跳过并用缓存间隔重设闹钟
 * 返回 true=应跳过本次拉取（已重设闹钟），false=应继续拉取（由 fetch 内部 finally 设闹钟）
 */
async function shouldSkipByGap(
  cacheKey: string,
  defaultInterval: number,
  name: string
): Promise<boolean> {
  try {
    const data = await chrome.storage.local.get(cacheKey)
    const cache = data[cacheKey]
    if (cache && typeof cache === 'object' && typeof cache.lastSync === 'number') {
      const intervalMin = typeof cache.nextSyncIntervalMinutes === 'number'
        ? cache.nextSyncIntervalMinutes
        : defaultInterval
      const elapsed = Date.now() - cache.lastSync
      if (elapsed < intervalMin * 60 * 1000) {
        if (isDev) console.log(`[sync] 距上次同步不足 ${intervalMin} 分钟 (${Math.round(elapsed / 60000)} 分钟)，跳过 ${name} 拉取`)
        scheduleAlarm(name, intervalMin, defaultInterval)
        return true
      }
    }
  } catch {
    // 读取失败继续拉取
  }
  return false
}

// -------- 广告拉取（保留独立函数，逻辑不变） --------

/**
 * 拉取广告并写入缓存
 * POST /ad/list，body 含 customerType/position/trigger（后端 @RequestBody）。
 * platform/appCode/versionCode 走通用请求头（buildHeaders 自动注入），不放 body。
 * 静默失败：不重试、不清旧缓存、等待下次触发
 * trigger: init=安装/重启触发，timer=闹钟定时触发，manual=用户手动触发「刷新菜单内容」（后端按此统计请求时机）
 */
async function fetchAdCache(trigger: 'init' | 'timer' | 'manual'): Promise<void> {
  let intervalMinutes: number | null = null
  try {
    const authHeaders = await getAuthHeaders()
    // customerType 从登录态推导为数值放 body（与 fetchVersionCache 一致）
    const customerType = authHeaders['customerType'] === '1' ? 1 : 0
    const response = await post<AdSyncResponse>(API_URIS.adList, {
      customerType,
      position: BUSINESS_CONFIG.adPosition,
      trigger
    }, {
      extraHeaders: authHeaders,
      timeout: BUSINESS_CONFIG.adFetchTimeout,
      silent: true
    })
    if (response.code !== 200) {
      console.warn(`[ad-sync] 广告接口返回 code=${response.code}，跳过缓存更新`)
      return
    }
    const d = response.data
    intervalMinutes = typeof d?.nextSyncIntervalMinutes === 'number' ? d.nextSyncIntervalMinutes : null
    const cache: AdCacheData = {
      hideAd: d?.hideAd === true,
      expireTime: typeof d?.expireTime === 'number' ? d.expireTime : null,
      adData: d?.adData ?? null,
      lastSync: Date.now(),
      serverTime: typeof d?.serverTime === 'number' ? d.serverTime : null,
      nextSyncIntervalMinutes: intervalMinutes
    }
    await chrome.storage.local.set({ [AD_CACHE_KEY]: cache })
    if (isDev) console.log(`[ad-sync] 广告缓存已更新 (trigger=${trigger}, hideAd=${cache.hideAd}, hasAdData=${!!cache.adData}, nextInterval=${intervalMinutes}min)`)
    // 通知侧边栏重读缓存（sidepanel 可能未打开，无接收方时 sendMessage 会 reject，静默忽略）
    chrome.runtime.sendMessage({ type: 'adCacheUpdated' }).catch(() => {})
  } catch (e) {
    // 静默失败：不重试、不清旧缓存、等待下次触发
    console.warn('[ad-sync] 拉取广告失败（静默，不影响使用）', e)
  } finally {
    // 无论成功失败都安排下一次闹钟：成功用后端下发的间隔，失败用兜底间隔
    scheduleNextAdAlarm(intervalMinutes)
  }
}

/**
 * 设置下一次广告同步闹钟（保留广告独立函数，逻辑不变）
 */
function scheduleNextAdAlarm(intervalMinutes: number | null): void {
  const base = typeof intervalMinutes === 'number' && intervalMinutes > 0 ? intervalMinutes : DEFAULT_AD_INTERVAL_MINUTES
  const offsetMinutes = Math.random() * MAX_OFFSET_MINUTES
  const delayMinutes = base + offsetMinutes
  chrome.alarms.create(AD_ALARM_NAME, { delayInMinutes: delayMinutes })
  if (isDev) console.log(`[ad-sync] 下次广告同步闹钟: ${delayMinutes.toFixed(1)} 分钟后 (${(delayMinutes / 60).toFixed(1)}h)，基础间隔 ${base}min`)
}

/**
 * 确保广告闹钟存在（保留广告独立函数，逻辑不变）
 */
async function ensureAdAlarm(): Promise<void> {
  try {
    const alarm = await chrome.alarms.get(AD_ALARM_NAME)
    if (alarm) return
    let intervalMinutes: number | null = null
    try {
      const data = await chrome.storage.local.get(AD_CACHE_KEY)
      const cache = data[AD_CACHE_KEY]
      if (cache && typeof cache === 'object' && typeof cache.nextSyncIntervalMinutes === 'number') {
        intervalMinutes = cache.nextSyncIntervalMinutes
      }
    } catch {
      // 缓存读取失败用兜底
    }
    scheduleNextAdAlarm(intervalMinutes)
  } catch {
    scheduleNextAdAlarm(null)
  }
}

// -------- 版本拉取（SW 定时 + 初始化，sidepanel 只读缓存） --------

/**
 * 拉取版本信息并写入缓存
 * POST /version/check-version，body 含 customerType/deviceInfo/versionCode（与原 sidepanel 调用一致）
 * 静默失败：不重试、不清旧缓存、等待下次触发
 * trigger: init=安装/重启触发，timer=闹钟定时触发，manual=用户手动触发
 */
async function fetchVersionCache(trigger: 'init' | 'timer' | 'manual'): Promise<void> {
  let intervalMinutes: number | null = null
  try {
    const authHeaders = await getAuthHeaders()
    // customerType 同时出现在 body 和 header（body 给后端统计，header 是公共约定）
    // SW 无 useAuth，登录态从 getAuthHeaders 推导
    const customerType = authHeaders['customerType'] === '1' ? 1 : 0
    const response = await post<CheckVersionResponse>(API_URIS.checkVersion, {
      customerType,
      versionCode: APP_VERSION_CODE,
      accessDeviceInfo: collectDeviceInfo(),
      accessLoc: ACCESS_LOC,
      deviceNumber: DEVICE_NUMBER
    }, {
      extraHeaders: authHeaders,
      timeout: BUSINESS_CONFIG.versionCheckTimeout,
      silent: true
    })
    if (response.code !== 200) {
      console.warn(`[version-sync] 版本接口返回 code=${response.code}，跳过缓存更新`)
      return
    }
    const d = response.data
    intervalMinutes = typeof d?.nextSyncIntervalMinutes === 'number' ? d.nextSyncIntervalMinutes : null
    const cache: VersionCacheData = {
      updateFlag: d?.updateFlag === 1 ? 1 : 2,
      versionData: d?.versionData ?? null,
      nextSyncIntervalMinutes: intervalMinutes,
      lastSync: Date.now()
    }
    await chrome.storage.local.set({ [VERSION_CACHE_KEY]: cache })
    if (isDev) console.log(`[version-sync] 版本缓存已更新 (trigger=${trigger}, updateFlag=${cache.updateFlag}, hasVersionData=${!!cache.versionData}, nextInterval=${intervalMinutes}min)`)
    chrome.runtime.sendMessage({ type: 'versionCacheUpdated' }).catch(() => {})
  } catch (e) {
    console.warn('[version-sync] 拉取版本信息失败（静默，不影响使用）', e)
  } finally {
    scheduleAlarm(VERSION_ALARM_NAME, intervalMinutes, DEFAULT_VERSION_INTERVAL_MINUTES)
  }
}

// -------- 通知拉取（SW 定时 + 初始化，sidepanel 只读缓存） --------

/**
 * 拉取通知列表并写入缓存
 * GET /notice/page-list（后端返回 R<NoticeSyncVO>：rows/total/nextSyncIntervalMinutes）
 * 静默失败：不重试、不清旧缓存、等待下次触发
 * trigger: init=安装/重启触发，timer=闹钟定时触发，manual=用户手动触发
 */
async function fetchNoticeCache(trigger: 'init' | 'timer' | 'manual'): Promise<void> {
  let intervalMinutes: number | null = null
  try {
    const authHeaders = await getAuthHeaders()
    const response = await get<NoticeSyncResponse>(API_URIS.noticePageList, {
      extraHeaders: authHeaders,
      timeout: BUSINESS_CONFIG.noticeFetchTimeout,
      silent: true
    })
    if (response.code !== 200) {
      console.warn(`[notice-sync] 通知接口返回 code=${response.code}，跳过缓存更新`)
      return
    }
    const d = response.data
    intervalMinutes = typeof d?.nextSyncIntervalMinutes === 'number' ? d.nextSyncIntervalMinutes : null
    const rowsRaw = Array.isArray(d?.rows) ? d.rows : []
    const rows = rowsRaw
      .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x))
      .filter((x) => typeof x.id === 'number' && typeof x.noticeLog === 'string' && typeof x.createTime === 'string')
      .map((x) => ({
        id: x.id as number,
        noticeLog: x.noticeLog as string,
        createTime: x.createTime as string
      }))
    const cache: NoticeCacheData = {
      rows,
      nextSyncIntervalMinutes: intervalMinutes,
      lastSync: Date.now()
    }
    await chrome.storage.local.set({ [NOTICE_CACHE_KEY]: cache })
    if (isDev) console.log(`[notice-sync] 通知缓存已更新 (trigger=${trigger}, rows=${cache.rows.length}, nextInterval=${intervalMinutes}min)`)
    chrome.runtime.sendMessage({ type: 'noticeCacheUpdated' }).catch(() => {})
  } catch (e) {
    console.warn('[notice-sync] 拉取通知失败（静默，不影响使用）', e)
  } finally {
    scheduleAlarm(NOTICE_ALARM_NAME, intervalMinutes, DEFAULT_NOTICE_INTERVAL_MINUTES)
  }
}

// -------- 设置菜单拉取（SW 定时 + 初始化，sidepanel 只读缓存） --------

/**
 * 拉取“更多”菜单列表并写入缓存
 * POST /setting/menu-list（@Anonymous），body 含 customerType + settingType（后端 @RequestBody）。
 * versionCode/platform/appCode 走通用请求头（buildHeaders 自动注入），不放 body。
 * settingType=1 → sidepanel 设置菜单（缓存 key=tabMasterSettingMenuCache，通知 settingMenuCacheUpdated）
 * settingType=2 → options.html 设置 tab 菜单（缓存 key=tabMasterSettingMenuOptionsCache，通知 settingMenuOptionsCacheUpdated）
 * 两套共用一个闹钟 SETTING_MENU_ALARM_NAME（一次闹钟触发同时拉两套，避免双闹钟）
 * 后端按登录用户判灰度 + versionCode 过滤
 * 静默失败：不重试、不清旧缓存、等待下次触发
 * trigger: init=安装/重启触发，timer=闹钟定时触发，manual=用户手动触发
 */
async function fetchSettingMenuCache(
  trigger: 'init' | 'timer' | 'manual',
  settingType: 1 | 2
): Promise<void> {
  const cacheKey = settingType === 1 ? SETTING_MENU_CACHE_KEY : SETTING_MENU_OPTIONS_CACHE_KEY
  const msgType = settingType === 1 ? 'settingMenuCacheUpdated' : 'settingMenuOptionsCacheUpdated'
  const logTag = settingType === 1 ? 'setting-menu-sync' : 'setting-menu-options-sync'
  let intervalMinutes: number | null = null
  try {
    const authHeaders = await getAuthHeaders()
    const customerType = authHeaders['customerType'] === '1' ? 1 : 0
    const response = await post<SettingMenuResponse>(API_URIS.settingMenuList, {
      customerType,
      settingType
    }, {
      extraHeaders: authHeaders,
      timeout: BUSINESS_CONFIG.noticeFetchTimeout,
      silent: true
    })
    if (response.code !== 200) {
      console.warn(`[${logTag}] 设置菜单接口返回 code=${response.code}（settingType=${settingType}），跳过缓存更新`)
      return
    }
    const d = response.data
    intervalMinutes = typeof d?.nextSyncIntervalMinutes === 'number' ? d.nextSyncIntervalMinutes : null
    const menusRaw = Array.isArray(d?.menus) ? d.menus : []
    const menus = menusRaw
      .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x))
      .filter((x) => typeof x.id === 'number' && typeof x.settingName === 'string' && typeof x.settingUrl === 'string')
      .map((x) => ({
        id: x.id as number,
        settingLogo: typeof x.settingLogo === 'string' ? x.settingLogo : '',
        settingName: x.settingName as string,
        settingUrl: x.settingUrl as string,
        settingSort: typeof x.settingSort === 'number' ? x.settingSort : 0
      }))
      .sort((a, b) => a.settingSort - b.settingSort)
    const cache: SettingMenuCacheData = {
      menus,
      nextSyncIntervalMinutes: intervalMinutes,
      lastSync: Date.now()
    }
    await chrome.storage.local.set({ [cacheKey]: cache })
    if (isDev) console.log(`[${logTag}] 设置菜单缓存已更新 (trigger=${trigger}, settingType=${settingType}, menus=${cache.menus.length}, nextInterval=${intervalMinutes}min)`)
    chrome.runtime.sendMessage({ type: msgType }).catch(() => {})
  } catch (e) {
    console.warn(`[${logTag}] 拉取设置菜单失败（静默，不影响使用，settingType=${settingType}）`, e)
  } finally {
    // 两套共用一个闹钟，只在 settingType=1 时调度，避免重复 create 同名闹钟互相覆盖
    if (settingType === 1) {
      scheduleAlarm(SETTING_MENU_ALARM_NAME, intervalMinutes, DEFAULT_SETTING_MENU_INTERVAL_MINUTES)
    }
  }
}

// -------- 闹钟分发（onAlarm 按 alarm.name 分发到三个独立 handler） --------

// 广告闹钟 handler（逻辑与原内联体一致，仅抽成函数便于分发）
async function handleAdAlarm(): Promise<void> {
  try {
    const data = await chrome.storage.local.get(AD_CACHE_KEY)
    const cache = data[AD_CACHE_KEY]
    if (cache && typeof cache === 'object' && typeof cache.lastSync === 'number') {
      const intervalMin = typeof cache.nextSyncIntervalMinutes === 'number'
        ? cache.nextSyncIntervalMinutes
        : DEFAULT_AD_INTERVAL_MINUTES
      const elapsed = Date.now() - cache.lastSync
      if (elapsed < intervalMin * 60 * 1000) {
        if (isDev) console.log(`[ad-sync] 距上次同步不足 ${intervalMin} 分钟 (${Math.round(elapsed / 60000)} 分钟)，跳过本次拉取`)
        scheduleNextAdAlarm(intervalMin)
        return
      }
    }
  } catch {
    // 读取失败继续拉取
  }
  await fetchAdCache('timer')
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  // 三个闹钟各自独立分发，互不串扰
  switch (alarm.name) {
    case AD_ALARM_NAME:
      await handleAdAlarm()
      return
    case VERSION_ALARM_NAME:
      if (await shouldSkipByGap(VERSION_CACHE_KEY, DEFAULT_VERSION_INTERVAL_MINUTES, VERSION_ALARM_NAME)) return
      await fetchVersionCache('timer')
      return
    case NOTICE_ALARM_NAME:
      if (await shouldSkipByGap(NOTICE_CACHE_KEY, DEFAULT_NOTICE_INTERVAL_MINUTES, NOTICE_ALARM_NAME)) return
      await fetchNoticeCache('timer')
      return
    case SETTING_MENU_ALARM_NAME:
      // 两套菜单共用一个闹钟，gap 判断以 sidepanel（settingType=1）缓存为准；
      // 通过即同时拉 sidepanel + options 两套
      if (await shouldSkipByGap(SETTING_MENU_CACHE_KEY, DEFAULT_SETTING_MENU_INTERVAL_MINUTES, SETTING_MENU_ALARM_NAME)) return
      await fetchSettingMenuCache('timer', 1)
      await fetchSettingMenuCache('timer', 2)
      return
    default:
      return
  }
})

// SW 每次启动（含从 idle 唤醒）时确保三个闹钟存在，不触发拉取
// 参考 alarms.md 官方建议：important alarms should be ensured each time SW starts
ensureAdAlarm()
ensureAlarm(VERSION_ALARM_NAME, VERSION_CACHE_KEY, DEFAULT_VERSION_INTERVAL_MINUTES)
ensureAlarm(NOTICE_ALARM_NAME, NOTICE_CACHE_KEY, DEFAULT_NOTICE_INTERVAL_MINUTES)
ensureAlarm(SETTING_MENU_ALARM_NAME, SETTING_MENU_CACHE_KEY, DEFAULT_SETTING_MENU_INTERVAL_MINUTES)


// 快捷键切换标签：chrome.commands global 全局捕获（不依赖 sidepanel/sidepanel 焦点，浏览器无焦点也触发）
// Chrome 限制最多 4 个 suggested shortcuts + global 只能 Ctrl+Shift+[0..9]，故只注册编号 1-4
// 跨平台统一 Ctrl+Shift+N（Mac/Win/Linux/Edge/Chrome 一致）
// 收到命令 -> 读 storage.local.tabNumberMap -> 找到该编号的 tabId -> 激活
// tabNumberMap 由 sidepanel 的 useTabManager.updateTabNumber 写入，key=String(tabId), value=编号
chrome.commands.onCommand.addListener(async (command) => {
  const m = /^switch-tab-([1-4])$/.exec(command)
  if (!m) return
  const targetNum = parseInt(m[1])
  try {
    const data = await chrome.storage.local.get("tabNumberMap")
    const numberMap: Record<string, number> = (data.tabNumberMap && typeof data.tabNumberMap === "object" && !Array.isArray(data.tabNumberMap)) ? data.tabNumberMap : {}
    // 找到编号对应的 tabId
    let targetTabId: number | null = null
    for (const [k, v] of Object.entries(numberMap)) {
      if (v === targetNum) { targetTabId = parseInt(k); break }
    }
    if (targetTabId === null) return
    // 激活该 tab（chrome.tabs.update 会自动切到 tab 所在窗口并激活）
    await chrome.tabs.update(targetTabId, { active: true })
  } catch (e) {
    // tab 可能已关闭，静默
  }
})
