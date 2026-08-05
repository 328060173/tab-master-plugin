<template>
  <!--
    广告位组件（独立页 tabs/backup.vue 用）。
    单根（外层 div），无 fallthrough。
    渲染策略（2026-07-29 调整：对标 sidepanel AdBanner 弹层范式，去折叠态）：
    - ad 有值 + 图片未失败 + 未关闭 → 渲染广告（图 + 右上 X 关闭 + 标题条）
    - ad 为 null / loading / 图片失败 / 已关闭 → 整个组件不渲染
    守红线：
    - 禁 v-html（title 用 {{ }} 文本插值）
    - 图片 imageUrl 由后端返回，<img src> 渲染（广告图必须从后端加载，允许）
    - 不外链字体/图标 CDN（图标走 @lucide/vue 打包）
    - 固定尺寸防 CLS
    - 容错：图片 onerror → 整个组件不渲染；广告崩由父 ErrorBoundary 兜底
  -->
  <div
    v-if="hasAd && !dismissed"
    :class="[
      'relative flex flex-col rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm',
      sizeClass
    ]"
    :data-slot-id="slotId"
    role="complementary"
    :aria-label="tWithParams('backup.comp.adSlot.aria', { slotId })"
  >
    <!-- 广告图片（可点击跳转） -->
    <a
      :href="ad.linkUrl || '#'"
      target="_blank"
      rel="noopener noreferrer"
      class="block w-full flex-1 min-h-0 relative"
      :title="ad.title"
      :aria-label="ad.title || t('backup.comp.adSlot.linkAria')"
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

    <!-- 右上角 X 关闭按钮（对标 AdBanner） -->
    <button
      class="absolute top-1 right-1 inline-flex items-center justify-center w-6 h-6 p-0 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :aria-label="t('backup.comp.adSlot.closeAria')"
      :title="t('backup.comp.adSlot.close')"
      @click.stop="onDismiss"
    >
      <X :size="14" />
    </button>

    <!-- 广告标题条（对标 AdBanner：推广 label + title） -->
    <div class="px-2 py-1.5 flex items-center gap-1.5 shrink-0">
      <span class="text-[10px] text-gray-400 uppercase tracking-wide shrink-0">{{ t('backup.comp.adSlot.promo') }}</span>
      <span class="text-xs text-gray-700 dark:text-gray-200 truncate flex-1">{{ ad.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 广告位组件（独立页 tabs/backup.vue 用）。
 * - props.ad 有值 → 渲染广告图（点击 chrome.tabs.create 打开 linkUrl）+ 右上 X 关闭 + 标题条
 * - props.ad 为 null / loading / 图片失败 / 已关闭 → 整个组件不渲染
 * - 关闭态（dismissed）：P0 不持久化，本会话不再渲染；ad id 变化（拉到新广告）时重置为 false 重新展示
 * 容错：广告接口/图片任何错误都静默不渲染，不波及备份业务（父用 ErrorBoundary 兜底）
 *
 * 兼容说明：dismissible / fallback props 保留以兼容 4 个父组件传参，行为统一为可关闭 + 无广告不渲染。
 */
import { ref, computed, watch } from "vue";
import { X } from "@lucide/vue";
import type { AdItem } from "~types/ad";
import { t, tWithParams } from "~lib/i18n";

export type AdSlotSize = '728x90' | '300x250' | '160x600' | '160x60' | '320x50';

const props = withDefaults(defineProps<{
  slotId: string;
  size: AdSlotSize;
  /** 广告数据：有值渲染广告，null 不渲染 */
  ad: AdItem | null;
  /** 降级策略（保留兼容父组件传参，当前行为统一为不渲染） */
  fallback?: 'placeholder' | 'hide';
  /** 是否可关闭（保留兼容父组件传参，当前行为统一为可关闭） */
  dismissible?: boolean;
}>(), {
  fallback: 'placeholder',
  dismissible: false,
});

// 关闭状态（P0 不持久化，本会话关闭后不再渲染；ad id 变化时重置为 false）
const dismissed = ref(false);
// 图片加载失败标志（onerror 触发后置 true，整个组件不渲染；ad 变化时重置）
const imgFailed = ref(false);

/** 是否有有效广告可渲染（ad 有值 + imageUrl 非空 + 图片未失败） */
const hasAd = computed(() => {
  return !!(props.ad && props.ad.imageUrl && !imgFailed.value);
});

/** 按尺寸映射 Tailwind class（固定尺寸防 CLS）；主位 728×90 窄屏响应式降到 320×50 */
const sizeClass = computed(() => {
  switch (props.size) {
    // 主位：≥640px 用 728×90，窄屏 320×50（防溢出 + 移动端友好）
    case '728x90': return 'w-[320px] h-[80px] sm:w-[728px] sm:h-[110px] max-w-full';
    case '300x250': return 'w-[300px] h-[250px]';
    case '160x600': return 'w-[160px] h-[600px]';
    case '160x60': return 'w-[160px] h-[80px]';
    case '320x50': return 'w-[320px] h-[80px]';
    default: return 'w-full h-[110px]';
  }
});

/** 关闭广告：本会话不再渲染（P0 不持久化，不记 adId） */
function onDismiss() {
  dismissed.value = true;
}

/** 广告图加载失败 → 整个组件不渲染（不抛、不 toast） */
function onImgError() {
  imgFailed.value = true;
}

// 广告 id 变化（fetchAd 拉到新广告）时重置图片失败标志 + 关闭态，让新广告重新展示
watch(
  () => props.ad?.id,
  () => {
    imgFailed.value = false;
    dismissed.value = false;
  }
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
