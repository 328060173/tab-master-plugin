/**
 * 广告管理 - 单例模式
 *
 * 不打扰用户策略（最佳实践）：
 * 1. 频率上限：每天最多展示 N 次（默认 3 次），超过当天不再弹
 * 2. 点击/关闭抑制：用户点击「去了解」或✕关闭某广告后，该 adId 当天不再显示（按 adId 记录）
 * 3. 自然日重置：次日 00:00 计数清零，重新允许展示
 * 4. 静默失败：3秒超时/网络错误/接口报错都不影响插件功能（silent 模式）
 *
 * 记录结构（chrome.storage.local）：
 * - date: 'YYYY-MM-DD' 当前记录对应的日期（跨天则重置）
 * - shownCount: 当天已展示次数（跨广告共享，控制总频率）
 * - interactedAdIds: 当天已点击/关闭的广告 id 列表（按 adId 抑制重复打扰）
 */

import { ref, computed } from 'vue'
import { get } from '~lib/api'
import { API_URIS } from '~lib/api-config'
import { BUSINESS_CONFIG } from '~config/app-config'

const AD_KEY = 'tabMasterAdState'
const MAX_SHOW_PER_DAY = BUSINESS_CONFIG.adMaxShowPerDay  // 每天最多展示次数（配置中心，后续后端下发）

// 后端 AdItemVO 字段
interface AdItem {
  id: number
  title: string
  imageUrl: string
  linkUrl: string
  duration: number       // 展示时长（秒）
  startTime: string
  endTime: string
}

// 广告列表响应
interface AdListResponse {
  code: number
  msg: string
  data: AdItem[] | null
}

// 暴露给 UI 的广告信息
export interface AdInfo {
  id: number
  title: string
  imageUrl: string
  linkUrl: string
  duration: number
}

// 存储状态
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

const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))

// 今天日期字符串 'YYYY-MM-DD'
function todayStr(): string {
  return new Date().toDateString()  // 用 toDateString 与版本检查一致，够用
}

// 清洗存储数据
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

let _instance: ReturnType<typeof useAdImpl> | null = null

function useAdImpl() {
  const state = ref<AdState>({ ...DEFAULT_STATE, date: todayStr() })
  const currentAd = ref<AdInfo | null>(null)
  const isFetching = ref(false)

  // 是否还能展示（频率上限 + 跨天重置）
  const canShowMore = computed(() => state.value.shownCount < MAX_SHOW_PER_DAY)

  async function loadState() {
    try {
      const data = await chrome.storage.local.get(AD_KEY)
      state.value = sanitizeState(data[AD_KEY])
    } catch (e) {
      console.warn('[ad] 加载状态失败', e)
      state.value = { ...DEFAULT_STATE, date: todayStr() }
    }
  }

  async function saveState() {
    try {
      await chrome.storage.local.set({ [AD_KEY]: toPure(state.value) })
    } catch (e) {
      console.warn('[ad] 保存状态失败', e)
    }
  }

  /**
   * 拉取广告列表并选出一条可展示的
   * 静默失败：任何错误都不影响插件功能
   *
   * 选广告逻辑：
   * 1. 后端返回按 sort 排序的生效中广告列表
   * 2. 过滤掉今天已点击/关闭的 adId
   * 3. 取剩余的第一条
   * 4. 受频率上限约束（当天已达 MAX_SHOW_PER_DAY 不展示）
   */
  async function fetchAd() {
    if (isFetching.value) return
    // 频率上限：当天已达上限不再拉
    if (!canShowMore.value) {
      console.log(`[ad] 当天已展示 ${state.value.shownCount} 次，达上限 ${MAX_SHOW_PER_DAY}，不再展示`)
      currentAd.value = null
      return
    }

    isFetching.value = true
    console.log('[ad] 开始拉取广告')

    try {
      // position 由配置中心管理（后续后端下发），超时用配置
      const response = await get<AdListResponse>(API_URIS.adList, {
        params: { position: BUSINESS_CONFIG.adPosition },
        timeout: BUSINESS_CONFIG.adFetchTimeout,
        silent: true
      })
      if (response.code !== 200) {
        throw new Error(response.msg || '广告接口失败')
      }
      const list = response.data || []
      if (!list.length) {
        console.log('[ad] 暂无广告')
        currentAd.value = null
        return
      }
      // 过滤今天已交互的 adId
      const available = list.filter(a => !state.value.interactedAdIds.includes(a.id))
      if (!available.length) {
        console.log('[ad] 广告都已交互过，今天不再展示')
        currentAd.value = null
        return
      }
      const pick = available[0]
      currentAd.value = {
        id: pick.id,
        title: pick.title,
        imageUrl: pick.imageUrl,
        linkUrl: pick.linkUrl,
        duration: pick.duration || 10
      }
      console.log(`[ad] 选中广告 id=${pick.id} title=${pick.title}`)
    } catch (e) {
      // 静默失败，不影响插件
      console.warn('[ad] 拉取失败（静默，不影响使用）', e)
      currentAd.value = null
    } finally {
      isFetching.value = false
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
   * 用户点击广告 -> 记 adId（今天不再展示这条）+ 打开链接
   */
  async function onAdClick() {
    if (!currentAd.value) return
    const id = currentAd.value.id
    if (!state.value.interactedAdIds.includes(id)) {
      state.value.interactedAdIds.push(id)
      await saveState()
    }
    console.log(`[ad] 用户点击广告 id=${id}，今天不再展示`)
    // 打开链接
    if (currentAd.value.linkUrl) {
      try { chrome.tabs.create({ url: currentAd.value.linkUrl }) } catch (e) { console.warn('[ad] 打开链接失败', e) }
    }
    currentAd.value = null
  }

  /**
   * 用户关闭广告 -> 记 adId（今天不再展示这条）
   */
  async function onAdDismiss() {
    if (!currentAd.value) return
    const id = currentAd.value.id
    if (!state.value.interactedAdIds.includes(id)) {
      state.value.interactedAdIds.push(id)
      await saveState()
    }
    console.log(`[ad] 用户关闭广告 id=${id}，今天不再展示`)
    currentAd.value = null
  }

  /**
   * 广告自动消失（duration 到）-> 不记 adId（下次还可展示这条），但已计展示次数
   */
  function onAdExpired() {
    console.log('[ad] 广告展示时长到，自动消失')
    currentAd.value = null
  }

  loadState()

  return {
    currentAd,
    isFetching,
    canShowMore,
    fetchAd,
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
