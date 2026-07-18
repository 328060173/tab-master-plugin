<template>
  <!--
    头像 + 头像框叠加组件（PRD avatar-theme-visual §1）
    单根：外层 div 包裹头像本体 + 框层，绝不拆多根（守 fallthrough 红线）。
    框层优先级：frameUrl prop（商城预览 png url）> tryonFrameUrl（试穿态）> purchasedFrameUrl（useSkin 已购使用中态）。
    框层类型：PNG（absolute inset-0，盖在头像之上）；静态内置框已下线，全部走商城道具 URL。
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
    <!-- 头像框 PNG URL（商城购买/试穿/预览道具，盖在头像之上） -->
    <img
      v-if="effectiveFrameUrl"
      :src="effectiveFrameUrl"
      class="absolute inset-0 w-full h-full pointer-events-none"
      alt=""
      draggable="false"
    />
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
 * 头像框（2026-07-18 重构，去静态内置框）：全部走商城道具 PNG URL，由 useSkin 提供：
 * - frameUrl prop（商城预览，优先级最高）
 * - tryonFrameUrl（试穿态，30s 临时）
 * - purchasedFrameUrl（已购使用中态，按 customerId 隔离持久化）
 *
 * 尺寸：size prop = 框外延总尺寸；头像本体 = size * 0.82（留出框环空间）。
 * frameId prop 保留签名向后兼容（不再内部消费，静态内置框已下线）。
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
    /** 框外延总尺寸 px；不传则默认 48 */
    size?: number
    /** 指定框 id（已下线，保留签名向后兼容，不再内部消费） */
    frameId?: string | null
    /** 指定头像框 PNG URL（商城预览/已购框）；优先级高于试穿/已购使用中态 */
    frameUrl?: string | null
  }>(),
  {
    size: 48,
    frameId: undefined,
    frameUrl: undefined,
  },
)

const { purchasedFrameUrl, tryonFrameUrl } = useSkin()
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
