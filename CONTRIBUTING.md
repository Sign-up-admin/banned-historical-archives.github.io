# 贡献指南 / Contributing Guide

感谢您对和谐历史档案馆项目的兴趣！我们欢迎各种形式的贡献，包括代码贡献、文档改进、数据录入、问题报告等。

## 📋 目录 / Table of Contents

- [🚀 快速开始 / Quick Start](#-快速开始--quick-start)
- [💡 贡献类型 / Types of Contributions](#-贡献类型--types-of-contributions)
- [📝 开发规范 / Development Standards](#-开发规范--development-standards)
- [🔄 工作流程 / Workflow](#-工作流程--workflow)
- [🧪 测试指南 / Testing Guide](#-测试指南--testing-guide)
- [📄 文档规范 / Documentation Standards](#-文档规范--documentation-standards)
- [🤝 社区规范 / Community Guidelines](#-社区规范--community-guidelines)

## 🚀 快速开始 / Quick Start

### 环境搭建 / Environment Setup

```bash
# 1. Fork 项目
# 在 GitHub 上点击 "Fork" 按钮

# 2. 克隆你的 Fork
git clone https://github.com/YOUR_USERNAME/banned-historical-archives.github.io.git
cd banned-historical-archives.github.io

# 3. 安装依赖
npm install

# 4. 运行开发环境
npm run dev
```

### 第一个贡献 / Your First Contribution

1. **选择任务**: 查看 [Issues](https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues) 寻找适合的任务
2. **创建分支**: `git checkout -b feature/your-feature-name`
3. **编写代码**: 实现功能并添加测试
4. **提交代码**: `git commit -m "feat: add your feature"`
5. **推送分支**: `git push origin feature/your-feature-name`
6. **创建 PR**: 在 GitHub 上创建 Pull Request

## 💡 贡献类型 / Types of Contributions

### 🔧 代码贡献 / Code Contributions

- **功能开发**: 实现新功能或改进现有功能
- **Bug 修复**: 修复发现的问题
- **性能优化**: 提升系统性能和用户体验
- **代码重构**: 改进代码结构和可维护性

### 📊 数据贡献 / Data Contributions

- **文献录入**: 上传和处理历史文献
- **数据校对**: 验证和修正已录入数据
- **元数据完善**: 添加标签、分类、描述等
- **数据质量提升**: 改进数据格式和准确性

### 📖 文档贡献 / Documentation Contributions

- **文档编写**: 编写和完善项目文档
- **翻译工作**: 将文档翻译为其他语言
- **示例代码**: 提供使用示例和教程
- **问题解答**: 在 Issues 和讨论中帮助他人

### 🎨 设计贡献 / Design Contributions

- **UI/UX 改进**: 优化用户界面和体验
- **图标设计**: 设计和改进图标资源
- **视觉规范**: 制定和维护设计规范

### 🐛 问题报告 / Issue Reporting

- **Bug 报告**: 详细描述发现的问题
- **功能建议**: 提出改进建议
- **使用反馈**: 分享使用体验和建议

## 📝 开发规范 / Development Standards

### 代码风格 / Code Style

#### TypeScript/JavaScript 规范

```typescript
// ✅ 正确的使用方式
interface ArticleProps {
  article: ParserResult;
  onClick?: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleProps> = ({ article, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.(article);
  }, [article, onClick]);

  return (
    <Card onClick={handleClick}>
      <Typography variant="h6">{article.title}</Typography>
    </Card>
  );
};

// ❌ 错误的使用方式
const ArticleCard = ({ article }) => {  // 缺少类型注解
  return <div>{article.title}</div>;     // 缺少 null 检查
};
```

#### 文件和目录命名

```bash
# 正确
src/components/ArticleCard.tsx
src/utils/date-helpers.ts
src/types/article.ts

# 错误
src/components/articleCard.tsx  # 大小写不一致
src/utils/DateHelpers.ts       # 驼峰命名
src/types/Article.ts           # 目录和文件命名不一致
```

### 提交规范 / Commit Standards

#### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型定义

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(search): add Elasticsearch integration` |
| `fix` | 修复问题 | `fix(ui): resolve mobile layout issue` |
| `docs` | 文档更新 | `docs(readme): update installation guide` |
| `style` | 代码格式 | `style(components): format with prettier` |
| `refactor` | 代码重构 | `refactor(utils): simplify date parsing logic` |
| `test` | 测试相关 | `test(components): add unit tests for ArticleCard` |
| `chore` | 构建工具 | `chore(deps): update typescript to v5` |

#### 示例

```bash
# 功能提交
feat(search): add full-text search functionality

- Implement Elasticsearch client
- Add search API endpoints
- Update UI with search interface

Closes #123

# 修复提交
fix(api): handle null response in article fetch

- Add null checks for API responses
- Add error handling for network failures
- Update error messages for better UX

Fixes #456

# 文档提交
docs(contributing): add code style guidelines

- Add TypeScript style guide
- Include commit message conventions
- Add code review checklist
```

### 分支管理 / Branch Management

#### 分支命名规范

```
# 功能分支
feature/add-search-functionality
feature/user-authentication

# 修复分支
bugfix/fix-mobile-layout
bugfix/resolve-memory-leak

# 文档分支
docs/update-api-documentation
docs/add-contributing-guide

# 重构分支
refactor/simplify-component-structure
refactor/optimize-database-queries
```

#### 分支工作流

```bash
# 1. 从主分支创建新分支
git checkout master
git pull origin master
git checkout -b feature/your-feature

# 2. 定期同步主分支
git fetch origin
git rebase origin/master

# 3. 推送分支
git push origin feature/your-feature

# 4. 创建 Pull Request
# 在 GitHub 上操作
```

## 🔄 工作流程 / Workflow

### Pull Request 流程 / Pull Request Process

#### 1. 创建 PR 前准备

- [ ] 代码通过所有测试 (`npm test`)
- [ ] 代码通过 lint 检查 (`npm run lint`)
- [ ] 提交信息符合规范
- [ ] 更新相关文档
- [ ] 添加必要的测试

#### 2. 创建 Pull Request

1. **标题**: 使用清晰描述性的标题
2. **描述**: 详细说明变更内容
3. **链接 Issues**: 关联相关问题
4. **添加标签**: 选择合适的标签
5. **请求审查**: @相关维护者

#### 3. 代码审查 / Code Review

**审查者检查清单**:

**功能完整性**:

- [ ] 功能按需求实现
- [ ] 边界情况处理正确
- [ ] 错误处理完善

**代码质量**:

- [ ] 代码风格符合规范
- [ ] 逻辑清晰易懂
- [ ] 性能优化合理
- [ ] 测试覆盖完整

**文档和注释**:

- [ ] 代码注释完整
- [ ] 文档及时更新
- [ ] API 变更记录

**安全性和兼容性**:

- [ ] 无安全漏洞
- [ ] 向后兼容性
- [ ] 性能无明显下降

#### 4. 合并 PR / Merging PR

**合并条件**:

- ✅ 所有 CI 检查通过
- ✅ 至少一个维护者批准
- ✅ 无 blocking comments
- ✅ 相关文档已更新

### Issue 管理 / Issue Management

#### Issue 类型

**🐛 Bug Report**

```markdown
## Bug 描述
简明描述问题

## 复现步骤
1. 访问页面 '...'
2. 点击按钮 '...'
3. 出现错误

## 预期行为
应该发生什么

## 实际行为
实际发生了什么

## 环境信息
- 浏览器: Chrome 120.0
- 操作系统: Windows 11
- 其他信息
```

**💡 Feature Request**

```markdown
## 功能描述
简明描述新功能

## 需求背景
为什么需要这个功能

## 实现建议
如何实现这个功能

## 优先级
- [ ] 高
- [ ] 中
- [ ] 低
```

**📖 Documentation**

```markdown
## 文档问题
需要改进的文档部分

## 建议内容
应该如何改进

## 相关链接
相关文档链接
```

#### Issue 状态管理

| 状态 | 说明 | 颜色 |
|------|------|------|
| `open` | 新建问题 | 🟢 |
| `in_progress` | 正在处理 | 🟡 |
| `review` | 等待审查 | 🔵 |
| `approved` | 已批准 | 🟢 |
| `closed` | 已解决 | ⚪ |

## 🧪 测试指南 / Testing Guide

### 测试框架 / Testing Framework

本项目使用 **Vitest** 作为测试框架。Vitest 是一个基于 Vite 的快速测试运行器，提供与 Jest 兼容的 API，但执行速度更快。

This project uses **Vitest** as the testing framework. Vitest is a fast test runner based on Vite, providing Jest-compatible APIs with faster execution speed.

### 测试类型 / Types of Tests

#### 单元测试 / Unit Tests

```typescript
// test/utils.test.ts
import { describe, it, expect } from 'vitest';
import { md5, crypto_md5, get_article_id } from '../utils';
import { ParserResult } from '../types';

describe('utils', () => {
  describe('md5', () => {
    it('should generate correct MD5 hash', () => {
      const result = md5('hello world');
      expect(result).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
    });
  });

  describe('crypto_md5', () => {
    it('should generate correct MD5 hash using crypto', () => {
      const result = crypto_md5('hello world');
      expect(result).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
    });
  });

  describe('get_article_id', () => {
    it('should generate article ID from parser result', () => {
      const parserResult: ParserResult = {
        title: 'Test Article',
        authors: ['Author 1'],
        dates: [{ year: 2023, month: 12, day: 25 }],
        is_range_date: false,
        parts: [{ text: 'Content', type: 'paragraph' }],
        comments: [],
        comment_pivots: [],
      };
      const id = get_article_id(parserResult);
      expect(id).toHaveLength(10);
      expect(typeof id).toBe('string');
    });
  });
});
```

#### 组件测试 / Component Tests

```typescript
// test/components/ArticleCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArticleCard from '../../components/ArticleCard';

const mockArticle = {
  id: '123',
  title: 'Test Article',
  authors: ['Author 1'],
  dates: [{ year: 2023, month: 12, day: 25 }],
  is_range_date: false,
  tags: [],
  types: [],
  parts: [{ text: 'Content', type: 'paragraph' }],
  comments: [],
  comment_pivots: [],
};

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('renders authors', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText('Author 1')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ArticleCard article={mockArticle} onClick={handleClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledWith(mockArticle);
  });
});
```

#### 集成测试 / Integration Tests

```typescript
// test/integration/search.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTestServer } from '../test-utils/server';
import { searchArticles } from '../../utils';

describe('Search Integration', () => {
  let server: any;

  beforeAll(() => {
    server = createTestServer();
  });

  afterAll(() => {
    server.close();
  });

  it('should search articles successfully', async () => {
    const results = await searchArticles('毛泽东');

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should handle empty search results', async () => {
    const results = await searchArticles('nonexistent-term-12345');

    expect(results).toEqual([]);
  });
});
```

### 运行测试 / Running Tests

**注意**: 当前已配置测试脚本，可以使用以下方式运行测试：

**Note**: Test scripts are configured in `package.json`. You can run tests using the following methods:

```bash
# 使用 npx 直接运行 Vitest
# Run Vitest directly using npx
npx vitest

# 运行所有测试
# Run all tests
npx vitest run

# 运行特定测试文件
# Run specific test file
npx vitest run test/utils.test.ts

# 监听模式 (开发时)
# Watch mode (for development)
npx vitest watch

# 运行测试并生成覆盖率报告（需要 Vitest 4.0+）
# Run tests with coverage report (requires Vitest 4.0+)
npx vitest run --coverage

# 运行 UI 模式（可视化界面）
# Run UI mode (visual interface)
npx vitest --ui
```

**提示**: 可以使用以下npm脚本运行测试：

**Tip**: You can use the following npm scripts to run tests:

### 测试覆盖率要求 / Test Coverage Requirements

- **总体覆盖率**: >= 80%
- **语句覆盖率**: >= 80%
- **分支覆盖率**: >= 75%
- **函数覆盖率**: >= 85%

### 测试文件组织 / Test File Organization

- 测试文件应放在 `test/` 目录下
- 测试文件命名格式：`*.test.ts` 或 `*.spec.ts`
- 快照文件自动保存在 `test/__snapshots__/` 目录
- 组件测试可以放在 `test/components/` 目录
- 集成测试可以放在 `test/integration/` 目录

### Vitest 与 Jest 的主要区别 / Key Differences Between Vitest and Jest

1. **导入方式**: 需要从 `'vitest'` 导入测试函数
   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   ```

2. **Mock 函数**: 使用 `vi.fn()` 而非 `jest.fn()`
   ```typescript
   const mockFn = vi.fn();
   ```

3. **配置**: 使用 `vitest.config.ts` 而非 `jest.config.js`

4. **执行速度**: Vitest 通常比 Jest 更快，特别是在使用 Vite 的项目中

### 测试工程发展规划 / Testing Engineering Development Plan

#### 当前测试状态 / Current Test Status

根据测试代码调查，项目的测试工程处于初期阶段，存在多个关键问题：

**Based on test code investigation, the project's testing engineering is in its early stage with several critical issues:**

- ✅ **测试框架**: Vitest ^0.19.1 已安装，`vitest.config.ts` 已创建
- ✅ **测试基础设施**: 基本完成（配置文件、测试脚本已添加）
- ⚠️ **测试覆盖率严重不足**: 
  - 仅有 2 个测试文件，6 个通过测试
  - 16 个 React 组件完全没有测试
  - 大量工具函数未覆盖
- ⚠️ **版本和技术栈问题**: 
  - Vitest 0.19.1 不支持内置覆盖率（需要 4.0+）
  - 缺少 React 测试库依赖
- ⚠️ **CI/CD 集成缺失**: 没有测试相关的 GitHub workflow

#### 贡献者测试指南 / Contributor Testing Guidelines

作为贡献者，在编写代码时请遵循以下测试原则：

**As a contributor, please follow these testing principles when writing code:**

1. **新功能必须包含测试 / New Features Must Include Tests**
   - 每个新功能应该至少有一个测试用例
   - 测试应该覆盖主要功能和边界情况
   - 提交 PR 前确保所有测试通过

2. **测试优先原则 / Test-First Principle**
   - 鼓励先编写测试再实现功能（TDD）
   - 测试应该描述期望的行为
   - 测试失败后再修复代码

3. **测试代码质量 / Test Code Quality**
   - 测试代码应该清晰易读
   - 使用有意义的测试名称
   - 保持测试独立性和可重复性

#### 测试改进路线图 / Testing Improvement Roadmap

**第一阶段：基础设施完善（✅ 已完成）**
- ✅ 创建 `vitest.config.ts` 配置
- ✅ 添加测试脚本到 `package.json`
- ✅ 恢复缺失的测试文件

**第二阶段：框架升级和依赖补充（⚠️ 紧急）**
- ⚠️ 升级 Vitest 到 4.0+ 以支持覆盖率
- ⚠️ 安装 `@testing-library/react` 和 `@testing-library/jest-dom`
- ⚠️ 创建测试 CI/CD workflow
- ⚠️ 完善 `test/setup.ts` 配置

**第三阶段：核心功能测试（⚠️ 高优先级）**
- 为 `utils/index.ts` 中所有函数编写完整测试
- 补充边界条件和错误处理测试
- 目标：核心功能覆盖率 >= 80%

**第四阶段：组件和集成测试（⚠️ 关键缺失）**
- 为所有 16 个 React 组件编写测试
- 添加集成测试（数据加载、搜索等）
- 为 OCR 工作流添加 mock 测试
- 目标：整体覆盖率 >= 70%

**第五阶段：E2E 和性能测试（长期目标）**
- 引入 E2E 测试框架（Playwright/Cypress）
- 添加性能测试
- 建立完整的测试体系

### 测试最佳实践 / Testing Best Practices

#### 编写好的测试 / Writing Good Tests

1. **测试应该快速 / Tests Should Be Fast**
   ```typescript
   // ✅ 好的测试：快速、独立
   it('should calculate sum correctly', () => {
     expect(sum(1, 2)).toBe(3);
   });
   
   // ❌ 不好的测试：依赖外部资源
   it('should fetch data from API', async () => {
     const data = await fetch('https://api.example.com/data');
     // ...
   });
   ```

2. **测试应该稳定 / Tests Should Be Stable**
   - 避免依赖随机数据
   - 使用固定的测试数据
   - 避免时间相关的测试（或使用 mock）

3. **测试应该清晰 / Tests Should Be Clear**
   ```typescript
   // ✅ 清晰的测试
   describe('formatDate', () => {
     it('should format complete date as YYYY-MM-DD', () => {
       const date = { year: 2023, month: 12, day: 25 };
       expect(formatDate(date)).toBe('2023-12-25');
     });
   });
   ```

#### 测试覆盖率目标 / Test Coverage Goals

**当前状态 / Current Status:**
- 核心工具函数: ~20%（目标 >= 80%）⚠️
- 数据处理逻辑: ~10%（目标 >= 75%）⚠️
- React 组件: 0%（目标 >= 70%）❌
- 整体项目: ~5%（目标 >= 60%）❌

**改进计划 / Improvement Plan:**
- **短期（1-3个月）**: 核心工具函数 >= 80%，数据处理逻辑 >= 75%
- **中期（3-6个月）**: React 组件 >= 70%，整体项目 >= 50%
- **长期（6-12个月）**: 整体项目 >= 60%，建立完整测试体系

## 📄 文档规范 / Documentation Standards

### 文档生成工具 / Documentation Generation Tools

项目已配置自动化文档生成工具，可以从代码注释自动生成文档。

#### 文档生成命令 / Documentation Generation Commands

```bash
# 生成所有文档
npm run generate:docs

# 或使用简写
npm run docs
```

**生成的文件 / Generated Files:**

- `docs/API_GENERATED.md` - 从 `utils/index.ts` 生成的 API 文档
- `docs/TYPES_GENERATED.md` - 从 `types/index.ts` 生成的类型文档
- `docs/BUILD_SCRIPTS_GENERATED.md` - 从 `backend/*.ts` 生成的构建脚本文档

**注意 / Note**: 自动生成的文档文件包含 `_GENERATED` 后缀，请勿手动编辑这些文件。如需更新文档，请修改源代码中的 JSDoc/TSDoc 注释。

#### 文档生成流程 / Documentation Generation Process

1. **更新代码注释**: 在源代码中添加或更新 JSDoc/TSDoc 注释
2. **运行生成命令**: 执行 `npm run generate:docs`
3. **检查生成结果**: 查看生成的 Markdown 文件
4. **提交更改**: 将生成的文档文件一并提交

#### CI/CD 集成 / CI/CD Integration

文档生成已集成到 GitHub Actions，在以下情况自动运行：

- 推送到 master 分支时（如果相关代码文件有变更）
- 创建 Pull Request 时（如果相关代码文件有变更）
- 手动触发 workflow 时

如果检测到文档需要更新，工作流会：
- 在 PR 中添加评论提示
- 自动创建包含文档更新的 PR（推送到 master 时）

### 文档检查工具 / Documentation Check Tools

项目已配置自动化文档检查工具，类似静态代码检查器，确保文档质量。

#### 可用命令 / Available Commands

```bash
# 运行所有文档检查
npm run lint:docs

# 仅检查 Markdown 格式
npm run lint:docs:format

# 仅检查链接有效性（默认使用代理 127.0.0.1:10808）
npm run lint:docs:links

# 自定义代理地址（如果需要）
HTTP_PROXY=http://127.0.0.1:10808 HTTPS_PROXY=http://127.0.0.1:10808 npm run lint:docs:links

# 仅检查文本质量（拼写、术语、可读性）
npm run lint:docs:text

# 自动修复格式问题
npm run lint:docs:fix
```

**注意 / Note**: 链接检查默认使用代理 `http://127.0.0.1:10808`。如果需要使用其他代理地址，可以通过环境变量 `HTTP_PROXY` 和 `HTTPS_PROXY` 设置。

#### 检查工具说明 / Tool Descriptions

1. **Markdownlint** - Markdown 格式检查
   - 检查标题层级、列表格式、代码块格式
   - 配置文件: `.markdownlint.json`
   - 适配中英文文档格式要求

2. **markdown-link-check** - 链接有效性检查
   - 检查内部链接是否存在
   - 检查外部链接是否可访问
   - 配置文件: `.markdown-link-check.json`

3. **Textlint** - 文本质量检查
   - 拼写检查（支持中英文）
   - 术语一致性检查
   - 可读性评分
   - 配置文件: `.textlintrc.json`

#### 提交前检查 / Pre-commit Checklist

在提交文档更改前，请确保：

- [ ] 运行 `npm run lint:docs` 通过所有检查
- [ ] 修复所有格式问题（可使用 `npm run lint:docs:fix`）
- [ ] 验证所有链接有效
- [ ] 检查拼写和术语使用正确

#### CI/CD 集成 / CI/CD Integration

文档检查已集成到 GitHub Actions，在以下情况自动运行：

- 创建 Pull Request 时
- 推送到 master 分支时
- 手动触发 workflow 时

检查失败不会阻止合并，但会在 PR 中显示警告。建议修复所有问题后再合并。

### 代码注释 / Code Comments

#### JSDoc/TypeScript 注释

```typescript
/**
 * 格式化日期对象为字符串
 * @param date - 日期对象
 * @param format - 格式字符串 (可选)
 * @returns 格式化后的日期字符串
 * @example
 * ```typescript
 * formatDate({ year: 2023, month: 12, day: 25 }) // "2023-12-25"
 * formatDate({ year: 2023 }) // "2023"
 * ```
 */
export function formatDate(date: DateObject, format?: string): string {
  // 实现代码...
}
```

#### React 组件注释

```typescript
interface ArticleListProps {
  /** 文章列表 */
  articles: Article[];
  /** 加载状态 */
  loading?: boolean;
  /** 点击文章回调 */
  onArticleClick?: (article: Article) => void;
  /** 自定义样式 */
  className?: string;
}

/**
 * 文章列表组件
 *
 * @example
 * ```tsx
 * <ArticleList
 *   articles={articles}
 *   loading={false}
 *   onArticleClick={(article) => console.log(article)}
 * />
 * ```
 */
const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  loading = false,
  onArticleClick,
  className
}) => {
  // 组件实现...
};
```

### 文档更新 / Documentation Updates

#### 更新时机

- [ ] 添加新功能时
- [ ] 修改 API 时
- [ ] 修复重要 bug 时
- [ ] 发布新版本时

#### 更新内容

- [ ] README.md - 项目概述和快速开始
- [ ] API 文档 - 接口变更
- [ ] 部署文档 - 部署方式变更
- [ ] 故障排查 - 新增错误处理

## 🤝 社区规范 / Community Guidelines

### 沟通原则 / Communication Guidelines

#### 保持尊重 / Be Respectful

- 使用礼貌友好的语言
- 尊重不同观点和经验水平
- 建设性批评，避免人身攻击

#### 清晰表达 / Be Clear

- 使用准确的技术术语
- 提供完整的问题描述
- 包含必要的代码示例和错误信息

#### 积极参与 / Be Proactive

- 搜索现有 Issues 避免重复
- 提供可重现的步骤
- 及时响应讨论和问题

### 贡献认可 / Contribution Recognition

#### 贡献者类型

**代码贡献者**:

- 功能开发和维护
- 测试编写和维护
- 文档编写和翻译

**数据贡献者**:

- 历史文献录入
- 数据校对和验证
- 元数据完善

**社区贡献者**:

- 问题报告和建议
- 用户支持和帮助
- 社区活动组织

#### 认可方式

- GitHub 贡献者列表
- 发布说明中的致谢
- 社区活动邀请
- 项目徽章和证书

### 行为准则 / Code of Conduct

#### 允许行为 / Allowed Behaviors

- ✅ 友好和建设性的讨论
- ✅ 尊重不同意见和经验
- ✅ 提供帮助和支持
- ✅ 分享知识和经验

#### 禁止行为 / Prohibited Behaviors

- ❌ 侮辱性或攻击性语言
- ❌ 骚扰或歧视性内容
- ❌ 发布虚假信息
- ❌ 侵犯知识产权

#### 违规处理 / Violation Handling

1. **警告**: 首次违规发出警告
2. **暂停**: 严重违规暂停贡献权限
3. **封禁**: 严重或重复违规永久封禁

### 获取帮助 / Getting Help

#### 资源链接 / Resource Links

- [📖 项目文档](./docs/)
- [🐛 Issues](https://github.com/banned-historical-archives/banned-historical-archives.github.io/issues)
- [💬 讨论](https://github.com/banned-historical-archives/banned-historical-archives.github.io/discussions)
- [📧 邮件列表](mailto:contributors@banned-historical-archives.github.io)

#### 常见问题 / Common Questions

**如何开始贡献？**
查看 Issues 标签为 `good first issue` 的任务

**代码风格有疑问？**
参考现有代码和 `.eslintrc.js` 配置

**测试失败怎么办？**
运行 `npm run test:debug` 获取详细错误信息

**需要帮助？**
在 Issues 中描述问题，我们会尽快回复

---

## 🙏 致谢 / Acknowledgments

感谢所有为这个项目做出贡献的开发者、数据贡献者和社区成员！

特别感谢：

- 所有历史文献的提供者
- 代码贡献者和维护者
- 文档作者和翻译者
- 测试和反馈提供者

---

**最后更新**: 2024年12月

**维护者**: 项目维护团队

**许可证**: MIT License
