<template>
  <div
    :class="['flex flex-col gap-2 p-3 rounded-xl border-2 bg-white hover:shadow-md transition-shadow cursor-pointer',
      item.active ? 'border-blue-600 bg-blue-200' : 'border-gray-200']"
    @click="emit('activate')"
  >
    <div class="flex items-start gap-2">
      <TabNumber :num="item.number" :isActive="item.active" @update="emit('updateNumber', $event)" />
      <FavIcon :src="item.favIconUrl" :domain="item.domain" />
      <div class="flex-1 min-w-0">
        <p :class="['text-sm leading-tight line-clamp-2', item.active ? 'text-blue-900 font-bold' : 'text-gray-900 font-semibold']">{{ item.title }}</p>
        <p class="text-xs text-gray-400 mt-0.5 truncate">{{ item.domain.toLowerCase() }}</p>
      </div>
      <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="mt-1 cursor-pointer" />
    </div>
    <div class="flex items-center gap-1.5 flex-wrap">
      <StatusBadge :item="item" />
      <template v-if="item.tags.length">
        <span class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-200">{{ item.tags[0] }}</span>
        <span v-if="item.tags.length > 1" class="text-[10px] text-gray-400">+{{ item.tags.length - 1 }}</span>
      </template>
      <span class="ml-auto text-[10px] text-gray-400">{{ item.openedAt }}</span>
    </div>
    <div class="flex justify-end items-center gap-1">
      <TagPicker :currentTags="item.tags" :allTags="customTags" @update="emit('updateTags', $event)" @addTag="emit('addTag', $event)" />
      <ActionButtons @later="emit('later')" @close="emit('close')" @copy="emit('copy')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import ActionButtons from "./ActionButtons.vue"
import TagPicker from "./TagPicker.vue"
import TabNumber from "./TabNumber.vue"

defineProps<{ item: TabItem; isBatch: boolean; isChecked: boolean; customTags: string[] }>()
const emit = defineEmits(["activate", "toggle", "later", "close", "copy", "updateTags", "addTag", "updateNumber"])
</script>
