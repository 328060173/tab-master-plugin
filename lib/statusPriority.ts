import type { TabItem } from "~types/tab"

/**
 * 状态优先级（数字越小优先级越高）。
 *
 * i18n 化（2026-08-05 i18n-en-support §6.1）：
 * - `labelKey` 为 i18n key，消费侧通过 t() 翻译。
 * - 当前所有调用点（TabIconItem/TabTreeItem/TabListItem/PinnedBar/TabTileItem）
 *   仅取 `.icon`，未取 `.labelKey`，故改造对调用点零影响。
 * - 保留 labelKey 字段供未来 UI 展示用。
 */
export interface IStatusPriorityEntry {
  key: string
  icon: string
  labelKey: string
}

const STATUS_PRIORITY: IStatusPriorityEntry[] = [
  { key: 'recording',          icon: '🔴', labelKey: 'priority.recording.label' },
  { key: 'sharing',            icon: '📡', labelKey: 'priority.sharing.label' },
  { key: 'audible',            icon: '🔊', labelKey: 'priority.audible.label' },
  { key: 'muted',              icon: '🔕', labelKey: 'priority.muted.label' },
  { key: 'loading',            icon: '⌛', labelKey: 'priority.loading.label' },
  { key: 'hasConnectedDevice', icon: '🔌', labelKey: 'priority.hasConnectedDevice.label' },
]

export function getHighestPriorityStatus(item: TabItem): IStatusPriorityEntry | null {
  if (item.recording) return STATUS_PRIORITY[0]
  if (item.sharing) return STATUS_PRIORITY[1]
  if (item.audible && !item.muted) return STATUS_PRIORITY[2]
  if (item.muted) return STATUS_PRIORITY[3]
  if (item.loading) return STATUS_PRIORITY[4]
  if (item.hasConnectedDevice) return STATUS_PRIORITY[5]
  return null
}
