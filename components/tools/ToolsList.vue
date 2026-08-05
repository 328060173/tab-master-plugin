<template>
  <div class="flex flex-col gap-3 py-1">
    <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-200 px-1">{{ t('tools.list.title') }}</h2>
    <p class="text-[11px] text-gray-400 px-1 -mt-1">{{ t('tools.list.subtitle') }}</p>

    <button
      v-for="tool in tools"
      :key="tool.id"
      type="button"
      class="flex items-center gap-3 px-3 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-colors text-left"
      @click="emit('select', tool.id)"
    >
      <span class="shrink-0 w-9 h-9 flex items-center justify-center rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
        <component :is="tool.icon" :size="18" />
      </span>
      <span class="flex-1 min-w-0">
        <span class="block text-sm font-medium text-gray-800 dark:text-gray-100">{{ t(tool.titleKey) }}</span>
        <span class="block text-[11px] text-gray-400 truncate">{{ t(tool.subtitleKey) }}</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * 小工具列表 —— sidepanel「小工具」tab 的入口页。
 * 点击工具卡片 emit('select', tool)，由 sidepanel 切换到对应工具子组件。
 *
 * i18n 化（2026-08-05 i18n-en-support §6.1）：title/subtitle → titleKey/subtitleKey，模板 t() 翻译。
 */
import { StickyNote, Clock } from '@lucide/vue'
import type { Component } from 'vue'
import { t } from '~lib/i18n'

type ToolId = 'notes' | 'timestamp'

interface IToolCard {
  id: ToolId
  titleKey: string
  subtitleKey: string
  icon: Component
}

const tools: IToolCard[] = [
  { id: 'notes', titleKey: 'tools.list.notes.title', subtitleKey: 'tools.list.notes.subtitle', icon: StickyNote },
  { id: 'timestamp', titleKey: 'tools.list.timestamp.title', subtitleKey: 'tools.list.timestamp.subtitle', icon: Clock },
]

const emit = defineEmits<{ (e: 'select', tool: ToolId): void }>()
</script>
