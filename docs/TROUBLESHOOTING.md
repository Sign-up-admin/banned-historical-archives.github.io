# 故障排查指南 / Troubleshooting Guide

本文档提供常见问题的诊断和解决方法，帮助用户快速定位和修复部署和使用中的问题。

## 📋 目录 / Table of Contents

- [🔍 问题诊断流程 / Problem Diagnosis Process](#-问题诊断流程--problem-diagnosis-process)
- [🐳 Docker 相关问题 / Docker Issues](#-docker-相关问题--docker-issues)
- [📦 数据下载问题 / Data Download Issues](#-数据下载问题--data-download-issues)
- [🔧 构建和编译问题 / Build & Compilation Issues](#-构建和编译问题--build--compilation-issues)
- [🔍 搜索功能问题 / Search Function Issues](#-搜索功能问题--search-function-issues)
- [🌐 网络连接问题 / Network Connection Issues](#-🌐-网络连接问题--network-connection-issues)
- [⚡ 性能问题 / Performance Issues](#-⚡-性能问题--performance-issues)
- [🔒 权限和安全问题 / Permission & Security Issues](#-🔒-权限和安全问题--permission--security-issues)
- [📊 监控和日志 / Monitoring & Logging](#-📊-监控和日志--monitoring--logging)
- [🆘 获取帮助 / Getting Help](#--获取帮助--getting-help)

## 🔍 问题诊断流程 / Problem Diagnosis Process

### 系统性诊断步骤

#### 1. 收集基本信息

```bash
# 系统信息
uname -a
cat /etc/os-release

# Docker 版本
docker --version
docker compose version

# Node.js 版本
node --version
npm --version

# Git 版本
git --version

# 当前目录和权限
pwd
ls -la
whoami
```

#### 2. 检查服务状态

```bash
# Docker 服务状态
sudo systemctl status docker

# 容器状态
docker ps -a

# 应用进程
ps aux | grep node
ps aux | grep docker

# 端口占用
netstat -tlnp | grep -E ':(3000|9200|80|443)'
```

#### 3. 查看日志

```bash
# 系统日志
sudo journalctl -u docker -f

# 应用日志
docker compose logs -f

# Nginx 日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

#### 4. 网络诊断

```bash
# 网络连接测试
ping -c 4 google.com
curl -I https://github.com

# DNS 解析
nslookup github.com
nslookup raw.githubusercontent.com

# 代理设置检查
env | grep -i proxy
```

### 快速诊断脚本

```bash
#!/bin/bash
# diagnose.sh

echo "=== 系统诊断 ==="
echo "操作系统: $(uname -a)"
echo "Docker: $(docker --version 2>/dev/null || echo '未安装')"
echo "Node.js: $(node --version 2>/dev/null || echo '未安装')"
echo "Git: $(git --version 2>/dev/null || echo '未安装')"

echo -e "\n=== Docker 状态 ==="
if command -v docker &> /dev/null; then
    echo "Docker 服务: $(sudo systemctl is-active docker 2>/dev/null || echo '未知')"
    echo "运行中容器: $(docker ps | wc -l) 个"
    echo "所有容器: $(docker ps -a | wc -l) 个"
else
    echo "Docker 未安装"
fi

echo -e "\n=== 网络连接 ==="
if ping -c 1 google.com &> /dev/null; then
    echo "互联网连接: ✅"
else
    echo "互联网连接: ❌"
fi

if curl -s --max-time 10 https://github.com > /dev/null; then
    echo "GitHub 连接: ✅"
else
    echo "GitHub 连接: ❌"
fi

echo -e "\n=== 磁盘空间 ==="
df -h | grep -E '^/|Filesystem'

echo -e "\n=== 内存使用 ==="
free -h

echo -e "\n=== 端口占用 ==="
netstat -tlnp 2>/dev/null | grep -E ':(3000|9200|80|443)' || echo "无相关端口占用"
```

## 🐳 Docker 相关问题 / Docker Issues

### Docker 服务无法启动

**问题现象**:

```
$ sudo systemctl start docker
Failed to start docker.service: Unit docker.service not found.
```

**解决方案**:

```bash
# 检查 Docker 是否安装
which docker
dpkg -l | grep docker

# 重新安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动服务
sudo systemctl enable docker
sudo systemctl start docker

# 添加用户到 docker 组
sudo usermod -aG docker $USER
# 重新登录或运行: newgrp docker
```

### 容器无法启动

**问题现象**:

```bash
$ docker compose up -d
ERROR: ... port already in use
```

**解决方案**:

```bash
# 检查端口占用
netstat -tlnp | grep :3000
netstat -tlnp | grep :9200

# 杀死占用进程
sudo kill -9 <PID>

# 或修改端口映射
# 编辑 docker-compose.yml
ports:
  - "3001:3000"  # 改为其他端口
```

### 容器内存不足

**问题现象**:

```
Docker: write /proc/self/attr/exec: no space left on device
```

**解决方案**:

```bash
# 检查系统内存
free -h

# 增加 Docker 内存限制 (Docker Desktop)
# Settings -> Resources -> Memory -> 增加到 4GB+

# 清理 Docker 缓存
docker system prune -a

# 重启 Docker 服务
sudo systemctl restart docker
```

### 镜像下载失败

**问题现象**:

```
ERROR: pull access denied for ..., repository does not exist or may require 'docker login'
```

**解决方案**:

```bash
# 检查网络连接
ping -c 4 registry-1.docker.io

# 配置镜像加速器 (中国用户)
# 编辑 /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}

# 重启 Docker
sudo systemctl restart docker

# 重新拉取镜像
docker compose pull
```

### 容器日志乱码

**问题现象**:
容器日志显示乱码字符

**解决方案**:

```bash
# 设置正确的编码
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

# 或在 docker-compose.yml 中设置
services:
  app:
    environment:
      - LANG=C.UTF-8
      - LC_ALL=C.UTF-8
```

## 📦 数据下载问题 / Data Download Issues

### Git 克隆失败

**问题现象**:

```
$ npm run init-parsed
fatal: repository 'https://github.com/banned-historical-archives/banned-historical-archives0.git' not found
```

**解决方案**:

```bash
# 检查网络连接
curl -I https://github.com

# 配置 Git 代理
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy http://proxy.company.com:8080

# 或者使用 SSH (需要配置 SSH 密钥)
git config --global url."git@github.com:".insteadOf "https://github.com/"

# 重试下载
npm run init-parsed
```

### 下载速度慢

**问题现象**:
数据下载非常缓慢

**解决方案**:

```bash
# 配置 Git 并发下载
git config --global core.compression 9
git config --global http.postBuffer 1048576000
git config --global http.maxRequestBuffer 100M

# 使用浅克隆 (只下载最新版本)
# 编辑 backend/init-sub-repository.ts
# 将 --depth 1 添加到 git clone 命令

# 分批下载
# 手动执行单个仓库
git clone --depth 1 --branch parsed https://github.com/banned-historical-archives/banned-historical-archives0.git parsed/archives0
```

### 数据完整性验证

**问题现象**:
下载的数据可能损坏或不完整

**解决方案**:

```bash
# 验证 Git 仓库完整性
cd parsed/archives0
git fsck

# 检查文件大小
find . -name "*.json" -exec ls -lh {} \;

# 验证 JSON 格式
find . -name "*.json" -exec python3 -m json.tool {} \; > /dev/null

# 重新下载损坏的数据
rm -rf parsed/archives0
npm run init-parsed
```

### 磁盘空间不足

**问题现象**:

```
No space left on device
```

**解决方案**:

```bash
# 检查磁盘使用情况
df -h

# 清理不需要的文件
sudo apt autoremove
sudo apt autoclean

# 删除 Docker 缓存
docker system prune -a

# 移动到更大磁盘
# 或只下载核心数据
npm run init-config  # 只下载配置数据
```

## 🔧 构建和编译问题 / Build & Compilation Issues

### Node.js 依赖安装失败

**问题现象**:

```
npm ERR! code ENOTFOUND
npm ERR! errno ENOTFOUND
```

**解决方案**:

```bash
# 检查网络连接
npm config get registry

# 配置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 或使用淘宝镜像
npm config set registry https://registry.npm.taobao.org

# 清理缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 构建内存不足

**问题现象**:

```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
```

**解决方案**:

```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 或在 package.json 中设置
"scripts": {
  "build": "NODE_OPTIONS=--max-old-space-size=4096 next build"
}

# 检查系统内存
free -h

# 关闭其他程序释放内存
```

### TypeScript 编译错误

**问题现象**:

```
error TS2307: Cannot find module 'react'
```

**解决方案**:

```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 检查 TypeScript 配置
cat tsconfig.json

# 检查类型定义
ls node_modules/@types/

# 清理 TypeScript 缓存
rm -rf .next
npm run build
```

### 构建产物异常

**问题现象**:
构建成功但页面显示异常

**解决方案**:

```bash
# 检查构建产物
ls -la out/

# 验证关键文件
cat out/index.html | head -20

# 检查静态资源
ls -la out/_next/static/

# 重新构建
rm -rf out .next
npm run build
```

## 🔍 搜索功能问题 / Search Function Issues

### Elasticsearch 连接失败

**问题现象**:
搜索功能无法使用，控制台显示连接错误

**解决方案**:

```bash
# 检查 Elasticsearch 状态
curl http://localhost:9200/_cluster/health

# 检查 Docker 容器
docker ps | grep elasticsearch

# 查看 Elasticsearch 日志
docker logs banned-historical-archives-es-1

# 重启 Elasticsearch
docker compose restart elasticsearch

# 检查端口映射
docker port banned-historical-archives-es-1
```

### 索引不存在

**问题现象**:

```
index_not_found_exception
```

**解决方案**:

```bash
# 检查索引状态
curl http://localhost:9200/_cat/indices

# 重新初始化索引
npm run init-es reset
npm run init-es

# 等待索引创建完成
sleep 30
curl http://localhost:9200/_cat/indices
```

### 搜索结果不准确

**问题现象**:
搜索结果不完整或不准确

**解决方案**:

```bash
# 检查索引文档数量
curl http://localhost:9200/article/_count

# 测试搜索查询
curl -X GET "http://localhost:9200/article/_search?q=毛泽东&size=5&pretty"

# 重建索引
npm run init-es reset
npm run build-indexes
npm run init-es
```

### 搜索性能慢

**问题现象**:
搜索响应时间过长

**解决方案**:

```bash
# 检查 Elasticsearch 性能
curl http://localhost:9200/_nodes/stats?pretty

# 优化索引设置
curl -X PUT "http://localhost:9200/article/_settings" \
  -H 'Content-Type: application/json' \
  -d '{"index": {"refresh_interval": "30s"}}'

# 增加内存分配
# 编辑 docker-compose.yml
environment:
  - "ES_JAVA_OPTS=-Xms2g -Xmx4g"
```

## 🌐 网络连接问题 / Network Connection Issues

### GitHub 访问受限

**问题现象**:
无法访问 GitHub 或下载速度慢

**解决方案**:

```bash
# 配置 GitHub 加速
# 编辑 /etc/hosts
# 添加 GitHub 相关域名解析
199.232.5.194 github.githubassets.com
140.82.114.4 github.com
199.232.68.133 raw.githubusercontent.com

# 或使用代理
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890

# 配置 Git 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

### CORS 错误

**问题现象**:
浏览器控制台显示 CORS 错误

**解决方案**:

```nginx
# Nginx 配置添加 CORS 头
location /api {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;

    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Max-Age' 1728000 always;
        add_header 'Content-Type' 'text/plain charset=UTF-8' always;
        add_header 'Content-Length' 0 always;
        return 204;
    }
}
```

### SSL 证书问题

**问题现象**:
HTTPS 证书验证失败

**解决方案**:

```bash
# 检查证书状态
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# 续期 Let's Encrypt 证书
sudo certbot renew

# 或暂时跳过 SSL 验证 (开发环境)
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

## ⚡ 性能问题 / Performance Issues

### 应用响应慢

**问题现象**:
页面加载缓慢，用户体验差

**解决方案**:

```bash
# 检查系统资源
top
iostat -x 1
free -h

# 优化 Node.js
export NODE_OPTIONS="--max-old-space-size=4096 --optimize-for-size"

# 启用 Gzip 压缩
# Nginx 配置
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# 优化静态资源缓存
location /_next/static {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 内存使用过高

**问题现象**:
应用内存占用持续增长

**解决方案**:

```bash
# 监控内存使用
docker stats

# 检查内存泄漏
npm install -g clinic
clinic doctor -- node server.js

# 优化代码
# 使用流式处理大文件
# 及时清理缓存
# 避免全局变量累积
```

### CPU 使用率高

**问题现象**:
系统 CPU 占用过高

**解决方案**:

```bash
# 查找高 CPU 进程
ps aux --sort=-%cpu | head -10

# 优化 Elasticsearch 查询
# 避免复杂正则表达式
# 使用过滤器缓存

# 启用请求限流
# Nginx 配置
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### 数据库查询慢

**问题现象**:
数据查询响应时间长

**解决方案**:

```bash
# 优化 Elasticsearch 查询
# 使用更精确的查询条件
# 添加适当的索引

# 检查查询性能
curl -X POST "http://localhost:9200/article/_search?profile=true" \
  -H 'Content-Type: application/json' \
  -d '{"query": {"match": {"content": "毛泽东"}}}'

# 优化映射设置
curl -X PUT "http://localhost:9200/article/_settings" \
  -H 'Content-Type: application/json' \
  -d '{"index": {"number_of_replicas": 0}}'
```

## 🔒 权限和安全问题 / Permission & Security Issues

### 文件权限错误

**问题现象**:

```
EACCES: permission denied
```

**解决方案**:

```bash
# 检查文件权限
ls -la

# 修复权限
sudo chown -R $USER:$USER .

# 设置正确的权限
find . -type f -name "*.sh" -exec chmod +x {} \;
chmod 644 *.md
chmod 755 scripts/
```

### Docker 权限问题

**问题现象**:

```
Got permission denied while trying to connect to the Docker daemon socket
```

**解决方案**:

```bash
# 添加用户到 docker 组
sudo usermod -aG docker $USER

# 重启会话或使用
newgrp docker

# 或使用 sudo
sudo docker compose up -d
```

### 安全漏洞

**问题现象**:
安全扫描工具报告漏洞

**解决方案**:

```bash
# 更新依赖
npm audit fix

# 更新 Docker 镜像
docker compose pull

# 检查安全配置
# 确保不使用默认密码
# 配置防火墙规则
# 启用 SSL/TLS
```

## 📊 监控和日志 / Monitoring & Logging

### 应用监控

```bash
# 设置日志轮转
# /etc/logrotate.d/banned-historical-archives
/var/log/banned-historical-archives/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        docker compose restart app
    endscript
}
```

### 性能监控

```bash
# 创建监控脚本
cat > monitor.sh << 'EOF'
#!/bin/bash

# CPU 使用率
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

# 内存使用率
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')

# 磁盘使用率
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

# 网络连接数
CONNECTIONS=$(netstat -t | wc -l)

echo "$(date): CPU=${CPU_USAGE}%, MEM=${MEMORY_USAGE}%, DISK=${DISK_USAGE}%, CONN=${CONNECTIONS}" >> /var/log/system-monitor.log

# 告警阈值
if (( $(echo "$CPU_USAGE > 90" | bc -l) )); then
    echo "CPU 使用率过高: ${CPU_USAGE}%" | mail -s "系统告警" admin@example.com
fi

if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
    echo "内存使用率过高: ${MEMORY_USAGE}%" | mail -s "系统告警" admin@example.com
fi
EOF

# 添加定时任务
crontab -e
# */5 * * * * /path/to/monitor.sh
```

### 日志分析

```bash
# 分析 Nginx 访问日志
# 热门页面
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -10

# 错误统计
grep " 5.." /var/log/nginx/access.log | awk '{print $9}' | sort | uniq -c | sort -nr

# 性能分析
# 响应时间分布
awk '{print $NF}' /var/log/nginx/access.log | sort -n | awk '
BEGIN {bin_width=0.1; max=10}
{
    bin=int($1/bin_width);
    if (bin > max/bin_width) bin=int(max/bin_width)+1;
    count[bin]++;
}
END {
    for (i in count) {
        printf "%.1f-%.1f: %d\n", i*bin_width, (i+1)*bin_width, count[i];
    }
}' | sort -n
```

## 🆘 获取帮助 / Getting Help

### 问题上报流程

#### 1. 收集诊断信息

```bash
# 创建诊断报告
./diagnose.sh > diagnostic-report.txt

# 包含以下信息
cat >> diagnostic-report.txt << EOF
=== 问题描述 ===
[详细描述问题现象、复现步骤、预期结果]

=== 环境信息 ===
$(uname -a)
$(docker --version)
$(node --version)

=== 错误日志 ===
[相关错误信息和日志片段]
EOF
```

#### 2. 提交问题报告

**GitHub Issues 模板**:

```markdown
## 问题描述
[清晰描述问题]

## 复现步骤
1. 执行 '...'
2. 出现错误 '...'
3. 预期结果 '...'

## 诊断信息
[贴上 diagnostic-report.txt 的内容]

## 环境信息
- OS: [e.g., Ubuntu 22.04]
- Docker: [e.g., 24.0.1]
- Node.js: [e.g., 18.17.0]

## 其他信息
[任何其他相关信息]
```

### 社区支持

#### 获取帮助的途径

1. **查看文档**
   - [本地运行指南](./local.md)
   - [搜索配置指南](./local-search-engine.md)
   - [部署指南](./DEPLOYMENT.md)

2. **搜索现有问题**
   - [GitHub Issues](https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues)
   - 使用关键词搜索类似问题

3. **提交新问题**
   - 提供详细的诊断信息
   - 包含完整的错误日志
   - 说明系统环境和操作步骤

4. **社区讨论**
   - 参与项目讨论
   - 分享解决方案和经验

### 紧急情况处理

#### 系统崩溃恢复

```bash
# 1. 检查系统状态
systemctl status

# 2. 重启关键服务
sudo systemctl restart docker
sudo systemctl restart nginx

# 3. 检查应用状态
docker compose ps

# 4. 从备份恢复 (如果有)
# 参考备份恢复文档
```

#### 数据丢失恢复

```bash
# 1. 停止服务
docker compose down

# 2. 检查数据卷
docker volume ls

# 3. 从备份恢复
# 参考备份恢复脚本

# 4. 验证数据完整性
npm run build-indexes
npm run init-es
```

---

## 📝 快速参考 / Quick Reference

### 常用命令

```bash
# 状态检查
docker compose ps
docker compose logs -f

# 服务管理
docker compose restart
docker compose down && docker compose up -d

# 清理缓存
docker system prune -f
npm cache clean --force

# 日志查看
tail -f /var/log/nginx/error.log
docker compose logs elasticsearch | tail -20
```

### 配置文件位置

```
/etc/nginx/sites-available/banned-historical-archives  # Nginx 配置
/opt/banned-historical-archives/docker-compose.yml    # Docker 配置
/opt/banned-historical-archives/.env                   # 环境变量
/var/log/banned-historical-archives/                   # 应用日志
```

### 重要端口

- `3000`: Next.js 应用
- `9200`: Elasticsearch
- `80`: HTTP
- `443`: HTTPS

---

**记住**: 大多数问题都可以通过系统性的诊断和日志分析来解决。保持冷静，按步骤排查通常能找到解决方案。
