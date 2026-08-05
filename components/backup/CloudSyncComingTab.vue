<template>
  <!--
    云同步开发中页（备份独立页 tabs/backup.vue 云同步菜单对应内容，2026-07-28 立）。
    单根（外层 div），无 fallthrough。
    用户场景：云同步未上线，让用户催作者加快进度（提交反馈到后端 /feedback/nudge-author）。
    守红线：
    - 单根
    - 禁 v-html（纯文本插值）
    - 不外链字体/图标 CDN（Cloud 图标走 @lucide/vue 打包）
    - 邮箱/备注前端校验 + 防连点（submitting 态 disabled）
    - Promise 必 catch（post 内部已归一错误，外层 try/catch 兜底）
    - 文案守 §2 术语（用户可见处无技术黑话）
  -->
  <div
    class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-xl mx-auto">
    <!-- 顶部图标 + 标题 -->
    <div class="flex flex-col items-center text-center mb-6">
      <div
        class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3">
        <Cloud :size="24" class="text-blue-600 dark:text-blue-400" />
      </div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ t('backup.comp.cloudSync.title') }}
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
        {{ t('backup.comp.cloudSync.desc') }}
      </p>
    </div>

    <!-- 催更表单 -->
    <form class="space-y-4" @submit.prevent="onSubmit">
      <!-- 联系邮箱（可选） -->
      <div>
        <label
          for="nudge-email"
          class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >{{ t('backup.comp.cloudSync.emailLabel') }}</label
        >
        <input
          id="nudge-email"
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          :disabled="submitting"
          :placeholder="t('backup.comp.cloudSync.emailPlaceholder')"
          class="w-full px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          maxlength="100" />
      </div>

      <!-- 备注（可选） -->
      <div>
        <label
          for="nudge-remark"
          class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >{{ t('backup.comp.cloudSync.remarkLabel') }}</label
        >
        <textarea
          id="nudge-remark"
          v-model="remark"
          :disabled="submitting"
          :placeholder="t('backup.comp.cloudSync.remarkPlaceholder')"
          rows="3"
          maxlength="200"
          class="w-full px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed resize-none"></textarea>
        <div
          class="text-[11px] text-gray-400 dark:text-gray-500 mt-1 text-right">
          {{ remark.length }}/200
        </div>
      </div>

      <!-- 提交按钮 -->
      <button
        type="submit"
        :disabled="submitting"
        class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed">
        <span v-if="submitting">{{ t('backup.comp.cloudSync.submitting') }}</span>
        <span v-else>{{ t('backup.comp.cloudSync.submit') }}</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * 云同步开发中页（催作者）。
 * - 表单：邮箱（可选）+ 备注（可选，maxlength 200）
 * - 提交：POST /feedback/nudge-author { email, remark }
 * - 成功：toast「已收到，感谢催更」+ 清空表单
 * - 失败：toast「提交失败，请稍后再试」
 * - 防连点：submitting 态 disabled
 * - 邮箱前端校验：填了才校验，不通过 toast「邮箱格式不正确」
 */
import { Cloud } from "@lucide/vue"
import { ref } from "vue"

import { showToast } from "~composables/useToast"
import { post } from "~lib/api"
import type { BaseResponse } from "~lib/api"
import { API_URIS } from "~lib/api-config"
import { t } from "~lib/i18n"

// 表单字段
const email = ref("")
const remark = ref("")
const submitting = ref(false)

/** 简单邮箱正则（不追求 RFC 完整，覆盖常见格式够用） */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 提交催更 */
async function onSubmit() {
  if (submitting.value) return
  // 邮箱校验：填了才校验
  const trimmedEmail = email.value.trim()
  if (trimmedEmail && !EMAIL_RE.test(trimmedEmail)) {
    showToast(t('backup.comp.cloudSync.emailInvalid'))
    return
  }
  submitting.value = true
  try {
    const res = await post<BaseResponse>(
      API_URIS.nudgeAuthor,
      {
        email: trimmedEmail || undefined,
        remark: remark.value.trim() || undefined
      },
      { timeout: 10000 }
    )
    if (res.code === 200) {
      showToast(t('backup.comp.cloudSync.success'))
      // 清空表单
      email.value = ""
      remark.value = ""
    } else {
      showToast(res.msg || t('backup.comp.cloudSync.failed'))
    }
  } catch (e) {
    console.warn("[cloud-sync-coming] 催更提交失败", e)
    showToast(t('backup.comp.cloudSync.failed'))
  } finally {
    submitting.value = false
  }
}
</script>
