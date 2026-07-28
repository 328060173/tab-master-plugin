<template>
  <!--
    还原确认弹框。
    单根：Teleport + 单 div（守多根 fallthrough 红线）。
    - duplicate > 0：去重打开 / 全部打开 二选一
    - duplicate === 0：仅一个「打开」按钮
    关闭方式：右上角 X / Esc / 遮罩点击（无取消按钮，叉号已足够）
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restore-confirm-title"
        tabindex="-1"
        @keydown.esc="onCancel"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between px-5 pt-4 pb-2 shrink-0 gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <AlertTriangle :size="18" class="text-amber-500 shrink-0" />
            <h2 id="restore-confirm-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              还原确认
            </h2>
          </div>
          <button
            class="inline-flex items-center justify-center w-7 h-7 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
            aria-label="关闭"
            @click="onCancel"
          >
            <X :size="16" />
          </button>
        </div>

        <!-- 正文 -->
        <div class="px-5 pb-3 shrink-0">
          <p v-if="duplicate > 0" class="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
            这次备份共 <span class="font-semibold">{{ total }}</span> 个标签，其中
            <span class="font-semibold text-amber-600 dark:text-amber-400">{{ duplicate }}</span> 个
            当前已打开（目标：{{ target === 'current' ? '本窗口' : '新窗口' }}）。是否跳过已打开的标签？
          </p>
          <p v-else class="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
            这次备份共 <span class="font-semibold">{{ total }}</span> 个标签，均未打开。点击下方按钮开始打开。
          </p>
        </div>

        <!-- 按钮区（右对齐，无取消按钮，关闭走右上角 X / Esc / 遮罩） -->
        <div class="flex items-stretch justify-end gap-2 px-5 py-3 border-t border-gray-100 dark:border-gray-700 shrink-0 flex-wrap">
          <!-- duplicate === 0：仅一个「打开」主按钮 -->
          <button
            v-if="duplicate === 0"
            class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="onConfirmDedupe"
          >打开</button>

          <!-- duplicate > 0：全部打开 + 去重打开 -->
          <template v-else>
            <div class="flex flex-col items-end">
              <button
                class="px-3 py-1.5 min-h-[36px] text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="onConfirmAll"
              >全部打开</button>
              <span class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">含已打开的，会出现重复标签</span>
            </div>

            <div class="flex flex-col items-end">
              <button
                class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="onConfirmDedupe"
              >去重打开</button>
              <span class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">跳过已打开的，只补开 {{ toOpen }} 个</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 还原确认弹框：duplicate>0 时去重打开 / 全部打开；duplicate===0 时仅「打开」。
 * 关闭走右上角 X / Esc / 遮罩点击（无取消按钮）。
 * 守红线：单根（Teleport + 单 div）；事件全声明在 emits；禁 v-html。
 */
import { X, AlertTriangle } from '@lucide/vue'

defineProps<{
  open: boolean
  total: number
  duplicate: number
  toOpen: number
  target: 'current' | 'newWindow'
}>()

const emit = defineEmits<{
  (e: 'confirm', payload: { skipDuplicate: boolean }): void
  (e: 'cancel'): void
}>()

function onConfirmDedupe() {
  emit('confirm', { skipDuplicate: true })
}

function onConfirmAll() {
  emit('confirm', { skipDuplicate: false })
}

function onCancel() {
  emit('cancel')
}
</script>
