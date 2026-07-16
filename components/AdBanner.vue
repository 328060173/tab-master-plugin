<template>
  <Teleport to="body">
    <Transition name="ad-slide">
      <div
        v-if="ad"
        class="fixed bottom-0 left-0 right-0 z-[90] mx-auto max-w-[360px] m-2 rounded-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <!-- 广告图片（可点击）-->
        <div class="relative cursor-pointer" @click="$emit('click')">
          <img
            v-if="isValidExternalUrl(ad.imageUrl) && !imgError"
            :src="ad.imageUrl"
            :alt="ad.title"
            class="w-full h-24 object-cover"
            @error="onImgError"
          />
          <!-- 图片加载失败/URL 校验不过时的占位（复用现有降级，显示标题文字） -->
          <div v-else class="w-full h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-xs text-gray-400">
            {{ ad.title }}
          </div>
          <!-- 关闭按钮 -->
          <button
            class="absolute top-1 right-1 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            @click.stop="$emit('dismiss')"
            :aria-label="t('ad.close')"
          >
            <X :size="12" />
          </button>
          <!-- 倒计时进度条 -->
          <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
            <div class="h-full bg-blue-500 transition-all duration-100 ease-linear" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
        <!-- 广告标题 -->
        <div v-if="ad.title" class="px-2 py-1.5 flex items-center gap-1.5">
          <span class="text-[10px] text-gray-400 uppercase tracking-wide shrink-0">{{ t('ad.label') }}</span>
          <span class="text-xs text-gray-700 dark:text-gray-200 truncate flex-1">{{ ad.title }}</span>
          <button
            class="text-[11px] text-blue-600 dark:text-blue-400 hover:underline shrink-0"
            @click="$emit('click')"
          >{{ t('ad.learnMore') }}</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 广告浮层（底部 10 秒弹层）
 *
 * 数据流（2026-07-16 重设计）：
 * - SW 后台定时拉取广告 → 写 tabMasterAdCache → sendMessage 通知
 * - useAd 只读缓存 + adState 去重 → selectAd() 选出 currentAd
 * - 本组件纯展示：接收 AdInfo | null，管理倒计时/图片加载/点击关闭
 *
 * - 自动消失：duration 到自动消失（onAdExpired，不记 adId）
 * - 点击：记 adId 今天不再展示 + 打开链接（onAdClick）
 * - 关闭：记 adId 今天不再展示（onAdDismiss）
 * - 图片加载失败：降级显示标题文字
 */
import { ref, watch, onUnmounted } from 'vue'
import { X } from '@lucide/vue'
import { t } from '~lib/i18n'
import { isValidExternalUrl } from '~lib/external-resource'
import type { AdInfo } from '~composables/useAd'

const props = defineProps<{
  ad: AdInfo | null
}>()

const emit = defineEmits<{
  click: []
  dismiss: []
  expired: []
}>()

const imgError = ref(false)
const progress = ref(100)  // 倒计时进度条 100% -> 0%
let expireTimer: ReturnType<typeof setInterval> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null

function startTimer() {
  clearTimer()
  if (!props.ad) return
  const durationMs = props.ad.duration * 1000
  const tickMs = 100
  const startedAt = Date.now()
  // 进度条更新
  progressTimer = setInterval(() => {
    const elapsed = Date.now() - startedAt
    progress.value = Math.max(0, 100 - (elapsed / durationMs) * 100)
  }, tickMs)
  // 到时自动消失
  expireTimer = setTimeout(() => {
    clearTimer()
    emit('expired')
  }, durationMs)
}

function clearTimer() {
  if (expireTimer) { clearTimeout(expireTimer); expireTimer = null }
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null }
}

function onImgError() {
  imgError.value = true
  console.warn('[ad] 图片加载失败', props.ad?.imageUrl)
}

// 广告出现/消失时管理定时器
watch(() => props.ad, (newAd) => {
  imgError.value = false
  progress.value = 100
  if (newAd) {
    startTimer()
  } else {
    clearTimer()
  }
}, { immediate: true })

onUnmounted(() => {
  clearTimer()
})
</script>

<style scoped>
.ad-slide-enter-active,
.ad-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.ad-slide-enter-from,
.ad-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
