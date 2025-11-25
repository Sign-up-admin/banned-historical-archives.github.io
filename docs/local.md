# 本地运行指南 / Local Setup Guide

本文档介绍如何在本地搭建和谐历史档案馆，支持两种部署方式：**Docker 版本**（推荐，内置搜索引擎）和**主机版本**（轻量，需额外配置）。

## 📋 前置条件检查清单 / Prerequisites Checklist

在开始安装前，请确保您的系统满足以下要求：

### 系统要求 / System Requirements

#### Docker 版本 (推荐)

- ✅ Docker >= 20.10.0 或 Docker Desktop
- ✅ 至少 4GB 可用内存
- ✅ 至少 10GB 可用磁盘空间
- ✅ 网络连接正常（用于下载镜像和数据）

#### 主机版本

- ✅ Node.js >= 14.0.0 (推荐 18.x)
- ✅ npm >= 6.0.0 (推荐最新版本)
- ✅ Git >= 2.0.0 (用于下载数据)
- ✅ 至少 2GB 可用内存
- ✅ 至少 5GB 可用磁盘空间

### 环境检查命令 / Environment Check Commands

```bash
# 检查 Docker 版本
docker --version
docker compose version

# 检查 Node.js 版本
node --version
npm --version

# 检查 Git 版本
git --version

# 检查可用磁盘空间 (Linux/macOS)
df -h

# 检查可用磁盘空间 (Windows PowerShell)
Get-WmiObject -Class Win32_LogicalDisk | Select-Object Size,FreeSpace

# 检查网络连接
ping -c 4 google.com
```

### 端口检查 / Port Availability Check

确保以下端口未被占用：

- **3000**: 前端应用端口
- **9200**: Elasticsearch 端口 (仅 Docker 版本)

```bash
# 检查端口占用 (Linux/macOS)
netstat -tlnp | grep -E ':(3000|9200)'

# 检查端口占用 (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :9200
```

## 🐳 Docker 版本 (推荐) / Docker Version (Recommended)

Docker 版本提供完整功能，包括内置的本地搜索引擎，适合大多数用户。

### 详细步骤 / Detailed Steps

#### 1. 安装 Docker

访问 [Docker 官网](https://www.docker.com/get-started) 下载并安装 Docker Desktop。

#### 2. 下载项目

```bash
# 克隆主仓库
git clone https://github.com/banned-historical-archives/banned-historical-archives.github.io.git
cd banned-historical-archives.github.io
```

#### 3. 启动服务

```bash
# 启动所有服务 (后台运行)
docker compose up -d

# 查看启动日志
docker compose logs -f

# 查看特定服务日志
docker logs banned-historical-archives-app-1
```

#### 4. 等待初始化

初次启动时会自动：

- 下载和初始化 Elasticsearch
- 下载数据并建立索引
- 构建前端应用

这个过程可能需要 **10-30 分钟**，具体时间取决于网络速度。

#### 5. 访问应用

```bash
# 打开浏览器访问
http://localhost:3000
```

### 服务说明 / Service Description

Docker Compose 启动以下服务：

| 服务名 | 端口 | 说明 |
|--------|------|------|
| `app` | `3000` | Next.js 前端应用 |
| `elasticsearch` | `9200` | 全文搜索引擎 |
| `nginx` | `8000` | 反向代理 (可选) |

### 版本更新 / Version Update

```bash
# 停止当前服务
docker compose down

# 删除 Elasticsearch 数据卷 (如果需要重置索引)
docker volume rm banned-historical-archives_es-data

# 拉取最新镜像并启动
docker compose pull
docker compose up -d
```

### 故障排查 / Troubleshooting

#### 查看服务状态

```bash
# 查看所有服务状态
docker compose ps

# 查看服务日志
docker compose logs

# 查看 Elasticsearch 健康状态
curl http://localhost:9200/_cluster/health?pretty
```

#### 常见问题

- **端口被占用**: 修改 `docker-compose.yml` 中的端口映射
- **内存不足**: 增加 Docker Desktop 的内存分配
- **磁盘空间不足**: 清理 Docker 缓存 `docker system prune -a`

## 💻 主机版本 / Host Version

主机版本轻量级，但需要手动配置搜索引擎。

### 详细步骤 / Detailed Steps

#### 1. 安装 Node.js

访问 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。

#### 2. 下载项目

```bash
# 克隆主仓库
git clone https://github.com/banned-historical-archives/banned-historical-archives.github.io.git
cd banned-historical-archives.github.io
```

#### 3. 安装依赖

```bash
# 安装项目依赖
npm install

# 如果安装失败，尝试清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. 下载数据 (可选)

```bash
# 下载解析后的数据 (约 2-5GB)
npm run init-parsed

# 下载配置文件 (约 100MB)
npm run init-config

# 可选：下载原始文件 (很大，约 50GB+)
npm run init-raw

# 可选：下载 OCR 缓存
npm run init-ocr_cache
```

#### 5. 构建数据 (如果下载了数据)

```bash
# 构建索引文件
npm run build-indexes

# 构建文章 JSON 数据
npm run build-article-json

# 可选：构建 TXT 格式数据
npm run build-txt
```

#### 6. 构建前端

```bash
# 构建生产版本
npm run build

# 如果构建失败，检查内存
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 7. 启动服务器

```bash
# 使用内置服务器
npx serve@latest out -p 3000

# 或使用其他服务器
python -m http.server 3000 -d out
# 或
php -S localhost:3000 -t out
```

#### 8. 访问应用

```bash
# 打开浏览器访问
http://localhost:3000
```

### 开发模式 / Development Mode

```bash
# 启动开发服务器 (支持热重载)
npm run dev

# 访问 http://localhost:3000
```

## 🔧 环境变量配置 / Environment Configuration

### Docker 版本环境变量

在 `docker-compose.yml` 中可以配置：

```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - ES_URL=http://elasticsearch:9200
      - ES_USERNAME=elastic
      - ES_PASSWORD=password
```

### 主机版本环境变量

创建 `.env` 文件：

```bash
# Elasticsearch 配置 (如果使用本地搜索)
ES_URL=http://localhost:9200
ES_USERNAME=elastic
ES_PASSWORD=password

# 数据源配置
REPO_PREFIX=https://github.com/banned-historical-archives

# 其他配置
NODE_ENV=production
LOCAL_SEARCH_ENGINE=1
LOCAL_INDEXES=1
```

## 📊 数据下载进度说明 / Data Download Progress

### 进度监控

#### Docker 版本

```bash
# 查看下载进度
docker compose logs -f app

# 查看 Elasticsearch 索引进度
docker compose logs elasticsearch | grep -i index
```

#### 主机版本

```bash
# 查看 Git 下载进度
watch -n 5 'du -sh parsed/ config/'

# 查看构建进度
npm run build-indexes 2>&1 | tee build.log
```

### 数据大小估算

| 数据类型 | 大小 | 下载时间 | 用途 |
|----------|------|----------|------|
| `parsed/` | 2-5GB | 10-30分钟 | 解析后的数据 |
| `config/` | 100MB | 2-5分钟 | 配置文件 |
| `raw/` | 50GB+ | 数小时 | 原始文件 |
| `ocr_cache/` | 10GB+ | 30分钟+ | OCR 缓存 |

## 🔍 功能验证 / Feature Verification

### 基本功能检查

```bash
# 检查前端是否正常
curl http://localhost:3000

# 检查 API 响应 (如果有)
curl http://localhost:3000/api/health
```

### 搜索引擎检查 (Docker 版本)

```bash
# 检查 Elasticsearch 健康状态
curl http://localhost:9200/_cluster/health?pretty

# 测试搜索功能
curl "http://localhost:9200/article/_search?q=毛泽东&size=5"
```

### 数据完整性检查

```bash
# 检查索引文件是否存在
ls -la indexes/

# 检查 JSON 数据是否存在
ls -la json/ | head -10

# 检查构建输出
ls -la out/
```

## 🚨 常见问题及解决方案 / Common Issues & Solutions

### Docker 相关问题

**问题**: `docker compose up` 失败

```bash
# 解决方案：检查 Docker 服务状态
sudo systemctl status docker
sudo systemctl start docker

# 或重启 Docker Desktop
```

**问题**: 内存不足错误

```bash
# 解决方案：增加 Docker 内存分配
# Docker Desktop -> Settings -> Resources -> Memory
```

**问题**: 端口冲突

```bash
# 解决方案：修改 docker-compose.yml 端口映射
ports:
  - "3001:3000"  # 改为其他端口
```

### Node.js 相关问题

**问题**: `npm install` 失败

```bash
# 解决方案：清理缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**问题**: 构建内存不足

```bash
# 解决方案：增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**问题**: 权限错误

```bash
# 解决方案：使用 sudo (不推荐) 或修复权限
sudo npm install
# 或
sudo chown -R $(whoami) ~/.npm
```

### 数据下载问题

**问题**: Git 下载缓慢或失败

```bash
# 解决方案：使用代理或更换网络
export https_proxy=http://proxy.company.com:8080
npm run init-parsed

# 或分批下载
npm run init-parsed  # 只下载前几个仓库
```

**问题**: 磁盘空间不足

```bash
# 解决方案：检查并清理空间
df -h
docker system prune -a  # 清理 Docker
rm -rf ~/.npm/_cacache/*  # 清理 npm 缓存
```

### 访问问题

**问题**: 无法访问 http://localhost:3000

```bash
# 解决方案：检查服务状态和端口
docker compose ps
netstat -tlnp | grep 3000

# 检查防火墙
sudo ufw status
sudo firewall-cmd --list-all
```

## 📈 性能优化 / Performance Optimization

### Docker 版本优化

```yaml
# docker-compose.yml 优化配置
services:
  elasticsearch:
    environment:
      - "ES_JAVA_OPTS=-Xms2g -Xmx4g"  # 增加内存
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
```

### 主机版本优化

```bash
# 增加 Node.js 内存
export NODE_OPTIONS="--max-old-space-size=8192"

# 使用更快的包管理器
npm install --prefer-offline

# 并行构建
npm run build -- --concurrency 2
```

## 🔄 升级与维护 / Upgrade & Maintenance

### 定期更新

```bash
# Docker 版本
docker compose pull
docker compose up -d

# 主机版本
git pull origin master
npm install
npm run build
```

### 备份数据

```bash
# Docker 数据卷备份
docker run --rm -v banned-historical-archives_es-data:/data -v $(pwd):/backup alpine tar czf /backup/es-backup.tar.gz -C /data .

# 配置文件备份
cp docker-compose.yml docker-compose.yml.backup
cp .env .env.backup
```

## 📞 获取帮助 / Getting Help

如果遇到问题，请：

1. 查看本文档的故障排查部分
2. 查看 [GitHub Issues](https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues)
3. 提交新的 Issue 描述问题

---

## 📝 相关文档 / Related Documentation

- [本地搜索引擎配置](./local-search-engine.md)
- [开发环境搭建](./dev.md)
- [部署指南](./DEPLOYMENT.md)
- [故障排查](./TROUBLESHOOTING.md)
- [贡献指南](../CONTRIBUTING.md)
