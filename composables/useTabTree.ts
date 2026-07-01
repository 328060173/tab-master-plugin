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
 *
 * 深度限制：最多 5 层（根为第 1 层）。超过 5 层的节点强制降级到第 5 层，
 * 作为第 5 层节点的兄弟节点按顺序追加（不丢弃、不无限嵌套）。
 */
export const MAX_TREE_DEPTH = 5

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
  // 深度裁剪：超过 MAX_TREE_DEPTH 层的节点提升到第 MAX_TREE_DEPTH 层（作为该层节点的兄弟）
  clampDepth(roots, MAX_TREE_DEPTH)
  return roots
}

/**
 * 深度裁剪：递归遍历，当节点处于第 maxDepth 层（depth === maxDepth - 1，0-indexed）时，
 * 把它的 children 提升为它在同一层的兄弟（追加到父的 children 末尾），并清空自己的 children。
 * 这样超过 maxDepth 的节点全部并到第 maxDepth 层，按原遍历顺序排列。
 */
function clampDepth(nodes: TreeNode[], maxDepth: number, depth: number = 0, parentChildren: TreeNode[] | null = null): void {
  // depth 是当前 nodes 所在层（0-indexed）。第 maxDepth 层即 depth === maxDepth - 1。
  // 该层的节点其 children 不应再嵌套 → 提升为兄弟。
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (depth >= maxDepth - 1) {
      // 当前层已是允许的最深层，children 全部提升为兄弟（追加到本组末尾，按顺序）
      if (node.children.length) {
        const lifted = node.children
        node.children = []
        // 收集要追加的节点（递归展平，避免提升上来的子节点还带深层 children）
        const flat: TreeNode[] = []
        const flatten = (list: TreeNode[]) => {
          for (const n of list) {
            const copy: TreeNode = { item: n.item, children: [] }
            flat.push(copy)
            if (n.children.length) flatten(n.children)
          }
        }
        flatten(lifted)
        // 追加到当前 nodes 末尾（作为第 maxDepth 层的兄弟），继续处理
        nodes.push(...flat)
      }
    } else {
      // 还没到最深层，正常递归
      clampDepth(node.children, maxDepth, depth + 1, node.children)
    }
  }
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
