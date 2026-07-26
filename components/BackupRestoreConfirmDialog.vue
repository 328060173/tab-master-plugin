<template>
  <!--
    恢复方式三选一弹窗 - PRD §4.2 ASCII / §4.7.B
    单根 + Teleport 收进主根内。默认选中"整体替换 ★推荐"。
  -->
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" @click.self="onCancel">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-5">
        <h2 class="text-base font-semibold mb-2">恢复到 {{ fmtFull(createdAt) }}</h2>
        <p class="text-xs text-gray-600 dark:text-gray-300 mb-3">
          即将恢复 {{ tabCount }} 个标签、{{ windowCount }} 个窗口、{{ taggedCount }} 个标记。请选择恢复方式：
        </p>
        <div class="space-y-2">
          <label
            class="flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer"
            :class="mode === 'replace' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'"
          >
            <input type="radio" value="replace" v-model="mode" class="mt-0.5" />
            <div class="flex-1 min-w-0 text-xs">
              <p class="font-medium text-gray-800 dark:text-gray-100">
                整体替换 <span class="text-blue-600">★推荐</span>
              </p>
              <p class="text-gray-500 dark:text-gray-300 mt-0.5">
                先保存当前为"恢复前快照"→关闭当前所有标签→按快照重建。可撤销恢复。
              </p>
            </div>
          </label>
          <label
            class="flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer"
            :class="mode === 'selected' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'"
          >
            <input type="radio" value="selected" v-model="mode" class="mt-0.5" />
            <div class="flex-1 min-w-0 text-xs">
              <p class="font-medium text-gray-800 dark:text-gray-100">仅替换我选中的项（最保守）</p>
              <p class="text-gray-500 dark:text-gray-300 mt-0.5">不动其他标签，只替换你在冲突界面选中的项。</p>
            </div>
          </label>
          <label
            class="flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer"
            :class="mode === 'append' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'"
          >
            <input type="radio" value="append" v-model="mode" class="mt-0.5" />
            <div class="flex-1 min-w-0 text-xs">
              <p class="font-medium text-gray-800 dark:text-gray-100">仅追加（不关任何当前标签）</p>
              <p class="text-gray-500 dark:text-gray-300 mt-0.5">只补开快照里有但当前没有的，可能产生重复。</p>
            </div>
          </label>
        </div>
        <p v-if="incognitoWindowCount" class="text-[11px] text-amber-600 dark:text-amber-400 mt-3">
          ⓘ 快照含 {{ incognitoWindowCount }} 个隐身窗口，默认不恢复（安全）
        </p>
        <div class="flex gap-2 justify-end mt-4">
          <button class="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700" @click="onCancel">取消</button>
          <button class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" @click="onConfirm">确认恢复</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 恢复方式三选一弹窗 - PRD §4.2 ASCII / §4.7.B
 * 默认选中"整体替换 ★推荐"（破坏性操作必须问，但给推荐默认）。
 */
import { ref, watch } from "vue"
import type { RestoreMode } from "~types/backup"

const props = defineProps<{
  open: boolean
  createdAt: number
  tabCount: number
  windowCount: number
  taggedCount: number
  incognitoWindowCount: number
}>()
const emit = defineEmits<{
  (e: "confirm", mode: RestoreMode): void
  (e: "cancel"): void
}>()

const mode = ref<RestoreMode>("replace")

watch(
  () => props.open,
  (v) => {
    if (v) mode.value = "replace"
  }
)

function onConfirm() {
  emit("confirm", mode.value)
}
function onCancel() {
  emit("cancel")
}

function fmtFull(ts: number) {
  try {
    const d = new Date(ts)
    const p = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
  } catch {
    return ""
  }
}
</script>
