import { computed } from "vue"
import type { Ref } from "vue"
import type { TabItem } from "~types/tab"

export interface TreeNode { item: TabItem; children: TreeNode[] }

export function buildTree(tabs: TabItem[], parentMap: Record<string, number> = {}): TreeNode[] {
  const map = new Map<number, TreeNode>()
  for (const t of tabs) map.set(t.id, { item: t, children: [] })
  const roots: TreeNode[] = []
  for (const t of tabs) {
    const node = map.get(t.id)!
    const parentId = parentMap[String(t.id)]  // 仅用自定义 map，不再 fallback openerTabId
    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

export function useTabTree(tabs: Ref<TabItem[]>, parentMap: Ref<Record<string, number>>) {
  return computed(() => buildTree(tabs.value, parentMap.value))
}
