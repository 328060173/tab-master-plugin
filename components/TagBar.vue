<template>
  <div class="border-b border-gray-100 dark:border-gray-700 px-3 py-2 shrink-0">
    <!-- 空状态引导 -->
    <div
      v-if="tags.length === 0"
      class="flex items-center justify-center gap-3">
      <button
        :class="[
          'flex items-center gap-1 text-xs transition-colors',
          canAddMore
            ? 'text-gray-400 hover:text-gray-600'
            : 'text-gray-300 cursor-not-allowed'
        ]"
        :disabled="!canAddMore"
        @click="showAdd = true"
        :title="canAddMore ? '添加标记' : '已达15个标记上限'">
        <Plus :size="12" />
        添加标记来分类标签
      </button>
      <button
        :class="[
          'p-0.5 rounded transition-colors',
          showHelp
            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
            : 'text-gray-400 hover:text-gray-600'
        ]"
        @click="showHelp = !showHelp"
        title="这是什么？">
        <HelpCircle :size="14" />
      </button>
    </div>

    <!-- 有标记状态：收起态 -->
    <div v-else class="flex items-start gap-2">
      <!-- 行首 label + 筛选模式切换 -->
      <span class="shrink-0 text-[11px] text-gray-400 dark:text-gray-500 pt-0.5"
        >标记:</span
      >
      <select
        :value="tagSelectMode"
        class="shrink-0 text-[11px] text-gray-500 dark:text-gray-400 bg-transparent border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 focus:outline-none cursor-pointer hover:border-blue-400 transition-colors"
        title="筛选模式：多选=可同时选多个标记取交集；单选=只能选一个，再点取消"
        @change="onModeChange">
        <option value="multi">多选</option>
        <option value="single">单选</option>
      </select>

      <!-- 隐藏测量层：绝对定位、不可见，用于计算换行和可见数量 -->
      <div
        ref="measureRef"
        class="absolute -z-50 invisible flex flex-wrap gap-1.5 pointer-events-none"
        :style="{ width: `${containerWidth}px`, left: '-9999px', top: 0 }">
        <span data-all class="shrink-0 px-2 py-0.5 text-xs rounded-full border flex items-center gap-1">
          <span>全部</span>
          <span class="opacity-60">{{ totalCount }}</span>
        </span>
        <span
          v-for="tag in tags"
          :key="`measure-${tag}`"
          data-chip
          class="shrink-0 px-2 py-0.5 text-xs rounded-full border flex items-center gap-1">
          <span class="truncate max-w-[80px]">{{ tag }}</span>
          <span class="opacity-60">{{ tabCountByTag[tag] ?? 0 }}</span>
        </span>
        <span data-more class="shrink-0 px-2 py-0.5 text-xs rounded-full border flex items-center gap-1">
          更多 ▾
        </span>
      </div>

      <!-- 标记 chips：最多3行，超出截断 -->
      <div
        ref="containerRef"
        class="flex-1 min-w-0 flex flex-wrap gap-1.5 overflow-hidden"
        :style="{ maxHeight: maxHeight }">
        <!-- 全部按钮（chips 行首，参与折行，第二行对齐到下拉框右侧） -->
        <button
          :class="[
            'shrink-0 px-2 py-0.5 text-xs rounded-full border transition-colors flex items-center gap-1',
            activeTags.length === 0
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
          @click="emit('apply', [])">
          <span>全部</span>
          <span class="opacity-60">{{ totalCount }}</span>
        </button>
        <button
          v-for="tag in visibleTags"
          :key="tag"
          :title="tag"
          :class="[
            'shrink-0 px-2 py-0.5 text-xs rounded-full border transition-colors flex items-center gap-1',
            activeTags.includes(tag)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
          @click="toggleTag(tag)">
          <span class="truncate max-w-[80px]">{{ tag }}</span>
          <span class="opacity-60">{{ tabCountByTag[tag] ?? 0 }}</span>
        </button>

        <!-- 更多按钮 -->
        <button
          v-if="hasMore"
          ref="moreTriggerRef"
          class="shrink-0 px-2 py-0.5 text-xs rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          @click.stop="toggleMorePopover">
          更多 ▾
        </button>
      </div>

      <!-- 下拉管理按钮 -->
      <button
        ref="panelTriggerRef"
        :class="[
          'shrink-0 w-6 h-6 flex items-center justify-center rounded-full border transition-colors',
          popover.isOpen(panelId)
            ? 'border-blue-300 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700'
            : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
        ]"
        @click.stop="togglePanel"
        title="管理标记（排序 / 编辑 / 删除）">
        <ChevronDown
          :size="13"
          :class="
            popover.isOpen(panelId)
              ? 'rotate-180 transition-transform'
              : 'transition-transform'
          " />
      </button>
    </div>

    <!-- 帮助说明（仅空状态，有标记时在 panel 内展示） -->
    <div
      v-if="tags.length === 0 && showHelp"
      class="mt-2 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">
      <p class="mb-1">
        <b>标记是什么？</b>给标签分类的自定义标签，方便快速筛选。
      </p>
      <p class="mb-1"><b>怎么用：</b></p>
      <ul class="list-disc list-inside mb-1 ml-1">
        <li>点「添加标记来分类标签」创建第一个标记</li>
        <li>有标记后：点标记筛选（选多个 = 交集），点 ▾ 下拉排序/编辑/删除</li>
      </ul>
      <p>🔒 仅本地保存，不上传。最多15个，每个最多15字。</p>
      <p>⚠️ {{ TAG_BIND_NOTICE }}</p>
    </div>

    <!-- 添加标记输入框（空状态触发） -->
    <div v-if="showAdd" class="flex items-center gap-2 mt-2">
      <div class="flex-1 relative">
        <input
          ref="addInputRef"
          v-model="newTag"
          maxlength="15"
          placeholder="标记名称（最多15字）"
          :class="[
            'w-full text-xs rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1',
            isDuplicate
              ? 'border-red-300 focus:ring-red-400'
              : 'border-gray-200 dark:border-gray-600 focus:ring-blue-400'
          ]"
          @keyup.enter="doAdd"
          @keyup.escape="cancelAdd" />
        <span
          :class="[
            'absolute right-2 top-1/2 -translate-y-1/2 text-[10px]',
            isDuplicate ? 'text-red-400' : 'text-gray-400'
          ]"
          >{{ newTag.length }}/15</span
        >
      </div>
      <button
        class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
        @click="doAdd"
        :disabled="!canSubmitAdd">
        确认
      </button>
      <button
        class="text-xs text-gray-400 hover:text-gray-600 shrink-0"
        @click="cancelAdd">
        <X :size="13" />
      </button>
    </div>
    <div v-if="showAdd && isDuplicate" class="mt-1 text-[10px] text-red-500">
      该标记已存在
    </div>

    <!-- 下拉管理 panel（Teleport to body，不被遮挡） -->
    <Teleport to="body">
      <div
        v-if="popover.isOpen(panelId)"
        :style="panelStyle"
        class="fixed z-[80] w-[320px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl"
        @click.stop>
        <!-- panel 头 -->
        <div
          class="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
          <span class="text-xs font-medium text-gray-700 dark:text-gray-200"
            >管理标记</span
          >
          <div class="flex items-center gap-1">
            <button
              :class="[
                'p-0.5 rounded transition-colors',
                showHelp
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              ]"
              @click="showHelp = !showHelp"
              title="这是什么？">
              <HelpCircle :size="14" />
            </button>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              @click="closePanel"
              title="收起">
              <X :size="14" />
            </button>
          </div>
        </div>

        <!-- 帮助说明（panel 内） -->
        <div
          v-if="showHelp"
          class="mx-3 mt-2 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">
          <p class="mb-1">
            <b>标记是什么？</b>给标签分类的自定义标签，方便快速筛选。
          </p>
          <p class="mb-1"><b>怎么用：</b></p>
          <ul class="list-disc list-inside mb-1 ml-1">
            <li>点标记筛选标签（选多个 = 交集筛选）</li>
            <li>拖标记左侧的「⠿」调整顺序</li>
            <li>✏ 编辑、🗑 删除（删除会从所有标签移除）</li>
            <li>点「全部」清除所有筛选</li>
          </ul>
          <p>🔒 仅本地保存，不上传。最多15个，每个最多15字。</p>
          <p>⚠️ {{ TAG_BIND_NOTICE }}</p>
        </div>

        <!-- 标记列表（可滚动） -->
        <div class="max-h-[300px] overflow-y-auto p-1.5">
          <div
            v-for="(tag, index) in tags"
            :key="tag"
            :class="[
              'flex items-center gap-1.5 px-1.5 py-1 rounded transition-colors select-none',
              activeTags.includes(tag)
                ? 'bg-blue-50 dark:bg-blue-900/30'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700',
              dragState.sourceIndex === index ? 'opacity-50' : '',
              dragState.overIndex === index ? 'ring-2 ring-blue-400' : ''
            ]"
            @dragover.prevent="onDragOver($event, index)"
            @dragleave="onDragLeave"
            @drop="onDrop($event, index)">
            <!-- 拖动手柄：仅手柄发起拖动 -->
            <div
              class="shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300"
              draggable="true"
              @dragstart="onDragStart($event, index)"
              @dragend="onDragEnd"
              title="拖动排序">
              <GripVertical :size="12" />
            </div>
            <!-- 标记名：点击筛选 -->
            <button
              :class="[
                'flex-1 min-w-0 text-left text-xs px-1 py-0.5 rounded truncate',
                activeTags.includes(tag)
                  ? 'text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-gray-700 dark:text-gray-200'
              ]"
              :title="tag"
              @click="toggleTag(tag)">
              {{ tag }}
            </button>
            <!-- 计数 -->
            <span
              class="shrink-0 text-[10px] text-gray-400 dark:text-gray-500"
              >{{ tabCountByTag[tag] ?? 0 }}</span
            >
            <!-- 选中标记 -->
            <span
              v-if="activeTags.includes(tag)"
              class="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"
              title="筛选中" />
            <!-- 编辑 -->
            <button
              class="shrink-0 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
              @click="openEditDialog(tag)"
              title="编辑">
              <Pencil :size="11" />
            </button>
            <!-- 删除 -->
            <button
              class="shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
              @click="openDeleteConfirm(tag)"
              title="删除">
              <Trash2 :size="11" />
            </button>
          </div>
          <p
            v-if="!tags.length"
            class="text-[11px] text-gray-400 text-center py-3">
            暂无标记
          </p>
        </div>

        <!-- panel 底：添加 -->
        <div class="border-t border-gray-100 dark:border-gray-700 p-2">
          <button
            :class="[
              'w-full flex items-center justify-center gap-1 text-xs py-1.5 rounded border transition-colors',
              canAddMore
                ? 'border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
            ]"
            :disabled="!canAddMore"
            @click="openPanelAdd"
            :title="canAddMore ? '添加标记' : '已达15个标记上限'">
            <Plus :size="12" />{{ canAddMore ? "添加标记" : "已达15个上限" }}
          </button>
          <!-- panel 内添加输入框 -->
          <div v-if="showPanelAdd" class="flex items-center gap-1.5 mt-2">
            <div class="flex-1 relative">
              <input
                ref="panelAddInputRef"
                v-model="panelNewTag"
                maxlength="15"
                placeholder="标记名称（最多15字）"
                :class="[
                  'w-full text-xs rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1',
                  isPanelDuplicate
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-blue-400'
                ]"
                @keyup.enter="doPanelAdd"
                @keyup.escape="showPanelAdd = false" />
              <span
                :class="[
                  'absolute right-2 top-1/2 -translate-y-1/2 text-[10px]',
                  isPanelDuplicate ? 'text-red-400' : 'text-gray-400'
                ]"
                >{{ panelNewTag.length }}/15</span
              >
            </div>
            <button
              class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
              @click="doPanelAdd"
              :disabled="!canSubmitPanelAdd">
              确认
            </button>
          </div>
          <div
            v-if="showPanelAdd && isPanelDuplicate"
            class="mt-1 text-[10px] text-red-500">
            该标记已存在
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 编辑对话框 -->
    <Teleport to="body">
      <div
        v-if="editDialog.open"
        class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center"
        @click.self="closeEditDialog">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[320px] p-5">
          <h3 class="text-sm font-bold mb-3 text-gray-900 dark:text-gray-100">
            编辑标记
          </h3>
          <div class="relative">
            <input
              v-model="editDraft"
              maxlength="15"
              placeholder="标记名称（最多15字）"
              :class="[
                'w-full text-xs rounded px-2 py-1.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1',
                isEditDuplicate
                  ? 'border-red-300 focus:ring-red-400'
                  : 'border-gray-200 dark:border-gray-600 focus:ring-blue-400'
              ]"
              @keyup.enter="doRename"
              @keyup.escape="closeEditDialog" />
            <span
              :class="[
                'absolute right-2 top-1/2 -translate-y-1/2 text-[10px]',
                isEditDuplicate ? 'text-red-400' : 'text-gray-400'
              ]"
              >{{ editDraft.length }}/15</span
            >
          </div>
          <div v-if="isEditDuplicate" class="mt-1 text-[10px] text-red-500">
            该标记已存在
          </div>
          <div class="flex gap-2 mt-4 justify-end">
            <button
              class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              @click="closeEditDialog">
              取消
            </button>
            <button
              class="px-4 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              @click="doRename"
              :disabled="!canSubmitEdit">
              确认
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 更多标记弹出层 -->
    <Teleport to="body">
      <div
        v-if="popover.isOpen(morePopoverId)"
        :style="morePopoverStyle"
        class="fixed z-[80] w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl"
        @click.stop>
        <div class="p-2">
          <div class="text-[11px] text-gray-400 dark:text-gray-500 px-2 py-1">更多标记</div>
          <div class="mt-1 flex flex-wrap gap-1.5">
            <button
              v-for="tag in hiddenTags"
              :key="tag"
              :title="tag"
              :class="[
                'px-2 py-0.5 text-xs rounded-full border transition-colors flex items-center gap-1',
                activeTags.includes(tag)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
              @click="toggleMoreTag(tag)">
              <span class="truncate max-w-[100px]">{{ tag }}</span>
              <span class="opacity-60">{{ tabCountByTag[tag] ?? 0 }}</span>
            </button>
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
      @cancel="deleteConfirm.open = false" />
  </div>
</template>

<script setup lang="ts">
/**
 * 标记栏：筛选 chips（收起态） + 下拉管理 panel（排序/编辑/删除/添加）。
 *
 * 设计（2026-07-01 修订）：
 * - 收起态：最多3行 chips，超出截断，末尾显示「更多」按钮
 * - 下拉 panel（点 ▾ 展开）：每行 [⠿手柄][名称][计数][✏][🗑]，
 *   拖动排序、编辑、删除、添加都在 panel 里完成
 * - 横滚栏标记多时不好操作 + 编辑删除入口隐蔽 → 归拢到 panel
 */
import {
  ChevronDown,
  GripVertical,
  HelpCircle,
  Pencil,
  Plus,
  Trash2,
  X
} from "@lucide/vue"
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue"

import { usePopoverManager } from "~composables/usePopoverManager"
import { useTabManager } from "~composables/useTabManager"
import { computePopoverPos } from "~lib/popoverPosition"
import { validateTag } from "~lib/tagValidate"

import ConfirmDialog from "./ConfirmDialog.vue"

const MAX_ROWS = 3
const GAP = 6 // gap-1.5 = 6px

// 标记按 tabId 绑定的局限提示（空状态帮助块 + panel 帮助块共用，避免文案重复）
const TAG_BIND_NOTICE =
  "由于浏览器 API 规则，标记按标签页 ID 绑定。关闭标签页或重启浏览器后，新标签页 ID 会变，标记对应不到新标签（数据仍在本地，只是显示不出来）。"

const props = defineProps<{
  tags: string[]
  activeTags: string[]
  tabCountByTag: Record<string, number>
  /** 当前窗口标签总数，用于「全部」chip 显示数量（与其他 chip 口径一致） */
  totalCount: number
}>()
const emit = defineEmits<{
  apply: [tags: string[]]
  addTag: [tag: string]
  removeTag: [tag: string]
  renameTag: [oldTag: string, newTag: string]
  reorderTag: [fromIndex: number, toIndex: number]
}>()

const popover = usePopoverManager()
const panelId = "tag-manager-panel"
const panelTriggerRef = ref<HTMLElement | null>(null)

// 更多标记弹出层
const morePopoverId = "tag-more-popover"
const moreTriggerRef = ref<HTMLElement | null>(null)

// 多行测量相关
const containerRef = ref<HTMLElement | null>(null)
const measureRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const visibleCount = ref(props.tags.length)
const hasMore = ref(false)
const rowHeight = ref(24) // 默认行高，测量后更新

// 计算属性
const visibleTags = computed(() => props.tags.slice(0, visibleCount.value))
const hiddenTags = computed(() => props.tags.slice(visibleCount.value))

const morePopoverStyle = computed(() => {
  if (!popover.isOpen(morePopoverId) || !popover.activeAnchorRect.value)
    return { left: "0px", top: "0px" }
  const p = computePopoverPos(
    popover.activeAnchorRect.value,
    { width: 200, height: 100 },
    "bottom-right"
  )
  return { left: `${p.left}px`, top: `${p.top}px` }
})

// 最大高度
const maxHeight = computed(() => `${rowHeight.value * MAX_ROWS + GAP * (MAX_ROWS - 1)}px`)

// ResizeObserver + rAF 防抖
let rafId = 0
let resizeObserver: ResizeObserver | null = null

const measure = () => {
  const measureEl = measureRef.value
  const containerEl = containerRef.value
  if (!measureEl || !containerEl) return

  const cw = containerEl.clientWidth
  if (cw === 0) return // 容器未渲染好，跳过
  containerWidth.value = cw

  // 读取测量层元素
  const chipEls = Array.from(measureEl.querySelectorAll("[data-chip]")) as HTMLElement[]
  const allEl = measureEl.querySelector("[data-all]") as HTMLElement | null
  const moreEl = measureEl.querySelector("[data-more]") as HTMLElement | null
  const allWidth = allEl ? allEl.offsetWidth + GAP : 0

  if (chipEls.length === 0) {
    visibleCount.value = 0
    hasMore.value = false
    return
  }

  // 更新行高（用第一个 chip 的高度）
  const firstChip = chipEls[0]
  if (firstChip) {
    rowHeight.value = firstChip.offsetHeight
  }

  // 计算全显需要多少行
  let totalRows = 1
  let currentRowWidth = allWidth // 第一行「全部」按钮占位
  for (let i = 0; i < chipEls.length; i++) {
    const w = chipEls[i].offsetWidth + GAP
    if (currentRowWidth + w > cw && currentRowWidth > 0) {
      totalRows++
      currentRowWidth = w
    } else {
      currentRowWidth += w
    }
  }

  // 如果不超过 MAX_ROWS，全显
  if (totalRows <= MAX_ROWS) {
    visibleCount.value = props.tags.length
    hasMore.value = false
    return
  }

  // 超过 MAX_ROWS，计算能放下多少个（留位置给「更多」）
  const moreWidth = moreEl ? moreEl.offsetWidth + GAP : 60
  let row = 1
  let rw = allWidth // 第一行「全部」按钮占位
  let count = 0

  for (let i = 0; i < chipEls.length; i++) {
    const w = chipEls[i].offsetWidth + GAP
    const availWidth = row === MAX_ROWS ? cw - moreWidth : cw

    if (rw + w > availWidth) {
      if (row === MAX_ROWS) break
      row++
      rw = w
    } else {
      rw += w
    }
    count = i + 1
  }

  visibleCount.value = Math.max(1, count) // 兜底至少1个
  hasMore.value = visibleCount.value < props.tags.length
}

const scheduleMeasure = () => {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => measure())
}

// 更多弹出层操作
const toggleMorePopover = (e: MouseEvent) => {
  popover.toggle(morePopoverId, e.currentTarget as HTMLElement)
}

const toggleMoreTag = (tag: string) => {
  toggleTag(tag)
  // 保持弹出层打开（用户可能想继续操作）
  // 如果需要自动关闭，可以在这里加 popover.close(morePopoverId)
}

// 标记筛选模式（multi/single）来自全局状态，TagBar 行首下拉切换
const { tagSelectMode, setTagSelectMode } = useTabManager()
// 模板里不能用 as 断言，包一层在 script 里
const onModeChange = (e: Event) => {
  setTagSelectMode((e.target as HTMLSelectElement).value as "multi" | "single")
}

// 收起态添加（空状态用）
const showAdd = ref(false)
const newTag = ref("")
const addInputRef = ref<HTMLInputElement | null>(null)

// panel 内添加
const showPanelAdd = ref(false)
const panelNewTag = ref("")
const panelAddInputRef = ref<HTMLInputElement | null>(null)

const showHelp = ref(false)

// 拖拽状态
const dragState = ref<{ sourceIndex: number | null; overIndex: number | null }>(
  {
    sourceIndex: null,
    overIndex: null
  }
)

// 编辑对话框
const editDialog = ref<{ open: boolean; tag: string }>({ open: false, tag: "" })
const editDraft = ref("")

// 删除确认
const deleteConfirm = ref<{ open: boolean; tag: string; count: number }>({
  open: false,
  tag: "",
  count: 0
})

// 计算属性（校验统一走 lib/tagValidate.ts 的 validateTag）
const canAddMore = computed(() => props.tags.length < 15)
const isDuplicate = computed(() => {
  const r = validateTag(newTag.value, props.tags)
  return r.ok === false && r.reason === "duplicate"
})
const canSubmitAdd = computed(() => validateTag(newTag.value, props.tags).ok)
const isPanelDuplicate = computed(() => {
  const r = validateTag(panelNewTag.value, props.tags)
  return r.ok === false && r.reason === "duplicate"
})
const canSubmitPanelAdd = computed(
  () => validateTag(panelNewTag.value, props.tags).ok
)
const isEditDuplicate = computed(() => {
  const trimmed = editDraft.value.trim()
  return trimmed !== editDialog.value.tag && props.tags.includes(trimmed)
})
const canSubmitEdit = computed(() => {
  const trimmed = editDraft.value.trim()
  return (
    trimmed.length > 0 &&
    trimmed.length <= 15 &&
    !isEditDuplicate.value &&
    trimmed !== editDialog.value.tag
  )
})

// panel 定位：基于下拉按钮 anchor
const panelStyle = computed(() => {
  if (!popover.isOpen(panelId) || !popover.activeAnchorRect.value)
    return { left: "0px", top: "0px" }
  const p = computePopoverPos(
    popover.activeAnchorRect.value,
    { width: 320, height: 400 },
    "bottom-right"
  )
  return { left: `${p.left}px`, top: `${p.top}px` }
})

// 筛选：单选模式点已选=清空、点未选=只选它；多选=切换叠加（交集）
const toggleTag = (tag: string) => {
  if (tagSelectMode.value === "single") {
    const isActive = props.activeTags.includes(tag)
    emit("apply", isActive ? [] : [tag])
    return
  }
  const newActive = props.activeTags.includes(tag)
    ? props.activeTags.filter((t) => t !== tag)
    : [...props.activeTags, tag]
  emit("apply", newActive)
}

// panel 开关
const togglePanel = (e: MouseEvent) => {
  popover.toggle(panelId, e.currentTarget as HTMLElement)
}
const closePanel = () => {
  popover.close(panelId)
  showPanelAdd.value = false
  panelNewTag.value = ""
}

// 收起态添加
const doAdd = () => {
  const r = validateTag(newTag.value, props.tags)
  if (!r.ok) return
  emit("addTag", r.name)
  newTag.value = ""
  showAdd.value = false
}
const cancelAdd = () => {
  showAdd.value = false
  newTag.value = ""
}

// panel 内添加
const openPanelAdd = async () => {
  showPanelAdd.value = true
  await nextTick()
  panelAddInputRef.value?.focus()
}
const doPanelAdd = () => {
  const r = validateTag(panelNewTag.value, props.tags)
  if (!r.ok) return
  emit("addTag", r.name)
  panelNewTag.value = ""
  showPanelAdd.value = false
}

// 编辑
const openEditDialog = (tag: string) => {
  editDraft.value = tag
  editDialog.value = { open: true, tag }
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

// 删除
const openDeleteConfirm = (tag: string) => {
  deleteConfirm.value = {
    open: true,
    tag,
    count: props.tabCountByTag[tag] ?? 0
  }
}
const doDelete = () => {
  emit("removeTag", deleteConfirm.value.tag)
  deleteConfirm.value.open = false
}

// 拖拽
const onDragStart = (e: DragEvent, index: number) => {
  dragState.value.sourceIndex = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(index))
  }
}
const onDragOver = (_e: DragEvent, index: number) => {
  if (
    dragState.value.sourceIndex === null ||
    dragState.value.sourceIndex === index
  )
    return
  dragState.value.overIndex = index
}
const onDragLeave = () => {
  dragState.value.overIndex = null
}
const onDrop = (_e: DragEvent, index: number) => {
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

// 自动聚焦（收起态空状态添加）
watch(showAdd, async (val) => {
  if (val) {
    await nextTick()
    addInputRef.value?.focus()
  }
})

// Esc 关闭 panel（PopoverManager 的全局关闭已处理点空白，这里补 Esc）
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && popover.isOpen(panelId)) closePanel()
}

// 初始化测量
onMounted(() => {
  document.addEventListener("keydown", onKeydown)

  // 先设置初始值全显
  visibleCount.value = props.tags.length
  hasMore.value = false

  // 等待 DOM 渲染后测量
  nextTick(() => {
    measure()

    // 设置 ResizeObserver
    if (containerRef.value && typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(() => scheduleMeasure())
      resizeObserver.observe(containerRef.value)
    }
  })
})

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  cancelAnimationFrame(rafId)
})

// 监听 tags 变化和计数变化重新测量
watch(
  () => [props.tags.length, JSON.stringify(props.tabCountByTag)],
  () => {
    nextTick(() => scheduleMeasure())
  }
)
</script>
