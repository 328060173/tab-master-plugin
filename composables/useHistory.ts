import { ref, onMounted, onUnmounted } from "vue"
import type { HistoryItem } from "~types/tab"

/**
 * 完整浏览历史（chrome.history，可选权限）。
 *
 * 设计要点：
 * - 权限走 optional_permissions（manifest 声明 "history"），安装时不索取，避免吓退用户
 * - request() 必须在用户点击手势中调用，否则 Chrome 不弹授权框
 * - 监听 permissions.onAdded/onRemoved：用户在 Chrome 设置里手动撤销也能即时回退 UI
 * - 浏览历史不额外存储，实时从 chrome.history.search 查询；同 URL 去重保留最近一次 + 累计访问次数
 */

const HISTORY_PERMISSION = { permissions: ["history"] as string[] }
const DEFAULT_DAYS = 7
const DEFAULT_MAX = 100

function getDomain(url: string): string {
  try { return new URL(url).hostname } catch { return url }
}

function mapHistoryItem(h: chrome.history.HistoryItem): HistoryItem | null {
  const url = h.url || ""
  if (!url) return null
  return {
    id: h.id,
    title: h.title || url,
    url,
    domain: getDomain(url),
    // chrome.history 不返回 favicon；为兑现「绝不上传」承诺，不调用任何第三方图标服务，
    // 留空交给 FavIcon 组件用域名首字母兜底
    favIconUrl: "",
    lastVisitTime: h.lastVisitTime ?? 0,
    visitCount: h.visitCount ?? 0,
  }
}

export function useHistory() {
  const hasPermission = ref(false)
  const historyItems = ref<HistoryItem[]>([])
  const loading = ref(false)
  // 是否支持（极老内核 / 权限对象缺失时降级）
  const supported = ref(typeof chrome !== "undefined" && !!chrome.permissions)

  const checkPermission = async () => {
    if (!supported.value) { hasPermission.value = false; return false }
    try {
      hasPermission.value = await chrome.permissions.contains(HISTORY_PERMISSION)
    } catch {
      hasPermission.value = false
    }
    return hasPermission.value
  }

  // 必须由用户点击触发（手势上下文），否则 Chrome 不会弹授权框
  const requestPermission = async (): Promise<boolean> => {
    if (!supported.value) return false
    try {
      const granted = await chrome.permissions.request(HISTORY_PERMISSION)
      hasPermission.value = granted
      if (granted) await loadHistory()
      return granted
    } catch (e) {
      console.warn("[tab-master] 申请 history 权限失败：", e)
      return false
    }
  }

  const revokePermission = async (): Promise<boolean> => {
    if (!supported.value) return false
    try {
      const removed = await chrome.permissions.remove(HISTORY_PERMISSION)
      if (removed) {
        hasPermission.value = false
        historyItems.value = []
      }
      return removed
    } catch (e) {
      console.warn("[tab-master] 撤销 history 权限失败：", e)
      return false
    }
  }

  // 查询浏览历史。text 为空时按时间范围拉最近记录；同 URL 去重保留最近一次
  const loadHistory = async (text = "") => {
    if (!hasPermission.value || !chrome.history) { historyItems.value = []; return }
    loading.value = true
    try {
      const startTime = Date.now() - DEFAULT_DAYS * 24 * 60 * 60 * 1000
      const raw = await chrome.history.search({
        text,
        startTime,
        maxResults: DEFAULT_MAX,
      })
      const mapped = raw.map(mapHistoryItem).filter((x): x is HistoryItem => x !== null)
      // 按 URL 去重（search 一般已唯一，仍做一层保险），按最近访问时间倒序
      const byUrl = new Map<string, HistoryItem>()
      for (const item of mapped) {
        const exist = byUrl.get(item.url)
        if (!exist || item.lastVisitTime > exist.lastVisitTime) byUrl.set(item.url, item)
      }
      historyItems.value = [...byUrl.values()].sort((a, b) => b.lastVisitTime - a.lastVisitTime)
    } catch (e) {
      console.warn("[tab-master] 查询浏览历史失败：", e)
      historyItems.value = []
    } finally {
      loading.value = false
    }
  }

  // 从浏览器历史中真正删除某个 URL（不可恢复）
  const deleteHistoryUrl = async (url: string) => {
    if (!hasPermission.value || !chrome.history) return
    try {
      await chrome.history.deleteUrl({ url })
      historyItems.value = historyItems.value.filter(h => h.url !== url)
    } catch (e) {
      console.warn("[tab-master] 删除浏览历史失败：", e)
    }
  }

  // 用户在 Chrome 设置里手动改权限时同步 UI
  const onPermAdded = (p: chrome.permissions.Permissions) => {
    if (p.permissions?.includes("history")) { hasPermission.value = true; loadHistory() }
  }
  const onPermRemoved = (p: chrome.permissions.Permissions) => {
    if (p.permissions?.includes("history")) { hasPermission.value = false; historyItems.value = [] }
  }

  onMounted(async () => {
    if (!supported.value) return
    try {
      chrome.permissions.onAdded.addListener(onPermAdded)
      chrome.permissions.onRemoved.addListener(onPermRemoved)
    } catch {}
    await checkPermission()
    if (hasPermission.value) await loadHistory()
  })
  onUnmounted(() => {
    if (!supported.value) return
    try {
      chrome.permissions.onAdded.removeListener(onPermAdded)
      chrome.permissions.onRemoved.removeListener(onPermRemoved)
    } catch {}
  })

  return {
    hasPermission, historyItems, loading, supported,
    checkPermission, requestPermission, revokePermission, loadHistory, deleteHistoryUrl,
  }
}
