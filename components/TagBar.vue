<template>
  <div class="border-b border-gray-100 px-3 py-2 shrink-0">
    <!-- 空状态引导 -->
    <div v-if="tags.length === 0" class="flex items-center justify-center gap-3">
      <button
        :class="['flex items-center gap-1 text-xs transition-colors',
          canAddMore ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300 cursor-not-allowed']"
        :disabled="!canAddMore"
        @click="showAdd = true"
        :title="canAddMore ? '添加标记' : '已达15个标记上限'"
      >
        <Plus :size="12" />
        添加标记来分类标签
      </button>
      <button
        :class="['p-0.5 rounded transition-colors',
          showHelp ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600']"
        @click="showHelp = !showHelp"
        title="这是什么？"
      >
        <HelpCircle :size="14" />
      </button>
    </div>

    <!-- 有标记状态 -->
    <div v-else class="flex items-center gap-2">
      <!-- 全部按钮 -->
      <button
        :class="['shrink-0 px-2 py-0.5 text-xs rounded-full border transition-colors',
          activeTags.length === 0 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50']"
        @click="emit('apply', [])"
      >
        全部
      </button>

      <!-- 标记列表 - 横向滚动 -->
      <div class="flex-1 min-w-0 overflow-x-auto flex items-center gap-1.5 scrollbar-thin" ref="tagsContainer">
        <div
          v-for="(tag, index) in tags" :key="tag"
          :class="['shrink-0 flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full border transition-colors select-none',
            activeTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50',
            dragState.sourceIndex === index ? 'opacity-50' : '',
            dragState.overIndex === index ? 'ring-2 ring-blue-400' : '']"
          @contextmenu.prevent="openContextMenu($event, tag, index)"
          @dragover.prevent="onDragOver($event, index)"
          @dragleave="onDragLeave"
          @drop="onDrop($event, index)"
        >
          <!-- 拖动手柄：仅手柄发起拖动，与点击筛选区域分离 -->
          <div
            class="shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            draggable="true"
            @dragstart="onDragStart($event, index)"
            @dragend="onDragEnd"
            title="拖动排序"
          >
            <GripVertical :size="11" />
          </div>
          <!-- 标记名称 - 点击筛选 -->
          <span
            class="truncate cursor-pointer max-w-[100px]"
            :title="tag"
            @click="toggleTag(tag)"
          >{{ tag }}</span>
          <!-- 计数 -->
          <span
            class="opacity-60 cursor-pointer"
            @click="toggleTag(tag)"
          >{{ tabCountByTag[tag] ?? 0 }}</span>
          <!-- 取消筛选按钮 -->
          <X
            v-if="activeTags.includes(tag)"
            :size="11"
            class="cursor-pointer hover:opacity-80"
            @click="toggleTag(tag)"
            title="取消该标记筛选"
          />
        </div>
      </div>

      <!-- 添加按钮 -->
      <button
        :class="['shrink-0 w-6 h-6 flex items-center justify-center rounded-full border transition-colors',
          canAddMore
            ? 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-blue-400'
            : 'border-gray-200 text-gray-300 cursor-not-allowed']"
        :disabled="!canAddMore"
        @click="showAdd = true"
        :title="canAddMore ? '添加标记' : '已达15个标记上限'"
      >
        <Plus :size="12" />
      </button>

      <!-- 帮助按钮 -->
      <button
        :class="['shrink-0 w-6 h-6 flex items-center justify-center rounded-full border transition-colors',
          showHelp
            ? 'border-blue-300 bg-blue-50 text-blue-600'
            : 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600']"
        @click="showHelp = !showHelp"
        title="这是什么？"
      >
        <HelpCircle :size="12" />
      </button>
    </div>

    <!-- 帮助说明 -->
    <div v-if="showHelp" class="mt-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-[11px] leading-relaxed text-blue-800">
      <p class="mb-1"><b>标记是什么？</b>给标签分类的自定义标签，方便快速筛选。</p>
      <p class="mb-1"><b>怎么用：</b></p>
      <ul class="list-disc list-inside mb-1 ml-1">
        <li>点「+」添加标记（最多15个，每个最多15字）</li>
        <li>点标记筛选标签（选多个 = 交集筛选）</li>
        <li>拖标记左侧的「⠿」调整顺序</li>
        <li>右键标记可以编辑/删除</li>
        <li>点「全部」清除所有筛选</li>
      </ul>
      <p>🔒 标记仅保存在本地浏览器，不上传。</p>
    </div>

    <!-- 添加标记输入框 -->
    <div v-if="showAdd" class="flex items-center gap-2 mt-2">
      <div class="flex-1 relative">
        <input
          ref="addInputRef"
          v-model="newTag"
          maxlength="15"
          placeholder="标记名称（最多15字）"
          :class="['w-full text-xs rounded px-2 py-1 bg-white focus:outline-none focus:ring-1',
            isDuplicate ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400']"
          @keyup.enter="doAdd"
          @keyup.escape="cancelAdd"
        />
        <span
          :class="['absolute right-2 top-1/2 -translate-y-1/2 text-[10px]',
            isDuplicate ? 'text-red-400' : 'text-gray-400']"
        >{{ newTag.length }}/15</span>
      </div>
      <button
        class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
        @click="doAdd"
        :disabled="!canSubmitAdd"
      >
        确认
      </button>
      <button
        class="text-xs text-gray-400 hover:text-gray-600 shrink-0"
        @click="cancelAdd"
      >
        <X :size="13" />
      </button>
    </div>
    <div v-if="showAdd && isDuplicate" class="mt-1 text-[10px] text-red-500">该标记已存在</div>

    <!-- 右键菜单 -->
    <Teleport to="body">
      <div
        v-if="contextMenu.open"
        :style="contextMenuStyle"
        class="fixed z-[100] w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1"
        @click.stop
      >
        <button
          class="w-full px-3 py-1.5 text-xs text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5"
          @click="openEditDialog"
        >
          <Pencil :size="11" />编辑...
        </button>
        <button
          class="w-full px-3 py-1.5 text-xs text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-1.5"
          @click="openDeleteConfirm"
        >
          <Trash2 :size="11" />删除...
        </button>
      </div>
    </Teleport>

    <!-- 编辑对话框 -->
    <Teleport to="body">
      <div
        v-if="editDialog.open"
        class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center"
        @click.self="closeEditDialog"
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[320px] p-5">
          <h3 class="text-sm font-bold mb-3 text-gray-900 dark:text-gray-100">编辑标记</h3>
          <div class="relative">
            <input
              v-model="editDraft"
              maxlength="15"
              placeholder="标记名称（最多15字）"
              :class="['w-full text-xs rounded px-2 py-1.5 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1',
                isEditDuplicate ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-400']"
              @keyup.enter="doRename"
              @keyup.escape="closeEditDialog"
            />
            <span
              :class="['absolute right-2 top-1/2 -translate-y-1/2 text-[10px]',
                isEditDuplicate ? 'text-red-400' : 'text-gray-400']"
            >{{ editDraft.length }}/15</span>
          </div>
          <div v-if="isEditDuplicate" class="mt-1 text-[10px] text-red-500">该标记已存在</div>
          <div class="flex gap-2 mt-4 justify-end">
            <button
              class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              @click="closeEditDialog"
            >取消</button>
            <button
              class="px-4 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              @click="doRename"
              :disabled="!canSubmitEdit"
            >确认</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      :open="deleteConfirm.open"
      :title="`删除标记「${deleteConfirm.tag}」？`"
      :message="`该标记将从 ${deleteConfirm.count} 个标签上移除。`"
      hint="删除操作不可撤销，但标签不会被删除。"
      confirm-text="确认删除"
      danger
      @confirm="doDelete"
      @cancel="deleteConfirm.open = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue"
import { Plus, X, HelpCircle, GripVertical, Pencil, Trash2 } from "@lucide/vue"
import ConfirmDialog from "./ConfirmDialog.vue"

const props = defineProps<{
  tags: string[]
  activeTags: string[]
  tabCountByTag: Record<string, number>
}>()
const emit = defineEmits<{
  apply: [tags: string[]]
  addTag: [tag: string]
  removeTag: [tag: string]
  renameTag: [oldTag: string, newTag: string]
  reorderTag: [fromIndex: number, toIndex: number]
}>()

const tagsContainer = ref<HTMLDivElement | null>(null)

// 状态
const showAdd = ref(false)
const newTag = ref("")
const addInputRef = ref<HTMLInputElement | null>(null)
const showHelp = ref(false)

// 拖拽状态
const dragState = ref<{ sourceIndex: number | null; overIndex: number | null }>({
  sourceIndex: null,
  overIndex: null
})

// 右键菜单
const contextMenu = ref<{ open: boolean; tag: string; index: number; x: number; y: number }>({
  open: false,
  tag: "",
  index: -1,
  x: 0,
  y: 0
})

const contextMenuStyle = computed(() => {
  return {
    left: `${contextMenu.value.x}px`,
    top: `${contextMenu.value.y}px`
  }
})

// 编辑对话框
const editDialog = ref<{ open: boolean; tag: string }>({
  open: false,
  tag: ""
})
const editDraft = ref("")

// 删除确认
const deleteConfirm = ref<{ open: boolean; tag: string; count: number }>({
  open: false,
  tag: "",
  count: 0
})

// 计算属性
const canAddMore = computed(() => props.tags.length < 15)
const isDuplicate = computed(() => props.tags.includes(newTag.value.trim()))
const canSubmitAdd = computed(() => {
  const trimmed = newTag.value.trim()
  return trimmed.length > 0 && trimmed.length <= 15 && !isDuplicate.value && canAddMore.value
})

const isEditDuplicate = computed(() => {
  const trimmed = editDraft.value.trim()
  return trimmed !== editDialog.value.tag && props.tags.includes(trimmed)
})
const canSubmitEdit = computed(() => {
  const trimmed = editDraft.value.trim()
  return trimmed.length > 0 && trimmed.length <= 15 && !isEditDuplicate.value && trimmed !== editDialog.value.tag
})

// 方法
const toggleTag = (tag: string) => {
  const newActive = props.activeTags.includes(tag)
    ? props.activeTags.filter(t => t !== tag)
    : [...props.activeTags, tag]
  emit("apply", newActive)
}

const doAdd = async () => {
  if (!canSubmitAdd.value) return
  emit("addTag", newTag.value.trim())
  newTag.value = ""
  showAdd.value = false
}

const cancelAdd = () => {
  showAdd.value = false
  newTag.value = ""
}

const openContextMenu = (e: MouseEvent, tag: string, index: number) => {
  contextMenu.value = {
    open: true,
    tag,
    index,
    x: e.clientX,
    y: e.clientY
  }
}

const closeContextMenu = () => {
  contextMenu.value.open = false
}

const openEditDialog = () => {
  editDraft.value = contextMenu.value.tag
  editDialog.value = {
    open: true,
    tag: contextMenu.value.tag
  }
  closeContextMenu()
}

const closeEditDialog = () => {
  editDialog.value.open = false
  editDraft.value = ""
}

const doRename = () => {
  if (!canSubmitEdit.value) return
  emit("renameTag", editDialog.value.tag, editDraft.value.trim())
  closeEditDialog()
}

const openDeleteConfirm = () => {
  const tag = contextMenu.value.tag
  const count = props.tabCountByTag[tag] ?? 0
  deleteConfirm.value = {
    open: true,
    tag,
    count
  }
  closeContextMenu()
}

const doDelete = () => {
  emit("removeTag", deleteConfirm.value.tag)
  deleteConfirm.value.open = false
}

// 拖拽方法
const onDragStart = (e: DragEvent, index: number) => {
  dragState.value.sourceIndex = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(index))
  }
}

const onDragOver = (e: DragEvent, index: number) => {
  if (dragState.value.sourceIndex === null || dragState.value.sourceIndex === index) return
  dragState.value.overIndex = index
}

const onDragLeave = () => {
  dragState.value.overIndex = null
}

const onDrop = (e: DragEvent, index: number) => {
  const sourceIndex = dragState.value.sourceIndex
  if (sourceIndex !== null && sourceIndex !== index) {
    emit("reorderTag", sourceIndex, index)
  }
  onDragEnd()
}

const onDragEnd = () => {
  dragState.value.sourceIndex = null
  dragState.value.overIndex = null
}

// 自动聚焦
watch(showAdd, async (val) => {
  if (val) {
    await nextTick()
    addInputRef.value?.focus()
  }
})

// 点击其他地方关闭右键菜单
const onDocumentClick = () => {
  closeContextMenu()
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick)
})
</script>
