<template>
  <div class="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
    <button class="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded" @click="onCancel">
      取消
    </button>
    <button :class="['px-4 py-1.5 text-xs rounded font-medium transition-colors',
      selectedCount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed']"
      :disabled="selectedCount === 0"
      @click="onStartFocus">
      开始聚焦 {{ selectedCount > 0 ? `(${selectedCount})` : '' }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  selectedCount: number
}>()

const emit = defineEmits<{
  cancel: []
  startFocus: []
}>()

const onCancel = () => {
  emit('cancel')
}

const onStartFocus = () => {
  if (props.selectedCount > 0) {
    emit('startFocus')
  }
}
</script>
