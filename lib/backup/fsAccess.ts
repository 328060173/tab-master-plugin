/**
 * File System Access API 封装 - 用户目录备份（PRD §5.3 / §7.2 / §7.3）。
 *
 * 守红线（PRD §9 Non-Goals）：
 * - 无需 manifest 权限（用户手势触发即可）
 * - 仅在 sidepanel/options/tabs 页面调用，不在 SW（SW 无用户手势）
 * - 仅写用户选定目录树内
 * - handle 持久化到 IndexedDB（独立 db `tabmaster_backup_fs`），跨重启保留引用
 * - 重启后权限可能失效（queryPermission 返回 "prompt"），UI 提示重新授权
 *
 * Chrome 86+ / Edge 86+ 可用；老版本降级仅本地缓存（PRD §7.3）。
 */

import { t, tWithParams } from "~lib/i18n"
import type { BackupDirMeta } from "~types/backup"

const DB_NAME = "tabmaster_backup_fs"
const DB_VERSION = 1
const STORE_NAME = "handles"
const HANDLE_KEY = "backup_dir_handle"

/** 是否支持 File System Access API */
export function isFsAccessSupported(): boolean {
  return typeof (globalThis as unknown as { showDirectoryPicker?: unknown }).showDirectoryPicker === "function"
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/** 读取已存储的目录 handle（不验权限） */
export async function loadDirHandle(): Promise<FileSystemDirectoryHandle | null> {
  try {
    const db = await openDb()
    return await new Promise<FileSystemDirectoryHandle | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly")
      const req = tx.objectStore(STORE_NAME).get(HANDLE_KEY)
      req.onsuccess = () => resolve((req.result as FileSystemDirectoryHandle | undefined) ?? null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

async function saveDirHandle(h: FileSystemDirectoryHandle): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite")
      tx.objectStore(STORE_NAME).put(h, HANDLE_KEY)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (e) {
    console.warn("[fsAccess] 保存 handle 失败", e)
  }
}

async function clearDirHandle(): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite")
      tx.objectStore(STORE_NAME).delete(HANDLE_KEY)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch (e) {
    console.warn("[fsAccess] 清除 handle 失败", e)
  }
}

/**
 * 用户手势触发：弹系统目录选择器。
 * 返回 handle（已持久化） + meta。失败返回 { error }。
 */
export async function pickDirectory(): Promise<
  { handle: FileSystemDirectoryHandle; meta: BackupDirMeta } | { error: string }
> {
  if (!isFsAccessSupported()) {
    return { error: t("error.backup.dirUnsupported") }
  }
  try {
    const picker = (globalThis as unknown as {
      showDirectoryPicker: (opts: { mode: "readwrite" }) => Promise<FileSystemDirectoryHandle>
    }).showDirectoryPicker
    const handle = await picker({ mode: "readwrite" })
    await saveDirHandle(handle)
    const meta: BackupDirMeta = {
      name: handle.name,
      dirBytes: 0,
      scannedAt: null,
      permission: "granted",
    }
    return { handle, meta }
  } catch (e) {
    const err = e as { name?: string }
    if (err?.name === "AbortError") return { error: t("error.backup.dirPickCancelled") }
    return { error: e instanceof Error ? e.message : String(e) }
  }
}

/** 查询当前 handle 权限（不弹窗） */
export async function queryDirPermission(
  handle: FileSystemDirectoryHandle
): Promise<PermissionState> {
  try {
    return await handle.queryPermission({ mode: "readwrite" })
  } catch {
    return "prompt"
  }
}

/** 用户手势触发：请求权限（可能弹窗） */
export async function requestDirPermission(
  handle: FileSystemDirectoryHandle
): Promise<PermissionState> {
  try {
    return await handle.requestPermission({ mode: "readwrite" })
  } catch {
    return "prompt"
  }
}

/** 取消目录绑定 */
export async function unbindDirectory(): Promise<void> {
  await clearDirHandle()
}

/** 文件名安全的 ISO 时间戳（去掉冒号） */
function isoFilename(ts: number): string {
  const d = new Date(ts)
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

/** 写快照文件到目录：原子写（.tmp → rename），唯一时间戳文件名 */
export async function writeSnapshotToDir(
  handle: FileSystemDirectoryHandle,
  content: string,
  createdAt: number,
  deviceIdShort: string
): Promise<{ ok: true; fileName: string; bytes: number } | { ok: false; error: string }> {
  const fileName = `session_backup_${isoFilename(createdAt)}_${deviceIdShort}.json`
  const tmpName = `${fileName}.tmp`
  try {
    // 原子写：先写 .tmp，再 rename 到最终名
    const tmpFile = await handle.getFileHandle(tmpName, { create: true })
    const tmpWritable = await tmpFile.createWritable()
    await tmpWritable.write(content)
    await tmpWritable.close()
    // move 到最终名（支持覆盖；多数浏览器未实现 move，则降级再写一次最终名 + 删 .tmp）
    try {
      await (handle as unknown as {
        move?: (name: string, fileHandle: FileSystemFileHandle) => Promise<void>
      }).move?.(fileName, tmpFile)
    } catch {
      // 降级：直接写最终名 + 删 .tmp
      const finalFile = await handle.getFileHandle(fileName, { create: true })
      const w = await finalFile.createWritable()
      await w.write(content)
      await w.close()
      await handle.removeEntry(tmpName).catch(() => {})
    }
    const bytes = new Blob([content]).size
    return { ok: true, fileName, bytes }
  } catch (e) {
    const err = e as { name?: string }
    if (err?.name === "QuotaExceededError" || err?.name === "SecurityError") {
      return { ok: false, error: tWithParams("error.backup.dirQuotaOrWrite", { name: err.name || "" }) }
    }
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

/** 扫描目录内 session_backup_*.json 累加大小（缓存 60s 由调用方控制） */
export async function scanDirSize(handle: FileSystemDirectoryHandle): Promise<{
  ok: true
  bytes: number
  count: number
} | { ok: false; error: string }> {
  try {
    let bytes = 0
    let count = 0
    for await (const entry of handle.values()) {
      if (entry.kind === "file" && /^session_backup_.*\.json$/.test(entry.name)) {
        const file = await (entry as FileSystemFileHandle).getFile()
        bytes += file.size
        count++
      }
    }
    return { ok: true, bytes, count }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
