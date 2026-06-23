<template>
  <div class="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs">
    <div class="flex items-center gap-3 flex-1 overflow-hidden">
      <button
        v-for="s in visibleStats"
        :key="s.key"
        :title="s.desc"
        :class="['shrink-0 transition-colors', activeFilter === s.key ? 'text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-700']"
        @click="emit('filter', s.key)"
      >
        {{ s.label }} ({{ s.value }})
      </button>
      <button v-if="hiddenStats.length" class="text-gray-400 hover:text-gray-600 shrink-0" @click="showMore = !showMore">
        +{{ hiddenStats.length }}
      </button>
      <div v-if="showMore" class="absolute bottom-10 left-4 bg-white border border-gray-200 rounded shadow-lg z-20 py-1">
        <button
          v-for="s in hiddenStats"
          :key="s.key"
          :class="['block w-full text-left px-4 py-1.5 text-xs hover:bg-gray-50', activeFilter === s.key ? 'font-bold' : '']"
          @click="emit('filter', s.key); showMore = false"
        >
          {{ s.label }} ({{ s.value }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

const props = defineProps<{
  stats: Array<{ key: string; label: string; desc: string; value: number }>
  activeFilter: string
}>()
const emit = defineEmits(["filter"])
const showMore = ref(false)
const withCount = computed(() => props.stats.filter(s => s.value > 0 || s.key === "all"))
const visibleStats = computed(() => withCount.value.slice(0, 5))
const hiddenStats = computed(() => withCount.value.slice(5))
</script>
