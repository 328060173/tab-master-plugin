import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

type LocaleKey = 'zh-CN' | 'en-US'
type TranslationKey = keyof typeof zhCN

const locales: Record<LocaleKey, typeof zhCN> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

let currentLocale: LocaleKey = 'zh-CN'

export function setLocale(locale: LocaleKey) {
  currentLocale = locale
}

export function getLocale(): LocaleKey {
  return currentLocale
}

export function t(key: string, fallback?: string): string {
  const translations = locales[currentLocale]
  const value = (translations as any)[key]
  if (value !== undefined) {
    return value
  }
  // Fallback to zh-CN
  const zhValue = (zhCN as any)[key]
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

// 导出所有翻译键类型（用于类型安全）
export type { TranslationKey, LocaleKey }
