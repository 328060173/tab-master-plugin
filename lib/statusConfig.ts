/**
 * 状态筛选配置表（i18n 化，2026-08-05 i18n-en-support §6.1）。
 *
 * 改造方式：原 `label`/`desc` 中文硬编码 → 改为 `labelKey`/`descKey` i18n key 字符串，
 * 在消费侧（useTabStats → FooterStats）通过 t() 翻译为当前 locale 文案。
 *
 * 理由：
 * - 数据表是静态对象数组，模块加载时确定，无法在定义时调用 t()（此时 locale 可能尚未 init）。
 * - FooterStats 用 `s.label.length` 估算按钮宽度，需要 label 是已翻译的字符串，故翻译延迟到 composable。
 * - useTabStats 是 computed，依赖 currentLocale.value（t() 内部读取），locale 切换时自动重算重渲染。
 */
export interface IStatusConfigEntry {
  key: string
  labelKey: string
  icon: string
  descKey: string
}

export const STATUS_CONFIG: IStatusConfigEntry[] = [
  { key: "all",                labelKey: "status.all.label",                icon: "🗂️", descKey: "status.all.desc" },
  { key: "active",             labelKey: "status.active.label",             icon: "🎯", descKey: "status.active.desc" },
  { key: "playing",            labelKey: "status.playing.label",            icon: "🔊", descKey: "status.playing.desc" },
  { key: "muted",              labelKey: "status.muted.label",              icon: "🔕", descKey: "status.muted.desc" },
  { key: "pinned",             labelKey: "status.pinned.label",             icon: "📌", descKey: "status.pinned.desc" },
  { key: "frozen",             labelKey: "status.frozen.label",             icon: "🧊", descKey: "status.frozen.desc" },
  { key: "discarded",          labelKey: "status.discarded.label",          icon: "🗑️", descKey: "status.discarded.desc" },
  { key: "loading",            labelKey: "status.loading.label",            icon: "⌛", descKey: "status.loading.desc" },
  { key: "recording",          labelKey: "status.recording.label",          icon: "🔴", descKey: "status.recording.desc" },
  { key: "sharing",            labelKey: "status.sharing.label",            icon: "📡", descKey: "status.sharing.desc" },
  { key: "attention",          labelKey: "status.attention.label",          icon: "🔔", descKey: "status.attention.desc" },
  { key: "hasUnsavedForm",     labelKey: "status.hasUnsavedForm.label",     icon: "📝", descKey: "status.hasUnsavedForm.desc" },
  { key: "hasConnectedDevice", labelKey: "status.hasConnectedDevice.label", icon: "🔌", descKey: "status.hasConnectedDevice.desc" },
  { key: "isProtected",        labelKey: "status.isProtected.label",        icon: "🔒", descKey: "status.isProtected.desc" },
]
