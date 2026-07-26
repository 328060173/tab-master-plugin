/**
 * 文件完整性校验 - P0-4 L3
 *
 * SHA-256 校验和：写快照时算 checksum 存文件头，读/导入时验。
 * 崩溃导致半写/撕裂 → checksum 不匹配 → 拒绝导入 + 审计日志。
 *
 * 实现：浏览器原生 crypto.subtle.digest（BoringSSL 硬件加速，SW 可用）。
 * 性能（调研数据）：4MB 快照 <1ms，无需流式/Offscreen（<256MB 一次性安全）。
 *
 * 守红线：不引第三方哈希库（crypto.subtle 原生足够）；不依赖 fsync。
 */

import type { BackupFile } from "~types/backup"

/**
 * 计算字符串/ArrayBuffer 的 SHA-256，返回十六进制小写。
 * crypto.subtle 在 MV3 SW/popup/options 全可用（安全上下文）。
 */
export async function sha256(data: string | ArrayBuffer | Uint8Array): Promise<string> {
  let buf: ArrayBuffer
  if (typeof data === "string") {
    buf = new TextEncoder().encode(data).buffer as ArrayBuffer
  } else if (data instanceof Uint8Array) {
    buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer
  } else {
    buf = data
  }
  const hashBuf = await crypto.subtle.digest("SHA-256", buf)
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * 算快照内容的 checksum（snapshot 字段的 JSON SHA-256，不含 checksum 自身）。
 * 注意：序列化时排除 file.checksum 字段，否则自指（checksum 算进去会导致每次不同）。
 */
export async function computeSnapshotChecksum(file: BackupFile): Promise<string> {
  // 序列化 snapshot 部分（不含外层 checksum），稳定 key 顺序（防 JSON.stringify 顺序差异）
  const snapshotJson = stableStringify(file.snapshot)
  return sha256(snapshotJson)
}

/**
 * 校验快照完整性：用 file.checksum 比对重算的 checksum。
 * @returns true=完整；false=损坏或无 checksum
 */
export async function verifySnapshot(file: BackupFile): Promise<boolean> {
  if (!file.checksum) return false // 无校验位视为不可信（旧数据迁移时补算）
  const actual = await computeSnapshotChecksum(file)
  return actual === file.checksum
}

/**
 * 给快照补 checksum（写时调）。原地修改 file.checksum 并返回。
 */
export async function withChecksum(file: BackupFile): Promise<BackupFile> {
  file.checksum = await computeSnapshotChecksum(file)
  return file
}

/**
 * 稳定 JSON 序列化（key 排序，防对象属性顺序不同导致 checksum 漂移）。
 * 嵌套对象/数组递归排序。
 */
function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value))
}

function sortKeysDeep(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value
  if (Array.isArray(value)) return value.map(sortKeysDeep)
  const obj = value as Record<string, unknown>
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeysDeep(obj[key])
  }
  return sorted
}

// ===== 用户目录文件校验（旁车 .sha256 文件）=====

/**
 * 旁车校验文件名：xxx.json → xxx.json.sha256
 */
export function sha256SidecarName(fileName: string): string {
  return `${fileName}.sha256`
}

/**
 * 校验用户目录文件内容与旁车 .sha256 是否一致。
 * @param content 文件内容（字符串）
 * @param sidecarContent 旁车文件内容（一行 hex）
 */
export async function verifyDirFile(
  content: string,
  sidecarContent: string | null
): Promise<boolean> {
  if (!sidecarContent) return false // 无旁车视为不可信
  const expected = sidecarContent.trim().split(/\s+/)[0] // 取第一个 token（兼容 "hash  filename" 格式）
  const actual = await sha256(content)
  return actual === expected
}
