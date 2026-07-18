/**
 * useSkin —— 装扮主题 + 头像框状态管理（静态预览版，不接后端）
 *
 * PRD：docs/prd/avatar-theme-visual.md（§2.2 主题注入机制 / §2.4 背景图 / §3 切换逻辑）
 * 资源：docs/prd/avatar-theme-assets.md
 *
 * 范围（静态阶段）：
 * - 12 套主题（9 套带背景图 + 3 套纯 CSS）+ 8 款头像框（7 PNG + 1 CSS 彩虹）
 * - 启用态存 chrome.storage.local key `tabMasterSkinPreview`，刷新保持
 * - applySkin 把 5 个 CSS 变量写入 :root.style；resetSkin 清掉（回 fallback = 零回归）
 * - 头像框状态仅 ref（不写 CSS 变量，由 AvatarWithFrame 按 frameId prop 渲染）
 *
 * 单例：模块级 _instance，所有 useSkin() 调用共享同一状态（参考 useSettings/useAuth 风格）。
 *
 * 与现有明暗模式（useSettings.theme）的关系：
 * - 明暗模式控制 dark class（亮/暗/系统），是底层明暗
 * - 装扮主题控制背景图+主色，是另一层装饰，两者叠加生效不互斥
 *
 * @TODO 部署前：背景图 webp 体积超标（实际 400KB-1.3MB，要求 ≤45KB），
 *        上线前必须压缩或切到后端 CDN（cdn.ouu365.com/skin/），
 *        届时把 pageBgImage 的 url(...) 换成 CDN 地址并删掉本地 import。
 */
import { ref, computed, onMounted } from 'vue'

// 背景图（9 张，PRD §2.3 需图主题；本地图临时引用，上线前换 CDN）
import bgSakura from '~assets/skin/bg/bg-sakura-spring.webp'
import bgLotus from '~assets/skin/bg/bg-lotus-summer.webp'
import bgMaple from '~assets/skin/bg/bg-maple-autumn.webp'
import bgSnow from '~assets/skin/bg/bg-snow-winter.webp'
import bgGalaxy from '~assets/skin/bg/bg-galaxy-starry.webp'
import bgOcean from '~assets/skin/bg/bg-ocean-wave.webp'
import bgGrassland from '~assets/skin/bg/bg-grassland-field.webp'
import bgRiver from '~assets/skin/bg/bg-river-mountain.webp'
import bgCream from '~assets/skin/bg/bg-cream-cloud.webp'

// 头像框 PNG（7 张，144×144 源图，CSS 缩放复用三档）
import frameBronze from '~assets/skin/frames/frame-bronze-100.png'
import frameBamboo from '~assets/skin/frames/frame-bamboo-green-100.png'
import frameSilver from '~assets/skin/frames/frame-silver-wave-100.png'
import frameSakura from '~assets/skin/frames/frame-sakura-ribbon-100.png'
import frameStardust from '~assets/skin/frames/frame-stardust-silver-100.png'
import frameLaurel from '~assets/skin/frames/frame-laurel-gold-100.png'
import frameCheckin from '~assets/skin/frames/frame-checkin-100-100.png'

// 全局叠加层（body::before 背景图 + 彩虹头像框动画 + 主题工具类）
import '~assets/skin/skin-overlay.css'

// ========== 类型 ==========
export type SkinSeries = 'season' | 'scenery' | 'style'

export interface SkinThemeConfig {
  primary: string
  accentBg: string
  pageBgImage: string // 'none' / `url('...')` / `linear-gradient(...)`（纯色主题用渐变铺底）
  cardRadius: string
  cardBorder: string
  bgOpacity?: string // 可选：覆盖默认背景透明度（图片默认 0.32；纯色主题需更高才显眼，如 0.7）
}

export interface SkinTheme {
  id: string
  name: string
  series: SkinSeries
  hasBg: boolean
  bgUrl?: string // bundled URL，供缩略图用
  config: SkinThemeConfig
}

export interface SkinFrame {
  id: string
  name: string
  type: 'png' | 'css'
  pngUrl?: string
  cssClass?: string
}

interface SkinPersist {
  themeId: string | null
  frameId: string | null
  bgOpacity?: number | null // 用户手动调的背景透明度（0~1）；null/undefined=用主题默认
}

/**
 * 试穿态（临时态，PRD docs/coordination/2026-07-17-prop-shop.md §3 试穿功能）
 *
 * 区别于 purchased（持久使用中态，按 customerId 隔离）：
 * - 试穿态不按账号隔离（同一浏览器同时只有一个试穿）
 * - 存 storage.local 临时 key `tabMasterSkinTryon`，仅作跨页同步通道（options↔sidepanel）
 * - 30 秒自动到期（endAt 时间戳），到时 stopTryon 恢复试穿前状态
 * - 刷新页面：若 endAt 未到，恢复倒计时（继续试穿至到期）；若已到期，清除
 * - 「防白嫖」：不持久化为资产，到期/关页/手动结束均立即失效
 *
 * 优先级（覆盖链）：
 * - 背景图：试穿 bg > purchased bg > 静态主题 pageBgImage > none
 * - 头像框：AvatarWithFrame props.frameUrl > 试穿 frame > purchased frame > 静态 frameId
 */
interface TryonState {
  propId: number
  propType: 1 | 2
  resourceUrl: string
}
interface TryonPersist extends TryonState {
  endAt: number // 试穿到期时间戳（ms）
}
const TRYON_KEY = 'tabMasterSkinTryon'
const TRYON_DURATION_MS = 30_000

// ========== mock 数据（PRD §6.4，写死不接后端） ==========
// 12 套主题：季节 4 + 风景 5（不含机甲战纪，无资源）+ 风格 3
// 主色参考任务说明：春樱粉/盛夏绿/金秋橙/暖冬蓝/星空紫/海浪蓝/草原绿/晴川蓝/奶霜粉
const THEMES: SkinTheme[] = [
  // 季节系列 4
  {
    id: 'theme-sakura-spring', name: '春樱初绽', series: 'season', hasBg: true, bgUrl: bgSakura,
    config: {
      primary: '#ec4899',
      accentBg: 'linear-gradient(135deg, rgba(252,231,243,0.5) 0%, rgba(251,207,232,0.3) 100%)',
      pageBgImage: `url('${bgSakura}')`,
      cardRadius: '0.75rem',
      cardBorder: '1px solid rgba(236,72,153,0.2)',
    },
  },
  {
    id: 'theme-lotus-summer', name: '盛夏清荷', series: 'season', hasBg: true, bgUrl: bgLotus,
    config: {
      primary: '#059669',
      accentBg: 'linear-gradient(135deg, rgba(209,250,229,0.4) 0%, rgba(165,243,252,0.2) 100%)',
      pageBgImage: `url('${bgLotus}')`,
      cardRadius: '0.625rem',
      cardBorder: '1px solid rgba(5,150,105,0.2)',
    },
  },
  {
    id: 'theme-maple-autumn', name: '金秋满陇', series: 'season', hasBg: true, bgUrl: bgMaple,
    config: {
      primary: '#d97706',
      accentBg: 'linear-gradient(135deg, rgba(254,215,170,0.4) 0%, rgba(253,230,138,0.2) 100%)',
      pageBgImage: `url('${bgMaple}')`,
      cardRadius: '0.5rem',
      cardBorder: '1px solid rgba(217,119,6,0.25)',
    },
  },
  {
    id: 'theme-snow-winter', name: '暖冬初雪', series: 'season', hasBg: true, bgUrl: bgSnow,
    config: {
      primary: '#6366f1',
      accentBg: 'linear-gradient(135deg, rgba(224,231,255,0.5) 0%, rgba(199,210,254,0.3) 100%)',
      pageBgImage: `url('${bgSnow}')`,
      cardRadius: '0.625rem',
      cardBorder: '1px solid rgba(99,102,241,0.2)',
    },
  },
  // 风景系列 5（星空/海浪/草原/晴川 + 纯色护眼墨绿）
  {
    id: 'theme-galaxy-starry', name: '星河璀璨', series: 'scenery', hasBg: true, bgUrl: bgGalaxy,
    config: {
      primary: '#6d28d9',
      accentBg: 'linear-gradient(135deg, rgba(237,233,254,0.4) 0%, rgba(196,181,253,0.2) 100%)',
      pageBgImage: `url('${bgGalaxy}')`,
      cardRadius: '0.5rem',
      cardBorder: '1px solid rgba(109,40,217,0.3)',
    },
  },
  {
    id: 'theme-ocean-wave', name: '碧海潮生', series: 'scenery', hasBg: true, bgUrl: bgOcean,
    config: {
      primary: '#0284c7',
      accentBg: 'linear-gradient(135deg, rgba(207,250,254,0.4) 0%, rgba(186,230,253,0.2) 100%)',
      pageBgImage: `url('${bgOcean}')`,
      cardRadius: '0.625rem',
      cardBorder: '1px solid rgba(2,132,199,0.2)',
    },
  },
  {
    id: 'theme-grassland-field', name: '原野牧风', series: 'scenery', hasBg: true, bgUrl: bgGrassland,
    config: {
      primary: '#65a30d',
      accentBg: 'linear-gradient(135deg, rgba(247,254,231,0.4) 0%, rgba(217,249,157,0.2) 100%)',
      pageBgImage: `url('${bgGrassland}')`,
      cardRadius: '0.625rem',
      cardBorder: '1px solid rgba(101,163,13,0.2)',
    },
  },
  {
    id: 'theme-river-mountain', name: '晴川芳洲', series: 'scenery', hasBg: true, bgUrl: bgRiver,
    config: {
      primary: '#0ea5e9',
      accentBg: 'linear-gradient(135deg, rgba(224,242,254,0.5) 0%, rgba(186,230,253,0.3) 100%)',
      pageBgImage: `url('${bgRiver}')`,
      cardRadius: '0.625rem',
      cardBorder: '1px solid rgba(14,165,233,0.2)',
    },
  },
  {
    id: 'theme-eye-green', name: '护眼墨绿', series: 'scenery', hasBg: false,
    config: {
      primary: '#10b981',
      accentBg: 'linear-gradient(135deg, rgba(209,250,229,0.5) 0%, rgba(167,243,208,0.3) 100%)',
      pageBgImage: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      bgOpacity: '0.7',
      cardRadius: '0.625rem',
      cardBorder: '1px solid rgba(16,185,129,0.2)',
    },
  },
  // 风格系列 3（极简纯白 / 暗夜深渊 / 软萌奶霜）
  {
    id: 'theme-pure-white', name: '极简纯白', series: 'style', hasBg: false,
    config: {
      primary: '#4b5563',
      accentBg: 'transparent',
      pageBgImage: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      bgOpacity: '0.6',
      cardRadius: '0.5rem',
      cardBorder: '1px solid rgba(229,231,235,1)',
    },
  },
  {
    id: 'theme-dark-abyss', name: '暗夜深渊', series: 'style', hasBg: false,
    config: {
      primary: '#1f2937',
      accentBg: 'linear-gradient(135deg, rgba(31,41,55,0.15) 0%, rgba(17,24,39,0.1) 100%)',
      pageBgImage: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
      bgOpacity: '0.85',
      cardRadius: '0.5rem',
      cardBorder: '1px solid rgba(75,85,99,0.4)',
    },
  },
  {
    id: 'theme-cream-cloud', name: '软萌奶霜', series: 'style', hasBg: true, bgUrl: bgCream,
    config: {
      primary: '#f472b6',
      accentBg: 'linear-gradient(135deg, rgba(253,242,248,0.5) 0%, rgba(252,231,243,0.3) 100%)',
      pageBgImage: `url('${bgCream}')`,
      cardRadius: '1rem',
      cardBorder: '1px solid rgba(244,114,182,0.25)',
    },
  },
]

// 8 款头像框：7 PNG + 1 CSS 彩虹流光
const FRAMES: SkinFrame[] = [
  { id: 'frame-bronze-100', name: '铜质光环', type: 'png', pngUrl: frameBronze },
  { id: 'frame-bamboo-green', name: '翠竹青', type: 'png', pngUrl: frameBamboo },
  { id: 'frame-silver-wave', name: '银浪纹', type: 'png', pngUrl: frameSilver },
  { id: 'frame-sakura-ribbon', name: '樱粉丝带', type: 'png', pngUrl: frameSakura },
  { id: 'frame-stardust-silver', name: '星辰银', type: 'png', pngUrl: frameStardust },
  { id: 'frame-laurel-gold', name: '金桂冠', type: 'png', pngUrl: frameLaurel },
  { id: 'frame-rainbow-anim', name: '彩虹流光', type: 'css', cssClass: 'tm-frame-rainbow' },
  { id: 'frame-checkin-100', name: '百日签到专属', type: 'png', pngUrl: frameCheckin },
]

const STORAGE_KEY = 'tabMasterSkinPreview'

/**
 * 已购道具「使用中」态本地存储（PRD docs/coordination/2026-07-17-prop-shop.md §2.4）
 *
 * 按 customerId 隔离：key = `tabMasterSkinActive:{customerId}`
 * value = { framePropId, frameResourceUrl, bgPropId, bgResourceUrl }
 * 存 resourceUrl 避免每次重取 /prop/{id}（省带宽，列表只用缩略图）
 * 卸载插件/清缓存即失（不写后端）
 *
 * 同类型各一个 active（frame + bg 可共存），与静态 activeFrameId/activeThemeId 并存。
 * 优先级：purchased > 静态（同类型同时选时 purchased 覆盖静态）
 */
interface PurchasedActive {
  propId: number
  resourceUrl: string
}
interface SkinActivePersist {
  framePropId: number | null
  frameResourceUrl: string | null
  bgPropId: number | null
  bgResourceUrl: string | null
}
const SKIN_ACTIVE_KEY_PREFIX = 'tabMasterSkinActive:'

function skinActiveKey(customerId: string): string {
  return `${SKIN_ACTIVE_KEY_PREFIX}${customerId}`
}

// 防 Vue reactive proxy 经结构化克隆变成数字键对象（[[lesson-reactive-proxy-storage-serialize]]）
const toPure = <T>(x: T): T => JSON.parse(JSON.stringify(x))

// ========== 单例状态 ==========
const activeThemeId = ref<string | null>(null)
const activeFrameId = ref<string | null>(null)
// 用户手动调的背景透明度（0~1）；null=未手动调，用主题 config 默认值
const userBgOpacity = ref<number | null>(null)
const initialized = ref(false)

// 已购道具「使用中」态（覆盖静态主题/框）
const purchasedFrame = ref<PurchasedActive | null>(null)
const purchasedBg = ref<PurchasedActive | null>(null)
// 当前已购态归属的 customerId（用于判断是否需要重载）
const activeCustomerId = ref<string | null>(null)

// ========== 试穿态（临时态，跨页共享，30s 自动到期） ==========
const tryonProp = ref<TryonState | null>(null)
const tryonEndAt = ref<number | null>(null)
// 剩余秒数（供 UI 倒计时显示，每秒由 interval 更新）
const tryonRemaining = ref<number>(0)
// 模块级 interval id（守单例 composable 监听器生命周期红线：不在 onMounted/onUnmounted 注册/移除；
// 由 startTryon 启动、stopTryon 清除，所有 useSkin() 实例共享）
let tryonTimer: ReturnType<typeof setInterval> | null = null

// 派生：当前生效的试穿背景图 URL（供 writeThemeVars 用）
const tryonBgUrl = computed(() => {
  const t = tryonProp.value
  return t && t.propType === 2 ? t.resourceUrl : null
})
// 派生：当前生效的试穿头像框 URL（供 AvatarWithFrame 用）
const tryonFrameUrl = computed(() => {
  const t = tryonProp.value
  return t && t.propType === 1 ? t.resourceUrl : null
})

// 派生：当前启用的主题/头像框（computed，模板可直接 .name）
const activeTheme = computed(() => findTheme(activeThemeId.value))
const activeFrame = computed(() => findFrame(activeFrameId.value))

// ========== 工具 ==========
function findTheme(id: string | null): SkinTheme | null {
  if (!id) return null
  return THEMES.find((t) => t.id === id) ?? null
}
function findFrame(id: string | null): SkinFrame | null {
  if (!id) return null
  return FRAMES.find((f) => f.id === id) ?? null
}

// 把主题 config 写入 :root.style（5 个变量 + bg-opacity）
// override: 用户手动调的透明度，非 null 时覆盖主题默认
// purchasedBgUrl: 已购背景图道具 URL，非空时覆盖 --tm-skin-page-bg-image（purchased 优先级 > 静态主题）
// tryonBgUrl: 试穿背景图道具 URL，优先级最高（> purchased > 静态主题）
function writeThemeVars(
  cfg: SkinThemeConfig | null,
  override?: number | null,
  purchasedBgUrl?: string | null,
  tryonBgUrl?: string | null,
) {
  const root = document.documentElement
  // 背景图优先级：试穿 > purchased > 静态主题 > none
  const effBgUrl = tryonBgUrl ?? purchasedBgUrl ?? null
  if (!cfg) {
    // 清掉全部变量 → CSS 取 fallback → 零回归
    root.style.removeProperty('--tm-skin-primary')
    root.style.removeProperty('--tm-skin-accent-bg')
    root.style.removeProperty('--tm-skin-page-bg-image')
    root.style.removeProperty('--tm-skin-card-radius')
    root.style.removeProperty('--tm-skin-card-border')
    root.style.removeProperty('--tm-skin-bg-opacity')
    // 即便无静态主题，purchased/试穿 bg 仍可独立生效
    if (effBgUrl) {
      root.style.setProperty('--tm-skin-page-bg-image', `url('${effBgUrl}')`)
      root.style.setProperty('--tm-skin-bg-opacity', String(override ?? 0.32))
    }
    return
  }
  root.style.setProperty('--tm-skin-primary', cfg.primary)
  root.style.setProperty('--tm-skin-accent-bg', cfg.accentBg)
  root.style.setProperty('--tm-skin-card-radius', cfg.cardRadius)
  root.style.setProperty('--tm-skin-card-border', cfg.cardBorder)
  // 背景图：试穿 > purchased > 静态主题
  if (effBgUrl) {
    root.style.setProperty('--tm-skin-page-bg-image', `url('${effBgUrl}')`)
  } else {
    root.style.setProperty('--tm-skin-page-bg-image', cfg.pageBgImage)
  }
  // 有背景（图或纯色渐变）→ 透明度；无背景 → 0
  // 优先用用户手动值 override，其次主题 config.bgOpacity，最后默认 0.32
  // purchased/试穿 bg 视为「有背景」，透明度同上规则
  const hasBg = effBgUrl != null || cfg.pageBgImage !== 'none'
  const eff = hasBg
    ? String(override != null ? override : (cfg.bgOpacity ?? 0.32))
    : '0'
  root.style.setProperty('--tm-skin-bg-opacity', eff)
}

// 草稿透明度（PRD：拖动滑块只预览不持久化，点「应用」才落地）
// null=无未应用草稿，回显/写 DOM 用已存值；非 null=用户正在拖动预览中
const draftBgOpacity = ref<number | null>(null)

// 当前生效的背景透明度（供 UI 滑块回显）：
// - 有 draft 显示 draft（拖动中即时跟手）
// - 否则无主题→0；有主题→用户值 ?? 主题默认 ?? 0.32
const bgOpacity = computed(() => {
  if (draftBgOpacity.value != null) return draftBgOpacity.value
  const t = activeTheme.value
  if (!t || t.config.pageBgImage === 'none') return 0
  return userBgOpacity.value ?? Number(t.config.bgOpacity ?? 0.32)
})

// 是否有未应用的透明度草稿（应用按钮可用性依据之一）
const hasBgOpacityDraft = computed(() => draftBgOpacity.value !== null)

// 拖动滑块预览：只写 DOM，不持久化、不写 userBgOpacity
function previewBgOpacity(v: number) {
  const clamped = Math.max(0, Math.min(1, v))
  draftBgOpacity.value = clamped
  writeThemeVars(
    activeTheme.value?.config ?? null,
    clamped,
    purchasedBg.value?.resourceUrl ?? null,
    tryonBgUrl.value,
  )
}

// 应用草稿：写 userBgOpacity + 持久化 + 跨页同步，清 draft
function applyBgOpacity() {
  if (draftBgOpacity.value == null) return
  userBgOpacity.value = draftBgOpacity.value
  persist()
  draftBgOpacity.value = null
}

// 丢弃草稿：清 draft，DOM 回已存值（用于取消/恢复默认/切主题背景）
function resetBgOpacityDraft() {
  if (draftBgOpacity.value == null) return
  draftBgOpacity.value = null
  writeThemeVars(
    activeTheme.value?.config ?? null,
    userBgOpacity.value,
    purchasedBg.value?.resourceUrl ?? null,
    tryonBgUrl.value,
  )
}

// 持久化（只存 id 字符串，无需 toPure）
async function persist() {
  try {
    const data: SkinPersist = {
      themeId: activeThemeId.value,
      frameId: activeFrameId.value,
      bgOpacity: userBgOpacity.value,
    }
    await chrome.storage.local.set({ [STORAGE_KEY]: data })
  } catch (e) {
    console.warn('[useSkin] persist 失败', e)
  }
}

// ========== 已购道具「使用中」态 持久化 ==========
// 读 tabMasterAuth 拿 customerId（不依赖 useAuth，避免循环依赖；useAuth 也是读同一 storage key）
async function resolveCustomerId(): Promise<string | null> {
  try {
    const data = await chrome.storage.local.get('tabMasterAuth')
    const stored = data?.tabMasterAuth as { user?: { id?: string } } | undefined
    const id = stored?.user?.id
    return typeof id === 'string' && id.length > 0 ? id : null
  } catch {
    return null
  }
}

// 从 storage 加载当前 customer 的 purchased active 态
async function loadPurchasedActive() {
  const customerId = await resolveCustomerId()
  // customer 变了（登录/退出/换号）→ 先清内存态，再按新 customer 读
  if (customerId !== activeCustomerId.value) {
    activeCustomerId.value = customerId
    purchasedFrame.value = null
    purchasedBg.value = null
    // 换号：丢弃未应用的透明度草稿
    draftBgOpacity.value = null
  }
  if (!customerId) {
    // 未登录：清掉 DOM purchased bg 覆盖，回静态主题（试穿态保留，独立于登录态）
    writeThemeVars(
      findTheme(activeThemeId.value)?.config ?? null,
      userBgOpacity.value,
      null,
      tryonBgUrl.value,
    )
    return
  }
  try {
    const key = skinActiveKey(customerId)
    const data = await chrome.storage.local.get(key)
    const stored = data[key] as SkinActivePersist | undefined
    if (stored) {
      purchasedFrame.value = stored.framePropId != null && stored.frameResourceUrl
        ? { propId: stored.framePropId, resourceUrl: stored.frameResourceUrl }
        : null
      purchasedBg.value = stored.bgPropId != null && stored.bgResourceUrl
        ? { propId: stored.bgPropId, resourceUrl: stored.bgResourceUrl }
        : null
    } else {
      purchasedFrame.value = null
      purchasedBg.value = null
    }
  } catch (e) {
    console.warn('[useSkin] 读取 purchased active 失败', e)
    purchasedFrame.value = null
    purchasedBg.value = null
  }
  // 重写 DOM 变量（试穿 bg > purchased bg > 静态主题）
  writeThemeVars(
    findTheme(activeThemeId.value)?.config ?? null,
    userBgOpacity.value,
    purchasedBg.value?.resourceUrl ?? null,
    tryonBgUrl.value,
  )
}

// 写当前 customer 的 purchased active 态到 storage（跨页同步靠 storage.onChanged）
async function persistPurchasedActive() {
  const customerId = activeCustomerId.value
  if (!customerId) return
  try {
    const data: SkinActivePersist = {
      framePropId: purchasedFrame.value?.propId ?? null,
      frameResourceUrl: purchasedFrame.value?.resourceUrl ?? null,
      bgPropId: purchasedBg.value?.propId ?? null,
      bgResourceUrl: purchasedBg.value?.resourceUrl ?? null,
    }
    await chrome.storage.local.set({ [skinActiveKey(customerId)]: toPure(data) })
  } catch (e) {
    console.warn('[useSkin] persist purchased active 失败', e)
  }
}

// ========== 试穿态实现（PRD docs/coordination/2026-07-17-prop-shop.md §3） ==========
// 倒计时 interval：模块级单 timer，所有 useSkin() 实例共享。
// 守单例 composable 监听器生命周期红线：不在 onMounted/onUnmounted 注册/移除，
// 仅在 startTryon/applyTryonState 启动、stopTryon/clearTryonState 清除。
function clearTryonTimer() {
  if (tryonTimer !== null) {
    clearInterval(tryonTimer)
    tryonTimer = null
  }
}

function startTryonTimer() {
  clearTryonTimer()
  tryonTimer = setInterval(() => {
    const end = tryonEndAt.value
    if (end == null) {
      clearTryonTimer()
      return
    }
    const remainingMs = end - Date.now()
    if (remainingMs <= 0) {
      // 到期 → 自动停止试穿（恢复试穿前状态）
      stopTryon()
      return
    }
    tryonRemaining.value = Math.ceil(remainingMs / 1000)
  }, 1000)
}

// 内部：套用试穿态到内存 + DOM（不写 storage，供 storage.onChanged 同步路径用）
// persistStorage: true=本页发起 startTryon，需写 storage 让其他页同步；false=其他页已写，仅本地套用
function applyTryonState(state: TryonPersist, persistStorage: boolean) {
  tryonProp.value = {
    propId: state.propId,
    propType: state.propType,
    resourceUrl: state.resourceUrl,
  }
  tryonEndAt.value = state.endAt
  tryonRemaining.value = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000))
  // 写 DOM 变量（试穿 bg 覆盖 purchased/静态）
  writeThemeVars(
    findTheme(activeThemeId.value)?.config ?? null,
    userBgOpacity.value,
    purchasedBg.value?.resourceUrl ?? null,
    tryonBgUrl.value,
  )
  startTryonTimer()
  if (persistStorage) {
    chrome.storage.local
      .set({ [TRYON_KEY]: toPure(state) })
      .catch((e) => console.warn('[useSkin] 写试穿态 storage 失败', e))
  }
}

// 内部：清除试穿态（内存 + DOM + timer），可选清 storage
// persistStorage: true=本页停止，需清 storage 让其他页同步；false=其他页已清
function clearTryonState(persistStorage: boolean) {
  const wasActive = tryonProp.value !== null
  tryonProp.value = null
  tryonEndAt.value = null
  tryonRemaining.value = 0
  clearTryonTimer()
  if (wasActive) {
    // 重写 DOM 变量 → 回落到 purchased / 静态主题 / 默认
    writeThemeVars(
      findTheme(activeThemeId.value)?.config ?? null,
      userBgOpacity.value,
      purchasedBg.value?.resourceUrl ?? null,
      null,
    )
  }
  if (persistStorage) {
    chrome.storage.local
      .remove(TRYON_KEY)
      .catch((e) => console.warn('[useSkin] 清试穿态 storage 失败', e))
  }
}

// 从 storage 加载试穿态（init 时调用，处理跨页/刷新场景）
async function loadTryon() {
  try {
    const data = await chrome.storage.local.get(TRYON_KEY)
    const stored = data[TRYON_KEY] as TryonPersist | undefined
    if (stored && stored.endAt > Date.now()) {
      // 试穿未到期 → 恢复倒计时（不回写 storage，避免循环）
      applyTryonState(stored, false)
    } else if (stored) {
      // 试穿已过期但 storage 残留 → 清掉（防脏数据）
      chrome.storage.local.remove(TRYON_KEY).catch(() => {})
    }
  } catch (e) {
    console.warn('[useSkin] 读取试穿态失败', e)
  }
}

// 启动试穿（用户点「试穿」按钮触发）
function startTryon(propId: number, propType: 1 | 2, resourceUrl: string) {
  const state: TryonPersist = {
    propId,
    propType,
    resourceUrl,
    endAt: Date.now() + TRYON_DURATION_MS,
  }
  applyTryonState(state, true)
}

// 停止试穿（用户点「结束试穿」或 30s 到期自动触发）
function stopTryon() {
  clearTryonState(true)
}

// 监听 storage 变化（多页/多窗口同步）
function handleStorageChange(
  changes: { [key: string]: chrome.storage.StorageChange },
  areaName: string,
) {
  if (areaName !== 'local') return
  // 静态主题装扮变化
  if (changes[STORAGE_KEY]) {
    const next = changes[STORAGE_KEY].newValue as SkinPersist | undefined
    if (next) {
      const newTheme = next.themeId ?? null
      const newFrame = next.frameId ?? null
      const newOpacity = next.bgOpacity ?? null
      let changed = false
      if (newTheme !== activeThemeId.value) {
        activeThemeId.value = newTheme
        changed = true
      }
      if (newFrame !== activeFrameId.value) {
        activeFrameId.value = newFrame
      }
      if (newOpacity !== userBgOpacity.value) {
        userBgOpacity.value = newOpacity
        changed = true
      }
      // 其他页 applyBgOpacity 写了 storage → 本页丢弃本地草稿，以新存值为准
      if (draftBgOpacity.value !== null) {
        draftBgOpacity.value = null
        changed = true
      }
      // 主题或透明度变了都要重写 DOM 变量
      if (changed) {
        writeThemeVars(
          findTheme(activeThemeId.value)?.config ?? null,
          userBgOpacity.value,
          purchasedBg.value?.resourceUrl ?? null,
          tryonBgUrl.value,
        )
      }
    }
  }
  // 登录态变化（tabMasterAuth）→ 重载 purchased active（customer 可能变了）
  if (changes['tabMasterAuth']) {
    loadPurchasedActive().catch((e) => console.warn('[useSkin] loadPurchasedActive 失败', e))
  }
  // 已购使用中态变化（本页或其他页改了 active）
  for (const key of Object.keys(changes)) {
    if (key.startsWith(SKIN_ACTIVE_KEY_PREFIX)) {
      loadPurchasedActive().catch((e) => console.warn('[useSkin] loadPurchasedActive 失败', e))
      break
    }
  }
  // 试穿态变化（其他页 startTryon / stopTryon / 到期）
  if (changes[TRYON_KEY]) {
    const next = changes[TRYON_KEY].newValue as TryonPersist | undefined
    if (next && next.endAt > Date.now()) {
      // 其他页启动/更新了试穿 → 本页同步套用（不回写 storage，避免循环）
      applyTryonState(next, false)
    } else {
      // 试穿结束（到期/手动停止）→ 本页恢复
      clearTryonState(false)
    }
  }
}

// ========== 初始化 ==========
async function init() {
  if (initialized.value) return
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const stored = result[STORAGE_KEY] as SkinPersist | undefined
    if (stored) {
      activeThemeId.value = stored.themeId ?? null
      activeFrameId.value = stored.frameId ?? null
      userBgOpacity.value = stored.bgOpacity ?? null
    }
  } catch (e) {
    console.warn('[useSkin] 读取 storage 失败', e)
  }
  // 应用当前主题到 DOM（带用户透明度；purchased/tryon bg 暂未加载，先写静态）
  writeThemeVars(
    findTheme(activeThemeId.value)?.config ?? null,
    userBgOpacity.value,
    null,
    null,
  )
  // 加载已购道具使用中态（按 customerId 隔离，可能覆盖静态 bg）
  await loadPurchasedActive()
  // 加载试穿态（跨页同步：若其他页正在试穿且未到期，本页同步套用 + 续倒计时）
  await loadTryon()
  // 监听跨页同步
  try {
    chrome.storage.onChanged.addListener(handleStorageChange)
  } catch (e) {
    console.warn('[useSkin] 注册 storage.onChanged 失败', e)
  }
  initialized.value = true
}

// ========== 导出 hook ==========
export function useSkin() {
  onMounted(() => {
    init()
  })

  // 启用主题（写 CSS 变量 + 持久化）。传 null = 清主题
  function applyTheme(themeId: string | null) {
    activeThemeId.value = themeId
    writeThemeVars(
      findTheme(themeId)?.config ?? null,
      userBgOpacity.value,
      purchasedBg.value?.resourceUrl ?? null,
      tryonBgUrl.value,
    )
    persist()
  }

  // 启用头像框（仅状态，不写 CSS 变量）。传 null = 清框
  function applyFrame(frameId: string | null) {
    activeFrameId.value = frameId
    persist()
  }

  // ========== 已购道具「使用中」操作（PRD 2026-07-17-prop-shop） ==========
  // 使用已购头像框道具：存 propId + resourceUrl，AvatarWithFrame 通过 purchasedFrameUrl 自动消费
  function applyPurchasedFrame(propId: number, resourceUrl: string) {
    purchasedFrame.value = { propId, resourceUrl }
    persistPurchasedActive().catch((e) => console.warn('[useSkin] persistPurchasedActive 失败', e))
  }
  // 使用已购背景图道具：覆盖 --tm-skin-page-bg-image（复用 bgOpacity）
  function applyPurchasedBg(propId: number, resourceUrl: string) {
    purchasedBg.value = { propId, resourceUrl }
    // 切了背景图，旧透明度草稿无意义 → 丢弃
    draftBgOpacity.value = null
    writeThemeVars(
      findTheme(activeThemeId.value)?.config ?? null,
      userBgOpacity.value,
      resourceUrl,
      tryonBgUrl.value,
    )
    persistPurchasedActive().catch((e) => console.warn('[useSkin] persistPurchasedActive 失败', e))
  }
  // 清除某类型已购使用中态：type='frame'|'bg'
  function clearPurchased(type: 'frame' | 'bg') {
    if (type === 'frame') {
      purchasedFrame.value = null
    } else {
      purchasedBg.value = null
      // 恢复默认背景图 → 丢弃未应用草稿
      draftBgOpacity.value = null
      writeThemeVars(
        findTheme(activeThemeId.value)?.config ?? null,
        userBgOpacity.value,
        null,
        tryonBgUrl.value,
      )
    }
    persistPurchasedActive().catch((e) => console.warn('[useSkin] persistPurchasedActive 失败', e))
  }

  // 一键恢复默认（清主题 + 清框 + 清用户透明度；不清 purchased，那是登录态绑定的）
  function resetSkin() {
    activeThemeId.value = null
    activeFrameId.value = null
    userBgOpacity.value = null
    draftBgOpacity.value = null
    writeThemeVars(null, null, purchasedBg.value?.resourceUrl ?? null, tryonBgUrl.value)
    persist()
  }

  // 清除全部「使用中」已购道具态（头像框 + 背景图都回默认；不清已购记录，那些在后端）
  // 用户点「恢复默认」用：本地使用中态清掉，主题背景/头像框回到默认（无 purchased 覆盖）。
  function clearAllActive() {
    purchasedFrame.value = null
    purchasedBg.value = null
    writeThemeVars(
      findTheme(activeThemeId.value)?.config ?? null,
      userBgOpacity.value,
      null,
      tryonBgUrl.value,
    )
    persistPurchasedActive().catch((e) => console.warn('[useSkin] persistPurchasedActive 失败', e))
  }

  return {
    // 状态
    activeThemeId,
    activeFrameId,
    themes: THEMES,
    frames: FRAMES,
    // 派生
    activeTheme,
    activeFrame,
    bgOpacity,
    hasBgOpacityDraft,
    // 已购道具使用中态
    purchasedFrame,
    purchasedBg,
    purchasedFrameUrl: computed(() => purchasedFrame.value?.resourceUrl ?? null),
    purchasedBgUrl: computed(() => purchasedBg.value?.resourceUrl ?? null),
    // 试穿态（临时态，30s 自动到期，跨页同步）
    tryonProp,
    tryonRemaining,
    tryonFrameUrl,
    tryonBgUrl,
    // 操作
    applyTheme,
    applyFrame,
    previewBgOpacity,
    applyBgOpacity,
    resetBgOpacityDraft,
    resetSkin,
    applyPurchasedFrame,
    applyPurchasedBg,
    clearPurchased,
    clearAllActive,
    loadPurchasedActive,
    // 试穿操作
    startTryon,
    stopTryon,
  }
}
