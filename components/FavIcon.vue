<template>
  <div
    :class="[
      'flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 font-bold shrink-0 overflow-hidden',
      size === 'lg' ? 'w-10 h-10 text-base' : size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-7 h-7 text-xs'
    ]"
  >
    <img v-if="src" :src="src" :class="['object-contain', size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-5 h-5' : 'w-7 h-7']" @error="onError" />
    <span v-else>{{ letter }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

const props = defineProps<{ src: string; domain: string; size?: "sm" | "md" | "lg" }>()
const failed = ref(false)
const onError = () => { failed.value = true }
const letter = computed(() => props.domain.charAt(0).toUpperCase() || "?")
</script>
