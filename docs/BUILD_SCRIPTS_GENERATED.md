# 构建脚本文档（自动生成） / Build Scripts Documentation (Auto-generated)

> ⚠️ **注意**: 本文档由脚本自动生成，请勿手动编辑。如需更新，请修改 `backend/*.ts` 中的代码注释。
>
> ⚠️ **Note**: This document is auto-generated. Please update code comments in `backend/*.ts` instead of editing this file directly.

**最后生成时间 / Last Generated**: 2025/11/25 02:55:12

## 概述 / Overview

本文档包含所有构建脚本的说明，这些脚本位于 `backend/` 目录中。

This document contains documentation for all build scripts in the `backend/` directory.

## 脚本列表 / Script List

### build-article-json

**文件路径 / File Path**: `backend/build-article-json.ts`

**处理流程 / Process:**

1. 读取文章索引，获取所有文章的基本信息
2. 为每篇文章收集其在不同出版物中的版本
3. 合并元数据、文章内容和标签信息
4. 生成按文章 ID 组织的 JSON 文件

**使用示例 / Examples:**

```bash
 * # 构建文章 JSON 数据
 * npm run build-article-json
 *
 * # 查看构建结果
 * ls -la json/ | head -10
 *
 * # 查看单个文章数据
 * cat json/883/883eeb87ad.json | jq '.books[0].article.title'
 * ```

---

### build-indexes

**文件路径 / File Path**: `backend/build-indexes.ts`

**使用示例 / Examples:**

```bash
 * # 构建所有索引
 * npm run build-indexes
 *
 * # 查看构建结果
 * ls -la indexes/
 * ```

---

### connect-es

**文件路径 / File Path**: `backend/connect-es.ts`

**使用示例 / Examples:**

```typescript
 * import esClient from './backend/connect-es';
 *
 * // 执行搜索查询
 * const result = await esClient.search({
 *   index: 'article',
 *   query: { match: { content: '毛泽东' } }
 * });
 * ```

---

### gitworkflow-automated-entry

**文件路径 / File Path**: `backend/gitworkflow-automated-entry.ts`

如果是pdf 下载到 raw/archives${n}/${id}

**处理流程 / Process:**

1. 新增 config/archives[n]/[id].ts
2. 如果是图片集，下载图片到 raw/archives${n}/${id}/${img}
3. 在 archives${n} main 分支创建 pr
4. 在 archives${n} config 分支创建 pr

---

### init-es

**文件路径 / File Path**: `backend/init-es.ts`

**使用示例 / Examples:**

```bash
 * # 初始化索引（只在空索引时导入）
 * npm run init-es
 *
 * # 重置并重新初始化索引
 * npm run init-es reset
 *
 * # 查看导入进度
 * tail -f /dev/null &
 * ```

---

### init-sub-repository

**文件路径 / File Path**: `backend/init-sub-repository.ts`

**使用示例 / Examples:**

```bash
 * # 下载解析数据
 * npm run init-parsed
 *
 * # 下载配置文件
 * npm run init-config
 *
 * # 下载原始文件
 * npm run init-raw
 * ```

---

