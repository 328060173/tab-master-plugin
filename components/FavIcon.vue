<template>
  <div class="relative shrink-0 inline-flex"
    :class="size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-5 h-5' : 'w-7 h-7'">
    <div :class="['flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 font-bold overflow-hidden w-full h-full',
      size === 'lg' ? 'text-base' : size === 'sm' ? 'text-[10px]' : 'text-xs']">
      <img v-if="src && !failed" :src="src" class="w-full h-full object-contain" @error="failed = true" />
      <span v-else>{{ letter }}</span>
    </div>
    <span v-if="badge" class="absolute -top-1 -right-1 text-[9px] leading-none select-none pointer-events-none">{{ badge }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
const props = defineProps<{ src: string; domain: string; size?: "sm" | "md" | "lg"; badge?: string }>()
const failed = ref(false)
const letter = computed(() => props.domain.charAt(0).toUpperCase() || "?")
</script>
