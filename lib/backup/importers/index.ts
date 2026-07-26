/**
 * 导入解析器统一入口 - PRD §5.5.4 嗅探 + 分发
 *
 * 嗅探规则：
 * - JSON 含 kind === "tabmaster.backup.v1" → ours
 * - JSON 含 lists + cards → toby
 * - JSON 含 snapshotId 或 windows[].tabGroups → vertitab
 * - JSON 顶层数组或含 tagList → nicetab
 * - 纯文本，含 `|` 分隔或纯 URL 行 → onetab
 * - 无法识别 → unknown（提示）
 */

import type { ImportResult } from "~types/backup"
import { parseOurs } from "./ours"
import { parseOneTab } from "./onetab"
import { parseNiceTab } from "./nicetab"
import { parseToby } from "./toby"
import { parseVertiTab } from "./vertitab"

/** 嗅探 JSON 顶层特征 */
function sniffJson(raw: unknown): "ours" | "toby" | "vertitab" | "nicetab" | "unknown" {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    // 顶层数组 → nicetab
    if (Array.isArray(raw)) return "nicetab"
    return "unknown"
  }
  const o = raw as Record<string, unknown>
  if (o.kind === "tabmaster.backup.v1") return "ours"
  if (Array.isArray(o.lists)) return "toby"
  if (typeof o.snapshotId === "string" || (Array.isArray(o.windows) && o.windows.some((w) => w && typeof w === "object" && Array.isArray((w as Record<string, unknown>).tabGroups)))) {
    return "vertitab"
  }
  if (Array.isArray(o.tagList)) return "nicetab"
  return "unknown"
}

/** 是否为 JSON 起首字符 */
function looksLikeJson(text: string): boolean {
  const t = text.trimStart()
  return t.startsWith("{") || t.startsWith("[")
}

/** 自动嗅探格式并解析 */
export async function parseImport(text: string): Promise<ImportResult> {
  const trimmed = (text || "").trim()
  if (!trimmed) {
    return { ok: false, file: null, error: "内容为空", warnings: [], skipped: 0, format: "unknown" }
  }
  if (looksLikeJson(trimmed)) {
    let raw: unknown
    try {
      raw = JSON.parse(trimmed)
    } catch (e) {
      return { ok: false, file: null, error: `JSON 解析失败：${e instanceof Error ? e.message : String(e)}`, warnings: [], skipped: 0, format: "unknown" }
    }
    const fmt = sniffJson(raw)
    if (fmt === "ours") return parseOurs(trimmed)
    if (fmt === "toby") return parseToby(trimmed)
    if (fmt === "vertitab") return parseVertiTab(trimmed)
    if (fmt === "nicetab") return parseNiceTab(trimmed)
    return {
      ok: false,
      file: null,
      error: "未识别的 JSON 格式，支持 OneTab/NiceTab/Toby/VertiTab/本插件 JSON",
      warnings: [],
      skipped: 0,
      format: "unknown",
    }
  }
  // 非文本 → OneTab
  return parseOneTab(trimmed)
}

/** 强制按 OneTab 文本解析（用于粘贴文本框） */
export function parseAsOneTab(text: string): Promise<ImportResult> {
  return parseOneTab(text)
}

/** 读取文件文本（File API） */
export function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
