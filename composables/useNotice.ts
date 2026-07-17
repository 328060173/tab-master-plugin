/**
 * 消息通知管理 - 单例模式（只读缓存）
 *
 * 架构（2026-07-16 重设计，与广告同模式）：
 * - 请求拉取：Service Worker 定时（chrome.alarms）+ 初始化（onInstalled/onStartup）
 *   GET /notice/page-list 由 SW 发，写 tabMasterNoticeCache，sendMessage({type:'noticeCacheUpdated'}) 通知
 * - 通知条渲染：sidepanel 只读缓存，禁止任何 fetch 通知请求
 *
 * 已读永久不展示（2026-07-16 用户新硬要求）：
 * - 已读 id 列表（tabMasterNoticeRead）永久保留，不跨天清零（与广告 interactedAdIds 当天重置不同）
 * - 渲染时从缓存读到的 notices 过滤掉 readIds 里的 id —— 已读的彻底不展示
 * - SW 重新拉到同 id（4h 间隔到了）：因 readIds 里有该 id，渲染时仍被过滤掉，不展示
 * - 上限保护：readIds 超 1000 条时清最早的（防 storage 无限膨胀）
 */

import { ref, computed } from 'vue'
import type { NoticeCacheData, NoticeItem } from '~types/notice'

const NOTICE_READ_KEY = 'tabMasterNoticeRead'
// 通知列表缓存 key（SW 写入，sidepanel 只读）
const NOTICE_CACHE_KEY = 'tabMasterNoticeCache'
// readIds 上限：超此数量清最早的，防 storage 无限膨胀
const READ_IDS_MAX = 1000

const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))

// 清洗已读 id 列表
function sanitizeReadIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is number => typeof x === 'number')
}

// 清洗通知项
function sanitizeNoticeItem(raw: unknown): NoticeItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const x = raw as Record<string, unknown>
  if (typeof x.id !== 'number' || typeof x.noticeLog !== 'string' || typeof x.createTime !== 'string') return null
  return { id: x.id, noticeLog: x.noticeLog, createTime: x.createTime }
}

// 清洗通知缓存数据（SW 写入，sidepanel 读时校验）
// 兼容旧格式（直接存数组）：若读到数组则当 rows 处理
function sanitizeNoticeCache(raw: unknown): NoticeCacheData | null {
  if (!raw) return null
  // 旧格式兼容：直接是数组
  if (Array.isArray(raw)) {
    const rows = raw.map(sanitizeNoticeItem).filter((x): x is NoticeItem => x !== null)
    return { rows, nextSyncIntervalMinutes: null, lastSync: 0 }
  }
  if (typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  // 缺少 lastSync 视为无效缓存
  if (typeof o.lastSync !== 'number') return null
  const rowsRaw = Array.isArray(o.rows) ? o.rows : []
  const rows = rowsRaw.map(sanitizeNoticeItem).filter((x): x is NoticeItem => x !== null)
  return {
    rows,
    nextSyncIntervalMinutes: typeof o.nextSyncIntervalMinutes === 'number' ? o.nextSyncIntervalMinutes : null,
    lastSync: o.lastSync
  }
}

let _instance: ReturnType<typeof useNoticeImpl> | null = null

function useNoticeImpl() {
  // SW 写入的原始缓存（未过滤已读）
  const cachedNotices = ref<NoticeItem[]>([])
  const readIds = ref<number[]>([])

  // 展示列表 = 缓存 - 已读（已读的彻底不展示，永久）
  const notices = computed(() =>
    cachedNotices.value.filter(n => !readIds.value.includes(n.id))
  )

  // 未读数 = 展示列表长度（展示的都是未读）
  const unreadCount = computed(() => notices.value.length)

  // 是否有通知
  const hasNotice = computed(() => notices.value.length > 0)

  async function loadReadIds() {
    try {
      const data = await chrome.storage.local.get(NOTICE_READ_KEY)
      readIds.value = sanitizeReadIds(data[NOTICE_READ_KEY])
    } catch (e) {
      console.warn('[notice] 加载已读记录失败', e)
      readIds.value = []
    }
  }

  async function saveReadIds() {
    try {
      await chrome.storage.local.set({ [NOTICE_READ_KEY]: toPure(readIds.value) })
    } catch (e) {
      console.warn('[notice] 保存已读记录失败', e)
    }
  }

  // 读取 SW 写入的通知缓存
  async function loadNoticeCache() {
    try {
      const data = await chrome.storage.local.get(NOTICE_CACHE_KEY)
      const cache = sanitizeNoticeCache(data[NOTICE_CACHE_KEY])
      cachedNotices.value = cache ? cache.rows : []
    } catch (e) {
      console.warn('[notice] 加载通知缓存失败', e)
      cachedNotices.value = []
    }
  }

  /**
   * 标记当前展示的通知为已读（永久不再展示）
   * markAllRead 语义=「知道了」：展示列表里所有可见通知一次性标记已读并从展示列表剔除
   * readIds 永久保留；超 1000 条清最早的
   */
  async function markAllRead() {
    const ids = notices.value.map(n => n.id)
    const newRead = ids.filter(id => !readIds.value.includes(id))
    if (newRead.length === 0) return
    readIds.value = [...readIds.value, ...newRead]
    // 上限保护：超过 READ_IDS_MAX 清最早的（保留最近的）
    if (readIds.value.length > READ_IDS_MAX) {
      readIds.value = readIds.value.slice(readIds.value.length - READ_IDS_MAX)
    }
    await saveReadIds()
    console.log(`[notice] 标记 ${newRead.length} 条为已读（永久不再展示），readIds 共 ${readIds.value.length} 条`)
  }

  /**
   * 标记单条通知为已读（永久不再展示）
   * 「不再显示」按钮用：只标当前这条，不影响其它未读。
   * readIds 永久保留；超 1000 条清最早的（与 markAllRead 同上限保护）。
   */
  async function markRead(id: number) {
    if (readIds.value.includes(id)) return
    readIds.value = [...readIds.value, id]
    if (readIds.value.length > READ_IDS_MAX) {
      readIds.value = readIds.value.slice(readIds.value.length - READ_IDS_MAX)
    }
    await saveReadIds()
    console.log(`[notice] 标记单条 id=${id} 为已读（永久不再展示），readIds 共 ${readIds.value.length} 条`)
  }

  // 监听 SW 通知缓存更新通知 -> 重读缓存
  // 单例 composable，监听器在初始化时注册一次（不在 onMounted/onUnmounted，避免永久丢失）
  chrome.runtime.onMessage.addListener((msg: unknown) => {
    if (msg && typeof msg === 'object' && !Array.isArray(msg)
      && (msg as Record<string, unknown>).type === 'noticeCacheUpdated') {
      loadNoticeCache()
    }
  })

  // 初始化：加载已读记录 + 通知缓存
  Promise.all([loadReadIds(), loadNoticeCache()])

  return {
    notices,
    unreadCount,
    hasNotice,
    markAllRead,
    markRead
  }
}

export function useNotice() {
  if (!_instance) {
    _instance = useNoticeImpl()
  }
  return _instance
}

// 向后兼容：NoticeItem 类型导出（NoticeBar.vue 引用）
export type { NoticeItem } from '~types/notice'
