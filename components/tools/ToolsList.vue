<template>
  <div class="flex flex-col gap-3 py-1">
    <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-200 px-1">小工具</h2>
    <p class="text-[11px] text-gray-400 px-1 -mt-1">本地辅助小工具，数据不离开浏览器。</p>

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
        <span class="block text-sm font-medium text-gray-800 dark:text-gray-100">{{ tool.title }}</span>
        <span class="block text-[11px] text-gray-400 truncate">{{ tool.subtitle }}</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * 小工具列表 —— sidepanel「小工具」tab 的入口页。
 * 点击工具卡片 emit('select', tool)，由 sidepanel 切换到对应工具子组件。
 */
import { StickyNote, Clock } from '@lucide/vue'
import type { Component } from 'vue'

type ToolId = 'notes' | 'timestamp'

interface IToolCard {
  id: ToolId
  title: string
  subtitle: string
  icon: Component
}

const tools: IToolCard[] = [
  { id: 'notes', title: '小便签', subtitle: '常用信息本地记', icon: StickyNote },
  { id: 'timestamp', title: '时间戳转换', subtitle: '时间戳与时间互转', icon: Clock },
]

const emit = defineEmits<{ (e: 'select', tool: ToolId): void }>()
</script>
