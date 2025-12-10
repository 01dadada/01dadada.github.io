# GitHub Pages 部署指南

本项目已配置支持 GitHub Pages 部署，支持两种部署方式：
- **方式 A：使用 GitHub Actions 自动部署（推荐）**
- **方式 B：使用 `gh-pages` 命令手动部署**

## 方式 A：使用 GitHub Actions 自动部署（推荐）

项目已配置 GitHub Actions 工作流，当你推送代码到 `main` 或 `master` 分支时，会自动构建并部署到 GitHub Pages。

### 设置步骤

1. **确保 GitHub Actions 已启用**
   - 进入仓库的 Settings → Actions → General
   - 确保 Actions 权限已启用

2. **在 GitHub 仓库中启用 Pages**
   - 进入仓库的 Settings → Pages
   - Source 选择 `gh-pages` 分支
   - 选择根目录 (`/`)
   - 保存设置

3. **推送代码触发部署**
   ```bash
   git push origin main
   ```
   - 推送后，GitHub Actions 会自动运行
   - 查看 Actions 标签页可以监控部署进度
   - 工作流会根据仓库名称自动设置正确的 base path

4. **手动触发部署（可选）**
   - 进入仓库的 Actions 标签页
   - 选择 "Deploy to GitHub Pages" 工作流
   - 点击 "Run workflow" 按钮

### GitHub Actions 工作流特点

- ✅ 自动检测仓库类型（根域名或子目录）
- ✅ 自动设置正确的 `VITE_BASE_PATH`
- ✅ 使用 `gh-pages` 包进行部署
- ✅ 无需本地安装或配置

---

## 方式 B：使用 `gh-pages` 命令手动部署

如果你更喜欢手动控制部署过程，可以使用本地命令部署。

### 部署步骤

### 1. 配置 Base Path

根据你的 GitHub Pages 部署方式，设置正确的 base path：

#### 情况一：部署到 `username.github.io` 仓库（根目录）
```bash
# 无需设置环境变量，默认使用 "/"
npm run build
npm run deploy
```

#### 情况二：部署到其他仓库（子目录）
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

