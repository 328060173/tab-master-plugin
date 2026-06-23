<template>
  <div class="flex items-center justify-between px-4 py-2 border-b border-gray-100">
    <div class="flex items-center gap-1">
      <template v-if="!isLaterPage">
        <div class="relative">
          <button class="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50" @click.stop="cleanOpen = !cleanOpen">
            <Trash2 :size="12" />清理
          </button>
          <div v-if="cleanOpen" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-52 py-1" v-click-outside="() => cleanOpen = false">
            <p class="px-3 py-1 text-[10px] text-gray-400 font-medium">关闭标签</p>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50" @click="emit('closeUnpinned'); cleanOpen=false">
              <X :size="12" />关闭非固定标签
            </button>
            <button class="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50" @click="emit('closeOthers'); cleanOpen=false">
              <X :size="12" />关闭其他标签（除当前页）
            </button>
          </div>
        </div>
      </template>
    </div>

    <div class="flex items-center gap-1">
      <!-- 视图切换 -->
      <div class="relative">
        <button class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" title="切换视图" @click.stop="viewOpen = !viewOpen">
          <LayoutGrid :size="15" />
        </button>
        <div v-if="viewOpen" class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32 py-1" v-click-outside="() => viewOpen = false">
          <p class="px-3 py-1 text-[10px] text-gray-400 font-medium">视图</p>
          <button v-for="o in VIEW_OPTIONS" :key="o.value" :class="['flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50', viewMode === o.value ? 'text-blue-600 font-medium' : '']" @click="emit('viewChange', o.value); viewOpen=false">{{ o.label }}</button>
        </div>
      </div>

      <div class="w-px h-4 bg-gray-200 mx-0.5"></div>

      <!-- 排序 -->
      <div class="relative">
        <button class="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50" @click.stop="sortOpen = !sortOpen">
          <ArrowUpDown :size="12" />{{ SORT_OPTIONS.find(o => o.value === sortMode)?.label }}
        </button>
        <div v-if="sortOpen" class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-36 py-1" v-click-outside="() => sortOpen = false">
          <p class="px-3 py-1 text-[10px] text-gray-400 font-medium">排序</p>
          <button v-for="o in SORT_OPTIONS" :key="o.value" :class="['flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-gray-50', sortMode === o.value ? 'text-blue-600 font-medium' : '']" @click="emit('sortChange', o.value); sortOpen=false">{{ o.label }}</button>
        </div>
      </div>

      <!-- 批量操作 -->
      <template v-if="!isBatchMode">
        <button class="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50" @click="emit('toggleBatch')">
          <CheckSquare :size="12" />批量操作
        </button>
      </template>
      <template v-else>
        <button class="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50" @click="emit('toggleBatch')">
          <XSquare :size="12" />取消批量
        </button>
        <button v-if="selectedCount" class="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600" @click="emit('batchClose')">
          关闭已选({{ selectedCount }})
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Trash2, LayoutGrid, ArrowUpDown, CheckSquare, XSquare, X } from "@lucide/vue"

defineProps<{
  isLaterPage: boolean
  isBatchMode: boolean
  selectedCount: number
  viewMode: string
  sortMode: string
}>()

const emit = defineEmits(["viewChange", "sortChange", "toggleBatch", "batchClose", "closeUnpinned", "closeOthers"])

const cleanOpen = ref(false)
const viewOpen = ref(false)
const sortOpen = ref(false)

const VIEW_OPTIONS = [
  { value: "tile", label: "平铺视图" },
  { value: "list", label: "列表视图" },
  { value: "icon", label: "图标视图" },
]

const SORT_OPTIONS = [
  { value: "domain", label: "按域名" },
  { value: "timeAsc", label: "时间正序" },
  { value: "timeDesc", label: "时间倒序" },
]

// 点击外部关闭下拉，使用简单的全局点击监听
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutside = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener("click", el._clickOutside)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener("click", el._clickOutside)
  },
}
</script>
