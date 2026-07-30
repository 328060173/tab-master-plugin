/**
 * 备份 SW 调度层 - 抽离自 background.ts（红线 .ts ≤ 500）
 *
 * 职责：收口 Service Worker 上下文里所有备份相关调度逻辑，供 background.ts 调用：
 * 1. triggerTimerBackup —— 定时触发入口（onStartup 不再触发备份，2026-07-28 用户决定）
 * 2. enqueueBackupOperation + executeBackupOp —— SW 串行写入队列 + 协调入口（P0-4 调研方案1）
 * 3. handleBackupMessage —— UI → SW 消息路由
 * 4. initBackupRecovery —— SW 启动崩溃恢复（WAL 回滚 + 审计清理 + 旧缓存迁移）
 * 5. ensureBackupAlarm —— 确保 backup alarm 存在（按用户设置）
 *
 * 设计要点：
 * - 队列不存内存（SW 销毁后重建），靠 IndexedDB 事务 + WAL 落盘兜底
 * - runSwBareBackup 只构建快照文件 + 更新 state 元信息；快照真值落 IndexedDB 由
 *   runBackupWithCoordination（persistSnapshot）统一处理
 * - 锁协调 tryAcquireCoord（coordination 状态机）防 SW 与 UI 同时备份（5min 超时兜底）
 *
 * 兼容：Chrome 88+ / Edge 88+（参见 [[constraint-target-platforms]]）
 */

import { BACKUP_ALARM_NAME, type BackupSettings } from '~types/backup'
import { runSwBareBackup } from '~lib/backup/swBackup'
import { runBackupWithCoordination, listSnapshots } from '~lib/backup/coordination'
import { recoverFromWal, purgeOldWal } from '~lib/backup/wal'
import { purgeExpiredAudit, getRecentAuditLogs } from '~lib/backup/auditLog'
import { migrateStorageLocalToIndexedDb } from '~lib/backup/migration'
import { readBackupSettings } from '~lib/backup/settingsAccess'
import type { BackupMessage, BackupResponse, BackupOp, BackupOpPayload } from '~lib/backup/types'
import type { CoordinationResult } from '~lib/backup/coordination'

/** 队列单条操作返回结果（与原 enqueueBackupOperation 返回结构一致） */
interface QueueResult {
  ok: boolean
  error?: string
  conflict?: boolean
}

// ============ 备份定时触发（PRD §B）============
// 设计：定时备份由 SW 直接执行（runSwBareBackup），不依赖 UI 是否打开。
// 修复前：SW 只广播 backup:trigger 给 UI，UI 未挂载时定时备份丢失。
// 修复后：SW 在 service worker 上下文里读设置 → chrome.tabs.query → collectMeta →
//   buildSnapshot → 写 storage.local 缓存 → GFS 清理 → 更新 state；目录写降级跳过
//   （SW 无 window，File System Access API 不可用，记 lastBackupError="目录备份待UI侧补"，
//   下次 UI 打开走 runManualBackup 时会补写目录）。完成后广播 backup:done 给 UI 刷新状态。
// 锁协调：acquireBackupLock 防 SW 与 UI 同时备份（5min TTL 防死锁）。
// 2026-07-28：onStartup 不再触发启动备份（每次开关浏览器都备份无意义）；
//   定时备份由 chrome.alarms 按用户设置间隔正常触发。"开启自动备份时的第一次备份"
//   走 UI 路径 svc.runBackup('auto.event.startup')，与此处无关。

/** 定时备份入口（alarm 触发） */
export async function triggerTimerBackup(): Promise<void> {
  await enqueueBackupOperation('backup', { kind: 'auto-backup', source: 'auto.timer' })
}

// ============ P0-4 SW 串行写入队列 + 协调入口 ============
// 调研方案1：所有备份写操作收口到 SW 单 Promise 队列串行执行，0 竞态无死锁。
// 队列不存内存（SW 销毁后重建），靠 IndexedDB 事务 + WAL 落盘兜底。

let backupWriteQueue: Promise<unknown> = Promise.resolve()

/**
 * 备份执行函数（适配层）：把 op+payload 转为现有 runSwBareBackup 调用。
 * P0-4：runSwBareBackup 只构建快照文件 + 更新 state 元信息；快照真值落 IndexedDB
 * 由外层 runBackupWithCoordination（persistSnapshot）统一处理。
 */
async function executeBackupOp(
  op: BackupOp,
  payload: BackupOpPayload,
  _traceId: string
): Promise<CoordinationResult> {
  // backup 操作：调 runSwBareBackup（构建 file + 更新 state），返回 file 供 coordination 写 IndexedDB
  if (op === 'backup') {
    // M3：archive 透传已构建好的 file（活档封存），不重新采集，直接交 coordination 持久化
    if (payload.kind === 'archive') {
      return { ok: true, snapshot: payload.file }
    }
    const source = payload.kind === 'auto-backup' ? payload.source : 'manual'
    const r = await runSwBareBackup(source as Parameters<typeof runSwBareBackup>[0])
    if (!r.ok) return { ok: false, error: r.error || '备份失败' }
    // 把 file 透传给 coordination，由其 persistSnapshot + 校验 + 保留策略清理 + 广播
    return { ok: true, snapshot: r.file }
  }
  // restore/delete/import/clear/lock：这些目前由 UI 侧 useBackupService 直接处理（走消息后改造）
  // P0-4-7/8/9/10 将逐步把这些操作也收口到这里。本轮先返回 not-implemented。
  return { ok: false, error: `操作 ${op} 暂未收口到 SW 队列（P0-4-7+改造中）` }
}

/**
 * 从 storage.local 读取备份设置（M4：统一走 readBackupSettings + sanitizeSettings 校验，
 * 不再用浅合并，口径与 liveSnapshot/swBackup 一致）。
 */
async function loadBackupSettings(): Promise<BackupSettings> {
  return readBackupSettings()
}

/**
 * 入队一个备份操作（走协调入口 + 串行队列）。
 * 定时/启动/手动备份都调本函数。
 */
export async function enqueueBackupOperation(
  op: BackupOp,
  payload: BackupOpPayload
): Promise<QueueResult> {
  // 串行：下一个操作等当前完成。catch 吞错防队列中断。
  const result = (backupWriteQueue = backupWriteQueue.then(async () => {
    // 读设置供 coordination 做保留策略清理 + 上限裁剪
    const settings = await loadBackupSettings()
    return runBackupWithCoordination(op, payload, executeBackupOp, settings)
  }).catch((e) => ({ ok: false, error: e instanceof Error ? e.message : String(e) })))

  const r = await result as QueueResult
  return r
}

/**
 * SW 启动恢复：崩溃回滚未提交 + 清过期日志 + 清旧 WAL + 旧 storage.local cache 迁移。
 */
export async function initBackupRecovery(): Promise<void> {
  try {
    // 先迁移旧 storage.local cache → IndexedDB（在恢复前，让 recoverFromWal 能扫到完整快照）
    const migration = await migrateStorageLocalToIndexedDb()
    if (migration.migrated > 0) {
      console.warn(`[backup] 迁移 ${migration.migrated} 个旧快照到 IndexedDB`)
    }
    const rolledback = await recoverFromWal()
    if (rolledback.length) {
      console.warn(`[backup] 崩溃恢复：回滚 ${rolledback.length} 个未提交操作`)
      for (const e of rolledback) {
        chrome.runtime.sendMessage({
          type: 'backup:recovered',
          traceId: e.traceId,
          op: e.op,
        }).catch(() => {})
      }
    }
    await purgeExpiredAudit()
    await purgeOldWal()
  } catch (e) {
    console.warn('[backup] initBackupRecovery 失败', e)
  }
}

/**
 * 处理来自 UI（backup.vue/sidepanel）的备份消息。
 * 所有写操作走 enqueueBackupOperation 串行队列。
 */
export async function handleBackupMessage(msg: BackupMessage): Promise<BackupResponse> {
  const traceId = msg.traceId
  try {
    if (msg.type === 'backup:execute') {
      const r = await enqueueBackupOperation(msg.op, msg.payload)
      return { ok: r.ok, error: r.error, traceId, data: r.conflict ? { conflict: true } : undefined }
    }
    if (msg.type === 'backup:read-snapshots') {
      const snapshots = await listSnapshots()
      return { ok: true, traceId, data: snapshots }
    }
    if (msg.type === 'backup:read-audit') {
      const logs = await getRecentAuditLogs(msg.limit)
      return { ok: true, traceId, data: logs }
    }
    if (msg.type === 'backup:recover') {
      await initBackupRecovery()
      return { ok: true, traceId }
    }
    return { ok: false, error: '未知消息类型', traceId }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), traceId }
  }
}

/**
 * 确保 backup alarm 存在（不触发执行，仅当设置已开启）。
 * SW 重启后闹钟可能丢失，每次 SW 启动时调用一次兜底。
 */
export async function ensureBackupAlarm(): Promise<void> {
  try {
    const s = await loadBackupSettings()
    if (!s.enabled || s.timerMinutes <= 0) return
    const existing = await chrome.alarms.get(BACKUP_ALARM_NAME)
    if (existing && existing.periodInMinutes === s.timerMinutes) return
    await chrome.alarms.create(BACKUP_ALARM_NAME, {
      periodInMinutes: s.timerMinutes,
      delayInMinutes: s.timerMinutes,
    })
  } catch (e) {
    console.warn('[backup] ensureBackupAlarm 失败', e)
  }
}
