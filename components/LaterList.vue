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
      <p class="mb-1.5">把<b>暂时不看、之后还要用</b>的标签存到这里，然后关掉它腾出空间；需要时点一下就重新打开。</p>
      <p class="flex items-center flex-wrap gap-x-1 gap-y-1">
        <span>添加方式：点卡片上的</span>
        <Clock :size="13" class="inline-block text-amber-600" /><span>稍后处理小图标，</span>
        <span>或点</span>
        <Menu :size="13" class="inline-block" :stroke-width="2.25" /><span>汉堡菜单 → 选</span>
        <Clock :size="13" class="inline-block" /><span>稍后处理。可加备注。🔒 仅存本机。</span>
      </p>
    </div>

    <!-- 空态引导 -->
    <div v-if="!items.length" class="text-center text-gray-400 text-xs py-12">
      <p class="mb-1 font-medium text-gray-500 dark:text-gray-300">还没有稍后处理的标签 🌱</p>
      <p class="leading-relaxed">把暂时不看、之后要用的标签存这儿<br/>关掉它腾空间，需要时一键打开</p>
      <p class="flex items-center justify-center flex-wrap gap-x-1 mt-1.5 text-[10px] text-gray-400">
        <span>添加：点卡片的</span><Clock :size="11" class="inline-block" /><span>小图标，或</span><Menu :size="11" class="inline-block" /><span>菜单 → 稍后处理</span>
      </p>
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
        <p v-if="item.laterNote" class="text-xs text-amber-600 mt-0.5 break-all">备注：{{ item.laterNote }}</p>
        <p class="text-[10px] text-gray-400 truncate">{{ item.url }}</p>
      </div>
      <div class="flex flex-col items-end gap-1 shrink-0">
        <span class="text-xs text-gray-400">{{ item.laterAddedAt }}</span>
        <span class="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100">点击打开 ↗</span>
      </div>
      <button class="p-1 rounded hover:bg-red-50 hover:text-red-600 text-gray-400 shrink-0" title="移除" @click.stop="askRemove(item)">
        <X :size="13" />
      </button>
    </div>
  </div>

  <!-- 移除确认弹框 -->
  <Teleport to="body">
    <div v-if="removing" class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center" @click.self="removing = null">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-72 p-5">
        <h3 class="text-sm font-bold mb-2 text-gray-900 dark:text-gray-100">确认移除这条稍后处理？</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 break-all">「{{ removing.title }}」</p>
        <p class="text-xs text-red-500 mb-4">移除后该记录将清除，如需找回请用浏览器历史。</p>
        <div class="flex gap-2 justify-end">
          <button class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200" @click="removing = null">取消</button>
          <button class="px-4 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600" @click="confirmRemove">确认移除</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { X, HelpCircle, Menu, Clock } from "@lucide/vue"
import type { LaterItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"

defineProps<{ items: LaterItem[] }>()
const emit = defineEmits(["remove", "open"])
const showHelp = ref(false)
// 移除确认：点叉号先弹确认，避免误删稍后处理记录
const removing = ref<LaterItem | null>(null)
const askRemove = (item: LaterItem) => { removing.value = item }
const confirmRemove = () => {
  if (removing.value) emit("remove", removing.value.id)
  removing.value = null
}
</script>
