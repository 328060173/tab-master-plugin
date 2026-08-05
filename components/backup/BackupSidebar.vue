<template>
  <!--
    左菜单（设计稿 §0 / §8.3：220px 3 项 + 底部推广位 160×60 可折叠）。
    单根（外层 aside），无 fallthrough。
    3 项：备份管理（默认）/ 云同步（开发中，催作者页）/ 导入管理。
    选中项高亮：蓝底 + 左 3px 蓝条。
  -->
  <aside class="w-[220px] shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
    <!-- 菜单项 -->
    <nav class="flex-1 py-2" :aria-label="t('backup.comp.sidebar.aria')">
      <button
        v-for="item in menuItems"
        :key="item.key"
        :class="[
          'relative w-full flex items-center gap-2 px-4 py-3.5 text-base transition-colors text-left',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
          activeKey === item.key
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50',
        ]"
        :aria-current="activeKey === item.key ? 'page' : undefined"
        :disabled="item.disabled"
        @click="onSelect(item.key)"
      >
        <!-- 选中态左 3px 蓝条 -->
        <span
          v-if="activeKey === item.key"
          class="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600"
          aria-hidden="true"
        ></span>
        <component :is="item.icon" :size="18" class="shrink-0" />
        <span class="flex-1 truncate">{{ item.label }}</span>
      </button>
    </nav>

    <!-- 底部推广位（§11 辅位，160×60，可折叠）。
         独立 ErrorBoundary 兜底：广告崩不波及左菜单。 -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-700">
      <ErrorBoundary scope="backup.ad.sidebar">
        <AdSlot
          slot-id="backup-sidebar-promo"
          size="160x60"
          :ad="getAd('backup-sidebar')"
          :dismissible="true"
          fallback="placeholder"
        />
      </ErrorBoundary>
    </div>
  </aside>
</template>

<script setup lang="ts">
/**
 * 左菜单（§8.3：4 项 + 底部推广位）。
 * 选中项通过 v-model 双向绑定（activeKey + update:activeKey）。
 * 广告数据来自 useBackupPageAd 单例（与概览 Tab 主位共享同一次请求）。
 */
import { Shield, Cloud, Download } from "@lucide/vue"
import { computed } from "vue"
import AdSlot from "./AdSlot.vue"
import ErrorBoundary from "~components/ErrorBoundary.vue"
import { useBackupPageAd } from "~composables/useBackupPageAd"
import { t } from "~lib/i18n"

// 广告多槽位：取左菜单辅位广告（backup-sidebar），adMap 由 backup.vue onMounted 单例 fetchAd 拉取
const { getAd } = useBackupPageAd()

export type BackupMenuKey = 'manage' | 'cloud' | 'import'

interface MenuItem {
  key: BackupMenuKey
  label: string
  icon: typeof Shield
  /** 禁用（无功能时不让点） */
  disabled?: boolean
}

// computed 让 label 响应 locale 切换（const 数组初始化时 t() 一次性求值，切语言不刷新）
const menuItems = computed<MenuItem[]>(() => [
  { key: 'manage', label: t('backup.comp.sidebar.manage'), icon: Shield },
  { key: 'cloud', label: t('backup.comp.sidebar.cloud'), icon: Cloud },
  { key: 'import', label: t('backup.comp.sidebar.import'), icon: Download },
])

defineProps<{ activeKey: BackupMenuKey }>()
const emit = defineEmits<{ (e: 'update:activeKey', key: BackupMenuKey): void }>()

function onSelect(key: BackupMenuKey) {
  emit('update:activeKey', key)
}
</script>
