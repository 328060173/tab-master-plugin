import { ref } from 'vue'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

type LocaleKey = 'zh-CN' | 'en-US'
type LocalePref = 'auto' | 'zh-CN' | 'en-US'
type TranslationKey = keyof typeof zhCN

const locales: Record<LocaleKey, typeof zhCN> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

/**
 * 当前生效 locale（响应式）。
 *
 * 设计取舍（2026-08-05 i18n-en-support §6.1）：
 * - 用 Vue ref 包裹：组件内 t() 在模板里直接调用时，会被模板渲染依赖追踪，
 *   currentLocale.value 改动后所有用到 t() 的模板自动重渲染（无需刷新页面/侧边栏）。
 * - 不暴露 ref 本体，仅通过 getLocale()/setLocale() 读写，保持 API 向后兼容。
 * - t()/tWithParams() 内部读 currentLocale.value，对外签名不变。
 */
const currentLocale = ref<LocaleKey>('zh-CN')

/**
 * chrome.storage.local 持久化用户语言偏好（D2 决策：独立 key，不复用 useSettings.language）。
 * - 'auto'：跟随浏览器 UI 语言（chrome.i18n.getUILanguage），zh 系列→zh-CN，其余→en-US
 * - 'zh-CN' / 'en-US'：强制指定
 */
const LOCALE_STORAGE_KEY = '__locale__'

export function setLocale(locale: LocaleKey): void {
  currentLocale.value = locale
}

export function getLocale(): LocaleKey {
  return currentLocale.value
}

/**
 * 暴露响应式 ref（供需要响应式追踪的场景，如 watch / computed 派生）。
 * 调用方不应直接改 .value，统一走 setLocale/setUserLocale。
 */
export function getLocaleRef() {
  return currentLocale
}

export function t(key: string, fallback?: string): string {
  const translations = locales[currentLocale.value]
  const value = (translations as Record<string, string>)[key]
  if (value !== undefined) {
    return value
  }
  // Fallback to zh-CN
  const zhValue = (zhCN as Record<string, string>)[key]
  if (zhValue !== undefined) {
    return zhValue
  }
  // Fallback to provided fallback or key
  return fallback ?? key
}

export function tWithParams(key: string, params: Record<string, string | number>, fallback?: string): string {
  let text = t(key, fallback)
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(`{${k}}`, String(v))
  }
  return text
}

// ============ locale 检测与持久化（2026-08-05 i18n-en-support §6.1）============
//
// 优先级：用户设置（chrome.storage.local __locale__）> 浏览器 UI 语言
// （chrome.i18n.getUILanguage）> 默认 zh-CN。
// 'auto' 模式：读 chrome.i18n.getUILanguage()，zh 系列→zh-CN，其余→en-US。
//
// 跨页面同步：sidepanel / options / popup 各自调 initLocale()；
// storage.onChanged 监听 __locale__ 变化后重新 detect + setLocale，让多页面同时打开时
// options 改语言 → sidepanel 立即响应（无需 reload）。
//
// 注意：chrome.i18n.getUILanguage 同步返回 string（如 'zh-CN' / 'en-US' / 'zh' / 'en'），
// 不需 Promise；chrome.storage.local.get 走 Promise。

/**
 * 将浏览器 UI 语言字符串归一化为 LocaleKey。
 * - zh 开头（含 'zh' / 'zh-CN' / 'zh-TW' / 'zh-HK'）→ 'zh-CN'
 * - 其他（含 'en' / 'en-US' / 'en-GB' / 'ja' / ...）→ 'en-US'
 * - 空值/异常 → 'zh-CN'（默认，统一需求文档 §2.3）
 */
function normalizeBrowserLocale(uiLang: string | undefined | null): LocaleKey {
  if (!uiLang || typeof uiLang !== 'string') return 'zh-CN'
  const lower = uiLang.toLowerCase()
  if (lower.startsWith('zh')) return 'zh-CN'
  return 'en-US'
}

/**
 * 按优先级链检测最终 locale。
 * - pref='auto'：读 chrome.i18n.getUILanguage()，归一化
 * - pref='zh-CN' / 'en-US'：直接用
 * - pref 缺失/异常：读 chrome.i18n.getUILanguage()，归一化（兜底 zh-CN）
 *
 * 同步函数（不读 storage，storage 读取在 initLocale/setUserLocale 内）。
 */
export function detectLocale(pref?: LocalePref): LocaleKey {
  if (pref === 'zh-CN' || pref === 'en-US') return pref
  // 'auto' 或异常值 → 跟随浏览器 UI 语言
  let uiLang: string | undefined
  try {
    uiLang = chrome.i18n?.getUILanguage?.()
  } catch {
    uiLang = undefined
  }
  return normalizeBrowserLocale(uiLang)
}

/**
 * 从 chrome.storage.local 读 __locale__ 偏好（无值默认 'auto'）。
 */
async function readUserLocalePref(): Promise<LocalePref> {
  try {
    const data = await chrome.storage.local.get(LOCALE_STORAGE_KEY)
    const v = data?.[LOCALE_STORAGE_KEY]
    if (v === 'auto' || v === 'zh-CN' || v === 'en-US') return v
  } catch {
    /* storage 读失败静默回退 'auto' */
  }
  return 'auto'
}

/**
 * 应用初始化时调用：读 __locale__ → detectLocale → setLocale。
 * 幂等：多次调用不会产生副作用（最终 locale 一致）。
 *
 * 同时注册 storage.onChanged 监听器，跨页面同步 locale：
 * options 改语言 → sidepanel/popup 收到 onChanged → 重新 detect + setLocale。
 *
 * 注意：监听器只在模块加载时注册一次（不随组件生命周期移除），保证单例
 * composable 监听器不丢失（稳定性红线⑧）。
 */
let localeChangedListenerRegistered = false
export async function initLocale(): Promise<LocaleKey> {
  const pref = await readUserLocalePref()
  const final = detectLocale(pref)
  setLocale(final)

  // 注册跨页面同步监听器（只注册一次）
  if (!localeChangedListenerRegistered) {
    localeChangedListenerRegistered = true
    try {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'local') return
        if (!changes[LOCALE_STORAGE_KEY]) return
        const newPref = changes[LOCALE_STORAGE_KEY].newValue
        // 新值非法或被删除 → 回退 'auto'
        const validPref: LocalePref =
          newPref === 'zh-CN' || newPref === 'en-US' ? newPref : 'auto'
        setLocale(detectLocale(validPref))
      })
    } catch {
      /* storage.onChanged 不可用时静默：本页面 locale 仍生效，仅跨页面同步失效 */
    }
  }

  return final
}

/**
 * 用户在设置页切换语言时调用。
 * - 写 chrome.storage.local __locale__（持久化 + 触发其他页面 onChanged 同步）
 * - 立即 setLocale（本页面立即生效，响应式重渲染）
 *
 * 返回最终生效的 LocaleKey。
 */
export async function setUserLocale(pref: LocalePref): Promise<LocaleKey> {
  // 本页面立即生效
  const final = detectLocale(pref)
  setLocale(final)
  // 持久化（触发其他页面 storage.onChanged 同步）
  try {
    await chrome.storage.local.set({ [LOCALE_STORAGE_KEY]: pref })
  } catch (e) {
    console.warn('[i18n] 写入 __locale__ 失败', e)
  }
  return final
}

/**
 * 读取当前用户语言偏好（异步读 chrome.storage.local）。
 * 用于设置页"语言"菜单的初始选中态（onMounted 调一次）。
 * 用户切换语言时直接调 setUserLocale，本函数无需缓存（菜单选中态由 v-model 绑定）。
 */
export async function getUserLocalePref(): Promise<LocalePref> {
  return readUserLocalePref()
}

// 导出所有翻译键类型（用于类型安全）
export type { TranslationKey, LocaleKey, LocalePref }
