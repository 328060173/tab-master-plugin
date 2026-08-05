/**
 * 小工具模块常量。
 *
 * 禁魔法值（阿里规范）：所有字面量在此定义，组件引用常量名。
 *
 * i18n：DEFAULT_NOTE_FIELDS 改为 i18n key 字符串数组，消费侧 `t(key)` 翻译后再用作种子字段名。
 */
/** 小便签 storage.local key */
export const TOOLS_NOTES_KEY = 'tools_notes'
/** 字段名/内容最大字符数 */
export const NOTES_MAX_LEN = 50
/** 最多字段数 */
export const NOTES_MAX_FIELDS = 50
/** 自动保存防抖时长（ms） */
export const NOTES_DEBOUNCE_MS = 500
/**
 * 首次进入种子字段名的 i18n key（仅当 storage 无记录时使用，value 留空）。
 * 消费侧须 `DEFAULT_NOTE_FIELDS.map(k => t(k))` 翻译后再写入 fields。
 */
export const DEFAULT_NOTE_FIELDS: readonly string[] = [
  'tools.field.name',
  'tools.field.phone',
  'tools.field.homeAddr',
  'tools.field.companyAddr',
  'tools.field.idNumber',
  'tools.field.birthday',
]
