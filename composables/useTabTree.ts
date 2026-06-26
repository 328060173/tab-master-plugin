import { computed } from "vue"
import type { Ref } from "vue"
import type { TabItem } from "~types/tab"

export interface TreeNode { item: TabItem; children: TreeNode[] }

/**
 * 构建标签树。
 *
 * parentMap：标签 id → 父标签 id 的映射，唯一数据源。
 * 由 background.ts 持续维护（chrome.tabs.onCreated.openerTabId 链路），
 * sidepanel 拖拽时通过 updateTreeParent 修改。
 *
 * 防御性循环检测：即使外部数据出现环（脏数据 / 旧版本兼容），也不会死循环。
 */
export function buildTree(tabs: TabItem[], parentMap: Record<string, number> = {}): TreeNode[] {
  const map = new Map<number, TreeNode>()
  for (const t of tabs) map.set(t.id, { item: t, children: [] })

  const roots: TreeNode[] = []
  for (const t of tabs) {
    const node = map.get(t.id)!
    const parentId = resolveParent(t.id, parentMap, map)
    if (parentId !== null && map.has(parentId)) {
      map.get(parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

/**
 * 解析有效父节点：
 * - parent 不存在于当前 tabs（已关闭） → 顶层
 * - 检测到环（A→B→A） → 顶层（防御性）
 * 返回 null 表示作为根节点。
 */
function resolveParent(
  tabId: number,
  parentMap: Record<string, number>,
  validTabs: Map<number, unknown>
): number | null {
  const direct = parentMap[String(tabId)]
  if (direct === undefined) return null
  if (!validTabs.has(direct)) return null
  // 沿父链上溯检测环
  const seen = new Set<number>([tabId])
  let cur: number | undefined = direct
  while (cur !== undefined) {
    if (seen.has(cur)) return null // 有环，本节点降为根
    seen.add(cur)
    cur = parentMap[String(cur)]
  }
  return direct
}

export function useTabTree(tabs: Ref<TabItem[]>, parentMap: Ref<Record<string, number>>) {
  return computed(() => buildTree(tabs.value, parentMap.value))
}
