/**
 * 标签会话备份 - 数据模型
 * PRD §5.1 实体定义。schemaVersion=1 为当前版本。
 *
 * 阶段一（本期）：
 * - 完整结构定义已就绪（含 signature/customer 等阶段二字段）
 * - 实际仅 manual source 写入缓存；auto/preRestore/import 留下阶段
 */

export type SnapshotSource =
  | 'auto.timer'
  | 'auto.event'
  | 'manual'
  | 'preRestore'
  | 'import'

export interface BackupCustomer {
  /** 后端 user.id；阶段一未登录为 null */
  id: number | null
  type: 'anonymous' | 'pro' | 'free'
}

export interface TabSnapshot {
  index: number
  url: string
  urlNormalized: string
  title: string
  /** 主指纹 sha1(urlNormalized + '|' + titleNorm) */
  fingerprint: string
  /** 弱指纹 sha1(host + path)，强匹配失败兜底 */
  fingerprintWeak: string
  pinned: boolean
  muted: boolean
  /** chrome tabGroups 组 ID（重启失效，恢复时按 groupSnapshot 重建） */
  groupId: number
  groupTitle: string | null
  groupColor: string | null
  /** opener 父子指纹（重启失效，按 fingerprint 重建） */
  openerTabFingerprint: string | null
  lastAccessed: number | null
  openedAt: number | null
}

export interface WindowSnapshot {
  /** 仅记录用，重启后失效 */
  windowId: number
  /** 窗口相对顺序（恢复时按此排序） */
  relativeIndex: number
  focused: boolean
  state: 'normal' | 'minimized' | 'maximized' | 'fullscreen' | string
  incognito: boolean
  tabs: TabSnapshot[]
}

export interface TabGroupSnapshot {
  title: string
  color: string
  collapsed: boolean
  /** 用 fingerprint 关联，不用 groupId（重启失效） */
  tabFingerprints: string[]
}

export interface LaterTabSnapshot {
  url: string
  urlNormalized: string
  title: string
  fingerprint: string
  addedAt: number
  note: string | null
}

export interface ClosedTabSnapshot {
  url: string
  fingerprint: string
  title: string
  closedAt: number
}

export interface SnapshotMeta {
  customTags: string[]
  /** key = fingerprint（不用 tabId） */
  tabTagsMap: Record<string, string[]>
  tabGroups: TabGroupSnapshot[]
  laterTabs: LaterTabSnapshot[]
  recentlyClosed: ClosedTabSnapshot[]
  /** tabMasterSettings 子集；用户可勾选是否备份设置 */
  settings: Record<string, unknown> | null
}

export interface SnapshotStats {
  tabCount: number
  windowCount: number
  pinnedCount: number
  groupCount: number
  taggedCount: number
  laterCount: number
}

export interface Snapshot {
  id: string
  createdAt: number
  createdAtISO: string
  source: SnapshotSource
  /** auto.* 必填；manual 为 null */
  trigger: string | null
  locked: boolean
  lockedReason: string | null
  label: string | null
  windows: WindowSnapshot[]
  meta: SnapshotMeta
  stats: SnapshotStats
}

export interface BackupSignature {
  /** 阶段二云同步用，阶段一为 null */
  algo: string | null
  value: string | null
}

export interface BackupFile {
  schemaVersion: 1
  appVersionCode: number
  appVersionName: string
  kind: 'tabmaster.backup.v1'
  deviceId: string
  customer: BackupCustomer
  snapshot: Snapshot
  signature: BackupSignature
}

/** 快照列表摘要（仅用于 UI 列表展示，非完整 BackupFile） */
export interface SnapshotSummary {
  id: string
  createdAt: number
  createdAtISO: string
  source: SnapshotSource
  trigger: string | null
  locked: boolean
  label: string | null
  stats: SnapshotStats
}

/** 备份服务运行状态（持久化到 tabMasterBackupState） */
export interface BackupState {
  lastBackupAt: number | null
  lastBackupSource: SnapshotSource | null
  lastBackupError: string | null
  snapshotCount: number
  cacheBytes: number
}

/** 备份设置（持久化到 tabMasterBackupSettings） */
export interface BackupSettings {
  /** 总开关。本期仅控制 UI 展示态，定时/事件留下阶段接入 */
  enabled: boolean
  /** 本地缓存开关（默认开） */
  cacheEnabled: boolean
  /** 用户目录备份开关（默认关） */
  dirEnabled: boolean
  /** 本地缓存配额上限（字节）。受 chrome.storage.local 10MB 硬限约束 */
  cacheQuotaBytes: number
  /** 本地缓存快照数上限。默认 50 */
  cacheMaxSnapshots: number
  /** 定时频率（分钟）。0=关闭。默认 5 */
  timerMinutes: number
  /** 保留天数。默认 7 */
  retentionDays: number
  eventOnTabRemoved: boolean
  eventOnWindowRemoved: boolean
  eventOnIdle: boolean
  /**
   * 恢复快照时是否同时恢复标记/稍后处理/设置/分组等元数据。
   * 默认开（用户硬要求第7条：标记/稍后处理等设置也要能存储导入导出 + 预留云同步）。
   * 关闭则只恢复 tab（URL 层面），不动元数据。
   */
  restoreMetaOnRestore: boolean
}

export const DEFAULT_BACKUP_SETTINGS: BackupSettings = {
  enabled: false,
  cacheEnabled: true,
  dirEnabled: false,
  cacheQuotaBytes: 5 * 1024 * 1024,
  cacheMaxSnapshots: 50,
  timerMinutes: 5,
  retentionDays: 7,
  eventOnTabRemoved: true,
  eventOnWindowRemoved: true,
  eventOnIdle: false,
  restoreMetaOnRestore: true,
}

export const DEFAULT_BACKUP_STATE: BackupState = {
  lastBackupAt: null,
  lastBackupSource: null,
  lastBackupError: null,
  snapshotCount: 0,
  cacheBytes: 0,
}

export const BACKUP_SCHEMA_VERSION = 1 as const
export const BACKUP_KIND = 'tabmaster.backup.v1' as const

/** storage key 常量集中登记，避免散落字符串 */
export const BACKUP_KEYS = {
  cache: 'tabMasterBackupCache',
  state: 'tabMasterBackupState',
  settings: 'tabMasterBackupSettings',
  deviceId: 'tabMasterDeviceId',
  noticeAck: 'tabMasterBackupNoticeAck',
  /** 用户目录元信息（handle 名/上次扫描大小/扫描时间），handle 本身在 IndexedDB */
  dirMeta: 'tabMasterBackupDirMeta',
  /** 恢复前快照 + 30s 撤销窗口信息 */
  undo: 'tabMasterBackupUndo',
  /**
   * 备份执行锁（防 SW/UI 同时备份）。
   * 值：{ at: number }。5 分钟超时自动清除（防死锁）。
   * 写入方：SW 裸备份路径 + UI runBackupPipeline；读取方：彼此互斥检查。
   */
  inProgress: 'tabMasterBackupInProgress',
} as const

/** 用户目录元信息（持久化到 storage.local；handle 本身存 IndexedDB） */
export interface BackupDirMeta {
  /** 目录名（showDirectoryPicker 返回的 handle.name） */
  name: string | null
  /** 上次扫描目录大小（字节，缓存 60s） */
  dirBytes: number
  /** 上次扫描时间戳 */
  scannedAt: number | null
  /** 权限状态：granted / prompt / denied / unsupported（无 File System Access API） */
  permission: 'granted' | 'prompt' | 'denied' | 'unsupported'
}

export const DEFAULT_BACKUP_DIR_META: BackupDirMeta = {
  name: null,
  dirBytes: 0,
  scannedAt: null,
  permission: 'unsupported',
}

/** 首次开启 5 条限制告知确认状态 */
export interface BackupNoticeAck {
  /** 每条逐项确认（5 条）；全部 true 才允许开启 */
  items: boolean[]
  /** 确认时间戳 */
  ackedAt: number | null
}

export const DEFAULT_BACKUP_NOTICE_ACK: BackupNoticeAck = {
  items: [false, false, false, false, false],
  ackedAt: null,
}

/** 恢复前快照 + 删除撤销窗口（持久化到 storage.local tabMasterBackupUndo） */
export interface BackupUndo {
  /** 恢复前快照（完整 BackupFile），用于一键撤销恢复 */
  preRestoreSnapshot: BackupFile | null
  /** 软删的快照（完整 BackupFile，30s 内可撤销删除，P1-1） */
  deletedSnapshot: BackupFile | null
  /** 创建时间戳（30s 后自动清除） */
  createdAt: number | null
}

export const DEFAULT_BACKUP_UNDO: BackupUndo = {
  preRestoreSnapshot: null,
  deletedSnapshot: null,
  createdAt: null,
}

/** 恢复方式（PRD §4.7.B 三选一，默认整体替换） */
export type RestoreMode = 'replace' | 'selected' | 'append'

/** 冲突项解决选择（每项 radio） */
export type ConflictChoice = 'snapshot' | 'current' | 'both'

/** 冲突项类型 */
export type ConflictKind = 'url_mismatch' | 'only_snapshot' | 'only_current' | 'tag_unmatched'

/** 单个冲突项 */
export interface ConflictItem {
  id: string
  kind: ConflictKind
  /** 推荐选择（高亮） */
  recommended: ConflictChoice
  /** 用户当前选择 */
  choice: ConflictChoice
  /** 描述（如窗口名 / 标记名 / URL 摘要） */
  label: string
  /** 详情：快照侧 */
  snapshotSide: string
  /** 详情：当前侧 */
  currentSide: string
}

/** fingerprint 未匹配项（手动指派） */
export interface FpUnmatchedItem {
  id: string
  /** 在快照里的描述（标记名/URL/title） */
  label: string
  /** 该项对应的快照 tab 强指纹（用于手动指派结果写回，P0-3） */
  fingerprint: string
  /** 强指纹命中候选 tabId（用于推荐） */
  strongHitTabId: number | null
  /** 候选 tab 列表（当前浏览器所有 tab） */
  candidates: { tabId: number; title: string; url: string }[]
  /** 用户选择：tabId（-1=跳过） */
  assignTo: number | null
}

/** 恢复预览结果 */
export interface RestorePreview {
  snapshotId: string
  tabCount: number
  windowCount: number
  incognitoWindowCount: number
  taggedCount: number
  conflicts: ConflictItem[]
  unmatched: FpUnmatchedItem[]
}

/** 导入解析结果（统一中间态） */
export interface ImportResult {
  ok: boolean
  /** 转换后的 BackupFile（ok=true 时有效） */
  file: BackupFile | null
  /** 解析失败原因（ok=false 时有效） */
  error: string | null
  /** 警告/降级信息（部分成功） */
  warnings: string[]
  /** 已跳过条目数 */
  skipped: number
  /** 解析出的格式 */
  format: 'ours' | 'onetab' | 'nicetab' | 'toby' | 'vertitab' | 'unknown'
}

/** 导出格式 */
export type ExportFormat = 'json' | 'markdown' | 'onetab'

/** 定时备份闹钟名（与 background.ts 协议） */
export const BACKUP_ALARM_NAME = 'tabMasterBackupTimer'

/** 备份触发来源（事件备份） */
export type BackupTriggerSource =
  | 'auto.timer'
  | 'auto.event.tabRemoved'
  | 'auto.event.windowRemoved'
  | 'auto.event.idle'
  | 'auto.event.startup'
  | 'manual'
