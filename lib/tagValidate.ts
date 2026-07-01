/**
 * 标记名称统一校验（所有添加标记入口共用，避免各写各的）。
 *
 * 与 useTabManager.addCustomTag 底层校验保持一致：trim + 空 + 15字 + 15个上限 + 重复。
 * 底层 addCustomTag 仍会再兜底校验一次（防止绕过），这里做前端即时反馈。
 */

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

/** 校验失败对应的用户可读提示 */
export const TAG_INVALID_MSG: Record<Exclude<TagValidateResult, { ok: true }>["reason"], string> = {
  empty: "标记名不能为空",
  too_long: `标记名不能超过 ${TAG_MAX_LENGTH} 字`,
  duplicate: "该标记已存在",
  limit_reached: `已达 ${TAG_MAX_COUNT} 个标记上限`,
}
