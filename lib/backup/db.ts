/**
 * 备份 IndexedDB 封装 - P0-4 L2
 *
 * 为什么用 IndexedDB 而非 chrome.storage.local：
 * - storage.local 无事务，读-改-写竞态（调研实锤）
 * - IndexedDB readwrite 事务真原子，且支持索引查询（按时间/锁定）
 *
 * 3 个 object store：
 * - snapshots：快照主表，keyPath=snapshot.id，索引 createdAt/locked
 * - wal：WAL 日志，keyPath=traceId，索引 status
 * - audit：审计日志，keyPath=traceId，索引 timestamp
 *
 * 守红线：沿用 fsAccess 的原生 IDB API 范式（不引 idb 库）；不与 fsAccess 库冲突。
 */

import type { BackupFile } from "~types/backup"
import type { WalEntry, AuditLogEntry } from "./types"
import { t } from "~lib/i18n"

const DB_NAME = "tabmaster_backup"
const DB_VERSION = 1

export const STORE_SNAPSHOTS = "snapshots"
export const STORE_WAL = "wal"
export const STORE_AUDIT = "audit"

let dbPromise: Promise<IDBDatabase> | null = null

/** 打开数据库（单例缓存，SW 销毁后重建） */
export function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = () => {
        const db = req.result
        // snapshots store
        if (!db.objectStoreNames.contains(STORE_SNAPSHOTS)) {
          const store = db.createObjectStore(STORE_SNAPSHOTS, { keyPath: "snapshot.id" })
          store.createIndex("createdAt", "snapshot.createdAt", { unique: false })
          store.createIndex("locked", "snapshot.locked", { unique: false })
        }
        // wal store
        if (!db.objectStoreNames.contains(STORE_WAL)) {
          db.createObjectStore(STORE_WAL, { keyPath: "traceId" })
        }
        // audit store
        if (!db.objectStoreNames.contains(STORE_AUDIT)) {
          const store = db.createObjectStore(STORE_AUDIT, { keyPath: "traceId" })
          store.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }
  return dbPromise
}

/** SW 销毁时清缓存（重新打开拿新连接） */
export function resetDb(): void {
  dbPromise = null
}

// ===== 通用事务辅助（Promise 封装原生 IDB）=====

/** 单 store 事务 + 单操作 */
async function txRun<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  const db = await getDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(storeName, mode)
    const req = fn(tx.objectStore(storeName))
    req.onsuccess = () => resolve(req.result as T)
    req.onerror = () => reject(req.error)
  })
}

/** 多 store 事务（返回 store 供操作，await done） */
export async function txMulti(
  storeNames: string[],
  mode: IDBTransactionMode,
  fn: (stores: Record<string, IDBObjectStore>) => void
): Promise<void> {
  const db = await getDb()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeNames, mode)
    const stores: Record<string, IDBObjectStore> = {}
    for (const name of storeNames) {
      stores[name] = tx.objectStore(name)
    }
    fn(stores)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error || new Error(t('error.transactionAborted')))
  })
}

// ===== snapshots store =====

export async function putSnapshot(file: BackupFile): Promise<void> {
  await txRun(STORE_SNAPSHOTS, "readwrite", (store) => store.put(file))
}

export async function getSnapshot(id: string): Promise<BackupFile | undefined> {
  return txRun<BackupFile | undefined>(STORE_SNAPSHOTS, "readonly", (store) => store.get(id))
}

export async function deleteSnapshotFromDb(id: string): Promise<void> {
  await txRun(STORE_SNAPSHOTS, "readwrite", (store) => store.delete(id))
}

export async function getAllSnapshots(): Promise<BackupFile[]> {
  return txRun<BackupFile[]>(STORE_SNAPSHOTS, "readonly", (store) => store.getAll())
}

/** 清空所有快照（保留 store 结构） */
export async function clearSnapshots(): Promise<void> {
  await txRun(STORE_SNAPSHOTS, "readwrite", (store) => store.clear())
}

// ===== wal store =====

export async function putWal(entry: WalEntry): Promise<void> {
  await txRun(STORE_WAL, "readwrite", (store) => store.put(entry))
}

export async function getWalByTraceId(traceId: string): Promise<WalEntry | undefined> {
  return txRun<WalEntry | undefined>(STORE_WAL, "readonly", (store) => store.get(traceId))
}

export async function getAllWal(): Promise<WalEntry[]> {
  return txRun<WalEntry[]>(STORE_WAL, "readonly", (store) => store.getAll())
}

export async function deleteWal(traceId: string): Promise<void> {
  await txRun(STORE_WAL, "readwrite", (store) => store.delete(traceId))
}

// ===== audit store =====

export async function putAudit(entry: AuditLogEntry): Promise<void> {
  await txRun(STORE_AUDIT, "readwrite", (store) => store.put(entry))
}

export async function getRecentAudit(limit: number): Promise<AuditLogEntry[]> {
  const all = await txRun<AuditLogEntry[]>(STORE_AUDIT, "readonly", (store) => store.getAll())
  return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
}

/** 删除早于 cutoff 的审计日志（保留策略） */
export async function purgeAuditBefore(cutoff: number): Promise<number> {
  const db = await getDb()
  return new Promise<number>((resolve, reject) => {
    const tx = db.transaction(STORE_AUDIT, "readwrite")
    const store = tx.objectStore(STORE_AUDIT)
    const idx = store.index("timestamp")
    const range = IDBKeyRange.upperBound(cutoff)
    let count = 0
    const cursorReq = idx.openCursor(range)
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result
      if (cursor) {
        cursor.delete()
        count++
        cursor.continue()
      }
    }
    cursorReq.onerror = () => reject(cursorReq.error)
    tx.oncomplete = () => resolve(count)
    tx.onerror = () => reject(tx.error)
  })
}

/** 审计日志总数（超 500 条触发清理最早的） */
export async function getAuditCount(): Promise<number> {
  return txRun<number>(STORE_AUDIT, "readonly", (store) => store.count())
}

/** 删除最早的 N 条审计日志（超 500 时调） */
export async function deleteOldestAudit(n: number): Promise<void> {
  const db = await getDb()
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_AUDIT, "readwrite")
    const idx = tx.objectStore(STORE_AUDIT).index("timestamp")
    let count = 0
    const cursorReq = idx.openCursor()
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result
      if (cursor && count < n) {
        cursor.delete()
        count++
        cursor.continue()
      }
    }
    cursorReq.onerror = () => reject(cursorReq.error)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
