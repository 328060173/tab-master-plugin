<template>
  <div class="relative" @click.stop>
    <button class="p-0.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors" title="添加标记" @click.stop="open = !open">
      <Tag :size="11" />
    </button>
    <div v-if="open" class="absolute bottom-full right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-xl z-30 w-48" v-click-outside="() => open = false">
      <!-- 顶部新增标记 -->
      <div class="flex items-center gap-1.5 px-2.5 py-2 border-b border-gray-100">
        <Plus :size="11" class="text-gray-400 shrink-0" />
        <input
          v-model="newTag" maxlength="15" placeholder="新增标记（最多15字）"
          class="flex-1 text-[11px] focus:outline-none bg-transparent"
          @keyup.enter="create"
        />
        <button class="text-[11px] text-blue-600 hover:text-blue-700 shrink-0" @click="create">添加</button>
      </div>
      <!-- 已有标记列表 -->
      <div class="grid grid-cols-3 gap-1 p-2 max-h-36 overflow-y-auto">
        <button
          v-for="tag in allTags" :key="tag"
          :class="['px-1 py-0.5 text-[10px] rounded border text-center truncate transition-colors', currentTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-400']"
          :title="tag"
          @click="toggle(tag)"
        >{{ tag }}</button>
        <p v-if="!allTags.length" class="col-span-3 text-[11px] text-gray-400 text-center py-2">暂无标记</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Tag, Plus } from "@lucide/vue"

const props = defineProps<{ currentTags: string[]; allTags: string[] }>()
const emit = defineEmits<{ update: [tags: string[]]; addTag: [tag: string] }>()
const open = ref(false)
const newTag = ref("")

const toggle = (tag: string) => {
  emit("update", props.currentTags.includes(tag) ? props.currentTags.filter(t => t !== tag) : [...props.currentTags, tag])
}
const create = () => {
  const t = newTag.value.trim()
  if (t) { emit("addTag", t); newTag.value = "" }
}

const vClickOutside = {
  mounted(el: any, b: any) { el._o = (e: MouseEvent) => { if (!el.contains(e.target)) b.value() }; document.addEventListener("click", el._o) },
  unmounted(el: any) { document.removeEventListener("click", el._o) },
}
</script>
