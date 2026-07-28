/**
 * 小便签导入/导出纯逻辑（无 DOM / 无 Vue 依赖）。
 *
 * - 导出格式：[{ "key": "...", "value": "..." }, ...]（纯数据，不含 id）
 * - 导入解析：JSON 数组，每项必须有字符串 key，value 缺失视为空串
 * - 文件名日期段：YYYYMMDD
 *
 * 守红线：
 * - 禁 any（用 unknown + 类型守卫）
 * - 异常不吞（解析失败抛错，由调用方 toast）
 */
import type { INoteField } from './notesTypes'

/** 导出文件名日期段：YYYYMMDD（本地时区） */
export const notesExportFileName = (): string => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `notes-export-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.json`
}

/** 序列化字段为导出 JSON 字符串（纯 key/value，不含 id） */
export const serializeNotes = (fields: readonly INoteField[]): string => {
  const payload = fields.map((f) => ({ key: f.key, value: f.value }))
  return JSON.stringify(payload, null, 2)
}

/** 导入 JSON 文本解析结果（不含 id，由调用方生成新 id） */
export interface INotesImportEntry {
  key: string
  value: string
}

/**
 * 解析导入的 JSON 文本。
 * @returns 有效字段数组（每项有字符串 key，value 缺失视为空串）
 * @throws 当文本不是合法 JSON 或顶层不是数组时抛错
 */
export const parseNotesImport = (text: string): INotesImportEntry[] => {
  const parsed: unknown = JSON.parse(text)
  if (!Array.isArray(parsed)) {
    throw new Error('JSON 顶层不是数组')
  }
  const result: INotesImportEntry[] = []
  for (const item of parsed) {
    if (!item || typeof item !== 'object') continue
    const k = (item as { key?: unknown }).key
    if (typeof k !== 'string') continue
    const v = (item as { value?: unknown }).value
    result.push({ key: k, value: typeof v === 'string' ? v : '' })
  }
  return result
}
