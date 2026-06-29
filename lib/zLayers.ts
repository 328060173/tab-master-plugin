/**
 * 全局 z-index 分层规范 —— Tailwind 任意值类直接写 `z-[60]` 等。
 *
 * 历史教训：之前各组件 z-index 在 z-10 / z-20 / z-30 / z-40 / z-50 / z-[9990] / z-[9999]
 * 七档随意混用，导致清理菜单 z-20 被某些更高层级的元素遮挡。统一后排查方便。
 *
 * 分层原则：
 * - popover（下拉、浮层）= 60       —— 主体交互层，统一在这一层
 * - hoverCard（鼠标悬浮卡片）= 70   —— 比 popover 高一点点，因为可能 hover 叠在 popover 上
 * - dialog（模态对话框）= 100       —— Confirm / Detect / CreateGroup / Later
 * - contextMenu（右键菜单）= 110    —— 比 dialog 高，因为右键菜单可能弹在 dialog 上
 * - toast（全局提示）= 200          —— 永远在最上层
 *
 * 用法：模板里直接写 Tailwind 任意值类 `z-[60]` / `z-[100]` / `z-[110]` / `z-[200]`
 * 也可 import 这里的 Z 常量做条件计算或 inline style
 */
export const Z = {
  popover: 60,
  hoverCard: 70,
  dialog: 100,
  contextMenu: 110,
  toast: 200,
} as const
