<template>
  <div class="border-b border-gray-100 dark:border-gray-700">
    <!-- 通知条（点击展开）-->
    <button
      class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
      @click="toggleExpand"
    >
      <Bell :size="13" class="shrink-0 text-amber-500" />
      <span class="flex-1 truncate text-gray-600 dark:text-gray-300">
        {{ hasNotice ? latestNotice : t('notice.empty') }}
      </span>
      <span v-if="unreadCount > 0" class="shrink-0 text-[10px] bg-red-500 text-white px-1.5 rounded-full">
        {{ unreadCount }}
      </span>
      <ChevronDown
        :size="11"
        class="shrink-0 text-gray-400 transition-transform"
        :class="{ 'rotate-180': expanded }"
      />
    </button>

    <!-- 通知列表（展开时）-->
    <div v-if="expanded && hasNotice" class="px-3 pb-2 max-h-48 overflow-y-auto">
      <div
        v-for="n in notices"
        :key="n.id"
        class="py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-0"
      >
        <p class="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">{{ n.noticeLog }}</p>
        <p class="text-[10px] text-gray-400 mt-0.5">{{ n.createTime }}</p>
      </div>
      <button
        v-if="unreadCount > 0"
        class="mt-1 w-full text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
        @click.stop="onMarkAllRead"
      >
        {{ t('notice.markAllRead') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, ChevronDown } from '@lucide/vue'
import { t } from '~lib/i18n'
import type { NoticeItem } from '~composables/useNotice'

const props = defineProps<{
  notices: NoticeItem[]
  unreadCount: number
}>()

const emit = defineEmits<{
  markAllRead: []
}>()

const expanded = ref(false)

const hasNotice = computed(() => props.notices.length > 0)
const latestNotice = computed(() => props.notices[0]?.noticeLog || '')

function toggleExpand() {
  expanded.value = !expanded.value
}

function onMarkAllRead() {
  emit('markAllRead')
}
</script>
