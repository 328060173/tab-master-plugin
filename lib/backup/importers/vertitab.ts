/**
 * VertiTab 导入器 - PRD §5.5.4 字段映射表
 *
 * VertiTab 格式：JSON { windows: [{ left/top/width/height, tabGroups: [{title,color,collapsed}], tabs: [{url,title,pinned,lastAccessed,openerTabId}] }] }
 * - windows[].tabGroups → tabGroups（带 color/collapsed）
 * - tabs[].pinned/lastAccessed → tab 对应字段
 * - windows[].left/top/width/height → 丢弃（隐私+体积）
 */

import { computeFingerprint, computeWeakFingerprint, normalizeUrl, uuidV4 } from "~lib/backup/fingerprint"
import type { BackupFile, ImportResult } from "~types/backup"

interface VertiTabRaw {
  snapshotId?: string
  windows?: Array<{
    left?: number
    top?: number
    width?: number
    height?: number
    tabGroups?: Array<{
      title?: string
      color?: string
      collapsed?: boolean
    }>
    tabs?: Array<{
      url?: string
      title?: string
      pinned?: boolean
      lastAccessed?: number
      openerTabId?: number
      groupId?: number
    }>
  }>
}

export function parseVertiTab(text: string): Promise<ImportResult> {
  return (async () => {
    const warnings: string[] = []
    let raw: unknown
    try {
      raw = JSON.parse(text)
    } catch (e) {
      return { ok: false, file: null, error: `JSON 解析失败：${e instanceof Error ? e.message : String(e)}`, warnings, skipped: 0, format: "vertitab" }
    }
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return { ok: false, file: null, error: "VertiTab 格式错误：顶层不是对象", warnings, skipped: 0, format: "vertitab" }
    }
    const root = raw as VertiTabRaw
    const windowsRaw = Array.isArray(root.windows) ? root.windows : []
    if (!windowsRaw.length) {
      return { ok: false, file: null, error: "VertiTab 格式错误：未找到 windows 或为空", warnings, skipped: 0, format: "vertitab" }
    }
    const windows: BackupFile["snapshot"]["windows"] = []
    let skipped = 0
    for (let wi = 0; wi < windowsRaw.length; wi++) {
      const w = windowsRaw[wi]
      // 窗口位置/大小丢弃
      const tabsRaw = Array.isArray(w.tabs) ? w.tabs : []
      const tabs: BackupFile["snapshot"]["windows"][number]["tabs"] = []
      for (const t of tabsRaw) {
        const url = typeof t.url === "string" ? t.url : ""
        if (!url) { skipped++; continue }
        try {
          // eslint-disable-next-line no-new
          new URL(url)
        } catch {
          skipped++
          warnings.push(`无效 URL 已跳过：${url.slice(0, 60)}`)
          continue
        }
        const title = typeof t.title === "string" ? t.title : ""
        const fp = await computeFingerprint(url, title)
        const weakFp = await computeWeakFingerprint(url)
        tabs.push({
          index: tabs.length,
          url,
          urlNormalized: normalizeUrl(url),
          title,
          fingerprint: fp,
          fingerprintWeak: weakFp,
          pinned: t.pinned === true,
          muted: false,
          groupId: typeof t.groupId === "number" ? t.groupId : -1,
          groupTitle: null,
          groupColor: null,
          openerTabFingerprint: null,
          lastAccessed: typeof t.lastAccessed === "number" ? t.lastAccessed : null,
          openedAt: null,
        })
      }
      windows.push({
        windowId: -1,
        relativeIndex: wi,
        focused: false,
        state: "normal",
        incognito: false,
        tabs,
      })
    }
    const totalTabs = windows.reduce((n, w) => n + w.tabs.length, 0)
    if (!totalTabs) {
      return { ok: false, file: null, error: "VertiTab 解析后无有效标签", warnings, skipped, format: "vertitab" }
    }
    const tabGroups: BackupFile["snapshot"]["meta"]["tabGroups"] = []
    for (const w of windowsRaw) {
      const groups = Array.isArray(w.tabGroups) ? w.tabGroups : []
      for (const g of groups) {
        tabGroups.push({
          title: typeof g.title === "string" ? g.title : "",
          color: typeof g.color === "string" ? g.color : "gray",
          collapsed: g.collapsed === true,
          tabFingerprints: [],
        })
      }
    }
    const now = Date.now()
    const file: BackupFile = {
      schemaVersion: 1,
      appVersionCode: 1,
      appVersionName: "imported-vertitab",
      kind: "tabmaster.backup.v1",
      deviceId: uuidV4(),
      customer: { id: null, type: "anonymous" },
      snapshot: {
        id: uuidV4(),
        createdAt: now,
        createdAtISO: new Date(now).toISOString(),
        source: "import",
        trigger: "import",
        locked: false,
        lockedReason: null,
        label: "VertiTab 导入",
        windows,
        meta: { customTags: [], tabTagsMap: {}, tabGroups, laterTabs: [], recentlyClosed: [], settings: null },
        stats: {
          tabCount: totalTabs,
          windowCount: windows.length,
          pinnedCount: windows.reduce((n, w) => n + w.tabs.filter((t) => t.pinned).length, 0),
          groupCount: tabGroups.length,
          taggedCount: 0,
          laterCount: 0,
        },
      },
      signature: { algo: null, value: null },
    }
    return { ok: true, file, error: null, warnings, skipped, format: "vertitab" }
  })()
}
