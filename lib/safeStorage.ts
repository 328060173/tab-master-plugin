import { isDev } from "~lib/env"

/**
 * chrome.storage.local 写入的安全封装。
 *
 * 配额耗尽（无 `unlimitedStorage` 权限，默认 10MB 上限）或 service worker
 * 已终止时，`chrome.storage.local.set` 会 reject。裸调用 → unhandled rejection
 * + 静默丢数据（标记/编号/设置存不住，用户无感知）。所有 fire-and-forget 写入
 * 统一走本工具兜底（稳定性红线②）。
 *
 * 失败时 console.warn（被 installGlobalCapture 拦截入运行日志页），不抛出。
 */
export function safeSet(
  items: Record<string, unknown>,
  ctx = "storage"
): Promise<void> {
  return chrome.storage.local.set(items).catch((e) => {
    console.warn(
      `[tab-master:${ctx}] 本地存储写入失败（可能配额已满，可在「设置-数据」清理）`,
      e
    )
    if (isDev) console.warn(`[tab-master:${ctx}] set 参数`, items)
  })
}

/** chrome.storage.local.remove 的安全封装，同理兜底。 */
export function safeRemove(
  keys: string | string[],
  ctx = "storage"
): Promise<void> {
  return chrome.storage.local.remove(keys).catch((e) => {
    console.warn(`[tab-master:${ctx}] 本地存储删除失败`, e)
  })
}
