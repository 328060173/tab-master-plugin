<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center"
      @click="onMaskClick"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[360px] p-5"
        role="dialog"
        aria-modal="true"
        :aria-label="t('login.title')"
      >
        <!-- 标题栏 -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">
            {{ t('login.title') }}
          </h3>
          <button
            class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            @click="emit('close')"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 表单 -->
        <div class="space-y-4">
          <!-- 邮箱 -->
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              {{ t('login.email') }}
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
              <input
                v-model="email"
                type="email"
                class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                :placeholder="t('login.emailPlaceholder')"
                @keyup.enter="emailCodeRef?.focus()"
              />
            </div>
          </div>

          <!-- 图形验证码 -->
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              {{ t('login.captcha') }}
            </label>
            <CaptchaInput ref="captchaRef" @update="onCaptchaUpdate" @skip="onCaptchaSkip" />
          </div>

          <!-- 邮箱验证码 -->
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              {{ t('login.emailCode') }}
            </label>
            <div class="flex gap-2">
              <input
                ref="emailCodeRef"
                v-model="emailCode"
                type="text"
                class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                :placeholder="t('login.emailCodePlaceholder')"
                maxlength="6"
                @keyup.enter="handleLogin"
              />
              <button
                :disabled="countdown > 0 || !canSendCode"
                class="px-3 py-2 text-xs rounded whitespace-nowrap transition-colors"
                :class="
                  countdown > 0 || !canSendCode
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                "
                @click="handleSendCode"
              >
                {{ countdown > 0 ? `${countdown}s` : t('login.getCode') }}
              </button>
            </div>
            <p v-if="codeSentTip" class="mt-1 text-[11px]" :class="codeSentTip === t('login.codeSent') ? 'text-green-600 dark:text-green-400' : 'text-red-500'">
              {{ codeSentTip }}
            </p>
          </div>

          <!-- 登录按钮 -->
          <button
            :disabled="!canLogin || loading"
            class="w-full py-2 text-sm rounded font-medium transition-colors"
            :class="
              !canLogin || loading
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            "
            @click="handleLogin"
          >
            {{ loading ? t('common.loading') : t('login.submit') }}
          </button>

          <!-- 登录即注册提示 -->
          <p class="text-[11px] text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            {{ t('login.autoRegisterTip') }}
          </p>

          <!-- 用户协议 -->
          <p class="text-[11px] text-gray-400 text-center">
            {{ t('login.agree') }}
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { X, Mail } from '@lucide/vue'
import { t } from '~lib/i18n'
import { post } from '~lib/api'
import { API_URIS, APP_HEADERS } from '~lib/api-config'
import { collectDeviceInfo, ACCESS_LOC } from '~lib/device-info'
import { useAuth } from '~composables/useAuth'
import CaptchaInput from './CaptchaInput.vue'

// props & emits
const props = defineProps<{
  open: boolean
}>()
const emit = defineEmits<{
  close: []
  success: [email: string]
}>()

// auth
const { login } = useAuth()

// 表单状态
const email = ref('')
const emailCode = ref('')
const captchaUuid = ref('')
const captchaCode = ref('')
const captchaEnabled = ref(true)
const loading = ref(false)
const codeSentTip = ref('')

// 倒计时
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// refs
const captchaRef = ref<InstanceType<typeof CaptchaInput>>()
const emailCodeRef = ref<HTMLInputElement>()

// 计算属性
const canSendCode = computed(() => {
  if (!email.value || !email.value.includes('@')) return false
  if (captchaEnabled.value && (!captchaUuid.value || !captchaCode.value)) return false
  return true
})

const canLogin = computed(() => {
  if (!email.value || !email.value.includes('@')) return false
  if (!emailCode.value || emailCode.value.length < 4) return false
  // 登录需要新的图形验证码（发码时已消费旧的，发码后已刷新拉新，用户需再输一次）
  if (captchaEnabled.value && (!captchaUuid.value || !captchaCode.value)) return false
  return true
})

// 图形验证码更新
function onCaptchaUpdate(data: { uuid: string; code: string }) {
  captchaUuid.value = data.uuid
  captchaCode.value = data.code
}

function onCaptchaSkip() {
  captchaEnabled.value = false
  captchaUuid.value = ''
  captchaCode.value = ''
}

// 发送邮箱验证码
async function handleSendCode() {
  if (!canSendCode.value || countdown.value > 0) return

  try {
    await post(API_URIS.sendLoginCode, {
      email: email.value,
      captchaUuid: captchaUuid.value,
      captchaCode: captchaCode.value,
      appCode: APP_HEADERS.appCode
    })

    // 成功 - 开始倒计时 + 提示（弹窗保持打开，用户继续输邮箱验证码）
    startCountdown()
    codeSentTip.value = t('login.codeSent')
    // 发码已消费图形验证码（后端校验后删除），立即刷新拉一个新的，登录时需要再次输入新图形码
    captchaRef.value?.refresh()
    // 清空旧的 captchaCode，提示用户输入新的图形码
    captchaCode.value = ''
  } catch (e) {
    // 失败 - 如果是验证码错误，刷新图形验证码
    const errMsg = e instanceof Error ? e.message : '发送失败'
    codeSentTip.value = errMsg
    if (errMsg.includes('验证码') && captchaRef.value) {
      captchaRef.value.refresh()
    }
  }
}

// 登录
async function handleLogin() {
  if (!canLogin.value || loading.value) return

  loading.value = true
  try {
    const res = await post<{
      code: number
      msg: string
      data: {
        token: string
        customerId: string
        email: string
      }
    }>(API_URIS.loginByEmailCode, {
      email: email.value,
      code: emailCode.value,
      captchaUuid: captchaUuid.value,
      captchaCode: captchaCode.value,
      // 设备信息 + 版本 + 登录类型（后端 LoginEmailRequest 字段，记录登录设备）
      accessDeviceInfo: collectDeviceInfo(),
      accessLoc: ACCESS_LOC,
      appCode: APP_HEADERS.appCode,
      versionCode: APP_HEADERS.versionCode,
      loginType: 2  // 1=未登录 2=已登录（此处是登录动作，后端约定）
    })

    // 登录成功
    await login(res.data.token, {
      id: res.data.customerId,
      email: res.data.email,
      isVip: false, // 样板阶段无 VIP
      vipExpiresAt: null
    })

    emit('success', res.data.email)
    emit('close')
  } catch (e) {
    // 失败 - 如果是验证码错误，刷新图形验证码
    const errMsg = e instanceof Error ? e.message : '登录失败'
    codeSentTip.value = errMsg
    if (errMsg.includes('验证码') && captchaRef.value) {
      captchaRef.value.refresh()
    }
  } finally {
    loading.value = false
  }
}

// 倒计时
function startCountdown() {
  countdown.value = 60
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

// 遮罩点击
function onMaskClick(e: MouseEvent) {
  e.stopPropagation()
  if (e.target === e.currentTarget) emit('close')
}

// ESC 关闭
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) emit('close')
}
watch(() => props.open, (v) => {
  if (v) {
    document.addEventListener('keydown', onKey)
    // 打开时重置状态
    codeSentTip.value = ''
  } else {
    document.removeEventListener('keydown', onKey)
  }
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>
