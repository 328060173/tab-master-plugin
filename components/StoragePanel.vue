<template>
  <div class="fixed inset-0 z-[100] bg-black/30" @click="emit('close')"></div>
  <div class="fixed inset-x-3 top-14 bottom-4 z-[100] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
      <h2 class="text-sm font-semibold">存储空间使用情况</h2>
      <button class="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100" @click="emit('close')"><X :size="16" /></button>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2">
      <div class="text-xs text-gray-400 mb-3">数据存储在本机（chrome.storage.local 与浏览器 localStorage），不上传云端。会话级数据（标签切换历史、聚焦状态）关闭浏览器自动清除，不在此列出。</div>

      <!-- 用户数据 -->
      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1">用户数据</p>
      <div v-for="item in userItems" :key="item.key" class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50">
        <span class="text-base shrink-0">{{ item.icon }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800">{{ item.label }}</p>
          <p class="text-[11px] text-gray-400">{{ item.count }} 条  ·  {{ item.size }}</p>
        </div>
        <button class="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1 rounded transition-colors shrink-0" @click="confirmClear(item)">清理</button>
      </div>

      <!-- 系统数据 -->
      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1 pt-1">系统数据</p>
      <div v-for="item in sysItems" :key="item.key" class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50">
        <span class="text-base shrink-0">{{ item.icon }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-800">{{ item.label }}</p>
          <p class="text-[11px] text-gray-400">{{ item.count }} 条  ·  {{ item.size }}</p>
        </div>
        <button class="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1 rounded transition-colors shrink-0" @click="confirmClear(item)">清理</button>
      </div>

      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
        <span class="text-xs font-medium text-blue-700">合计使用</span>
        <span class="text-xs font-bold text-blue-700">{{ totalSize }}</span>
      </div>
    </div>

    <!-- 底部：清空所有缓存 -->
    <div class="px-4 py-3 border-t border-gray-100 shrink-0">
      <button class="w-full py-2 text-xs text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5" @click="confirmClearAll = true">
        <Trash2 :size="12" />清空所有缓存，重新打开
      </button>
    </div>

    <!-- 单项清理确认 -->
    <div v-if="confirming" class="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-[100]">
      <p class="text-sm font-semibold text-gray-800 mb-2">⚠️ 确认清理「{{ confirming.label }}」</p>
      <p class="text-xs text-red-600 bg-red-50 rounded p-2 mb-4 leading-relaxed">{{ confirming.warning }}</p>
      <div class="flex gap-2 justify-end">
        <button class="px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50" @click="confirming = null">取消</button>
        <button class="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600" @click="doClear">确认清理</button>
      </div>
    </div>

    <!-- 清空所有确认 -->
    <div v-if="confirmClearAll" class="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-[100]">
      <p class="text-sm font-semibold text-gray-800 mb-2">⚠️ 清空所有缓存？</p>
      <p class="text-xs text-red-600 bg-red-50 rounded p-2 mb-4 leading-relaxed">将清除全部本地数据（稍后列表、标记、编号、打开时间、搜索历史等），操作不可恢复，清空后自动重新打开插件。</p>
      <div class="flex gap-2 justify-end">
        <button class="px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50" @click="confirmClearAll = false">取消</button>
        <button class="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600" @click="doClearAll">清空并重新打开</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { X, Trash2 } from "@lucide/vue"

const emit = defineEmits(["close", "cleared"])

/**
 * 存储占用面板 —— 必须与代码真实写入的 key 一一对应（不少/不多/不错）。
 * 持久化存储两处：
 *  - chrome.storage.local：业务数据 + 系统数据
 *  - window.localStorage：搜索历史(tabmaster_search_history)、视图模式(viewMode)
 * 会话存储 chrome.storage.session（tabSwitchHistory/tabSwitchIndex/focusState）关浏览器即清，不计入。
 */
interface StorageDef {
  key: string                 // 唯一 id（多 key 项用合成 id，如 __guides__）
  label: string
  icon: string
  warning: string
  storage: "local" | "ls"     // chrome.storage.local 或 window.localStorage
  keys?: string[]             // 多 key 项的真实 key 列表（默认 [key]）
  empty?: "array" | "object"  // local 单 key 清空后重置成的空值
}
type StorageItem = StorageDef & { count: number; size: string }

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
  { key: "laterTabs",      label: "稍后处理列表",   icon: "🕐", storage: "local", empty: "array",  warning: "会清空所有稍后处理的标签记录，操作不可恢复。" },
  { key: "customTags",     label: "自定义标记",     icon: "🏷️", storage: "local", empty: "array",  warning: "会清空所有自定义标记，同时清除所有标签页上绑定的标记，操作不可恢复。" },
  { key: "tabTagsMap",     label: "标签标记映射",   icon: "🗂️", storage: "local", empty: "object", warning: "会清空标签页与标记的绑定关系，但不删除标记名称本身。" },
  { key: "recentlyClosed", label: "关闭历史",       icon: "📋", storage: "local", empty: "array",  warning: "会清空所有最近关闭的标签页记录。" },
  { key: "tabmaster_search_history", label: "搜索历史", icon: "🔍", storage: "ls", warning: "会清空所有搜索历史记录。" },
  { key: "tabMasterBackupCache", label: "标签备份缓存", icon: "🛡️", storage: "local", empty: "array", warning: "会清空所有本地备份快照（含标记/分组等元数据快照），不可恢复。" },
]
// 系统数据：插件自动生成、清理会重置相关行为
const SYS_DEFS: StorageDef[] = [
  { key: "tabNumberMap",      label: "快捷键编号",       icon: "🔢", storage: "local", empty: "object", warning: "会清空所有自定义编号，Alt+数字 快捷键将全部失效。" },
  { key: "tabOpenedAtMap",    label: "标签打开时间",     icon: "🕒", storage: "local", empty: "object", warning: "会清空记录的标签打开时间，时间排序将以重置后的加载时间为准。" },
  { key: "tabLastAccessedMap",label: "标签最近访问时间", icon: "⏱️", storage: "local", empty: "object", warning: "会清空记录的最近访问时间，「检测长期未使用」会以重置后的时间为准。" },
  { key: "treeParentMap",     label: "树形父子关系",     icon: "🌲", storage: "local", empty: "object", warning: "会清空树形视图中的父子层级关系。" },
  { key: "tabMasterSettings", label: "界面设置",         icon: "⚙️", storage: "local", empty: "object", warning: "会把主题/字号/密度/默认视图等设置重置为默认值。" },
  { key: "tabMasterLogs",     label: "运行日志",         icon: "📜", storage: "local", empty: "array",  warning: "会清空所有运行日志（也可在「运行日志」页清空）。" },
  { key: "__guides__",        label: "功能引导记录",     icon: "💡", storage: "local", keys: ["tabGroupsGuideShown", "treeGuideShown", "focusModeShown"], warning: "清空后，分组 / 树形 / 聚焦模式的首次引导会再次出现。" },
  { key: "tagSelectMode",     label: "标记筛选模式",     icon: "🔘", storage: "local", warning: "会把标记筛选模式重置为默认「单选」。" },
  { key: "viewMode",          label: "视图模式",         icon: "🖼️", storage: "ls", warning: "会清空记住的视图模式，下次打开恢复默认列表视图。" },
  { key: "tabMasterBannerState", label: "登录引导记录",  icon: "🔔", storage: "local", warning: "清空后，登录引导 Banner 会重新显示。" },
  { key: "tabMasterVersionCheck", label: "版本检查记录",  icon: "🔄", storage: "local", warning: "清空后，版本横幅的关闭记录会丢失，已关闭的非强制更新横幅可能再次出现。" },
  { key: "tabMasterVersionCache", label: "版本信息缓存",  icon: "📦", storage: "local", empty: "object", warning: "清空后，版本更新横幅会暂时消失，下次后台同步后恢复。" },
  { key: "tabMasterAdState", label: "广告展示记录",  icon: "📢", storage: "local", warning: "清空后，广告展示计数会重置。" },
  { key: "tabMasterAdCache", label: "广告素材缓存",  icon: "🖼️", storage: "local", empty: "object", warning: "清空后，广告会暂时显示内置占位内容，下次后台同步后恢复。" },
  { key: "tabMasterNoticeCache", label: "通知列表缓存",  icon: "📋", storage: "local", empty: "object", warning: "清空后，通知条会暂时消失，下次后台同步后恢复。" },
  { key: "tabMasterNoticeRead", label: "通知已读记录",  icon: "📨", storage: "local", warning: "清空后，已读记录会丢失，已读过的通知会重新展示。" },
  { key: "tabMasterSettingMenuCache", label: "更多菜单缓存",  icon: "📑", storage: "local", empty: "object", warning: "清空后，设置菜单「更多」组会暂时显示内置默认项，下次后台同步后恢复。" },
  { key: "tabMasterSkinTryon", label: "道具试穿态", icon: "⏳", storage: "local", empty: "object", warning: "会立即结束当前试穿（如有），并清除试穿临时数据。不影响已购道具的使用中态。" },
  { key: "tabMasterBackupState", label: "备份运行状态", icon: "📊", storage: "local", empty: "object", warning: "会清空备份服务的运行状态（上次备份时间/快照数/缓存大小），不影响快照本身。" },
  { key: "tabMasterBackupSettings", label: "备份设置", icon: "🛡️", storage: "local", empty: "object", warning: "会把备份设置重置为默认（总开关关闭、定时 5 分钟、保留 7 天等）。" },
  { key: "tabMasterDeviceId", label: "设备标识", icon: "🆔", storage: "local", warning: "会清除本机设备标识，下次备份时自动重新生成。不影响已有快照。" },
  { key: "tabMasterBackupNoticeAcked", label: "备份告知确认", icon: "📌", storage: "local", empty: "boolean", warning: "会清除首次开启备份的知悉确认状态，下次开启时再次弹窗。" },
  { key: "tabMasterBackupDirMeta", label: "备份目录元信息", icon: "📁", storage: "local", empty: "object", warning: "会清除用户目录备份的元信息（目录名/大小缓存/权限状态）。下次打开管理页会重新读取。" },
  { key: "tabMasterBackupUndo", label: "备份撤销窗口", icon: "↩️", storage: "local", empty: "object", warning: "会清除恢复前快照（30s 撤销窗口），无法再撤销上次恢复。" },
  { key: "tabMasterBackupLive", label: "自动监听活档", icon: "🔴", storage: "local", empty: "object", warning: "会清空当前会话的实时活档（不影响已封存的历史备份）。" },
  { key: "tabMasterBackupLivePendingArchive", label: "待封存活档", icon: "📦", storage: "local", empty: "object", warning: "会清空上次启动封存失败遗留的待封存活档（昨晚标签数据，清后无法恢复）。仅在封存失败时存在。" },
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
  totalSize.value = fmtBytes(total)
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
  await chrome.storage.local.clear()
  localStorage.clear()
  window.location.reload()
}

onMounted(loadData)
</script>
