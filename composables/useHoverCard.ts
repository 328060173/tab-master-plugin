import { ref } from "vue"

export function useHoverCard() {
  const hovered = ref(false)
  const cardPos = ref({ x: 0, y: 0 })
  let leaveTimer: ReturnType<typeof setTimeout> | null = null

  const clearLeave = () => { if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null } }
  const startLeave = () => { leaveTimer = setTimeout(() => { hovered.value = false }, 150) }

  const onEnter = (e: MouseEvent) => {
    clearLeave()
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    // 定位到右侧，与标签同一高度，不遮挡上下相邻标签
    cardPos.value = {
      x: Math.max(4, window.innerWidth - 268),
      y: Math.max(4, Math.min(r.top, window.innerHeight - 320)),
    }
    hovered.value = true
  }
  const onLeave = () => startLeave()
  return { hovered, cardPos, onEnter, onLeave, clearLeave, startLeave }
}
