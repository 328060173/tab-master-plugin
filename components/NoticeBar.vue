<template>
  <div v-if="hasNotice" class="border-b border-gray-100 dark:border-gray-700">
    <!-- 通知条（点击弹框查看全文）-->
    <button
      class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
      @click="openDialog"
    >
      <Bell :size="13" class="shrink-0 text-amber-500" />
      <span class="flex-1 truncate text-gray-600 dark:text-gray-300">
        {{ latestNotice }}
      </span>
      <span v-if="unreadCount > 0" class="shrink-0 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
        {{ unreadCount }}
      </span>
      <ChevronRight :size="11" class="shrink-0 text-gray-400" />
    </button>

    <!-- 通知详情弹框（Teleport 到 body，仍属单根组件——Teleport 不在自身 DOM 树渲染）-->
    <Teleport to="body">
      <div
        v-if="dialogOpen && latestNoticeItem"
        class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-4"
        @click="closeDialog"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[360px] max-w-full p-5"
          role="dialog"
          aria-label="通知详情"
          @click.stop
        >
          <!-- 标题 -->
          <div class="flex items-center gap-2 mb-3">
            <Bell :size="15" class="text-amber-500 shrink-0" />
            <h3 class="text-sm font-bold text-gray-900 dark:text-gray-100">通知</h3>
          </div>

          <!-- 通知全文（不截断，保留换行）-->
          <p class="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
            {{ latestNoticeItem.noticeLog }}
          </p>
          <p class="text-[10px] text-gray-400 mt-2">{{ latestNoticeItem.createTime }}</p>

          <!-- 操作按钮 -->
          <div class="flex gap-2 mt-4 justify-end">
            <button
              class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              @click="closeDialog"
            >{{ t('notice.gotIt') }}</button>
            <button
              class="px-4 py-1.5 text-sm rounded-lg text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500"
              @click="onDontShowAgain"
            >{{ t('notice.dontShowAgain') }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, ChevronRight } from '@lucide/vue'
import { t } from '~lib/i18n'
import type { NoticeItem } from '~composables/useNotice'

const props = defineProps<{
  notices: NoticeItem[]
  unreadCount: number
}>()

const emit = defineEmits<{
  markRead: [id: number]
}>()

const dialogOpen = ref(false)

const hasNotice = computed(() => props.notices.length > 0)
const latestNotice = computed(() => props.notices[0]?.noticeLog || '')
const latestNoticeItem = computed(() => props.notices[0] || null)

function openDialog() {
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
}

function onDontShowAgain() {
  const item = latestNoticeItem.value
  if (item) {
    emit('markRead', item.id)
  }
  dialogOpen.value = false
}
</script>
