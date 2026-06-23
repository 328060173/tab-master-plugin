const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const buildDir = path.join(__dirname, '../build');

// 执行命令（同步）
function runCommandSync(command, cwd) {
  const child_process = require('child_process');
  child_process.execSync(command, { 
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

// 复制图标文件
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

// 重命名目录
function renameDirs() {
  const devDir = path.join(buildDir, 'chrome-mv3-dev');
  const prodDir = path.join(buildDir, 'chrome-mv3-prod');
  const newDevDir = path.join(buildDir, 'dev');
  const newProdDir = path.join(buildDir, 'prod');
  
  // 删除旧的目标目录
  if (fs.existsSync(newDevDir)) {
    fs.rmSync(newDevDir, { recursive: true });
  }
  if (fs.existsSync(newProdDir)) {
    fs.rmSync(newProdDir, { recursive: true });
  }
  
  // 重命名目录
  if (fs.existsSync(devDir)) {
    fs.renameSync(devDir, newDevDir);
    console.log('✅ 开发版本已重命名为 dev/');
  }
  if (fs.existsSync(prodDir)) {
    fs.renameSync(prodDir, newProdDir);
    console.log('✅ 生产版本已重命名为 prod/');
  }
  
  // 复制图标：将生产版本的图标复制到开发版本
  console.log('\n🔄 同步图标文件...');
  copyIcons(newProdDir, newDevDir);
  
  // 列出最终结果
  console.log('\n📁 构建结果目录结构:');
  fs.readdirSync(buildDir).forEach(dir => {
    const dirPath = path.join(buildDir, dir);
    if (fs.statSync(dirPath).isDirectory()) {
      console.log(`  - ${dir}/`);
    }
  });
}

// 完整构建流程
async function build() {
  console.log('🚀 开始构建...');
  
  // 清理旧构建
  console.log('🔄 清理旧构建...');
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
  }
  
  // 构建生产版本
  console.log('🔄 构建生产版本...');
  runCommandSync('pnpm build', path.join(__dirname, '..'));
  
  // 构建开发版本
  console.log('🔄 构建开发版本...');
  await runDevServer(path.join(__dirname, '..'));
  
  // 等待一段时间确保所有文件都写入完成
  console.log('⏳ 等待文件写入完成...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 重命名目录并同步图标
  renameDirs();
  
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
