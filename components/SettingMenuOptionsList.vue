<template>
  <!-- 扩展功能：后端 /setting/menu-list (settingType=2) 下发的动态菜单（SW 拉取+缓存，options 只读） -->
  <!-- 空数组（SW 未拉到/后端未配）时整个区块隐藏，不渲染任何 DOM -->
  <div v-if="menus.length" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
    <p class="px-5 pt-3 pb-1 text-[10px] text-gray-400 uppercase tracking-wide">扩展功能</p>
    <div class="divide-y divide-gray-100 dark:divide-gray-700">
      <button
        v-for="item in menus"
        :key="item.id"
        :data-menu-id="item.id"
        type="button"
        class="w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left"
        @click="onMenuClick(item)"
      >
        <img
          v-if="canRenderLogoWithFallback(item)"
          :src="item.settingLogo"
          :alt="item.settingName"
          class="w-4 h-4 object-contain shrink-0"
          @error="onLogoError($event)"
        />
        <LinkIcon v-else :size="16" class="shrink-0" />
        <span class="truncate">{{ item.settingName }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * options.html 设置 tab 的「扩展功能」动态菜单列表
 *
 * 架构：只读 SW 缓存（composables/useSettingMenu.ts 的 useSettingMenuOptions 单例）
 * - SW (background.ts fetchSettingMenuCache(_, 2)) 定时拉 POST /setting/menu-list?settingType=2
 *   写 storage key=tabMasterSettingMenuOptionsCache，广播 settingMenuOptionsCacheUpdated
 * - 本组件只渲染缓存中的菜单项，不发任何网络请求
 * - 空数组时整个区块 v-if 隐藏
 *
 * logo 渲染：与 HeaderMenu 同模式——isRenderableImgSrc 校验 + <img> @error 降级 LinkIcon
 * 单根组件（一个 div），无多根 fallthrough 风险
 */
import { ref } from "vue"
import { Link as LinkIcon } from "@lucide/vue"
import { useSettingMenuOptions } from "~composables/useSettingMenu"

const {
  menus,
  canRenderLogo,
  onMenuClick
} = useSettingMenuOptions()

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
