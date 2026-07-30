/**
 * SW 内存标签镜像（2026-07-30 立，需求文档 docs/req/auto-listen-backup.md）。
 *
 * 背景：
 *   「自动监听备份」活档持续落盘需要一份当前标签的内存真值，避免每次事件都
 *   chrome.tabs.query({})（频繁 query 有性能开销）。SW 内存常驻一份
 *   Map<tabId, TabMeta>，实时跟随 tabs 事件同步；活档写入时直接从镜像采集，
 *   镜像未就绪兜底 query。
 *
 * 生命周期（MV3 SW 30s 寿命）：
 *   - SW 启动时 initTabMirror() 全量灌入（chrome.tabs.query({})）+ 注册 6 事件监听
 *   - SW 被回收后重启，initTabMirror 重新跑（监听器随 SW 销毁需重注册）
 *   - 镜像未灌满时 mirrorReady=false，getMirrorTabs 返回 null，调用方兜底 query
 *
 * 字段：覆盖 buildSnapshot + filterBackupableTabs 实际读取的全部字段，不存冗余。
 *
 * 守红线：
 *   - 纯内存 Map，不写 storage（SW 重启重建，无需持久化）
 *   - getMirrorTabs 返回深拷贝，防外部篡改镜像真值
 *   - 监听器只注册一次（initTabMirror 内幂等标志）
 */

/**
 * 镜像里每个标签的最小字段集（覆盖 buildSnapshot 读取 + 未来导出/恢复可能用的字段）。
 * 类型对齐 chrome.tabs.Tab 的子集（其余字段在 Tab 上为 optional，可缺省）。
 */
export interface TabMeta {
  id: number
  url: string
  title: string
  favIconUrl?: string
  windowId: number
  groupId?: number
  index: number
  openerTabId?: number
  pinned: boolean
  lastAccessed?: number
  audible?: boolean
  mutedInfo?: chrome.tabs.MutedInfo
  incognito: boolean
  active: boolean
  status?: string
}

/** 模块级镜像真值（SW 上下文单例，SW 销毁后随上下文消失） */
const mirror = new Map<number, TabMeta>()
/** 是否已灌满 + 监听器已注册（幂等防重复注册） */
let mirrorReady = false
let listenersBound = false

/** 把 chrome.tabs.Tab 投影成 TabMeta（只取备份需要的字段，省内存） */
function projectTab(t: chrome.tabs.Tab): TabMeta {
  const m: TabMeta = {
    id: typeof t.id === 'number' ? t.id : -1,
    url: t.url || '',
    title: t.title || '',
    windowId: t.windowId,
    index: t.index ?? 0,
    pinned: !!t.pinned,
    incognito: !!t.incognito,
    active: !!t.active,
  }
  if (typeof t.favIconUrl === 'string') m.favIconUrl = t.favIconUrl
  if (typeof t.groupId === 'number') m.groupId = t.groupId
  if (typeof t.openerTabId === 'number') m.openerTabId = t.openerTabId
  if (typeof t.lastAccessed === 'number') m.lastAccessed = t.lastAccessed
  if (typeof t.audible === 'boolean') m.audible = t.audible
  if (t.mutedInfo) m.mutedInfo = t.mutedInfo
  if (typeof t.status === 'string') m.status = t.status
  return m
}

/** 合并 onUpdated 的变更字段（changeInfo 只含发生变化的字段） */
function mergeChange(meta: TabMeta, change: chrome.tabs.TabChangeInfo): TabMeta {
  const next = { ...meta }
  if (typeof change.url === 'string') next.url = change.url
  if (typeof change.title === 'string') next.title = change.title
  if (typeof change.favIconUrl === 'string') next.favIconUrl = change.favIconUrl
  if (typeof change.index === 'number') next.index = change.index
  if (typeof change.pinned === 'boolean') next.pinned = change.pinned
  if (typeof change.audible === 'boolean') next.audible = change.audible
  if (typeof change.status === 'string') next.status = change.status
  if (change.mutedInfo) next.mutedInfo = change.mutedInfo
  if (typeof change.groupId === 'number') next.groupId = change.groupId
  return next
}

/**
 * SW 启动时全量灌入镜像 + 注册 tabs 事件监听。
 * 幂等：重复调用只灌入一次（mirrorReady 标志），监听器只绑一次（listenersBound）。
 *
 * 监听 6 事件：
 *   - onCreated：追加新标签
 *   - onUpdated：合并变更字段（url/title/pinned/index/groupId/mutedInfo/...）
 *   - onRemoved：从镜像删除（标签真的没了）
 *   - onAttached：跨窗口附着 → 更新 windowId
 *   - onDetached：从窗口分离 → 更新 windowId（暂存，等待 onAttached 配对）
 *   - onMoved：窗口内移动 → 更新 index
 *
 * 2026-07-30 重构：旧「关闭浏览器备份」方案（依赖 isWindowClosing 不立即删镜像、
 *   由 consumeWindowCloseMirror 统一清理）虚假已废弃。新方案「自动监听备份」平时
 *   事件驱动持续落盘（见 liveSnapshot.ts），不依赖关浏览器事件。onRemoved 恢复成
 *   简单 mirror.delete（标签关了就从镜像移除），保持镜像与 chrome.tabs 实际一致。
 */
export async function initTabMirror(): Promise<void> {
  // 监听器只绑一次（SW 启动可能多次调 initTabMirror，但监听器随 SW 销毁需重绑；
  // 实际 SW 重启后 listenersBound 重置为 false，所以每次 SW 启动都会重绑一次）
  if (!listenersBound) {
    bindTabListeners()
    listenersBound = true
  }
  // 全量灌入（每次 SW 启动都跑一次，防镜像不全）
  try {
    const all = await chrome.tabs.query({})
    mirror.clear()
    for (const t of all) {
      if (typeof t.id !== 'number') continue
      mirror.set(t.id, projectTab(t))
    }
    mirrorReady = true
  } catch (e) {
    console.warn('[tabMirror] 全量灌入失败', e)
    mirrorReady = false
  }
}

/** 注册 tabs 事件监听（只调一次，由 initTabMirror 触发） */
function bindTabListeners(): void {
  chrome.tabs.onCreated.addListener((tab) => {
    if (typeof tab.id !== 'number') return
    mirror.set(tab.id, projectTab(tab))
  })
  chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    const cur = mirror.get(tabId)
    if (!cur) {
      // 镜像里没有（可能 SW 刚重启镜像未灌满），用完整 tab 投影补入
      if (tab && typeof tab.id === 'number') mirror.set(tabId, projectTab(tab))
      return
    }
    mirror.set(tabId, mergeChange(cur, change))
  })
  chrome.tabs.onRemoved.addListener((tabId) => {
    // 标签真被关闭时从镜像删除。新方案不依赖关浏览器事件，无需 isWindowClosing 特殊处理。
    mirror.delete(tabId)
  })
  chrome.tabs.onAttached.addListener((tabId, attachInfo) => {
    const cur = mirror.get(tabId)
    if (!cur) return
    mirror.set(tabId, { ...cur, windowId: attachInfo.newWindowId, index: attachInfo.newPosition })
  })
  chrome.tabs.onDetached.addListener((tabId, detachInfo) => {
    // 分离后暂时还在镜像里（窗口Id 旧值），等 onAttached 配对更新；
    // 此处更新 index/windowId 为分离时的旧值，保持一致
    const cur = mirror.get(tabId)
    if (!cur) return
    mirror.set(tabId, { ...cur, windowId: detachInfo.oldWindowId, index: detachInfo.oldPosition })
  })
  chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
    const cur = mirror.get(tabId)
    if (!cur) return
    mirror.set(tabId, { ...cur, windowId: moveInfo.windowId, index: moveInfo.toIndex })
  })
}

/**
 * 返回镜像快照（深拷贝，防外部篡改真值）。
 * 镜像未灌满时返回 null，调用方兜底 chrome.tabs.query。
 *
 * 用途：「自动监听备份」活档写入时从镜像采集（不必每次 query，性能优），
 * 镜像空时调用方兜底 chrome.tabs.query({})。
 *
 * @returns chrome.tabs.Tab[] 兼容结构（字段是 Tab 的子集，其余 optional 字段缺省）
 *          或 null（镜像未就绪，调用方应兜底 query）
 */
export function getMirrorTabs(): chrome.tabs.Tab[] | null {
  if (!mirrorReady || mirror.size === 0) return null
  // 深拷贝：TabMeta 是纯数据，structuredClone 优先，降级 JSON
  const out: chrome.tabs.Tab[] = []
  for (const meta of mirror.values()) {
    out.push(metaToTab(meta))
  }
  return out
}

/** TabMeta → chrome.tabs.Tab 兼容结构（补齐 buildSnapshot 读取的 optional 字段默认值） */
function metaToTab(m: TabMeta): chrome.tabs.Tab {
  const t: chrome.tabs.Tab = {
    id: m.id,
    url: m.url,
    title: m.title,
    windowId: m.windowId,
    index: m.index,
    pinned: m.pinned,
    incognito: m.incognito,
    active: m.active,
  }
  if (m.favIconUrl !== undefined) t.favIconUrl = m.favIconUrl
  if (m.groupId !== undefined) t.groupId = m.groupId
  if (m.openerTabId !== undefined) t.openerTabId = m.openerTabId
  if (m.lastAccessed !== undefined) {
    // @types/chrome 0.0.258 未声明 lastAccessed，按项目既有模式 as 兜底（snapshotBuilder 同款）
    ;(t as unknown as { lastAccessed?: number }).lastAccessed = m.lastAccessed
  }
  if (m.audible !== undefined) t.audible = m.audible
  if (m.mutedInfo !== undefined) t.mutedInfo = m.mutedInfo
  if (m.status !== undefined) t.status = m.status
  return t
}

/** 仅供测试/诊断用：返回镜像当前标签数 */
export function getMirrorSize(): number {
  return mirror.size
}

/** 仅供测试/诊断用：镜像是否已就绪 */
export function isMirrorReady(): boolean {
  return mirrorReady
}
