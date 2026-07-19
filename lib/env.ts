/**
 * 运行时环境标志（Plasmo 构建期静态替换）。
 *
 * 统一从本文件导出，消除散落在各 composable / 组件里的
 * `(import.meta as any).env?.DEV` 强转（共 13 处）。类型断言集中在本文件一处。
 *
 * Plasmo 在构建期把 import.meta.env.DEV 静态替换为布尔值：
 * - plasmo dev → true
 * - plasmo build（production）→ false，相关分支被 tree-shake 删除，不进产物。
 *
 * 用法：`import { isDev } from "~lib/env"`，然后 `if (isDev) { console.debug(...) }`。
 */
const env = (import.meta as Record<string, unknown>).env as
  | { DEV?: boolean }
  | undefined

export const isDev = !!env?.DEV
