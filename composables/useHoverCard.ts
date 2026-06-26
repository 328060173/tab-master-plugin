import { ref, onUnmounted } from "vue"

const CARD_W = 256   // w-64
const CARD_H = 230   // 近似高度，用于底部溢出判断
const GAP = 6

export function useHoverCard() {
  const hovered = ref(false)
  const cardPos = ref({ x: 0, y: 0, flipX: false })
  let leaveTimer: ReturnType<typeof setTimeout> | null = null

  const clearLeave = () => { if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null } }
  const startLeave = () => { leaveTimer = setTimeout(() => { hovered.value = false }, 200) }

  const closeCard = () => { hovered.value = false }

  // 点击三点按钮触发，再次点击关闭；打开时注册外部点击关闭
  const toggle = (e: MouseEvent) => {
    e.stopPropagation()
    if (hovered.value) { hovered.value = false; return }
    clearLeave()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const flipX = rect.right + CARD_W > window.innerWidth
    cardPos.value = {
      x: flipX ? rect.right - CARD_W : rect.left,
      y: Math.min(rect.bottom + GAP, window.innerHeight - CARD_H - 4),
      flipX
    }
    hovered.value = true
    setTimeout(() => document.addEventListener('click', closeCard, { once: true }), 0)
  }

  onUnmounted(() => document.removeEventListener('click', closeCard))

  return { hovered, cardPos, toggle, clearLeave, startLeave }
}
