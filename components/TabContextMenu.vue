<template>
  <Teleport to="body">
    <template v-if="tab">
      <div class="fixed inset-0 z-[9998]" @click="emit('close')" @contextmenu.prevent="emit('close')" />
      <div ref="menuRef" class="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-52 text-xs select-none"
        :style="{ left: `${pos.x}px`, top: `${pos.y}px` }">
        <button :class="btn" @click="act('refresh')"><RefreshCw :size="12" />刷新</button>
        <button :class="btn" @click="act('duplicate')"><Copy :size="12" />复制标签页</button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('pin')"><Pin :size="12" />{{ tab.pinned ? '取消固定标签页' : '固定标签页' }}</button>
        <button :class="btn" @click="act('mute')">
          <component :is="tab.muted ? Volume2 : VolumeX" :size="12" />{{ tab.muted ? '取消静音' : '使标签页静音' }}
        </button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('group')"><FolderPlus :size="12" />添加到新组</button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('tag')"><Tag :size="12" />添加标记</button>
        <button :class="btn" @click="act('later')"><Clock :size="12" />稍后处理</button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('copyUrl')"><Link :size="12" />复制 URL</button>
        <hr class="my-1 border-gray-100" />
        <button :class="[btn, 'text-red-600 hover:!bg-red-50']" @click="act('close')"><X :size="12" />关闭标签页</button>
        <button :class="[btn, 'text-red-600 hover:!bg-red-50']" @click="act('closeOthers')"><X :size="12" />关闭其他标签页</button>
      </div>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue"
import { RefreshCw, Copy, Pin, Volume2, VolumeX, FolderPlus, Tag, Clock, Link, X } from "@lucide/vue"
import type { TabItem } from "~types/tab"

const props = defineProps<{ tab: TabItem | null; x: number; y: number }>()
const emit = defineEmits<{ action: [string]; close: [] }>()

const btn = "flex items-center gap-2 w-full px-3 py-1.5 hover:bg-gray-50 text-left text-gray-700"
const menuRef = ref<HTMLElement>()
const pos = ref({ x: 0, y: 0 })

watch([() => props.tab, () => props.x, () => props.y], async () => {
  if (!props.tab) return
  await nextTick()
  if (!menuRef.value) return
  const w = menuRef.value.offsetWidth, h = menuRef.value.offsetHeight
  pos.value = {
    x: Math.min(props.x, window.innerWidth - w - 4),
    y: Math.min(props.y, window.innerHeight - h - 4),
  }
})

const act = (action: string) => { emit('action', action); emit('close') }
</script>
