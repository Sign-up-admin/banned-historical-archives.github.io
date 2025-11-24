# 数据标准化规范 / Data Standardization Specification

本文档定义了和谐历史档案馆的数据标准化规范，包括数据格式、验证规则、处理流程和迁移指南。

## 📋 目录 / Table of Contents

- [📊 数据结构规范 / Data Structure Specification](#-数据结构规范--data-structure-specification)
- [🔍 数据验证规则 / Data Validation Rules](#-数据验证规则--data-validation-rules)
- [🔄 数据处理流程 / Data Processing Pipeline](#-数据处理流程--data-processing-pipeline)
- [📝 类型定义 / Type Definitions](#-类型定义--type-definitions)
- [📋 数据迁移指南 / Data Migration Guide](#-数据迁移指南--data-migration-guide)
- [💡 示例数据 / Example Data](#-示例数据--example-data)
- [🔧 开发指南 / Development Guide](#-开发指南--development-guide)

## 📊 数据结构规范 / Data Structure Specification

### 核心数据结构 / Core Data Structures

#### 文稿数据结构 (ParserResult) / Article Data Structure

```typescript
interface ParserResult {
  /**
   * 文稿标题
   */
  title: string;

  /**
   * 作者列表
   */
  authors: string[];

  /**
   * 日期信息
   */
  dates: DateObject[];

  /**
   * 是否为日期范围
   */
  is_range_date: boolean;

  /**
   * 标签列表
   */
  tags: Tag[];

  /**
   * 文稿类型
   */
  types: ArticleType[];

  /**
   * 原始来源描述
   */
  origin?: string;

  /**
   * 别名/副标题
   */
  alias?: string;

  /**
   * 文稿描述
   */
  description?: string;

  /**
   * 内容段落
   */
  parts: ContentPart[];

  /**
   * 注释列表
   */
  comments: Comment[];
}
```

#### 日期对象 / Date Object

```typescript
interface DateObject {
  year?: number;
  month?: number;
  day?: number;
}
```

#### 标签对象 / Tag Object

```typescript
interface Tag {
  name: string;
  type: TagType;
}
```

#### 内容段落 / Content Part

```typescript
interface ContentPart {
  text: string;
  type: ContentType;
}
```

#### 注释对象 / Comment Object

```typescript
interface Comment {
  index: number;        // 注释编号
  part_idx: number;     // 所在段落索引
  offset: number;       // 在段落中的偏移量
  text: string;         // 注释内容
}
```

### 枚举类型定义 / Enumeration Definitions

#### 内容类型 / Content Types

```typescript
enum ContentType {
  title = 'title',           // 大标题
  authors = 'authors',       // 作者
  place = 'place',           // 地点
  subtitle = 'subtitle',     // 子标题
  subtitle2 = 'subtitle2',   // 二级子标题
  subtitle3 = 'subtitle3',   // 三级子标题
  subtitle4 = 'subtitle4',   // 四级子标题
  subtitle5 = 'subtitle5',   // 五级子标题
  subdate = 'subdate',       // 子日期
  paragraph = 'paragraph',   // 段落
  quotation = 'quotation',   // 引文
  signature = 'signature',   // 签名
  image = 'image',           // 图片
  image_description = 'image_description' // 图片描述
}
```

#### 标签类型 / Tag Types

```typescript
enum TagType {
  articleCategory = 'articleCategory',     // 文稿大类
  articleType = 'articleType',             // 文稿类型
  place = 'place',                         // 地点
  character = 'character',                 // 人物
  issuer = 'issuer',                       // 发布机构
  subject = 'subject',                     // 主题/事件
  recorder = 'recorder',                   // 记录者
  reviewer = 'reviewer',                   // 审核者
  translator = 'translator',               // 翻译者
  reprint = 'reprint'                      // 翻印/传抄
}
```

#### 文稿大类 / Article Categories

```typescript
enum ArticleCategory {
  centralFile = '中央文件',                 // 中央文件
  keyFigures = '关键人物文稿',             // 关键人物文稿
  editorial = '重要报刊和社论',            // 社论
  keyPapersFromTheMasses = '群众运动重要文献' // 群众运动重要文献
}
```

#### 文稿类型 / Article Types

```typescript
enum ArticleType {
  writings = '文章',         // 文章
  mail = '书信',             // 书信
  lecture = '发言',          // 发言
  talk = '对话',             // 对话
  declaration = '宣言',      // 宣言
  instruction = '指示',      // 指示
  comment = '批示',          // 批示
  telegram = '通讯'          // 通讯
}
```

## 🔍 数据验证规则 / Data Validation Rules

### 基础验证 / Basic Validation

#### 必填字段验证 / Required Fields Validation

```typescript
function validateParserResult(data: ParserResult): ValidationResult {
  const errors: string[] = [];

  // 标题验证
  if (!data.title || data.title.trim().length === 0) {
    errors.push('标题不能为空');
  }

  // 作者验证
  if (!data.authors || data.authors.length === 0) {
    errors.push('至少需要一位作者');
  } else {
    data.authors.forEach((author, index) => {
      if (!author || author.trim().length === 0) {
        errors.push(`作者 ${index + 1} 不能为空`);
      }
    });
  }

  // 日期验证
  if (!data.dates || data.dates.length === 0) {
    errors.push('至少需要一个日期');
  } else {
    data.dates.forEach((date, index) => {
      if (!date.year) {
        errors.push(`日期 ${index + 1} 必须包含年份`);
      }
      if (date.month && (date.month < 1 || date.month > 12)) {
        errors.push(`日期 ${index + 1} 的月份无效`);
      }
      if (date.day && (date.day < 1 || date.day > 31)) {
        errors.push(`日期 ${index + 1} 的日期无效`);
      }
    });
  }

  // 内容验证
  if (!data.parts || data.parts.length === 0) {
    errors.push('文稿内容不能为空');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

#### 标签验证 / Tag Validation

```typescript
function validateTags(tags: Tag[]): ValidationResult {
  const errors: string[] = [];

  // 标签唯一性验证
  const tagSet = new Set<string>();
  tags.forEach(tag => {
    const tagKey = `${tag.type}:${tag.name}`;
    if (tagSet.has(tagKey)) {
      errors.push(`标签重复: ${tag.type} - ${tag.name}`);
    }
    tagSet.add(tagKey);
  });

  // 标签类型验证
  const validTagTypes = Object.values(TagType);
  tags.forEach(tag => {
    if (!validTagTypes.includes(tag.type)) {
      errors.push(`无效的标签类型: ${tag.type}`);
    }
  });

  // 必有文稿大类标签
  const hasCategoryTag = tags.some(tag => tag.type === TagType.articleCategory);
  if (!hasCategoryTag) {
    errors.push('必须包含至少一个文稿大类标签');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### 内容验证 / Content Validation

#### 文本质量验证 / Text Quality Validation

```typescript
function validateContentQuality(parts: ContentPart[]): ValidationResult {
  const errors: string[] = [];

  parts.forEach((part, index) => {
    // 检查空内容
    if (!part.text || part.text.trim().length === 0) {
      errors.push(`段落 ${index + 1} 内容为空`);
    }

    // 检查过短内容
    if (part.text.trim().length < 10) {
      errors.push(`段落 ${index + 1} 内容过短，可能有 OCR 错误`);
    }

    // 检查特殊字符过多
    const specialChars = part.text.match(/[^\w\s\u4e00-\u9fff]/g) || [];
    if (specialChars.length > part.text.length * 0.3) {
      errors.push(`段落 ${index + 1} 特殊字符过多，可能有 OCR 错误`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

#### 格式一致性验证 / Format Consistency Validation

```typescript
function validateFormatConsistency(data: ParserResult): ValidationResult {
  const errors: string[] = [];

  // 检查标题格式
  const titleParts = data.parts.filter(part => part.type === ContentType.title);
  if (titleParts.length > 1) {
    errors.push('不应有多个大标题');
  }

  // 检查作者格式
  const authorParts = data.parts.filter(part => part.type === ContentType.authors);
  if (authorParts.length > 1) {
    errors.push('不应有多个作者段落');
  }

  // 检查段落顺序
  let lastTitleIndex = -1;
  data.parts.forEach((part, index) => {
    if (part.type === ContentType.title) {
      if (lastTitleIndex !== -1 && index < lastTitleIndex) {
        errors.push('标题顺序不正确');
      }
      lastTitleIndex = index;
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## 🔄 数据处理流程 / Data Processing Pipeline

### OCR 处理流程 / OCR Processing Pipeline

```
原始 PDF/图片
    ↓
OCR 识别 (PaddleOCR)
    ↓
初步文本提取
    ↓
文本清理和格式化
    ↓
内容分类和标签
    ↓
质量检查和验证
    ↓
人工审核和修正
    ↓
标准化数据输出
```

### 详细处理步骤 / Detailed Processing Steps

#### 1. 原始文件准备 / Raw File Preparation

```typescript
interface RawFileInfo {
  id: string;                    // 文件唯一标识
  filename: string;             // 原始文件名
  path: string;                 // 文件路径
  type: 'pdf' | 'image' | 'epub'; // 文件类型
  size: number;                 // 文件大小
  checksum: string;             // 文件校验和
}

function prepareRawFile(filePath: string): RawFileInfo {
  const stats = fs.statSync(filePath);
  const checksum = crypto.createHash('md5')
    .update(fs.readFileSync(filePath))
    .digest('hex');

  return {
    id: path.basename(filePath, path.extname(filePath)),
    filename: path.basename(filePath),
    path: filePath,
    type: getFileType(filePath),
    size: stats.size,
    checksum
  };
}
```

#### 2. OCR 配置 / OCR Configuration

```typescript
interface OCRConfig {
  // OCR 引擎配置
  rec_model: string;           // 识别模型
  rec_backend: 'onnx' | 'paddle'; // 后端
  det_model: string;           // 检测模型
  det_backend: 'onnx' | 'paddle'; // 检测后端

  // 图像预处理
  resized_shape: number;       // 图像resize尺寸
  box_score_thresh: number;    // 检测置信度阈值
  min_box_size: number;        // 最小文本框尺寸

  // 布局处理
  auto_vsplit: boolean;        // 自动垂直分割
  vsplit: number;              // 垂直分割位置
  content_thresholds: number[]; // 内容区域阈值
}

const defaultOCRConfig: OCRConfig = {
  rec_model: 'ch_ppocr_mobile_v2.0',
  rec_backend: 'onnx',
  det_model: 'ch_PP-OCRv3_det',
  det_backend: 'onnx',
  resized_shape: 1496,
  box_score_thresh: 0.3,
  min_box_size: 10,
  auto_vsplit: true,
  vsplit: 0.5,
  content_thresholds: [0.0, 0.0, 0.0, 0.0]
};
```

#### 3. 内容解析 / Content Parsing

```typescript
interface ParsingContext {
  config: OCRConfig;
  rawFile: RawFileInfo;
  pageNumber: number;
  totalPages: number;
}

function parseContent(ocrResult: OCRResult, context: ParsingContext): ParserResult {
  // 1. 文本清理
  const cleanedText = cleanOCRText(ocrResult.text);

  // 2. 内容分类
  const parts = classifyContent(cleanedText, context);

  // 3. 标签提取
  const tags = extractTags(cleanedText, parts);

  // 4. 元数据提取
  const metadata = extractMetadata(cleanedText, context);

  // 5. 构建结果
  return {
    title: metadata.title,
    authors: metadata.authors,
    dates: metadata.dates,
    is_range_date: metadata.isRangeDate,
    tags,
    types: metadata.types,
    origin: metadata.origin,
    parts,
    comments: metadata.comments
  };
}
```

#### 4. 质量检查 / Quality Check

```typescript
interface QualityCheckResult {
  score: number;              // 质量分数 (0-100)
  issues: QualityIssue[];     // 质量问题列表
  suggestions: string[];      // 改进建议
}

interface QualityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  location?: {
    page?: number;
    line?: number;
    offset?: number;
  };
}

function performQualityCheck(result: ParserResult): QualityCheckResult {
  const issues: QualityIssue[] = [];
  let score = 100;

  // 验证规则检查
  const validation = validateParserResult(result);
  if (!validation.isValid) {
    validation.errors.forEach(error => {
      issues.push({
        type: 'error',
        message: error
      });
      score -= 20;
    });
  }

  // 内容质量检查
  const contentQuality = validateContentQuality(result.parts);
  if (!contentQuality.isValid) {
    contentQuality.errors.forEach(error => {
      issues.push({
        type: 'warning',
        message: error
      });
      score -= 5;
    });
  }

  // 格式一致性检查
  const formatConsistency = validateFormatConsistency(result);
  if (!formatConsistency.isValid) {
    formatConsistency.errors.forEach(error => {
      issues.push({
        type: 'info',
        message: error
      });
      score -= 2;
    });
  }

  return {
    score: Math.max(0, score),
    issues,
    suggestions: generateSuggestions(issues)
  };
}
```

## 📝 类型定义 / Type Definitions

### 完整的 TypeScript 类型定义 / Complete TypeScript Definitions

```typescript
// types/index.ts

export interface ParserResult {
  title: string;
  authors: string[];
  dates: DateObject[];
  is_range_date: boolean;
  tags: Tag[];
  types: ArticleType[];
  origin?: string;
  alias?: string;
  description?: string;
  parts: ContentPart[];
  comments: Comment[];
}

export interface DateObject {
  year?: number;
  month?: number;
  day?: number;
}

export interface Tag {
  name: string;
  type: TagType;
}

export interface ContentPart {
  text: string;
  type: ContentType;
}

export interface Comment {
  index: number;
  part_idx: number;
  offset: number;
  text: string;
}

export enum ContentType {
  title = 'title',
  authors = 'authors',
  place = 'place',
  subtitle = 'subtitle',
  subtitle2 = 'subtitle2',
  subtitle3 = 'subtitle3',
  subtitle4 = 'subtitle4',
  subtitle5 = 'subtitle5',
  subdate = 'subdate',
  paragraph = 'paragraph',
  quotation = 'quotation',
  signature = 'signature',
  image = 'image',
  image_description = 'image_description'
}

export enum TagType {
  articleCategory = 'articleCategory',
  articleType = 'articleType',
  place = 'place',
  character = 'character',
  issuer = 'issuer',
  subject = 'subject',
  recorder = 'recorder',
  reviewer = 'reviewer',
  translator = 'translator',
  reprint = 'reprint'
}

export enum ArticleCategory {
  centralFile = '中央文件',
  keyFigures = '关键人物文稿',
  editorial = '重要报刊和社论',
  keyPapersFromTheMasses = '群众运动重要文献'
}

export enum ArticleType {
  writings = '文章',
  mail = '书信',
  lecture = '发言',
  talk = '对话',
  declaration = '宣言',
  instruction = '指示',
  comment = '批示',
  telegram = '通讯'
}
```

## 📋 数据迁移指南 / Data Migration Guide

### 版本兼容性 / Version Compatibility

#### 数据格式版本 / Data Format Versions

| 版本 | 发布时间 | 主要变更 | 兼容性 |
|------|----------|----------|--------|
| v1.0 | 2023-01-01 | 初始版本 | - |
| v1.1 | 2023-06-01 | 添加标签系统 | 向前兼容 |
| v1.2 | 2023-12-01 | 改进内容分类 | 向前兼容 |
| v2.0 | 2024-06-01 | 重构数据结构 | 需要迁移 |

#### 迁移脚本 / Migration Scripts

```typescript
// migration/v1-to-v2.ts

interface OldParserResult {
  title: string;
  authors: string[];
  date: DateObject;  // 旧版本只有一个日期
  // ... 其他字段
}

interface NewParserResult {
  title: string;
  authors: string[];
  dates: DateObject[];  // 新版本支持多个日期
  is_range_date: boolean;
  // ... 其他字段
}

function migrateV1ToV2(oldData: OldParserResult): NewParserResult {
  return {
    ...oldData,
    dates: [oldData.date],  // 转换为数组
    is_range_date: false,   // 默认值
    // 其他字段保持不变
  };
}

// 批量迁移
async function migrateAllData() {
  const oldFiles = fs.readdirSync('old-data-directory');

  for (const file of oldFiles) {
    const oldData = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const newData = migrateV1ToV2(oldData);

    // 验证迁移结果
    const validation = validateParserResult(newData);
    if (!validation.isValid) {
      console.error(`Migration failed for ${file}:`, validation.errors);
      continue;
    }

    // 保存新数据
    fs.writeFileSync(file.replace('old-data', 'new-data'), JSON.stringify(newData, null, 2));
  }
}
```

### 数据备份策略 / Data Backup Strategy

```bash
# 备份脚本
#!/bin/bash

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 备份原始数据
cp -r parsed "$BACKUP_DIR/"
cp -r config "$BACKUP_DIR/"
cp -r raw "$BACKUP_DIR/"

# 备份处理后的数据
cp -r json "$BACKUP_DIR/"
cp -r indexes "$BACKUP_DIR/"

# 创建校验和
find "$BACKUP_DIR" -type f -exec sha256sum {} \; > "$BACKUP_DIR/checksums.sha256"

# 压缩备份
tar -czf "backup-$(date +%Y%m%d).tar.gz" "$BACKUP_DIR"

echo "Backup completed: $BACKUP_DIR"
```

### 回滚策略 / Rollback Strategy

```typescript
// rollback.ts

interface MigrationRecord {
  version: string;
  timestamp: number;
  files: string[];
  checksums: { [file: string]: string };
}

async function rollback(version: string) {
  // 查找备份记录
  const backupRecord = findBackupRecord(version);

  if (!backupRecord) {
    throw new Error(`Backup not found for version ${version}`);
  }

  // 验证备份完整性
  const isValid = await validateBackup(backupRecord);
  if (!isValid) {
    throw new Error(`Backup is corrupted for version ${version}`);
  }

  // 执行回滚
  await performRollback(backupRecord);

  console.log(`Successfully rolled back to version ${version}`);
}
```

## 💡 示例数据 / Example Data

### 完整文稿示例 / Complete Article Example

```json
{
  "title": "在中央政治局会议上的讲话",
  "authors": ["毛泽东"],
  "dates": [
    {
      "year": 1966,
      "month": 5,
      "day": 16
    }
  ],
  "is_range_date": false,
  "tags": [
    {
      "name": "中央文件",
      "type": "articleCategory"
    },
    {
      "name": "指示",
      "type": "articleType"
    },
    {
      "name": "毛泽东",
      "type": "character"
    },
    {
      "name": "文化大革命",
      "type": "subject"
    }
  ],
  "types": ["指示"],
  "origin": "1966年5月16日中共中央政治局会议",
  "alias": "五一六通知",
  "description": "中共中央关于开展文化大革命的决定",
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
      "text": "一、关于文化大革命的问题",
      "type": "subtitle"
    },
    {
      "text": "目前的形势怎么样？",
      "type": "paragraph"
    },
    {
      "text": "这是一场触及人们灵魂的大革命。",
      "type": "quotation"
    }
  ],
  "comments": [
    {
      "index": 1,
      "part_idx": 4,
      "offset": 10,
      "text": "这是毛泽东对文化大革命的经典论述"
    }
  ]
}
```

### 标签系统示例 / Tag System Example

```json
{
  "tags": [
    {
      "name": "中央文件",
      "type": "articleCategory"
    },
    {
      "name": "关键人物文稿",
      "type": "articleCategory"
    },
    {
      "name": "文章",
      "type": "articleType"
    },
    {
      "name": "毛泽东",
      "type": "character"
    },
    {
      "name": "周恩来",
      "type": "character"
    },
    {
      "name": "北京",
      "type": "place"
    },
    {
      "name": "上海",
      "type": "place"
    },
    {
      "name": "中共中央",
      "type": "issuer"
    },
    {
      "name": "文化大革命",
      "type": "subject"
    },
    {
      "name": "路线斗争",
      "type": "subject"
    }
  ]
}
```

### 复杂日期示例 / Complex Date Example

```json
{
  "dates": [
    {
      "year": 1966,
      "month": 5,
      "day": 16
    },
    {
      "year": 1966,
      "month": 5,
      "day": 17
    },
    {
      "year": 1966,
      "month": 8,
      "day": 1
    }
  ],
  "is_range_date": false
}
```

```json
{
  "dates": [
    {
      "year": 1956,
      "month": 9,
      "day": 15
    },
    {
      "year": 1957,
      "month": 12,
      "day": 18
    }
  ],
  "is_range_date": true
}
```

## 🔧 开发指南 / Development Guide

### 仓库目录结构 / Repository Directory Structure

```
banned-historical-archives.github.io-master/
├── parsed/                    # 📄 解析后的数据 (从资源仓库下载)
│   └── archives0/            # banned-historical-archives0 的数据
│       └── xxx/              # 书籍ID
│           └── xxx.json      # 解析结果
│           └── xxx.tags      # 标签数据
│           └── xxx.metadata  # 元数据
├── config/                    # ⚙️ 配置文件 (从资源仓库下载)
│   └── archives0/
│       └── xxx.ts            # TypeScript 配置文件
├── json/                      # 📦 JSON 导出 (构建生成)
│   └── xxx/
│       └── xxx.json          # 完整的文章数据
├── indexes/                   # 📇 索引文件 (构建生成)
│   ├── file_count.json       # 文件统计
│   ├── article_list_0.json   # 文章列表分片
│   ├── music.json            # 音乐索引
│   └── gallery.json          # 图库索引
├── backend/                   # 🔧 后端构建脚本
│   ├── build-article-json.ts # 生成 JSON 数据
│   ├── build-indexes.ts      # 生成索引文件
│   ├── init-sub-repository.ts # 下载子仓库数据
│   └── ...
├── pages/                     # 🎨 Next.js 页面
├── components/                # 🧩 React 组件
├── types/                     # 📝 TypeScript 类型
├── public/                    # 🖼️ 静态资源
└── out/                       # 🏗️ 构建输出 (静态网站)
```

### 开发工作流 / Development Workflow

#### 1. 本地开发 / Local Development

```bash
# 克隆项目
git clone https://github.com/banned-historical-archives/banned-historical-archives.github.io.git
cd banned-historical-archives.github.io

# 安装依赖
npm install

# 下载数据 (可选，用于完整功能)
npm run init-parsed
npm run init-config

# 构建数据
npm run build-indexes
npm run build-article-json

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

#### 2. 数据处理开发 / Data Processing Development

```bash
# 修改数据处理脚本
vim backend/build-article-json.ts

# 测试脚本
npm run build-article-json

# 验证输出
ls -la json/
```

#### 3. 前端开发 / Frontend Development

```bash
# 修改组件
vim components/Article/index.tsx

# 修改页面
vim pages/article/index.tsx

# 热重载自动生效
```

### 代码规范 / Code Standards

#### TypeScript 规范 / TypeScript Standards

```typescript
// ✅ 正确的使用方式
interface ArticleProps {
  article: ParserResult;
  onTagClick?: (tag: Tag) => void;
}

const ArticleCard: React.FC<ArticleProps> = ({ article, onTagClick }) => {
  const handleTagClick = (tag: Tag) => {
    onTagClick?.(tag);
  };

  return (
    <div>
      <h2>{article.title}</h2>
      {article.tags.map(tag => (
        <span key={`${tag.type}-${tag.name}`} onClick={() => handleTagClick(tag)}>
          {tag.name}
        </span>
      ))}
    </div>
  );
};

// ❌ 错误的使用方式
const ArticleCard = ({ article }) => {  // 缺少类型注解
  return <div>{article.title}</div>;     // 缺少 null 检查
};
```

#### 数据验证 / Data Validation

```typescript
// 在数据处理时进行验证
function processArticleData(rawData: any): ParserResult {
  // 验证数据结构
  const validation = validateParserResult(rawData);
  if (!validation.isValid) {
    throw new Error(`Invalid article data: ${validation.errors.join(', ')}`);
  }

  // 质量检查
  const qualityCheck = performQualityCheck(rawData);
  if (qualityCheck.score < 70) {
    console.warn(`Low quality article: ${qualityCheck.issues.map(i => i.message).join(', ')}`);
  }

  return rawData as ParserResult;
}
```

### 测试策略 / Testing Strategy

#### 单元测试 / Unit Tests

```typescript
// utils/__tests__/date.test.ts
import { formatDate } from '../date';

describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate({ year: 2023, month: 12, day: 25 })).toBe('2023-12-25');
  });

  it('should handle partial dates', () => {
    expect(formatDate({ year: 2023 })).toBe('2023');
  });
});
```

#### 数据验证测试 / Data Validation Tests

```typescript
// types/__tests__/validation.test.ts
import { validateParserResult } from '../validation';

describe('validateParserResult', () => {
  it('should validate complete article', () => {
    const validArticle: ParserResult = {
      title: 'Test Article',
      authors: ['Author'],
      dates: [{ year: 2023 }],
      is_range_date: false,
      tags: [{ name: 'test', type: TagType.subject }],
      types: [ArticleType.writings],
      parts: [{ text: 'Content', type: ContentType.paragraph }],
      comments: []
    };

    expect(validateParserResult(validArticle).isValid).toBe(true);
  });

  it('should reject article without title', () => {
    const invalidArticle = {
      authors: ['Author'],
      dates: [{ year: 2023 }],
      // missing title
    };

    expect(validateParserResult(invalidArticle as any).isValid).toBe(false);
  });
});
```

### 性能优化 / Performance Optimization

#### 数据加载优化 / Data Loading Optimization

```typescript
// 使用分片加载大型索引
async function loadArticleIndex(page: number = 0): Promise<ArticleList> {
  const fileCount = await fetch('/indexes/file_count.json').then(r => r.json());
  const indexFile = `/indexes/article_list_${page}.json`;

  return fetch(indexFile).then(r => r.json());
}

// 缓存频繁访问的数据
const articleCache = new Map<string, ParserResult>();

async function getArticle(id: string): Promise<ParserResult> {
  if (articleCache.has(id)) {
    return articleCache.get(id)!;
  }

  const article = await fetch(`/json/${id.slice(0, 3)}/${id}.json`)
    .then(r => r.json());

  articleCache.set(id, article);
  return article;
}
```

#### 构建优化 / Build Optimization

```typescript
// 增量构建 (只处理变更的文件)
async function incrementalBuild() {
  const changedFiles = await getChangedFiles();

  for (const file of changedFiles) {
    await processFile(file);
  }
}

// 并行处理
async function parallelBuild(files: string[]) {
  const promises = files.map(file => processFile(file));
  await Promise.all(promises);
}
```

---

## 📚 相关文档 / Related Documentation

- [本地运行指南](./local.md)
- [开发环境搭建](./dev.md)
- [录入与校对指南](./upload-and-correction.md)
- [数据 API 文档](./API.md)
- [故障排查](./TROUBLESHOOTING.md)
- [贡献指南](../CONTRIBUTING.md)
