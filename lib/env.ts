/**
 * 运行时环境标志（Plasmo 构建期静态替换）。
 *
 * 统一从本文件导出，消除散落在各 composable / 组件里的
 * `(import.meta as any).env?.DEV` 强转（共 13 处）。
 *
 * 用 process.env.NODE_ENV（Parcel 标准静态替换，plasmo dev=development、
 * plasmo build=production），`if (isDev) console.log(...)` 在 prod 整条被
 * tree-shake 删除，连字符串都不进产物。
 *
 * 用法：`import { isDev } from "~lib/env"`，然后 `if (isDev) { console.debug(...) }`。
 */
export const isDev = process.env.NODE_ENV !== "production"
