<template>
  <div>
    <div
      :style="{ paddingLeft: depth * 16 + 8 + 'px' }"
      class="flex items-center gap-2 py-1.5 pr-2 rounded hover:bg-gray-50 cursor-pointer group"
      @click="emit('activate')"
    >
      <span class="text-[10px] text-gray-300 font-mono w-4 text-center shrink-0">{{ item.number }}</span>
      <FavIcon :src="item.favIconUrl" :domain="item.domain" size="sm" />
      <p class="flex-1 text-xs text-gray-800 truncate">{{ item.title }}</p>
      <template v-if="item.tags.length">
        <span class="text-[10px] bg-blue-50 text-blue-600 px-1 rounded shrink-0">{{ item.tags[0] }}</span>
        <span v-if="item.tags.length > 1" class="text-[10px] text-gray-400 shrink-0">...</span>
      </template>
      <StatusBadge :item="item" mini />
      <div class="opacity-0 group-hover:opacity-100 flex gap-0.5">
        <ActionButtons @later="emit('later')" @close="emit('close')" @copy="emit('copy')" />
      </div>
    </div>
    <TabTreeItem
      v-for="child in children"
      :key="child.item.id"
      :item="child.item"
      :children="child.children"
      :depth="depth + 1"
      @activate="emit('activate-child', child.item.id)"
      @activate-child="emit('activate-child', $event)"
      @later="emit('later-child', child.item.id)"
      @later-child="emit('later-child', $event)"
      @close="emit('close-child', child.item.id)"
      @close-child="emit('close-child', $event)"
      @copy="emit('copy-child', child.item.url)"
      @copy-child="emit('copy-child', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { TabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import ActionButtons from "./ActionButtons.vue"

export interface TreeNode { item: TabItem; children: TreeNode[] }

defineProps<{ item: TabItem; children: TreeNode[]; depth?: number }>()
const emit = defineEmits(["activate", "activate-child", "later", "later-child", "close", "close-child", "copy", "copy-child"])
</script>
