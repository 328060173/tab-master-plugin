<template>
  <!--
    广告位占位组件（§11.5 props 接口预留）。
    阶段一：仅渲染占位卡，实际广告源后续接入。
    守红线：
    - 单根（外层 div）
    - 不阻塞核心：由父组件控制 DOM 顺序与延迟加载（requestIdleCallback）
    - 独立 ErrorBoundary 由父组件包（本组件只渲染占位）
    - 固定尺寸防 CLS（content-jumping）
  -->
  <div
    :class="[
      'relative flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500',
      sizeClass,
      fallback === 'hide' && !dismissible ? 'overflow-hidden' : 'overflow-hidden',
    ]"
    :data-slot-id="slotId"
    role="complementary"
    :aria-label="`广告位 ${slotId}`"
  >
    <!-- 占位文案（阶段一无广告源） -->
    <div v-if="!dismissed" class="flex flex-col items-center gap-1 px-3 py-2 text-center">
      <span class="text-[11px] font-medium">广告位 · {{ slotId }}</span>
      <span class="text-[10px] text-gray-400 dark:text-gray-500">{{ size }} · 待接入</span>
    </div>

    <!-- 折叠按钮（可折叠时显示） -->
    <button
      v-if="dismissible && !dismissed"
      class="absolute top-1 right-1 inline-flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :aria-label="`折叠广告位 ${slotId}`"
      title="折叠"
      @click="dismissed = true"
    >
      <ChevronDown :size="14" />
    </button>

    <!-- 折叠态：仅显示一个细条 + 展开按钮 -->
    <button
      v-if="dismissible && dismissed"
      class="w-full h-full flex items-center justify-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :aria-label="`展开广告位 ${slotId}`"
      title="展开"
      @click="dismissed = false"
    >
      <span>推广位</span>
      <ChevronUp :size="12" />
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * 广告位占位组件（§11.5）。
 * 阶段一：渲染灰色占位 + props 接口预留；广告源后续接入时同源校验 + CSP 白名单。
 * 不阻塞核心：DOM 顺序由父控制 + 父用 requestIdleCallback 延迟挂载。
 */
import { ref, computed } from "vue"
import { ChevronDown, ChevronUp } from "@lucide/vue"

export type AdSlotSize = '728x90' | '300x250' | '160x600' | '160x60' | '320x50'

const props = withDefaults(defineProps<{
  slotId: string
  size: AdSlotSize
  /** 降级策略：placeholder=显示占位（默认）；hide=折叠隐藏（保留高度防 CLS） */
  fallback?: 'placeholder' | 'hide'
  /** 是否可折叠（左菜单辅位=true / 主位=false 由父决定） */
  dismissible?: boolean
}>(), {
  fallback: 'placeholder',
  dismissible: false,
})

const dismissed = ref(false)

/** 按尺寸映射 Tailwind class（固定尺寸防 CLS） */
const sizeClass = computed(() => {
  switch (props.size) {
    case '728x90': return 'w-[728px] h-[90px] max-w-full'
    case '300x250': return 'w-[300px] h-[250px]'
    case '160x600': return 'w-[160px] h-[600px]'
    case '160x60': return 'w-[160px] h-[60px]'
    case '320x50': return 'w-[320px] h-[50px]'
    default: return 'w-full h-[90px]'
  }
})
</script>
