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
import { BACKUP_ALARM_NAME } from '~types/backup'
import {
  handleBackupMessage,
  initBackupRecovery,
  triggerTimerBackup,
  triggerStartupBackup,
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
  // 浏览器重启：立即拉取广告/版本/通知/设置菜单（fire-and-forget）
  syncAll('init')
  // 备份：onStartup 时触发一次启动备份（PRD §B），走 SW 串行队列
  void triggerStartupBackup()
})

// ============ tabs 事件：持续维护父子关系 + lastAccessed ============
chrome.tabs.onCreated.addListener(onTabCreated)
chrome.tabs.onRemoved.addListener(onTabRemoved)
chrome.tabs.onActivated.addListener(onTabActivated)

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

// ============ onAlarm：按 alarm.name 分发（同步闹钟 + 备份闹钟） ============
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // 同步类闹钟（广告/版本/通知/设置菜单）优先处理
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
// SW 每次启动（含从 idle 唤醒）时确保四个同步闹钟存在，不触发拉取
// 参考 alarms.md 官方建议：important alarms should be ensured each time SW starts
ensureAllSyncAlarms()
// 备份定时闹钟（若用户已开启备份）
void ensureBackupAlarm()
