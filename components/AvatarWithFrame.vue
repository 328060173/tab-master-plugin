<template>
  <!--
    头像 + 头像框叠加组件（PRD avatar-theme-visual §1）
    单根：外层 div 包裹头像本体 + 框层，绝不拆多根（守 fallthrough 红线）。
    框层优先级：frameUrl prop（商城预览 png url）> tryonFrameUrl（试穿态）> purchasedFrameUrl（useSkin 已购使用中态）
      > frameId prop / 静态 activeFrameId（8 款内置框）。
    框层类型：PNG（absolute inset-0，盖在头像之上）或彩虹流光（CSS class）。
    头像本体（2026-07-18 改造）：按 useAuth.user.sex 选择男/女/默认 SVG 剪影，不再用邮箱 hash 渲染。
  -->
  <div class="relative inline-flex items-center justify-center shrink-0" :style="outerStyle">
    <!-- 头像本体：性别 SVG 剪影（圆形裁切） -->
    <div
      class="rounded-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700"
      :style="avatarStyle"
    >
      <img :src="avatarSrc" class="w-full h-full object-cover" alt="" draggable="false" />
    </div>
    <!-- 已购头像框 PNG URL（商城购买道具，盖在头像之上） -->
    <img
      v-if="effectiveFrameUrl"
      :src="effectiveFrameUrl"
      class="absolute inset-0 w-full h-full pointer-events-none"
      alt=""
      draggable="false"
    />
    <!-- 静态头像框 PNG：盖在头像之上，外延装饰伸出头像圆形之外 -->
    <img
      v-else-if="frame?.type === 'png' && frame.pngUrl"
      :src="frame.pngUrl"
      class="absolute inset-0 w-full h-full pointer-events-none"
      alt=""
      draggable="false"
    />
    <!-- 头像框 CSS（彩虹流光）：mask 挖空中心露出头像 -->
    <div
      v-else-if="frame?.type === 'css' && frame.cssClass === 'tm-frame-rainbow'"
      class="absolute inset-0 pointer-events-none tm-frame-rainbow"
    ></div>
  </div>
</template>

<script setup lang="ts">
/**
 * AvatarWithFrame —— 头像本体（性别 SVG 剪影）+ 头像框叠加
 *
 * 头像本体（2026-07-18 改造）：
 * - 从 useAuth().user.sex 读性别：1=女 / 0=男 / 其它（2/null/未登录）=默认
 * - 三张 SVG（assets/avatars/avatar-{default,female,male}.svg，灰色人形剪影，viewBox 0 0 1024 1024）
 * - email prop 保留以向后兼容调用方（HeaderMenu/options 预览仍传 email），但不再用于渲染本体
 *
 * 头像框：单张 144×144 PNG 源图，CSS background-size 缩放复用三档（24/48/68）。
 *
 * 尺寸：size prop = 框外延总尺寸；头像本体 = size * 0.82（留出框环空间）。
 *
 * 2026-07-17 道具商城扩展：新增 frameUrl prop（商城预览/已购框图片 URL，兼容 webp/png/jpeg/jpg），
 * 优先级高于静态 frameId/activeFrameId；useSkin.purchasedFrameUrl 自动消费已购使用中态。
 * 2026-07-17 试穿功能：useSkin.tryonFrameUrl（试穿态）优先级介于 frameUrl prop 与 purchasedFrameUrl 之间。
 */
import { computed } from 'vue'
import avatarDefault from '~assets/avatars/avatar-default.svg'
import avatarFemale from '~assets/avatars/avatar-female.svg'
import avatarMale from '~assets/avatars/avatar-male.svg'
import { useSkin } from '~composables/useSkin'
import { useAuth } from '~composables/useAuth'

const props = withDefaults(
  defineProps<{
    /** 登录邮箱；保留以向后兼容调用方（HeaderMenu/options 预览仍传），不再用于渲染本体 */
    email: string
    /** 框外延总尺寸 px；不传则用当前启用框（无框时仅头像 40px） */
    size?: number
    /** 指定框 id（覆盖当前启用框）；用于商城缩略图 */
    frameId?: string | null
    /** 指定已购头像框 PNG URL（覆盖 frameId/activeFrameId）；用于商城预览/已购框 */
    frameUrl?: string | null
  }>(),
  {
    size: 48,
    frameId: undefined,
    frameUrl: undefined,
  },
)

const { frames, activeFrameId, purchasedFrameUrl, tryonFrameUrl } = useSkin()
const { user } = useAuth()

// 头像 SVG：1=女 / 0=男 / 其它（2/null/未登录）=默认
const avatarSrc = computed(() => {
  const sex = user.value?.sex
  if (sex === 1) return avatarFemale
  if (sex === 0) return avatarMale
  return avatarDefault
})

// 生效的头像框 URL：prop 优先（商城预览）> 试穿态 > 已购使用中态
const effectiveFrameUrl = computed(() => {
  if (props.frameUrl !== undefined) return props.frameUrl || null
  return tryonFrameUrl.value ?? purchasedFrameUrl.value
})

// 当前生效的静态框（仅在未用 purchased url 时生效）
const frame = computed(() => {
  if (effectiveFrameUrl.value) return null
  const id = props.frameId !== undefined ? props.frameId : activeFrameId.value
  if (!id) return null
  return frames.find((f) => f.id === id) ?? null
})

// 头像本体直径 = 总尺寸 * 0.82（留 ~18% 给框环 + 装饰外延）
const avatarSize = computed(() => Math.round(props.size * 0.82))

const outerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

const avatarStyle = computed(() => ({
  width: `${avatarSize.value}px`,
  height: `${avatarSize.value}px`,
}))
</script>
