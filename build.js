import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保dist目录存在
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  console.log('清理dist目录...');
  fs.rmSync(distDir, { recursive: true, force: true });
}

// 执行生产环境构建
console.log('开始生产环境构建...');
try {
  execSync('npm run build', { 
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit'
  });
  console.log('构建成功！');
} catch (error) {
  console.error('构建失败:', error);
  process.exit(1);
}

// 构建完成后的操作
console.log('生成构建信息文件...');
const buildInfo = {
  version: '1.0.0', // 硬编码版本号，避免require语法
  buildTime: new Date().toISOString(),
  environment: 'production'
};

fs.writeFileSync(
  path.join(distDir, 'build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('打包完成！');