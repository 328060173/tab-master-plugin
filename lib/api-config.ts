/**
 * 浏览器标签大师 API 配置
 * 统一管理接口地址和请求头
 */

// 环境区分：
// - 开发/本地调试：localhost:8080（后端服务地址）
// - 生产环境：api.ouu365.com
// /ouu-api 是后端 context-path 前缀（Controller 路径无此前缀，必须放在 baseURL）
// 与官网 ouu-web-official 配置一致
//
// 用 process.env.NODE_ENV 判断（Plasmo 构建时静态替换：dev=development，prod=production）
// 不用 import.meta.env.DEV（Plasmo 里行为不稳定，曾导致 dev 构建走 prod 地址）
// 优先级：PLASMO_PUBLIC_API_BASE 环境变量 > NODE_ENV 判断
const ENV_API_BASE = (import.meta.env?.PLASMO_PUBLIC_API_BASE as string | undefined) ?? ''

export const API_BASE_URL = ENV_API_BASE
  || (process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/ouu-api'
    : 'https://api.ouu365.com/ouu-api')

// 官网站点地址（用于跳转官网页面：反馈/联系/打赏/指南/我的等）
// 开发环境：本地 VitePress dev server（默认 http://localhost:5173）
// 生产环境：https://www.ouu365.com
// 优先级：PLASMO_PUBLIC_SITE_BASE 环境变量 > NODE_ENV 判断
const ENV_SITE_BASE = (import.meta.env?.PLASMO_PUBLIC_SITE_BASE as string | undefined) ?? ''
export const OFFICIAL_SITE_URL = ENV_SITE_BASE
  || (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : 'https://www.ouu365.com')

// API 路径枚举（后续接口统一在此添加）
// 对应后端 Controller：
// - captchaImage: CaptchaController#getCode
// - sendLoginCode: OuuEmailController#approval
// - loginByEmailCode: OuuLoginController#login
// - feedbackSuggest: OuuCustomerFeedbackController#suggest
// - adList: OuuAdvertisementController#getAdList
// - checkVersion: AppVersionController#checkVersion
export const API_URIS = {
  captchaImage: '/captchaImage',
  sendLoginCode: '/email/send-login-code',
  loginByEmailCode: '/login/login-by-email-code',
  feedbackSuggest: '/feedback/suggest',
  adList: '/ad/list',
  checkVersion: '/version/check-version',
  customerMy: '/customer/my',
  noticePageList: '/notice/page-list',
  settingMenuList: '/setting/menu-list',
  logout: '/logout'
} as const

// 产品 appCode 注册表（值由后端分配，与官网 ouu-web-official 的 config/headers.ts 对齐）
// 插件当前仅启用 tabMaster；bookmarkMaster / translateMaster 为多产品预留
export const APP_CODES = {
  tabMaster: 'app_1001',
  bookmarkMaster: 'app_1002',
  translateMaster: 'app_1003'
} as const

// 官网 URL 上携带的 app-code query key（buildOfficialUrl 统一使用，避免字符串硬编码）
export const APP_CODE_QUERY_KEY = 'app-code'

// 当前插件版本码（int）。发生产前与后端 ouu_apps_version 表 version_code 对齐；
// 每次发生产版本必须 +1（用户硬规矩）。当前未发生产，versionCode=1。
export const APP_VERSION_CODE = 1

// 默认请求头（对应后端 Constants.HEAD_APP_*）
// platform: 1=Web浏览器插件 2=iOS 3=Android 4=微信小程序
// 这些是所有请求都带的公共头；登录后还会自动追加 Authorization + customerType（在 lib/api.ts 的 buildHeaders 统一处理）
// 后续如需新增公共头（如设备标识、渠道等），统一加到这里
export const APP_HEADERS = {
  platform: 1,
  appCode: APP_CODES.tabMaster,
  versionCode: APP_VERSION_CODE
} as const

/**
 * 构造官网页面 URL（统一入口，HeaderMenu / sidepanel 共用，避免多处重复拼接）
 * - 必带 app-code（多产品区分：浏览器标签大师 app_1001 / 翻译大师 app_1003 ...）
 * - 登录态必带 token（官网落地后建立登录态）
 * - token 由调用方传入（本文件不依赖 useAuth，避免循环依赖）
 */
export function buildOfficialUrl(path: string, token?: string | null): string {
  const params = new URLSearchParams({ [APP_CODE_QUERY_KEY]: APP_HEADERS.appCode })
  if (token) params.set('token', token)
  return `${OFFICIAL_SITE_URL}${path}?${params.toString()}`
}
