<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <!-- 顶部 header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <User :size="18" class="text-blue-600 dark:text-blue-400" />
        <h1 class="text-base font-semibold">{{ t('mine.title') }}</h1>
      </div>
    </header>

    <main class="max-w-3xl mx-auto p-6 space-y-6">
      <!-- 未登录状态 -->
      <template v-if="!isLoggedIn">
        <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <User :size="48" class="mx-auto text-gray-400 mb-4" />
          <h2 class="text-sm font-semibold mb-2">{{ t('mine.pleaseLogin') }}</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">{{ t('mine.pleaseLoginHint') }}</p>
          <button
            class="px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            @click="onOpenLogin"
          >
            {{ t('mine.goLogin') }}
          </button>
        </section>
      </template>

      <!-- 已登录状态 -->
      <template v-else>
        <!-- 用户信息卡片 -->
        <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 relative">
          <!-- 刷新按钮 -->
          <button
            class="absolute top-4 right-4 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="refreshing"
            @click="onRefresh"
            :title="t('mine.refresh')"
          >
            <RefreshCw :size="14" :class="refreshing ? 'animate-spin' : ''" />
          </button>

          <div class="flex items-center gap-4 mb-5">
            <div class="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-xl">
              {{ userInitial }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-semibold">{{ user?.email }}</span>
                <Crown v-if="isVip" :size="13" class="text-yellow-500" />
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ isVip ? t('mine.membershipVip') : t('mine.membershipNormal') }}
              </span>
            </div>
          </div>
        </section>

        <!-- 会员权益入口 -->
        <section class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <button
            class="flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 rounded transition-colors"
            @click="onOpenVipRights"
          >
            <span class="flex items-center gap-2">
              <Crown :size="14" />
              <span>{{ t('mine.viewVipRights') }}</span>
            </span>
            <span class="text-gray-400">→</span>
          </button>
        </section>

        <!-- 退出登录 -->
        <section>
          <button
            class="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
            @click="onLogout"
          >
            <LogOut :size="14" />
            <span>{{ t('mine.logout') }}</span>
          </button>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 「我的」独立页面（tabs/mine.html）。
 * 入口：HeaderMenu 点击邮箱 → chrome.tabs.create 打开此页。
 */
import { computed, onMounted, ref } from "vue"
import { User, Crown, LogOut, RefreshCw } from "@lucide/vue"
import { useAuth } from "~composables/useAuth"
import { t } from "~lib/i18n"

const { isLoggedIn, user, logout, fetchUser, getToken } = useAuth()
const refreshing = ref(false)

const isVip = computed(() => user.value?.isVip ?? false)

// 计算用户邮箱首字母（大写）
const userInitial = computed(() => {
  const email = user.value?.email ?? ""
  return email.charAt(0).toUpperCase()
})

// 关闭当前页面（仅用于独立页面）
const closeCurrentTab = () => {
  try {
    chrome.tabs.getCurrent(tab => {
      if (tab?.id) chrome.tabs.remove(tab.id)
    })
  } catch (e) {
    console.warn("close current tab failed", e)
  }
}

// 打开登录弹窗逻辑：关闭当前页，发消息让侧边栏打开登录弹窗
const onOpenLogin = () => {
  closeCurrentTab()
  // 这里的消息机制需与 sidepanel.vue 配合，目前简化处理
  // 实际可通过 chrome.runtime.sendMessage 或 storage 通知
}

// 手动刷新用户信息
const onRefresh = async () => {
  if (refreshing.value) return
  refreshing.value = true
  try {
    await fetchUser()
    // 可以在这里加 toast 提示刷新成功（暂未引入 toast）
  } catch (e) {
    console.warn('[mine] 刷新用户信息失败', e)
  } finally {
    refreshing.value = false
  }
}

// 打开会员权益页面
const onOpenVipRights = () => {
  try {
    const token = getToken()
    const url = token
      ? `https://www.ouu365.com/official/app_1001/my?token=${encodeURIComponent(token)}`
      : 'https://www.ouu365.com/official/app_1001'
    chrome.tabs.create({ url })
  } catch (e) {
    console.warn('open vip rights page failed', e)
  }
}

// 退出登录
const onLogout = async () => {
  await logout()
  closeCurrentTab()
}

// 已登录时静默刷新
onMounted(() => {
  if (isLoggedIn.value) {
    fetchUser().catch(() => {})
  }
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
:root.fs-normal  { font-size: 16px; }
:root.fs-large   { font-size: 17.5px; }
:root.fs-xlarge  { font-size: 19px; }
</style>
