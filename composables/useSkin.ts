/**
 * useSkin —— 装扮主题 + 头像框状态管理（商城驱动版，纯色背景走后端 /prop/list?propType=3）
 *
 * 范围（商城驱动阶段）：
 * - 头像框道具（propType=1，PNG）/ 主题背景图道具（propType=2，webp）/ 主题纯色背景道具（propType=3，CSS 值如 linear-gradient）
 * - 三类都走标准兑换流程（免费不扣积分），由 options.vue 商城面板渲染
 * - 已购「使用中」态存 chrome.storage.local key `tabMasterSkinActive:{customerId}`（按用户隔离）
 * - 背景透明度存 `tabMasterSkinOpacity:{customerId}`（按用户隔离，独立 key）
 * - writeThemeVars 把 --tm-skin-page-bg-image / --tm-skin-bg-opacity 写入 :root.style
 * - 头像框状态仅 ref（不写 CSS 变量，由 AvatarWithFrame 按 purchasedFrameUrl/tryonFrameUrl 渲染）
 * - skin-overlay.css 的 --tm-skin-primary 等变量定义与 .tm-skin-primary-* 工具类保留不动（按钮走 fallback #2563eb，删静态主题视觉无变化）
 *
 * 单例：模块级 _instance，所有 useSkin() 调用共享同一状态（参考 useSettings/useAuth 风格）。
 *
 * 与现有明暗模式（useSettings.theme）的关系：
 * - 明暗模式控制 dark class（亮/暗/系统），是底层明暗
 * - 装扮主题控制背景图+主色，是另一层装饰，两者叠加生效不互斥
 */
import { toPure } from "~lib/toPure"
import { ref, computed, onMounted } from 'vue'

// 全局叠加层（body::before 背景图 + 彩虹头像框动画 + 主题工具类）
// skin-overlay.css 的变量定义和工具类保留不动（删静态主题后按钮走 fallback #2563eb）
import '~assets/skin/skin-overlay.css'

// ========== 类型 ==========

/**
 * 生效背景（image=webp url / solid=CSS 值如 linear-gradient，不包 url()）
 * writeThemeVars 按 type 决定是否包 url()，纯色 CSS 值直接用
 */
export interface EffectiveBg {
  type: 'image' | 'solid'
  value: string
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
 * - 背景图：试穿 bg > purchased bg > none
 * - 头像框：AvatarWithFrame props.frameUrl > 试穿 frame > purchased frame
 */
interface TryonState {
  propId: number
  propType: 1 | 2 | 3 // 1=头像框 2=webp背景 3=纯色背景（内部仅按 ===1 区分头像框 vs 背景）
  resourceUrl: string
  bgType?: 'image' | 'solid' // 背景道具的渲染类型（webp=image / 纯色=solid），头像框无此字段
}
interface TryonPersist extends TryonState {
  endAt: number // 试穿到期时间戳（ms）
}
const TRYON_KEY = 'tabMasterSkinTryon'
const TRYON_DURATION_MS = 30_000

/**
 * 已购道具「使用中」态本地存储（PRD docs/coordination/2026-07-17-prop-shop.md §2.4）
 *
 * 按 customerId 隔离：key = `tabMasterSkinActive:{customerId}`
 * value = { framePropId, frameResourceUrl, bgPropId, bgResourceUrl, bgType }
 * 存 resourceUrl + bgType 避免每次重取 /prop/{id}（省带宽，列表只用缩略图）
 * 卸载插件/清缓存即失（不写后端）
 *
 * 同类型各一个 active（frame + bg 可共存）；purchasedBg 单值，webp/纯色互相覆盖（无需专门互斥代码）
 */
interface PurchasedActive {
  propId: number
  resourceUrl: string
  bgType?: 'image' | 'solid' // 背景道具的渲染类型；旧 storage 无此字段时按 'image' 兜底（向后兼容）
}
interface SkinActivePersist {
  framePropId: number | null
  frameResourceUrl: string | null
  bgPropId: number | null
  bgResourceUrl: string | null
  bgType: 'image' | 'solid' | null
}
const SKIN_ACTIVE_KEY_PREFIX = 'tabMasterSkinActive:'

function skinActiveKey(customerId: string): string {
  return `${SKIN_ACTIVE_KEY_PREFIX}${customerId}`
}

/**
 * 背景透明度独立存储（按 customerId 隔离）
 *
 * key = `tabMasterSkinOpacity:{customerId}`，value = { bgOpacity: number | null }
 * 未登录不写（避免匿名态覆盖登录态）；换号时清非当前 id 残留
 */
interface SkinOpacityPersist {
  bgOpacity: number | null
}
const SKIN_OPACITY_KEY_PREFIX = 'tabMasterSkinOpacity:'

function skinOpacityKey(customerId: string): string {
  return `${SKIN_OPACITY_KEY_PREFIX}${customerId}`
}

// 透明度「实时同步」临时 key（不绑 id）：任何页面拖动滑块都写这个 key，
// 其他页 storage.onChanged 收到后即时 writeThemeVars 同步背景透明度。
// 与按 id 隔离的持久化记忆（skinOpacityKey）分离：
// - 实时同步（本 key）：跨页即时跟变，未登录/试穿也生效（与试穿 TRYON_KEY 同性质）
// - 持久化记忆（id key）：仅登录用户「使用中」的透明度记住，退出清、换号隔离
const SKIN_OPACITY_LIVE_KEY = 'tabMasterSkinBgOpacityLive'

// 防 Vue reactive proxy 经结构化克隆变成数字键对象（[[lesson-reactive-proxy-storage-serialize]]）

// ========== 单例状态 ==========
// 用户手动调的背景透明度（0~1）；null=未手动调，用默认值（image=0.32 / solid=0.6）
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

// 派生：当前生效的背景（替代旧 tryonBgUrl；image=webp url / solid=CSS 值）
// 试穿 bg (propType=2 或 3) > purchasedBg > null
const effectiveBg = computed<EffectiveBg | null>(() => {
  const t = tryonProp.value
  if (t && t.propType !== 1) {
    return { type: t.bgType ?? 'image', value: t.resourceUrl }
  }
  const b = purchasedBg.value
  if (b) {
    return { type: b.bgType ?? 'image', value: b.resourceUrl }
  }
  return null
})

// 派生：当前生效的试穿头像框 URL（供 AvatarWithFrame 用）
const tryonFrameUrl = computed(() => {
  const t = tryonProp.value
  return t && t.propType === 1 ? t.resourceUrl : null
})

// ========== 工具 ==========
// 把生效背景 + 透明度写入 :root.style
// - bg=null → 清掉两个变量（CSS 取 fallback，零回归）
// - bg.type='image' → 包 url('...')；bg.type='solid' → 直接用 CSS 值（不包 url）
// - opacity=null → 按 bg.type 默认（solid 0.6 / image 0.32）
function writeThemeVars(bg: EffectiveBg | null, opacity: number | null) {
  const root = document.documentElement
  if (!bg) {
    root.style.removeProperty('--tm-skin-page-bg-image')
    root.style.removeProperty('--tm-skin-bg-opacity')
    return
  }
  const imgVal = bg.type === 'image' ? `url('${bg.value}')` : bg.value
  root.style.setProperty('--tm-skin-page-bg-image', imgVal)
  root.style.setProperty(
    '--tm-skin-bg-opacity',
    String(opacity ?? (bg.type === 'solid' ? 0.45 : 0.32)),
  )
}

// 当前生效的背景透明度（供 UI 滑块回显）：
// 无生效背景→0；有生效背景→用户值 ?? 默认（solid 0.6 / image 0.32）
const bgOpacity = computed(() => {
  const bg = effectiveBg.value
  if (!bg) return 0
  return userBgOpacity.value ?? (bg.type === 'solid' ? 0.45 : 0.32)
})

// 拖动滑块即时生效：
// 1. 写本页 DOM（本页即时跟手）
// 2. 写临时同步 key（不绑 id，未登录/试穿也写）→ 其他页 storage.onChanged 实时同步
// 3. 登录用户额外写 id key（持久化记忆，退出清、换号隔离）
function setBgOpacity(v: number) {
  const clamped = Math.max(0, Math.min(1, v))
  userBgOpacity.value = clamped
  writeThemeVars(effectiveBg.value, clamped)
  // 实时同步（不绑 id，跨页即时）
  chrome.storage.local
    .set({ [SKIN_OPACITY_LIVE_KEY]: toPure({ bgOpacity: clamped, at: Date.now() }) })
    .catch((e) => console.warn('[useSkin] 写 opacity live 失败', e))
  // 持久化记忆（仅登录）
  persist()
}

// 持久化背景透明度（按 customerId 隔离；未登录不写——避免匿名态覆盖登录态）
// toPure 守 reactive-proxy 序列化红线（虽然这里多是基础类型，仍统一转纯）
async function persist() {
  const cid = activeCustomerId.value
  if (!cid) return // 未登录：不写
  try {
    const data: SkinOpacityPersist = {
      bgOpacity: userBgOpacity.value,
    }
    await chrome.storage.local.set({ [skinOpacityKey(cid)]: toPure(data) })
  } catch (e) {
    console.warn('[useSkin] persist 失败', e)
  }
}

// 清理非当前 customerId 的 skinOpacity / skinActive 残留（换号时调用，防脏数据互窜）
async function cleanOtherCustomerCache(keepId: string) {
  try {
    const all = (await chrome.storage.local.get(null)) as Record<string, unknown>
    const toRemove: string[] = []
    for (const k of Object.keys(all)) {
      if (k.startsWith(SKIN_OPACITY_KEY_PREFIX) && k !== skinOpacityKey(keepId)) {
        toRemove.push(k)
      } else if (k.startsWith(SKIN_ACTIVE_KEY_PREFIX) && k !== skinActiveKey(keepId)) {
        toRemove.push(k)
      }
    }
    if (toRemove.length > 0) await chrome.storage.local.remove(toRemove)
  } catch (e) {
    console.warn('[useSkin] 清理其他用户缓存失败', e)
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

// 按 customerId 读背景透明度，恢复 userBgOpacity
async function loadOpacity(customerId: string) {
  try {
    const key = skinOpacityKey(customerId)
    const data = await chrome.storage.local.get(key)
    const stored = data[key] as SkinOpacityPersist | undefined
    if (stored) {
      userBgOpacity.value = stored.bgOpacity ?? null
    } else {
      userBgOpacity.value = null
    }
  } catch (e) {
    console.warn('[useSkin] 读取 skinOpacity 失败', e)
    userBgOpacity.value = null
  }
}

// 从 storage 加载当前 customer 的 purchased active 态
async function loadPurchasedActive() {
  const customerId = await resolveCustomerId()
  // customer 变了（登录/退出/换号）→ 先清内存态，再按新 customer 读
  if (customerId !== activeCustomerId.value) {
    activeCustomerId.value = customerId
    // 换号：清透明度/purchased（防上一用户态串到新用户）
    userBgOpacity.value = null
    purchasedFrame.value = null
    purchasedBg.value = null
    if (customerId) {
      // 换号到新用户：清非当前 id 的 skinOpacity/skinActive 残留
      await cleanOtherCustomerCache(customerId)
      // 恢复新用户的背景透明度
      await loadOpacity(customerId)
    }
  }
  if (!customerId) {
    // 未登录：清掉 DOM bg，回默认（试穿态保留，独立于登录态）
    writeThemeVars(effectiveBg.value, userBgOpacity.value)
    return
  }
  try {
    const key = skinActiveKey(customerId)
    const data = await chrome.storage.local.get(key)
    const stored = data[key] as SkinActivePersist | undefined
    if (stored) {
      purchasedFrame.value =
        stored.framePropId != null && stored.frameResourceUrl
          ? { propId: stored.framePropId, resourceUrl: stored.frameResourceUrl }
          : null
      purchasedBg.value =
        stored.bgPropId != null && stored.bgResourceUrl
          ? {
              propId: stored.bgPropId,
              resourceUrl: stored.bgResourceUrl,
              bgType: stored.bgType ?? 'image', // 旧 storage 无 bgType 按 image 兜底
            }
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
  // 重写 DOM 变量（试穿 bg > purchased bg）
  writeThemeVars(effectiveBg.value, userBgOpacity.value)
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
      bgType: purchasedBg.value?.bgType ?? null,
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
    bgType: state.bgType,
  }
  tryonEndAt.value = state.endAt
  tryonRemaining.value = Math.max(0, Math.ceil((state.endAt - Date.now()) / 1000))
  // 写 DOM 变量（试穿 bg 覆盖 purchased）
  writeThemeVars(effectiveBg.value, userBgOpacity.value)
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
    // 重写 DOM 变量 → 回落到 purchased / 默认
    writeThemeVars(effectiveBg.value, userBgOpacity.value)
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
// bgType 仅背景道具(propType=2 或 3)需要：webp='image' / 纯色='solid'；头像框不传
function startTryon(
  propId: number,
  propType: 1 | 2 | 3,
  resourceUrl: string,
  bgType?: 'image' | 'solid',
) {
  const state: TryonPersist = {
    propId,
    propType,
    resourceUrl,
    bgType,
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
  // 透明度「实时同步」临时 key（不绑 id）：其他页拖动滑块 → 本页即时同步背景透明度
  // 这是跨页同步的主力通道（未登录/试穿也生效，与 TRYON_KEY 同性质）
  if (changes[SKIN_OPACITY_LIVE_KEY]) {
    const next = changes[SKIN_OPACITY_LIVE_KEY].newValue as { bgOpacity: number } | undefined
    const newOpacity = next?.bgOpacity
    if (typeof newOpacity === 'number' && newOpacity !== userBgOpacity.value) {
      userBgOpacity.value = newOpacity
      writeThemeVars(effectiveBg.value, newOpacity)
    }
  }
  // 透明度「持久化记忆」id key（登录用户「使用中」透明度被其他页改了 → 本页同步内存值）
  for (const key of Object.keys(changes)) {
    if (
      key.startsWith(SKIN_OPACITY_KEY_PREFIX) &&
      key === skinOpacityKey(activeCustomerId.value ?? '')
    ) {
      const next = changes[key].newValue as SkinOpacityPersist | undefined
      const newOpacity = next?.bgOpacity ?? null
      if (newOpacity !== userBgOpacity.value) {
        userBgOpacity.value = newOpacity
        writeThemeVars(effectiveBg.value, userBgOpacity.value)
      }
      break
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
    // 先解析 customerId，按 id 隔离读 skinOpacity（未登录跳过，全默认）
    const cid = await resolveCustomerId()
    activeCustomerId.value = cid
    if (cid) {
      await loadOpacity(cid)
    }
  } catch (e) {
    console.warn('[useSkin] 读取 storage 失败', e)
  }
  // 应用当前背景到 DOM（purchased/tryon bg 暂未加载，先写空）
  writeThemeVars(effectiveBg.value, userBgOpacity.value)
  // 加载已购道具使用中态（按 customerId 隔离）
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

  // ========== 已购道具「使用中」操作（PRD 2026-07-17-prop-shop） ==========
  // 使用已购头像框道具：存 propId + resourceUrl，AvatarWithFrame 通过 purchasedFrameUrl 自动消费
  function applyPurchasedFrame(propId: number, resourceUrl: string) {
    purchasedFrame.value = { propId, resourceUrl }
    persistPurchasedActive().catch((e) => console.warn('[useSkin] persistPurchasedActive 失败', e))
  }
  // 使用已购背景道具：覆盖 --tm-skin-page-bg-image（复用 bgOpacity）
  // bgType: webp='image'（包 url()）/ 纯色='solid'（直接用 CSS 值）；purchasedBg 单值，webp/纯色互相覆盖
  function applyPurchasedBg(
    propId: number,
    resourceUrl: string,
    bgType: 'image' | 'solid',
  ) {
    purchasedBg.value = { propId, resourceUrl, bgType }
    writeThemeVars(effectiveBg.value, userBgOpacity.value)
    persistPurchasedActive().catch((e) => console.warn('[useSkin] persistPurchasedActive 失败', e))
  }
  // 清除某类型已购使用中态：type='frame'|'bg'
  function clearPurchased(type: 'frame' | 'bg') {
    if (type === 'frame') {
      purchasedFrame.value = null
    } else {
      purchasedBg.value = null
      writeThemeVars(effectiveBg.value, userBgOpacity.value)
    }
    persistPurchasedActive().catch((e) => console.warn('[useSkin] persistPurchasedActive 失败', e))
  }

  // 清除全部「使用中」已购道具态（头像框 + 背景都回默认；不清已购记录，那些在后端）
  // 用户点「恢复默认」用：本地使用中态清掉，主题背景/头像框回到默认（无 purchased 覆盖）。
  function clearAllActive() {
    purchasedFrame.value = null
    purchasedBg.value = null
    writeThemeVars(effectiveBg.value, userBgOpacity.value)
    persistPurchasedActive().catch((e) => console.warn('[useSkin] persistPurchasedActive 失败', e))
  }

  return {
    // 状态
    bgOpacity,
    // 已购道具使用中态
    purchasedFrame,
    purchasedBg,
    purchasedFrameUrl: computed(() => purchasedFrame.value?.resourceUrl ?? null),
    purchasedBgUrl: computed(() => purchasedBg.value?.resourceUrl ?? null),
    // 生效背景（替代旧 tryonBgUrl；供 UI 判断有无背景、透明度条可用性）
    effectiveBg,
    // 试穿态（临时态，30s 自动到期，跨页同步）
    tryonProp,
    tryonRemaining,
    tryonFrameUrl,
    // 操作
    setBgOpacity,
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
