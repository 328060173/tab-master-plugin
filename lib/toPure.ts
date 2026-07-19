/**
 * 深拷贝工具（reactive proxy / ref 转纯值）。
 *
 * 插件写 chrome.storage 前必须把 reactive 数据转纯值，否则序列化后丢失响应式
 * 引用或写入 [object Object]。统一用本工具，替代散落在 7 个 composable 里的
 * 各自 `const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))` 重复定义。
 *
 * 注意：JSON 序列化会丢弃 undefined / 函数 / Symbol，适用于纯数据场景。
 */
export const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))
