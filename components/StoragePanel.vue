<template>
  <div class="fixed inset-0 z-[100] bg-black/30" @click="emit('close')"></div>
  <div class="fixed inset-x-3 top-14 bottom-4 z-[100] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
      <h2 class="text-sm font-semibold">{{ t('panel.storage.title') }}</h2>
      <button class="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100" @click="emit('close')"><X :size="16" /></button>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      <div class="text-xs text-gray-400 mb-3">{{ t('panel.storage.intro') }}</div>

      <!-- 用户数据 -->
      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1">{{ t('panel.storage.userData') }}</p>
      <div v-for="item in userItems" :key="item.key" class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50">
        <span class="text-base shrink-0">{{ item.icon }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800">{{ storageLabel(item) }}</p>
          <p class="text-[11px] text-gray-400">{{ tWithParams('panel.storage.countSize', { count: item.count, size: item.size }) }}</p>
        </div>
        <button class="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1 rounded transition-colors shrink-0" @click="confirmClear(item)">{{ t('panel.storage.clearItem') }}</button>
      </div>

      <!-- 系统数据 -->
      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1 pt-1">{{ t('panel.storage.systemData') }}</p>
      <div v-for="item in sysItems" :key="item.key" class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50">
        <span class="text-base shrink-0">{{ item.icon }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800">{{ storageLabel(item) }}</p>
          <p class="text-[11px] text-gray-400">{{ tWithParams('panel.storage.countSize', { count: item.count, size: item.size }) }}</p>
        </div>
        <button class="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1 rounded transition-colors shrink-0" @click="confirmClear(item)">{{ t('panel.storage.clearItem') }}</button>
      </div>

      <div class="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 space-y-0.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-blue-700">{{ t('panel.storage.totalUsed') }}</span>
          <span class="text-xs font-bold text-blue-700">{{ totalSize }}</span>
        </div>
        <p class="text-[10px] text-blue-500/80 leading-tight">{{ t('panel.storage.totalHint') }}</p>
      </div>
    </div>

    <!-- 底部：清空所有缓存 -->
    <div class="px-4 py-3 border-t border-gray-100 shrink-0">
      <button class="w-full py-2 text-xs text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5" @click="confirmClearAll = true">
        <Trash2 :size="12" />{{ t('panel.storage.clearAllButton') }}
      </button>
    </div>

    <!-- 单项清理确认 -->
    <div v-if="confirming" class="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-[100]">
      <p class="text-sm font-semibold text-gray-800 mb-2">{{ tWithParams('panel.storage.confirmClearTitle', { name: storageLabel(confirming) }) }}</p>
      <p class="text-xs text-red-600 bg-red-50 rounded p-2 mb-4 leading-relaxed">{{ storageWarning(confirming) }}</p>
      <div class="flex gap-2 justify-end">
        <button class="px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50" @click="confirming = null">{{ t('common.cancel') }}</button>
        <button class="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600" @click="doClear">{{ t('panel.storage.confirmClearButton') }}</button>
      </div>
    </div>

    <!-- 清空所有确认 -->
    <div v-if="confirmClearAll" class="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-[100]">
      <p class="text-sm font-semibold text-gray-800 mb-2">{{ t('panel.storage.clearAllTitle') }}</p>
      <p class="text-xs text-red-600 bg-red-50 rounded p-2 mb-4 leading-relaxed">{{ t('panel.storage.clearAllMessage') }}</p>
      <div class="flex gap-2 justify-end">
        <button class="px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50" @click="confirmClearAll = false">{{ t('common.cancel') }}</button>
        <button class="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600" @click="doClearAll">{{ t('panel.storage.clearAllConfirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { X, Trash2 } from "@lucide/vue"
import { t, tWithParams } from "~lib/i18n"
import { clearAllSnapshots } from "~lib/backup/snapshotStore"

const emit = defineEmits(["close", "cleared"])

/**
 * 存储占用面板 —— 必须与代码真实写入的 key 一一对应（不少/不多/不错）。
 * 持久化存储两处：
 *  - chrome.storage.local：业务数据 + 系统数据
 *  - window.localStorage：搜索历史(tabmaster_search_history)、视图模式(viewMode)
 * 会话存储 chrome.storage.session（tabSwitchHistory/tabSwitchIndex/focusState）关浏览器即清，不计入。
 */
interface StorageDef {
  key: string                 // 唯一 id（多 key 项用合成 id，如 __guides__）；同时用作 i18n key 后缀
  icon: string
  storage: "local" | "ls"     // chrome.storage.local 或 window.localStorage
  keys?: string[]             // 多 key 项的真实 key 列表（默认 [key]）
  empty?: "array" | "object"  // local 单 key 清空后重置成的空值
}
type StorageItem = StorageDef & { count: number; size: string }

// i18n key 命名规则：panel.storage.item.<defKey>.label / .warning
// defKey 含点号或冒号会破坏 key 结构，故用 sanitized 形式（去特殊字符）
const storageLabel = (d: StorageDef) => t(`panel.storage.item.${sanitizeItemKey(d.key)}.label`)
const storageWarning = (d: StorageDef) => t(`panel.storage.item.${sanitizeItemKey(d.key)}.warning`)
function sanitizeItemKey(k: string): string {
  // tabmaster_search_history → tabmaster_search_history（下划线保留）
  // tabMasterBackupLivePendingArchive → tabMasterBackupLivePendingArchive（驼峰保留）
  // 仅排除 i18n key 分隔符 '.'，本项目现有 key 均不含点号，原样返回
  return k.replace(/\./g, '_')
}

const userItems = ref<StorageItem[]>([])
const sysItems = ref<StorageItem[]>([])
const totalSize = ref("0 B")
const confirming = ref<StorageItem | null>(null)
const confirmClearAll = ref(false)

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(2)} MB`
}
function sizeOf(val: unknown) { return new Blob([JSON.stringify(val ?? null)]).size }

// 用户数据：用户主动产生、清理有明确语义
const USER_DEFS: StorageDef[] = [
  { key: "laterTabs",      icon: "🕐", storage: "local", empty: "array" },
  { key: "customTags",     icon: "🏷️", storage: "local", empty: "array" },
  { key: "tabTagsMap",     icon: "🗂️", storage: "local", empty: "object" },
  { key: "recentlyClosed", icon: "📋", storage: "local", empty: "array" },
  { key: "tabmaster_search_history", icon: "🔍", storage: "ls" },
  { key: "tabMasterBackupCache", icon: "🛡️", storage: "local", empty: "array" },
]
// 系统数据：插件自动生成、清理会重置相关行为
const SYS_DEFS: StorageDef[] = [
  { key: "tabNumberMap",      icon: "🔢", storage: "local", empty: "object" },
  { key: "tabOpenedAtMap",    icon: "🕒", storage: "local", empty: "object" },
  { key: "tabLastAccessedMap",icon: "⏱️", storage: "local", empty: "object" },
  { key: "treeParentMap",     icon: "🌲", storage: "local", empty: "object" },
  { key: "tabMasterSettings", icon: "⚙️", storage: "local", empty: "object" },
  { key: "tabMasterLogs",     icon: "📜", storage: "local", empty: "array" },
  { key: "__guides__",        icon: "💡", storage: "local", keys: ["tabGroupsGuideShown", "treeGuideShown", "focusModeShown"] },
  { key: "tagSelectMode",     icon: "🔘", storage: "local" },
  { key: "viewMode",          icon: "🖼️", storage: "ls" },
  { key: "tabMasterBannerState", icon: "🔔", storage: "local" },
  { key: "tabMasterVersionCheck", icon: "🔄", storage: "local" },
  { key: "tabMasterVersionCache", icon: "📦", storage: "local", empty: "object" },
  { key: "tabMasterAdState", icon: "📢", storage: "local" },
  { key: "tabMasterAdCache", icon: "🖼️", storage: "local", empty: "object" },
  { key: "tabMasterNoticeCache", icon: "📋", storage: "local", empty: "object" },
  { key: "tabMasterNoticeRead", icon: "📨", storage: "local" },
  { key: "tabMasterSettingMenuCache", icon: "📑", storage: "local", empty: "object" },
  { key: "tabMasterSkinTryon", icon: "⏳", storage: "local", empty: "object" },
  { key: "tabMasterBackupState", icon: "📊", storage: "local", empty: "object" },
  { key: "tabMasterBackupSettings", icon: "🛡️", storage: "local", empty: "object" },
  { key: "tabMasterDeviceId", icon: "🆔", storage: "local" },
  { key: "tabMasterBackupNoticeAcked", icon: "📌", storage: "local", empty: "boolean" },
  { key: "tabMasterBackupDirMeta", icon: "📁", storage: "local", empty: "object" },
  { key: "tabMasterBackupUndo", icon: "↩️", storage: "local", empty: "object" },
  { key: "tabMasterBackupLive", icon: "🔴", storage: "local", empty: "object" },
  { key: "tabMasterBackupLivePendingArchive", icon: "📦", storage: "local", empty: "object" },
  // 注：装扮相关动态 key（按账号隔离，不在此静态表展示）：
  //   - `tabMasterSkinActive:{customerId}` 已购道具「使用中」态（头像框 + 背景图/纯色 + bgType）
  //   - `tabMasterSkinOpacity:{customerId}` 背景透明度（用户手动调，按 id 隔离）
  // 如需清理可用「清空所有存储」或浏览器扩展存储管理。
]

const loadData = async () => {
  const localKeys = [...USER_DEFS, ...SYS_DEFS]
    .filter(d => d.storage === "local")
    .flatMap(d => d.keys ?? [d.key])
  const data = await chrome.storage.local.get(localKeys)
  let total = 0

  const build = (defs: StorageDef[]): StorageItem[] => defs.map(d => {
    let count = 0
    let sz = 0
    if (d.storage === "ls") {
      const raw = localStorage.getItem(d.key)
      if (d.key === "tabmaster_search_history") {
        let arr: unknown[] = []
        try { arr = JSON.parse(raw || "[]") } catch {}
        count = Array.isArray(arr) ? arr.length : 0
        sz = sizeOf(arr)
      } else {
        count = raw ? 1 : 0
        sz = sizeOf(raw || "")
      }
    } else if (d.keys) {
      // 多 key 合并项（功能引导记录）：count = 已置位的数量
      const obj: Record<string, unknown> = {}
      for (const k of d.keys) { obj[k] = data[k]; if (data[k]) count++ }
      sz = sizeOf(obj)
    } else {
      const val = data[d.key] ?? (d.empty === "array" ? [] : {})
      count = Array.isArray(val) ? val.length : (val && typeof val === "object" ? Object.keys(val).length : 0)
      sz = sizeOf(val)
    }
    total += sz
    return { ...d, count, size: fmtBytes(sz) }
  })

  userItems.value = build(USER_DEFS)
  sysItems.value = build(SYS_DEFS)
  // 「合计使用」用浏览器原生 estimate()（O(1，不遍历），它是整个扩展源（origin）的已用字节，
  // 天然包含 IndexedDB 备份快照（手动/自动/封存档）+ storage.local + localStorage + cache API 等，
  // 是浏览器自己的账，最准、不漂移。替代上面手动累加（手动累加漏了 IndexedDB 主体）。
  // 注：estimate() 返回的是全源总量，不等于上面各项 sizeOf 之和（多了 IndexedDB + cache），
  // 因此「合计使用」不等于分项相加——这是预期行为，UI 文案已标明含 IndexedDB。
  // estimate() 可能不可用（旧浏览器/隐私模式），失败则降级回上面的手动累加 total。
  try {
    const est = await navigator.storage.estimate()
    totalSize.value = est.usage != null ? fmtBytes(est.usage) : fmtBytes(total)
  } catch {
    // estimate 不可用，降级手动累加（不含 IndexedDB）
    totalSize.value = fmtBytes(total)
  }
}

const confirmClear = (item: StorageItem) => { confirming.value = item }
const doClear = async () => {
  const d = confirming.value
  if (!d) return
  try {
    if (d.storage === "ls") {
      localStorage.removeItem(d.key)
    } else if (d.key === "__guides__") {
      await chrome.storage.local.remove(d.keys!)
    } else if (d.key === "customTags") {
      // 清标记同时清掉绑定映射，避免悬空引用
      await chrome.storage.local.set({ customTags: [], tabTagsMap: {} })
    } else {
      await chrome.storage.local.set({ [d.key]: d.empty === "array" ? [] : {} })
    }
  } catch (e) {
    console.warn("[tab-master] 清理存储失败", e)
  }
  confirming.value = null
  emit("cleared")
  await loadData()
}

const doClearAll = async () => {
  // 一并清除 IndexedDB 备份快照（手动/自动/封存档）——storage.local.clear 不影响 IndexedDB，
  // 不主动清会残留历史快照，与「清空所有缓存」语义不符（用户决策：一并清除）。
  try {
    await clearAllSnapshots()
  } catch (e) {
    console.warn("[tab-master] 清空 IndexedDB 备份快照失败", e)
  }
  await chrome.storage.local.clear()
  localStorage.clear()
  window.location.reload()
}

onMounted(loadData)
</script>
