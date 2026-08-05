<template>
  <div class="text-center p-4 text-gray-400 text-sm">
    {{ t('popup.hint') }}
  </div>
</template>

<script setup lang="ts">
/**
 * popup 入口（点击扩展图标时弹出的小框）。
 * 当前仅一行引导文案，功能在 sidepanel 内。
 *
 * i18n 初始化（与 sidepanel/options 一致）：读 __locale__ 偏好 + 检测浏览器语言，
 * 让后续若用 t() 时 locale 已就绪。不阻塞渲染，失败静默回退默认 zh-CN。
 */
import { onMounted } from 'vue'
import { initLocale, t } from '~lib/i18n'

onMounted(() => {
  initLocale().catch((e) => console.warn('[popup] initLocale 失败', e))
})
</script>
