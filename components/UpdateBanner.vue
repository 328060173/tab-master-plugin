<template>
  <div :class="bannerClass" class="px-3 py-2 flex items-center gap-2 border-b">
    <!-- 图标 -->
    <component :is="iconComponent" :size="14" class="shrink-0" />
    <!-- 文案 -->
    <div class="flex-1 min-w-0">
      <p class="text-xs font-medium truncate">
        {{ forceFlag === 1 ? t('update.forceMsg') : tWithParams('update.normalMsg', { version: info.versionName }) }}
      </p>
      <p v-if="info.changeLog" class="text-[10px] opacity-80 truncate mt-0.5">
        {{ t('update.changeLog') }}: {{ info.changeLog }}
      </p>
    </div>
    <!-- 去更新按钮 -->
    <button
      class="px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 shrink-0"
      :class="buttonClass"
      @click="handleGoUpdate"
    >
      <Download :size="12" />
      {{ t('update.goUpdate') }}
    </button>
    <!-- 关闭按钮（仅非强制更新） -->
    <button
      v-if="forceFlag === 0"
      class="shrink-0 p-0.5 rounded transition-colors hover:bg-white/20"
      @click="handleDismiss"
    >
      <X :size="12" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, Info, X, Download } from '@lucide/vue'
import { t, tWithParams } from '~lib/i18n'
import type { UpdateInfo } from '~composables/useVersionCheck'

const props = defineProps<{
  info: UpdateInfo
}>()

const emit = defineEmits<{
  dismiss: []
  goUpdate: []
}>()

const forceFlag = computed(() => props.info.forceFlag)

// 根据强制/非强制选择图标
const iconComponent = computed(() => {
  return forceFlag.value === 1 ? AlertTriangle : Info
})

// Banner 样式类
const bannerClass = computed(() => {
  if (forceFlag.value === 1) {
    // 强制更新：红色背景
    return 'bg-red-600 text-white border-red-700 dark:bg-red-700 dark:border-red-800'
  }
  // 非强制更新：蓝色背景
  return 'bg-blue-600 text-white border-blue-700 dark:bg-blue-700 dark:border-blue-800'
})

// 按钮样式类
const buttonClass = computed(() => {
  if (forceFlag.value === 1) {
    return 'bg-white text-red-600 hover:bg-gray-100'
  }
  return 'bg-white text-blue-600 hover:bg-gray-100'
})

function handleDismiss() {
  emit('dismiss')
}

function handleGoUpdate() {
  emit('goUpdate')
}
</script>
