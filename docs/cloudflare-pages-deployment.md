# Cloudflare Pages 部署指南
# Cloudflare Pages Deployment Guide

本文档介绍如何在Cloudflare Pages上部署和谐历史档案馆，包括设置、配置和故障排查。

This document describes how to deploy the Banned Historical Archives on Cloudflare Pages, including setup, configuration, and troubleshooting.

## 📋 目录 / Table of Contents

- [快速开始 / Quick Start](#快速开始--quick-start)
- [Cloudflare 账户设置 / Cloudflare Account Setup](#cloudflare-账户设置--cloudflare-account-setup)
- [GitHub 仓库配置 / GitHub Repository Configuration](#github-仓库配置--github-repository-configuration)
- [本地开发 / Local Development](#本地开发--local-development)
- [部署流程 / Deployment Process](#部署流程--deployment-process)
- [故障排查 / Troubleshooting](#故障排查--troubleshooting)

## 🚀 快速开始 / Quick Start

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler auth login
```

### 3. 创建项目

```bash
wrangler pages project create banned-historical-archives
```

### 4. 部署测试

```bash
npm run build
npm run cf:deploy
```

## 🔧 Cloudflare 账户设置 / Cloudflare Account Setup

### 创建 API Token

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击右上角头像 → "My Profile"
3. 选择左侧 "API Tokens"
4. 点击 "Create Token"
5. 选择 "Edit Cloudflare Workers" 模板，或自定义权限：
   - Account: Cloudflare Pages:Edit
   - Zone: Page Rules:Edit (如果需要)
6. 点击 "Continue to summary" → "Create Token"
7. **保存 Token，之后不会再显示**

### 获取 Account ID

在 API Tokens 页面，Account ID 会显示在页面顶部。

## 🐙 GitHub 仓库配置 / GitHub Repository Configuration

### 添加 Secrets

在 GitHub 仓库中添加以下 Secrets：

1. 访问仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下 Secrets：

```
Name: CLOUDFLARE_API_TOKEN
Value: [你的 Cloudflare API Token]

Name: CLOUDFLARE_ACCOUNT_ID
Value: [你的 Cloudflare Account ID]
```

### 验证工作流

工作流文件已创建：`.github/workflows/cf-pages-deploy.yml`

工作流功能：
- **PR 创建**：自动生成预览部署
- **推送到主分支**：部署到生产环境
- **PR 关闭**：清理预览环境

## 💻 本地开发 / Local Development

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 本地预览构建

```bash
# 构建项目
npm run build

# 本地预览 Cloudflare Pages 构建
npm run cf:dev
```

### 手动部署测试

```bash
# 构建项目
npm run build

# 部署到 Cloudflare Pages
npm run cf:deploy
```

## 🚀 部署流程 / Deployment Process

### 自动部署

#### 预览部署（PR）

1. 创建 Pull Request
2. GitHub Actions 自动触发构建
3. 部署到预览环境
4. 在 PR 评论中显示预览 URL

#### 生产部署（主分支）

1. 合并 PR 到 master 分支
2. GitHub Actions 自动触发构建
3. 部署到生产环境
4. 更新部署状态

### 手动部署

```bash
# 构建项目
npm run build

# 部署到预览环境
wrangler pages deploy out --project-name=banned-historical-archives

# 部署到生产环境
wrangler pages deploy out --project-name=banned-historical-archives --production
```

## ⚙️ 高级配置 / Advanced Configuration

### 自定义域名

1. 在 Cloudflare Pages 项目设置中添加域名
2. 在域名 DNS 设置中添加 CNAME 记录：
   ```
   CNAME your-domain.com -> banned-historical-archives.pages.dev
   ```

### 环境变量

在 Cloudflare Pages 项目设置中添加环境变量：

- `NODE_ENV`: production
- `LOCAL_SEARCH_ENGINE`: 0
- `LOCAL_INDEXES`: 0

### 构建配置

在 `wrangler.toml` 中可以自定义：

```toml
# 构建超时时间
pages_build_output_dir = "out"

# 环境变量
[vars]
CUSTOM_VAR = "value"
```

## 📊 监控和分析 / Monitoring and Analytics

### Cloudflare Analytics

在 Cloudflare Pages 项目页面查看：
- 访问统计
- 性能指标
- 错误日志

### 自定义监控

```javascript
// 在应用中添加性能监控
if (typeof window !== 'undefined') {
  // Web Vitals 监控
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}
```

## 🔧 故障排查 / Troubleshooting

### 常见问题

#### 1. 构建失败

**错误**: `Build failed`

**解决方案**:
```bash
# 检查构建日志
npm run build

# 检查依赖
npm ci

# 检查 Node.js 版本
node --version  # 应为 20.x
```

#### 2. 部署失败

**错误**: `Deployment failed`

**解决方案**:
```bash
# 检查 API Token 和 Account ID
wrangler whoami

# 检查项目是否存在
wrangler pages project list

# 手动部署测试
npm run cf:deploy
```

#### 3. 预览 URL 无法访问

**错误**: `Preview URL not accessible`

**解决方案**:
- 检查 PR 是否仍然打开
- 等待构建完成（通常需要 2-5 分钟）
- 检查构建日志中的错误信息

#### 4. 生产环境无法访问

**错误**: `Production site not accessible`

**解决方案**:
```bash
# 检查生产部署状态
wrangler pages deployment list banned-historical-archives

# 重新部署
npm run build
npm run cf:deploy -- --production
```

### 日志查看

#### GitHub Actions 日志
1. 访问仓库 → Actions
2. 点击最近的工作流运行
3. 查看每个步骤的日志

#### Cloudflare Pages 日志
1. 访问 Cloudflare Pages 项目
2. 点击 "Functions" 标签（如果有）
3. 查看实时日志

### 性能问题

#### 构建时间过长

**优化方案**:
```bash
# 启用构建缓存
# 在 wrangler.toml 中添加
[build]
command = "npm run build"
cwd = "."

# 或者使用 GitHub Actions 缓存
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

#### 页面加载慢

**优化方案**:
- 启用 CDN 缓存
- 优化图片和资源
- 使用 Next.js 的优化特性

## 📚 相关文档 / Related Documentation

- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 🆘 获取帮助 / Getting Help

如果遇到问题，请：

1. 查看本文档的故障排查部分
2. 检查 GitHub Actions 日志
3. 查看 Cloudflare Pages 项目日志
4. 在 GitHub Issues 中提交问题

---

**最后更新 / Last Updated**: 2025年1月
**维护者 / Maintainers**: 开发团队
