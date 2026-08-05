import { computed } from "vue"
import type { TabItem } from "~types/tab"
import { STATUS_CONFIG } from "~lib/statusConfig"
import { t } from "~lib/i18n"

/**
 * 状态统计（i18n 化，2026-08-05）。
 *
 * STATUS_CONFIG 现存储 labelKey/descKey（i18n key），此处 map 时通过 t() 翻译为
 * 当前 locale 文案。computed 依赖 currentLocale.value（t() 内部读取），locale 切换
 * 时自动重算，FooterStats 模板自动重渲染。
 *
 * 返回结构保持 { key, label, icon, desc, value }，对 FooterStats props 类型零变更。
 */
export function useTabStats(tabs: { value: TabItem[] }) {
  return computed(() => {
    const t_ = tabs.value
    const counts: Record<string, number> = {
      all: t_.length,
      active: t_.filter(x => x.active).length,
      playing: t_.filter(x => x.audible).length,
      muted: t_.filter(x => x.muted).length,
      pinned: t_.filter(x => x.pinned).length,
      frozen: t_.filter(x => x.frozen).length,
      discarded: t_.filter(x => x.discarded).length,
      loading: t_.filter(x => x.loading).length,
      recording: t_.filter(x => x.recording).length,
      sharing: t_.filter(x => x.sharing).length,
      attention: t_.filter(x => x.attention).length,
      hasUnsavedForm: t_.filter(x => x.hasUnsavedForm).length,
      hasConnectedDevice: t_.filter(x => x.hasConnectedDevice).length,
      isProtected: t_.filter(x => x.isProtected).length,
    }
    return STATUS_CONFIG.map(s => ({
      key: s.key,
      icon: s.icon,
      label: t(s.labelKey),
      desc: t(s.descKey),
      value: counts[s.key] ?? 0,
    }))
  })
}
