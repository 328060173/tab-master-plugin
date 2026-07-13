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
  logout: '/logout'
} as const

// 产品 appCode 注册表（值由后端分配）
export const APP_CODES = {
  tabMaster: 'app_1001'
} as const

/**
 * 将版本号字符串（如 "0.1.0"、"1.2.3"）转换为整数版本码
 * 规则：主版本 * 10000 + 次版本 * 100 + 修订版本
 * 例如：
 *  - "0.1.0" → 0 * 10000 + 1 * 100 + 0 = 100
 *  - "1.2.3" → 1 * 10000 + 2 * 100 + 3 = 10203
 *  - "2.10.5" → 2 * 10000 + 10 * 100 + 5 = 21005
 */
function versionStringToCode(version: string): number {
  try {
    const parts = version.split('.').map(Number)
    const major = parts[0] || 0
    const minor = parts[1] || 0
    const patch = parts[2] || 0
    return major * 10000 + minor * 100 + patch
  } catch {
    return 1
  }
}

// versionCode：与后端约定固定 101（不用 manifest 算的值，后端版本表按此匹配）
// 如需升级版本号，与后端 ouu_apps_version 表 version_code 对齐
const APP_VERSION_CODE = 101

// 默认请求头（对应后端 Constants.HEAD_APP_*）
// platform: 1=Web浏览器插件 2=iOS 3=Android 4=微信小程序
// 这些是所有请求都带的公共头；登录后还会自动追加 Authorization + customerType（在 lib/api.ts 的 buildHeaders 统一处理）
// 后续如需新增公共头（如设备标识、渠道等），统一加到这里
export const APP_HEADERS = {
  platform: 1,
  appCode: APP_CODES.tabMaster,
  versionCode: APP_VERSION_CODE
} as const
