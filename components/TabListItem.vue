<template>
  <div
    :class="['flex items-center gap-2 px-3 py-2 rounded-lg border-l-2 border transition-colors cursor-pointer',
      item.active
        ? 'border-l-blue-700 border-y-blue-300 border-r-blue-300 bg-blue-200 hover:bg-blue-200'
        : 'border-l-transparent border-gray-200 bg-white hover:bg-gray-50']"
    @click="emit('activate')"
  >
    <input v-if="isBatch" type="checkbox" :checked="isChecked" @change.stop="emit('toggle')" class="cursor-pointer shrink-0" />
    <TabNumber :num="item.number" :isActive="item.active" @update="emit('updateNumber', $event)" />
    <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
    <div class="flex-1 min-w-0 flex items-center gap-1.5">
      <p :class="['text-sm font-medium truncate', item.active ? 'text-blue-900 font-semibold' : 'text-gray-900']">{{ item.title }}</p>
      <template v-if="item.tags.length">
        <span class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-200 shrink-0">{{ item.tags[0] }}</span>
        <span v-if="item.tags.length > 1" class="text-[10px] text-gray-400 shrink-0">+{{ item.tags.length - 1 }}</span>
      </template>
    </div>
    <span class="text-xs text-gray-400 w-10 text-right shrink-0">{{ item.openedAt }}</span>
    <span class="text-xs text-gray-400 w-24 truncate shrink-0 hidden sm:block">{{ item.domain.toLowerCase() }}</span>
    <StatusBadge :item="item" />
    <TagPicker :currentTags="item.tags" :allTags="customTags" @update="emit('updateTags', $event)" @addTag="emit('addTag', $event)" />
    <ActionButtons @later="emit('later')" @close="emit('close')" @copy="emit('copy')" />
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
