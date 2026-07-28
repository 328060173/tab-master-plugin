/**
 * 小工具模块常量。
 *
 * 禁魔法值（阿里规范）：所有字面量在此定义，组件引用常量名。
 */
/** 小便签 storage.local key */
export const TOOLS_NOTES_KEY = 'tools_notes'
/** 字段名/内容最大字符数 */
export const NOTES_MAX_LEN = 50
/** 最多字段数 */
export const NOTES_MAX_FIELDS = 50
/** 自动保存防抖时长（ms） */
export const NOTES_DEBOUNCE_MS = 500
/** 首次进入种子字段名（仅当 storage 无记录时写入，value 留空） */
export const DEFAULT_NOTE_FIELDS: readonly string[] = [
  '姓名',
  '手机号',
  '家庭地址',
  '公司地址',
  '身份证号码',
  '生日',
]
