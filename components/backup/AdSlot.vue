<template>
  <!--
    广告位组件（独立页 tabs/backup.vue 用）。
    单根（外层 div），无 fallthrough。
    渲染策略：
    - ad 有值 + 图片未失败 → 渲染广告图（可点跳转 chrome.tabs.create）
    - ad 为 null / loading / 图片加载失败 → 渲染占位（灰框 + "广告位" + 尺寸 + 状态文案）
    - 折叠态（dismissible && dismissed）→ 仅展开按钮
    守红线：
    - 禁 v-html（title 用 {{ }} 文本插值）
    - 图片 imageUrl 由后端返回，<img src> 渲染（广告图必须从后端加载，允许）
    - 不外链字体/图标 CDN（图标走 @lucide/vue 打包）
    - 固定尺寸防 CLS
    - 容错：图片 onerror → 显占位；广告崩由父 ErrorBoundary 兜底
  -->
  <div
    :class="[
      'relative flex items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 overflow-hidden',
      sizeClass
    ]"
    :data-slot-id="slotId"
    role="complementary"
    :aria-label="`广告位 ${slotId}`"
  >
    <!-- 折叠态：仅展开按钮 -->
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

    <!-- 未折叠：广告 or 占位 -->
    <template v-else>
      <!-- 广告内容（有数据 + 图片未失败） -->
      <a
        v-if="hasAd"
        :href="ad.linkUrl || '#'"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full h-full"
        :title="ad.title"
        :aria-label="ad.title || '推广链接'"
        @click.prevent="onAdClick"
      >
        <img
          :src="ad.imageUrl"
          :alt="ad.title"
          class="w-full h-full object-contain"
          loading="lazy"
          @error="onImgError"
        />
      </a>

      <!-- 占位（无广告 / 加载中 / 图片失败） -->
      <div v-else class="flex flex-col items-center gap-1 px-3 py-2 text-center">
        <span class="text-[11px] font-medium">广告位 · {{ slotId }}</span>
        <span class="text-[10px] text-gray-400 dark:text-gray-500">{{ size }} · {{ statusLabel }}</span>
      </div>

      <!-- 折叠按钮（未折叠态显示，覆盖在广告/占位右上角） -->
      <button
        v-if="dismissible"
        class="absolute top-1 right-1 inline-flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 dark:bg-gray-800/60"
        :aria-label="`折叠广告位 ${slotId}`"
        title="折叠"
        @click="dismissed = true"
      >
        <ChevronDown :size="14" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * 广告位组件（独立页 tabs/backup.vue 用）。
 * - props.ad 有值 → 渲染广告图（点击 chrome.tabs.create 打开 linkUrl）
 * - props.ad 为 null / loading / 图片失败 → 渲染占位
 * - 可折叠（dismissible）：折叠态仅显展开按钮，状态不持久化（P0 常驻）
 * 容错：广告接口/图片任何错误都静默显占位，不波及备份业务（父用 ErrorBoundary 兜底）
 */
import { ref, computed, watch } from "vue";
import { ChevronDown, ChevronUp } from "@lucide/vue";
import type { AdItem } from "~types/ad";

export type AdSlotSize = '728x90' | '300x250' | '160x600' | '160x60' | '320x50';

const props = withDefaults(defineProps<{
  slotId: string;
  size: AdSlotSize;
  /** 广告数据：有值渲染广告，null 显占位 */
  ad: AdItem | null;
  /** 降级策略：placeholder=显示占位（默认）；hide=折叠隐藏（保留高度防 CLS） */
  fallback?: 'placeholder' | 'hide';
  /** 是否可折叠（左菜单辅位=true / 主位=false 由父决定） */
  dismissible?: boolean;
}>(), {
  fallback: 'placeholder',
  dismissible: false,
});

// 折叠状态（P0 不持久化，每次进页默认展开）
const dismissed = ref(false);
// 图片加载失败标志（onerror 触发后置 true，回占位；ad 变化时重置）
const imgFailed = ref(false);

/** 是否有有效广告可渲染（ad 有值 + imageUrl 非空 + 图片未失败） */
const hasAd = computed(() => {
  return !!(props.ad && props.ad.imageUrl && !imgFailed.value);
});

/** 占位状态文案（占位时第二行显示） */
const statusLabel = computed(() => {
  if (imgFailed.value) return '加载失败';
  if (props.ad && !props.ad.imageUrl) return '暂无素材';
  return '待接入';
});

/** 按尺寸映射 Tailwind class（固定尺寸防 CLS）；主位 728×90 窄屏响应式降到 320×50 */
const sizeClass = computed(() => {
  switch (props.size) {
    // 主位：≥640px 用 728×90，窄屏 320×50（防溢出 + 移动端友好）
    case '728x90': return 'w-[320px] h-[50px] sm:w-[728px] sm:h-[90px] max-w-full';
    case '300x250': return 'w-[300px] h-[250px]';
    case '160x600': return 'w-[160px] h-[600px]';
    case '160x60': return 'w-[160px] h-[60px]';
    case '320x50': return 'w-[320px] h-[50px]';
    default: return 'w-full h-[90px]';
  }
});

/** 广告图加载失败 → 回占位（不抛、不 toast） */
function onImgError() {
  imgFailed.value = true;
}

// 广告 id 变化（fetchAd 拉到新广告）时重置图片失败标志，让新图重试渲染
watch(
  () => props.ad?.id,
  () => { imgFailed.value = false; }
);

/** 广告点击：chrome.tabs.create 打开 linkUrl（拦截默认导航） */
function onAdClick() {
  const url = props.ad?.linkUrl;
  if (!url) return;
  try {
    chrome.tabs.create({ url });
  } catch (e) {
    console.warn('[ad-slot] 打开广告链接失败', e);
  }
}
</script>
