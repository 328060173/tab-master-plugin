<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <!-- 顶部条 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <Sliders :size="18" class="text-blue-600 dark:text-blue-400" />
        <h1 class="text-base font-semibold">标签大师 · 设置</h1>
        <span class="text-xs text-gray-400 ml-auto">v{{ version }}</span>
      </div>
    </header>

    <main class="max-w-3xl mx-auto p-6 space-y-8">
      <!-- 账号 / 同步 -->
      <section>
        <h2 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">账号 / 同步</h2>

        <!-- 未登录态：登录入口卡片 -->
        <div
          v-if="!isLoggedIn"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center gap-3"
        >
          <LogIn :size="24" class="text-blue-600 dark:text-blue-400" />
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center">登录账号以同步个人设置与积分</p>
          <button
            type="button"
            class="px-4 py-2 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            @click="loginDialogOpen = true"
          >登录账号</button>
        </div>

        <!-- 已登录态：个人信息摘要 + 签到 + 更多/退出 -->
        <div
          v-else
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700"
        >
          <!-- 邮箱 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <span class="text-xs text-gray-500 dark:text-gray-400">邮箱</span>
            <span class="text-sm font-medium truncate max-w-[60%]">{{ user?.email }}</span>
          </div>

          <!-- 积分 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <span class="text-xs text-gray-500 dark:text-gray-400">积分</span>
            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">{{ user?.points ?? 0 }}</span>
          </div>

          <!-- 签到 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs text-gray-500 dark:text-gray-400">签到</p>
              <p
                class="text-xs mt-0.5"
                :class="user?.todayCheckedIn ? 'text-green-600 dark:text-green-400' : 'text-gray-400'"
              >{{ user?.todayCheckedIn ? '今日已签到' : '今日未签到' }}</p>
            </div>
            <button
              type="button"
              :disabled="user?.todayCheckedIn || checking"
              class="shrink-0 px-3 py-1.5 text-xs rounded border transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              :class="user?.todayCheckedIn
                ? 'border-gray-200 text-gray-400 dark:border-gray-600'
                : 'border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30'"
              @click="onCheckin"
            >{{ user?.todayCheckedIn ? '已签到' : (checking ? '签到中…' : '立即签到') }}</button>
          </div>

          <!-- 更多 / 退出登录 -->
          <div class="px-5 py-4 flex items-center justify-end gap-2">
            <button
              type="button"
              class="px-3 py-1.5 text-xs rounded border border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-colors"
              @click="onOpenMyPage"
            >更多</button>
            <button
              type="button"
              :disabled="loggingOut"
              class="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-60"
              @click="onLogout"
            >{{ loggingOut ? '退出中…' : '退出登录' }}</button>
          </div>
        </div>
      </section>

      <!-- 更多设置 -->
      <section>
        <h2 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">更多设置</h2>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
          <!-- 自动数据校正 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="flex items-start gap-1.5">
              <div>
                <p class="text-sm font-medium flex items-center gap-1.5">
                  自动数据校正
                  <button type="button" class="help-trigger" @click="showReconcileHelp = !showReconcileHelp" aria-label="了解自动数据校正">
                    <HelpCircle :size="14" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </button>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">定期同步标签列表与浏览器实际状态</p>
              </div>
            </div>
            <!-- toggle 开关 -->
            <button
              type="button"
              role="switch"
              :aria-checked="settings.autoReconcile"
              @click="updateSetting('autoReconcile', !settings.autoReconcile)"
              :class="toggleCls(settings.autoReconcile)"
            >
              <span :class="toggleKnobCls(settings.autoReconcile)"></span>
            </button>
          </div>

          <!-- 刷新菜单内容：向 SW 发 manualRefreshAll，触发菜单/通知/版本同步（manual 不刷广告，避免每次点都弹广告）+ /my 重拉 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="flex items-start gap-2">
              <div>
                <p class="text-sm font-medium">刷新菜单内容</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">手动同步菜单、通知等最新内容</p>
                <p v-if="refreshHint" class="text-xs text-green-600 dark:text-green-400 mt-1">已触发同步，侧边栏内容将自动更新</p>
              </div>
            </div>
            <button
              type="button"
              :disabled="refreshing"
              @click="onRefreshContent"
              class="shrink-0 px-3 py-1.5 text-xs rounded border transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              :class="refreshing
                ? 'border-gray-200 text-gray-400 dark:border-gray-600'
                : 'border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/30'"
            >{{ refreshing ? '同步中…' : '立即同步' }}</button>
          </div>
        </div>

        <!-- 问号弹窗（点击问号图标切换显示） -->
        <div v-if="showReconcileHelp" class="mt-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <p class="font-medium text-blue-700 dark:text-blue-300 mb-2">自动数据校正</p>
          <p class="mb-2">由于网络环境、计算机运行不稳定或浏览器自身机制，标签列表可能偶尔与实际状态不一致。</p>
          <p class="mb-2">开启后，每 60 秒自动校正一次，保证列表始终准确反映浏览器真实标签。</p>
          <p>校正仅读取本地数据，不联网、不消耗流量，推荐保持开启。</p>
        </div>
      </section>

      <!-- 关于 -->
      <section>
        <h2 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">关于</h2>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-5 py-4 space-y-2">
          <p class="text-sm">标签大师 <span class="text-gray-500">v{{ version }}</span></p>
          <p class="text-xs text-gray-500 dark:text-gray-400">帮你高效管理浏览器标签页</p>
        </div>
      </section>
    </main>

    <!-- 登录弹框：跨页面复用 LoginDialog（内部 Teleport to body，不影响本页单根结构） -->
    <LoginDialog
      :open="loginDialogOpen"
      @close="loginDialogOpen = false"
      @success="onLoginSuccess"
    />

    <!-- 退出登录确认弹框（复用 ConfirmDialog） -->
    <ConfirmDialog
      :open="logoutConfirmOpen"
      title="退出登录"
      message="确定要退出登录吗？退出后将无法同步个人设置与积分。"
      confirm-text="确认退出"
      danger
      @cancel="logoutConfirmOpen = false"
      @confirm="confirmLogout"
    />

    <!-- toast -->
    <div
      v-if="toastMsg"
      class="fixed top-3 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 bg-gray-800 text-white text-xs rounded-full shadow-lg pointer-events-none"
    >{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
/**
 * 标签大师完整设置页 —— Plasmo 自动注册为 options_page
 *
 * 设计取舍：
 * - 主题/字号在 sidepanel 顶部菜单内嵌可调；本页放账号个人中心、自动数据校正、刷新菜单内容、关于
 * - 与 sidepanel 共享 useSettings()（module-scope ref），改完立即生效
 * - 与 sidepanel 共享 useAuth()（单例 + storage.local 持久化），options 登录/登出/签到后 storage.onChanged 触发 sidepanel 同步
 * - 不要再加 SettingsDialog —— 用户明确要求"不要弹窗套弹窗"
 *
 * 触发方式：sidepanel HeaderMenu "设置..." → chrome.runtime.openOptionsPage()
 */
import { computed, ref, onMounted } from "vue"
import { Sliders, LogIn, HelpCircle } from "@lucide/vue"
import { useSettings } from "~composables/useSettings"
import { useAuth } from "~composables/useAuth"
import { post } from "~lib/api"
import { API_URIS, buildOfficialUrl } from "~lib/api-config"
import LoginDialog from "~components/LoginDialog.vue"
import ConfirmDialog from "~components/ConfirmDialog.vue"

const { settings, updateSetting } = useSettings()
const { isLoggedIn, user, logout, fetchUser, getToken } = useAuth()

const showReconcileHelp = ref(false)

const version = computed(() => {
  try { return chrome.runtime.getManifest().version } catch { return '0.0.1' }
})

// 切换开关 class
const toggleCls = (on: boolean) => [
  'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
  on ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
]
const toggleKnobCls = (on: boolean) => [
  'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform translate-y-0.5',
  on ? 'translate-x-4' : 'translate-x-0.5'
]

// ========== 刷新菜单内容（向 SW 发 manualRefreshAll，触发全量后端数据同步） ==========
// 红线：options/sidepanel 均不发广告/版本/通知/设置菜单网络请求，全走 SW。
// 异步不阻塞：点击 → loading 态 → 短延时后恢复（不监听 SW 完成信号）。
// 失败静默（sendMessage 本身极少失败；即便失败也不阻塞 UI，按钮照常恢复）。
const refreshing = ref(false)
const refreshHint = ref(false)
let refreshTimer: ReturnType<typeof setTimeout> | null = null
let refreshHintTimer: ReturnType<typeof setTimeout> | null = null

const onRefreshContent = () => {
  if (refreshing.value) return
  refreshing.value = true
  try {
    chrome.runtime.sendMessage({ type: 'manualRefreshAll' }).catch((e) => {
      console.warn('[options] 发送 manualRefreshAll 失败', e)
    })
  } catch (e) {
    console.warn('[options] sendMessage 异常', e)
  }
  // 短延时后恢复按钮态（不等 SW 完成）
  refreshTimer = setTimeout(() => {
    refreshing.value = false
    refreshHint.value = true
    if (refreshHintTimer) clearTimeout(refreshHintTimer)
    // 提示文案 1.5s 后淡出
    refreshHintTimer = setTimeout(() => { refreshHint.value = false }, 1500)
  }, 1500)
}

// ========== 账号个人中心 ==========
const loginDialogOpen = ref(false)

// 首次挂载：仅当 URL 带 ?from=login 且未登录时自动弹登录框
// 入口区分（2026-07-17 用户反馈）：
//   - HeaderMenu 未登录点「登录/注册」→ tabs.create(options.html?from=login) → 自动弹登录框
//   - HeaderMenu 已登录点邮箱 / 点「设置...」→ openOptionsPage（无 from）→ 不弹，直接看个人中心/设置
// 避免从「更多设置」进来的用户被强制弹登录框打扰
// useAuth 构造时已触发 loadAuth（异步），首屏 isLoggedIn 可能尚未反映 storage 真实状态；
// 这里独立查一次 storage（key 与 useAuth AUTH_KEY 一致，硬编码，未改 useAuth 导出常量）
onMounted(async () => {
  const from = new URLSearchParams(window.location.search).get('from')
  if (from !== 'login') return
  try {
    const data = await chrome.storage.local.get('tabMasterAuth')
    const stored = data?.tabMasterAuth as { token?: string; user?: { id?: string } } | undefined
    const logged = !!(stored?.token && stored?.user?.id)
    if (!logged) loginDialogOpen.value = true
  } catch (e) {
    console.warn('[options] 读取登录态失败，默认弹登录框', e)
    loginDialogOpen.value = true
  }
})

// LoginDialog 内部已调 login + fetchUser 完成登录态建立；此处仅关弹框 + toast
function onLoginSuccess(email: string) {
  loginDialogOpen.value = false
  showToast(`已登录：${email}`)
}

// 签到：调 /customer/checkin，成功后 fetchUser 刷新 points/todayCheckedIn
// fetchUser 写 storage.local → useAuth storage.onChanged 监听器触发 sidepanel 内存态同步
const checking = ref(false)
async function onCheckin() {
  if (checking.value || user.value?.todayCheckedIn) return
  checking.value = true
  try {
    const res = await post<{
      code: number
      msg: string
      data: { awardPoints: number; continuousDays: number; afterPoints: number }
    }>(API_URIS.checkin, {})
    const d = res.data
    showToast(`签到成功 +${d.awardPoints} 积分，连续 ${d.continuousDays} 天`)
    await fetchUser()
  } catch (e) {
    // ApiError.message 已是后端 msg（如「今日已签到」）；NetworkError.message 是网络提示
    const msg = e instanceof Error ? e.message : '签到失败'
    showToast(msg)
    // 业务错误（如已签到）也刷新一次状态，保证 UI 与后端一致
    await fetchUser()
  } finally {
    checking.value = false
  }
}

// 退出登录：先弹确认框，确认后调 useAuth.logout（清 storage → sidepanel 同步）
// 2026-07-17 用户反馈：退出统一在 options 页 + 加确认弹框（HeaderMenu 不再提供退出入口）
const logoutConfirmOpen = ref(false)
const loggingOut = ref(false)
function onLogout() {
  if (loggingOut.value) return
  logoutConfirmOpen.value = true
}
async function confirmLogout() {
  logoutConfirmOpen.value = false
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await logout()
    showToast('已退出登录')
  } catch (e) {
    console.warn('[options] 退出登录失败', e)
    showToast('退出失败，请重试')
  } finally {
    loggingOut.value = false
  }
}

// 跳官网 /my（带 token，官网落地后建立登录态）
function onOpenMyPage() {
  const url = buildOfficialUrl('/my', getToken())
  chrome.tabs.create({ url })
}

// ========== toast（options 独立，与 sidepanel 同款样式） ==========
const toastMsg = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(msg: string) {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 2500)
}

</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

/* 与 sidepanel 同步的字号/暗色规则（让 options 也响应同一份 settings） */
:root.fs-normal  { font-size: 16px; }
:root.fs-large   { font-size: 17.5px; }
:root.fs-xlarge  { font-size: 19px; }
:root.font-mono body { font-family: 'SF Mono', 'Cascadia Code', Consolas, Monaco, monospace; }
.help-trigger { background: transparent; border: none; padding: 0; cursor: help; display: inline-flex; }
</style>
