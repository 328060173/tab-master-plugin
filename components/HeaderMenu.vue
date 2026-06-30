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
        class="fixed z-[60] w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl py-1"
        @click.stop
        @mouseleave="activeSubmenu = null"
      >
        <!-- 登录账号（灰显） -->
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-400 cursor-not-allowed opacity-60 text-left" disabled title="需要后端服务，敬请期待">
          <LogIn :size="13" />登录账号
        </button>

        <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <p class="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">界面</p>

        <!-- 界面主题（hover 展开子菜单） -->
        <button
          ref="themeRowRef"
          class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          :class="activeSubmenu === 'theme' && 'bg-gray-50 dark:bg-gray-700'"
          @mouseenter="onEnterSubmenuRow('theme', themeRowRef)"
        >
          <span class="flex items-center gap-2"><Palette :size="13" />界面主题</span>
          <ChevronLeft :size="11" class="text-gray-400" />
        </button>
        <!-- 字体大小 -->
        <button
          ref="fontRowRef"
          class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          :class="activeSubmenu === 'font' && 'bg-gray-50 dark:bg-gray-700'"
          @mouseenter="onEnterSubmenuRow('font', fontRowRef)"
        >
          <span class="flex items-center gap-2"><Type :size="13" />字体大小</span>
          <ChevronLeft :size="11" class="text-gray-400" />
        </button>

        <!-- 显示位置：hover 展开「如何手动切换」指引（扩展无法直接设置位置，Chrome 没给 setter）-->
        <button
          ref="positionRowRef"
          class="flex items-center justify-between w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          :class="activeSubmenu === 'position' && 'bg-gray-50 dark:bg-gray-700'"
          @mouseenter="onEnterSubmenuRow('position', positionRowRef)"
        >
          <span class="flex items-center gap-2"><Layout :size="13" />显示位置</span>
          <span class="flex items-center gap-1">
            <span v-if="sidePanelSide !== 'unknown'" class="text-[10px] text-gray-400">{{ sidePanelSide === 'left' ? '左侧' : '右侧' }}</span>
            <ChevronLeft :size="11" class="text-gray-400" />
          </span>
        </button>

        <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        <p class="px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wide">数据</p>

        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-400 cursor-not-allowed opacity-60 text-left" disabled title="需要后端服务，敬请期待">
          <Cloud :size="13" />云同步
        </button>
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-400 cursor-not-allowed opacity-60 text-left" disabled title="需要后端服务，敬请期待">
          <Camera :size="13" />快照
        </button>
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left" @mouseenter="activeSubmenu = null" @click="onOpenStorage">
          <HardDrive :size="13" />存储空间
        </button>

        <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>

        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-left" @mouseenter="activeSubmenu = null" @click="onOpenOptions">
          <Sliders :size="13" />更多设置...
        </button>
        <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-left" @mouseenter="activeSubmenu = null" @click="onReload">
          <RotateCcw :size="13" />重新打开
        </button>
      </div>

      <!-- ====== 二级子菜单：主题（fixed 定位到主菜单左侧）====== -->
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
      <!-- ====== 二级子菜单：显示位置指引 ====== -->
      <div
        v-if="popover.isOpen('header-menu') && activeSubmenu === 'position'"
        :style="positionSubmenuPos"
        class="fixed z-[60] w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl p-3 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300"
        @click.stop
        @mouseenter="activeSubmenu = 'position'"
      >
        <p class="font-semibold text-gray-800 dark:text-gray-100 mb-1.5">
          侧边栏在<b>{{ sidePanelSide === 'left' ? '左侧' : sidePanelSide === 'right' ? '右侧' : '哪一侧' }}</b>
        </p>
        <p class="mb-2">左右位置是<b>浏览器自带的设置</b>，标签大师改不了，需要你在浏览器里手动切。两种方法任选其一 👇</p>
        <p class="font-medium text-gray-700 dark:text-gray-200">方法一（最快）</p>
        <p class="mb-2">在<b>本侧边栏最顶部</b>那条窄工具栏（显示标题/扩展名的地方）<b>点右键</b> → 选「显示在{{ sidePanelSide === 'left' ? '右' : '左' }}侧」<span class="text-gray-400">（英文界面是 Show on {{ sidePanelSide === 'left' ? 'right' : 'left' }}）</span></p>
        <p class="font-medium text-gray-700 dark:text-gray-200">方法二</p>
        <p>打开浏览器<b>设置 → 外观</b>，找「侧边栏」位置选项切换</p>
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
 */
import { ref, computed, watch } from "vue"
import {
  Settings, LogIn, Palette, Type, Layout, Cloud, Camera, HardDrive,
  Sliders, RotateCcw, Sun, Moon, Monitor, Check, ChevronLeft,
} from "@lucide/vue"
import { useSettings } from "~composables/useSettings"
import { useSidePanelLayout } from "~composables/useSidePanelLayout"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"

const emit = defineEmits<{
  (e: "open-storage"): void
  (e: "reload"): void
}>()

const { settings, updateSetting } = useSettings()
const { side: sidePanelSide } = useSidePanelLayout()
const popover = usePopoverManager()

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

// 子菜单位置：根据子菜单行的 rect 计算到行的左侧（向左展开，避免越界）
// w-36=144px, w-32=128px
const themeSubmenuPos = computed(() => {
  if (!submenuAnchorRect.value) return { left: "0px", top: "0px" }
  const rect = submenuAnchorRect.value
  // 自定义：浮在行的左侧，top 对齐
  let left = rect.left - 144 - 4
  if (left < 4) left = rect.right + 4 // 左边越界则改到右侧
  return { left: `${left}px`, top: `${rect.top}px` }
})
const fontSubmenuPos = computed(() => {
  if (!submenuAnchorRect.value) return { left: "0px", top: "0px" }
  const rect = submenuAnchorRect.value
  let left = rect.left - 128 - 4
  if (left < 4) left = rect.right + 4
  return { left: `${left}px`, top: `${rect.top}px` }
})
// 显示位置指引 flyout：w-64 = 256px
const positionSubmenuPos = computed(() => {
  if (!submenuAnchorRect.value) return { left: "0px", top: "0px" }
  const rect = submenuAnchorRect.value
  let left = rect.left - 256 - 4
  if (left < 4) left = rect.right + 4
  return { left: `${left}px`, top: `${rect.top}px` }
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
  { value: "light" as const, label: "浅色", icon: Sun },
  { value: "dark" as const, label: "深色", icon: Moon },
  { value: "system" as const, label: "跟随系统", icon: Monitor },
]
const fontSizeOptions = [
  { value: "normal" as const, label: "标准" },
  { value: "large" as const, label: "大" },
  { value: "xlarge" as const, label: "超大" },
]

const onOpenStorage = () => { popover.close("header-menu"); emit("open-storage") }
const onReload = () => { popover.close("header-menu"); emit("reload") }
const onOpenOptions = () => {
  popover.close("header-menu")
  try { chrome.runtime.openOptionsPage() } catch (e) { console.warn("openOptionsPage failed", e) }
}
const onPickTheme = (v: "light" | "dark" | "system") => {
  updateSetting("theme", v)
  popover.close("header-menu")
}
const onPickFontSize = (v: "normal" | "large" | "xlarge") => {
  updateSetting("fontSize", v)
  popover.close("header-menu")
}
</script>
