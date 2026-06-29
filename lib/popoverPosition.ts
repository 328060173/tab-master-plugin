/**
 * Popover 定位工具：fixed + 按钮 rect 计算。
 *
 * 为什么用 fixed：
 * - 彻底绕开父级 overflow-hidden / stacking context / transform 等任何裁切/层级干扰
 * - 视窗坐标定位，配合 Teleport 到 body 后独立成层
 * - 在窄 sidepanel 下能 clamp 到视窗内防止越界
 *
 * 用法：
 *   const rect = popover.activeAnchorRect.value
 *   const pos = rect ? computePopoverPos(rect, { width: 224 }, 'bottom-left') : { left: 0, top: 0 }
 *   <div :style="{ left: pos.left + 'px', top: pos.top + 'px' }" class="fixed z-[60] w-56 ...">
 */

export type PopoverAnchor = "bottom-left" | "bottom-right" | "top-left" | "top-right"

export interface PopoverSize {
  width: number
  /** 可选；提供后能在弹层超出下边界时自动翻转到 trigger 上方 */
  height?: number
}

const VIEWPORT_PADDING = 4

export const computePopoverPos = (
  rect: DOMRect,
  size: PopoverSize,
  anchor: PopoverAnchor = "bottom-left",
  gap = 4
): { left: number; top: number } => {
  const VW = window.innerWidth
  const VH = window.innerHeight

  let left = 0
  let top = 0

  switch (anchor) {
    case "bottom-left":
      left = rect.left
      top = rect.bottom + gap
      break
    case "bottom-right":
      left = rect.right - size.width
      top = rect.bottom + gap
      break
    case "top-left":
      left = rect.left
      top = rect.top - (size.height ?? 0) - gap
      break
    case "top-right":
      left = rect.right - size.width
      top = rect.top - (size.height ?? 0) - gap
      break
  }

  // 横向 clamp：右侧越界往左推，左侧越界顶到 padding
  if (left + size.width > VW - VIEWPORT_PADDING) left = VW - size.width - VIEWPORT_PADDING
  if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING

  // 纵向：智能翻转 —— 如果 anchor 默认方向上空间不够，自动翻到另一侧
  // 这避免「button 在视窗顶端，popup 向上弹出但被裁切到 top:4 处」这种视觉脱节
  if (size.height) {
    if (anchor.startsWith("bottom") && top + size.height > VH - VIEWPORT_PADDING) {
      // 默认在下方，但放不下 → 翻到上方
      const flipped = rect.top - size.height - gap
      if (flipped >= VIEWPORT_PADDING) top = flipped
    } else if (anchor.startsWith("top") && top < VIEWPORT_PADDING) {
      // 默认在上方，但放不下 → 翻到下方
      const flipped = rect.bottom + gap
      if (flipped + size.height <= VH - VIEWPORT_PADDING) top = flipped
    }
  }
  // 最后兜底 clamp（极小屏幕：上下都放不下时顶住 padding）
  if (top < VIEWPORT_PADDING) top = VIEWPORT_PADDING
  if (size.height && top + size.height > VH - VIEWPORT_PADDING) top = VH - size.height - VIEWPORT_PADDING

  return { left, top }
}
