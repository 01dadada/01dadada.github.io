#!/usr/bin/env node

/**
 * GitHub Pages 适配检查脚本
 * 用于验证项目是否正确配置了 GitHub Pages
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const checks = [];
let hasErrors = false;

console.log('🔍 检查 GitHub Pages 适配配置...\n');

// 1. 检查 vite.config.ts
console.log('1️⃣ 检查 vite.config.ts...');
try {
    const viteConfig = readFileSync(join(__dirname, 'vite.config.ts'), 'utf-8');
    if (viteConfig.includes('base') && viteConfig.includes('loadEnv')) {
        console.log('   ✅ vite.config.ts 已配置 base 路径');
        checks.push({ name: 'vite.config.ts', status: 'ok' });
    } else {
        console.log('   ❌ vite.config.ts 缺少 base 配置');
        checks.push({ name: 'vite.config.ts', status: 'error' });
        hasErrors = true;
    }
} catch (e) {
    console.log('   ❌ 无法读取 vite.config.ts');
    hasErrors = true;
}

// 2. 检查 main.tsx
console.log('\n2️⃣ 检查 src/main.tsx...');
try {
    const mainTsx = readFileSync(join(__dirname, 'src/main.tsx'), 'utf-8');
    if (mainTsx.includes('basename') && mainTsx.includes('BASE_URL')) {
        console.log('   ✅ BrowserRouter 已配置 basename');
        checks.push({ name: 'src/main.tsx', status: 'ok' });
    } else {
        console.log('   ❌ BrowserRouter 缺少 basename 配置');
        checks.push({ name: 'src/main.tsx', status: 'error' });
        hasErrors = true;
    }
} catch (e) {
    console.log('   ❌ 无法读取 src/main.tsx');
    hasErrors = true;
}

// 3. 检查 .nojekyll 文件
console.log('\n3️⃣ 检查 .nojekyll 文件...');
if (existsSync(join(__dirname, 'public/.nojekyll'))) {
    console.log('   ✅ .nojekyll 文件存在');
    checks.push({ name: '.nojekyll', status: 'ok' });
} else {
    console.log('   ⚠️  .nojekyll 文件不存在（可选，但推荐）');
    checks.push({ name: '.nojekyll', status: 'warning' });
}

// 4. 检查 package.json 部署脚本
console.log('\n4️⃣ 检查 package.json 部署脚本...');
try {
    const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));
    if (packageJson.scripts && packageJson.scripts.deploy) {
        console.log('   ✅ deploy 脚本已配置');
        checks.push({ name: 'deploy script', status: 'ok' });
    } else {
        console.log('   ❌ 缺少 deploy 脚本');
        checks.push({ name: 'deploy script', status: 'error' });
        hasErrors = true;
    }

    if (packageJson.dependencies && packageJson.dependencies['gh-pages']) {
        console.log('   ✅ gh-pages 依赖已安装');
        checks.push({ name: 'gh-pages', status: 'ok' });
    } else {
        console.log('   ❌ gh-pages 依赖未安装');
        checks.push({ name: 'gh-pages', status: 'error' });
        hasErrors = true;
    }
} catch (e) {
    console.log('   ❌ 无法读取 package.json');
    hasErrors = true;
}

// 5. 检查 dist 目录（如果存在）
console.log('\n5️⃣ 检查构建产物...');
const distIndexPath = join(__dirname, 'dist/index.html');
if (existsSync(distIndexPath)) {
    try {
        const distIndex = readFileSync(distIndexPath, 'utf-8');
        // 检查是否有正确的 base path 在资源路径中
        if (distIndex.includes('src=') || distIndex.includes('href=')) {
            console.log('   ✅ dist/index.html 存在');
            checks.push({ name: 'build output', status: 'ok' });
        }
    } catch (e) {
        console.log('   ⚠️  构建产物存在但无法验证');
    }
} else {
    console.log('   ℹ️  dist 目录不存在（运行 npm run build 后会出现）');
    checks.push({ name: 'build output', status: 'info' });
}

// 总结
console.log('\n' + '='.repeat(50));
console.log('📊 检查总结\n');

const okCount = checks.filter(c => c.status === 'ok').length;
const errorCount = checks.filter(c => c.status === 'error').length;
const warningCount = checks.filter(c => c.status === 'warning').length;

checks.forEach(check => {
    const icon = check.status === 'ok' ? '✅' : check.status === 'error' ? '❌' : check.status === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} ${check.name}: ${check.status}`);
});

console.log(`\n总计: ${okCount} 项通过, ${errorCount} 项错误, ${warningCount} 项警告\n`);

if (hasErrors) {
    console.log('❌ 发现配置错误，请修复后重试');
    console.log('\n💡 提示:');
    console.log('   - 确保 vite.config.ts 包含 base 配置');
    console.log('   - 确保 src/main.tsx 中 BrowserRouter 有 basename 属性');
    console.log('   - 运行 npm run build 测试构建');
    process.exit(1);
} else {
    console.log('✅ 所有关键配置检查通过！');
    console.log('\n💡 下一步:');
    console.log('   1. 运行 npm run build 进行构建测试');
    console.log('   2. 运行 npm run preview 本地预览构建结果');
    console.log('   3. 运行 npm run deploy 部署到 GitHub Pages');
    console.log('\n📝 注意:');
    console.log('   - 如果部署到子目录，设置 VITE_BASE_PATH 环境变量');
    console.log('   - 例如: VITE_BASE_PATH=/my_web/ npm run build');
    process.exit(0);
}

