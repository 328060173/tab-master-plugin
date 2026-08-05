<template>
  <Teleport to="body">
    <template v-if="tab">
      <div class="fixed inset-0 z-[109]" @click="emit('close')" @contextmenu.prevent="emit('close')" />
      <div ref="menuRef" class="fixed z-[110] bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-[208px] text-xs select-none"
        :style="{ left: `${pos.x}px`, top: `${pos.y}px` }">
        <button :class="btn" @click="act('refresh')"><RefreshCw :size="12" />{{ t('common.refresh') }}</button>
        <button :class="btn" @click="act('duplicate')"><Copy :size="12" />{{ t('contextMenu.duplicate') }}</button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('pin')"><Pin :size="12" />{{ tab.pinned ? t('contextMenu.unpin') : t('contextMenu.pin') }}</button>
        <button :class="btn" @click="act('mute')">
          <component :is="tab.muted ? Volume2 : VolumeX" :size="12" />{{ tab.muted ? t('common.unmute') : t('common.mute') }}
        </button>
        <hr class="my-1 border-gray-100" />
        <!-- 移到分组子菜单 -->
        <div v-if="SUPPORTS_TAB_GROUPS" class="relative">
          <button :class="btn" @click="groupSubmenuOpen = !groupSubmenuOpen">
            <FolderPlus :size="12" />{{ t('contextMenu.moveToGroup') }}
            <ChevronRight :size="12" class="ml-auto" :class="groupSubmenuOpen ? 'rotate-90' : ''" />
          </button>
          <div
            v-if="groupSubmenuOpen"
            :class="[
              submenuOpensLeft ? 'right-full mr-0.5' : 'left-full ml-0.5',
              'absolute top-0 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-[192px]'
            ]"
          >
            <button :class="btn" @click="act('newGroup')"><FolderPlus :size="12" />{{ t('contextMenu.newGroup') }}</button>
            <hr v-if="groups.length" class="my-1 border-gray-100" />
            <button v-for="g in groups" :key="g.id"
              :class="[btn, tab.groupId === g.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : '']"
              @click="act('addToGroup', g.id)">
              <span :class="[colorClass(g.color), 'w-3 h-3 rounded-full']"></span>
              <span class="truncate" :title="g.title || t('common.untitledGroup')">{{ g.title || t('common.untitledGroup') }}</span>
              <Check v-if="tab.groupId === g.id" :size="12" class="ml-auto" />
            </button>
            <hr v-if="tab.groupId !== TAB_GROUP_ID_NONE" class="my-1 border-gray-100" />
            <button v-if="tab.groupId !== TAB_GROUP_ID_NONE"
                    :class="[btn, 'text-red-600 hover:!bg-red-50']"
                    @click="act('removeFromGroup')">
              <FolderMinus :size="12" />{{ t('contextMenu.removeFromGroup') }}
            </button>
          </div>
        </div>
        <button v-else :class="btn" @click="act('group')"><FolderPlus :size="12" />{{ t('contextMenu.addToNewGroup') }}</button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('tag')"><Tag :size="12" />{{ t('contextMenu.addTag') }}</button>
        <button :class="btn" @click="act('setNumber')"><Hash :size="12" />{{ t('contextMenu.setNumber') }}</button>
        <button :class="btn" @click="act('later')"><Clock :size="12" />{{ t('later.title') }}</button>
        <hr class="my-1 border-gray-100" />
        <!-- 批量选择入口：让用户从单条右键快速进入批量模式 -->
        <button :class="btn" @click="act('selectThis')"><CheckSquare :size="12" />{{ t('contextMenu.selectThis') }}</button>
        <button :class="btn" @click="act('selectSameDomain')"><CheckSquare :size="12" />{{ t('contextMenu.selectSameDomain') }}</button>
        <button v-if="tab.groupId !== TAB_GROUP_ID_NONE" :class="btn" @click="act('selectSameGroup')"><CheckSquare :size="12" />{{ t('contextMenu.selectSameGroup') }}</button>
        <button :class="btn" @click="act('selectAllVisible')"><CheckSquare :size="12" />{{ t('contextMenu.selectAllVisible') }}</button>
        <hr class="my-1 border-gray-100" />
        <button :class="btn" @click="act('copyUrl')"><Link :size="12" />{{ t('common.copyUrl') }}</button>
        <hr class="my-1 border-gray-100" />
        <button :class="[btn, 'text-red-600 hover:!bg-red-50']" @click="act('close')"><X :size="12" />{{ t('contextMenu.close') }}</button>
        <button :class="[btn, 'text-red-600 hover:!bg-red-50']" @click="act('closeOthers')"><X :size="12" />{{ t('contextMenu.closeOthers') }}</button>
      </div>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, inject } from "vue"
import { RefreshCw, Copy, Pin, Volume2, VolumeX, FolderPlus, FolderMinus, Tag, Clock, Link, X, Hash, ChevronRight, CheckSquare, Check } from "@lucide/vue"
import type { TabItem } from "~types/tab"
import { SUPPORTS_TAB_GROUPS, GROUP_COLOR_CLASSES, TAB_GROUP_ID_NONE } from "~composables/useTabGroups"
import { t } from "~lib/i18n"

const props = defineProps<{ tab: TabItem | null; x: number; y: number }>()
const emit = defineEmits<{ action: [string, any?]; close: [] }>()

const btn = "flex items-center gap-2 w-full px-3 py-1.5 hover:bg-gray-50 text-left text-gray-700"
const menuRef = ref<HTMLElement>()
const pos = ref({ x: 0, y: 0 })
// 二级子菜单（移到分组）向左还是向右弹：右键菜单常被 clamp 到面板右缘，
// 此时 left-full（向右）会冲出窄面板 → 改为 right-full（向左）
const submenuOpensLeft = ref(false)
const groupSubmenuOpen = ref(false)

// 注入分组列表
const groups = inject<chrome.tabGroups.TabGroup[]>("tabGroups", [])

const colorClass = (color: string) => {
  return GROUP_COLOR_CLASSES[color as keyof typeof GROUP_COLOR_CLASSES] || "bg-gray-400"
}

watch([() => props.tab, () => props.x, () => props.y], async () => {
  if (!props.tab) {
    groupSubmenuOpen.value = false
    return
  }
  // 每次打开右键菜单时重置子菜单状态
  groupSubmenuOpen.value = false
  await nextTick()
  if (!menuRef.value) return
  const w = menuRef.value.offsetWidth, h = menuRef.value.offsetHeight
  const x = Math.min(props.x, window.innerWidth - w - 4)
  pos.value = {
    x,
    y: Math.min(props.y, window.innerHeight - h - 4),
  }
  // 子菜单宽 w-48=192：右侧放不下就向左弹
  submenuOpensLeft.value = x + w + 192 > window.innerWidth - 4
})

const act = (action: string, data?: any) => { emit('action', action, data); emit('close') }
</script>
