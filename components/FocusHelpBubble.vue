<template>
  <Teleport to="body">
    <div
      v-if="popover.isOpen('focus-help')"
      :style="bubbleStyle"
      class="fixed z-[60] w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3"
      @click.stop>
      <p class="text-xs font-medium text-gray-800 dark:text-gray-100 mb-2">聚焦模式</p>
      <p class="text-[11px] text-gray-600 dark:text-gray-300 mb-3">
        开启后：浏览器只显示你选中的 4-5 个关键标签，其他标签折叠到灰色分组。
      </p>
      <div class="border-t border-gray-100 dark:border-gray-700 pt-2 mb-2">
        <p class="text-[11px] font-medium text-gray-700 dark:text-gray-200 mb-1">系统行为（提前知道才不慌）</p>
        <ul class="text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
          <li>· 标签不会关闭，数据和登录态完全保留</li>
          <li>· 固定标签会自动包含在聚焦集合内</li>
          <li>· 聚焦中新开的标签会自动加入聚焦集合</li>
          <li>· 聚焦中关闭最后一个标签 → 自动退出</li>
          <li>· 关闭浏览器 → 自动退出聚焦（分组保留）</li>
          <li>· chrome:// 等系统页面无法被折叠</li>
        </ul>
      </div>
      <div class="border-t border-gray-100 dark:border-gray-700 pt-2 mb-2">
        <p class="text-[11px] font-medium text-gray-700 dark:text-gray-200 mb-1">适合场景</p>
        <p class="text-[11px] text-gray-600 dark:text-gray-300">
          · 需要专注的 30 分钟 ~ 2 小时<br/>
          · 写代码 / 写文档 / 准备演讲 / 面试
        </p>
      </div>
      <div class="border-t border-gray-100 dark:border-gray-700 pt-2">
        <p class="text-[11px] text-gray-600 dark:text-gray-300">操作：勾选要聚焦的标签 → 一键折叠其他</p>
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

const popover = usePopoverManager()

const bubbleStyle = computed(() => {
  if (!popover.isOpen("focus-help") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  // 气泡宽 288px (w-72)，高度由内容定，不指定高度参与 clamp，避免动态高度反复翻转
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 288 }, "bottom-left")
  return { left: `${p.left}px`, top: `${p.top}px` }
})
</script>
