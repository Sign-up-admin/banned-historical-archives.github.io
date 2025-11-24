# API 文档 / API Documentation

本文档介绍和谐历史档案馆的数据 API 接口，包括 GitHub Raw Content API 和数据格式规范。

## 📋 目录 / Table of Contents

- [🌐 数据访问 API / Data Access APIs](#-数据访问-api--data-access-apis)
- [📦 数据格式规范 / Data Format Specifications](#-数据格式规范--data-format-specifications)
- [🔍 搜索 API / Search APIs](#-搜索-api--search-apis)
- [📊 索引 API / Index APIs](#-索引-api--index-apis)
- [💡 使用示例 / Usage Examples](#-使用示例--usage-examples)
- [🔒 安全和限制 / Security & Limits](#-🔒-安全和限制--security--limits)
- [🛠️ 开发指南 / Development Guide](#-️-开发指南--development-guide)

## 🌐 数据访问 API / Data Access APIs

和谐历史档案馆主要通过 GitHub Raw Content API 提供数据访问，无需额外的 API 服务器。

### GitHub Raw Content API

#### 基础 URL 结构

```
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
```

- `owner`: `banned-historical-archives`
- `repo`: `banned-historical-archives.github.io`
- `branch`: 数据分支 (json, indexes, txt)
- `path`: 文件路径

#### 支持的数据分支

| 分支 | 用途 | 内容类型 |
|------|------|----------|
| `json` | 文章 JSON 数据 | 结构化文章数据 |
| `indexes` | 索引文件 | 搜索和列表索引 |
| `txt` | 纯文本数据 | 可读的文本格式 |
| `gh-pages` | 静态网站 | HTML 和静态资源 |

## 📦 数据格式规范 / Data Format Specifications

### 文章数据格式 (JSON 分支)

#### 单个文章数据结构

```typescript
interface ArticleResponse {
  books: BookData[];
}

interface BookData {
  id: string;        // 书籍 ID
  name: string;      // 书籍名称
  type: string;      // 类型 ('pdf', 'image', etc.)
  internal: boolean; // 是否内部文件
  official: boolean; // 是否官方文件
  author: string;    // 作者信息
  files: string[];   // 文件列表
  tags: Tag[];       // 标签列表
  article: ParserResult; // 文章内容
}

interface ParserResult {
  title: string;     // 文章标题
  authors: string[]; // 作者列表
  dates: DateObject[]; // 日期列表
  is_range_date: boolean; // 是否日期范围
  tags: Tag[];       // 标签列表
  types: string[];   // 文章类型
  origin?: string;   // 来源信息
  alias?: string;    // 别名
  parts: ContentPart[]; // 内容段落
  comments: Comment[];  // 注释列表
}
```

#### API 访问示例

```bash
# 获取文章 ID 为 '883eeb87ad' 的完整数据
curl https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/json/json/883/883eeb87ad.json
```

**响应示例**:
```json
{
  "books": [
    {
      "id": "mao1966",
      "name": "毛泽东全集第一卷",
      "type": "pdf",
      "internal": false,
      "official": true,
      "author": "中共中央文献研究室",
      "files": ["mao-vol1.pdf"],
      "tags": [
        {"name": "中央文件", "type": "articleCategory"},
        {"name": "毛泽东", "type": "character"}
      ],
      "article": {
        "title": "在中央政治局会议上的讲话",
        "authors": ["毛泽东"],
        "dates": [{"year": 1966, "month": 5, "day": 16}],
        "is_range_date": false,
        "tags": [...],
        "types": ["讲话"],
        "origin": "1966年5月16日中共中央政治局会议",
        "parts": [
          {
            "text": "在中央政治局会议上的讲话",
            "type": "title"
          },
          {
            "text": "毛泽东",
            "type": "authors"
          },
          {
            "text": "目前的形势怎么样？",
            "type": "paragraph"
          }
        ],
        "comments": [...]
      }
    }
  ]
}
```

### 索引数据格式 (indexes 分支)

#### 文件计数索引

```typescript
interface FileCountIndex {
  article_list: number; // 文章列表分片数量
}
```

**访问地址**:
```
https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/file_count.json
```

#### 文章列表索引

```typescript
interface ArticleListIndex {
  articles: ArticleSummary[];  // 文章摘要列表
  books: string[];            // 书籍名称列表
  tags: Tag[];               // 标签列表
}

interface ArticleSummary {
  id: string;                // 文章 ID
  title: string;            // 标题
  authors: string[];        // 作者
  dates: DateObject[];      // 日期
  is_range_date: boolean;   // 日期范围标识
  tag_ids: number[];        // 标签 ID 列表
  book_ids: number[];       // 书籍 ID 列表
}
```

**访问地址**:
```
https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_{index}.json
```

#### 音乐索引

```typescript
interface MusicIndex {
  id: string;               // 音乐 ID
  name: string;             // 音乐名称
  archive_id: number;       // 资源仓库 ID
  lyrics_count: number;     // 歌词数量
  tags: Tag[];              // 标签列表
  composers: string[];      // 作曲者
  lyricists: string[];      // 作词者
  artists: ArtistInfo[];    // 艺术家信息
  sources: string[];        // 来源
  art_forms: string[];      // 艺术形式
}

interface ArtistInfo {
  name: string;
  type: string; // 'singer' | 'orchestra' | etc.
}
```

**访问地址**:
```
https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/music.json
```

#### 图库索引

```typescript
interface GalleryIndex {
  id: string;               // 资源 ID
  name: string;             // 资源名称
  type: 'picture' | 'video'; // 资源类型
  archive_id: number;       // 资源仓库 ID
  files: string[];          // 文件列表
  tags?: Tag[];             // 标签列表
  // 图片特有字段
  width?: number;
  height?: number;
  // 视频特有字段
  duration?: number;
  format?: string;
}
```

**访问地址**:
```
https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/gallery.json
```

## 🔍 搜索 API / Search APIs

### Elasticsearch 搜索 API (本地部署)

如果部署了本地 Elasticsearch，可以使用以下搜索接口：

#### 基础搜索

**端点**: `http://localhost:9200/article/_search`

**请求示例**:
```bash
curl -X GET "http://localhost:9200/article/_search" \
  -H 'Content-Type: application/json' \
  -d '{
    "query": {
      "match": {
        "content": "毛泽东"
      }
    },
    "size": 20,
    "from": 0
  }'
```

#### 高级搜索

**精确短语搜索**:
```json
{
  "query": {
    "match_phrase": {
      "content": "文化大革命"
    }
  }
}
```

**多字段搜索**:
```json
{
  "query": {
    "multi_match": {
      "query": "讲话",
      "fields": ["title^2", "content", "authors"]
    }
  }
}
```

**布尔查询**:
```json
{
  "query": {
    "bool": {
      "must": [
        {"match": {"content": "毛泽东"}}
      ],
      "must_not": [
        {"match": {"content": "邓小平"}}
      ],
      "filter": [
        {"range": {"dates.year": {"gte": 1966, "lte": 1976}}}
      ]
    }
  }
}
```

#### 搜索结果格式

```typescript
interface SearchResponse {
  took: number;        // 查询耗时 (ms)
  timed_out: boolean;  // 是否超时
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;   // 总命中数
      relation: string;
    };
    max_score: number; // 最高分数
    hits: SearchHit[]; // 命中结果
  };
}

interface SearchHit {
  _index: string;      // 索引名
  _id: string;         // 文档 ID
  _score: number;      // 相关性分数
  _source: any;        // 文档内容
  highlight?: {        // 高亮结果
    content: string[];
  };
}
```

## 📊 索引 API / Index APIs

### 索引统计 API

```bash
# 获取索引统计信息
curl http://localhost:9200/article/_stats?pretty

# 获取索引健康状态
curl http://localhost:9200/_cluster/health?pretty

# 获取索引映射
curl http://localhost:9200/article/_mapping?pretty
```

### 索引管理 API

```bash
# 刷新索引
curl -X POST http://localhost:9200/article/_refresh

# 强制合并段 (优化性能)
curl -X POST "http://localhost:9200/article/_forcemerge?max_num_segments=1"

# 重建索引 (重新初始化)
npm run init-es reset
npm run init-es
```

## 💡 使用示例 / Usage Examples

### JavaScript/TypeScript 客户端

#### 加载文章数据

```typescript
async function loadArticle(articleId: string): Promise<ArticleResponse> {
  const response = await fetch(
    `https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/json/json/${articleId.slice(0, 3)}/${articleId}.json`
  );

  if (!response.ok) {
    throw new Error(`Failed to load article: ${response.status}`);
  }

  return response.json();
}

// 使用示例
try {
  const article = await loadArticle('883eeb87ad');
  console.log('文章标题:', article.books[0].article.title);
  console.log('作者:', article.books[0].article.authors);
} catch (error) {
  console.error('加载文章失败:', error);
}
```

#### 加载文章列表

```typescript
async function loadArticleList(pageIndex: number = 0): Promise<ArticleListIndex> {
  // 首先获取文件计数
  const countResponse = await fetch(
    'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/file_count.json'
  );
  const { article_list: totalPages } = await countResponse.json();

  if (pageIndex >= totalPages) {
    throw new Error('页码超出范围');
  }

  // 加载指定页面的数据
  const listResponse = await fetch(
    `https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/article_list_${pageIndex}.json`
  );

  return listResponse.json();
}

// 使用示例
async function loadAllArticles(): Promise<ArticleSummary[]> {
  const countResponse = await fetch(
    'https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io/refs/heads/indexes/indexes/file_count.json'
  );
  const { article_list: totalPages } = await countResponse.json();

  const allArticles: ArticleSummary[] = [];

  for (let page = 0; page < totalPages; page++) {
    const pageData = await loadArticleList(page);
    allArticles.push(...pageData.articles);
  }

  return allArticles;
}
```

#### 搜索功能

```typescript
interface SearchOptions {
  query: string;
  size?: number;
  from?: number;
  highlight?: boolean;
}

async function searchArticles(options: SearchOptions): Promise<SearchResponse> {
  const { query, size = 20, from = 0, highlight = true } = options;

  const searchBody = {
    query: {
      match: {
        content: query
      }
    },
    size,
    from,
    ...(highlight && {
      highlight: {
        fields: {
          content: {}
        },
        fragment_size: 150,
        number_of_fragments: 3
      }
    })
  };

  const response = await fetch('http://localhost:9200/article/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchBody)
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  return response.json();
}

// 使用示例
try {
  const results = await searchArticles({
    query: '毛泽东',
    size: 10,
    highlight: true
  });

  console.log(`找到 ${results.hits.total.value} 条结果`);
  results.hits.hits.forEach(hit => {
    console.log(`标题: ${hit._source.title}`);
    console.log(`分数: ${hit._score}`);
    if (hit.highlight) {
      console.log(`高亮: ${hit.highlight.content.join('...')}`);
    }
  });
} catch (error) {
  console.error('搜索失败:', error);
}
```

### Python 客户端

```python
import requests
import json

class BannedHistoricalArchivesAPI:
    BASE_URL = "https://raw.githubusercontent.com/banned-historical-archives/banned-historical-archives.github.io"

    def load_article(self, article_id: str) -> dict:
        """加载文章数据"""
        url = f"{self.BASE_URL}/json/json/{article_id[:3]}/{article_id}.json"
        response = requests.get(url)

        if response.status_code != 200:
            raise Exception(f"Failed to load article: {response.status_code}")

        return response.json()

    def load_article_list(self, page_index: int = 0) -> dict:
        """加载文章列表"""
        # 获取总页数
        count_url = f"{self.BASE_URL}/refs/heads/indexes/indexes/file_count.json"
        count_response = requests.get(count_url)
        total_pages = count_response.json()['article_list']

        if page_index >= total_pages:
            raise ValueError("页码超出范围")

        # 加载指定页面
        list_url = f"{self.BASE_URL}/refs/heads/indexes/indexes/article_list_{page_index}.json"
        list_response = requests.get(list_url)

        return list_response.json()

    def search_articles(self, query: str, size: int = 20) -> dict:
        """搜索文章（需要本地 Elasticsearch）"""
        search_url = "http://localhost:9200/article/_search"

        search_body = {
            "query": {
                "match": {
                    "content": query
                }
            },
            "size": size,
            "highlight": {
                "fields": {
                    "content": {}
                }
            }
        }

        response = requests.post(search_url, json=search_body)

        if response.status_code != 200:
            raise Exception(f"Search failed: {response.status_code}")

        return response.json()

# 使用示例
api = BannedHistoricalArchivesAPI()

# 加载文章
article = api.load_article('883eeb87ad')
print(f"标题: {article['books'][0]['article']['title']}")

# 搜索文章
results = api.search_articles('毛泽东', size=5)
print(f"找到 {results['hits']['total']['value']} 条结果")
```

## 🔒 安全和限制 / Security & Limits

### GitHub Raw Content API 限制

#### 速率限制
- **未认证请求**: 每小时 60 次
- **认证请求**: 每小时 5000 次
- **按 IP 限制**: 防止滥用

#### 文件大小限制
- **单个文件**: 最大 100MB
- **仓库大小**: 无硬性限制，但影响加载速度

#### 缓存策略
- **CDN 缓存**: GitHub 全球 CDN
- **缓存时间**: 通常 5 分钟到 1 小时
- **手动刷新**: 通过提交新版本刷新

### 安全考虑

#### 数据隐私
- 所有数据公开可见
- 建议使用 HTTPS
- 注意个人身份信息泄露

#### API 使用
- 遵守 GitHub 服务条款
- 避免过度请求
- 实现错误重试机制

### 错误处理

#### HTTP 状态码

| 状态码 | 说明 | 处理建议 |
|--------|------|----------|
| `200` | 成功 | 正常处理响应 |
| `404` | 文件不存在 | 检查文件路径和分支 |
| `403` | 访问被拒绝 | 检查权限和速率限制 |
| `422` | 请求格式错误 | 验证请求参数 |
| `500` | 服务器错误 | 重试或联系支持 |

#### 错误响应示例

```json
{
  "message": "Not Found",
  "documentation_url": "https://docs.github.com/rest"
}
```

## 🛠️ 开发指南 / Development Guide

### API 集成最佳实践

#### 错误处理

```typescript
async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API 调用失败:', error);

    // 实现重试逻辑
    if (isRetryableError(error)) {
      console.log('重试请求...');
      await delay(1000);
      return safeApiCall(apiCall);
    }

    return null;
  }
}

function isRetryableError(error: any): boolean {
  return error.status === 500 || error.status === 502 || error.status === 503;
}
```

#### 缓存策略

```typescript
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 分钟

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });

    return data;
  }

  clear(): void {
    this.cache.clear();
  }
}

// 使用示例
const apiCache = new ApiCache();

const article = await apiCache.get(
  `article-${articleId}`,
  () => loadArticle(articleId)
);
```

#### 类型安全

```typescript
// 定义严格的类型
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
  timestamp: number;
}

interface ArticleApiResponse extends ApiResponse<ArticleResponse> {}

// 类型安全的 API 函数
async function typedApiCall<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, options);
  const data = await response.json();

  return {
    data,
    error: response.ok ? undefined : 'Request failed',
    status: response.status,
    timestamp: Date.now()
  };
}
```

### 自定义 API 开发

如果需要自定义 API 端点，可以基于现有数据构建：

```typescript
// 自定义文章搜索 API
async function searchArticlesInData(query: string): Promise<ArticleSummary[]> {
  // 加载所有文章索引
  const allArticles = await loadAllArticles();

  // 客户端搜索实现
  return allArticles.filter(article =>
    article.title.includes(query) ||
    article.authors.some(author => author.includes(query))
  );
}

// 自定义统计 API
async function getStatistics(): Promise<{
  totalArticles: number;
  totalBooks: number;
  totalTags: number;
  dateRange: { min: number; max: number };
}> {
  const allArticles = await loadAllArticles();

  const books = new Set<string>();
  const tags = new Set<string>();
  let minYear = Infinity;
  let maxYear = -Infinity;

  allArticles.forEach(article => {
    // 收集书籍信息
    article.book_ids.forEach(id => books.add(id.toString()));

    // 收集标签信息
    article.tag_ids.forEach(id => tags.add(id.toString()));

    // 计算日期范围
    article.dates.forEach(date => {
      if (date.year) {
        minYear = Math.min(minYear, date.year);
        maxYear = Math.max(maxYear, date.year);
      }
    });
  });

  return {
    totalArticles: allArticles.length,
    totalBooks: books.size,
    totalTags: tags.size,
    dateRange: { min: minYear, max: maxYear }
  };
}
```

---

## 📚 相关文档 / Related Documentation

- [数据标准化规范](./standardization.md)
- [本地运行指南](./local.md)
- [故障排查](./TROUBLESHOOTING.md)
- [贡献指南](../CONTRIBUTING.md)

---

**注意**: API 基于 GitHub Raw Content 服务，响应时间可能受网络条件影响。建议实现适当的缓存和错误处理机制。
