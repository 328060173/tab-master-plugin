/**
 * 备份导入导出 composable - PRD §5.5
 * 基于 useBackupService 单例
 *
 * 导出：JSON / Markdown / OneTab
 * 导入：自动嗅探 + 拖拽/选文件/粘贴文本
 * 导入后走与"恢复"相同的预览+冲突流程（导入本质=把外部快照恢复到当前浏览器）
 */

import { ref } from "vue"
import { useBackupService } from "./useBackupService"
import { exportByFormat, downloadExport, type ExportOutput } from "~lib/backup/exporters"
import { parseImport, parseAsOneTab, readFileText } from "~lib/backup/importers"
import type { BackupFile, ExportFormat, ImportResult } from "~types/backup"

export function useBackupIO() {
  const svc = useBackupService()

  const isExporting = ref(false)
  const isImporting = ref(false)
  const lastImportResult = ref<ImportResult | null>(null)
  /** 导入成功后的待恢复快照（导入后供恢复流程用） */
  const importedSnapshot = ref<BackupFile | null>(null)

  /** 导出指定快照 */
  async function exportSnapshot(snapshotId: string, format: ExportFormat): Promise<{ ok: boolean; error?: string }> {
    isExporting.value = true
    try {
      const file = await svc.getSnapshotFile(snapshotId)
      if (!file) return { ok: false, error: "快照不存在" }
      const out: ExportOutput = exportByFormat(file, format)
      const ok = downloadExport(out)
      return { ok, error: ok ? undefined : "下载失败" }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) }
    } finally {
      isExporting.value = false
    }
  }

  /** 导出最新快照（无快照时返回错误） */
  async function exportLatest(format: ExportFormat): Promise<{ ok: boolean; error?: string }> {
    const list = svc.snapshots.value
    if (!list.length) return { ok: false, error: "尚无快照可导出" }
    return exportSnapshot(list[0].id, format)
  }

  /** 导入文本（自动嗅探） */
  async function importText(text: string, forceOneTab = false): Promise<ImportResult> {
    isImporting.value = true
    try {
      const r = forceOneTab ? await parseAsOneTab(text) : await parseImport(text)
      lastImportResult.value = r
      if (r.ok && r.file) {
        // 写入缓存作为待恢复快照
        await svc.appendImportedSnapshot(r.file)
        importedSnapshot.value = r.file
      }
      return r
    } finally {
      isImporting.value = false
    }
  }

  /** 导入文件（File 对象） */
  async function importFile(file: File, forceOneTab = false): Promise<ImportResult> {
    try {
      const text = await readFileText(file)
      return importText(text, forceOneTab)
    } catch (e) {
      const r: ImportResult = {
        ok: false,
        file: null,
        error: `读取文件失败：${e instanceof Error ? e.message : String(e)}`,
        warnings: [],
        skipped: 0,
        format: "unknown",
      }
      lastImportResult.value = r
      return r
    }
  }

  return {
    isExporting,
    isImporting,
    lastImportResult,
    importedSnapshot,
    exportSnapshot,
    exportLatest,
    importText,
    importFile,
  }
}
