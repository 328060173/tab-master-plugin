/**
 * 导入解析器统一入口 - PRD §5.5.4 嗅探 + 分发
 *
 * 策略模式（开闭原则，修 P1-5d）：新增格式只需往 JSON_PARSERS 注册一项，不改 parseImport 主流程。
 *
 * 嗅探规则：
 * - JSON 含 kind === "tabmaster.backup.v1" → ours
 * - 纯文本，含 ` | ` 分隔或纯 URL 行 → onetab
 * - 无法识别 → unknown（提示）
 */

import type { ImportResult } from "~types/backup"
import { parseOurs } from "./ours"
import { parseOneTab } from "./onetab"

/** 支持的 JSON 格式标识 */
type JsonFormat = "ours"

/** 嗅探器：判断 raw 是否匹配某格式 */
type Sniffer = (raw: unknown) => boolean

/** 解析器：按格式解析文本 */
type Parser = (text: string) => Promise<ImportResult>

/** JSON 格式注册表（策略模式核心）：新增格式只需 push 一项，不改 parseImport */
const JSON_PARSERS: { format: JsonFormat; sniff: Sniffer; parse: Parser }[] = [
  { format: "ours", sniff: isOurs, parse: parseOurs },
]

function isOurs(raw: unknown): boolean {
  return !!raw && typeof raw === "object" && !Array.isArray(raw)
    && (raw as Record<string, unknown>).kind === "tabmaster.backup.v1"
}

/** 嗅探 JSON 顶层特征，返回首个命中的格式（未命中返回 null） */
function sniffJson(raw: unknown): JsonFormat | null {
  for (const p of JSON_PARSERS) {
    if (p.sniff(raw)) return p.format
  }
  return null
}

/** 是否为 JSON 起首字符 */
function looksLikeJson(text: string): boolean {
  const t = text.trimStart()
  return t.startsWith("{") || t.startsWith("[")
}

/** 按 JSON 格式查找解析器并执行 */
async function parseByFormat(format: JsonFormat, text: string): Promise<ImportResult> {
  const parser = JSON_PARSERS.find((p) => p.format === format)
  return parser ? parser.parse(text) : {
    ok: false,
    file: null,
    error: "未识别的格式，支持 OneTab 或本插件数据",
    warnings: [],
    skipped: 0,
    format: "unknown",
  }
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
    if (fmt) return parseByFormat(fmt, trimmed)
    return {
      ok: false,
      file: null,
      error: "未识别的格式，支持 OneTab 或本插件数据",
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
