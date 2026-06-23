<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" @click.self="emit('close')">
      <div class="bg-white rounded-xl shadow-xl w-80 p-5">
        <h3 class="text-sm font-bold mb-2">稍后处理</h3>
        <!-- 提示语 -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
          <p class="text-xs text-amber-700 leading-relaxed">
            此操作将<strong>关闭当前标签页</strong>并保存到「稍后处理」列表。
            你可以随时在「稍后处理」Tab 中找到它，点击即可重新打开。
          </p>
        </div>
        <p class="text-xs text-gray-500 mb-2">备注（可选）</p>
        <input
          v-model="note" type="text" ref="inputRef"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="备注内容..."
          @keydown.enter="confirm" @keydown.esc="emit('close')"
        />
        <div class="flex gap-2 mt-4 justify-end">
          <button class="px-4 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50" @click="emit('close')">取消</button>
          <button class="px-4 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700" @click="confirm">确认放入稍后</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue"
const props = defineProps<{ open: boolean }>()
const emit = defineEmits(["close", "confirm"])
const note = ref("")
const inputRef = ref<HTMLInputElement>()
watch(() => props.open, async (v) => { if (v) { note.value = ""; await nextTick(); inputRef.value?.focus() } })
const confirm = () => { emit("confirm", note.value.trim()); note.value = "" }
</script>
