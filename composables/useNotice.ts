/**
 * 消息通知管理 - 单例模式
 *
 * 功能：
 * - 拉取通知列表（GET /notice/page-list）
 * - 静默失败（不影响插件功能）
 * - 已读记录（按 notice id，已读的不计入未读数）
 *
 * 后端接口已 @Deprecated 但仍可用，返回 R<TableDataInfo>（rows/total）
 */

import { ref, computed } from 'vue'
import { get } from '~lib/api'
import { API_URIS } from '~lib/api-config'

const NOTICE_READ_KEY = 'tabMasterNoticeRead'

// 通知项（后端 OuuAppsNotice 字段：id/noticeLog/createTime/...）
export interface NoticeItem {
  id: number
  noticeLog: string       // 通知内容
  createTime: string
}

// TableDataInfo 响应（若依分页结构）
interface NoticeResponse {
  code: number
  msg: string
  data: {
    rows: NoticeItem[] | null
    total: number
  }
}

const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))

// 清洗已读 id 列表
function sanitizeReadIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is number => typeof x === 'number')
}

let _instance: ReturnType<typeof useNoticeImpl> | null = null

function useNoticeImpl() {
  const notices = ref<NoticeItem[]>([])
  const readIds = ref<number[]>([])
  const isFetching = ref(false)

  // 未读数 = 总数 - 已读数
  const unreadCount = computed(() => {
    return notices.value.filter(n => !readIds.value.includes(n.id)).length
  })

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

  /**
   * 拉取通知列表（静默失败）
   * 登录与否都能调（后端可选 token，customerType 头区分）
   */
  async function fetchNotices() {
    if (isFetching.value) return
    isFetching.value = true
    console.log('[notice] 开始拉取通知')

    try {
      // 5 秒超时，静默失败
      const response = await get<NoticeResponse>(API_URIS.noticePageList, {
        timeout: 5000,
        silent: true
      })
      if (response.code !== 200) {
        throw new Error(response.msg || '通知接口失败')
      }
      const rows = response.data?.rows || []
      notices.value = rows.map(r => ({
        id: r.id,
        noticeLog: r.noticeLog,
        createTime: r.createTime
      }))
      console.log(`[notice] 拉取成功，共 ${notices.value.length} 条，未读 ${unreadCount.value} 条`)
    } catch (e) {
      console.warn('[notice] 拉取失败（静默，不影响使用）', e)
      notices.value = []
    } finally {
      isFetching.value = false
    }
  }

  /**
   * 标记所有通知为已读
   */
  async function markAllRead() {
    const ids = notices.value.map(n => n.id)
    const newRead = ids.filter(id => !readIds.value.includes(id))
    if (newRead.length === 0) return
    readIds.value = [...readIds.value, ...newRead]
    await saveReadIds()
    console.log(`[notice] 标记 ${newRead.length} 条为已读`)
  }

  loadReadIds()

  return {
    notices,
    unreadCount,
    hasNotice,
    isFetching,
    fetchNotices,
    markAllRead
  }
}

export function useNotice() {
  if (!_instance) {
    _instance = useNoticeImpl()
  }
  return _instance
}
