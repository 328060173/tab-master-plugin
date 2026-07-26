<template>
  <!--
    恢复方式 4 选一弹窗（设计稿 §4.3 重设计）。
    单根 + Teleport 收进主根内（守多根 fallthrough 红线）。
    默认合并(自动) ★推荐（原默认 replace 改掉，破坏性不该是默认）。
    覆盖二次确认：选 replace + 点确认 → 切到二次确认 danger 弹窗 → 再确认才 emit。
    文案照设计稿 §4.3.3 表格（口语禁黑话）。
  -->
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
      @click.self="onCancel"
      @keydown.esc="onCancel"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restore-confirm-title"
      >
        <!-- 主选单态 -->
        <template v-if="!confirmingReplace">
          <h2 id="restore-confirm-title" class="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
            恢复到 {{ fmtFull(createdAt) }}
          </h2>
          <p class="text-xs text-gray-600 dark:text-gray-300 mb-3">
            即将恢复 {{ tabCount }} 个标签、{{ windowCount }} 个窗口、{{ taggedCount }} 个标记。请选择恢复方式：
          </p>
          <div class="space-y-2">
            <!-- 合并(自动) ★推荐 -->
            <label
              class="flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors"
              :class="mode === 'mergeAuto' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'"
            >
              <input type="radio" value="mergeAuto" v-model="mode" class="mt-0.5" />
              <div class="flex-1 min-w-0 text-xs">
                <p class="font-medium text-gray-800 dark:text-gray-100">
                  合并（自动） <span class="text-blue-600 dark:text-blue-400">★推荐</span>
                </p>
                <p class="text-gray-500 dark:text-gray-300 mt-0.5">
                  标签按网址去重保留当前的；标记/分组取并集；稍后清单合并去重。不丢数据。
                </p>
              </div>
            </label>
            <!-- 追加 -->
            <label
              class="flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors"
              :class="mode === 'append' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'"
            >
              <input type="radio" value="append" v-model="mode" class="mt-0.5" />
              <div class="flex-1 min-w-0 text-xs">
                <p class="font-medium text-gray-800 dark:text-gray-100">追加</p>
                <p class="text-gray-500 dark:text-gray-300 mt-0.5">
                  备份里的标签加到当前窗口后面；标记/分组/稍后清单只加不删（可能重复）。
                </p>
              </div>
            </label>
            <!-- 合并(手动) -->
            <label
              class="flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors"
              :class="mode === 'selected' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'"
            >
              <input type="radio" value="selected" v-model="mode" class="mt-0.5" />
              <div class="flex-1 min-w-0 text-xs">
                <p class="font-medium text-gray-800 dark:text-gray-100">合并（手动）</p>
                <p class="text-gray-500 dark:text-gray-300 mt-0.5">
                  列出备份和当前都有的同类项，你逐个选保留哪个。下一步进入冲突界面。
                </p>
              </div>
            </label>
            <!-- 覆盖 ⚠危险 -->
            <label
              class="flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors"
              :class="mode === 'replace'
                ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                : 'border-red-200 dark:border-red-800/60 hover:bg-red-50/50 dark:hover:bg-red-900/10'"
            >
              <input type="radio" value="replace" v-model="mode" class="mt-0.5" />
              <div class="flex-1 min-w-0 text-xs">
                <p class="font-medium flex items-center gap-1 text-gray-800 dark:text-gray-100">
                  覆盖
                  <span class="text-red-600 dark:text-red-400 text-[11px]">⚠ 危险</span>
                </p>
                <p class="text-gray-500 dark:text-gray-300 mt-0.5">
                  用备份替换当前所有标签/标记/分组/稍后清单。当前未保存的会丢失。
                </p>
              </div>
            </label>
          </div>
          <p v-if="incognitoWindowCount" class="text-[11px] text-amber-600 dark:text-amber-400 mt-3">
            ⓘ 快照含 {{ incognitoWindowCount }} 个隐身窗口，默认不恢复（安全）
          </p>
          <div class="flex gap-2 justify-end mt-4">
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onCancel"
            >取消</button>
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              @click="onConfirm"
            >确认恢复</button>
          </div>
        </template>

        <!-- 覆盖二次确认 danger 弹窗（设计稿 §4.3.2） -->
        <template v-else>
          <h2 class="text-base font-semibold mb-2 text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <AlertTriangle :size="16" />
            确认覆盖？
          </h2>
          <p class="text-xs text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
            覆盖会先关闭当前所有标签和窗口，再用备份重建。当前未保存的标签/标记/分组/稍后清单会丢失（恢复前会自动存一份撤销快照，30 秒内可撤销）。
          </p>
          <div class="flex gap-2 justify-end">
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click="onReconsider"
            >再想想</button>
            <button
              class="px-3 py-1.5 min-h-[36px] text-xs rounded bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              @click="onConfirmReplace"
            >我知道，覆盖</button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 恢复方式 4 选一弹窗（设计稿 §4.3 重设计）。
 * 默认合并(自动) ★推荐；覆盖有二次确认 danger 弹窗（confirmation-dialogs + destructive-emphasis 准则）。
 */
import { ref, watch } from "vue"
import { AlertTriangle } from "@lucide/vue"
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

const mode = ref<RestoreMode>("mergeAuto")
/** 覆盖二次确认子状态（设计稿 §4.3.8） */
const confirmingReplace = ref(false)

watch(
  () => props.open,
  (v) => {
    if (v) {
      mode.value = "mergeAuto"
      confirmingReplace.value = false
    }
  }
)

function onConfirm() {
  if (mode.value === "replace") {
    // 覆盖：切到二次确认 danger UI
    confirmingReplace.value = true
    return
  }
  emit("confirm", mode.value)
}
function onConfirmReplace() {
  confirmingReplace.value = false
  emit("confirm", "replace")
}
function onReconsider() {
  // 回到主选单，让用户重新考虑（不直接取消）
  confirmingReplace.value = false
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
