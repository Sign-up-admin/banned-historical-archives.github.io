# 本地搜索引擎配置指南 / Local Search Engine Setup Guide

本文档介绍如何配置本地 Elasticsearch 搜索引擎，实现高效的全文检索功能。本地搜索引擎比在线搜索更快速、更安全，且支持复杂的查询语法。

## 📋 系统要求 / System Requirements

### 硬件要求 / Hardware Requirements
- **内存**: 至少 4GB 可用内存 (推荐 8GB+)
- **磁盘**: 至少 5GB 可用空间 (推荐 SSD)
- **CPU**: 至少双核处理器
- **网络**: Elasticsearch 镜像下载需要网络连接

### 软件要求 / Software Requirements
- **Docker**: >= 20.10.0 或 Docker Desktop
- **Elasticsearch**: 8.5.1 (项目指定版本)
- **操作系统**: Linux, macOS, Windows

### 环境检查 / Environment Check

```bash
# 检查内存
free -h  # Linux
# 或
system_profiler SPHardwareDataType | grep Memory  # macOS

# 检查磁盘空间
df -h /var/lib/docker  # Docker 数据目录

# 检查 Docker 版本
docker --version
docker compose version
```

## 🐳 Docker Compose 版本 (推荐) / Docker Compose Version (Recommended)

Docker Compose 版本自动配置 Elasticsearch 环境，最适合大多数用户。

### 快速启动 / Quick Start

```bash
# 1. 确保 Docker 服务运行
sudo systemctl start docker  # Linux
# 或启动 Docker Desktop (Windows/macOS)

# 2. 启动完整环境 (包括 Elasticsearch)
docker compose up -d

# 3. 等待初始化完成 (首次运行需要 10-30 分钟)
docker compose logs -f app

# 4. 访问应用
# 浏览器打开: http://localhost:3000
```

### 服务架构 / Service Architecture

Docker Compose 启动以下服务：

```
┌─────────────────┐    ┌──────────────────┐
│   Web App       │────│  Elasticsearch   │
│   (Port 3000)   │    │   (Port 9200)    │
└─────────────────┘    └──────────────────┘
         │
         └─────────────────┐
                           ▼
                    ┌─────────────────┐
                    │     Nginx       │
                    │   (Port 8000)   │
                    └─────────────────┘
```

### Elasticsearch 配置 / Elasticsearch Configuration

项目使用以下 Elasticsearch 配置：

```yaml
# docker-compose.yml 中的配置
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.5.1
  environment:
    - discovery.type=single-node
    - http.cors.enabled=true
    - http.cors.allow-origin="*"
    - xpack.security.authc.anonymous.username=anonymous
    - xpack.security.authc.anonymous.roles=superuser
    - ELASTIC_USERNAME=elastic
    - ELASTIC_PASSWORD=password
    - xpack.security.http.ssl.enabled=false
```

### 初始化进度监控 / Initialization Progress Monitoring

```bash
# 查看所有服务状态
docker compose ps

# 查看 Elasticsearch 启动日志
docker compose logs elasticsearch

# 查看应用初始化日志
docker compose logs app

# 监控索引创建进度
docker compose exec elasticsearch bash -c "
curl -s http://localhost:9200/_cat/indices?v
curl -s http://localhost:9200/_cluster/health?pretty
"
```

### 验证搜索功能 / Search Feature Verification

```bash
# 检查 Elasticsearch 健康状态
curl http://localhost:9200/_cluster/health?pretty

# 查看索引统计
curl http://localhost:9200/_cat/indices?v

# 测试搜索 API
curl "http://localhost:9200/article/_search?q=毛泽东&size=5&pretty"

# 检查索引文档数量
curl http://localhost:9200/article/_count?pretty
```

## 💻 主机版本 / Host Version

主机版本需要手动配置 Elasticsearch，适合开发者和高级用户。

### 详细步骤 / Detailed Steps

#### 1. 系统配置 / System Configuration

**Linux 系统配置**:
```bash
# 增加虚拟内存映射数量 (必需)
sudo sysctl -w vm.max_map_count=262144

# 使配置永久生效
echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
```

**macOS 系统配置**:
```bash
# 检查当前限制
sysctl -n vm.max_map_count

# 临时设置 (重启后失效)
sudo sysctl -w vm.max_map_count=262144

# 永久设置
echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
```

#### 2. 安装并运行 Elasticsearch / Install and Run Elasticsearch

```bash
# 1. 拉取 Elasticsearch 镜像
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.5.1

# 2. 准备环境变量文件
# 复制或创建 backend/es_docker_container_env 文件
cat > es_env << 'EOF'
discovery.type=single-node
http.cors.enabled=true
http.cors.allow-origin=*
xpack.security.authc.anonymous.username=anonymous
xpack.security.authc.anonymous.roles=superuser
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=password
xpack.security.http.ssl.enabled=false
EOF

# 3. 启动 Elasticsearch 容器
docker run -d \
  --name banned-historical-archives-es \
  -p 9200:9200 \
  -p 9300:9300 \
  --env-file ./es_env \
  -v es-data:/usr/share/elasticsearch/data \
  docker.elastic.co/elasticsearch/elasticsearch:8.5.1

# 4. 等待启动完成 (可能需要 1-2 分钟)
docker logs -f banned-historical-archives-es
```

#### 3. 初始化索引 / Initialize Index

```bash
# 1. 确保项目已构建
npm run build

# 2. 初始化 Elasticsearch 索引
npm run init-es

# 3. 查看初始化日志
tail -f /dev/null &
# 等待索引创建完成
```

#### 4. 重置索引 (如果需要) / Reset Index (If Needed)

```bash
# 重置并重新初始化索引
npm run init-es reset

# 或手动删除并重建
curl -X DELETE http://localhost:9200/article
npm run init-es
```

## 🔧 环境变量配置 / Environment Configuration

### 前端配置 / Frontend Configuration

创建 `.env.local` 文件：

```bash
# Elasticsearch 连接配置
ES_URL=http://localhost:9200
ES_USERNAME=elastic
ES_PASSWORD=password

# 功能开关
LOCAL_SEARCH_ENGINE=1
LOCAL_INDEXES=1
```

### 后端配置 / Backend Configuration

在 `docker-compose.yml` 或环境变量中配置：

```bash
# Elasticsearch 连接
ES_URL=http://localhost:9200
ES_USERNAME=elastic
ES_PASSWORD=password

# 索引配置
ES_INDEX_NAME=article
ES_INDEX_TYPE=_doc
```

## 📊 索引初始化进度 / Index Initialization Progress

### 进度监控 / Progress Monitoring

```bash
# 查看索引创建状态
curl http://localhost:9200/_cat/indices?v

# 查看集群健康状态
curl http://localhost:9200/_cluster/health?pretty

# 查看索引统计
curl http://localhost:9200/article/_stats?pretty

# 查看索引映射
curl http://localhost:9200/article/_mapping?pretty
```

### 数据导入进度 / Data Import Progress

```bash
# 查看文档数量
curl http://localhost:9200/article/_count?pretty

# 查看索引大小
curl http://localhost:9200/article/_stats/store?pretty

# 监控导入脚本日志
npm run init-es 2>&1 | tee es-init.log
tail -f es-init.log
```

### 预期时间 / Expected Time

| 阶段 | 时间 | 说明 |
|------|------|------|
| Elasticsearch 启动 | 1-2分钟 | 容器启动和初始化 |
| 索引创建 | 30秒-1分钟 | 创建索引结构 |
| 数据导入 | 5-15分钟 | 导入所有文档 |
| 优化索引 | 1-2分钟 | 优化搜索性能 |

## 🔍 搜索功能验证 / Search Feature Verification

### 基本功能测试 / Basic Function Tests

```bash
# 1. 检查 Elasticsearch 连接
curl http://localhost:9200/

# 2. 检查索引存在
curl http://localhost:9200/_cat/indices | grep article

# 3. 测试简单搜索
curl -X GET "http://localhost:9200/article/_search" \
  -H 'Content-Type: application/json' \
  -d '{"query":{"match":{"content":"毛泽东"}},"size":3}'

# 4. 测试高亮搜索
curl -X GET "http://localhost:9200/article/_search" \
  -H 'Content-Type: application/json' \
  -d '{
    "query":{"match":{"content":"文化大革命"}},
    "highlight":{"fields":{"content":{}}},
    "size":5
  }'
```

### 高级搜索测试 / Advanced Search Tests

```bash
# 精确短语搜索
curl -X GET "http://localhost:9200/article/_search" \
  -H 'Content-Type: application/json' \
  -d '{"query":{"match_phrase":{"content":"无产阶级文化大革命"}},"size":3}'

# 多字段搜索
curl -X GET "http://localhost:9200/article/_search" \
  -H 'Content-Type: application/json' \
  -d '{"query":{"multi_match":{"query":"毛泽东","fields":["title","authors","content"]}},"size":5}'

# 布尔查询
curl -X GET "http://localhost:9200/article/_search" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
      "bool": {
        "must": [{"match": {"content": "毛泽东"}}],
        "must_not": [{"match": {"content": "邓小平"}}]
      }
    },
    "size": 10
  }'
```

### 性能测试 / Performance Tests

```bash
# 搜索性能测试
time curl -X GET "http://localhost:9200/article/_search" \
  -H 'Content-Type: application/json' \
  -d '{"query":{"match":{"content":"毛泽东"}},"size":100}' \
  -o /dev/null -s

# 索引统计
curl http://localhost:9200/article/_stats/search?pretty

# 集群性能指标
curl http://localhost:9200/_nodes/stats?pretty
```

## ⚡ 性能优化建议 / Performance Optimization Tips

### Elasticsearch 配置优化 / Elasticsearch Configuration Optimization

```yaml
# docker-compose.yml 优化配置
services:
  elasticsearch:
    environment:
      - "ES_JAVA_OPTS=-Xms2g -Xmx4g"  # 增加堆内存
      - "bootstrap.memory_lock=true"  # 锁定内存
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - es-data:/usr/share/elasticsearch/data
      - ./elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml
```

### 系统层面优化 / System Level Optimization

**Linux 优化**:
```bash
# 增加文件句柄限制
echo '* soft nofile 65536' | sudo tee -a /etc/security/limits.conf
echo '* hard nofile 65536' | sudo tee -a /etc/security/limits.conf

# 优化内核参数
echo 'net.core.somaxconn = 1024' | sudo tee -a /etc/sysctl.conf
echo 'vm.swappiness = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**SSD 优化** (如果使用 SSD):
```bash
# 禁用透明大页
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/defrag
```

### 索引优化 / Index Optimization

```bash
# 强制合并段 (减少搜索延迟)
curl -X POST "http://localhost:9200/article/_forcemerge?max_num_segments=1"

# 刷新索引 (确保最新数据可搜索)
curl -X POST "http://localhost:9200/article/_refresh"

# 优化索引设置
curl -X PUT "http://localhost:9200/article/_settings" \
  -H 'Content-Type: application/json' \
  -d '{
    "index": {
      "refresh_interval": "30s",
      "number_of_replicas": 0
    }
  }'
```

## 🚨 故障排查 / Troubleshooting

### 常见问题 / Common Issues

#### Elasticsearch 启动失败 / Elasticsearch Startup Failure

**问题**: `vm.max_map_count` 错误
```bash
# 解决方案
sudo sysctl -w vm.max_map_count=262144
```

**问题**: 内存不足
```bash
# 解决方案：增加 Docker 内存分配
# Docker Desktop -> Settings -> Resources -> Memory -> 4GB+
```

**问题**: 端口冲突
```bash
# 解决方案：检查端口占用
netstat -tlnp | grep :9200

# 修改端口映射
docker run -p 9201:9200 ... # 使用其他端口
```

#### 索引初始化失败 / Index Initialization Failure

**问题**: 连接超时
```bash
# 解决方案：等待 Elasticsearch 完全启动
curl http://localhost:9200/_cluster/health?wait_for_status=yellow&timeout=60s
```

**问题**: 数据导入失败
```bash
# 解决方案：检查数据文件是否存在
ls -la json/
ls -la indexes/

# 重新构建数据
npm run build-indexes
npm run build-article-json
```

#### 搜索功能异常 / Search Function Abnormal

**问题**: 搜索无结果
```bash
# 解决方案：检查索引状态
curl http://localhost:9200/_cat/indices

# 检查索引内容
curl "http://localhost:9200/article/_search?q=*&size=1"
```

**问题**: 搜索慢
```bash
# 解决方案：优化索引
curl -X POST "http://localhost:9200/article/_forcemerge"

# 增加内存
export ES_JAVA_OPTS="-Xms4g -Xmx4g"
```

### 日志分析 / Log Analysis

```bash
# 查看 Elasticsearch 日志
docker compose logs elasticsearch

# 查看应用日志中的搜索相关
docker compose logs app | grep -i search

# 启用详细日志
curl -X PUT "http://localhost:9200/article/_settings" \
  -H 'Content-Type: application/json' \
  -d '{"index":{"indexing.slowlog.threshold.index.warn":"10s"}}'
```

## 📊 监控和维护 / Monitoring and Maintenance

### 健康检查 / Health Checks

```bash
# 创建健康检查脚本
cat > health-check.sh << 'EOF'
#!/bin/bash
echo "=== Elasticsearch Health ==="
curl -s http://localhost:9200/_cluster/health?pretty

echo -e "\n=== Index Stats ==="
curl -s http://localhost:9200/_cat/indices?v

echo -e "\n=== Search Performance ==="
curl -s -w "@curl-format.txt" -X GET "http://localhost:9200/article/_search?q=毛泽东&size=10" -o /dev/null
EOF

chmod +x health-check.sh
./health-check.sh
```

### 定期维护 / Regular Maintenance

```bash
# 每周执行的维护任务
curl -X POST "http://localhost:9200/article/_forcemerge?max_num_segments=5"
curl -X POST "http://localhost:9200/article/_refresh"

# 每月执行的维护任务
curl -X POST "http://localhost:9200/_reindex" \
  -H 'Content-Type: application/json' \
  -d '{
    "source": {"index": "article"},
    "dest": {"index": "article_backup"}
  }'
```

## 📚 相关文档 / Related Documentation

- [本地运行指南](./local.md)
- [开发环境搭建](./dev.md)
- [部署指南](./DEPLOYMENT.md)
- [故障排查](./TROUBLESHOOTING.md)
- [API 文档](./API.md)

---

**注意**: Elasticsearch 8.x 版本需要 Java 11+ 支持。如遇到兼容性问题，可以考虑降级到 7.x 版本。
