/**
 * 备份规则常量 + 文案模板集中登记（阿里规约：禁魔法值 / 复用抽离）。
 *
 * 现状规则数值原散落：types/backup.ts BACKUP_LIMITS + 各组件硬编码文案
 * （"100 条""20 条""200 标签""7 天""30 MB"等）。本文件统一收口：
 * - BACKUP_RULES：以 getter 读 currentLimits()，会员档切换时自动取新值
 * - getRetentionPolicyText / getManualPolicyText / getOverflowText：
 *   保留策略摘要文案，各组件共用，改规则改一处
 *
 * 守红线：
 * - 不引入新依赖
 * - 数值单一来源 currentLimits()（types/backup.ts），本文件只做派生 + 文案
 * - 文案不含技术黑话（§2 术语）
 */

import { currentLimits } from "~types/backup"
import { tWithParams } from "~lib/i18n"

/**
 * 备份规则派生常量（getter 读 currentLimits()，会员档切换自动生效）。
 * 各组件引用 BACKUP_RULES.xxx，禁硬编码 100/20/200/7 等魔法值。
 */
export const BACKUP_RULES = {
  /** 自动备份保留条数上限 */
  get maxSnapshots(): number {
    return currentLimits().autoMaxSnapshots
  },
  /** 单次备份标签上限 */
  get maxTabsPerSnapshot(): number {
    return currentLimits().maxTabsPerSnapshot
  },
  /** 手动备份条数上限 */
  get manualMaxSnapshots(): number {
    return currentLimits().manualMaxSnapshots
  },
  /** 保留天数 */
  get retentionDays(): number {
    return currentLimits().retentionDays
  },
  /** 缓存配额 MB */
  get cacheQuotaMb(): number {
    return Math.round(currentLimits().cacheQuotaBytes / 1024 / 1024)
  },
  /**
   * 估算占用 MB：
   * 单条备份 ≈ maxTabsPerSnapshot 标签 × (url+title+指纹等约 400B) ≈ 80KB
   * 自动保留条数 × 80KB → MB；至少 1MB
   */
  get estimateMb(): number {
    const mb =
      (this.maxSnapshots * this.maxTabsPerSnapshot * 400) / 1024 / 1024
    return Math.max(1, Math.round(mb * 10) / 10)
  },
} as const

/**
 * 保留策略摘要文案（自动备份设置弹框 / 帮助文档共用）。
 * i18n：模板 + tWithParams 占位（当前无消费者，预 i18n 备用）。
 */
export function getRetentionPolicyText(): string {
  return tWithParams('backup.rules.retention', {
    max: BACKUP_RULES.maxSnapshots,
    tabs: BACKUP_RULES.maxTabsPerSnapshot,
    estimate: BACKUP_RULES.estimateMb,
    quota: BACKUP_RULES.cacheQuotaMb,
  })
}

/** 手动备份策略文案 */
export function getManualPolicyText(): string {
  return tWithParams('backup.rules.manual', { max: BACKUP_RULES.manualMaxSnapshots })
}

/** 超限清理文案 */
export function getOverflowText(): string {
  return tWithParams('backup.rules.overflow', { max: BACKUP_RULES.maxSnapshots })
}
