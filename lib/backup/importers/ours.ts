/**
 * 我们自己的格式导入器 - PRD §5.5.1
 *
 * 永不失败策略：
 * 1. kind === "tabmaster.backup.v1" 校验；不匹配仍尝试解析但提示
 * 2. schemaVersion 校验：等于当前→用；低于→migrator；高于→提示升级插件
 * 3. 字段缺失→给默认值
 * 4. JSON 解析失败→提示文件损坏
 * 5. 任何降级/跳过明确告知用户
 */

import { BACKUP_KIND, BACKUP_SCHEMA_VERSION } from "~types/backup"
import type { BackupFile, ImportResult } from "~types/backup"
import { normalizeUrl } from "~lib/backup/fingerprint"
import { t, tWithParams } from "~lib/i18n"
import { uuidV4 } from "~lib/backup/fingerprint"
import { verifySnapshot } from "../integrity"

/** migrator 链（vN → vN+1）。当前只有 v1，无迁移 */
function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  // 未来版本迁移在此扩展：v1→v2 等
  return raw
}

/** 字段缺失给默认值，保证结构完整 */
function fillDefaults(raw: Record<string, unknown>, warnings: string[]): BackupFile {
  const sv = typeof raw.schemaVersion === "number" ? raw.schemaVersion : BACKUP_SCHEMA_VERSION
  const kind = typeof raw.kind === "string" ? raw.kind : BACKUP_KIND
  if (kind !== BACKUP_KIND) {
    warnings.push(`kind 字段不匹配（${kind}），仍按本插件格式解析`)
  }
  if (sv > BACKUP_SCHEMA_VERSION) {
    warnings.push(`此备份由更新版本创建（schemaVersion=${sv}），建议升级插件后导入`)
  }
  const snapRaw = (raw.snapshot && typeof raw.snapshot === "object" ? raw.snapshot : {}) as Record<string, unknown>
  const windowsRaw = Array.isArray(snapRaw.windows) ? snapRaw.windows : []
  const windows = windowsRaw.map((w, i) => {
    const wo = (w && typeof w === "object" ? w : {}) as Record<string, unknown>
    const tabs = Array.isArray(wo.tabs) ? wo.tabs : []
    return {
      windowId: typeof wo.windowId === "number" ? wo.windowId : -1,
      relativeIndex: typeof wo.relativeIndex === "number" ? wo.relativeIndex : i,
      focused: wo.focused === true,
      state: typeof wo.state === "string" ? wo.state : "normal",
      incognito: wo.incognito === true,
      tabs: tabs.map((t, ti) => {
        const to = (t && typeof t === "object" ? t : {}) as Record<string, unknown>
        const url = typeof to.url === "string" ? to.url : ""
        const title = typeof to.title === "string" ? to.title : ""
        return {
          index: typeof to.index === "number" ? to.index : ti,
          url,
          urlNormalized: typeof to.urlNormalized === "string" ? to.urlNormalized : normalizeUrl(url),
          title,
          fingerprint: typeof to.fingerprint === "string" ? to.fingerprint : "",
          fingerprintWeak: typeof to.fingerprintWeak === "string" ? to.fingerprintWeak : "",
          pinned: to.pinned === true,
          muted: to.muted === true,
          groupId: typeof to.groupId === "number" ? to.groupId : -1,
          groupTitle: typeof to.groupTitle === "string" ? to.groupTitle : null,
          groupColor: typeof to.groupColor === "string" ? to.groupColor : null,
          openerTabFingerprint: typeof to.openerTabFingerprint === "string" ? to.openerTabFingerprint : null,
          lastAccessed: typeof to.lastAccessed === "number" ? to.lastAccessed : null,
          openedAt: typeof to.openedAt === "number" ? to.openedAt : null,
        }
      }),
    }
  })
  const metaRaw = (snapRaw.meta && typeof snapRaw.meta === "object" ? snapRaw.meta : {}) as Record<string, unknown>
  const file: BackupFile = {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appVersionCode: typeof raw.appVersionCode === "number" ? raw.appVersionCode : 1,
    appVersionName: typeof raw.appVersionName === "string" ? raw.appVersionName : "unknown",
    kind: BACKUP_KIND,
    deviceId: typeof raw.deviceId === "string" ? raw.deviceId : uuidV4(),
    customer: {
      id: (metaRaw as { customer?: { id?: unknown } }).customer?.id ?? null,
      type: "anonymous",
    },
    snapshot: {
      id: typeof snapRaw.id === "string" ? snapRaw.id : uuidV4(),
      createdAt: typeof snapRaw.createdAt === "number" ? snapRaw.createdAt : Date.now(),
      createdAtISO: typeof snapRaw.createdAtISO === "string" ? snapRaw.createdAtISO : new Date().toISOString(),
      source: "import",
      trigger: "import",
      label: typeof snapRaw.label === "string" ? snapRaw.label : null,
      status: 'success',
      errorMessage: null,
      windows,
      meta: {
        customTags: Array.isArray(metaRaw.customTags) ? metaRaw.customTags.filter((x): x is string => typeof x === "string") : [],
        tabTagsMap: (metaRaw.tabTagsMap && typeof metaRaw.tabTagsMap === "object" && !Array.isArray(metaRaw.tabTagsMap)
          ? metaRaw.tabTagsMap : {}) as Record<string, string[]>,
        tabGroups: Array.isArray(metaRaw.tabGroups) ? metaRaw.tabGroups : [],
        laterTabs: Array.isArray(metaRaw.laterTabs) ? metaRaw.laterTabs : [],
        recentlyClosed: Array.isArray(metaRaw.recentlyClosed) ? metaRaw.recentlyClosed : [],
        settings: (metaRaw.settings && typeof metaRaw.settings === "object" ? metaRaw.settings : null) as Record<string, unknown> | null,
      },
      stats: {
        tabCount: windows.reduce((n, w) => n + w.tabs.length, 0),
        windowCount: windows.length,
        pinnedCount: windows.reduce((n, w) => n + w.tabs.filter((t) => t.pinned).length, 0),
        groupCount: Array.isArray(metaRaw.tabGroups) ? metaRaw.tabGroups.length : 0,
        taggedCount: 0,
        laterCount: Array.isArray(metaRaw.laterTabs) ? metaRaw.laterTabs.length : 0,
      },
    },
    signature: { algo: null, value: null },
  }
  return file
}

export async function parseOurs(text: string): Promise<ImportResult> {
  const warnings: string[] = []
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch (e) {
    return {
      ok: false,
      file: null,
      error: tWithParams("backup.lib.jsonParseFailed", { error: e instanceof Error ? e.message : String(e) }),
      warnings,
      skipped: 0,
      format: "ours",
    }
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, file: null, error: t("backup.lib.jsonNotObject"), warnings, skipped: 0, format: "ours" }
  }
  const migrated = migrate(raw as Record<string, unknown>)
  // P0-4 L3：校验 checksum（防文件损坏/撕裂）
  // ⚠️ 必须在 fillDefaults 之前对原始 raw.snapshot 校验——fillDefaults 会重建
  // windows/tabs/meta 为新对象（补默认值、规整字段），重建后结构变了，重算 checksum 必然不匹配，
  // 会把完好的文件误判为"已损坏"。校验通过后再 fillDefaults 重建。
  const rawChecksum = (migrated as Record<string, unknown>).checksum
  const rawSnapshot = (migrated as Record<string, unknown>).snapshot
  if (typeof rawChecksum === "string" && rawChecksum && rawSnapshot && typeof rawSnapshot === "object") {
    // 构造仅用于校验的临时 file（只取 snapshot + checksum，不 fillDefaults）
    const verifyFile = { snapshot: rawSnapshot, checksum: rawChecksum } as unknown as BackupFile
    const ok = await verifySnapshot(verifyFile)
    if (!ok) {
      return {
        ok: false,
        file: null,
        error: t("backup.lib.checksumFailed"),
        warnings,
        skipped: 0,
        format: "ours",
      }
    }
  } else {
    // 旧快照无 checksum：跳过校验只警告（向后兼容）
    warnings.push("此快照无校验和（旧版本导出），已跳过完整性校验")
  }
  const file = fillDefaults(migrated, warnings)
  // 校验通过后，把原始 checksum 带回（导入写 IDB 时 withChecksum 会重算，此处仅保留供下游参考）
  if (typeof rawChecksum === "string" && rawChecksum) {
    file.checksum = rawChecksum
  }
  return { ok: true, file, error: null, warnings, skipped: 0, format: "ours" }
}
