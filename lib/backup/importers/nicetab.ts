/**
 * NiceTab 导入器 - PRD §5.5.4 字段映射表
 *
 * NiceTab 格式：JSON 三级层级 tagList[].groupList[].tabList[]
 * - tagList[].tagName → meta.customTags + tabTagsMap
 * - groupList[].groupName → tabGroups.title（无颜色/折叠信息，给默认值）
 * - tabList[].description → laterTabs.note（若有）或丢弃
 * - tabList[].url/title → tab
 *
 * 可失败但要提示：解析失败/字段缺失明确告知。
 */

import { computeFingerprint, computeWeakFingerprint, normalizeUrl, uuidV4 } from "~lib/backup/fingerprint"
import type { BackupFile, ImportResult } from "~types/backup"
import { t, tWithParams } from "~lib/i18n"

interface NiceTabRaw {
  tagList?: Array<{
    tagName?: string
    groupList?: Array<{
      groupName?: string
      tabList?: Array<{
        url?: string
        title?: string
        description?: string
      }>
    }>
  }>
  // 部分版本可能是顶层数组
}

export function parseNiceTab(text: string): Promise<ImportResult> {
  return (async () => {
    const warnings: string[] = []
    let raw: unknown
    try {
      raw = JSON.parse(text)
    } catch (e) {
      return { ok: false, file: null, error: tWithParams("backup.lib.jsonParseFailed", { error: e instanceof Error ? e.message : String(e) }), warnings, skipped: 0, format: "nicetab" }
    }
    // 兼容顶层数组
    const root: NiceTabRaw = Array.isArray(raw) ? { tagList: raw as never } : (raw && typeof raw === "object" ? (raw as NiceTabRaw) : {})
    const tagList = Array.isArray(root.tagList) ? root.tagList : []
    if (!tagList.length) {
      return { ok: false, file: null, error: t("backup.lib.nicetabNoTagList"), warnings, skipped: 0, format: "nicetab" }
    }
    const customTags: string[] = []
    const tabTagsMap: Record<string, string[]> = {}
    const tabGroups: BackupFile["snapshot"]["meta"]["tabGroups"] = []
    const tabs: BackupFile["snapshot"]["windows"][number]["tabs"] = []
    let skipped = 0
    let groupIdx = 0
    for (const tag of tagList) {
      const tagName = typeof tag.tagName === "string" && tag.tagName ? tag.tagName : null
      if (tagName && !customTags.includes(tagName)) customTags.push(tagName)
      const groups = Array.isArray(tag.groupList) ? tag.groupList : []
      for (const g of groups) {
        const groupName = typeof g.groupName === "string" ? g.groupName : ""
        const groupFingerprints: string[] = []
        const tabList = Array.isArray(g.tabList) ? g.tabList : []
        if (!tabList.length) {
          warnings.push(tWithParams('backup.lib.nicetabGroupMissingTabList', { name: groupName || t('backup.lib.unnamedGroup') }))
        }
        for (const t of tabList) {
          const url = typeof t.url === "string" ? t.url : ""
          if (!url) { skipped++; continue }
          try {
            // eslint-disable-next-line no-new
            new URL(url)
          } catch {
            skipped++
            warnings.push(tWithParams('backup.lib.invalidUrlSkipped', { url: url.slice(0, 60) }))
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
            pinned: false,
            muted: false,
            groupId: groupIdx,
            groupTitle: groupName || null,
            groupColor: "gray",
            openerTabFingerprint: null,
            lastAccessed: null,
            openedAt: null,
          })
          groupFingerprints.push(fp)
          if (tagName) {
            tabTagsMap[fp] = [tagName]
          }
        }
        if (groupFingerprints.length) {
          tabGroups.push({
            title: groupName,
            color: "gray",
            collapsed: false,
            tabFingerprints: groupFingerprints,
          })
          groupIdx++
        }
      }
    }
    if (!tabs.length) {
      return { ok: false, file: null, error: t("backup.lib.nicetabNoTabs"), warnings, skipped, format: "nicetab" }
    }
    const now = Date.now()
    const file: BackupFile = {
      schemaVersion: 1,
      appVersionCode: 1,
      appVersionName: "imported-nicetab",
      kind: "tabmaster.backup.v1",
      deviceId: uuidV4(),
      customer: { id: null, type: "anonymous" },
      snapshot: {
        id: uuidV4(),
        createdAt: now,
        createdAtISO: new Date(now).toISOString(),
        source: "import",
        trigger: "import",
        label: t("backup.lib.nicetabLabel"),
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
    return { ok: true, file, error: null, warnings, skipped, format: "nicetab" }
  })()
}
