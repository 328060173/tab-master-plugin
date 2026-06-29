<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/30" @click="emit('close')"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-80 p-4">
        <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600" @click="emit('close')">
          <X :size="16" />
        </button>
        <h3 class="text-sm font-semibold text-gray-900 mb-4">{{ title }}</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">分组名称</label>
            <input v-model="name" type="text" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="输入分组名称" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">分组颜色</label>
            <div class="flex flex-wrap gap-2">
              <button v-for="c in GROUP_COLORS" :key="c"
                      :class="[colorClass(c), 'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110', selectedColor === c ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' : 'border-transparent']"
                      @click="selectedColor = c"
              ></button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button class="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded-md" @click="emit('close')">取消</button>
          <button class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed" :disabled="!canCreate" @click="handleCreate">
            {{ createText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { X } from "@lucide/vue"
import { GROUP_COLORS, GROUP_COLOR_CLASSES, type GroupColor } from "~composables/useTabGroups"

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  createText?: string
  selectedTabIds?: number[]
}>(), {
  title: "新建分组",
  createText: "创建",
  selectedTabIds: () => [],
})

const emit = defineEmits<{
  close: []
  create: [name: string, color: GroupColor]
}>()

const name = ref("")
const selectedColor = ref<GroupColor>("blue")

const canCreate = computed(() => {
  // 允许创建空分组（虽然 Chrome API 实际上需要至少一个标签）
  // 这里我们保持简单，让调用者处理验证
  return true
})

const colorClass = (color: string) => {
  return GROUP_COLOR_CLASSES[color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
}

const handleCreate = () => {
  emit("create", name.value || "未命名分组", selectedColor.value)
}
</script>
