<template>
  <!-- 更多功能：后端 /setting/menu-list (settingType=2) 下发的动态菜单 -->
  <!-- options 直接请求后端（不走 SW 缓存），调用方 onMounted 调 fetchOptionsMenus -->
  <!-- 空数组（请求未完成/后端未配/请求失败）时整个区块隐藏，不渲染任何 DOM -->
  <div
    v-if="menus.length"
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
    <p class="px-5 pt-3 pb-1 text-[10px] text-gray-400 uppercase tracking-wide">
      更多功能
    </p>
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      <button
        v-for="item in menus"
        :key="item.id"
        :data-menu-id="item.id"
        type="button"
        class="w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left"
        @click="onMenuClick(item)">
        <img
          v-if="canRenderLogoWithFallback(item)"
          :src="item.settingLogo"
          :alt="settingMenuLabel(item)"
          class="w-4 h-4 object-contain shrink-0"
          @error="onLogoError($event)" />
        <LinkIcon v-else :size="16" class="shrink-0" />
        <span class="truncate">{{ settingMenuLabel(item) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * options.html 设置 tab 的「更多功能」动态菜单列表
 *
 * 架构：直接请求后端（不走 SW 缓存）
 * - options 是用户主动操作页（/my/道具/签到/兑换都直接发后端），菜单查询同样直接发
 * - onMounted 调 useSettingMenuOptions().fetchOptionsMenus()
 *   POST /setting/menu-list body={ customerType, settingType:2 }
 * - 请求失败静默（menus 保持空，区块 v-if 隐藏）
 *
 * logo 渲染：与 HeaderMenu 同模式——isRenderableImgSrc 校验 + <img> @error 降级 LinkIcon
 * 单根组件（一个 div），无多根 fallthrough 风险
 */
import { Link as LinkIcon } from "@lucide/vue"
import { onMounted, ref } from "vue"

import { useSettingMenuOptions } from "~composables/useSettingMenu"
import { t } from "~lib/i18n"

const { menus, canRenderLogo, onMenuClick, fetchOptionsMenus } =
  useSettingMenuOptions()

// 菜单显示名：固定项优先用 settingNameKey 走 i18n，后端项用 settingName（后端下发的中文）
const settingMenuLabel = (item: { settingName: string; settingNameKey?: string }): string =>
  item.settingNameKey ? t(item.settingNameKey) : item.settingName

// 组件挂载时直接请求后端拉取 settingType=2 菜单
// 静默失败：失败时 menus 保持空，区块 v-if 隐藏
onMounted(() => {
  fetchOptionsMenus().catch((e) => {
    console.warn("[SettingMenuOptionsList] fetchOptionsMenus 失败", e)
  })
})

// logo 加载失败的菜单项 id 集合（URL 校验通过但 <img> 加载失败时降级为默认 LinkIcon）
const logoFailedIds = ref<Set<number>>(new Set())
const canRenderLogoWithFallback = (item: { id: number; settingLogo: string }) =>
  canRenderLogo(item.settingLogo) && !logoFailedIds.value.has(item.id)
const onLogoError = (e: Event) => {
  const img = e.currentTarget as HTMLElement
  const btn = img.closest("button")
  const id = Number(btn?.getAttribute("data-menu-id"))
  if (Number.isFinite(id) && id !== 0) {
    logoFailedIds.value = new Set(logoFailedIds.value).add(id)
  }
}
</script>
