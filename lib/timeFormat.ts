// 格式化打开时间：当日显示时分，跨日显示 N 天前
export function formatOpenedAt(t: string): string {
  if (!t) return ''
  const d = new Date(t)
  if (isNaN(d.getTime())) {
    // 兼容旧 HH:mm 格式，直接返回
    return t
  }
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) {
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }
  return `${diffDays}天前`
}
