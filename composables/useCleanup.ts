import type { TabItem } from "~types/tab"
import { parseTime, getEffectiveAccessTime } from "~lib/sortUtils"
import { t, tWithParams } from "~lib/i18n"

/**
 * 清理菜单业务逻辑：重复检测、长期未用检测、阈值常量。
 *
 * 设计取舍：
 * - 纯函数实现，不持有响应式状态——sidepanel 调用拿结果，弹窗里独立维护勾选
 * - lastAccessed 兜底两层：原生 chrome.tabs.Tab.lastAccessed（121+）→ SW 采集 → openedAt 最差兜底
 *   读取 SW 采集结果由 useTabManager 在 mapTab() 里完成，本文件只消费 TabItem.lastAccessed
 * - 重复判定第一版只做 URL 完全相同（用户已确认，见 PRD §1）
 *
 * 调用方：sidepanel.vue 的 @detect-duplicates / @detect-unused
 */

export interface DuplicateGroup {
  /** 用作分组 key 的完整 URL */
  url: string
  /** 同 URL 的所有标签，按 lastAccessed 倒序（最新在前） */
  items: TabItem[]
}

/**
 * 阈值档位 —— 抄 Workona 的成熟档位。
 * labelKey 为 i18n key，消费侧 t(opt.labelKey) 翻译；ms 用于实际比较。
 */
export const UNUSED_THRESHOLDS = [
  { labelKey: "cleanup.threshold.days1", ms: 24 * 60 * 60 * 1000 },
  { labelKey: "cleanup.threshold.days3", ms: 3 * 24 * 60 * 60 * 1000 },
  { labelKey: "cleanup.threshold.days7", ms: 7 * 24 * 60 * 60 * 1000 },
  { labelKey: "cleanup.threshold.days30", ms: 30 * 24 * 60 * 60 * 1000 },
] as const

export type UnusedThresholdMs = typeof UNUSED_THRESHOLDS[number]["ms"]

/**
 * 检测重复标签：按 URL 完全相同分桶。
 * 排除固定标签（用户固定的就是想留着）。
 * 每组按访问时间倒序，便于 UI 层"默认保留最新一个"。
 */
export function detectDuplicates(tabs: readonly TabItem[]): DuplicateGroup[] {
  const buckets = new Map<string, TabItem[]>()
  for (const t of tabs) {
    if (t.pinned) continue
    if (!t.url) continue // 极少数受保护页 url 可能为空
    const arr = buckets.get(t.url)
    if (arr) arr.push(t)
    else buckets.set(t.url, [t])
  }
  const groups: DuplicateGroup[] = []
  buckets.forEach((items, url) => {
    if (items.length < 2) return
    const sorted = [...items].sort((a, b) => {
      const ta = getEffectiveAccessTime(a) ?? 0
      const tb = getEffectiveAccessTime(b) ?? 0
      return tb - ta // 倒序：最新在前
    })
    groups.push({ url, items: sorted })
  })
  // 重复组数多的排前面（视觉权重）
  return groups.sort((a, b) => b.items.length - a.items.length)
}

/**
 * 检测长期未使用标签：超过阈值未访问，按时长降序。
 *
 * 排除：
 * - 固定（pinned）
 * - 当前激活（active）
 * - 正在播放音频（audible，避免误关音乐/视频）
 *
 * 没有访问时间数据的标签也会列出（UI 层显示"上次访问未知"），
 * 但 UI 层默认不勾选，避免误关用户其实常用的标签。
 */
export function detectUnused(
  tabs: readonly TabItem[],
  thresholdMs: number,
  now: number = Date.now(),
): TabItem[] {
  return tabs
    .filter(t => !t.pinned && !t.active && !t.audible)
    .filter(t => {
      const last = getEffectiveAccessTime(t)
      // 没有时间数据 → 谨慎列出（让用户自己看）
      if (last === undefined) return true
      return now - last >= thresholdMs
    })
    .sort((a, b) => {
      const la = getEffectiveAccessTime(a) ?? Infinity // 没数据的排末尾
      const lb = getEffectiveAccessTime(b) ?? Infinity
      return la - lb // 越久没用排越前
    })
}

/**
 * 格式化"未访问时长"为人类可读字符串。
 * 示例：3 天 12 小时 / 5 小时 / 23 分钟
 */
export function formatUnusedDuration(ms: number): string {
  const sec = Math.floor(ms / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  if (day >= 1) {
    const remHr = hr % 24
    return remHr > 0
      ? tWithParams("cleanup.duration.dayHour", { day, hr: remHr })
      : tWithParams("cleanup.duration.day", { count: day })
  }
  if (hr >= 1) return tWithParams("cleanup.duration.hour", { count: hr })
  if (min >= 1) return tWithParams("cleanup.duration.minute", { count: min })
  return t("cleanup.duration.justNow")
}
