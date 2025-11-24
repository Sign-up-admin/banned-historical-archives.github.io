# 数据工程运维手册 / Data Engineering Operations Manual

本文档提供数据工程的日常运维指南，包括监控、故障排查、性能调优和灾难恢复。

## 📋 目录 / Table of Contents

- [日常运维任务 / Daily Operations](#日常运维任务--daily-operations)
- [监控和告警 / Monitoring and Alerting](#监控和告警--monitoring-and-alerting)
- [故障排查 / Troubleshooting](#故障排查--troubleshooting)
- [性能调优 / Performance Tuning](#性能调优--performance-tuning)
- [容量规划 / Capacity Planning](#容量规划--capacity-planning)
- [灾难恢复 / Disaster Recovery](#灾难恢复--disaster-recovery)

## 日常运维任务 / Daily Operations

### 每日检查清单 / Daily Checklist

- [ ] 检查构建状态
- [ ] 检查数据质量报告
- [ ] 检查错误日志
- [ ] 检查存储空间使用情况
- [ ] 检查Elasticsearch集群状态
- [ ] 检查GitHub Actions运行状态

### 每周检查清单 / Weekly Checklist

- [ ] 审查数据质量趋势
- [ ] 检查备份完整性
- [ ] 审查性能指标
- [ ] 检查容量使用情况
- [ ] 更新文档

### 每月检查清单 / Monthly Checklist

- [ ] 执行完整的数据质量检查
- [ ] 审查和优化构建流程
- [ ] 更新依赖包
- [ ] 审查安全设置
- [ ] 容量规划评估

## 监控和告警 / Monitoring and Alerting

### 关键指标 / Key Metrics

#### 构建指标 / Build Metrics

- **构建时间**: 总构建时间、各阶段耗时
- **构建成功率**: 成功/失败次数
- **数据处理量**: 处理文章数、文件数、数据大小

#### 数据质量指标 / Data Quality Metrics

- **质量分数分布**: 各质量等级的文章数量
- **错误率**: 各类错误的发生频率
- **修复率**: 问题修复的及时性

#### 系统资源指标 / System Resource Metrics

- **CPU使用率**: 构建过程中的CPU使用情况
- **内存使用率**: 内存占用情况
- **磁盘使用率**: 存储空间使用情况
- **网络带宽**: 数据传输速度

### 告警规则 / Alert Rules

```typescript
interface AlertRule {
  name: string;
  metric: string;
  threshold: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  condition: 'gt' | 'lt' | 'eq';
}

const alertRules: AlertRule[] = [
  {
    name: '构建时间过长',
    metric: 'build_time',
    threshold: 3600, // 1小时
    severity: 'HIGH',
    condition: 'gt',
  },
  {
    name: '构建失败率过高',
    metric: 'build_failure_rate',
    threshold: 0.1, // 10%
    severity: 'CRITICAL',
    condition: 'gt',
  },
  {
    name: '磁盘使用率过高',
    metric: 'disk_usage',
    threshold: 0.9, // 90%
    severity: 'HIGH',
    condition: 'gt',
  },
];
```

## 故障排查 / Troubleshooting

### 常见问题 / Common Issues

#### 构建失败 / Build Failures

**问题**: 构建脚本执行失败

**排查步骤**:
1. 检查错误日志
2. 验证输入数据完整性
3. 检查磁盘空间
4. 检查网络连接
5. 验证配置文件格式

**解决方案**:
```bash
# 查看构建日志
tail -f build.log

# 检查磁盘空间
df -h

# 验证数据完整性
npm run validate-data

# 重新构建
npm run build-indexes
```

#### 数据质量问题 / Data Quality Issues

**问题**: 数据质量分数过低

**排查步骤**:
1. 检查质量报告
2. 识别问题类型
3. 定位问题数据
4. 分析根本原因

**解决方案**:
```bash
# 生成质量报告
npm run quality-check

# 修复问题数据
npm run fix-data-quality

# 重新验证
npm run validate-data
```

#### Elasticsearch问题 / Elasticsearch Issues

**问题**: 搜索索引异常

**排查步骤**:
1. 检查Elasticsearch集群状态
2. 检查索引健康状态
3. 查看错误日志
4. 验证数据格式

**解决方案**:
```bash
# 检查集群状态
curl http://localhost:9200/_cluster/health

# 检查索引状态
curl http://localhost:9200/article/_stats

# 重置索引
npm run reset-es
npm run init-es
```

## 性能调优 / Performance Tuning

### 构建性能优化 / Build Performance Optimization

#### 并行处理 / Parallel Processing

```typescript
// 并行处理文章
async function processArticlesParallel(articles: Article[]): Promise<void> {
  const batchSize = 100;
  const batches = chunkArray(articles, batchSize);
  
  await Promise.all(
    batches.map(batch => processBatch(batch))
  );
}
```

#### 增量构建 / Incremental Build

```typescript
// 只构建变更的文件
async function incrementalBuild(): Promise<void> {
  const changedFiles = await detectChanges();
  
  if (changedFiles.length === 0) {
    return;
  }
  
  await buildChangedFiles(changedFiles);
}
```

#### 缓存优化 / Cache Optimization

```typescript
// 使用缓存避免重复计算
class BuildCache {
  private cache = new Map<string, any>();
  
  async get<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const value = await fn();
    this.cache.set(key, value);
    return value;
  }
}
```

### 数据访问优化 / Data Access Optimization

#### 批量加载 / Batch Loading

```typescript
// 批量加载文章数据
async function loadArticlesBatch(articleIds: string[]): Promise<Article[]> {
  const batches = chunkArray(articleIds, 100);
  const results = await Promise.all(
    batches.map(batch => loadBatch(batch))
  );
  return results.flat();
}
```

#### 预加载 / Preloading

```typescript
// 预加载常用数据
async function preloadCommonData(): Promise<void> {
  await Promise.all([
    loadArticleList(),
    loadPopularArticles(),
    loadTagIndex(),
  ]);
}
```

## 容量规划 / Capacity Planning

### 存储容量规划 / Storage Capacity Planning

#### 数据增长预测 / Data Growth Prediction

```typescript
interface CapacityForecast {
  currentSize: number;        // 当前数据大小（GB）
  growthRate: number;         // 增长率（%/月）
  forecastMonths: number;     // 预测月数
  forecastedSize: number;     // 预测数据大小（GB）
}

function forecastCapacity(current: number, growthRate: number, months: number): CapacityForecast {
  const forecastedSize = current * Math.pow(1 + growthRate / 100, months);
  
  return {
    currentSize: current,
    growthRate,
    forecastMonths: months,
    forecastedSize,
  };
}
```

#### 容量告警 / Capacity Alerts

```typescript
// 容量监控
class CapacityMonitor {
  async checkCapacity(): Promise<void> {
    const usage = await getStorageUsage();
    const threshold = 0.8; // 80%
    
    if (usage > threshold) {
      await sendAlert({
        type: 'CAPACITY_ALERT',
        message: `存储使用率已达到 ${usage * 100}%`,
        severity: 'HIGH',
      });
    }
  }
}
```

## 灾难恢复 / Disaster Recovery

### 备份策略 / Backup Strategy

#### 备份频率 / Backup Frequency

- **每日备份**: 增量备份
- **每周备份**: 完整备份
- **每月备份**: 归档备份

#### 备份内容 / Backup Content

- 原始数据（parsed/, config/）
- 构建数据（indexes/, json/）
- 配置文件
- 数据库（Elasticsearch）

### 恢复流程 / Recovery Process

#### 恢复步骤 / Recovery Steps

1. **评估损失**: 确定数据丢失范围
2. **选择恢复点**: 选择最近的备份点
3. **恢复数据**: 从备份恢复数据
4. **验证恢复**: 验证数据完整性
5. **重新构建**: 重新构建索引和数据
6. **切换服务**: 切换到恢复环境

#### 恢复脚本 / Recovery Script

```bash
#!/bin/bash

# 灾难恢复脚本
BACKUP_DATE=$1
BACKUP_DIR="backups/${BACKUP_DATE}"

# 1. 停止服务
echo "停止服务..."
# stop services

# 2. 恢复数据
echo "恢复数据..."
cp -r ${BACKUP_DIR}/parsed ./parsed
cp -r ${BACKUP_DIR}/config ./config
cp -r ${BACKUP_DIR}/indexes ./indexes
cp -r ${BACKUP_DIR}/json ./json

# 3. 验证数据
echo "验证数据..."
npm run validate-data

# 4. 重新构建
echo "重新构建..."
npm run build-indexes
npm run build-article-json

# 5. 重启服务
echo "重启服务..."
# start services

echo "恢复完成"
```

---

**最后更新 / Last Updated**: 2025-01-XX
**维护者 / Maintainers**: 项目维护团队

