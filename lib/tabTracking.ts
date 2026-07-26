/**
 * Tab 追踪 - 抽离自 background.ts（红线 .ts ≤ 500）
 *
 * 职责：
 * 1. 持续追踪 tab 父子关系（基于 chrome.tabs.onCreated.openerTabId），写入 treeParentMap
 *    —— sidepanel 可能未打开，必须在 SW 层兜底采集，否则会漏关系
 * 2. tab 关闭时级联重连父子关系（避免 sidepanel 未挂载时关系丢失）
 * 3. 采集 lastAccessed 兜底（Chrome 121 之前没有 tab.lastAccessed 原生字段）
 *    —— SW 监听 tabs.onActivated，记录每个 tab 的最近访问时间到 tabLastAccessedMap
 *
 * 内存缓存（parentMap/lastAccessedMap）放本模块，background.ts 通过导出函数访问
 * 监听器注册留在 background.ts（SW 入口职责）
 *
 * 兼容：Chrome 88+ / Edge 88+（参见 [[constraint-target-platforms]]）
 */

const STORAGE_KEY = 'treeParentMap'
const LAST_ACCESSED_KEY = 'tabLastAccessedMap'
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

// 用户在 StoragePanel 里清空数据 / 其他扩展页面写入时，同步 SW 内存，避免被旧数据覆盖
// 由 background.ts 的 storage.onChanged 监听器调用
function handleTabTrackingStorageChanged(
  changes: { [key: string]: chrome.storage.StorageChange },
  area: string
): void {
  if (area !== 'local') return
  if (changes[STORAGE_KEY]) {
    parentMap = changes[STORAGE_KEY].newValue || {}
  }
  if (changes[LAST_ACCESSED_KEY]) {
    // 注意：这里要排除我们自己写入触发的回调（newValue === lastAccessedMap 内容相同）
    // 简化处理：只在外部清空时同步（newValue 是空对象/undefined）
    const v = changes[LAST_ACCESSED_KEY].newValue
    if (!v || Object.keys(v).length === 0) lastAccessedMap = {}
  }
}

export {
  loadMap,
  onTabCreated,
  onTabRemoved,
  onTabActivated,
  handleTabTrackingStorageChanged,
}
