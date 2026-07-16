/**
 * 广告管理 - 单例模式
 *
 * 架构（2026-07-16 重设计）：
 * - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 * - 缓存写入：SW 写 chrome.storage.local.tabMasterAdCache，sendMessage({type:'adCacheUpdated'}) 通知
 * - 广告渲染：sidepanel 只读缓存，禁止任何 fetch 广告请求
 *
 * 两个 storage key 各司其职：
 * - tabMasterAdCache：广告素材 + hideAd 标志（SW 写入，sidepanel 只读）
 * - tabMasterAdState：展示去重状态（shownCount/interactedAdIds，sidepanel 读写）
 *
 * 不打扰用户策略（沿用）：
 * 1. 频率上限：每天最多展示 N 次（默认 3 次），超过当天不再弹
 * 2. 点击/关闭抑制：用户点击「去了解」或✕关闭某广告后，该 adId 当天不再显示（按 adId 记录）
 * 3. 自然日重置：次日 00:00 计数清零，重新允许展示
 * 4. hideAd 最高优先级：VIP/登录用户免广告有效时一律隐藏广告区
 *
 * 渲染逻辑：
 * - hideAd=true 且 当前时间 < expireTime → 隐藏广告区
 * - hideAd=false 或免广告已过期 → 用 adData 渲染（受频率上限+去重约束）
 * - 无缓存 → 展示内置静态占位广告（兜底 AdInfo，不发请求）
 */

import { ref, computed } from 'vue'
import { OFFICIAL_SITE_URL } from '~lib/api-config'
import { BUSINESS_CONFIG } from '~config/app-config'
import type { AdCacheData, AdInfo, AdItem } from '~types/ad'

const AD_STATE_KEY = 'tabMasterAdState'
const AD_CACHE_KEY = 'tabMasterAdCache'
const MAX_SHOW_PER_DAY = BUSINESS_CONFIG.adMaxShowPerDay  // 每天最多展示次数（配置中心，后续后端下发）

// 存储状态（展示去重，sidepanel 读写）
interface AdState {
  date: string | null           // 'YYYY-MM-DD'，跨天重置
  shownCount: number            // 当天已展示次数
  interactedAdIds: number[]     // 当天已点击/关闭的 adId
}

const DEFAULT_STATE: AdState = {
  date: null,
  shownCount: 0,
  interactedAdIds: []
}

// 兜底占位广告（无缓存时展示，不发请求）
const FALLBACK_AD: AdInfo = {
  id: 0,
  title: '浏览器标签大师 — 让标签管理更高效',
  imageUrl: '',
  linkUrl: OFFICIAL_SITE_URL,
  duration: BUSINESS_CONFIG.adDefaultDuration
}

const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))

// 今天日期字符串（用 toDateString 与版本检查一致）
function todayStr(): string {
  return new Date().toDateString()
}

// 清洗展示状态存储数据
function sanitizeState(raw: unknown): AdState {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_STATE }
  }
  const obj = raw as Record<string, unknown>
  const interacted = Array.isArray(obj.interactedAdIds)
    ? obj.interactedAdIds.filter((x): x is number => typeof x === 'number')
    : []
  // 跨天重置：存储的 date 不是今天 -> 回归默认
  const storedDate = typeof obj.date === 'string' ? obj.date : null
  if (storedDate !== todayStr()) {
    return { ...DEFAULT_STATE, date: todayStr() }
  }
  return {
    date: storedDate,
    shownCount: typeof obj.shownCount === 'number' ? obj.shownCount : 0,
    interactedAdIds: interacted
  }
}

// 清洗广告素材
function sanitizeAdItem(raw: unknown): AdItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const obj = raw as Record<string, unknown>
  if (typeof obj.id !== 'number') return null
  return {
    id: obj.id,
    title: typeof obj.title === 'string' ? obj.title : '',
    imageUrl: typeof obj.imageUrl === 'string' ? obj.imageUrl : '',
    linkUrl: typeof obj.linkUrl === 'string' ? obj.linkUrl : '',
    duration: typeof obj.duration === 'number' ? obj.duration : BUSINESS_CONFIG.adDefaultDuration,
    startTime: typeof obj.startTime === 'string' ? obj.startTime : '',
    endTime: typeof obj.endTime === 'string' ? obj.endTime : ''
  }
}

// 清洗广告缓存数据（SW 写入，sidepanel 读时校验）
function sanitizeAdCache(raw: unknown): AdCacheData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const obj = raw as Record<string, unknown>
  // 缺少 lastSync 视为无效缓存（可能是清空后的空对象）
  if (typeof obj.lastSync !== 'number') return null
  return {
    hideAd: obj.hideAd === true,
    expireTime: typeof obj.expireTime === 'number' ? obj.expireTime : null,
    adData: sanitizeAdItem(obj.adData),
    lastSync: obj.lastSync,
    serverTime: typeof obj.serverTime === 'number' ? obj.serverTime : null,
    nextSyncIntervalMinutes: typeof obj.nextSyncIntervalMinutes === 'number' ? obj.nextSyncIntervalMinutes : null
  }
}

let _instance: ReturnType<typeof useAdImpl> | null = null

function useAdImpl() {
  const state = ref<AdState>({ ...DEFAULT_STATE, date: todayStr() })
  const adCache = ref<AdCacheData | null>(null)
  const currentAd = ref<AdInfo | null>(null)

  // 是否还能展示（频率上限 + 跨天重置）
  const canShowMore = computed(() => state.value.shownCount < MAX_SHOW_PER_DAY)

  // hideAd 是否生效（VIP/登录用户免广告）
  const isAdHidden = computed(() => {
    const c = adCache.value
    if (!c || !c.hideAd) return false
    // expireTime 存在且未过期才隐藏；无 expireTime 视为永久隐藏
    if (c.expireTime === null) return true
    return Date.now() < c.expireTime
  })

  async function loadState() {
    try {
      const data = await chrome.storage.local.get(AD_STATE_KEY)
      state.value = sanitizeState(data[AD_STATE_KEY])
    } catch (e) {
      console.warn('[ad] 加载展示状态失败', e)
      state.value = { ...DEFAULT_STATE, date: todayStr() }
    }
  }

  async function saveState() {
    try {
      await chrome.storage.local.set({ [AD_STATE_KEY]: toPure(state.value) })
    } catch (e) {
      console.warn('[ad] 保存展示状态失败', e)
    }
  }

  async function loadAdCache() {
    try {
      const data = await chrome.storage.local.get(AD_CACHE_KEY)
      adCache.value = sanitizeAdCache(data[AD_CACHE_KEY])
    } catch (e) {
      console.warn('[ad] 加载广告缓存失败', e)
      adCache.value = null
    }
  }

  /**
   * 从缓存中选择要展示的广告（选择时检查频率/去重，选定后不再受频率连续影响）
   * - hideAd 生效 → null
   * - 频率上限 → null
   * - adData 有效且未交互过 → adData
   * - 无缓存 → 兜底占位广告（FALLBACK_AD）
   * - 有缓存但无可用广告 → null
   */
  function selectAd() {
    // hideAd 最高优先级
    if (isAdHidden.value) {
      currentAd.value = null
      return
    }
    // 频率上限
    if (!canShowMore.value) {
      currentAd.value = null
      return
    }
    const adData = adCache.value?.adData
    if (adData && !state.value.interactedAdIds.includes(adData.id)) {
      currentAd.value = {
        id: adData.id,
        title: adData.title,
        imageUrl: adData.imageUrl,
        linkUrl: adData.linkUrl,
        duration: adData.duration || BUSINESS_CONFIG.adDefaultDuration
      }
      return
    }
    // 无缓存 → 兜底占位广告
    if (!adCache.value) {
      currentAd.value = { ...FALLBACK_AD }
      return
    }
    // 有缓存但无可用广告（adData 为 null 或已交互过）
    currentAd.value = null
  }

  /**
   * 消费当前广告：把缓存里的 adData 置 null 并写回 storage（展示即消费）
   * - 只清素材 adData，保留 lastSync/nextSyncIntervalMinutes/hideAd/expireTime/serverTime
   *   （SW 仍需用 lastSync/nextSyncIntervalMinutes 判断下次拉取时机）
   * - 守 toPure()：adCache.value 是 reactive proxy，直接写 storage 会被结构化克隆成数字键对象
   *   导致读回 Array.isArray 失败被当脏数据丢（[[lesson-reactive-proxy-storage-serialize]]）
   * - 消费后 adData=null，selectAd() 在「有缓存但 adData 为 null」分支返回 null，本时间窗口不再弹
   *   直到 SW 下次拉到新广告（adCacheUpdated 通知）才会再弹
   * async 不 await 也可，失败只 warn（不阻塞 UI 关闭流程）
   */
  async function consumeCurrentAd() {
    const c = adCache.value
    if (!c || !c.adData) return
    c.adData = null
    try {
      await chrome.storage.local.set({ [AD_CACHE_KEY]: toPure(c) })
      console.log('[ad] 当前广告已消费，adData 置 null，本窗口不再弹')
    } catch (e) {
      console.warn('[ad] 消费广告写缓存失败', e)
    }
  }

  /**
   * 广告已展示（用户看到了）-> 计数 +1
   * 展示计数与点击/关闭独立：即使不点击，看过了也算 1 次频率
   */
  async function markShown() {
    if (!currentAd.value) return
    state.value.shownCount++
    await saveState()
    console.log(`[ad] 展示计数 ${state.value.shownCount}/${MAX_SHOW_PER_DAY}`)
  }

  /**
   * 用户点击广告 -> 记 adId（今天不再展示这条）+ 打开链接 + 消费当前广告素材
   */
  async function onAdClick() {
    if (!currentAd.value) return
    const id = currentAd.value.id
    if (!state.value.interactedAdIds.includes(id)) {
      state.value.interactedAdIds.push(id)
      await saveState()
    }
    console.log(`[ad] 用户点击广告 id=${id}，今天不再展示`)
    // 消费：清缓存素材，本时间窗口不再弹（等 SW 下次拉新广告）
    consumeCurrentAd()
    // 打开链接
    if (currentAd.value.linkUrl) {
      try { chrome.tabs.create({ url: currentAd.value.linkUrl }) } catch (e) { console.warn('[ad] 打开链接失败', e) }
    }
    currentAd.value = null
  }

  /**
   * 用户关闭广告 -> 记 adId（今天不再展示这条）+ 消费当前广告素材
   */
  async function onAdDismiss() {
    if (!currentAd.value) return
    const id = currentAd.value.id
    if (!state.value.interactedAdIds.includes(id)) {
      state.value.interactedAdIds.push(id)
      await saveState()
    }
    console.log(`[ad] 用户关闭广告 id=${id}，今天不再展示`)
    // 消费：清缓存素材，本时间窗口不再弹
    consumeCurrentAd()
    currentAd.value = null
  }

  /**
   * 广告自动消失（duration 到）-> 消费当前广告素材（本窗口不再弹这条），但已计展示次数
   */
  function onAdExpired() {
    console.log('[ad] 广告展示时长到，自动消失')
    // 消费：清缓存素材，本时间窗口不再弹（展示即消费，看完自动消失也算消费）
    consumeCurrentAd()
    currentAd.value = null
  }

  // 监听 SW 广告缓存更新通知 -> 重读缓存 + 重新选择广告
  // 单例 composable，监听器在初始化时注册一次（不在 onMounted/onUnmounted，避免永久丢失）
  chrome.runtime.onMessage.addListener((msg: unknown) => {
    if (msg && typeof msg === 'object' && !Array.isArray(msg)
      && (msg as Record<string, unknown>).type === 'adCacheUpdated') {
      loadAdCache().then(() => selectAd())
    }
  })

  // 初始化：加载展示状态 + 广告缓存，然后选择广告
  Promise.all([loadState(), loadAdCache()]).then(() => selectAd())

  return {
    currentAd,
    canShowMore,
    markShown,
    onAdClick,
    onAdDismiss,
    onAdExpired
  }
}

export function useAd() {
  if (!_instance) {
    _instance = useAdImpl()
  }
  return _instance
}

// 导出 AdInfo 类型供 AdBanner 使用（向后兼容）
export type { AdInfo } from '~types/ad'
