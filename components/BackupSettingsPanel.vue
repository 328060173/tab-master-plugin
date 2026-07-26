<template>
  <!--
    Tab4 设置 - PRD §4.1 / §4.7 / §H
    单根。主内容：备份总开关 + 当前状态行；次要：详细参数折叠/小字区。
  -->
  <div class="space-y-4">
    <!-- 【主】总开关 + 当前状态行 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">备份总开关</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300 mt-0.5">
            <template v-if="settings.enabled">
              已开启 · 每 {{ settings.timerMinutes > 0 ? settings.timerMinutes + ' 分钟' : '已关闭定时' }}
              <template v-if="state.lastBackupAt"> · 上次 {{ fmtRel(state.lastBackupAt) }}</template>
            </template>
            <template v-else>未开启。开启后浏览器崩溃/重启/卸载后可恢复标签数据。</template>
          </p>
        </div>
        <button
          :class="[
            'relative w-11 h-6 rounded-full transition-colors shrink-0',
            settings.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          ]"
          @click="onToggleEnabled"
        >
          <span
            class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
            :class="settings.enabled ? 'translate-x-5' : ''"
          ></span>
        </button>
      </div>
    </div>

    <!-- 本地缓存 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div class="flex items-center gap-3 mb-3">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">本地缓存</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300">缓存到 chrome.storage.local（默认 5MB，受 10MB 硬限约束）</p>
        </div>
        <button
          :class="[
            'relative w-11 h-6 rounded-full transition-colors shrink-0',
            settings.cacheEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          ]"
          @click="onUpdate({ cacheEnabled: !settings.cacheEnabled })"
        >
          <span
            class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
            :class="settings.cacheEnabled ? 'translate-x-5' : ''"
          ></span>
        </button>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="text-gray-500 dark:text-gray-500 dark:text-gray-300 shrink-0">配额上限</span>
        <select
          :value="settings.cacheQuotaBytes"
          class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800"
          @change="onSelectNum($event, 'cacheQuotaBytes')"
        >
          <option :value="1 * 1024 * 1024">1 MB</option>
          <option :value="2 * 1024 * 1024">2 MB</option>
          <option :value="3 * 1024 * 1024">3 MB</option>
          <option :value="5 * 1024 * 1024">5 MB（默认）</option>
        </select>
        <span class="text-gray-500 dark:text-gray-300 ml-auto">{{ fmtBytes(state.cacheBytes) }} / {{ fmtBytes(settings.cacheQuotaBytes) }}</span>
      </div>
    </div>

    <!-- 用户目录 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div class="flex items-center gap-3 mb-3">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
            用户目录备份
            <span v-if="!fsSupported" class="text-xs text-gray-500 dark:text-gray-300" title="当前浏览器不支持">不支持</span>
          </p>
          <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300">额外写快照文件到用户指定目录（云同步友好）</p>
        </div>
        <button
          :disabled="!fsSupported"
          :class="[
            'relative w-11 h-6 rounded-full transition-colors shrink-0',
            settings.dirEnabled && fsSupported ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
            !fsSupported ? 'opacity-50 cursor-not-allowed' : ''
          ]"
          @click="onToggleDir"
        >
          <span
            class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
            :class="settings.dirEnabled && fsSupported ? 'translate-x-5' : ''"
          ></span>
        </button>
      </div>
      <!-- 当前目录信息 -->
      <div v-if="settings.dirEnabled" class="text-xs space-y-1.5">
        <p class="text-gray-600 dark:text-gray-300">
          当前目录：<span class="font-mono">{{ dirMeta.name || '未绑定' }}</span>
        </p>
        <p class="flex items-center gap-2">
          权限状态：
          <span :class="permClass">{{ permLabel }}</span>
          <button v-if="dirMeta.permission === 'prompt' || dirMeta.permission === 'denied'" class="text-[11px] text-blue-600 underline" @click="onReauth">重新授权</button>
          <button class="text-[11px] text-gray-500 underline ml-auto" @click="onPickDir">更换目录</button>
          <button class="text-[11px] text-red-500 underline" @click="onUnbindDir">解绑</button>
        </p>
        <p class="text-gray-500 dark:text-gray-300 text-[11px]">目录大小 {{ fmtBytes(dirMeta.dirBytes) }}（缓存 60s）</p>
      </div>
    </div>

    <!-- 定时频率 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">定时备份频率</p>
      <div class="flex items-center gap-2 text-xs">
        <select
          :value="settings.timerMinutes"
          class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800"
          @change="onSelectNum($event, 'timerMinutes')"
        >
          <option :value="0">关闭定时</option>
          <option :value="1">1 分钟</option>
          <option :value="3">3 分钟</option>
          <option :value="5">5 分钟（默认）</option>
          <option :value="10">10 分钟</option>
          <option :value="30">30 分钟</option>
        </select>
        <span class="text-gray-500 dark:text-gray-300">对齐 Tab Session Manager，本地不耗云带宽，更密</span>
      </div>
    </div>

    <!-- 事件触发 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">事件触发策略</p>
      <div class="space-y-2 text-xs">
        <label class="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" :checked="settings.eventOnTabRemoved" @change="onUpdate({ eventOnTabRemoved: !settings.eventOnTabRemoved })" class="mt-0.5" />
          <div class="flex-1">
            <p class="text-gray-800 dark:text-gray-100">标签关闭后自动备份</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300">防抖 2s · 对齐 Session Buddy 事件监听 · 默认开</p>
          </div>
        </label>
        <label class="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" :checked="settings.eventOnWindowRemoved" @change="onUpdate({ eventOnWindowRemoved: !settings.eventOnWindowRemoved })" class="mt-0.5" />
          <div class="flex-1">
            <p class="text-gray-800 dark:text-gray-100">窗口关闭后自动备份</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300">对齐 Tab Session Manager · 默认开</p>
          </div>
        </label>
        <label class="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" :checked="settings.eventOnIdle" @change="onToggleIdle" class="mt-0.5" />
          <div class="flex-1">
            <p class="text-gray-800 dark:text-gray-100">浏览器空闲时备份</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300">避免与定时重复 · 省电可选替代定时 · 默认关（需 idle 权限）</p>
          </div>
        </label>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-300 mt-2">默认值参考 Session Buddy / Tab Session Manager 最佳实践</p>
    </div>

    <!-- 恢复行为 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">恢复行为</p>
      <label class="flex items-start gap-2 cursor-pointer text-xs">
        <input type="checkbox" :checked="settings.restoreMetaOnRestore" @change="onUpdate({ restoreMetaOnRestore: !settings.restoreMetaOnRestore })" class="mt-0.5" />
        <div class="flex-1">
          <p class="text-gray-800 dark:text-gray-100">恢复时同时恢复标记 / 稍后处理 / 分组 / 设置</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300">
            开启后恢复快照会把元数据一并写回（合并去重，不覆盖你现有的）；关闭则只恢复标签 URL，等同 OneTab 行为。默认开。
          </p>
        </div>
      </label>
    </div>

    <!-- 保留策略 -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">保留策略</p>
        <button class="text-gray-500 dark:text-gray-300 hover:text-blue-600 p-0.5" title="GFS 分层规则" @click="showGfsHelp = !showGfsHelp">
          <HelpCircle :size="12" />
        </button>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <select
          :value="settings.retentionDays"
          class="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800"
          @change="onSelectNum($event, 'retentionDays')"
        >
          <option :value="7">7 天（默认）</option>
          <option :value="14">14 天</option>
          <option :value="30">30 天</option>
          <option :value="90">90 天</option>
        </select>
        <span class="text-gray-500 dark:text-gray-300">下次清理生效</span>
      </div>
      <div v-if="showGfsHelp" class="mt-2 text-[11px] text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded p-2 leading-relaxed">
        GFS 分层保留规则：<br/>
        · 近 24h：每小时保留 1 个最新<br/>
        · 近 7 天：每天保留 1 个最新<br/>
        · 近 4 周：每周保留 1 个最新<br/>
        · 近 12 月：每月保留 1 个最新<br/>
        · 锁定的快照永不删
      </div>
    </div>

    <!-- 云同步入口（置灰） -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div class="flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">云同步</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300">多设备同步 · 端到端加密 · 90 天云归档</p>
        </div>
        <button
          class="text-xs px-3 py-1.5 rounded bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
          title="敬请期待 · Pro 功能 · 阶段二上线"
          @click="showCloudModal = true"
        >敬请期待 · Pro</button>
      </div>
    </div>

    <!-- 重置/清除所有备份 -->
    <div class="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p class="text-sm font-medium text-red-600 dark:text-red-400 mb-2">危险操作</p>
      <p class="text-[11px] text-gray-500 dark:text-gray-500 dark:text-gray-300 mb-3">清除所有本地备份快照 + 设置 + 目录绑定（此操作不可恢复，请谨慎）</p>
      <button
        class="text-xs px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30"
        @click="onClearAll"
      >{{ confirmClear ? '确认清除？（再点一次）' : '清除所有备份' }}</button>
    </div>

    <!-- 云同步说明 modal -->
    <Teleport to="body">
      <div v-if="showCloudModal" class="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" @click.self="showCloudModal = false">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-5">
          <h2 class="text-base font-semibold mb-2">云同步 · Pro 功能</h2>
          <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            云同步将在阶段二上线，提供：<br/>
            · 多设备同步（办公机+家用机共享工作上下文）<br/>
            · 端到端加密（保护浏览历史隐私）<br/>
            · 90 天云快照归档<br/>
            · 跨设备冲突解决界面<br/>
            <br/>
            本地所有功能（定时备份/恢复/导入导出/锁定/GFS 保留）当前免费使用，无需登录账号。
          </p>
          <div class="flex justify-end">
            <button class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700" @click="showCloudModal = false">知道了</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * Tab4 设置 - PRD §4.1 / §4.7 / §H
 * 总开关 + 详细参数（缓存/目录/定时/事件/保留/云同步/重置）。
 */
import { ref, computed } from "vue"
import { HelpCircle } from "@lucide/vue"
import { useBackupService } from "~composables/useBackupService"
import { showToast } from "~composables/useToast"
import type { BackupSettings } from "~types/backup"

const emit = defineEmits<{
  (e: "requestEnable"): void
}>()

const svc = useBackupService()
const { settings, state, dirMeta, fsSupported } = svc

const showGfsHelp = ref(false)
const showCloudModal = ref(false)
const confirmClear = ref(false)

async function onUpdate(patch: Partial<BackupSettings>) {
  await svc.updateSettings(patch)
  showToast("已保存")
}

async function onSelectNum(e: Event, key: keyof BackupSettings) {
  const v = Number((e.target as HTMLSelectElement).value)
  await onUpdate({ [key]: v } as Partial<BackupSettings>)
}

async function onToggleEnabled() {
  if (!settings.value.enabled) {
    // 开启：先弹首次告知
    emit("requestEnable")
    return
  }
  await svc.setEnabled(false)
  showToast("已暂停备份")
}

async function onToggleDir() {
  if (!fsSupported.value) {
    showToast("当前浏览器不支持目录备份")
    return
  }
  if (!settings.value.dirEnabled) {
    // 开启：必须选目录
    const r = await svc.pickDir()
    if (!r.ok) {
      showToast(r.error || "选择目录失败")
      return
    }
    await svc.updateSettings({ dirEnabled: true })
    showToast("目录已授权")
  } else {
    await svc.updateSettings({ dirEnabled: false })
    showToast("已关闭目录备份（handle 保留）")
  }
}

async function onPickDir() {
  const r = await svc.pickDir()
  showToast(r.ok ? "已更换目录" : r.error || "选择失败")
}

async function onReauth() {
  const r = await svc.reauthorizeDir()
  showToast(r.ok ? "已重新授权" : r.error || "授权失败")
}

async function onUnbindDir() {
  await svc.unbindDir()
  showToast("已解绑目录")
}

async function onToggleIdle() {
  if (!settings.value.eventOnIdle) {
    // 开启 idle：需 idle 可选权限
    try {
      if (typeof chrome.idle === "undefined") {
        // 申请权限
        const granted = await chrome.permissions.request({ permissions: ["idle"] })
        if (!granted) {
          showToast("需 idle 权限才能开启")
          return
        }
      }
      await onUpdate({ eventOnIdle: true })
    } catch (e) {
      showToast("申请 idle 权限失败")
    }
  } else {
    await onUpdate({ eventOnIdle: false })
  }
}

async function onClearAll() {
  if (!confirmClear.value) {
    confirmClear.value = true
    setTimeout(() => (confirmClear.value = false), 3000)
    return
  }
  confirmClear.value = false
  const ok = await svc.clearAllBackups()
  showToast(ok ? "已清除所有备份（此操作不可恢复）" : "清除失败")
}

const permLabel = computed(() => {
  switch (dirMeta.value.permission) {
    case "granted": return "已授权"
    case "prompt": return "需重新授权"
    case "denied": return "已拒绝"
    case "unsupported": return "不支持"
    default: return dirMeta.value.permission
  }
})
const permClass = computed(() => {
  switch (dirMeta.value.permission) {
    case "granted": return "text-green-600"
    case "prompt": return "text-amber-600"
    case "denied": return "text-red-600"
    default: return "text-gray-500"
  }
})

function fmtBytes(b: number) {
  if (!b || b < 1024) return `${b || 0} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}

function fmtRel(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60_000) return "刚刚"
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  return `${Math.floor(diff / 86_400_000)} 天前`
}
</script>
