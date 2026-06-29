<template>
  <Teleport to="body">
    <template v-if="tab">
      <div class="fixed inset-0 z-[109]" @click="emit('close')" @contextmenu.prevent="emit('close')" />
      <div ref="menuRef" class="fixed z-[110] bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-52 text-xs select-none"
        :style="{ left: `${pos.x}px`, top: `${pos.y}px` }">
        <button :class="btn" @click="act('refresh')"><RefreshCw :size="12" />刷新</button>
        <button :class="btn" @click="act('duplicate')"><Copy :size="12" />复制标签页</button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('pin')"><Pin :size="12" />{{ tab.pinned ? '取消固定标签页' : '固定标签页' }}</button>
        <button :class="btn" @click="act('mute')">
          <component :is="tab.muted ? Volume2 : VolumeX" :size="12" />{{ tab.muted ? '取消静音' : '使标签页静音' }}
        </button>
        <hr class="my-1 border-gray-100" />
        <!-- 移到分组子菜单 -->
        <div v-if="SUPPORTS_TAB_GROUPS" class="relative group/submenu">
          <button :class="btn" @click="">
            <FolderPlus :size="12" />移到分组
            <ChevronRight :size="12" class="ml-auto" />
          </button>
          <div class="absolute left-full top-0 ml-0.5 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-48 hidden group-hover/submenu:block">
            <button :class="btn" @click="act('newGroup')"><FolderPlus :size="12" />新建分组...</button>
            <hr v-if="groups.length" class="my-1 border-gray-100" />
            <button v-for="g in groups" :key="g.id" :class="btn" @click="act('addToGroup', g.id)">
              <span :class="[colorClass(g.color), 'w-3 h-3 rounded-full']"></span>
              {{ g.title || '未命名分组' }}
            </button>
            <hr v-if="tab.groupId !== TAB_GROUP_ID_NONE" class="my-1 border-gray-100" />
            <button v-if="tab.groupId !== TAB_GROUP_ID_NONE"
                    :class="[btn, 'text-red-600 hover:!bg-red-50']"
                    @click="act('removeFromGroup')">
              <FolderMinus :size="12" />移出分组
            </button>
          </div>
        </div>
        <button v-else :class="btn" @click="act('group')"><FolderPlus :size="12" />添加到新组</button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('tag')"><Tag :size="12" />添加标记</button>
        <button :class="btn" @click="act('setNumber')"><Hash :size="12" />设置快捷键编号</button>
        <button :class="btn" @click="act('later')"><Clock :size="12" />稍后处理</button>
        <hr class="my-1 border-gray-100" />
        <!-- 批量选择入口：让用户从单条右键快速进入批量模式 -->
        <button :class="btn" @click="act('selectThis')"><CheckSquare :size="12" />选择此标签</button>
        <button :class="btn" @click="act('selectSameDomain')"><CheckSquare :size="12" />选择同域名标签</button>
        <button v-if="tab.groupId !== TAB_GROUP_ID_NONE" :class="btn" @click="act('selectSameGroup')"><CheckSquare :size="12" />选择同分组标签</button>
        <button :class="btn" @click="act('selectAllVisible')"><CheckSquare :size="12" />全选可见标签</button>
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
import { ref, watch, nextTick, inject } from "vue"
import { RefreshCw, Copy, Pin, Volume2, VolumeX, FolderPlus, FolderMinus, Tag, Clock, Link, X, Hash, ChevronRight, CheckSquare } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import { SUPPORTS_TAB_GROUPS, GROUP_COLOR_CLASSES, TAB_GROUP_ID_NONE } from "~composables/useTabGroups"

const props = defineProps<{ tab: TabItem | null; x: number; y: number }>()
const emit = defineEmits<{ action: [string, any?]; close: [] }>()

const btn = "flex items-center gap-2 w-full px-3 py-1.5 hover:bg-gray-50 text-left text-gray-700"
const menuRef = ref<HTMLElement>()
const pos = ref({ x: 0, y: 0 })

// 注入分组列表
const groups = inject<chrome.tabGroups.TabGroup[]>("tabGroups", [])

const colorClass = (color: string) => {
  return GROUP_COLOR_CLASSES[color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
}

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

const act = (action: string, data?: any) => { emit('action', action, data); emit('close') }
</script>
