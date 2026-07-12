<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw } from '@lucide/vue'
import { get } from '../lib/api'
import { API_URIS } from '../lib/api-config'
import { t } from '../lib/i18n'

// emits
const emit = defineEmits<{
  (e: 'update', value: { uuid: string; code: string }): void
  (e: 'skip'): void
}>()

// 验证码状态
const captchaEnabled = ref(true)
const captchaUuid = ref('')
const captchaCode = ref('')
const captchaImg = ref('')
const isLoading = ref(false)
const loadError = ref(false)  // 加载失败：显示"点击重试"占位

/**
 * 获取验证码
 */
async function fetchCaptcha() {
  isLoading.value = true
  loadError.value = false
  try {
    // 5 秒超时；验证码失败用 silent（warn 级，不刷 error 红线），但 UI 给重试提示
    const res = await get<{
      code: number
      msg: string
      captchaEnabled: boolean
      uuid: string
      img: string
    }>(API_URIS.captchaImage, { timeout: 5000, silent: true })

    captchaEnabled.value = res.captchaEnabled
    captchaUuid.value = res.uuid
    captchaImg.value = res.img
    captchaCode.value = ''

    if (!res.captchaEnabled) {
      emit('skip')
    } else {
      emit('update', { uuid: res.uuid, code: '' })
    }
  } catch (error) {
    // 失败：显示"点击重试"占位，用户点可重拉
    console.warn('[captcha] 获取失败（静默，点图片可重试）', error)
    loadError.value = true
  } finally {
    isLoading.value = false
  }
}

/**
 * 输入验证码
 */
function onCodeInput(e: Event) {
  const target = e.target as HTMLInputElement
  captchaCode.value = target.value
  emit('update', { uuid: captchaUuid.value, code: captchaCode.value })
}

/**
 * 点击刷新验证码
 */
function refreshCaptcha() {
  fetchCaptcha()
}

// 组件挂载时获取验证码
onMounted(() => {
  fetchCaptcha()
})

// 暴露刷新方法给父组件
defineExpose({
  refresh: refreshCaptcha
})
</script>

<template>
  <div v-if="captchaEnabled" class="flex gap-2 w-full">
    <!-- 验证码图片 -->
    <div
      class="w-[120px] h-11 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded cursor-pointer overflow-hidden flex-shrink-0 flex items-center justify-center transition-all hover:border-blue-500"
      :class="{ 'opacity-50 cursor-not-allowed': isLoading, 'border-red-400': loadError }"
      @click="refreshCaptcha"
      :title="loadError ? '加载失败，点击重试' : '点击刷新'"
    >
      <span v-if="loadError" class="text-[10px] text-red-500 px-1 text-center">加载失败<br/>点击重试</span>
      <img
        v-else-if="!isLoading && captchaImg"
        :src="`data:image/jpeg;base64,${captchaImg}`"
        alt="验证码"
        class="w-full h-full object-cover"
      />
      <RefreshCw
        v-else
        :size="24"
        class="text-gray-400 animate-spin"
      />
    </div>

    <!-- 验证码输入框 -->
    <input
      type="text"
      class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      v-model="captchaCode"
      @input="onCodeInput"
      :placeholder="t('captcha.placeholder', '验证码')"
      maxlength="4"
      autocomplete="off"
    />
  </div>
</template>
