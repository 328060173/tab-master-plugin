<template>
  <Teleport to="body">
    <div v-if="show" class="fixed z-[9999] bg-white border border-gray-300 rounded-lg shadow-2xl w-64 text-xs"
      :style="{ left: x + 'px', top: y + 'px' }"
      @mouseenter="emit('stay')" @mouseleave="emit('leave')">
      <!-- 完整标题 -->
      <div class="px-3 py-2 border-b border-gray-100">
        <p class="font-semibold text-gray-900 leading-snug line-clamp-3 mb-1">{{ item.title }}</p>
        <p class="text-[10px] text-gray-400 truncate">{{ item.domain }}</p>
      </div>
      <!-- 标记 + 编号 + 状态 -->
      <div class="px-3 py-2 space-y-1.5 border-b border-gray-100">
        <div v-if="item.tags.length" class="flex items-center gap-1 flex-wrap">
          <span class="text-[10px] text-gray-400">标记:</span>
          <span v-for="tag in item.tags" :key="tag" class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200">{{ tag }}</span>
        </div>
        <!-- 编号设置 -->
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-gray-400">编号:</span>
          <input v-if="editingNumber" ref="numberInput" v-model="numberDraft" type="number" min="1" max="9"
            class="w-10 h-5 text-[10px] text-center border border-blue-400 rounded outline-none"
            @keyup.enter="confirmNumber" @keyup.escape="editingNumber = false" @blur="confirmNumber" />
          <button v-else class="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-200"
            @click="startEditNumber">{{ item.number ? `${modKey}${item.number}` : '点击设置' }}</button>
        </div>
        <div class="flex flex-wrap gap-1 text-[10px]">
          <span v-if="item.audible && !item.muted" class="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">🔊 播放中</span>
          <span v-if="item.muted" class="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">🔕 已静音</span>
          <span v-if="item.pinned" class="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">📌 已固定</span>
          <span v-if="item.loading" class="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">⌛ 加载中</span>
          <span v-if="item.recording" class="bg-red-50 text-red-600 px-1.5 py-0.5 rounded">🔴 录制中</span>
          <span v-if="item.sharing" class="bg-green-50 text-green-600 px-1.5 py-0.5 rounded">📡 共享中</span>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="px-2 py-2 grid grid-cols-2 gap-1">
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-1" @click="emit('refresh')">
          <RefreshCw :size="10" />刷新
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-1" @click="emit('copy')">
          <Link :size="10" />复制链接
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-1" @click="emit('pin')">
          <Pin :size="10" />{{ item.pinned ? '取消固定' : '固定' }}
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-1" @click="emit('addTag')">
          <Tag :size="10" />标记
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-1" @click="emit('later')">
          <Clock :size="10" />稍后处理
        </button>
        <button class="px-2 py-1 text-[10px] rounded border border-red-200 hover:bg-red-50 text-red-600 flex items-center justify-center gap-1" @click="emit('close')">
          <X :size="10" />关闭标签
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"
import { RefreshCw, Link, Pin, Tag, Clock, X } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import { modKey } from "~lib/platform"

const props = defineProps<{ show: boolean; item: TabItem; x: number; y: number }>()
const emit = defineEmits<{ stay: []; leave: []; refresh: []; copy: []; pin: []; addTag: []; later: []; close: []; updateNumber: [n: number] }>()

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
