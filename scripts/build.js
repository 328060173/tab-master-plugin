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
    
    // 设置超时，15秒后停止服务器
    const timeout = setTimeout(() => {
      console.log('\n⏰ 开发版本构建完成，停止服务器...');
      devProcess.kill('SIGINT');
      resolve();
    }, 15000);
    
    devProcess.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    
    devProcess.on('exit', (code) => {
      clearTimeout(timeout);
      if (code !== 0 && code !== null) {
        reject(new Error(`开发服务器异常退出，代码: ${code}`));
      } else {
        resolve();
      }
    });
  });
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
  
  // 重命名目录
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
