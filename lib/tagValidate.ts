/**
 * 标记名称统一校验（所有添加标记入口共用，避免各写各的）。
 *
 * 与 useTabManager.addCustomTag 底层校验保持一致：trim + 空 + 15字 + 15个上限 + 重复。
 * 底层 addCustomTag 仍会再兜底校验一次（防止绕过），这里做前端即时反馈。
 */

import { t, tWithParams } from "./i18n"

export const TAG_MAX_COUNT = 15
export const TAG_MAX_LENGTH = 15

export type TagValidateResult =
  | { ok: true; name: string }
  | { ok: false; reason: "empty" | "too_long" | "duplicate" | "limit_reached" }

/**
 * 校验标记名称是否可添加。
 * @param raw 用户输入的原始名称
 * @param existingTags 现有标记列表
 */
export function validateTag(raw: string, existingTags: string[]): TagValidateResult {
  const name = raw.trim()
  if (!name) return { ok: false, reason: "empty" }
  if (name.length > TAG_MAX_LENGTH) return { ok: false, reason: "too_long" }
  if (existingTags.length >= TAG_MAX_COUNT) return { ok: false, reason: "limit_reached" }
  if (existingTags.includes(name)) return { ok: false, reason: "duplicate" }
  return { ok: true, name }
}

/**
 * 校验失败对应的用户可读提示。
 *
 * 实现说明（2026-08-05 i18n-en-support §6.1）：
 * - 用对象 getter 在每次读取时调 t()/tWithParams()，从而读取当时 currentLocale 的翻译。
 * - 调用方（TagPicker.vue / TagSelectPopover.vue 等）在事件处理里读 `TAG_INVALID_MSG[r.reason]`，
 *   getter 即时求值，自然反映最新 locale，无需改动 .vue 调用方。
 * - 历史 LogEntry 不追溯翻译（写入时即固化文案），符合"日志不可变"语义。
 */
export const TAG_INVALID_MSG: Record<Exclude<TagValidateResult, { ok: true }>["reason"], string> = {
  get empty() {
    return t("tag.error.empty")
  },
  get too_long() {
    return tWithParams("tag.error.tooLong", { max: TAG_MAX_LENGTH })
  },
  get duplicate() {
    return t("tag.error.duplicate")
  },
  get limit_reached() {
    return tWithParams("tag.error.limitReached", { max: TAG_MAX_COUNT })
  },
}
