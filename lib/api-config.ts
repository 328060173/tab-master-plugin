/**
 * 浏览器标签大师 API 配置
 * 统一管理接口地址和请求头
 */

// 基础 URL：正式环境，待用户确认；联调可改 localhost:8080
export const API_BASE_URL = 'https://api.ouu365.com/ouu-api'

// API 路径枚举（后续接口统一在此添加）
// 对应后端 Controller：
// - captchaImage: CaptchaController#getCode
// - sendLoginCode: OuuEmailController#approval
// - loginByEmailCode: OuuLoginController#login
// - feedbackSuggest: OuuCustomerFeedbackController#suggest
export const API_URIS = {
  captchaImage: '/captchaImage',
  sendLoginCode: '/email/send-login-code',
  loginByEmailCode: '/login/login-by-email-code',
  feedbackSuggest: '/feedback/suggest'
} as const

// 产品 appCode 注册表（值由后端分配）
export const APP_CODES = {
  tabMaster: 'app_1001'
} as const

// 默认请求头（对应后端 Constants.HEAD_APP_*）
// platform: 1=Web浏览器插件 2=iOS 3=Android 4=微信小程序
export const APP_HEADERS = {
  platform: 1,
  appCode: APP_CODES.tabMaster,
  versionCode: 1
} as const
