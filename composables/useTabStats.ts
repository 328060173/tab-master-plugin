import { computed } from "vue"
import type { TabItem } from "~types/tab"
import { STATUS_CONFIG } from "~lib/statusConfig"

export function useTabStats(tabs: { value: TabItem[] }) {
  return computed(() => {
    const t = tabs.value
    const counts: Record<string, number> = {
      all: t.length,
      active: t.filter(x => x.active).length,
      playing: t.filter(x => x.audible).length,
      pinned: t.filter(x => x.pinned).length,
      discarded: t.filter(x => x.discarded).length,
      loading: t.filter(x => !x.discarded && !x.active).length,
    }
    return STATUS_CONFIG.map(s => ({ ...s, value: counts[s.key] ?? 0 }))
  })
}
