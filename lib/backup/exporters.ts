/**
 * 备份导出器 - PRD §5.5
 * 三种格式：① 我们自己的 JSON（默认）② Markdown（人类可读，不可回导入）③ OneTab 兼容（仅 URL）
 *
 * 守红线：
 * - 禁 v-html（导出本身是文本生成）
 * - Markdown 转义特殊字符（* _ [ ] ` 等，避免破坏人类可读）
 * - 文件名用 ISO 时间戳 + deviceId 短 8 位（PRD §5.5.1）
 */

import type { BackupFile, ExportFormat, SnapshotSource } from "~types/backup"
import { BACKUP_KIND, BACKUP_SCHEMA_VERSION } from "~types/backup"
import { APP_VERSION_CODE, APP_VERSION_NAME } from "~lib/api-config"
import { collectMeta, buildSnapshot, type BuildSnapshotOptions } from "./snapshotBuilder"

export interface ExportOutput {
  /** 文件名（含扩展名） */
  fileName: string
  /** MIME 类型 */
  mime: string
  /** 文件内容 */
  content: string
}

function isoForFilename(ts: number): string {
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

function shortDeviceId(deviceId: string): string {
  return (deviceId || "unknown").replace(/-/g, "").slice(0, 8)
}

function escapeMd(s: string): string {
  // 转义 markdown 特殊字符（标题/列表/链接/强调）
  return (s || "").replace(/([\\*_`\[\]()#~!|>])/g, "\\$1")
}

/** 导出我们自己的 JSON 格式（即完整 BackupFile） */
export function exportJson(file: BackupFile): ExportOutput {
  return {
    fileName: `tabmaster-backup-${isoForFilename(file.snapshot.createdAt)}-${shortDeviceId(file.deviceId)}.json`,
    mime: "application/json",
    content: serializeBackupJson(file),
  }
}

/**
 * 统一 JSON 序列化（所有「展示数据串」入口共用，避免各处 JSON.stringify(file,null,2) 各写各的）。
 * - 概览导出大面板、列表导出大面板、详情弹框 JSON 视图、导入「展示 JSON 串」均走这里。
 * - 保证序列化口径一致：2 空格缩进、保留全部字段（与 exportJson 一致，可回导入）。
 */
export function serializeBackupJson(file: BackupFile): string {
  return JSON.stringify(file, null, 2)
}

/**
 * 从当前浏览器标签构造完整 BackupFile（概览导出 / SW 裸备份 / 手动备份 pipeline 共用）。
 * 收口 BackupFile 外层包装逻辑（schemaVersion/appVersion/kind/deviceId/customer/signature），
 * 避免散落多处各写各的字面量、字段漂移。
 *
 * @param allTabs chrome.tabs.query 结果（已按需过滤/截断的 effectiveTabs 由 options 控制）
 * @param source 快照来源（manual / auto.* / import / preRestore）
 * @param deviceId 设备 ID（SW 侧从 storage 读，UI 侧用 getDeviceId）
 * @param trigger 触发源（写入 snapshot.trigger，自由字符串）
 * @param options buildSnapshot 选项（selectedTabIds 子集 / truncateAt 截断 / totalTabCount）
 */
export async function buildBackupFileFromTabs(
  allTabs: chrome.tabs.Tab[],
  source: SnapshotSource,
  deviceId: string,
  trigger: string,
  options?: BuildSnapshotOptions,
): Promise<BackupFile> {
  const meta = await collectMeta()
  const snapshot = await buildSnapshot(allTabs, meta, source, options)
  snapshot.trigger = trigger
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    appVersionCode: APP_VERSION_CODE,
    appVersionName: APP_VERSION_NAME,
    kind: BACKUP_KIND,
    deviceId,
    customer: { id: null, type: "anonymous" },
    snapshot,
    signature: { algo: null, value: null },
  }
}

/** 导出 OneTab 兼容格式：每行 `标题 | URL`，空行分隔窗口 */
export function exportOneTab(file: BackupFile): ExportOutput {
  const lines: string[] = []
  file.snapshot.windows.forEach((w, wi) => {
    if (wi > 0) lines.push("")
    w.tabs.forEach((t) => {
      const title = (t.title || t.url || "").trim()
      const url = (t.url || "").trim()
      if (url) lines.push(`${title} | ${url}`)
    })
  })
  return {
    fileName: `tabmaster-onetab-${isoForFilename(file.snapshot.createdAt)}.txt`,
    mime: "text/plain",
    content: lines.join("\n"),
  }
}

/** 导出 Markdown（人类可读，PRD §5.5.2 模板） */
export function exportMarkdown(file: BackupFile): ExportOutput {
  const s = file.snapshot
  const lines: string[] = []
  lines.push(`# 浏览器标签大师 · 会话快照`)
  lines.push("")
  const d = new Date(s.createdAt)
  const p = (n: number) => String(n).padStart(2, "0")
  const timeStr = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
  lines.push(`- 时间：${timeStr}`)
  lines.push(`- 来源：${sourceLabel(s.source)}`)
  lines.push(`- 设备：${shortDeviceId(file.deviceId)}`)
  lines.push(`- schemaVersion: ${file.schemaVersion}`)
  if (s.label) lines.push(`- 标签：${escapeMd(s.label)}`)
  lines.push("")
  s.windows.forEach((w, wi) => {
    const focus = w.focused ? "（聚焦）" : ""
    const incog = w.incognito ? "（隐身）" : ""
    lines.push(`## 窗口 ${wi + 1}${focus}${incog}`)
    lines.push("")
    w.tabs.forEach((t) => {
      const title = escapeMd(t.title || t.url || "无标题")
      const url = escapeMd(t.url || "")
      const pin = t.pinned ? "📌 " : ""
      lines.push(`- ${pin}[${title}](${url})`)
    })
    lines.push("")
  })
  // 分组
  if (s.meta.tabGroups.length) {
    lines.push(`## 分组`)
    lines.push("")
    s.meta.tabGroups.forEach((g) => {
      lines.push(`- ${escapeMd(g.title || "未命名")}（${g.color}${g.collapsed ? "，已折叠" : ""}）· ${g.tabFingerprints.length} 个标签`)
    })
    lines.push("")
  }
  // 稍后处理
  if (s.meta.laterTabs.length) {
    lines.push(`## 稍后处理`)
    lines.push("")
    s.meta.laterTabs.forEach((t) => {
      const title = escapeMd(t.title || t.url || "无标题")
      const note = t.note ? ` — 备注：${escapeMd(t.note)}` : ""
      lines.push(`- [${title}](${escapeMd(t.url)})${note}`)
    })
    lines.push("")
  }
  // 关闭历史
  if (s.meta.recentlyClosed.length) {
    lines.push(`## 关闭历史（最近 ${s.meta.recentlyClosed.length}）`)
    lines.push("")
    s.meta.recentlyClosed.forEach((t) => {
      const title = escapeMd(t.title || t.url || "无标题")
      lines.push(`- [${title}](${escapeMd(t.url)})`)
    })
    lines.push("")
  }
  lines.push(`---`)
  lines.push(`> 由 浏览器标签大师 v${file.appVersionName} 导出 · {schemaVersion:${file.schemaVersion}}`)
  return {
    fileName: `tabmaster-snapshot-${isoForFilename(s.createdAt)}.md`,
    mime: "text/markdown",
    content: lines.join("\n"),
  }
}

function sourceLabel(s: string): string {
  switch (s) {
    case "manual": return "手动备份"
    case "auto.timer": return "定时备份"
    case "auto.event": return "事件触发"
    case "preRestore": return "恢复前快照"
    case "import": return "导入"
    default: return s
  }
}

export function exportByFormat(file: BackupFile, format: ExportFormat): ExportOutput {
  switch (format) {
    case "json": return exportJson(file)
    case "markdown": return exportMarkdown(file)
    case "onetab": return exportOneTab(file)
  }
}

/** 触发浏览器下载（在 sidepanel/options/tabs 页面调用） */
export function downloadExport(out: ExportOutput): boolean {
  try {
    const blob = new Blob([out.content], { type: out.mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = out.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch (e) {
    console.warn("[exporters] 下载失败", e)
    return false
  }
}

/**
 * 用 File System Access API 让用户选保存位置（Chrome/Edge 86+）。
 * 不支持时降级为 <a download> 直接下载到默认下载目录。
 * 一次性下载，不需要持久文件夹权限（§10.1 决策）。
 *
 * @returns ok=true 表示已成功触发（含降级）；ok=false 表示用户取消或失败
 */
export async function downloadExportWithPicker(out: ExportOutput): Promise<{ ok: boolean; error?: string; fallback: boolean }> {
  // 类型守卫：showSaveFilePicker 在 Chrome 86+ / Edge 86+ 可用
  const picker: typeof window.showSaveFilePicker | undefined =
    (typeof window !== 'undefined' ? (window as unknown as { showSaveFilePicker?: typeof window.showSaveFilePicker }).showSaveFilePicker : undefined)
  if (picker) {
    try {
      // 按 MIME 推断扩展名（json → .json / markdown → .md / plain → .txt）
      const ext = out.fileName.includes('.') ? out.fileName.slice(out.fileName.lastIndexOf('.')) : '.txt'
      const handle = await picker({
        suggestedName: out.fileName,
        types: [{
          description: '备份文件',
          accept: { [out.mime]: [ext] },
        }],
      })
      const writable = await handle.createWritable()
      await writable.write(out.content)
      await writable.close()
      return { ok: true, fallback: false }
    } catch (e) {
      // 用户取消（AbortError）→ 静默返回，不算失败也不降级
      if (e instanceof DOMException && e.name === 'AbortError') {
        return { ok: false, error: '用户取消' }
      }
      console.warn('[exporters] showSaveFilePicker 失败，降级 <a download>', e)
      // 其他错误降级到 <a download>
    }
  }
  // 降级：<a download> 直接下载到默认下载目录
  const ok = downloadExport(out)
  return { ok, error: ok ? undefined : '下载失败', fallback: true }
}
