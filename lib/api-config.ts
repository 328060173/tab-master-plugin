/**
 * TM-浏览器标签整理大师 API 配置
 * 统一管理接口地址和请求头
 *
 * 环境地址（Plasmo 规范，全仓唯一配置处）：
 * 读 env 用 process.env.PLASMO_PUBLIC_*（Plasmo 构建期静态替换，见 https://docs.plasmo.com/framework/env）。
 * 优先级：PLASMO_PUBLIC_* env 变量 > process.env.NODE_ENV 判断（dev=development→本地，prod=production→生产）。
 * 切换环境：改 .env.development / .env.production，或设对应 PLASMO_PUBLIC_* 变量。
 *
 * - API_BASE_URL：后端接口（dev→localhost:8080，prod→api.ouu365.com）；PLASMO_PUBLIC_API_BASE 覆盖
 * - OFFICIAL_SITE_URL：官网跳转/内嵌（dev→localhost:5173，prod→www.ouu365.com）；PLASMO_PUBLIC_SITE_BASE 覆盖
 * - MENU_SITE_URL：设置菜单默认项 URL（单独变量，默认=生产官网，便于本地也看真实菜单内容）；PLASMO_PUBLIC_MENU_SITE 覆盖
 * /ouu-api 是后端 context-path 前缀（Controller 路径无此前缀，必须放在 baseURL）
 */
// 后端 API 地址
export const API_BASE_URL =
  process.env.PLASMO_PUBLIC_API_BASE ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8080/ouu-api"
    : "https://api.ouu365.com/ouu-api")

// 官网站点地址（跳转官网页面：反馈/联系/我的等；dev 联调本地 VitePress，prod 生产官网）
export const OFFICIAL_SITE_URL =
  process.env.PLASMO_PUBLIC_SITE_BASE ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://www.ouu365.com")

// 设置菜单默认项 URL（useSettingMenu DEFAULT_MENUS 用）。
// 单独变量：菜单是给用户看的真实官网内容，默认始终指生产官网；本地联调菜单样式改这里或设 PLASMO_PUBLIC_MENU_SITE。
export const MENU_SITE_URL =
  process.env.PLASMO_PUBLIC_MENU_SITE || "https://www.ouu365.com"

// API 路径枚举（后续接口统一在此添加）
// 对应后端 Controller：
// - captchaImage: CaptchaController#getCode
// - sendLoginCode: OuuEmailController#approval
// - loginByEmailCode: OuuLoginController#login
// - feedbackSuggest: OuuCustomerFeedbackController#suggest
// - nudgeAuthor: OuuCustomerFeedbackController#nudgeAuthor（云同步催作者，2026-07-28）
// - adList: OuuAdvertisementController#getAdList
// - checkVersion: AppVersionController#checkVersion
export const API_URIS = {
  captchaImage: "/captchaImage",
  sendLoginCode: "/email/send-login-code",
  loginByEmailCode: "/login/login-by-email-code",
  feedbackSuggest: "/feedback/suggest",
  // 催作者（云同步开发中页，2026-07-28 立）：POST /feedback/nudge-author { email?, remark? }
  nudgeAuthor: "/feedback/nudge-author",
  adList: "/ad/list",
  // 多槽位广告（备份独立页专用，2026-07-28 立）：一次请求取多个 position 的广告
  // 对应后端 OuuAdvertisementController#listByPositions
  adListByPositions: "/ad/listbypositions",
  checkVersion: "/version/check-version",
  customerMy: "/customer/my",
  // 更新性别（2026-07-18 性别头像，对应后端 OuuCustomerController#updateSex）
  customerUpdateSex: "/customer/update-sex",
  // 签到/积分（2026-07-17 个人中心用，对应后端 OuuCustomerController）
  checkinToday: "/customer/checkin/today",
  checkin: "/customer/checkin",
  pointsBill: "/customer/points/bill",
  noticePageList: "/notice/page-list",
  settingMenuList: "/setting/menu-list",
  logout: "/logout",
  // 道具商城（2026-07-17，对应后端 OuuPropController）
  propList: "/prop/list",
  propExchange: "/prop/exchange"
} as const

/**
 * 道具详情 URI（按 id 拼接）：GET /prop/{id}
 * 单独函数：API_URIS 是 as const 字符串表，路径变量不能静态化
 */
export function propDetailUri(id: number | string): string {
  return `/prop/${id}`
}

// 产品 appCode 注册表（值由后端分配，与官网 ouu-web-official 的 config/headers.ts 对齐）
// 插件当前仅启用 tabMaster；bookmarkMaster / translateMaster 为多产品预留
export const APP_CODES = {
  tabMaster: "app_1001",
  bookmarkMaster: "app_1002",
  translateMaster: "app_1003"
} as const

// 官网 URL 上携带的 app-code query key（buildOfficialUrl 统一使用，避免字符串硬编码）
export const APP_CODE_QUERY_KEY = "app-code"

// 当前插件版本码（int）。发生产前与后端 ouu_apps_version 表 version_code 对齐；
// 每次发生产版本必须 +1（用户硬规矩）。当前已发生产，versionName=1.2.0 / versionCode=12（2026-07-29 备份导入导出上线）。
export const APP_VERSION_CODE = 12

// 版本名（string，用户可见）。单一来源红线：全项目取此变量，禁止多处写死。
// 备份快照元数据 appVersionName、manifest、下载页等统一引用此处。
export const APP_VERSION_NAME = "1.2.0"

// 登录态 storage key（chrome.storage.local 中的字段名）
// 单一来源红线：api.ts（缓存层读 storage）与 useAuth.ts（读写 storage）共用以避免散落硬编码
export const AUTH_STORAGE_KEY = "tabMasterAuth"

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
 * - 必带 app-code（多产品区分：TM-浏览器标签整理大师 app_1001 / 翻译大师 app_1003 ...）
 * - 登录态必带 token（官网落地后建立登录态）
 * - token 由调用方传入（本文件不依赖 useAuth，避免循环依赖）
 */
export function buildOfficialUrl(path: string, token?: string | null): string {
  const params = new URLSearchParams({
    [APP_CODE_QUERY_KEY]: APP_HEADERS.appCode
  })
  if (token) params.set("token", token)
  return `${OFFICIAL_SITE_URL}${path}?${params.toString()}`
}
