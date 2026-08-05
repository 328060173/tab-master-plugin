/**
 * Toby 导入器 - PRD §5.5.4 字段映射表
 *
 * Toby 格式：JSON { lists: [{ title, cards: [{ url, title, tags?, notes? }] }] }
 * - lists[].title → tabGroups.title
 * - cards[].tags → meta.customTags + tabTagsMap
 * - cards[].notes → laterTabs.note（若有）或丢弃
 * - cards[].url/title → tab
 */

import { computeFingerprint, computeWeakFingerprint, normalizeUrl, uuidV4 } from "~lib/backup/fingerprint"
import type { BackupFile, ImportResult } from "~types/backup"
import { t, tWithParams } from "~lib/i18n"

interface TobyRaw {
  lists?: Array<{
    title?: string
    cards?: Array<{
      url?: string
      title?: string
      tags?: string[]
      notes?: string
    }>
  }>
  version?: number
}

export function parseToby(text: string): Promise<ImportResult> {
  return (async () => {
    const warnings: string[] = []
    let raw: unknown
    try {
      raw = JSON.parse(text)
    } catch (e) {
      return { ok: false, file: null, error: tWithParams("backup.lib.jsonParseFailed", { error: e instanceof Error ? e.message : String(e) }), warnings, skipped: 0, format: "toby" }
    }
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return { ok: false, file: null, error: t("backup.lib.tobyNotObject"), warnings, skipped: 0, format: "toby" }
    }
    const root = raw as TobyRaw
    const lists = Array.isArray(root.lists) ? root.lists : []
    if (!lists.length) {
      return { ok: false, file: null, error: t("backup.lib.tobyNoLists"), warnings, skipped: 0, format: "toby" }
    }
    const customTags: string[] = []
    const tabTagsMap: Record<string, string[]> = {}
    const tabGroups: BackupFile["snapshot"]["meta"]["tabGroups"] = []
    const tabs: BackupFile["snapshot"]["windows"][number]["tabs"] = []
    let skipped = 0
    let groupIdx = 0
    for (const list of lists) {
      const listTitle = typeof list.title === "string" ? list.title : ""
      const groupFingerprints: string[] = []
      const cards = Array.isArray(list.cards) ? list.cards : []
      for (const c of cards) {
        const url = typeof c.url === "string" ? c.url : ""
        if (!url) { skipped++; continue }
        try {
          // eslint-disable-next-line no-new
          new URL(url)
        } catch {
          skipped++
          warnings.push(`无效 URL 已跳过：${url.slice(0, 60)}`)
          continue
        }
        const title = typeof c.title === "string" ? c.title : ""
        const fp = await computeFingerprint(url, title)
        const weakFp = await computeWeakFingerprint(url)
        tabs.push({
          index: tabs.length,
          url,
          urlNormalized: normalizeUrl(url),
          title,
          fingerprint: fp,
          fingerprintWeak: weakFp,
          pinned: false,
          muted: false,
          groupId: groupIdx,
          groupTitle: listTitle || null,
          groupColor: "blue",
          openerTabFingerprint: null,
          lastAccessed: null,
          openedAt: null,
        })
        groupFingerprints.push(fp)
        const tags = Array.isArray(c.tags) ? c.tags.filter((t): t is string => typeof t === "string" && !!t) : []
        for (const tag of tags) {
          if (!customTags.includes(tag)) customTags.push(tag)
          tabTagsMap[fp] = [...(tabTagsMap[fp] || []), tag]
        }
      }
      if (groupFingerprints.length) {
        tabGroups.push({
          title: listTitle,
          color: "blue",
          collapsed: false,
          tabFingerprints: groupFingerprints,
        })
        groupIdx++
      }
    }
    if (!tabs.length) {
      return { ok: false, file: null, error: t("backup.lib.tobyNoTabs"), warnings, skipped, format: "toby" }
    }
    const now = Date.now()
    const file: BackupFile = {
      schemaVersion: 1,
      appVersionCode: 1,
      appVersionName: "imported-toby",
      kind: "tabmaster.backup.v1",
      deviceId: uuidV4(),
      customer: { id: null, type: "anonymous" },
      snapshot: {
        id: uuidV4(),
        createdAt: now,
        createdAtISO: new Date(now).toISOString(),
        source: "import",
        trigger: "import",
        label: "Toby 导入",
        status: 'success',
        errorMessage: null,
        windows: [{
          windowId: -1,
          relativeIndex: 0,
          focused: false,
          state: "normal",
          incognito: false,
          tabs,
        }],
        meta: { customTags, tabTagsMap, tabGroups, laterTabs: [], recentlyClosed: [], settings: null },
        stats: {
          tabCount: tabs.length,
          windowCount: 1,
          pinnedCount: 0,
          groupCount: tabGroups.length,
          taggedCount: Object.keys(tabTagsMap).length,
          laterCount: 0,
        },
      },
      signature: { algo: null, value: null },
    }
    return { ok: true, file, error: null, warnings, skipped, format: "toby" }
  })()
}
