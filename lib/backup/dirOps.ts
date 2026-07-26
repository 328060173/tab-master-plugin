/**
 * 备份用户目录操作 - PRD §A / §5.3 / §7.2 / §7.3
 * 抽离自 useBackupService.ts 以控制单文件行数（红线 .ts ≤ 500）。
 *
 * 所有函数纯操作：传入 dirMeta ref + handle，返回结果；不直接持状态。
 * handle 持久化由 fsAccess.ts 管；本模块负责：权限检测/选目录/重新授权/解绑/扫描大小/写快照。
 */

import { ref, type Ref } from "vue"
import {
  isFsAccessSupported,
  loadDirHandle,
  pickDirectory,
  queryDirPermission,
  requestDirPermission,
  unbindDirectory,
  writeSnapshotToDir,
  scanDirSize,
} from "./fsAccess"
import type { BackupDirMeta, BackupFile } from "~types/backup"

export interface DirOpsResult {
  ok: boolean
  error?: string
}

const DIR_SCAN_CACHE_MS = 60_000

/** 检查目录权限并更新 dirMeta（不弹窗） */
export async function checkDirPermission(
  dirMeta: Ref<BackupDirMeta>,
  dirEnabled: boolean,
  saveDirMeta: () => Promise<void>
): Promise<void> {
  if (!isFsAccessSupported()) {
    dirMeta.value.permission = "unsupported"
    return
  }
  const handle = await loadDirHandle()
  if (!handle) {
    dirMeta.value.permission = dirEnabled ? "prompt" : "unsupported"
    return
  }
  const p = await queryDirPermission(handle)
  dirMeta.value.permission = p === "granted" ? "granted" : p === "denied" ? "denied" : "prompt"
  await saveDirMeta()
}

/** 用户手势触发：弹系统目录选择器 */
export async function pickDir(
  dirMeta: Ref<BackupDirMeta>,
  saveDirMeta: () => Promise<void>
): Promise<DirOpsResult> {
  const r = await pickDirectory()
  if ("error" in r) return { ok: false, error: r.error }
  dirMeta.value = { ...r.meta, permission: "granted" }
  await saveDirMeta()
  return { ok: true }
}

/** 用户手势触发：重新授权 */
export async function reauthorizeDir(
  dirMeta: Ref<BackupDirMeta>,
  saveDirMeta: () => Promise<void>
): Promise<DirOpsResult> {
  const handle = await loadDirHandle()
  if (!handle) return { ok: false, error: "未绑定目录，请重新选择" }
  const p = await requestDirPermission(handle)
  dirMeta.value.permission = p === "granted" ? "granted" : p === "denied" ? "denied" : "prompt"
  await saveDirMeta()
  return { ok: p === "granted", error: p === "granted" ? undefined : "授权未通过" }
}

/** 解绑目录 */
export async function unbindDir(
  dirMeta: Ref<BackupDirMeta>,
  saveDirMeta: () => Promise<void>
): Promise<void> {
  await unbindDirectory()
  dirMeta.value = {
    name: null,
    dirBytes: 0,
    scannedAt: null,
    permission: isFsAccessSupported() ? "prompt" : "unsupported",
  }
  await saveDirMeta()
}

/** 扫描目录大小（缓存 60s） */
export async function refreshDirSize(
  dirMeta: Ref<BackupDirMeta>,
  saveDirMeta: () => Promise<void>,
  force = false
): Promise<void> {
  if (!isFsAccessSupported()) return
  if (!force && dirMeta.value.scannedAt && Date.now() - dirMeta.value.scannedAt < DIR_SCAN_CACHE_MS) {
    return
  }
  const handle = await loadDirHandle()
  if (!handle) return
  const r = await scanDirSize(handle)
  if (r.ok) {
    dirMeta.value.dirBytes = r.bytes
    dirMeta.value.scannedAt = Date.now()
    await saveDirMeta()
  }
}

/** 写快照到目录（双写降级） */
export async function writeSnapshotToDirSafe(
  dirMeta: Ref<BackupDirMeta>,
  saveDirMeta: () => Promise<void>,
  file: BackupFile
): Promise<DirOpsResult> {
  if (!isFsAccessSupported()) return { ok: false, error: "不支持" }
  const handle = await loadDirHandle()
  if (!handle) return { ok: false, error: "未绑定目录" }
  const perm = await queryDirPermission(handle)
  if (perm !== "granted") {
    dirMeta.value.permission = perm === "denied" ? "denied" : "prompt"
    await saveDirMeta()
    return { ok: false, error: "目录权限失效" }
  }
  const deviceIdShort = (file.deviceId || "").replace(/-/g, "").slice(0, 8)
  const content = JSON.stringify(file, null, 2)
  const r = await writeSnapshotToDir(handle, content, file.snapshot.createdAt, deviceIdShort)
  if (!r.ok) return { ok: false, error: r.error }
  // 写成功后异步刷新目录大小
  void refreshDirSize(dirMeta, saveDirMeta, true)
  return { ok: true }
}

/** 缓存大小（getBytesInUse Chrome 136+，降级估算） */
export async function getCacheBytesInUse(cacheKey: string): Promise<number> {
  try {
    if (typeof chrome.storage.local.getBytesInUse === "function") {
      return await chrome.storage.local.getBytesInUse()
    }
  } catch {}
  try {
    const data = await chrome.storage.local.get(cacheKey)
    return new Blob([JSON.stringify(data[cacheKey] ?? [])]).size
  } catch {
    return 0
  }
}
