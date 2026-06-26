/**
 * Tab Master Pro - Service Worker
 *
 * 职责：
 * 1. 设置 side panel 行为
 * 2. 持续追踪 tab 父子关系（基于 chrome.tabs.onCreated.openerTabId），写入 treeParentMap
 *    —— sidepanel 可能未打开，必须在 SW 层兜底采集，否则会漏关系
 * 3. tab 关闭时级联重连父子关系（避免 sidepanel 未挂载时关系丢失）
 *
 * 兼容：Chrome 88+ / Edge 88+（参见 [[constraint-target-platforms]]）
 */

const STORAGE_KEY = "treeParentMap"

// 内存缓存，减少 storage.get 频次；SW 重启时由 onStartup/onInstalled 回填
let parentMap: Record<string, number> = {}

async function loadMap(): Promise<void> {
  try {
    const data = await chrome.storage.local.get(STORAGE_KEY)
    parentMap = data[STORAGE_KEY] || {}
  } catch {
    parentMap = {}
  }
}

async function saveMap(): Promise<void> {
  try { await chrome.storage.local.set({ [STORAGE_KEY]: parentMap }) } catch {}
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
}

// 入口绑定 ——
// 1. install / startup：加载 map 到内存
// 2. tabs 事件：持续维护
chrome.runtime.onInstalled.addListener(async () => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  await loadMap()
})

chrome.runtime.onStartup.addListener(loadMap)

chrome.tabs.onCreated.addListener(onTabCreated)
chrome.tabs.onRemoved.addListener(onTabRemoved)

// 用户在 StoragePanel 里清空数据 / 其他扩展页面写入时，同步 SW 内存，避免被旧数据覆盖
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes[STORAGE_KEY]) return
  parentMap = changes[STORAGE_KEY].newValue || {}
})

// SW 在没有任何事件的初始化路径上也需要拿到 map（如热重载后第一个事件触发前）
loadMap()
