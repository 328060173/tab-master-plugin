<template>
  <!--
    导入管理菜单（§8.7，mysql 还原隐喻）。
    单根（外层 div），所有事件声明在 emits，无 fallthrough。
    直接用 ImportPanel（左右布局导入流程，OneTab 格式为主，paste 任意格式自动嗅探）。
    底部广告位（独立 ErrorBoundary 降级，崩不波及其它）。
  -->
  <div class="space-y-4">
    <ImportPanel
      :formats="FORMATS"
      :default-format="DEFAULT_FORMAT"
    />

    <!-- 底部广告位 728×90（独立 ErrorBoundary 降级） -->
    <ErrorBoundary scope="backup.ad.import">
      <AdSlot
        slot-id="backup-import-bottom"
        size="728x90"
        :ad="getAd('backup-import')"
        :dismissible="true"
        fallback="placeholder"
      />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
/**
 * 导入管理菜单（§8.7）。
 * 直接用 ImportPanel（OneTab 格式为主）+ 底部广告位。
 * ImportPanel 内部支持选文件/粘贴切换 + 左右布局预览 + 本窗口/新窗口打开。
 */
import ErrorBoundary from '~components/ErrorBoundary.vue';
import AdSlot from './AdSlot.vue';
import ImportPanel from './ImportPanel.vue';
import { useBackupPageAd } from '~composables/useBackupPageAd';

// 广告多槽位：取导入底位广告，adMap 由 backup.vue onMounted 单例 fetchAd 拉取
const { getAd } = useBackupPageAd();

// 格式选项：本插件数据 + OneTab（parseImport 按内容自动嗅探）
const FORMATS: { value: string; label: string }[] = [
  { value: 'ours', label: '本插件数据' },
  { value: 'onetab', label: 'OneTab' },
];
const DEFAULT_FORMAT = 'ours';
</script>
