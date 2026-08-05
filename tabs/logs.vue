<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <!-- 顶部条 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <ScrollText :size="18" class="text-blue-600 dark:text-blue-400" />
        <h1 class="text-base font-semibold">{{ t('logs.title') }}</h1>
        <span class="text-xs text-gray-400 ml-auto">{{ logs.length }} {{ t('logs.countSuffix') }}</span>
      </div>
    </header>

    <main class="max-w-3xl mx-auto p-6">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {{ t('logs.introPrefix') }}<b>{{ t('logs.introLocal') }}</b>{{ t('logs.introMid') }}<br/>{{ t('logs.introCopyHint') }}
        </p>
        <div class="flex items-center gap-2 shrink-0">
          <select v-model="logFilter" class="text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800">
            <option value="all">{{ t('logs.filterAll') }}</option>
            <option value="error">{{ t('logs.filterError') }}</option>
            <option value="warn">{{ t('logs.filterWarn') }}</option>
          </select>
          <button class="text-xs px-2.5 py-1 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40" :disabled="!logs.length" @click="onCopyLogs">{{ copied ? t('logs.copiedBtn') : t('logs.copyBtn') }}</button>
          <button class="text-xs px-2.5 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30 disabled:opacity-40" :disabled="!logs.length" @click="onClearLogs">{{ confirmClear ? t('logs.confirmClear') : t('logs.clearBtn') }}</button>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div v-if="!filteredLogs.length" class="px-5 py-12 text-center text-xs text-gray-400">{{ t('logs.empty') }}</div>
        <div v-else class="divide-y divide-gray-50 dark:divide-gray-700/50">
          <div v-for="(l, i) in filteredLogs" :key="i" class="px-5 py-2 flex items-start gap-2 text-xs">
            <span :class="['shrink-0 mt-1 w-1.5 h-1.5 rounded-full', l.level === 'error' ? 'bg-red-500' : l.level === 'warn' ? 'bg-amber-500' : 'bg-gray-300']"></span>
            <span class="shrink-0 text-gray-400 tabular-nums">{{ fmtTime(l.t) }}</span>
            <span class="shrink-0 text-gray-400">[{{ l.scope }}]</span>
            <span class="flex-1 min-w-0 break-words" :class="l.level === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'">
              {{ l.msg }}<span v-if="l.detail" class="block text-gray-400 break-all">{{ l.detail }}</span>
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 运行日志独立页（Plasmo tabs 页，URL: tabs/logs.html）。
 * 单独成页，不和"设置"混在一起 —— 日志归日志，设置归设置。
 * 入口：sidepanel HeaderMenu「运行日志」→ chrome.tabs.create(runtime.getURL("tabs/logs.html"))
 *
 * i18n 化（2026-08-05 i18n-en-support §6.1）：硬编码文案 → t()。
 * intro 文案含 <b>/<br/> 语义标签保留在模板中，文本分段走字典，避免 v-html（XSS 红线）。
 */
import { computed, ref } from "vue"
import { ScrollText } from "@lucide/vue"
import { useLogger } from "~composables/useLogger"
import { t, initLocale } from "~lib/i18n"

initLocale().catch((e) => console.warn('[logs] initLocale 失败', e))

const { logs, clearLogs } = useLogger()

const logFilter = ref<"all" | "warn" | "error">("all")
const confirmClear = ref(false)
const copied = ref(false)

const filteredLogs = computed(() => {
  if (logFilter.value === "all") return logs.value
  if (logFilter.value === "error") return logs.value.filter(l => l.level === "error")
  return logs.value.filter(l => l.level === "error" || l.level === "warn")
})
const fmtTime = (t_: number) => {
  try {
    const d = new Date(t_)
    const p = (n: number) => String(n).padStart(2, "0")
    return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
  } catch { return "" }
}
const onClearLogs = async () => {
  if (!confirmClear.value) { confirmClear.value = true; setTimeout(() => (confirmClear.value = false), 3000); return }
  confirmClear.value = false
  await clearLogs()
}
const onCopyLogs = async () => {
  try {
    const text = logs.value.map(l => `${fmtTime(l.t)} [${l.level}] [${l.scope}] ${l.msg}${l.detail ? " | " + l.detail : ""}`).join("\n")
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch { /* 剪贴板不可用时静默 */ }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
:root.fs-normal  { font-size: 16px; }
:root.fs-large   { font-size: 17.5px; }
:root.fs-xlarge  { font-size: 19px; }
</style>
