<template>
  <!--
    Tab2 恢复与冲突 - PRD §4.1 / §4.2 / §F
    单根。主内容：未解决冲突列表 + 推荐选择 + 全部接受推荐按钮。
    次要：fingerprint 未匹配手动指派（折叠展开）。
  -->
  <div>
    <!-- 选快照 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">选择要恢复的快照：</p>
      <select
        v-model="selectedId"
        class="w-full text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800"
        @change="onSelectSnapshot"
      >
        <option value="">— 请选择 —</option>
        <option v-for="s in snapshots" :key="s.id" :value="s.id">
          {{ fmtFull(s.createdAt) }} · {{ s.stats.tabCount }} 标签 · 来源 {{ sourceLabel(s.source) }}
        </option>
      </select>
      <p v-if="!snapshots.length" class="text-[11px] text-gray-400 mt-2">尚无快照可恢复。请先到「快照列表」创建一个。</p>
    </div>

    <!-- 预览中 -->
    <div v-if="isPreviewing" class="text-xs text-blue-600 dark:text-blue-400 py-4 text-center">
      正在生成预览…
    </div>

    <!-- 预览结果 -->
    <div v-else-if="preview" class="space-y-4">
      <!-- 预览摘要 -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          即将恢复 {{ preview.tabCount }} 个标签 · {{ preview.windowCount }} 个窗口
        </p>
        <p class="text-[11px] text-gray-500 dark:text-gray-400">
          标记 {{ preview.taggedCount }} 个 · 待决策冲突 {{ pendingConflictCount }} 项 · 未匹配 {{ unmatched.length }} 项
        </p>
        <p v-if="preview.incognitoWindowCount" class="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
          ⓘ 快照含 {{ preview.incognitoWindowCount }} 个隐身窗口，默认不恢复（安全）
        </p>
      </div>

      <!-- 冲突解决（git-merge 风格） -->
      <div v-if="conflicts.length" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-3">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
            待你决策 {{ pendingConflictCount }} 项
          </p>
          <button
            class="text-[11px] px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            @click="onAcceptAll"
          >全部接受推荐 ★</button>
        </div>
        <div class="space-y-2">
          <div
            v-for="c in conflicts"
            :key="c.id"
            class="border border-gray-100 dark:border-gray-700 rounded p-2.5 text-xs"
          >
            <p class="font-medium text-gray-800 dark:text-gray-100 mb-1">{{ c.label }}</p>
            <p class="text-gray-500 dark:text-gray-400 mb-1.5">
              <span class="text-blue-600 dark:text-blue-400">快照：{{ c.snapshotSide }}</span>
              <span class="mx-1">vs</span>
              <span class="text-gray-600 dark:text-gray-300">当前：{{ c.currentSide }}</span>
            </p>
            <div class="flex gap-3 text-[11px]">
              <label class="flex items-center gap-1 cursor-pointer" :class="c.choice === 'snapshot' ? 'text-blue-600 font-medium' : ''">
                <input type="radio" :name="'cf-' + c.id" value="snapshot" v-model="c.choice" />
                用快照版本 <span v-if="c.recommended === 'snapshot'">★推荐</span>
              </label>
              <label class="flex items-center gap-1 cursor-pointer" :class="c.choice === 'current' ? 'text-blue-600 font-medium' : ''">
                <input type="radio" :name="'cf-' + c.id" value="current" v-model="c.choice" />
                用当前版本 <span v-if="c.recommended === 'current'">★推荐</span>
              </label>
              <label class="flex items-center gap-1 cursor-pointer" :class="c.choice === 'both' ? 'text-blue-600 font-medium' : ''">
                <input type="radio" :name="'cf-' + c.id" value="both" v-model="c.choice" />
                两个都保留
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 未匹配手动指派 -->
      <details v-if="unmatched.length" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <summary class="text-sm font-medium text-red-600 dark:text-red-400 cursor-pointer">
          未匹配 {{ unmatched.length }} 项（需手动指派）
        </summary>
        <div class="space-y-2 mt-3">
          <div
            v-for="u in unmatched"
            :key="u.id"
            class="border border-red-100 dark:border-red-900/50 rounded p-2.5 text-xs"
          >
            <p class="text-red-600 dark:text-red-400 mb-1.5">未匹配 · {{ u.label }}</p>
            <div v-if="u.candidates.length" class="space-y-1">
              <label
                v-for="c in u.candidates"
                :key="c.tabId"
                class="flex items-center gap-1.5 cursor-pointer"
              >
                <input type="radio" :name="'um-' + u.id" :value="c.tabId" v-model="u.assignTo" />
                <span class="text-gray-700 dark:text-gray-200 truncate">{{ c.title || c.url }}</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" :name="'um-' + u.id" :value="null" v-model="u.assignTo" />
                <span class="text-gray-400">跳过此条，保留为未绑定</span>
              </label>
            </div>
            <p v-else class="text-gray-400">无候选 tab，只能跳过</p>
          </div>
        </div>
      </details>

      <!-- 恢复按钮（弹三选一确认） -->
      <div class="flex justify-end gap-2">
        <button
          :disabled="isRestoring"
          class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          @click="onRestoreClick"
        >
          {{ isRestoring ? '恢复中…' : '确认恢复' }}
        </button>
      </div>
    </div>

    <!-- 空态 -->
    <div v-else class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-10 text-center">
      <p class="text-xs text-gray-400">选择一个快照后，将显示恢复预览与冲突解决界面。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Tab2 恢复与冲突 - 选快照 → 预览 → 冲突解决 → 弹恢复方式三选一
 */
import { ref, computed } from "vue"
import { useBackupRestore } from "~composables/useBackupRestore"
import type { SnapshotSource, SnapshotSummary } from "~types/backup"

const props = defineProps<{ snapshots: SnapshotSummary[] }>()
const emit = defineEmits<{
  (e: "restore", snapshotId: string): void
}>()

const { preview, isPreviewing, isRestoring, conflicts, unmatched, generatePreview, acceptAllRecommended, setUnmatchedAssign } = useBackupRestore()

const selectedId = ref("")

async function onSelectSnapshot() {
  if (!selectedId.value) return
  await generatePreview(selectedId.value)
}

const pendingConflictCount = computed(() => conflicts.value.length)

function onAcceptAll() {
  acceptAllRecommended()
}

function onRestoreClick() {
  if (!selectedId.value) return
  // 触发父级弹恢复方式三选一 dialog
  emit("restore", selectedId.value)
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

function sourceLabel(s: SnapshotSource): string {
  switch (s) {
    case "manual": return "手动"
    case "auto.timer": return "定时"
    case "auto.event": return "事件"
    case "preRestore": return "恢复前"
    case "import": return "导入"
    default: return s
  }
}
</script>
