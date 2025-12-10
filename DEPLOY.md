# GitHub Pages 部署指南

本项目已配置支持 GitHub Pages 部署。

## 部署步骤

### 1. 配置 Base Path

根据你的 GitHub Pages 部署方式，设置正确的 base path：

#### 方式一：部署到 `username.github.io` 仓库（根目录）
```bash
# 无需设置环境变量，默认使用 "/"
npm run build
npm run deploy
```

#### 方式二：部署到其他仓库（子目录）
例如仓库名为 `my_web`，URL 为 `username.github.io/my_web/`：

**Linux/Mac:**
```bash
VITE_BASE_PATH=/my_web/ npm run build
npm run deploy
```

**Windows (PowerShell):**
```powershell
$env:VITE_BASE_PATH="/my_web/"; npm run build
npm run deploy
```

或者创建 `.env.production` 文件：
```
VITE_BASE_PATH=/my_web/
```

然后运行：
```bash
npm run build
npm run deploy
```

### 2. 部署到 GitHub Pages

运行部署命令：
```bash
npm run deploy
```

这会自动：
1. 执行 `predeploy` 脚本（构建项目）
2. 将 `dist` 目录部署到 GitHub Pages

### 3. 在 GitHub 仓库中启用 Pages

1. 进入仓库的 Settings 页面
2. 找到 Pages 设置
3. 选择 Source 为 `gh-pages` 分支
4. 选择根目录 (`/`)
5. 保存设置

### 4. 访问你的网站

- 如果是 `username.github.io` 仓库：`https://username.github.io`
- 如果是其他仓库：`https://username.github.io/repository-name`

## 注意事项

1. 确保 `VITE_BASE_PATH` 的值以 `/` 开头并以 `/` 结尾（根目录除外）
2. 首次部署后，GitHub Pages 可能需要几分钟才能生效
3. 项目已包含 `.nojekyll` 文件，避免 Jekyll 处理下划线开头的文件
4. 路由使用 BrowserRouter，确保 base path 配置正确

## 故障排除

如果遇到路由 404 问题：
- 检查 `vite.config.ts` 中的 base 配置
- 检查 `src/main.tsx` 中的 basename 配置
- 确保构建时使用了正确的 `VITE_BASE_PATH` 环境变量

