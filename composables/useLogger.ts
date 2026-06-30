import { ref, onMounted, onUnmounted } from "vue"

/**
 * 运行日志（错误 + 关键操作）—— 轻量环形缓冲，存 chrome.storage.local。
 *
 * 设计原则：
 * - **记日志本身绝不能拖垮功能**：全程 try-catch、fire-and-forget、写入防抖批量
 * - 封顶 MAX_LOGS 条，自动顶出最旧的（绝不无限增长占满 storage）
 * - 纯函数 log/logInfo/... 可在任何地方调用（window 错误监听、app.config.errorHandler、composable 内）
 * - useLogger() 给设置页用：响应式 logs + 清空 + 跨页同步
 */

export type LogLevel = "info" | "warn" | "error"
export interface LogEntry {
  t: number // 毫秒时间戳
  level: LogLevel
  scope: string // 模块/来源，如 tabs / groups / history / vue / window
  msg: string
  detail?: string
}

const STORAGE_KEY = "tabMasterLogs"
const MAX_LOGS = 300

// 模块级单例状态（每个页面上下文一份；sidepanel 与 options 各自持有）
const logs = ref<LogEntry[]>([])
let loaded = false
let queue: LogEntry[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

function isEntry(e: unknown): e is LogEntry {
  return !!e && typeof e === "object" && typeof (e as LogEntry).t === "number" && typeof (e as LogEntry).msg === "string"
}

async function ensureLoaded() {
  if (loaded) return
  loaded = true
  try {
    const data = await chrome.storage.local.get(STORAGE_KEY)
    const arr = (data as Record<string, unknown>)?.[STORAGE_KEY]
    logs.value = Array.isArray(arr) ? arr.filter(isEntry) : []
  } catch {
    logs.value = []
  }
}

function scheduleFlush() {
  if (flushTimer) return
  try {
    flushTimer = setTimeout(flush, 800)
  } catch {
    flushTimer = null
  }
}

async function flush() {
  flushTimer = null
  if (!queue.length) return
  const batch = queue
  queue = []
  try {
    await ensureLoaded()
    logs.value = [...batch.reverse(), ...logs.value].slice(0, MAX_LOGS)
    await chrome.storage.local.set({ [STORAGE_KEY]: logs.value })
  } catch {
    // 写盘失败也不抛
  }
}

function safeDetail(d: unknown): string | undefined {
  if (d === undefined || d === null) return undefined
  try {
    if (d instanceof Error) return (d.stack || d.message || String(d)).slice(0, 600)
    if (typeof d === "string") return d.slice(0, 600)
    return JSON.stringify(d).slice(0, 600)
  } catch {
    try { return String(d).slice(0, 600) } catch { return undefined }
  }
}

/** 写一条日志（任何地方可调用，永不抛错） */
export function log(level: LogLevel, scope: string, msg: string, detail?: unknown) {
  try {
    queue.push({
      t: Date.now(),
      level,
      scope: String(scope).slice(0, 40),
      msg: String(msg).slice(0, 200),
      detail: safeDetail(detail),
    })
    if (queue.length > MAX_LOGS) queue = queue.slice(-MAX_LOGS)
    // 错误立即落盘（不等 800ms 防抖），避免用户马上去看日志页时还没写进去而"看不到"
    if (level === "error") { void flush() } else { scheduleFlush() }
  } catch {
    // 连记日志都失败就彻底放弃，绝不影响主流程
  }
}
export const logInfo = (scope: string, msg: string, detail?: unknown) => log("info", scope, msg, detail)
export const logWarn = (scope: string, msg: string, detail?: unknown) => log("warn", scope, msg, detail)
export const logError = (scope: string, msg: string, detail?: unknown) => log("error", scope, msg, detail)

// ============ 全局捕获（切面）============
// 设计：一次性安装，之后业务代码照常用 console.error / console.warn 即可被自动记录，
// 不需要在各处 import 这个 logger、也不用手写 logError——高内聚、低耦合、零硬编码。

function argToStr(a: unknown): string {
  if (a instanceof Error) return a.stack || a.message || String(a)
  if (typeof a === "string") return a
  try { return JSON.stringify(a) } catch { return String(a) }
}

let captureInstalled = false
/** 在入口（sidepanel 脚本顶层）调一次：拦截 console.error/warn + window 未捕获错误/Promise 拒绝 */
export function installGlobalCapture() {
  if (captureInstalled) return
  captureInstalled = true
  // 拦截 console.error/warn：业务代码照常用 console.error 即自动入库
  for (const level of ["error", "warn"] as const) {
    const orig = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      orig(...args) // 原样输出到控制台
      try { log(level, "console", args.map(argToStr).join(" ").slice(0, 500)) } catch {}
    }
  }
  // window 错误：能接到 Vue 没拦住、或非 Vue 上下文的错
  try {
    window.addEventListener("error", (e) => {
      log("error", "window", e.message || "error", e.error)
    })
    window.addEventListener("unhandledrejection", (e) => log("error", "window", "unhandledrejection", (e as PromiseRejectionEvent).reason))
  } catch {}
}

/** 装到 app.config.errorHandler：捕获 Vue 渲染/事件 handler 错误。
 *  注意：必须确认 prepare 真的被 Plasmo 调用了；否则用根级 onErrorCaptured 兜底（见 sidepanel）。 */
export function vueErrorHandler(err: unknown, _instance: unknown, info: string) {
  log("error", "vue", err instanceof Error ? err.message : String(err), `${info} | ${err instanceof Error ? err.stack : ""}`)
}

/** 供设置页使用：响应式 logs + 清空 + 跨页实时同步 */
export function useLogger() {
  ensureLoaded()

  const onChanged = (changes: { [k: string]: chrome.storage.StorageChange }, area: string) => {
    if (area !== "local" || !changes[STORAGE_KEY]) return
    const v = changes[STORAGE_KEY].newValue
    logs.value = Array.isArray(v) ? v.filter(isEntry) : []
  }

  onMounted(() => {
    try { chrome.storage.onChanged.addListener(onChanged) } catch {}
  })
  onUnmounted(() => {
    try { chrome.storage.onChanged.removeListener(onChanged) } catch {}
  })

  const clearLogs = async () => {
    queue = []
    logs.value = []
    try { await chrome.storage.local.set({ [STORAGE_KEY]: [] }) } catch {}
  }

  const reload = () => { loaded = false; return ensureLoaded() }

  return { logs, clearLogs, reload }
}
