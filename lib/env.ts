/**
 * 统一环境配置 —— 全仓唯一的地址真相源。
 *
 * 两套独立环境开关（API / 官网各自切换，互不影响）：
 * - PLASMO_PUBLIC_API_ENV=local|prod  → 后端 API 走 localhost:8080 或 api.ouu365.com
 * - PLASMO_PUBLIC_SITE_ENV=local|prod → 官网（含菜单跳转）走 localhost:5173 或 www.ouu365.com
 * 未设时按 NODE_ENV 推断（dev→local，build→prod）。
 *
 * 常见组合：
 * - 全本地联调（pnpm dev 默认）：API=local + SITE=local
 * - 本地官网 + 生产后端：SITE_ENV=local + API_ENV=prod（在 .env.development 设）
 * - 全生产（pnpm build 默认）：API=prod + SITE=prod
 * - 生产官网 + 本地后端：SITE_ENV=prod + API_ENV=local
 *
 * 高级单地址覆盖（优先级最高，罕用）：PLASMO_PUBLIC_API_BASE / PLASMO_PUBLIC_SITE_BASE
 * Plasmo 构建时把 PLASMO_PUBLIC_* 注入 import.meta.env。
 */

// Plasmo 注入的 public env（值均为 string 或 undefined）
const env = (import.meta.env ?? {}) as Record<string, string | undefined>

// 按 NODE_ENV 推断默认环境（dev→local，build→prod）
const nodeEnvDefault: 'local' | 'prod' = process.env.NODE_ENV === 'development' ? 'local' : 'prod'

// 读取 local|prod 开关，非法值回落 NODE_ENV 推断
function readEnv(value: string | undefined): 'local' | 'prod' {
  return value === 'prod' ? 'prod' : value === 'local' ? 'local' : nodeEnvDefault
}

const API_ENV = readEnv(env.PLASMO_PUBLIC_API_ENV)
const SITE_ENV = readEnv(env.PLASMO_PUBLIC_SITE_ENV)

const API_BASES = {
  local: 'http://localhost:8080/ouu-api',
  prod: 'https://api.ouu365.com/ouu-api'
} as const

const SITE_BASES = {
  local: 'http://localhost:5173',
  prod: 'https://www.ouu365.com'
} as const

// 高级单地址覆盖优先；否则按各自环境开关
export const API_BASE_URL: string = env.PLASMO_PUBLIC_API_BASE ?? API_BASES[API_ENV]
export const OFFICIAL_SITE_URL: string = env.PLASMO_PUBLIC_SITE_BASE ?? SITE_BASES[SITE_ENV]
// 菜单跟官网环境走（SITE_ENV）
export const MENU_SITE_URL: string = env.PLASMO_PUBLIC_MENU_SITE ?? OFFICIAL_SITE_URL

export const CURRENT_API_ENV = API_ENV
export const CURRENT_SITE_ENV = SITE_ENV

// 诊断日志（运行时在 SW/sidepanel 控制台可见，确认 Plasmo env 注入是否生效）
console.log(`[env] API_ENV=${API_ENV} → ${API_BASE_URL} | SITE_ENV=${SITE_ENV} → ${OFFICIAL_SITE_URL} | MENU=${MENU_SITE_URL}`)
