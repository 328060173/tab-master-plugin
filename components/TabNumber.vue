<template>
  <div class="relative group/num shrink-0 w-6" @click.stop>
    <!-- 编辑态 -->
    <input
      v-if="editing" ref="inputRef"
      v-model="draft" type="number" min="1" max="4"
      class="w-6 h-5 text-[10px] font-mono text-center border border-blue-400 rounded outline-none bg-white"
      @keyup.enter="confirm" @keyup.escape="cancel" @blur="confirm"
    />
    <!-- 有编号：显示数字 -->
    <button v-else-if="num"
      :class="['w-6 h-5 text-[10px] font-mono rounded flex items-center justify-center transition-colors',
        isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-500']"
      :title="hasShortcut ? `${shortcutHint(num)} 快速切换，点击修改` : '点击修改编号'"
      @click="startEdit"
    >{{ num }}</button>
    <!-- 无编号：hover 时显示键盘图标 -->
    <button v-else
      class="w-6 h-5 rounded flex items-center justify-center opacity-0 group-hover/num:opacity-100 transition-opacity text-gray-300 hover:text-blue-400"
      title="点击设置快捷键编号"
      @click="startEdit"
    ><Keyboard :size="10" /></button>
    <!-- tooltip：1-4 有快捷键时显示键位提示 -->
    <div v-if="!editing && num && hasShortcut"
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] bg-gray-800 text-white rounded whitespace-nowrap pointer-events-none opacity-0 group-hover/num:opacity-100 z-50 transition-opacity">
      {{ shortcutHint(num) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue"
import { Keyboard } from "@lucide/vue"
import { shortcutHint } from "~lib/platform"

const props = defineProps<{ num: number; isActive: boolean }>()
const emit = defineEmits<{ update: [n: number] }>()

// chrome.commands 最多 4 个快捷键，仅编号 1-4 绑定全局快捷键
const hasShortcut = computed(() => props.num >= 1 && props.num <= 4)

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
  if (!isNaN(n) && n >= 1 && n <= 4) emit("update", n)
  else if (!draft.value.trim()) emit("update", 0)
}
const cancel = () => { editing.value = false }
</script>
