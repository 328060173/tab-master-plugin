<template>
  <Teleport to="body">
    <div v-if="popover.isOpen(hoverCardId)" class="fixed z-[70] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl w-64 text-xs"
      :style="cardStyle"
      @click.stop>
      <!-- 完整标题 -->
      <div class="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
        <p class="font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-3 mb-1">{{ item.title }}</p>
        <p class="text-[10px] text-gray-400 truncate">{{ item.domain }}</p>
      </div>
      <!-- 标记 + 编号 + 状态 -->
      <div class="px-3 py-2 space-y-1.5 border-b border-gray-100 dark:border-gray-700">
        <div v-if="item.tags.length" class="flex items-center gap-1 flex-wrap">
          <span class="text-[10px] text-gray-400">标记:</span>
          <span v-for="tag in item.tags" :key="tag" class="relative group/tag text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 pl-1.5 pr-3 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            {{ tag }}
            <button
              class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-800 text-blue-500 dark:text-blue-300 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center leading-none transition-colors"
              title="移除该标记"
              @click.stop="onRemoveTag(tag)">
              <X :size="8" :stroke-width="2.5" />
            </button>
          </span>
        </div>
        <!-- 编号设置 -->
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-gray-400">编号:</span>
          <input v-if="editingNumber" ref="numberInput" v-model="numberDraft" type="number" min="1" max="9"
            class="w-10 h-5 text-[10px] text-center border border-blue-400 rounded outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            @keyup.enter="confirmNumber" @keyup.escape="editingNumber = false" @blur="confirmNumber" />
          <button v-else class="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            @click="startEditNumber">{{ item.number ? `${modKey}${item.number}` : '点击设置' }}</button>
        </div>
        <div class="flex flex-wrap gap-1 text-[10px]">
          <span v-if="item.audible && !item.muted" class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">🔊 播放中</span>
          <span v-if="item.muted" class="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded">🔕 已静音</span>
          <span v-if="item.pinned" class="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">📌 已固定</span>
          <span v-if="item.loading" class="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">⌛ 加载中</span>
          <span v-if="item.recording" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">🔴 录制中</span>
          <span v-if="item.sharing" class="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded">📡 共享中</span>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="px-2 py-2 grid grid-cols-2 gap-1">
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1" @click="onRefresh">
          <RefreshCw :size="10" />刷新
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1" @click="onCopy">
          <Link :size="10" />复制链接
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1" @click="onPin">
          <Pin :size="10" />{{ item.pinned ? '取消固定' : '固定' }}
        </button>
        <button v-if="!hideAddTag" class="px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1" @click="onClickTag">
          <Tag :size="10" />标记
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1" @click="onLater">
          <Clock :size="10" />稍后处理
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center gap-1" @click="onClose">
          <X :size="10" />关闭标签
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from "vue"
import { RefreshCw, Link, Pin, Tag, Clock, X } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import { modKey } from "~lib/platform"
import { usePopoverManager } from "~composables/usePopoverManager"
import { computePopoverPos } from "~lib/popoverPosition"

const props = defineProps<{ hoverCardId: string; item: TabItem; hideAddTag?: boolean }>()
const emit = defineEmits<{ refresh: []; copy: []; pin: []; addTag: [anchor: HTMLElement]; later: []; close: []; updateNumber: [n: number]; removeTag: [tag: string] }>()

const popover = usePopoverManager()
const CARD_WIDTH = 256
const CARD_HEIGHT = 230

const cardStyle = computed(() => {
  if (!popover.isOpen(props.hoverCardId) || !popover.activeAnchorRect.value) {
    return { left: '0px', top: '0px' }
  }
  const pos = computePopoverPos(popover.activeAnchorRect.value, { width: CARD_WIDTH, height: CARD_HEIGHT }, 'bottom-left')
  return { left: `${pos.left}px`, top: `${pos.top}px` }
})

// 事件处理函数，先关闭popover再emit事件
const onRefresh = () => { popover.close(); emit('refresh') }
const onCopy = () => { popover.close(); emit('copy') }
const onPin = () => { popover.close(); emit('pin') }
const onLater = () => { popover.close(); emit('later') }
const onClose = () => { popover.close(); emit('close') }

// 标记按钮：把按钮 DOM 传给父组件，让它能用这个 DOM 做 anchor 打开 TagPicker
// ⚠️ 不能先 popover.close()：HoverCard 卸载会导致 anchorEl DOM 被移除，
//    popover.open 时 getBoundingClientRect 返回 0,0 → 弹框跑到左上角。
//    缓存 currentTarget（事件结束后会被浏览器重置为 null），交给父组件 openFromAnchor
//    调 popover.open（互斥机制会自动关掉 HoverCard，此时 rect 已存好）。
const onClickTag = (e: MouseEvent) => {
  const anchor = e.currentTarget as HTMLElement
  emit('addTag', anchor)
}

// 移除单个标记：只 emit tag 名，由父组件转发到 sidepanel 主实例的 removeTabTag
// （removeTabTag 内部用 tabs.value 查当前 tags 再 filter，不依赖 props.item.tags——
//  props 经过 Teleport + 多层 computed 可能旧值，用旧值 filter 会删错，如删一个把别的也带没）
// 不关 hover card，方便连续删多个
const onRemoveTag = (tag: string) => {
  emit('removeTag', tag)
}

const editingNumber = ref(false)
const numberDraft = ref("")
const numberInput = ref<HTMLInputElement | null>(null)

const startEditNumber = async () => {
  numberDraft.value = props.item.number ? String(props.item.number) : ""
  editingNumber.value = true
  await nextTick()
  numberInput.value?.select()
}
const confirmNumber = () => {
  editingNumber.value = false
  const n = parseInt(numberDraft.value)
  if (!isNaN(n) && n >= 1 && n <= 9) emit('updateNumber', n)
  else if (!numberDraft.value.trim()) emit('updateNumber', 0)
}
</script>
