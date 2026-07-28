<template>
  <div class="flex flex-col gap-3 py-1">
    <!-- 返回 -->
    <button
      type="button"
      class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 self-start px-1 py-0.5"
      @click="emit('back')"
    >
      <ArrowLeft :size="14" />
      返回
    </button>

    <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-200 px-1">时间戳转换</h2>
    <p class="text-[11px] text-gray-400 px-1 -mt-1">北京时间（本地时区），不联网。</p>

    <!-- 时间戳 → 时间 -->
    <section class="flex flex-col gap-2 px-3 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-gray-700 dark:text-gray-200">时间戳 → 时间</span>
        <span class="text-[10px] text-gray-400">单位：秒</span>
      </div>
      <div class="flex items-center gap-1.5">
        <input
          v-model="tsInput"
          type="text"
          inputmode="numeric"
          placeholder="如 1700000000（秒）"
          class="flex-1 min-w-0 px-2 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
          @keyup.enter="convertTs"
        />
        <button
          type="button"
          class="shrink-0 px-2 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="fillNow"
        >现在</button>
        <button
          type="button"
          class="shrink-0 px-2.5 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
          @click="convertTs"
        >转换</button>
      </div>
      <div v-if="tsResult" class="flex items-center justify-between gap-2 mt-0.5">
        <span class="text-base font-semibold text-gray-800 dark:text-gray-100">
          {{ tsResult }}
          <span class="text-[11px] font-normal text-gray-400 ml-1">（秒）</span>
        </span>
        <button
          type="button"
          class="shrink-0 flex items-center gap-1 px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="copy(tsResult)"
        >
          <Copy :size="12" />
          复制
        </button>
      </div>
    </section>

    <!-- 时间 → 时间戳 -->
    <section class="flex flex-col gap-2 px-3 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-gray-700 dark:text-gray-200">时间 → 时间戳</span>
        <span class="text-[10px] text-gray-400">本地时区</span>
      </div>
      <div class="flex items-center gap-1.5">
        <input
          v-model="dtInput"
          type="datetime-local"
          class="flex-1 min-w-0 px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"
          @change="convertDt"
        />
        <button
          type="button"
          class="shrink-0 px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          @click="convertDt"
        >转换</button>
      </div>
      <div v-if="dtResult !== null" class="flex items-center justify-between gap-2 mt-0.5">
        <span class="text-base font-semibold text-gray-800 dark:text-gray-100">
          {{ dtResult }}
          <span class="text-[11px] font-normal text-gray-400 ml-1">（秒）</span>
        </span>
        <button
          type="button"
          class="shrink-0 flex items-center gap-1 px-2 py-1 text-[11px] rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="copy(String(dtResult))"
        >
          <Copy :size="12" />
          复制
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * 时间戳转换 —— UNIX 时间戳 ↔ 北京时间互转。
 *
 * - 纯本地计算，无 storage / 无网络。
 * - 单位定死为秒（10 位 UNIX 时间戳），无单位选择。
 * - 时间戳→时间：输入变化自动转换（watch tsInput）。
 * - 时间→时间戳：datetime-local 在前，输出秒级时间戳 + 复制按钮。
 * - 异常输入 toast 提示，不抛错。
 */
import { ref, watch } from 'vue'
import { ArrowLeft, Copy } from '@lucide/vue'
import { showToast } from '~composables/useToast'

const emit = defineEmits<{ (e: 'back'): void }>()

const tsInput = ref('')
const tsResult = ref('')
const dtInput = ref('')
const dtResult = ref<number | null>(null)

const pad = (n: number) => String(n).padStart(2, '0')

/** Date → YYYY-MM-DD HH:mm:ss（本地时区） */
const formatDate = (d: Date): string => {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 时间戳 → 时间：按秒转换（秒级时间戳 × 1000 得 Date 入参） */
const convertTs = () => {
  const raw = tsInput.value.trim()
  if (!/^\d+$/.test(raw)) {
    tsResult.value = ''
    return
  }
  const num = Number(raw)
  const ms = num * 1000
  const d = new Date(ms)
  if (Number.isNaN(d.getTime())) {
    showToast('请输入有效的时间戳')
    tsResult.value = ''
    return
  }
  tsResult.value = formatDate(d)
}

/** 输入变化自动转换（含清空时结果清空） */
watch(tsInput, () => convertTs())

const fillNow = () => {
  tsInput.value = String(Math.floor(Date.now() / 1000))
}

/** 时间 → 时间戳（秒级 UNIX 时间戳） */
const convertDt = () => {
  const raw = dtInput.value.trim()
  if (!raw) {
    showToast('请选择时间')
    dtResult.value = null
    return
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw)) {
    showToast('时间格式不正确，请重新选择')
    dtResult.value = null
    return
  }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) {
    showToast('时间格式不正确，请重新选择')
    dtResult.value = null
    return
  }
  const ms = d.getTime()
  dtResult.value = Math.floor(ms / 1000)
}

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('已复制')
  } catch {
    showToast('复制失败')
  }
}
</script>
