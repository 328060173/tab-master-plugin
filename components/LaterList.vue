<template>
  <div class="flex flex-col gap-2 px-4 py-2">
    <!-- 标题 + 功能说明 -->
    <div class="flex items-center gap-1.5">
      <h2 class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ t('later.title') }}</h2>
      <button
        :class="['p-0.5 rounded transition-colors', showHelp ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600']"
        :title="t('common.whatIsThis')"
        @click="showHelp = !showHelp"
      >
        <HelpCircle :size="13" />
      </button>
      <span class="ml-auto text-[10px] text-gray-400">{{ tWithParams('later.count', { count: items.length }) }}</span>
    </div>

    <!-- 功能说明（点问号展开）-->
    <div v-if="showHelp" class="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-2.5 text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">
      <p class="mb-1.5" v-html="t('later.help.body1')"></p>
      <p class="flex items-center flex-wrap gap-x-1 gap-y-1">
        <span>{{ t('later.help.body2') }}</span>
        <Clock :size="13" class="inline-block text-amber-600" /><span>{{ t('later.help.body2Icon') }}</span>
        <span>{{ t('later.help.body3') }}</span>
        <Menu :size="13" class="inline-block" :stroke-width="2.25" /><span>{{ t('later.help.body3Icon') }}</span>
        <Clock :size="13" class="inline-block" /><span>{{ t('later.help.body4') }}</span>
      </p>
    </div>

    <!-- 空态引导 -->
    <div v-if="!items.length" class="text-center text-gray-400 text-xs py-12">
      <p class="mb-1 font-medium text-gray-500 dark:text-gray-300">{{ t('later.empty.title') }}</p>
      <p class="leading-relaxed" v-html="t('later.empty.body')"></p>
      <p class="flex items-center justify-center flex-wrap gap-x-1 mt-1.5 text-[10px] text-gray-400">
        <span>{{ t('later.empty.hint1') }}</span><Clock :size="11" class="inline-block" /><span>{{ t('later.empty.hint2') }}</span><Menu :size="11" class="inline-block" /><span>{{ t('later.empty.hint3') }}</span>
      </p>
    </div>

    <div
      v-for="item in items" :key="item.id"
      class="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors group"
      :title="tWithParams('later.item.openTitle', { url: item.url })"
      @click="emit('open', item.url)"
    >
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">{{ item.title }}</p>
        <!-- 添加时间 + 备注分两行，单行不换行（超长 truncate，title 显示完整） -->
        <p class="text-[10px] text-gray-400 truncate mt-0.5">{{ tWithParams('later.item.addedAt', { time: formatTime(item.laterAddedAt) }) }}</p>
        <p v-if="item.laterNote" class="text-xs text-amber-600 truncate mt-0.5" :title="tWithParams('later.item.note', { note: item.laterNote })">{{ tWithParams('later.item.note', { note: item.laterNote }) }}</p>
        <p class="text-[10px] text-gray-400 truncate">{{ item.url }}</p>
      </div>
      <div class="flex flex-col items-end gap-1 shrink-0">
        <span class="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100">{{ t('later.item.openHint') }}</span>
      </div>
      <button class="p-1 rounded hover:bg-red-50 hover:text-red-600 text-gray-400 shrink-0" :title="t('common.remove')" @click.stop="askRemove(item)">
        <X :size="13" />
      </button>
    </div>
  </div>

  <!-- 移除确认弹框 -->
  <Teleport to="body">
    <div v-if="removing" class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center" @click.self="removing = null">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-72 p-5">
        <h3 class="text-sm font-bold mb-2 text-gray-900 dark:text-gray-100">{{ t('later.confirm.title') }}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 break-all">「{{ removing.title }}」</p>
        <p class="text-xs text-red-500 mb-4">{{ t('later.confirm.warning') }}</p>
        <div class="flex gap-2 justify-end">
          <button class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200" @click="removing = null">{{ t('common.cancel') }}</button>
          <button class="px-4 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600" @click="confirmRemove">{{ t('later.confirm.confirm') }}</button>
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
import { t, tWithParams } from "~lib/i18n"

defineProps<{ items: LaterItem[] }>()
const emit = defineEmits(["remove", "open"])
const showHelp = ref(false)
// laterAddedAt 存 ISO 字符串（如 2026-07-19T03:45:12.123Z），格式化成 年-月-日 时:分:秒
function formatTime(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
// 移除确认：点叉号先弹确认，避免误删稍后处理记录
const removing = ref<LaterItem | null>(null)
const askRemove = (item: LaterItem) => { removing.value = item }
const confirmRemove = () => {
  if (removing.value) emit("remove", removing.value.id)
  removing.value = null
}
</script>
