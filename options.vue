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

      <!-- 运行日志 -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300">运行日志</h2>
          <div class="flex items-center gap-2">
            <select v-model="logFilter" class="text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800">
              <option value="all">全部</option>
              <option value="error">仅错误</option>
              <option value="warn">警告+错误</option>
            </select>
            <button class="text-xs px-2.5 py-1 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700" :disabled="!logs.length" @click="onCopyLogs">{{ copied ? '已复制 ✓' : '复制全部' }}</button>
            <button class="text-xs px-2.5 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30 disabled:opacity-40" :disabled="!logs.length" @click="onClearLogs">{{ confirmClear ? '确认清空？' : '清空日志' }}</button>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <p class="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            记录插件运行中的错误和关键操作，仅保存在本机（最多 300 条，自动顶出旧的）。遇到问题可「复制全部」发给开发者排查。
          </p>
          <div v-if="!filteredLogs.length" class="px-5 py-8 text-center text-xs text-gray-400">暂无日志</div>
          <div v-else class="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-700/50">
            <div v-for="(l, i) in filteredLogs" :key="i" class="px-5 py-2 flex items-start gap-2 text-xs">
              <span :class="['shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full', l.level === 'error' ? 'bg-red-500' : l.level === 'warn' ? 'bg-amber-500' : 'bg-gray-300']"></span>
              <span class="shrink-0 text-gray-400 tabular-nums">{{ fmtTime(l.t) }}</span>
              <span class="shrink-0 text-gray-400">[{{ l.scope }}]</span>
              <span class="flex-1 min-w-0 break-words" :class="l.level === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'">
                {{ l.msg }}<span v-if="l.detail" class="block text-gray-400 break-all">{{ l.detail }}</span>
              </span>
            </div>
          </div>
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
import { Sliders, Cloud, Camera, LogIn } from "@lucide/vue"
import { useSettings } from "~composables/useSettings"
import { useLogger } from "~composables/useLogger"

const { settings, updateSetting } = useSettings()
const { logs, clearLogs } = useLogger()

// 运行日志：筛选 / 清空(二次确认) / 复制
const logFilter = ref<"all" | "warn" | "error">("all")
const confirmClear = ref(false)
const copied = ref(false)
const filteredLogs = computed(() => {
  if (logFilter.value === "all") return logs.value
  if (logFilter.value === "error") return logs.value.filter(l => l.level === "error")
  return logs.value.filter(l => l.level === "error" || l.level === "warn")
})
const fmtTime = (t: number) => {
  try {
    const d = new Date(t)
    const p = (n: number) => String(n).padStart(2, "0")
    return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
  } catch { return "" }
}
const onClearLogs = async () => {
  if (!confirmClear.value) { confirmClear.value = true; setTimeout(() => (confirmClear.value = false), 3000); return }
  confirmClear.value = false
  await clearLogs()
}
const onCopyLogs = async () => {
  try {
    const text = logs.value.map(l => `${fmtTime(l.t)} [${l.level}] [${l.scope}] ${l.msg}${l.detail ? " | " + l.detail : ""}`).join("\n")
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch { /* 剪贴板不可用时静默 */ }
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
</style>
