/**
 * 小便签类型定义。
 *
 * - INoteField：字段完整结构（含 id），组件内部 / storage 持久化用
 * - 从 lib/tools/notesIO.ts 与组件共享，避免重复定义
 */
export interface INoteField {
  id: string
  key: string
  value: string
}
