<template>
  <div>
    <!-- 触发按钮 -->
    <button
      ref="triggerRef"
      :class="[
        'p-1 rounded transition-colors',
        popover.isOpen('header-menu')
          ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
          : 'hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-700 dark:text-gray-400'
      ]"
      title="设置菜单"
      @click.stop="onTriggerClick"
    >
      <Settings :size="14" />
    </button>

    <!-- 主菜单（Teleport + fixed 定位）-->
    <Teleport to="body">
      <div
        v-if="popover.isOpen('header-menu')"
        :style="menuPos"
        class="fixed z-[60] w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1 max-h-[80vh] overflow-y-auto"
        @click.stop
        @mouseleave="activeSubmenu = null"
      >
        <!-- 账号分组 -->
        <p class="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">{{ t('menu.group.account') }}</p>

        <!-- 未登录：登录/注册合并为一项（邮箱验证码登录即注册：邮箱存在直接登录，不存在自动注册） -->
        <template v-if="!isLoggedIn">
          <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left" @mouseenter="activeSubmenu = null" @click="onLogin">
            <LogIn :size="13" />{{ t('menu.login') }}
          </button>
        </template>

        <!-- 已登录：显示邮箱，点击进「我的」 -->
        <template v-else>
          <button
            class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            @mouseenter="activeSubmenu = null"
            @click="onOpenMine"
          >
            <span class="flex items-center gap-2">
              <User :size="13" />
              <span class="truncate max-w-[150px]">{{ userEmail }}</span>
              <template v-if="isVip">
                <Crown :size="11" class="text-yellow-500" />
              </template>
            </span>
          </button>
          <!-- 退出登录（登录后才显示）-->
          <button
            class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 text-left"
            @mouseenter="activeSubmenu = null"
            @click="onLogout"
          >
            <LogOut :size="13" />{{ t('menu.logout') }}
          </button>
        </template>

        <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <p class="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">{{ t('menu.group.interface') }}</p>

        <!-- 界面主题（hover 展开子菜单） -->
        <button
          ref="themeRowRef"
          class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          :class="activeSubmenu === 'theme' && 'bg-gray-50 dark:bg-gray-700'"
          @mouseenter="onEnterSubmenuRow('theme', themeRowRef)"
        >
          <span class="flex items-center gap-2"><Palette :size="13" />{{ t('menu.theme') }}</span>
          <ChevronLeft :size="11" class="text-gray-400" />
        </button>
        <!-- 字体大小 -->
        <button
          ref="fontRowRef"
          class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          :class="activeSubmenu === 'font' && 'bg-gray-50 dark:bg-gray-700'"
          @mouseenter="onEnterSubmenuRow('font', fontRowRef)"
        >
          <span class="flex items-center gap-2"><Type :size="13" />{{ t('menu.fontSize') }}</span>
          <ChevronLeft :size="11" class="text-gray-400" />
        </button>

        <!-- 显示位置：hover 展开「如何手动切换」指引（扩展无法直接设置位置，Chrome 没给 setter）-->
        <button
          ref="positionRowRef"
          class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          :class="activeSubmenu === 'position' && 'bg-gray-50 dark:bg-gray-700'"
          @mouseenter="onEnterSubmenuRow('position', positionRowRef)"
        >
          <span class="flex items-center gap-2"><Layout :size="13" />{{ t('menu.displayPosition') }}</span>
          <span class="flex items-center gap-1">
            <span v-if="sidePanelSide !== 'unknown'" class="text-[10px] text-gray-400">{{ sidePanelSide === 'left' ? '左侧' : '右侧' }}</span>
            <ChevronLeft :size="11" class="text-gray-400" />
          </span>
        </button>

        <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <p class="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">{{ t('menu.group.data') }}</p>

        <!-- 云同步：未登录🔒，已登录可点击 -->
        <button
          v-if="!isLoggedIn"
          class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-400 cursor-not-allowed opacity-60 text-left"
          disabled
          :title="t('menu.cloudSync.loginRequired')"
        >
          <span class="flex items-center gap-2"><Lock :size="13" />{{ t('menu.cloudSync') }}</span>
          <span class="text-[10px] text-gray-400">{{ t('menu.cloudSync.loginRequired') }}</span>
        </button>
        <button
          v-else
          class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left"
          @mouseenter="activeSubmenu = null"
          @click="onCloudSync"
        >
          <Cloud :size="13" />{{ t('menu.cloudSync') }}
        </button>

        <!-- 快照：始终🔒VIP -->
        <button
          class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-400 cursor-not-allowed opacity-60 text-left"
          disabled
          :title="t('menu.snapshot.vipRequired')"
        >
          <span class="flex items-center gap-2"><Lock :size="13" />{{ t('menu.snapshot') }}</span>
          <span class="text-[10px] text-gray-400">{{ t('menu.snapshot.vipRequired') }}</span>
        </button>

        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left" @mouseenter="activeSubmenu = null" @click="onOpenStorage">
          <HardDrive :size="13" />{{ t('menu.storage') }}
        </button>

        <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>

        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-left" @mouseenter="activeSubmenu = null" @click="onOpenOptions">
          <Sliders :size="13" />{{ t('menu.settings') }}
        </button>
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left" @mouseenter="activeSubmenu = null" @click="onOpenLogs">
          <ScrollText :size="13" />{{ t('menu.logs') }}
        </button>
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-left" @mouseenter="activeSubmenu = null" @click="onReload">
          <RotateCcw :size="13" />{{ t('header.reload') }}
        </button>

        <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <p class="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">{{ t('menu.group.help') }}</p>

        <!-- 帮助项 -->
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left" @mouseenter="activeSubmenu = null" @click="onContact">
          <Users :size="13" />{{ t('menu.contact') }}
        </button>
        <!-- 意见反馈：免登录（后端 /feedback/suggest 是 @Anonymous，靠图形验证码防滥用） -->
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left" @mouseenter="activeSubmenu = null" @click="onFeedback">
          <MessageSquare :size="13" />{{ t('menu.feedback') }}
        </button>
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left" @mouseenter="activeSubmenu = null" @click="onGuide">
          <BookOpen :size="13" />{{ t('menu.guide') }}
        </button>
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left" @mouseenter="activeSubmenu = null" @click="onDonate">
          <Coffee :size="13" />{{ t('menu.donate') }}
        </button>
      </div>

      <!-- ====== 二级子菜单：主题 ====== -->
      <div
        v-if="popover.isOpen('header-menu') && activeSubmenu === 'theme'"
        :style="themeSubmenuPos"
        class="fixed z-[60] w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
        @click.stop
        @mouseenter="activeSubmenu = 'theme'"
      >
        <button
          v-for="opt in themeOptions" :key="opt.value"
          class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
          @click="onPickTheme(opt.value)"
        >
          <component :is="opt.icon" :size="12" />
          <span class="flex-1 text-left">{{ opt.label }}</span>
          <Check v-if="settings.theme === opt.value" :size="12" class="text-blue-600 dark:text-blue-400" />
        </button>
      </div>

      <!-- ====== 二级子菜单：字号 ====== -->
      <div
        v-if="popover.isOpen('header-menu') && activeSubmenu === 'font'"
        :style="fontSubmenuPos"
        class="fixed z-[60] w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
        @click.stop
        @mouseenter="activeSubmenu = 'font'"
      >
        <button
          v-for="opt in fontSizeOptions" :key="opt.value"
          class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
          @click="onPickFontSize(opt.value)"
        >
          <span class="flex-1 text-left">{{ opt.label }}</span>
          <Check v-if="settings.fontSize === opt.value" :size="12" class="text-blue-600 dark:text-blue-400" />
        </button>
      </div>
      <!-- ====== 二级子菜单：显示位置指引（窄·浮在左侧，不压菜单）====== -->
      <div
        v-if="popover.isOpen('header-menu') && activeSubmenu === 'position'"
        :style="positionSubmenuPos"
        class="fixed z-[60] w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl p-2.5 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300"
        @click.stop
        @mouseenter="activeSubmenu = 'position'"
      >
        <p class="font-semibold text-gray-800 dark:text-gray-100 mb-1">显示位置</p>
        <p class="mb-1">左右位置<b>由浏览器控制</b>，扩展改不了。</p>
        <p>右键侧边栏<b>顶部标题栏</b> → 选「显示在{{ sidePanelSide === 'left' ? '右' : '左' }}侧」即可切换。</p>
        <p v-if="sidePanelSide !== 'unknown'" class="mt-1 text-gray-400">当前：{{ sidePanelSide === 'left' ? '左侧' : '右侧' }}</p>
      </div>

    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * Header 设置下拉菜单。
 *
 * 重要变更（2026-06-29 浮层统一改造）：
 * - 主菜单和两个二级子菜单都接入 PopoverManager
 * - 改用 fixed 定位 + Teleport 到 body，绕开 sidepanel 根容器的 overflow-hidden
 * - z-index 统一到 z-[60]
 * - 主菜单 anchor 在触发按钮 bottom-right；子菜单 anchor 计算到主菜单的 left 边
 *
 * 子菜单（主题/字号）仍由 hover 触发，但开关同时受 PopoverManager 控制：
 * - 关闭主菜单 → activeSubmenu 自动重置
 * - 二级子菜单不创建新的 popover id，是主菜单的内部状态
 *
 * 2026-07-12 改造：登录态联动 + 运营项
 * - 未登录：注册/登录
 * - 已登录：邮箱 + 退出
 * - 新增：加群/反馈/操作说明/请作者喝咖啡
 */
import { ref, computed, watch } from "vue"
import {
  Settings, LogIn, LogOut, Palette, Type, Layout, Cloud, HardDrive,
  Sliders, RotateCcw, Sun, Moon, Monitor, Check, ChevronLeft, ScrollText,
  Users, MessageSquare, BookOpen, Coffee, User, Crown, Lock
} from "@lucide/vue"
import { useSettings } from "~composables/useSettings"
import { useSidePanelLayout } from "~composables/useSidePanelLayout"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos, computeFlyoutPos } from "~lib/popoverPosition"
import { useAuth } from "~composables/useAuth"
import { t } from "~lib/i18n"

const emit = defineEmits<{
  (e: "open-storage"): void
  (e: "reload"): void
  (e: "open-login"): void
  (e: "show-toast", msg: string): void
}>()

const { settings, updateSetting } = useSettings()
const { side: sidePanelSide } = useSidePanelLayout()
const popover = usePopoverManager()
const { isLoggedIn, user, logout } = useAuth()

// 计算用户邮箱显示
const userEmail = computed(() => user.value?.email ?? "")
const isVip = computed(() => user.value?.isVip ?? false)

const triggerRef = ref<HTMLElement | null>(null)
// 用 $event.currentTarget 直接拿 DOM 元素，绕开 ref 模板 unwrap 的不确定性
// （历史上发现某些场景下 triggerRef 在模板里没自动 unwrap，导致传给 popover 的是 Ref 对象而非 HTMLElement）
const onTriggerClick = (e: MouseEvent) => {
  popover.toggle("header-menu", e.currentTarget as HTMLElement)
}
const themeRowRef = ref<HTMLElement | null>(null)
const fontRowRef = ref<HTMLElement | null>(null)
const positionRowRef = ref<HTMLElement | null>(null)

const activeSubmenu = ref<"theme" | "font" | "position" | null>(null)
const submenuAnchorRect = ref<DOMRect | null>(null)

// 主菜单位置：anchor 在触发按钮的 bottom-right（右对齐）
const menuPos = computed(() => {
  if (!popover.isOpen("header-menu") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 208 }, "bottom-right")
  return { left: `${p.left}px`, top: `${p.top}px` }
})

// 子菜单位置：统一走 computeFlyoutPos（双向兜底 clamp，绝不溢出窄面板）
// w-36=144px, w-32=128px, 显示位置 w-56=224px（含较多文字，给 height 让它纵向也能 clamp）
const themeSubmenuPos = computed(() => {
  if (!submenuAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computeFlyoutPos(submenuAnchorRect.value, { width: 144 }, "left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
const fontSubmenuPos = computed(() => {
  if (!submenuAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computeFlyoutPos(submenuAnchorRect.value, { width: 128 }, "left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
// 显示位置指引 flyout：用和「字体大小」一致的窄宽度（w-36=144px），
// 才能干净地浮在菜单旁、不压住下面的菜单项；文案务必精简
const positionSubmenuPos = computed(() => {
  if (!submenuAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computeFlyoutPos(submenuAnchorRect.value, { width: 144, height: 150 }, "left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})

const onEnterSubmenuRow = (type: "theme" | "font" | "position", rowEl: HTMLElement | null) => {
  activeSubmenu.value = type
  submenuAnchorRect.value = rowEl?.getBoundingClientRect() ?? null
}

// 主菜单一关，子菜单跟着归零
watch(() => popover.isOpen("header-menu"), (open) => {
  if (!open) { activeSubmenu.value = null; submenuAnchorRect.value = null }
})

const themeOptions = [
  { value: "light" as const, label: t("menu.theme.light"), icon: Sun },
  { value: "dark" as const, label: t("menu.theme.dark"), icon: Moon },
  { value: "system" as const, label: t("menu.theme.system"), icon: Monitor },
]
const fontSizeOptions = [
  { value: "normal" as const, label: t("menu.fontSize.normal") },
  { value: "large" as const, label: t("menu.fontSize.large") },
  { value: "xlarge" as const, label: t("menu.fontSize.xlarge") },
]

// 菜单项点击处理
const onOpenStorage = () => { popover.close("header-menu"); emit("open-storage") }
const onReload = () => { popover.close("header-menu"); emit("reload") }
const onOpenOptions = () => {
  popover.close("header-menu")
  try { chrome.runtime.openOptionsPage() } catch (e) { console.warn("openOptionsPage failed", e) }
}
// 运行日志独立成页（tabs/logs.html），不塞进设置页
const onOpenLogs = () => {
  popover.close("header-menu")
  try { chrome.tabs.create({ url: chrome.runtime.getURL("tabs/logs.html") }) } catch (e) { console.warn("open logs page failed", e) }
}
const onPickTheme = (v: "light" | "dark" | "system") => {
  updateSetting("theme", v)
  popover.close("header-menu")
}
const onPickFontSize = (v: "normal" | "large" | "xlarge") => {
  updateSetting("fontSize", v)
  popover.close("header-menu")
}

// 账号相关
const onLogin = () => {
  popover.close("header-menu")
  emit("open-login")
}
const onOpenMine = () => {
  popover.close("header-menu")
  try {
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/mine.html") })
  } catch (e) {
    console.warn("open mine page failed", e)
  }
}
const onLogout = async () => {
  popover.close("header-menu")
  await logout()
  emit("show-toast", t("menu.loggedOut"))
}

// 功能占位处理
const onCloudSync = () => {
  popover.close("header-menu")
  emit("show-toast", t("menu.cloudSync.comingSoon"))
}

// 帮助/支持
const onContact = () => {
  popover.close("header-menu")
  try {
    chrome.tabs.create({ url: "https://www.ouu365.com/official/app_1001/contact" })
  } catch (e) {
    console.warn("open contact page failed", e)
  }
}
const onFeedback = () => {
  popover.close("header-menu")
  try {
    chrome.tabs.create({ url: "https://www.ouu365.com/official/app_1001/feedback" })
  } catch (e) {
    console.warn("open feedback page failed", e)
  }
}
const onGuide = () => {
  popover.close("header-menu")
  try {
    chrome.tabs.create({ url: "https://www.ouu365.com/official/app_1001/guide" })
  } catch (e) {
    console.warn("open guide page failed", e)
  }
}
const onDonate = () => {
  popover.close("header-menu")
  try {
    chrome.tabs.create({ url: "https://www.ouu365.com/official/app_1001/donate" })
  } catch (e) {
    console.warn("open donate page failed", e)
  }
}
</script>
