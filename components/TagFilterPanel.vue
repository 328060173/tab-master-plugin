<template>
  <Teleport to="body">
    <div
      v-if="popover.isOpen('tag-filter')"
      :style="panelStyle"
      class="fixed z-[60] w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl"
      @click.stop>
      <!-- 头部：标题 + 添加按钮 -->
      <div class="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
        <span class="text-xs font-medium text-gray-700 dark:text-gray-200">标记</span>
        <button class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium flex items-center gap-0.5" @click="showAdd = !showAdd">
          <Plus :size="12" />添加
        </button>
      </div>

      <!-- 添加输入框 -->
      <div v-if="showAdd" class="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20">
        <input
          ref="addInputRef" v-model="newTag" maxlength="15" placeholder="标记名称（最多15字）"
          class="flex-1 text-xs border border-blue-200 dark:border-blue-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          @keyup.enter="doAdd" @keyup.escape="showAdd = false; newTag = ''"
        />
        <button class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 shrink-0" @click="doAdd">确认</button>
        <button class="text-xs text-gray-400 hover:text-gray-600" @click="showAdd = false; newTag = ''"><X :size="13" /></button>
      </div>

      <!-- 标记网格 -->
      <div class="p-2.5 max-h-52 overflow-y-auto">
        <div v-if="tags.length" class="grid grid-cols-3 gap-1.5">
          <div v-for="tag in tags" :key="tag" class="relative group/tag">
            <div v-if="editingTag === tag" class="col-span-1">
              <input
                v-model="editDraft" maxlength="15"
                class="w-full text-[11px] border border-blue-400 rounded px-1.5 py-1 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                @keyup.enter="doRename(tag)" @keyup.escape="editingTag = ''"
                @blur="doRename(tag)"
              />
            </div>
            <div v-else class="relative">
              <button
                :class="['w-full px-1.5 py-1 text-[11px] rounded border text-center truncate transition-colors',
                  selected.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-400']"
                :title="tag"
                @click="toggle(tag)"
              >{{ tag }}<span class="text-[9px] opacity-60 ml-0.5">{{ tabCountByTag[tag] ?? 0 }}</span></button>
              <button
                class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-400 hover:text-blue-600 opacity-0 group-hover/tag:opacity-100 flex items-center justify-center transition-opacity"
                @click.stop="startEdit(tag)"
              ><Pencil :size="8" /></button>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-gray-400 text-center py-4">暂无标记，点击「添加」创建</p>
      </div>

      <!-- 底部 -->
      <div class="border-t border-gray-100 dark:border-gray-700 px-3 py-2 flex gap-2">
        <button v-if="selected.length" class="flex-1 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" @click="emit('apply', selected)">
          筛选({{ selected.length }})
        </button>
        <button v-if="activeTags.length && !selected.length" class="flex-1 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" @click="emit('apply', []); selected = []">清除筛选</button>
        <button class="flex-1 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300" @click="popover.close('tag-filter')">关闭</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 标记筛选浮层。
 *
 * 重要变更（2026-06-29 浮层统一改造）：
 * - 接入 PopoverManager（id='tag-filter'）
 * - fixed + Teleport，由 sidepanel 通过 popover.toggle('tag-filter', triggerEl) 打开
 * - z-index 统一到 z-[60]
 * - 视觉风格统一（rounded-md shadow-xl）
 */
import { ref, computed, nextTick } from "vue"
import { Plus, X, Pencil } from "@lucide/vue"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"

const props = defineProps<{
  tags: string[]
  activeTags: string[]
  tabCountByTag: Record<string, number>
}>()
const emit = defineEmits(["apply", "addTag", "renameTag"])

const popover = usePopoverManager()

const showAdd = ref(false)
const newTag = ref("")
const addInputRef = ref<HTMLInputElement | null>(null)
const editingTag = ref("")
const editDraft = ref("")
const selected = ref<string[]>([...props.activeTags])

const panelStyle = computed(() => {
  if (!popover.isOpen("tag-filter") || !popover.activeAnchorRect.value) return { left: "0px", top: "0px" }
  const p = computePopoverPos(popover.activeAnchorRect.value, { width: 256 }, "bottom-right")
  return { left: `${p.left}px`, top: `${p.top}px` }
})

const toggle = (tag: string) => {
  selected.value = selected.value.includes(tag) ? selected.value.filter(t => t !== tag) : [...selected.value, tag]
  emit("apply", selected.value)
}
const doAdd = () => {
  const t = newTag.value.trim()
  if (t) { emit("addTag", t); newTag.value = "" }
  showAdd.value = false
}
const startEdit = (tag: string) => {
  editingTag.value = tag
  editDraft.value = tag
  nextTick(() => (document.querySelector("input[data-edit]") as HTMLInputElement)?.focus())
}
const doRename = (oldTag: string) => {
  const t = editDraft.value.trim()
  if (t && t !== oldTag) emit("renameTag", oldTag, t)
  editingTag.value = ""
}
</script>
