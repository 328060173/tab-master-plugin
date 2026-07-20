const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const buildDir = path.join(__dirname, '../build');
const rootDir = path.join(__dirname, '..');

// 从 package.json 读取版本号（zip 名带版本用）
const { version } = require('../package.json');

// 产物目录名（带 tm 前缀，区分插件）
const PROD_DIR_NAME = 'tm-mv3-prod';
const DEV_DIR_NAME = 'tm-mv3-dev';

// 执行命令（同步）
function runCommandSync(command, cwd) {
  execSync(command, {
    cwd,
    stdio: ['inherit', 'inherit', 'inherit']
  });
}

// 启动开发服务器并等待构建完成
function runDevServer(cwd) {
  return new Promise((resolve, reject) => {
    const devProcess = spawn('pnpm', ['dev'], { cwd, stdio: 'inherit' });

    // 设置超时，20秒后停止服务器
    const timeout = setTimeout(() => {
      console.log('\n⏰ 开发版本构建完成，停止服务器...');
      devProcess.kill('SIGINT');
    }, 20000);

    devProcess.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    devProcess.on('exit', (code) => {
      clearTimeout(timeout);
      console.log('✅ 开发服务器已停止');
      if (code !== 0 && code !== null) {
        console.log(`⚠️ 开发服务器退出代码: ${code}`);
      }
      resolve();
    });
  });
}

// 复制图标文件（从 prod 同步到 dev，保证两端图标一致）
function copyIcons(sourceDir, targetDir) {
  // 先删除目标目录中所有旧的图标文件
  const targetIconFiles = fs.readdirSync(targetDir).filter(file => file.startsWith('icon') && file.endsWith('.png'));
  targetIconFiles.forEach(oldIcon => {
    fs.unlinkSync(path.join(targetDir, oldIcon));
    console.log(`🗑️ 删除旧图标: ${oldIcon}`);
  });

  // 然后复制生产版本的图标
  const iconFiles = fs.readdirSync(sourceDir).filter(file => file.startsWith('icon') && file.endsWith('.png'));

  iconFiles.forEach(iconFile => {
    const sourcePath = path.join(sourceDir, iconFile);
    const targetPath = path.join(targetDir, iconFile);

    // 复制图标
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`📦 复制图标: ${iconFile}`);
  });

  // 更新目标目录的manifest.json使用新的图标文件名
  const targetManifest = path.join(targetDir, 'manifest.json');
  if (fs.existsSync(targetManifest)) {
    let manifestContent = fs.readFileSync(targetManifest, 'utf8');

    // 将manifest中的图标文件名替换为生产版本的文件名
    iconFiles.forEach(iconFile => {
      const match = iconFile.match(/icon(\d+)\.plasmo\.[a-f0-9]+\.png/);
      if (match) {
        const size = match[1];
        const oldPattern = new RegExp(`icon${size}\\.plasmo\\.[a-f0-9]+\\.png`, 'g');
        manifestContent = manifestContent.replace(oldPattern, iconFile);
      }
    });

    fs.writeFileSync(targetManifest, manifestContent);
    console.log('✅ 更新 manifest.json 图标引用');
  }
}

// 重命名目录：chrome-mv3-prod/dev → tm-mv3-prod/dev
function renameDirs() {
  const devDir = path.join(buildDir, 'chrome-mv3-dev');
  const prodDir = path.join(buildDir, 'chrome-mv3-prod');
  const newDevDir = path.join(buildDir, DEV_DIR_NAME);
  const newProdDir = path.join(buildDir, PROD_DIR_NAME);

  // 删除旧的目标目录（可能上次残留）
  if (fs.existsSync(newDevDir)) {
    fs.rmSync(newDevDir, { recursive: true });
  }
  if (fs.existsSync(newProdDir)) {
    fs.rmSync(newProdDir, { recursive: true });
  }

  // 重命名目录
  if (fs.existsSync(devDir)) {
    fs.renameSync(devDir, newDevDir);
    console.log(`✅ 开发版本已重命名为 ${DEV_DIR_NAME}/`);
  }
  if (fs.existsSync(prodDir)) {
    fs.renameSync(prodDir, newProdDir);
    console.log(`✅ 生产版本已重命名为 ${PROD_DIR_NAME}/`);
  }

  // 复制图标：将生产版本的图标复制到开发版本
  console.log('\n🔄 同步图标文件...');
  copyIcons(newProdDir, newDevDir);

  // 复制 _locales 到 prod 和 dev（Plasmo 不自动复制项目根 _locales）
  // 商店识别语言靠产物根 _locales/<locale>/messages.json + manifest default_locale
  console.log('\n🌍 复制 _locales（i18n）...');
  copyLocales(newProdDir);
  copyLocales(newDevDir);
}

// 复制项目根 _locales 目录到目标产物目录
function copyLocales(targetDir) {
  const srcLocales = path.join(__dirname, '..', '_locales')
  if (!fs.existsSync(srcLocales)) {
    console.warn('⚠️ 项目根无 _locales 目录，跳过')
    return
  }
  const targetLocales = path.join(targetDir, '_locales')
  // 递归复制（fs.cpSync node 16.7+）
  fs.cpSync(srcLocales, targetLocales, { recursive: true })
  console.log(`✅ _locales 已复制到 ${path.basename(targetDir)}/`)
}

// 打 zip（在源目录内执行 zip -r，让 manifest.json 等在 zip 根，符合商店要求）
// 用系统 zip 命令避免装 npm 依赖（红线：不轻易加依赖，macOS 自带 zip）
function createZip(srcDir, zipName) {
  const zipPath = path.join(buildDir, zipName);

  // 删除旧 zip（避免上次残留）
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  // 在源目录内执行 zip，-x 排除 macOS 的 .DS_Store
  // ../zipName 让 zip 产到 build/ 下而非 srcDir 内
  execSync(`zip -r -X "../${zipName}" . -x "*.DS_Store"`, {
    cwd: srcDir,
    stdio: ['inherit', 'inherit', 'inherit']
  });

  console.log(`📦 已打 zip: ${zipName}`);
  return zipPath;
}

// 双保险：扫描 zip 内容，确认无开发文档（.md / docs / CLAUDE / README）
// plasmo build 产物本身已干净，这里加兜底防止未来误打包
function verifyZipNoDocs(zipPath, zipName) {
  const list = execSync(`unzip -l "${zipPath}"`).toString();

  // 匹配开发文档特征：.md 文件 / docs/ 目录 / CLAUDE / README
  const docPattern = /\.md$|\/docs\/|(^|\/)CLAUDE|(^|\/)README/i;
  const lines = list.split('\n');
  const hits = lines.filter(line => docPattern.test(line));

  if (hits.length > 0) {
    console.error(`\n❌ ${zipName} 含开发文档，中止！`);
    hits.forEach(h => console.error(`   ${h.trim()}`));
    process.exit(1);
  }

  console.log(`✅ ${zipName} 内容扫描通过，无开发文档`);
}

// 读取文件/目录大小（字节）
function getSizeBytes(targetPath) {
  // 用 du 命令递归统计（macOS 自带）
  const size = execSync(`du -sk "${targetPath}"`).toString().split(/\s+/)[0];
  return parseInt(size, 10) * 1024; // KB → B
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// 打印最终产物清单
function printArtifacts() {
  console.log('\n📁 最终构建产物:');

  const artifacts = [
    { name: `${PROD_DIR_NAME}/`, path: path.join(buildDir, PROD_DIR_NAME), type: 'dir' },
    { name: `${DEV_DIR_NAME}/`, path: path.join(buildDir, DEV_DIR_NAME), type: 'dir' },
    { name: `${PROD_DIR_NAME}-${version}.zip`, path: path.join(buildDir, `${PROD_DIR_NAME}-${version}.zip`), type: 'file' },
    { name: `${DEV_DIR_NAME}-${version}.zip`, path: path.join(buildDir, `${DEV_DIR_NAME}-${version}.zip`), type: 'file' }
  ];

  artifacts.forEach(art => {
    if (fs.existsSync(art.path)) {
      const size = getSizeBytes(art.path);
      console.log(`  - ${art.name}  (${formatSize(size)})`);
    } else {
      console.log(`  - ${art.name}  ⚠️ 不存在`);
    }
  });
}

// 完整构建流程
async function build() {
  console.log('🚀 开始构建...');
  console.log(`📌 版本号: ${version}`);

  // 先杀掉残留的 plasmo dev 进程，避免它在后台监听文件改动、偷偷重建 chrome-mv3-dev 目录
  try {
    execSync('pkill -f "plasmo dev"', { stdio: 'ignore' });
    console.log('🧹 清理残留的 plasmo dev 进程');
  } catch (e) {
    // pkill 没找到匹配进程时退出码非 0，属正常情况，忽略
  }

  // 清理旧构建
  console.log('🔄 清理旧构建...');
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }

  // 构建生产版本
  console.log('🔄 构建生产版本...');
  runCommandSync('pnpm build', rootDir);

  // 构建开发版本
  // 注意：build:all 是用户主动调用产 dev 包（知情情况下跑 pnpm dev），与日常开发不冲突
  console.log('🔄 构建开发版本...');
  await runDevServer(rootDir);

  // 等待一段时间确保所有文件都写入完成
  console.log('⏳ 等待文件写入完成...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 重命名目录并同步图标
  renameDirs();

  // 打 zip（名带版本号）
  console.log('\n📦 打包 zip...');
  const prodZip = createZip(path.join(buildDir, PROD_DIR_NAME), `${PROD_DIR_NAME}-${version}.zip`);
  const devZip = createZip(path.join(buildDir, DEV_DIR_NAME), `${DEV_DIR_NAME}-${version}.zip`);

  // 双保险：扫描 zip 内容确认无开发文档
  console.log('\n🔍 扫描 zip 内容（双保险，防误打包开发文档）...');
  verifyZipNoDocs(prodZip, `${PROD_DIR_NAME}-${version}.zip`);
  verifyZipNoDocs(devZip, `${DEV_DIR_NAME}-${version}.zip`);

  // 打印最终产物清单
  printArtifacts();

  console.log('\n🎉 构建完成！');
}

// 如果是直接运行此脚本
if (require.main === module) {
  build().catch(error => {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  });
}

module.exports = { build };
