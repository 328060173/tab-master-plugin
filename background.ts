/**
 * Tab Master Pro - Service Worker
 *
 * 职责（仅 SW 入口：监听器注册 + 顶层初始化，业务逻辑抽到 lib/ 下）：
 * 1. 设置 side panel 行为 + 卸载跳转
 * 2. 注册 onInstalled / onStartup / onMessage / onAlarm / tabs.* / storage.onChanged / commands.onCommand 监听器
 *    业务逻辑分别委托给：
 *    - lib/tabTracking.ts（tab 父子关系 + lastAccessed 兜底）
 *    - lib/swSync.ts（广告/版本/通知/设置菜单拉取 + 手动刷新 + 快捷键切标签）
 *    - lib/backup/swDispatch.ts（备份调度 + 消息路由）
 *
 * 兼容：Chrome 88+ / Edge 88+（参见 [[constraint-target-platforms]]）
 */

import { OFFICIAL_SITE_URL } from '~lib/api-config'
import { initSwBackupLock } from '~lib/backup/swBackup'
import { initTabMirror } from '~lib/backup/tabMirror'
import {
  archiveLiveOnStartup,
  ensureLiveBackupStarted,
  initLiveBackupController,
  scheduleLiveWrite,
  handleLiveBackupAlarm,
} from '~lib/backup/liveSnapshot'
import { BACKUP_ALARM_NAME } from '~types/backup'
import {
  handleBackupMessage,
  initBackupRecovery,
  triggerTimerBackup,
  ensureBackupAlarm,
} from '~lib/backup/swDispatch'
import type { BackupMessage, BackupResponse } from '~lib/backup/types'
import {
  loadMap,
  onTabCreated,
  onTabRemoved,
  onTabActivated,
  handleTabTrackingStorageChanged,
} from '~lib/tabTracking'
import {
  syncAll,
  ensureAllSyncAlarms,
  handleSyncAlarm,
  handleSyncMessage,
  handleTabSwitchCommand,
} from '~lib/swSync'

// ============ onInstalled：安装/更新 ============
chrome.runtime.onInstalled.addListener(async () => {
  // chrome.sidePanel 需 Chrome/Edge 114+（侧边栏核心形态，不支持则插件不可用）
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  // 卸载跳转官网卸载反馈页（setUninstallURL 是持久注册，安装/更新时设置一次即可）
  // URL 用 OFFICIAL_SITE_URL 常量拼接，dev/prod 自动切换；静默失败避免 reject 抛未捕获异常
  chrome.runtime.setUninstallURL(`${OFFICIAL_SITE_URL}/uninstall`).catch(() => {})
  await loadMap()
  // 清理过期备份锁（防历史残留死锁）
  void initSwBackupLock()
  // P0-4: 崩溃恢复 + 清过期审计/WAL
  void initBackupRecovery()
  // 广告/版本/通知/设置菜单初始化拉取（fire-and-forget，各模块独立，互不阻塞）
  syncAll('init')
})

// ============ onStartup：浏览器启动 ============
chrome.runtime.onStartup.addListener(async () => {
  await loadMap()
  // 清理过期备份锁（防 SW 异常崩溃后锁残留）
  void initSwBackupLock()
  // P0-4: 崩溃恢复 + 清过期审计/WAL（必须在触发新备份前跑）
  void initBackupRecovery()
  // 自动监听备份：封存上一会话活档为历史档（R4 顺序 + startupPhase guard）。
  // C1：archiveLiveOnStartup 入口置 startupPhase=true 防 archive 期间并发写；finally 置 false
  //   放行新写 + 触发首份活档写盘。P0-2：封存失败/异常时把 live 移到 livePendingArchive
  //   保留待下次启动重试，再清 live 放行——避免 finally 首份写覆盖昨晚活档（最严重丢数据）。
  //   顶层 ensureLiveBackupStarted 只初始化 cachedEnabled + recovery alarm，不写盘（避免竞态）。
  void archiveLiveOnStartup().then(() => {
    // 封存完成后确保 cachedEnabled 已初始化（幂等；top-level 已初始化过则 no-op）
    void ensureLiveBackupStarted()
  })
  // 浏览器重启：立即拉取广告/版本/通知/设置菜单（fire-and-forget）
  syncAll('init')
  // 不在 onStartup 触发启动备份（2026-07-28 用户决定）：每次开关浏览器都备份一次无意义，
  // 定时备份由 chrome.alarms 按用户设置间隔（timerMinutes）正常触发，启动后等间隔到点再备。
  // "开启自动备份时的第一次备份"走 UI 路径 svc.runBackup('auto.event.startup')，与此无关。
})

// ============ tabs 事件：持续维护父子关系 + lastAccessed ============
chrome.tabs.onCreated.addListener(onTabCreated)
chrome.tabs.onRemoved.addListener(onTabRemoved)
chrome.tabs.onActivated.addListener(onTabActivated)

// ============ 自动监听备份：活档监听器顶层同步注册（2026-07-30 重构，用户硬要求）============
// 旧方案依赖关浏览器瞬间 SW 自备份，MV3 SW 30s 休眠来不及写完 → 虚假功能（开 DevTools
// 能备、不开备不了）。新方案平时事件驱动持续落盘到 storage.local 活档，不依赖关浏览器事件。
// 详见 lib/backup/liveSnapshot.ts。
//
// 监听器必须在 background.ts 顶层同步注册（不套异步逻辑）——SW 唤醒冷启动时顶层同步代码
// 先跑，监听器瞬间就绪。旧实现把监听器放在 ensureLiveBackupStarted/startLiveBackup（async）
// 内部绑，SW 唤醒时 async 链路还没执行完事件就到达 → 监听器没绑 → 事件丢失（用户实测：
// 开开关后新增/关闭标签无活档写入日志）。顶层同步注册彻底解决唤醒竞态。
//
// MV3 重构 v3（2026-07-30，两模型一致建议 + 大模型审查 6 一致性修复）：事件入口不检查任何
// 内存 flag（Event driven，P1-4 删 cachedEnabled 短路），scheduleLiveWrite 总是调度防抖
// （纯 setTimeout 500ms）；开关校验交给 writeLiveSnapshot 内部 readBackupSettings。
// SW 休眠丢 setTimeout 时 5 分钟 recovery alarm 读 LiveBlob.dirty 兜底补写
// （Recovery instead of guarantee）。Promise queue 串行写替代互斥锁（markDirty 读改写也入队，
// P0-3 避免非原子 lost update）。startupPhase 默认 false（P0-1），仅 onStartup 入口置 true。
chrome.tabs.onCreated.addListener(() => scheduleLiveWrite())
// onUpdated：只关心 url 变化或加载完成，过滤 loading/favicon/audible 等高频无效触发（降 80% IO）
chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    scheduleLiveWrite()
  }
})
// onRemoved：关标签触发活档写入。
// P1-5（v3）：删除 isWindowClosing 过滤——关单个窗口（不关浏览器）时该窗口标签的
//   onRemoved(isWindowClosing=true) 被过滤会丢事件，若之后 SW 崩该窗口关闭事件永远没进 live。
//   全量 query 反正拿真实状态，批量关 10 标签 500ms 防抖一次 query 成本低，所有 onRemoved 都触发。
chrome.tabs.onRemoved.addListener(() => {
  scheduleLiveWrite()
})
chrome.windows.onCreated.addListener(() => scheduleLiveWrite())
chrome.windows.onRemoved.addListener(() => scheduleLiveWrite())

// ============ onMessage：手动刷新 + backup: 路由 ============
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // P0-4: backup: 前缀消息走异步响应（return true 保持通道）
  const type = (msg as Record<string, unknown> | null)?.type
  if (typeof type === 'string' && type.startsWith('backup:')) {
    handleBackupMessage(msg as BackupMessage).then(sendResponse).catch((e) =>
      sendResponse({ ok: false, error: String(e), traceId: (msg as { traceId?: string }).traceId || '' } as BackupResponse)
    )
    return true // 异步响应必须 return true
  }
  // 同步类消息（manualRefreshAll）：同步处理，无响应
  handleSyncMessage(msg)
  return false
})

// ============ storage.onChanged：同步 SW 内存（外部清空/写入时） ============
chrome.storage.onChanged.addListener(handleTabTrackingStorageChanged)

// ============ onAlarm：按 alarm.name 分发（同步闹钟 + 备份闹钟 + 活档 recovery 闹钟） ============
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // 活档 recovery 闹钟（LIVE_RECOVERY_ALARM_NAME）：SW 休眠丢 setTimeout timer 时，
  // 每 5 分钟读持久化 dirty 标志，若 true 则补写一次（Recovery instead of guarantee）。
  // 优先处理（与同步类/定时备份闹钟互斥，name 不同不冲突）。
  if (handleLiveBackupAlarm(alarm)) return
  // 同步类闹钟（广告/版本/通知/设置菜单）
  if (await handleSyncAlarm(alarm)) return
  // 备份定时触发：广播给 UI 侧单例服务执行（SW 无 vue 实例）
  // 注意：SW 30s 重启会丢内存态，备份服务在 UI 侧；这里 sendMessage 触发
  if (alarm.name === BACKUP_ALARM_NAME) {
    void triggerTimerBackup()
  }
})

// ============ commands：快捷键切换标签 1-4 ============
chrome.commands.onCommand.addListener(handleTabSwitchCommand)

// ============ SW 启动兜底初始化 ============
// SW 在没有任何事件的初始化路径上也需要拿到 map（如热重载后第一个事件触发前）
void loadMap()
// SW 启动时全量灌入标签镜像（tabTracking 业务使用，不参与活档——活档用全量 chrome.tabs.query）
// SW 30s 寿命，重启后镜像丢失，每次启动都重新灌入；监听器随 SW 销毁需重绑
void initTabMirror()
// 自动监听备份：SW 重启后初始化开关缓存 + recovery alarm（P0-1 v3 已删 2s startupPhase 兜底）
//   （不封存——封存只在 onStartup 浏览器启动时做；不立即写盘避免与 onStartup archive 并发竞态）。
//   浏览器启动首份活档由 onStartup 路径的 archive.finally 触发；SW 运行中重启事件来了直接写
//   （startupPhase 默认 false 不拦，不丢数据）。
void ensureLiveBackupStarted()
// 注册 settings 变更监听（用户切开关时 SW 立即 start/stop 活档，幂等）
initLiveBackupController()
// SW 每次启动（含从 idle 唤醒）时确保四个同步闹钟存在，不触发拉取
// 参考 alarms.md 官方建议：important alarms should be ensured each time SW starts
ensureAllSyncAlarms()
// 备份定时闹钟（若用户已开启备份）
void ensureBackupAlarm()
