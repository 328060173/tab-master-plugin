<template>
  <div class="relative group/num shrink-0" @click.stop>
    <!-- 显示态 -->
    <button
      v-if="!editing"
      :class="['w-6 h-5 text-[10px] font-mono rounded flex items-center justify-center transition-colors',
        isActive ? 'text-blue-400' : 'text-gray-300 group-hover/num:text-gray-500 group-hover/num:bg-gray-100']"
      :title="`编号 ${num || '-'}：按 Ctrl+${num} 快速切换此标签`"
      @click="startEdit"
    >{{ num || '-' }}</button>
    <!-- 编辑态 -->
    <input
      v-else ref="inputRef"
      v-model="draft"
      type="number" min="1" max="99"
      class="w-8 h-5 text-[10px] font-mono text-center border border-blue-400 rounded outline-none bg-white"
      @keyup.enter="confirm"
      @keyup.escape="editing = false"
      @blur="confirm"
    />
    <!-- tooltip -->
    <div v-if="!editing && num" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] bg-gray-800 text-white rounded whitespace-nowrap pointer-events-none opacity-0 group-hover/num:opacity-100 z-50 transition-opacity">
      Ctrl+{{ num }} 切换
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"

const props = defineProps<{ num: number; isActive: boolean }>()
const emit = defineEmits<{ update: [n: number] }>()

const editing = ref(false)
const draft = ref("")
const inputRef = ref<HTMLInputElement | null>(null)

const startEdit = () => {
  draft.value = props.num ? String(props.num) : ""
  editing.value = true
  nextTick(() => inputRef.value?.select())
}
const confirm = () => {
  editing.value = false
  const n = parseInt(draft.value)
  if (!isNaN(n) && n >= 1 && n <= 99) emit("update", n)
  else if (!draft.value.trim()) emit("update", 0)
}
</script>
