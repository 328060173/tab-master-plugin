<template>
  <Teleport to="body">
    <div
      v-if="popover.isOpen('focus-help')"
      :style="bubbleStyle"
      data-popover-content
      class="fixed z-[60] w-[288px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3"
      @click.stop>
      <p class="text-xs font-medium text-gray-800 dark:text-gray-100 mb-2">{{ t('guide.focus.title') }}</p>
      <p class="text-[11px] text-gray-600 dark:text-gray-300 mb-3">
        {{ t('guide.focus.intro') }}
      </p>
      <div class="border-t border-gray-100 dark:border-gray-700 pt-2 mb-2">
        <p class="text-[11px] font-medium text-gray-700 dark:text-gray-200 mb-1">{{ t('guide.focus.behavior.label') }}</p>
        <ul class="text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
          <li>{{ t('guide.focus.behavior.1') }}</li>
          <li>{{ t('guide.focus.behavior.2') }}</li>
          <li>{{ t('guide.focus.behavior.3') }}</li>
          <li>{{ t('guide.focus.behavior.4') }}</li>
          <li>{{ t('guide.focus.behavior.5') }}</li>
          <li>{{ t('guide.focus.behavior.6') }}</li>
        </ul>
      </div>
      <div class="border-t border-gray-100 dark:border-gray-700 pt-2 mb-2">
        <p class="text-[11px] font-medium text-gray-700 dark:text-gray-200 mb-1">{{ t('guide.focus.scene.label') }}</p>
        <p class="text-[11px] text-gray-600 dark:text-gray-300">
          {{ t('guide.focus.scene.1') }}<br/>
          {{ t('guide.focus.scene.2') }}
        </p>
      </div>
      <div class="border-t border-gray-100 dark:border-gray-700 pt-2">
        <p class="text-[11px] text-gray-600 dark:text-gray-300">{{ t('guide.focus.operation') }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 聚焦模式说明气泡。
 *
 * 重要变更（2026-06-29 浮层统一改造）：
 * - 接入全局 PopoverManager（id='focus-help'）
 * - 关闭逻辑由 PopoverManager 统一处理：点空白关、Esc 关、打开别的 popover 自动关
 * - 之前的 setTimeout + 自管 document mousedown/click 逻辑全部删除
 * - 同样用 fixed + Teleport，定位由 PopoverManager 提供的 activeAnchorRect 决定
 *
 * 触发方：sidepanel.vue 的两个问号按钮调用 popover.toggle('focus-help', triggerEl)
 */
import { computed } from "vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"
import { t } from "~lib/i18n"

const popover = usePopoverManager()

const bubbleStyle = computed(() => {
  if (!popover.isOpen("focus-help") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  // 气泡宽 288px (w-72)，高度由内容定，不指定高度参与 clamp，避免动态高度反复翻转
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 288 }, "bottom-left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
</script>
