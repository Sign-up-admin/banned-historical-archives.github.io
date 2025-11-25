# 测试工程指南 / Testing Engineering Guide

本文档介绍了项目的测试基础设施和最佳实践。

This document introduces the project's testing infrastructure and best practices.

## 📁 目录结构 / Directory Structure

```
test/
├── setup.ts                    # 测试环境全局配置
├── utils/
│   └── render-helpers.ts       # React 组件测试工具函数
├── mocks/
│   └── data-generators.ts      # Mock 数据生成器
├── fixtures/
│   └── index.ts                # 预定义测试数据
├── components/
│   └── Component.test.template.tsx  # 组件测试模板
├── integration/                # 集成测试
├── utils-*.test.ts            # 工具函数单元测试
└── *.test.ts                   # 其他测试文件
```

## 🛠️ 测试基础设施 / Testing Infrastructure

### 全局配置 / Global Configuration

**`test/setup.ts`**
- 配置 `@testing-library/jest-dom` 扩展断言
- 设置测试环境变量
- Mock `fetch` API
- Mock Next.js Router
- 配置 jsdom 环境

### 工具函数库 / Utility Functions

**`test/utils/render-helpers.ts`**

#### `renderWithProviders(ui, options?)`
包装的 render 函数，提供完整的测试环境。

```typescript
import { renderWithProviders } from '../test/utils/render-helpers';

const { getByText } = renderWithProviders(<MyComponent />);
expect(getByText('Hello')).toBeInTheDocument();
```

**参数 / Parameters:**
- `ui`: ReactElement - 要渲染的组件
- `options.router`: Partial<MockRouter> - 可选的 router mock 配置

#### `createMockRouter(overrides?)`
创建可配置的 Next.js Router mock。

```typescript
const mockRouter = createMockRouter({
  pathname: '/custom-path',
  query: { id: '123' },
});
```

### Mock 数据生成器 / Mock Data Generators

**`test/mocks/data-generators.ts`**

提供各种数据类型的生成器，所有生成器都支持部分覆盖。

#### 基础类型生成器 / Basic Type Generators

```typescript
import {
  createMockArticle,
  createMockParserResult,
  createMockTag,
  createMockComment,
  createMockContent,
} from '../mocks/data-generators';

// 生成基础数据
const article = createMockArticle({
  title: '自定义标题',
  author: ['自定义作者'],
});

const tag = createMockTag({
  name: '自定义标签',
  type: TagType.character,
});
```

#### 高级生成器 / Advanced Generators

```typescript
// 生成带日期范围的文章
const dateRangeArticle = createMockArticleWithDateRange(
  { year: 1966, month: 5, day: 16 },
  { year: 1976, month: 10, day: 6 }
);

// 生成带多种标签的文章
const multiTagArticle = createMockArticleWithTags([
  { name: '中央文件', type: TagType.articleCategory },
  { name: '毛泽东', type: TagType.character },
]);

// 生成指定内容的解析结果
const customContent = createMockParserResultWithContent([
  '第一段内容',
  '第二段内容',
  '第三段内容',
]);
```

### 测试 Fixtures / Test Fixtures

**`test/fixtures/index.ts`**

预定义的测试数据集合，便于在测试中复用。

```typescript
import {
  articleFixtures,
  parserResultFixtures,
  tagFixtures,
  searchFixtures,
} from '../fixtures';

// 使用预定义的文章数据
const basicArticle = articleFixtures.basic;
const maoArticle = articleFixtures.maoArticle;

// 使用搜索相关的测试数据
const searchResults = searchFixtures.searchResults;
```

#### 可用 Fixtures

- `articleFixtures`: 各种类型的文章数据
- `parserResultFixtures`: 解析结果数据
- `tagFixtures`: 标签数据（分类、人物、地点、主题）
- `searchFixtures`: 搜索和过滤相关数据
- `componentFixtures`: UI 组件测试数据
- `errorFixtures`: 错误和边界情况数据

## 📝 编写测试 / Writing Tests

### 组件测试模板 / Component Test Template

复制 `test/components/Component.test.template.tsx` 并根据您的组件进行修改。

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import { createMockArticle } from '../mocks/data-generators';

describe('MyComponent', () => {
  it('应该正确渲染', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('内容')).toBeInTheDocument();
  });

  it('应该处理 props', () => {
    const mockData = createMockArticle({ title: '测试' });
    renderWithProviders(<MyComponent data={mockData} />);
    expect(screen.getByText('测试')).toBeInTheDocument();
  });
});
```

### 测试类型 / Test Types

#### 1. 单元测试 / Unit Tests
测试单个函数或组件的逻辑。

```typescript
describe('md5', () => {
  it('应该生成正确的 MD5 哈希', () => {
    expect(md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });
});
```

#### 2. 组件测试 / Component Tests
测试 React 组件的渲染和交互。

```typescript
describe('ArticleCard', () => {
  it('应该显示文章标题', () => {
    const mockArticle = createMockArticle({ title: '测试标题' });
    renderWithProviders(<ArticleCard article={mockArticle} />);

    expect(screen.getByText('测试标题')).toBeInTheDocument();
  });
});
```

#### 3. 集成测试 / Integration Tests
测试组件之间的交互。

```typescript
describe('ArticleList and Search', () => {
  it('应该支持搜索过滤', async () => {
    renderWithProviders(<ArticleList />);

    const searchInput = screen.getByPlaceholderText('搜索...');
    fireEvent.change(searchInput, { target: { value: '毛泽东' } });

    await waitFor(() => {
      expect(screen.getByText('星星之火，可以燎原')).toBeInTheDocument();
    });
  });
});
```

## 🧪 测试运行 / Running Tests

### 基本命令 / Basic Commands

```bash
# 运行所有测试
npm test

# 运行测试并监听文件变化
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 运行 UI 模式的测试
npm run test:ui
```

### 过滤测试 / Filtering Tests

```bash
# 运行特定文件的测试
npm test ArticleCard.test.tsx

# 运行匹配名称的测试
npm test -- --grep "应该显示标题"
```

## 📊 覆盖率报告 / Coverage Reports

测试覆盖率报告生成在 `coverage/` 目录中。

- `coverage/index.html` - HTML 报告（浏览器查看）
- `coverage/lcov.info` - LCOV 格式（CI/CD 使用）
- `coverage/junit.xml` - JUnit 格式（CI/CD 使用）

### 覆盖率阈值 / Coverage Thresholds

当前设置的覆盖率阈值：
- 语句覆盖率 / Statements: 80%
- 分支覆盖率 / Branches: 75%
- 函数覆盖率 / Functions: 80%
- 行覆盖率 / Lines: 80%

## 🔧 配置和扩展 / Configuration and Extensions

### Vitest 配置 / Vitest Configuration

主要配置在 `vitest.config.ts` 中：
- 测试环境：jsdom
- 覆盖率提供者：v8
- 测试文件匹配模式：`test/**/*.{test,spec}.{ts,tsx}`
- 排除文件：node_modules、test、构建文件等

### 扩展测试工具 / Extending Test Utilities

#### 添加新的 Mock 生成器 / Adding New Mock Generators

```typescript
// 在 data-generators.ts 中添加
export function createMockCustomType(overrides: Partial<CustomType> = {}): CustomType {
  return {
    id: 'mock-id',
    name: 'Mock Name',
    ...overrides,
  };
}
```

#### 添加新的测试辅助函数 / Adding New Test Helpers

```typescript
// 在 render-helpers.ts 中添加
export function renderWithCustomProviders(ui: ReactElement, options = {}) {
  // 自定义提供者逻辑
  return renderWithProviders(ui, options);
}
```

## 📚 最佳实践 / Best Practices

### 测试编写原则 / Testing Principles

1. **测试行为而非实现 / Test Behavior, Not Implementation**
   - 关注组件的用户可见行为
   - 避免测试私有方法和内部状态

2. **保持测试独立 / Keep Tests Independent**
   - 每个测试应该是独立的
   - 不要依赖其他测试的状态或顺序

3. **使用有意义的断言 / Use Meaningful Assertions**
   ```typescript
   // ✅ 好的断言
   expect(screen.getByRole('button')).toBeEnabled();

   // ❌ 不好的断言
   expect(component.state.isEnabled).toBe(true);
   ```

4. **Mock 外部依赖 / Mock External Dependencies**
   - Mock API 调用、路由、第三方库
   - 使用提供的 Mock 生成器创建测试数据

### 命名约定 / Naming Conventions

```typescript
// 描述性测试名称
describe('ArticleCard Component', () => {
  describe('when user clicks the title', () => {
    it('navigates to the article page', () => {
      // 测试逻辑
    });
  });
});
```

### 测试数据管理 / Test Data Management

```typescript
// 使用 Fixtures 管理复杂数据
const mockArticle = articleFixtures.basic;
const mockTags = tagFixtures.categories;

// 或者使用生成器创建自定义数据
const customArticle = createMockArticle({
  title: 'Custom Title',
  tags: [createMockTag({ name: 'Custom Tag' })],
});
```

## 🔍 调试测试 / Debugging Tests

### 常见问题 / Common Issues

1. **测试失败但代码正确**
   - 检查组件是否正确渲染
   - 使用 `screen.debug()` 查看 DOM 结构
   - 确认查询方法是否正确

2. **异步测试问题**
   ```typescript
   // 使用 waitFor 处理异步操作
   await waitFor(() => {
     expect(screen.getByText('加载完成')).toBeInTheDocument();
   });
   ```

3. **Mock 不工作**
   - 确保在测试文件顶部重置 mocks
   - 使用 `vi.clearAllMocks()` 清理 mocks

### 调试技巧 / Debugging Tips

```typescript
// 查看渲染的 DOM
const { container } = renderWithProviders(<MyComponent />);
screen.debug();

// 检查所有可用元素
screen.logTestingPlaygroundURL();

// 等待元素出现
await screen.findByText('异步加载的内容');
```

## 📈 持续改进 / Continuous Improvement

### 定期审查 / Regular Review

- 审查测试覆盖率报告
- 删除不再需要的测试
- 重构重复的测试代码
- 更新过时的测试数据

### 性能优化 / Performance Optimization

- 使用 `describe.skip` 和 `it.skip` 跳过慢速测试
- 并行运行测试（Vitest 默认支持）
- 优化大型测试套件的运行时间

### 测试质量保证 / Test Quality Assurance

- 定期运行完整测试套件
- 配置 CI/CD 集成测试
- 监控测试失败率
- 建立测试审查流程

---

## 📞 支持 / Support

如果您在测试开发过程中遇到问题，请：

1. 查看现有的测试文件作为参考
2. 阅读 Vitest 和 Testing Library 文档
3. 参考 `Component.test.template.tsx` 模板
4. 在项目中提出问题或建议

---

**注意**: 保持测试代码与主代码库同步更新。
