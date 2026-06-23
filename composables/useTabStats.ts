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
      muted: t.filter(x => x.muted).length,
      pinned: t.filter(x => x.pinned).length,
      frozen: t.filter(x => x.frozen).length,
      discarded: t.filter(x => x.discarded).length,
      loading: t.filter(x => x.loading).length,
      recording: t.filter(x => x.recording).length,
      sharing: t.filter(x => x.sharing).length,
      attention: t.filter(x => x.attention).length,
      hasUnsavedForm: t.filter(x => x.hasUnsavedForm).length,
      hasConnectedDevice: t.filter(x => x.hasConnectedDevice).length,
      isProtected: t.filter(x => x.isProtected).length,
    }
    return STATUS_CONFIG.map(s => ({ ...s, value: counts[s.key] ?? 0 }))
  })
}
