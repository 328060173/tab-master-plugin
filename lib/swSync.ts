/**
 * SW 数据同步 - 抽离自 background.ts（红线 .ts ≤ 500）
 *
 * 职责：收口 SW 上下文里所有数据同步 + 快捷键相关逻辑：
 * 1. 广告/版本/通知/设置菜单四套独立拉取（sidepanel 不发上述网络请求，红线）
 *    SW 靠 chrome.alarms 定时拉 + onInstalled/onStartup 初始化拉
 * 2. syncAll 统一入口（多触发源一套业务逻辑）
 * 3. 通用闹钟工具 + 各模块独立 ensure/schedule
 * 4. handleSyncAlarm：onAlarm 按 alarm.name 分发（备份闹钟由 background.ts 处理）
 * 5. handleSyncMessage：onMessage 的 manualRefreshAll 分支（backup: 前缀由 background.ts 路由）
 * 6. handleTabSwitchCommand：chrome.commands 全局快捷键切换标签 1-4
 *
 * 详见 [[pattern-sw-as-collector]] + types/ad.ts / types/version.ts / types/notice.ts / types/setting.ts
 * 兼容：Chrome 88+ / Edge 88+（参见 [[constraint-target-platforms]]）
 */

import { get, post } from '~lib/api'
import { API_URIS, APP_VERSION_CODE } from '~lib/api-config'
import { isDev } from '~lib/env'
import { BUSINESS_CONFIG } from '~config/app-config'
import { collectDeviceInfo, ACCESS_LOC, DEVICE_NUMBER } from '~lib/device-info'
import type { AdCacheData, AdSyncResponse } from '~types/ad'
import type { CheckVersionResponse, VersionCacheData } from '~types/version'
import type { NoticeCacheData, NoticeSyncResponse } from '~types/notice'
import type { SettingMenuResponse, SettingMenuCacheData } from '~types/setting'

// ============ 缓存/闹钟名常量 ============
const AD_CACHE_KEY = 'tabMasterAdCache'
const AD_ALARM_NAME = 'tabMasterAdSync'
const VERSION_CACHE_KEY = 'tabMasterVersionCache'
const VERSION_ALARM_NAME = 'tabMasterVersionSync'
const NOTICE_CACHE_KEY = 'tabMasterNoticeCache'
const NOTICE_ALARM_NAME = 'tabMasterNoticeSync'
const SETTING_MENU_CACHE_KEY = 'tabMasterSettingMenuCache'
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

// sidepanel 设置菜单 settingType=1（options 设置 tab 菜单 settingType=2 由 options 页直接请求，不走 SW）
const SETTING_TYPE_SIDEPANEL = 1

// 快捷键切换标签 storage key（与 sidepanel useTabManager.updateTabNumber 写入对齐）
const TAB_NUMBER_MAP_KEY = 'tabNumberMap'
// Chrome 限制最多 4 个 suggested shortcuts + global 只能 Ctrl+Shift+[0..9]，故只注册编号 1-4
const SWITCH_TAB_COMMAND_RE = /^switch-tab-([1-4])$/

type SyncTrigger = 'init' | 'timer' | 'manual'

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
      return { 'Authorization': `Bearer ${auth.token}`, 'customerType': '1' }
    }
  } catch {
    // 读取失败按匿名处理
  }
  return { 'customerType': '0' }
}

// -------- 通用闹钟工具（version/notice/setting 复用，广告保留独立函数不动）--------

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
 * 不触发拉取，只保证下一次闹钟已设置；间隔从缓存读后端下发的 nextSyncIntervalMinutes
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
 * 通用 gap 判断：距 lastSync 是否满 nextSyncIntervalMinutes
 * 返回 true=应跳过（已重设闹钟），false=应继续拉取（由 fetch 内部 finally 设闹钟）
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
 * 拉取广告并写入缓存。POST /ad/list，body 含 customerType/position/trigger。
 * platform/appCode/versionCode 走通用请求头，不放 body。
 * 静默失败：不重试、不清旧缓存、等待下次触发
 */
async function fetchAdCache(trigger: SyncTrigger): Promise<void> {
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

/** 设置下一次广告同步闹钟（保留广告独立函数，逻辑不变） */
function scheduleNextAdAlarm(intervalMinutes: number | null): void {
  const base = typeof intervalMinutes === 'number' && intervalMinutes > 0 ? intervalMinutes : DEFAULT_AD_INTERVAL_MINUTES
  const offsetMinutes = Math.random() * MAX_OFFSET_MINUTES
  const delayMinutes = base + offsetMinutes
  chrome.alarms.create(AD_ALARM_NAME, { delayInMinutes: delayMinutes })
  if (isDev) console.log(`[ad-sync] 下次广告同步闹钟: ${delayMinutes.toFixed(1)} 分钟后 (${(delayMinutes / 60).toFixed(1)}h)，基础间隔 ${base}min`)
}

/** 确保广告闹钟存在（保留广告独立函数，逻辑不变） */
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

/** 广告闹钟 handler（逻辑与原内联体一致，仅抽成函数便于分发） */
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

// -------- 版本拉取（SW 定时 + 初始化，sidepanel 只读缓存） --------

/**
 * 拉取版本信息并写入缓存。POST /version/check-version，body 含 customerType/deviceInfo/versionCode。
 * customerType 同时出现在 body 和 header（body 给后端统计，header 是公共约定）。
 * 静默失败：不重试、不清旧缓存、等待下次触发
 */
async function fetchVersionCache(trigger: SyncTrigger): Promise<void> {
  let intervalMinutes: number | null = null
  try {
    const authHeaders = await getAuthHeaders()
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
 * 拉取通知列表并写入缓存。GET /notice/page-list（后端返回 R<NoticeSyncVO>：rows/total/nextSyncIntervalMinutes）。
 * 静默失败：不重试、不清旧缓存、等待下次触发
 */
async function fetchNoticeCache(trigger: SyncTrigger): Promise<void> {
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
// 仅拉取 sidepanel 设置菜单（settingType=1）；options.html 设置 tab 菜单（settingType=2）
// 由 options 页直接请求后端，不走 SW 缓存（options 是用户主动操作页）

/**
 * 拉取"更多"菜单列表并写入缓存。POST /setting/menu-list（@Anonymous），body 含 customerType + settingType=1。
 * 后端按登录用户判灰度 + versionCode 过滤。静默失败：不重试、不清旧缓存、等待下次触发
 */
async function fetchSettingMenuCache(trigger: SyncTrigger): Promise<void> {
  const settingType = SETTING_TYPE_SIDEPANEL
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
      console.warn(`[setting-menu-sync] 设置菜单接口返回 code=${response.code}，跳过缓存更新`)
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
    await chrome.storage.local.set({ [SETTING_MENU_CACHE_KEY]: cache })
    if (isDev) console.log(`[setting-menu-sync] 设置菜单缓存已更新 (trigger=${trigger}, menus=${cache.menus.length}, nextInterval=${intervalMinutes}min)`)
    chrome.runtime.sendMessage({ type: 'settingMenuCacheUpdated' }).catch(() => {})
  } catch (e) {
    console.warn('[setting-menu-sync] 拉取设置菜单失败（静默，不影响使用）', e)
  } finally {
    scheduleAlarm(SETTING_MENU_ALARM_NAME, intervalMinutes, DEFAULT_SETTING_MENU_INTERVAL_MINUTES)
  }
}

// ============ 统一数据同步入口（多触发源一套业务逻辑） ============

/**
 * 统一数据同步入口。各模块独立 fire-and-forget，互不阻塞——不 Promise.all 等全部。
 * 各 fetch 内部成功后各自广播 xxxCacheUpdated，sidepanel 各模块自监听刷新。
 * 触发源：init(安装/重启) / manual(手动按钮) / 未来可扩展 'open'(打开插件)。
 * 注意：timer(各闹钟定时)不走本函数——各模块定时间隔不同，保持各 alarm 独立调各 fetch
 */
function syncAll(trigger: SyncTrigger): void {
  void fetchSettingMenuCache(trigger)
  void fetchAdCache(trigger)
  void fetchVersionCache(trigger)
  void fetchNoticeCache(trigger)
}

/** SW 启动（含从 idle 唤醒）时确保四个闹钟存在，不触发拉取（参考 alarms.md 官方建议） */
function ensureAllSyncAlarms(): void {
  void ensureAdAlarm()
  void ensureAlarm(VERSION_ALARM_NAME, VERSION_CACHE_KEY, DEFAULT_VERSION_INTERVAL_MINUTES)
  void ensureAlarm(NOTICE_ALARM_NAME, NOTICE_CACHE_KEY, DEFAULT_NOTICE_INTERVAL_MINUTES)
  void ensureAlarm(SETTING_MENU_ALARM_NAME, SETTING_MENU_CACHE_KEY, DEFAULT_SETTING_MENU_INTERVAL_MINUTES)
}

/**
 * 处理同步类闹钟（广告/版本/通知/设置菜单）。
 * 返回 true=已处理；false=非同步闹钟，由调用方（background.ts）继续路由（如备份）
 */
async function handleSyncAlarm(alarm: chrome.alarms.Alarm): Promise<boolean> {
  switch (alarm.name) {
    case AD_ALARM_NAME:
      await handleAdAlarm()
      return true
    case VERSION_ALARM_NAME:
      if (await shouldSkipByGap(VERSION_CACHE_KEY, DEFAULT_VERSION_INTERVAL_MINUTES, VERSION_ALARM_NAME)) return true
      await fetchVersionCache('timer')
      return true
    case NOTICE_ALARM_NAME:
      if (await shouldSkipByGap(NOTICE_CACHE_KEY, DEFAULT_NOTICE_INTERVAL_MINUTES, NOTICE_ALARM_NAME)) return true
      await fetchNoticeCache('timer')
      return true
    case SETTING_MENU_ALARM_NAME:
      // sidepanel 设置菜单（settingType=1）定时拉取；options 设置 tab 菜单不走此闹钟
      if (await shouldSkipByGap(SETTING_MENU_CACHE_KEY, DEFAULT_SETTING_MENU_INTERVAL_MINUTES, SETTING_MENU_ALARM_NAME)) return true
      await fetchSettingMenuCache('timer')
      return true
    default:
      return false
  }
}

// ============ 手动刷新（用户在 options 页点「刷新菜单内容」触发）============
// sidepanel 不发任何广告/版本/通知/设置菜单网络请求（红线），手动刷新也走 SW。
// ⚠️ manual 刻意不刷广告：广告有「展示即消费」逻辑（useAd consumeCurrentAd 展示后 adData 置 null），
//    若 manual 触发 fetchAdCache 又拉到新广告会再弹一次，每次点刷新就弹广告，体验差。
//    所以 manual 只刷 菜单/通知/版本（无「展示即消费」副作用），广告仍由 init/timer 正常拉。
// 同时广播 manualRefreshMy 触发 /my 重拉（/my 架构不同，在 sidepanel 按需拉，未登录则忽略）。

/**
 * 处理同步类 onMessage（manualRefreshAll）。
 * 返回 true=已处理；false=非同步消息，由调用方（background.ts）继续路由（如 backup:）
 */
function handleSyncMessage(msg: unknown): boolean {
  if (!msg || typeof msg !== 'object' || Array.isArray(msg)) return false
  const type = (msg as Record<string, unknown>).type
  if (type !== 'manualRefreshAll') return false
  if (isDev) console.log('[sync] 收到手动刷新请求 (manualRefreshAll)，不含广告')
  // 手动刷新不触发广告；菜单/通知/版本仍同步
  void fetchSettingMenuCache('manual')
  void fetchNoticeCache('manual')
  void fetchVersionCache('manual')
  chrome.runtime.sendMessage({ type: 'manualRefreshMy' }).catch(() => {})
  return true
}

// ============ 快捷键切换标签 ============
// chrome.commands global 全局捕获（不依赖 sidepanel 焦点，浏览器无焦点也触发）
// 收到命令 -> 读 storage.local.tabNumberMap -> 找到该编号的 tabId -> 激活
// tabNumberMap 由 sidepanel 的 useTabManager.updateTabNumber 写入，key=String(tabId), value=编号
async function handleTabSwitchCommand(command: string): Promise<void> {
  const m = SWITCH_TAB_COMMAND_RE.exec(command)
  if (!m) return
  const targetNum = parseInt(m[1])
  try {
    const data = await chrome.storage.local.get(TAB_NUMBER_MAP_KEY)
    const numberMap: Record<string, number> = (data[TAB_NUMBER_MAP_KEY] && typeof data[TAB_NUMBER_MAP_KEY] === 'object' && !Array.isArray(data[TAB_NUMBER_MAP_KEY])) ? data[TAB_NUMBER_MAP_KEY] : {}
    let targetTabId: number | null = null
    for (const [k, v] of Object.entries(numberMap)) {
      if (v === targetNum) { targetTabId = parseInt(k); break }
    }
    if (targetTabId === null) return
    // 激活该 tab（chrome.tabs.update 会自动切到 tab 所在窗口并激活）
    await chrome.tabs.update(targetTabId, { active: true })
  } catch {
    // tab 可能已关闭，静默
  }
}

export {
  syncAll,
  ensureAllSyncAlarms,
  handleSyncAlarm,
  handleSyncMessage,
  handleTabSwitchCommand,
}
