/**
 * 应用配置中心（集中管理所有可配置项）
 *
 * 当前：前端内置硬编码
 * 后续：部分配置由后端返回（启动时拉取，失败用此兜底）--见下方 @backend 标注
 *
 * 配置分类：
 * - 后端 API（baseURL/路径）：@static 本地固定，不后端返回
 * - 请求头（appCode/versionCode/platform）：@static 本地固定（后端按此识别产品）
 * - 业务配置（广告位/频率/超时/版本号）：@backend 后续可后端返回，前端兜底
 */

// ============ 后端 API（@static 本地固定）===========
export const API_CONFIG = {
  /** 后端 baseURL：dev localhost / prod api.ouu365.com（/ouu-api 是 context-path） */
  baseURL: '',
  /** 接口路径枚举（后续新增接口统一加这） */
  uris: {
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
} as const

// ============ 请求头（@static 本地固定，后端按此识别产品）===========
export const HEADERS_CONFIG = {
  /** platform: 1=Web浏览器插件 2=iOS 3=Android 4=微信小程序 */
  platform: 1,
  /** 产品 appCode（后端分配，标签大师=app_1001） */
  appCode: 'app_1001',
  /** versionCode：与后端 ouu_apps_version 表对齐（当前 101） */
  versionCode: 101
} as const

// ============ 业务配置（@backend 后续可后端返回，前端兜底）===========
export const BUSINESS_CONFIG = {
  /** 广告位标识（@backend 后续后端 ad/list 接口可按此返回，或配置下发） */
  adPosition: 'banner',
  /** 广告每天最多展示次数（@backend 后续可后端下发，控制打扰频率） */
  adMaxShowPerDay: 3,
  /** 广告展示时长（秒，@backend 后端 AdItemVO.duration 已返回，此为兜底） */
  adDefaultDuration: 10,
  /** 版本检查超时（ms） */
  versionCheckTimeout: 3000,
  /** 广告拉取超时（ms） */
  adFetchTimeout: 3000,
  /** 通知拉取超时（ms） */
  noticeFetchTimeout: 5000,
  /** 登录引导 banner 频控：当天关闭当天不再显（自然日重置） */
  loginBannerFreqControl: 'daily' as 'daily' | '7days',
  /** customerType：1=已登录 0=未登录（后端 AccessCustomerTypeEnum，前端按登录态推导，不直接配） */
  customerTypeLoggedIn: 1,
  customerTypeAnonymous: 0
} as const

/**
 * TODO @backend 后续由后端返回的配置清单（启动时拉取，失败用 BUSINESS_CONFIG 兜底）：
 * 1. 广告位 position（当前硬编码 'banner'）-> 后端配置下发，支持多广告位
 * 2. 广告每天最多展示次数（当前 3）-> 后端按产品/用户下发
 * 3. 广告展示时长（当前后端 AdItemVO.duration 已返回，兜底 10）
 * 4. 版本检查策略（频率/超时）-> 后端下发
 * 5. 登录引导 banner 频控周期（当前当天）-> 后端下发
 * 6. 功能分级表（config/feature-tiers.ts 已前端内置，后续 GET /feature-tiers 增量更新）
 * 7. VIP 功能开关（当前无 VIP，预留）-> 后端按用户 isVip 下发可见功能
 * 8. 公告/通知内容（当前 GET /notice/page-list 已返回）
 * 9. 打赏/联系页 URL（当前硬编码 ouu365.com/donate|contact）-> 后端下发或官网配置
 *
 * 后续实现：建 useAppConfig composable，启动时拉 GET /app-config（待后端开发），
 * 合并到 BUSINESS_CONFIG，失败用前端兜底。
 */
