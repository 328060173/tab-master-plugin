/**
 * 浏览器标签大师 API 配置
 * 统一管理接口地址和请求头
 */

// 环境区分：
// - 开发/本地调试：localhost:8080（后端服务地址）
// - 生产环境：api.ouu356.com
// /ouu-api 是后端 context-path 前缀（Controller 路径无此前缀，必须放在 baseURL）
// 如需切换环境，可直接修改下方常量；或用 PLASMO_PUBLIC_API_BASE 环境变量覆盖
const ENV_API_BASE = (import.meta.env?.PLASMO_PUBLIC_API_BASE as string | undefined) ?? ''

export const API_BASE_URL = ENV_API_BASE
  || (import.meta.env?.DEV
    ? 'http://localhost:8080/ouu-api'
    : 'https://api.ouu356.com/ouu-api')

// API 路径枚举（后续接口统一在此添加）
// 对应后端 Controller：
// - captchaImage: CaptchaController#getCode
// - sendLoginCode: OuuEmailController#approval
// - loginByEmailCode: OuuLoginController#login
// - feedbackSuggest: OuuCustomerFeedbackController#suggest
// - adList: OuuAdvertisementController#getAdList
export const API_URIS = {
  captchaImage: '/captchaImage',
  sendLoginCode: '/email/send-login-code',
  loginByEmailCode: '/login/login-by-email-code',
  feedbackSuggest: '/feedback/suggest',
  adList: '/ad/list'
} as const

// 产品 appCode 注册表（值由后端分配）
export const APP_CODES = {
  tabMaster: 'app_1001'
} as const

// 默认请求头（对应后端 Constants.HEAD_APP_*）
// platform: 1=Web浏览器插件 2=iOS 3=Android 4=微信小程序
// 这些是所有请求都带的公共头；登录后还会自动追加 Authorization（在 lib/api.ts 的 buildHeaders 统一处理）
// 后续如需新增公共头（如设备标识、渠道等），统一加到这里
export const APP_HEADERS = {
  platform: 1,
  appCode: APP_CODES.tabMaster,
  versionCode: 1
} as const
