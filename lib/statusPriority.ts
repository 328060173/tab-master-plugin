import type { TabItem } from "~types/tab"

// 状态优先级（数字越小优先级越高）
const STATUS_PRIORITY = [
  { key: 'recording', icon: '🔴', label: '录制' },
  { key: 'sharing', icon: '📡', label: '共享' },
  { key: 'audible', icon: '🔊', label: '播放' },
  { key: 'muted', icon: '🔕', label: '静音' },
  { key: 'loading', icon: '⌛', label: '加载' },
  { key: 'hasConnectedDevice', icon: '🔌', label: '设备' },
] as const

export function getHighestPriorityStatus(item: TabItem): { icon: string; label: string } | null {
  if (item.recording) return STATUS_PRIORITY[0]
  if (item.sharing) return STATUS_PRIORITY[1]
  if (item.audible && !item.muted) return STATUS_PRIORITY[2]
  if (item.muted) return STATUS_PRIORITY[3]
  if (item.loading) return STATUS_PRIORITY[4]
  if (item.hasConnectedDevice) return STATUS_PRIORITY[5]
  return null
}
