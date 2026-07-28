/**
 * OneTab 兼容格式导入器 - PRD §5.5.3 / §5.5.4
 *
 * OneTab 格式：每行 `标题 | URL` 或 `URL`（标题可省），空行分隔分组。
 * 无元数据（分组名/标记/时间），导入后作为"仅 url+title"的快照。
 *
 * 失败要提示：格式不符 / 无效 URL / 全空 → 返回 error。
 */

import { computeFingerprint, computeWeakFingerprint, normalizeUrl, uuidV4 } from "~lib/backup/fingerprint"
import type { BackupFile, ImportResult } from "~types/backup"

export function parseOneTab(text: string): Promise<ImportResult> {
  return (async () => {
    const warnings: string[] = []
    const lines = text.split(/\r?\n/)
    const windows: BackupFile["snapshot"]["windows"] = []
    let currentTabs: BackupFile["snapshot"]["windows"][number]["tabs"] = []
    let skipped = 0
    let lineIdx = 0
    for (const raw of lines) {
      lineIdx++
      const line = raw.trim()
      if (!line) {
        // 空行 = 分组边界
        if (currentTabs.length) {
          windows.push({
            windowId: -1,
            relativeIndex: windows.length,
            focused: false,
            state: "normal",
            incognito: false,
            tabs: currentTabs,
          })
          currentTabs = []
        }
        continue
      }
      // 解析 `标题 | URL` 或 `URL` 或 `标题 \t URL`
      let title = ""
      let url = ""
      const pipeIdx = line.indexOf(" | ")
      if (pipeIdx >= 0) {
        title = line.slice(0, pipeIdx).trim()
        url = line.slice(pipeIdx + 3).trim()
      } else {
        const tabIdx = line.indexOf("\t")
        if (tabIdx >= 0) {
          title = line.slice(0, tabIdx).trim()
          url = line.slice(tabIdx + 1).trim()
        } else {
          url = line
        }
      }
      // URL 校验
      try {
        // eslint-disable-next-line no-new
        new URL(url)
      } catch {
        skipped++
        warnings.push(`第 ${lineIdx} 行无效 URL 已跳过：${line.slice(0, 60)}`)
        continue
      }
      const fp = await computeFingerprint(url, title)
      const weakFp = await computeWeakFingerprint(url)
      currentTabs.push({
        index: currentTabs.length,
        url,
        urlNormalized: normalizeUrl(url),
        title,
        fingerprint: fp,
        fingerprintWeak: weakFp,
        pinned: false,
        muted: false,
        groupId: -1,
        groupTitle: null,
        groupColor: null,
        openerTabFingerprint: null,
        lastAccessed: null,
        openedAt: null,
      })
    }
    if (currentTabs.length) {
      windows.push({
        windowId: -1,
        relativeIndex: windows.length,
        focused: false,
        state: "normal",
        incognito: false,
        tabs: currentTabs,
      })
    }
    if (!windows.length) {
      return { ok: false, file: null, error: "未解析到任何有效 URL（OneTab 格式应为每行 `标题 | URL`）", warnings, skipped, format: "onetab" }
    }
    const now = Date.now()
    const file: BackupFile = {
      schemaVersion: 1,
      appVersionCode: 1,
      appVersionName: "imported-onetab",
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
        label: "OneTab 导入",
        status: 'success',
        errorMessage: null,
        windows,
        meta: {
          customTags: [],
          tabTagsMap: {},
          tabGroups: [],
          laterTabs: [],
          recentlyClosed: [],
          settings: null,
        },
        stats: {
          tabCount: windows.reduce((n, w) => n + w.tabs.length, 0),
          windowCount: windows.length,
          pinnedCount: 0,
          groupCount: 0,
          taggedCount: 0,
          laterCount: 0,
        },
      },
      signature: { algo: null, value: null },
    }
    return { ok: true, file, error: null, warnings, skipped, format: "onetab" }
  })()
}
