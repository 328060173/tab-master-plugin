/**
 * 同步 _locales 目录到 build 产物
 *
 * Chrome/Edge 扩展 i18n 标准：manifest 用 __MSG_xxx__ 占位符 + default_locale 时，
 * 必须在扩展根有 _locales/<locale>/messages.json，否则 Chrome 拒绝加载扩展。
 *
 * Plasmo 0.90.5 不会自动复制 _locales 目录到 build 产物，需手动同步。
 * 本脚本覆盖两个场景：
 *   1. pnpm build 后一次性同步（build/chrome-mv3-prod）
 *   2. pnpm dev 时守护同步（--watch 每 2 秒检查 build/chrome-mv3-dev）
 *
 * 用法：
 *   node scripts/sync-locales.js           # 一次性同步所有已存在的 build 产物目录
 *   node scripts/sync-locales.js --watch   # 守护模式，每 2 秒检查并同步
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const sourceLocales = path.join(rootDir, 'public', '_locales');
const buildDir = path.join(rootDir, 'build');

// 所有可能的 build 产物目录名
const BUILD_DIR_NAMES = [
  'chrome-mv3-prod',
  'chrome-mv3-dev',
  'tm-mv3-prod',
  'tm-mv3-dev'
];

/**
 * 递归复制目录（先清空目标再复制，保证与源完全一致）
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  // 清空目标目录（如果存在），避免残留旧文件
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

/**
 * 检查两个目录内容是否一致（简单逐文件比对）
 */
function dirsEqual(src, dest) {
  if (!fs.existsSync(dest)) return false;
  const srcEntries = fs.readdirSync(src, { withFileTypes: true });
  const destEntries = fs.readdirSync(dest, { withFileTypes: true });
  if (srcEntries.length !== destEntries.length) return false;
  for (const entry of srcEntries) {
    const destEntry = destEntries.find(e => e.name === entry.name);
    if (!destEntry) return false;
    if (entry.isDirectory() !== destEntry.isDirectory()) return false;
    if (entry.isDirectory()) {
      if (!dirsEqual(path.join(src, entry.name), path.join(dest, entry.name))) return false;
    } else {
      const srcStat = fs.statSync(path.join(src, entry.name));
      const destStat = fs.statSync(path.join(dest, entry.name));
      if (srcStat.size !== destStat.size) return false;
      if (srcStat.mtimeMs > destStat.mtimeMs) return false;
    }
  }
  return true;
}

/**
 * 同步一次：把 _locales 复制到所有已存在的 build 产物目录
 */
function syncOnce() {
  if (!fs.existsSync(sourceLocales)) {
    console.error('❌ _locales 源目录不存在:', sourceLocales);
    return;
  }
  for (const dirName of BUILD_DIR_NAMES) {
    const targetDir = path.join(buildDir, dirName);
    if (!fs.existsSync(targetDir)) continue;
    const targetLocales = path.join(targetDir, '_locales');
    // 已一致则跳过（减少守护模式的冗余写入）
    if (dirsEqual(sourceLocales, targetLocales)) continue;
    copyDirRecursive(sourceLocales, targetLocales);
    console.log(`✅ _locales → build/${dirName}/_locales`);
  }
}

const watchMode = process.argv.includes('--watch');

if (watchMode) {
  console.log('👀 _locales 守护同步已启动（每 2 秒检查）');
  syncOnce();
  setInterval(syncOnce, 2000);
} else {
  syncOnce();
}

module.exports = { syncOnce, copyDirRecursive, dirsEqual };
