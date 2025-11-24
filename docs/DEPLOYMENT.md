# 部署指南 / Deployment Guide

本文档介绍如何在生产环境中部署和谐历史档案馆，包括服务器配置、监控、备份等完整部署方案。

## 📋 目录 / Table of Contents

- [🏗️ 部署架构 / Deployment Architecture](#-部署架构--deployment-architecture)
- [💻 服务器要求 / Server Requirements](#-服务器要求--server-requirements)
- [🐳 Docker 部署 / Docker Deployment](#-docker-部署--docker-deployment)
- [🌐 Web 服务器配置 / Web Server Configuration](#-web-服务器配置--web-server-configuration)
- [🔒 SSL 配置 / SSL Configuration](#-ssl-配置--ssl-configuration)
- [📊 监控和日志 / Monitoring & Logging](#-监控和日志--monitoring--logging)
- [💾 备份和恢复 / Backup & Recovery](#-备份和恢复--backup--recovery)
- [⚡ 性能优化 / Performance Optimization](#-性能优化--performance-optimization)
- [🚨 故障排查 / Troubleshooting](#-故障排查--troubleshooting)

## 🏗️ 部署架构 / Deployment Architecture

### 推荐架构 / Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    用户访问层 / User Access Layer           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                Cloudflare / CDN                     │    │
│  │  ┌─────────────────────────────────────────────────┐ │    │
│  │  │            Nginx 反向代理 / Reverse Proxy       │ │    │
│  │  │  ┌─────────────────────────────────────────────┐ │ │    │
│  │  │  │   Next.js 应用 (Port 3000)                │ │ │    │
│  │  │  └─────────────────────────────────────────────┘ │ │    │
│  │  └─────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                                   │
                                   ▼ HTTP 请求
┌─────────────────────────────────────────────────────────────┐
│                 数据访问层 / Data Access Layer              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         GitHub Raw Content API                    │    │
│  │  ┌─────────────────────────────────────────────────┐ │    │
│  │  │   json 分支: 文章数据                        │ │    │
│  │  │   indexes 分支: 索引数据                     │ │    │
│  │  └─────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                                   │ (可选)
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│               搜索引擎层 / Search Engine Layer             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Elasticsearch (Docker)                    │    │
│  │  ┌─────────────────────────────────────────────────┐ │    │
│  │  │   全文搜索索引                               │ │    │
│  │  │   实时搜索功能                               │ │    │
│  │  └─────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 部署选项 / Deployment Options

#### 选项一：GitHub Pages (推荐)
- **优点**: 免费、无需服务器维护
- **缺点**: 功能受限、无本地搜索
- **适用**: 基础版本展示

#### 选项二：VPS + Docker
- **优点**: 功能完整、性能好
- **缺点**: 需要服务器维护费用
- **适用**: 完整功能部署

#### 选项三：云服务
- **优点**: 高可用、弹性伸缩
- **缺点**: 成本较高
- **适用**: 大规模使用

## 💻 服务器要求 / Server Requirements

### 最低配置 / Minimum Requirements

| 组件 | 配置 | 说明 |
|------|------|------|
| **CPU** | 2核 | 用于应用运行和构建 |
| **内存** | 4GB | Node.js + Elasticsearch |
| **磁盘** | 20GB SSD | 数据存储和缓存 |
| **网络** | 100Mbps | 数据下载和访问 |
| **操作系统** | Ubuntu 20.04+ | LTS 版本推荐 |

### 推荐配置 / Recommended Configuration

| 组件 | 配置 | 说明 |
|------|------|------|
| **CPU** | 4核+ | 并行处理能力 |
| **内存** | 8GB+ | 搜索索引和缓存 |
| **磁盘** | 100GB+ SSD | 大量数据存储 |
| **网络** | 1Gbps | 高并发访问 |
| **操作系统** | Ubuntu 22.04 LTS | 最新 LTS 版本 |

### 系统优化 / System Optimization

#### Ubuntu/Debian 系统配置

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y curl wget git htop iotop ncdu

# 配置时区
sudo timedatectl set-timezone Asia/Shanghai

# 配置防火墙
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Node.js (开发)
```

#### 内核参数优化

```bash
# /etc/sysctl.conf
# 增加文件句柄限制
fs.file-max = 2097152
fs.nr_open = 2097152

# 网络优化
net.core.somaxconn = 65536
net.ipv4.tcp_max_syn_backlog = 65536
net.ipv4.ip_local_port_range = 1024 65535

# 内存优化
vm.swappiness = 10
vm.dirty_ratio = 60
vm.dirty_background_ratio = 2

# 应用配置
sudo sysctl -p
```

#### 用户和权限配置

```bash
# 创建部署用户
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy

# 配置 SSH
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys

# 配置 sudo 无密码
echo "deploy ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/deploy
```

## 🐳 Docker 部署 / Docker Deployment

### Docker 环境准备

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker deploy

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker compose version
```

### 应用部署

#### 1. 下载项目

```bash
# 以 deploy 用户身份操作
su - deploy

# 下载项目
git clone https://github.com/banned-historical-archives/banned-historical-archives.github.io.git
cd banned-historical-archives.github.io

# 切换到稳定版本 (可选)
git checkout v1.0.0  # 替换为实际版本
```

#### 2. 配置环境变量

```bash
# 创建环境文件
cat > .env << 'EOF'
# 应用配置
NODE_ENV=production
PORT=3000

# Elasticsearch 配置 (如果使用)
ES_URL=http://elasticsearch:9200
ES_USERNAME=elastic
ES_PASSWORD=your-secure-password

# 功能开关
LOCAL_SEARCH_ENGINE=1
LOCAL_INDEXES=1

# 安全配置
SECRET_KEY=your-secret-key-here

# 监控配置
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
EOF

# 设置权限
chmod 600 .env
```

#### 3. 修改 Docker Compose 配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: node:18-alpine
    container_name: banned-historical-archives-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
    env_file:
      - .env
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    working_dir: /app
    command: sh -c "npm ci --only=production && npm run build && npm start"
    depends_on:
      - elasticsearch
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.1
    container_name: banned-historical-archives-es
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms2g -Xmx4g"
      - xpack.security.enabled=false
      - xpack.monitoring.enabled=false
      - xpack.graph.enabled=false
      - xpack.watcher.enabled=false
      - xpack.ml.enabled=false
    ports:
      - "127.0.0.1:9200:9200"
    volumes:
      - es-data:/usr/share/elasticsearch/data
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  es-data:
    driver: local
```

#### 4. 启动服务

```bash
# 启动服务
docker compose up -d

# 查看启动状态
docker compose ps

# 查看日志
docker compose logs -f

# 验证服务健康状态
curl http://localhost:3000
curl http://localhost:9200/_cluster/health
```

#### 5. 初始化数据

```bash
# 下载数据
docker compose exec app npm run init-parsed
docker compose exec app npm run init-config

# 构建索引
docker compose exec app npm run build-indexes
docker compose exec app npm run build-article-json

# 初始化搜索索引
docker compose exec app npm run init-es
```

### 自动化部署脚本

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 开始部署..."

# 拉取最新代码
git pull origin main

# 停止服务
docker compose down

# 清理旧镜像
docker image prune -f

# 重新构建
docker compose build --no-cache

# 启动服务
docker compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 健康检查
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 部署成功!"
else
    echo "❌ 部署失败!"
    docker compose logs
    exit 1
fi

# 清理
docker system prune -f

echo "🎉 部署完成!"
```

## 🌐 Web 服务器配置 / Web Server Configuration

### Nginx 配置

#### 基础配置

```nginx
# /etc/nginx/sites-available/banned-historical-archives
server {
    listen 80;
    server_name your-domain.com;

    # 日志
    access_log /var/log/nginx/banned-historical-archives.access.log;
    error_log /var/log/nginx/banned-historical-archives.error.log;

    # 静态文件缓存
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 主应用
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

#### 启用站点

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/banned-historical-archives /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

### 性能优化配置

```nginx
# /etc/nginx/nginx.conf

user www-data;
worker_processes auto;
worker_rlimit_nofile 65536;

events {
    worker_connections 65536;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        application/atom+xml
        application/geo+json
        application/javascript
        application/x-javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rdf+xml
        application/rss+xml
        application/xhtml+xml
        application/xml
        font/eot
        font/otf
        font/ttf
        image/svg+xml
        text/css
        text/javascript
        text/plain
        text/xml;

    # 缓存设置
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m use_temp_path=off;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

## 🔒 SSL 配置 / SSL Configuration

### Let's Encrypt 自动证书

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 生成证书
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL 配置

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # 其余配置与 HTTP 相同
    # ...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 监控和日志 / Monitoring & Logging

### 系统监控

#### 基础监控工具

```bash
# 安装监控工具
sudo apt install htop iotop ncdu sysstat

# 系统状态检查
htop                    # 实时系统监控
iostat -x 1            # IO 统计
free -h                # 内存使用
df -h                  # 磁盘使用
ss -tlnp              # 网络连接
```

#### 应用监控

```bash
# Docker 容器监控
docker stats

# 应用日志
docker compose logs -f app

# 性能监控
npm install -g clinic
clinic doctor -- node server.js
```

### 日志管理

#### 日志轮转配置

```bash
# /etc/logrotate.d/banned-historical-archives
/var/log/nginx/banned-historical-archives*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data adm
    postrotate
        systemctl reload nginx
    endscript
}
```

#### 集中日志

```bash
# 安装 rsyslog
sudo apt install rsyslog

# 配置应用日志
cat >> /etc/rsyslog.d/banned-historical-archives.conf << EOF
# 应用日志
input(type="imfile"
      File="/var/log/banned-historical-archives/app.log"
      Tag="banned-historical-archives-app"
      Severity="info"
      Facility="local0")

# Nginx 日志
input(type="imfile"
      File="/var/log/nginx/banned-historical-archives.access.log"
      Tag="banned-historical-archives-nginx"
      Severity="info"
      Facility="local1")
EOF

sudo systemctl restart rsyslog
```

### 健康检查

#### 应用健康检查脚本

```bash
#!/bin/bash
# health-check.sh

# 检查应用健康状态
if ! curl -f -s http://localhost:3000/api/health > /dev/null; then
    echo "❌ 应用健康检查失败"
    exit 1
fi

# 检查 Elasticsearch
if ! curl -f -s http://localhost:9200/_cluster/health | grep -q '"status":"green"\|"status":"yellow"'; then
    echo "❌ Elasticsearch 健康检查失败"
    exit 1
fi

# 检查磁盘空间
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    echo "❌ 磁盘空间不足: ${DISK_USAGE}%"
    exit 1
fi

# 检查内存使用
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ "$MEMORY_USAGE" -gt 90 ]; then
    echo "❌ 内存使用过高: ${MEMORY_USAGE}%"
    exit 1
fi

echo "✅ 所有健康检查通过"
```

#### 定时监控

```bash
# 添加到 crontab
crontab -e

# 每5分钟检查一次
*/5 * * * * /path/to/health-check.sh >> /var/log/health-check.log 2>&1

# 每天生成系统报告
0 2 * * * /path/to/generate-system-report.sh
```

## 💾 备份和恢复 / Backup & Recovery

### 数据备份策略

#### 自动备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/opt/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "开始备份..."

# 备份应用数据
docker run --rm \
  -v banned-historical-archives_app-data:/data \
  -v "$BACKUP_DIR:/backup" \
  alpine tar czf /backup/app-data.tar.gz -C /data .

# 备份 Elasticsearch 数据
docker run --rm \
  -v banned-historical-archives_es-data:/data \
  -v "$BACKUP_DIR:/backup" \
  alpine tar czf /backup/es-data.tar.gz -C /data .

# 备份配置文件
cp -r /opt/banned-historical-archives/config "$BACKUP_DIR/"
cp /opt/banned-historical-archives/docker-compose.yml "$BACKUP_DIR/"
cp /opt/banned-historical-archives/.env "$BACKUP_DIR/"

# 备份数据库 (如果有)
# mysqldump -u root -p database > "$BACKUP_DIR/database.sql"

# 压缩备份
cd /opt/backups
tar czf "$(basename "$BACKUP_DIR")".tar.gz "$(basename "$BACKUP_DIR")"

# 清理旧备份 (保留7天)
find /opt/backups -name "*.tar.gz" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR"
```

#### 备份验证

```bash
#!/bin/bash
# verify-backup.sh

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "用法: $0 <备份文件>"
    exit 1
fi

echo "验证备份文件: $BACKUP_FILE"

# 检查文件完整性
if ! tar -tzf "$BACKUP_FILE" > /dev/null; then
    echo "❌ 备份文件损坏"
    exit 1
fi

# 检查关键文件
if ! tar -tf "$BACKUP_FILE" | grep -q "docker-compose.yml"; then
    echo "❌ 缺少配置文件"
    exit 1
fi

if ! tar -tf "$BACKUP_FILE" | grep -q "es-data.tar.gz"; then
    echo "❌ 缺少 Elasticsearch 数据"
    exit 1
fi

echo "✅ 备份验证通过"
```

### 恢复流程

#### 完整恢复脚本

```bash
#!/bin/bash
# restore.sh

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "用法: $0 <备份文件>"
    exit 1
fi

echo "开始恢复: $BACKUP_FILE"

# 停止服务
cd /opt/banned-historical-archives
docker compose down

# 创建临时目录
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# 解压备份
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# 恢复配置文件
cp "$TEMP_DIR/docker-compose.yml" .
cp "$TEMP_DIR/.env" .

# 恢复应用数据
docker run --rm \
  -v banned-historical-archives_app-data:/data \
  -v "$TEMP_DIR/app-data.tar.gz:/backup/app-data.tar.gz" \
  alpine sh -c "cd /data && tar xzf /backup/app-data.tar.gz"

# 恢复 Elasticsearch 数据
docker run --rm \
  -v banned-historical-archives_es-data:/data \
  -v "$TEMP_DIR/es-data.tar.gz:/backup/es-data.tar.gz" \
  alpine sh -c "cd /data && tar xzf /backup/es-data.tar.gz"

# 启动服务
docker compose up -d

# 验证恢复
sleep 30
if curl -f http://localhost:3000 > /dev/null; then
    echo "✅ 恢复成功"
else
    echo "❌ 恢复失败"
    docker compose logs
    exit 1
fi
```

#### 备份调度

```bash
# /etc/cron.d/banned-historical-archives-backup
# 每天凌晨2点备份
0 2 * * * deploy /opt/banned-historical-archives/scripts/backup.sh

# 每周日凌晨3点验证备份
0 3 * * 0 deploy /opt/banned-historical-archives/scripts/verify-backup.sh /opt/backups/latest.tar.gz

# 每月1号凌晨4点清理旧备份
0 4 1 * * deploy find /opt/backups -name "*.tar.gz" -mtime +30 -delete
```

## ⚡ 性能优化 / Performance Optimization

### 应用层优化

#### Node.js 优化

```bash
# 生产环境配置
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=4096"

# PM2 进程管理
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 缓存优化

```typescript
// next.config.js
module.exports = {
  // 静态优化
  swcMinify: true,
  compress: true,

  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // 缓存控制
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};
```

### 数据库优化

#### Elasticsearch 优化

```yaml
# elasticsearch.yml
cluster.name: banned-historical-archives
node.name: node-1
path.data: /usr/share/elasticsearch/data
path.logs: /usr/share/elasticsearch/logs

# 内存配置
bootstrap.memory_lock: true

# 索引优化
index.refresh_interval: 30s
index.number_of_shards: 1
index.number_of_replicas: 0

# 搜索优化
search.max_open_scroll_context: 5000
```

#### 查询优化

```typescript
// 优化的搜索查询
const searchQuery = {
  index: 'article',
  body: {
    query: {
      bool: {
        must: [
          {
            match: {
              content: {
                query: searchTerm,
                operator: 'and',
                fuzziness: 'AUTO'
              }
            }
          }
        ],
        should: [
          {
            match: {
              title: {
                query: searchTerm,
                boost: 2
              }
            }
          }
        ]
      }
    },
    highlight: {
      fields: {
        content: {},
        title: {}
      },
      fragment_size: 150,
      number_of_fragments: 3
    },
    size: 20,
    from: (page - 1) * 20
  }
};
```

### 前端优化

#### CDN 配置

```javascript
// next.config.js
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.example.com' : '',
};
```

#### 懒加载和代码分割

```typescript
// 路由懒加载
const ArticlePage = lazy(() => import('../pages/article'));

// 组件懒加载
const HeavyComponent = lazy(() => import('../components/HeavyComponent'));

// 数据懒加载
const useLazyData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetch('/api/data');
      setData(await result.json());
    };

    loadData();
  }, []);

  return data;
};
```

## 🚨 故障排查 / Troubleshooting

### 常见部署问题

#### 服务启动失败

**问题**: `docker compose up` 失败
```bash
# 检查 Docker 服务
sudo systemctl status docker

# 检查端口占用
netstat -tlnp | grep :3000

# 查看详细日志
docker compose up  # 不使用 -d 查看错误
```

#### 应用无法访问

**问题**: 无法访问 http://localhost:3000
```bash
# 检查容器状态
docker compose ps

# 检查应用日志
docker compose logs app

# 检查网络配置
docker network ls
docker inspect bridge
```

#### Elasticsearch 连接失败

**问题**: 搜索功能不工作
```bash
# 检查 Elasticsearch 状态
curl http://localhost:9200/_cluster/health

# 检查索引
curl http://localhost:9200/_cat/indices

# 重置索引
docker compose exec app npm run init-es reset
```

#### 内存不足

**问题**: 应用崩溃或响应慢
```bash
# 检查内存使用
free -h
docker stats

# 增加 Docker 内存限制
# Docker Desktop -> Settings -> Resources -> Memory

# 优化应用配置
export NODE_OPTIONS="--max-old-space-size=2048"
```

### 性能问题诊断

#### CPU 使用率高

```bash
# 查找高 CPU 进程
ps aux --sort=-%cpu | head -10

# 检查 Docker 容器 CPU
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# 分析 Node.js 性能
npm install -g clinic
clinic doctor -- node server.js
```

#### 内存泄漏

```bash
# 监控内存使用
docker stats

# 生成堆快照
node --inspect --max-old-space-size=4096 server.js

# 使用 Chrome DevTools 分析
```

#### 磁盘 IO 问题

```bash
# 检查 IO 统计
iostat -x 1

# 检查磁盘使用
df -h
du -sh /opt/banned-historical-archives/*

# 优化 Elasticsearch IO
# elasticsearch.yml
index.store.type: mmapfs
```

### 网络问题

#### 连接超时

```bash
# 检查网络连接
ping github.com
curl -I https://raw.githubusercontent.com

# 配置代理 (如果需要)
export https_proxy=http://proxy.company.com:8080

# 增加超时时间
export COMPOSE_HTTP_TIMEOUT=300
```

#### SSL 证书问题

```bash
# 检查证书状态
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# 续期证书
sudo certbot renew

# 检查证书文件
ls -la /etc/letsencrypt/live/your-domain.com/
```

### 恢复策略

#### 快速恢复

```bash
# 1. 停止故障服务
docker compose down

# 2. 清理缓存
docker system prune -f

# 3. 重启服务
docker compose up -d

# 4. 检查状态
docker compose ps
curl http://localhost:3000
```

#### 完整恢复

```bash
# 1. 从备份恢复
./restore.sh /opt/backups/latest.tar.gz

# 2. 验证数据完整性
./verify-backup.sh /opt/backups/latest.tar.gz

# 3. 重建索引
docker compose exec app npm run build-indexes
docker compose exec app npm run init-es
```

---

## 📚 相关文档 / Related Documentation

- [本地运行指南](./local.md)
- [故障排查](./TROUBLESHOOTING.md)
- [监控指南](./MONITORING.md)
- [备份恢复](./BACKUP.md)

---

**注意**: 生产环境部署需要考虑安全、备份、监控等多个方面。建议在测试环境充分验证后再部署到生产环境。
