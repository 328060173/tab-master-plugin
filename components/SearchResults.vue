<template>
  <div class="flex-1 overflow-y-auto min-h-0 px-3 py-2">
    <template v-if="pinned.length">
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
        <Pin :size="10" />固定标签 ({{ pinned.length }})
      </p>
      <div v-for="t in pinned" :key="t.id" :class="['flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 mb-0.5 cursor-pointer', t.active ? 'border-l-2 border-l-blue-700 bg-blue-200' : '']" @click="emit('activate', t.id)">
        <FavIcon :src="t.favIconUrl" :domain="t.domain" size="sm" />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-900 truncate" v-html="hl(t.title)"></p>
          <p class="text-[10px] text-gray-400 truncate" v-html="hl(t.url)"></p>
        </div>
        <StatusBadge :item="t" />
        <TagPicker :tabId="t.id" :currentTags="t.tags" :allTags="customTags" @update="emit('updateTags', t.id, $event)" @addTag="emit('addTag', $event)" />
        <ActionButtons @later="emit('later', t.id)" @copy="emit('copy', t.url)" @close="emit('close', t.id)" />
      </div>
    </template>

    <template v-if="open.length">
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 mt-3 flex items-center gap-1">
        <Globe :size="10" />已打开 ({{ open.length }})
      </p>
      <div v-for="t in open" :key="t.id" :class="['flex items-center gap-2 px-2.5 py-1.5 rounded-lg border mb-0.5 cursor-pointer transition-colors', t.active ? 'border-l-2 border-l-blue-700 border-y-blue-300 border-r-blue-300 bg-blue-200' : 'border-transparent hover:border-gray-200 hover:bg-gray-50']" @click="emit('activate', t.id)">
        <FavIcon :src="t.favIconUrl" :domain="t.domain" size="sm" />
        <div class="flex-1 min-w-0">
          <p :class="['text-xs font-medium truncate', t.active ? 'text-blue-900' : 'text-gray-900']" v-html="hl(t.title)"></p>
          <p class="text-[10px] text-gray-400 truncate" v-html="hl(t.url)"></p>
        </div>
        <StatusBadge :item="t" />
        <TagPicker :tabId="t.id" :currentTags="t.tags" :allTags="customTags" @update="emit('updateTags', t.id, $event)" @addTag="emit('addTag', $event)" />
        <ActionButtons @later="emit('later', t.id)" @copy="emit('copy', t.url)" @close="emit('close', t.id)" />
      </div>
    </template>

    <template v-if="closed.length">
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 mt-3 flex items-center gap-1">
        <History :size="10" />最近关闭 ({{ closed.length }})
      </p>
      <button v-for="t in closed" :key="t.id + t.closedAt" class="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-left mb-0.5 border border-transparent hover:border-gray-200 group" @click="emit('restore', t.url)">
        <FavIcon :src="t.favIconUrl" :domain="t.domain" size="sm" />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-600 truncate" v-html="hl(t.title)"></p>
          <p class="text-[10px] text-gray-400 truncate" v-html="hl(t.url)"></p>
        </div>
        <span class="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded shrink-0 opacity-0 group-hover:opacity-100">恢复</span>
      </button>
    </template>

    <div v-if="!pinned.length && !open.length && !closed.length" class="text-center text-gray-400 text-xs py-12">未找到匹配的标签</div>
  </div>
</template>

<script setup lang="ts">
import { Pin, Globe, History } from "@lucide/vue"
import type { TabItem, ClosedTabItem } from "~types/tab"
import FavIcon from "./FavIcon.vue"
import StatusBadge from "./StatusBadge.vue"
import TagPicker from "./TagPicker.vue"
import ActionButtons from "./ActionButtons.vue"

const props = defineProps<{
  pinned: TabItem[]
  open: TabItem[]
  closed: ClosedTabItem[]
  query: string
  customTags: string[]
}>()
const emit = defineEmits<{
  activate: [id: number]; restore: [url: string]
  later: [id: number]; close: [id: number]; copy: [url: string]
  updateTags: [id: number, tags: string[]]; addTag: [tag: string]
}>()

function escHtml(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") }
function hl(text: string) {
  if (!props.query) return escHtml(text)
  const q = props.query.toLowerCase()
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return escHtml(text)
  return escHtml(text.slice(0, idx)) + `<mark style="background:#fef08a;color:#111;border-radius:2px;font-style:normal;">${escHtml(text.slice(idx, idx + props.query.length))}</mark>` + escHtml(text.slice(idx + props.query.length))
}
</script>
