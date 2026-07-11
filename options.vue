<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <!-- 顶部条 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <Sliders :size="18" class="text-blue-600 dark:text-blue-400" />
        <h1 class="text-base font-semibold">标签大师 · 设置</h1>
        <span class="text-xs text-gray-400 ml-auto">v{{ version }}</span>
      </div>
    </header>

    <main class="max-w-3xl mx-auto p-6 space-y-8">
      <!-- 显示偏好 -->
      <section>
        <h2 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">显示偏好</h2>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
          <!-- 默认视图 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium">默认视图</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">新开侧边栏时默认的标签列表样式</p>
            </div>
            <div class="flex gap-1.5 shrink-0">
              <button
                v-for="v in viewOptions" :key="v.value"
                @click="updateSetting('defaultView', v.value)"
                :class="optBtnCls(settings.defaultView === v.value)"
              >{{ v.label }}</button>
            </div>
          </div>

          <!-- 默认排序 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium">默认排序</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">列表中标签的默认排列方式</p>
            </div>
            <div class="flex gap-1.5 shrink-0">
              <button
                v-for="s in sortOptions" :key="s.value"
                @click="updateSetting('defaultSort', s.value)"
                :class="optBtnCls(settings.defaultSort === s.value)"
              >{{ s.label }}</button>
            </div>
          </div>

          <!-- 卡片密度 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium">卡片密度</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">标签卡片的紧凑程度</p>
            </div>
            <div class="flex gap-1.5 shrink-0">
              <button
                v-for="d in densityOptions" :key="d.value"
                @click="updateSetting('cardDensity', d.value)"
                :class="optBtnCls(settings.cardDensity === d.value)"
              >{{ d.label }}</button>
            </div>
          </div>

          <!-- 字体族 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium">字体族</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">界面字体选择</p>
            </div>
            <div class="flex gap-1.5 shrink-0">
              <button
                v-for="f in fontFamilyOptions" :key="f.value"
                @click="updateSetting('fontFamily', f.value)"
                :class="optBtnCls(settings.fontFamily === f.value)"
              >{{ f.label }}</button>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-2">💡 主题与字号在侧边栏右上角设置菜单中调整</p>
      </section>

      <!-- 后端能力（占位） -->
      <section>
        <h2 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">账号 / 同步</h2>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
          <div v-for="item in disabledItems" :key="item.label" class="px-5 py-4 flex items-center justify-between gap-4 opacity-60">
            <div>
              <p class="text-sm font-medium flex items-center gap-1.5">
                <component :is="item.icon" :size="14" />{{ item.label }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ item.desc }}</p>
            </div>
            <span class="text-xs text-gray-400 shrink-0">敬请期待</span>
          </div>
        </div>
      </section>

      <!-- 更多设置 -->
      <section>
        <h2 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">更多设置</h2>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-700">
          <!-- 自动数据校正 -->
          <div class="px-5 py-4 flex items-center justify-between gap-4">
            <div class="flex items-start gap-1.5">
              <div>
                <p class="text-sm font-medium flex items-center gap-1.5">
                  自动数据校正
                  <button type="button" class="help-trigger" @click="showReconcileHelp = !showReconcileHelp" aria-label="了解自动数据校正">
                    <HelpCircle :size="14" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </button>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">定期同步标签列表与浏览器实际状态</p>
              </div>
            </div>
            <!-- toggle 开关 -->
            <button
              type="button"
              role="switch"
              :aria-checked="settings.autoReconcile"
              @click="toggleAutoReconcile"
              :class="toggleCls(settings.autoReconcile)"
            >
              <span :class="toggleKnobCls(settings.autoReconcile)"></span>
            </button>
          </div>
        </div>

        <!-- 问号弹窗（点击问号图标切换显示） -->
        <div v-if="showReconcileHelp" class="mt-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
          <p class="font-medium text-blue-700 dark:text-blue-300 mb-2">自动数据校正</p>
          <p class="mb-2">由于网络环境、计算机运行不稳定或浏览器自身机制，标签列表可能偶尔与实际状态不一致。</p>
          <p class="mb-2">开启后，每 60 秒自动校正一次，保证列表始终准确反映浏览器真实标签。</p>
          <p>校正仅读取本地数据，不联网、不消耗流量，推荐保持开启。</p>
        </div>
      </section>

      <!-- 关于 -->
      <section>
        <h2 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">关于</h2>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-5 py-4 space-y-2">
          <p class="text-sm">标签大师 <span class="text-gray-500">v{{ version }}</span></p>
          <p class="text-xs text-gray-500 dark:text-gray-400">帮你高效管理浏览器标签页</p>
          <div class="flex gap-3 text-xs pt-1">
            <a href="https://github.com" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>
            <a href="https://github.com" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">反馈建议</a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 标签大师完整设置页 —— Plasmo 自动注册为 options_page
 *
 * 设计取舍：
 * - 主题/字号已在 sidepanel 顶部菜单内嵌可调；本页只放需要更宽空间的"显示偏好"
 * - 与 sidepanel 共享 useSettings()（module-scope ref），改完立即生效
 * - 不要再加 SettingsDialog —— 用户明确要求"不要弹窗套弹窗"
 *
 * 触发方式：sidepanel HeaderMenu "设置..." → chrome.runtime.openOptionsPage()
 */
import { computed, ref } from "vue"
import { Sliders, Cloud, Camera, LogIn, HelpCircle } from "@lucide/vue"
import { useSettings } from "~composables/useSettings"

const { settings, updateSetting } = useSettings()
const showReconcileHelp = ref(false)

// [调试] 自动数据校正开关点击日志（验证开关生效）
const toggleAutoReconcile = () => {
  const oldVal = settings.value.autoReconcile
  const newVal = !oldVal
  console.log('[tab-master:settings] 点击自动数据校正开关', { 旧值: oldVal, 新值: newVal })
  updateSetting('autoReconcile', newVal)
}

const viewOptions = [
  { value: 'tile' as const, label: '平铺' },
  { value: 'list' as const, label: '列表' },
  { value: 'icon' as const, label: '图标' },
  { value: 'tree' as const, label: '树形' },
]
const sortOptions = [
  { value: 'domain' as const, label: '按域名' },
  { value: 'time-asc' as const, label: '时间正序' },
  { value: 'time-desc' as const, label: '时间倒序' },
]
const densityOptions = [
  { value: 'compact' as const, label: '紧凑' },
  { value: 'normal' as const, label: '标准' },
  { value: 'loose' as const, label: '宽松' },
]
const fontFamilyOptions = [
  { value: 'system' as const, label: '系统默认' },
  { value: 'mono' as const, label: '等宽' },
]
const disabledItems = [
  { icon: LogIn, label: '登录账号', desc: '云端同步个人设置' },
  { icon: Cloud, label: '云同步', desc: '多设备同步标签与稍后处理' },
  { icon: Camera, label: '快照', desc: '保存当前会话以便恢复' },
]

const version = computed(() => {
  try { return chrome.runtime.getManifest().version } catch { return '0.0.1' }
})

// 统一的选项按钮 class
const optBtnCls = (active: boolean) => [
  'px-3 py-1.5 text-xs rounded border transition-colors',
  active
    ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300'
    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700',
]
// 切换开关 class
const toggleCls = (on: boolean) => [
  'relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors',
  on ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
]
const toggleKnobCls = (on: boolean) => [
  'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform translate-y-0.5',
  on ? 'translate-x-4' : 'translate-x-0.5'
]
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

/* 与 sidepanel 同步的字号/暗色规则（让 options 也响应同一份 settings） */
:root.fs-normal  { font-size: 16px; }
:root.fs-large   { font-size: 17.5px; }
:root.fs-xlarge  { font-size: 19px; }
:root.font-mono body { font-family: 'SF Mono', 'Cascadia Code', Consolas, Monaco, monospace; }
.help-trigger { background: transparent; border: none; padding: 0; cursor: help; display: inline-flex; }
</style>
