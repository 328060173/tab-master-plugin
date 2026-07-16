/**
 * 统一环境配置 —— 全仓唯一的地址真相源。
 *
 * 每个地址：PLASMO_PUBLIC_* env 变量覆盖 > 按 APP_ENV 默认。
 * - 本地联调（pnpm dev，NODE_ENV=development）：默认 local（localhost 后端 + 本地官网 dev server）
 * - 生产构建（pnpm build，NODE_ENV=production）：默认 prod（api.ouu365.com + www.ouu365.com）
 *
 * 单地址覆盖示例：
 * - 本地 dev 连生产后端：在 .env.development 加 `PLASMO_PUBLIC_API_BASE=https://api.ouu365.com/ouu-api`
 * - 菜单默认跟官网走（OFFICIAL_SITE_URL），如需单独覆盖用 PLASMO_PUBLIC_MENU_SITE
 *
 * Plasmo 构建时把 PLASMO_PUBLIC_* 注入 import.meta.env（见 Plasmo 文档「Environment Variables」）。
 * 此处不写 `(import.meta.env as any)`，统一收口到本文件的 Record 类型断言。
 */

// Plasmo 注入的 public env（值均为 string 或 undefined）
const env = (import.meta.env ?? {}) as Record<string, string | undefined>

// 环境判断：PLASMO_PUBLIC_APP_ENV > NODE_ENV
// 显式校验合法值，非法值回落到 NODE_ENV 推断（避免任意字符串穿透 DEFAULTS 索引）
const rawAppEnv = env.PLASMO_PUBLIC_APP_ENV
const APP_ENV: 'local' | 'prod' =
  rawAppEnv === 'prod' ? 'prod'
    : rawAppEnv === 'local' ? 'local'
      : (process.env.NODE_ENV === 'development' ? 'local' : 'prod')

const DEFAULTS = {
  local: {
    apiBase: 'http://localhost:8080/ouu-api',
    siteUrl: 'http://localhost:5173'
  },
  prod: {
    apiBase: 'https://api.ouu365.com/ouu-api',
    siteUrl: 'https://www.ouu365.com'
  }
} as const

const d = DEFAULTS[APP_ENV]

// 每地址独立 env 覆盖（?? 兜底，env 变量为 undefined 时回落默认）
export const API_BASE_URL: string = env.PLASMO_PUBLIC_API_BASE ?? d.apiBase
export const OFFICIAL_SITE_URL: string = env.PLASMO_PUBLIC_SITE_BASE ?? d.siteUrl
// 菜单 URL 默认跟官网走（OFFICIAL_SITE_URL），可单独 PLASMO_PUBLIC_MENU_SITE 覆盖
export const MENU_SITE_URL: string = env.PLASMO_PUBLIC_MENU_SITE ?? OFFICIAL_SITE_URL
export const CURRENT_ENV: 'local' | 'prod' = APP_ENV
