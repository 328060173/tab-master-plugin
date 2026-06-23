import { computed } from "vue"
import type { TabItem } from "~types/tab"

export interface TreeNode { item: TabItem; children: TreeNode[] }

export function buildTree(tabs: TabItem[]): TreeNode[] {
  const map = new Map<number, TreeNode>()
  for (const t of tabs) map.set(t.id, { item: t, children: [] })
  const roots: TreeNode[] = []
  for (const t of tabs) {
    const node = map.get(t.id)!
    if (t.openerTabId && map.has(t.openerTabId)) {
      map.get(t.openerTabId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

export function useTabTree(tabs: { value: TabItem[] }) {
  return computed(() => buildTree(tabs.value))
}
