<template>
  <div class="flex flex-col gap-2 px-4 py-2">
    <!-- 标题 + 功能说明 -->
    <div class="flex items-center gap-1.5">
      <h2 class="text-xs font-bold text-gray-700 dark:text-gray-200">稍后处理</h2>
      <button
        :class="['p-0.5 rounded transition-colors', showHelp ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600']"
        title="这是什么？"
        @click="showHelp = !showHelp"
      >
        <HelpCircle :size="13" />
      </button>
      <span class="ml-auto text-[10px] text-gray-400">{{ items.length }} 个</span>
    </div>

    <!-- 功能说明（点问号展开）-->
    <div v-if="showHelp" class="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-2.5 text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">
      <p class="mb-1">把<b>暂时不看、之后还要用</b>的标签存到这里，然后关掉它腾出空间；需要时点一下就重新打开。</p>
      <p>添加方式：标签卡片上 hover 出汉堡菜单 → 选「稍后处理」（或右键标签 → 稍后处理），可加备注。🔒 仅存本机。</p>
    </div>

    <!-- 空态引导 -->
    <div v-if="!items.length" class="text-center text-gray-400 text-xs py-12">
      <p class="mb-1 font-medium text-gray-500 dark:text-gray-300">还没有稍后处理的标签 🌱</p>
      <p class="leading-relaxed">把暂时不看、之后要用的标签存这儿<br/>关掉它腾空间，需要时一键打开</p>
      <p class="mt-1.5 text-[10px] text-gray-300 leading-relaxed">添加：标签卡片 hover 菜单 / 右键 → 「稍后处理」</p>
    </div>

    <div
      v-for="item in items" :key="item.id"
      class="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors group"
      :title="`点击打开：${item.url}`"
      @click="emit('open', item.url)"
    >
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">{{ item.title }}</p>
        <p v-if="item.laterNote" class="text-xs text-amber-600 truncate mt-0.5">备注：{{ item.laterNote }}</p>
        <p class="text-[10px] text-gray-400 truncate">{{ item.url }}</p>
      </div>
      <div class="flex flex-col items-end gap-1 shrink-0">
        <span class="text-xs text-gray-400">{{ item.laterAddedAt }}</span>
        <span class="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100">点击打开 ↗</span>
      </div>
      <button class="p-1 rounded hover:bg-red-50 hover:text-red-600 text-gray-400 shrink-0" title="移除" @click.stop="emit('remove', item.id)">
        <X :size="13" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { X, HelpCircle } from "@lucide/vue"
import type { LaterItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"

defineProps<{ items: LaterItem[] }>()
const emit = defineEmits(["remove", "open"])
const showHelp = ref(false)
</script>
