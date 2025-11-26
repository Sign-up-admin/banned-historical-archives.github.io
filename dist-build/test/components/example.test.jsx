"use strict";
/**
 * 示例测试文件
 * 验证新创建的测试基础设施是否正常工作
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const vitest_1 = require("vitest");
const react_2 = require("@testing-library/react");
const render_helpers_1 = require("../utils/render-helpers");
const data_generators_1 = require("../mocks/data-generators");
const fixtures_1 = require("../fixtures");
// 示例组件（用于测试基础设施）
function ExampleArticle({ title, author }) {
    return (<div data-testid="article">
      <h1 data-testid="article-title">{title}</h1>
      <p data-testid="article-author">作者：{author.join(', ')}</p>
    </div>);
}
(0, vitest_1.describe)('测试基础设施验证 / Testing Infrastructure Verification', () => {
    (0, vitest_1.describe)('renderWithProviders 函数', () => {
        (0, vitest_1.it)('应该能正常渲染组件', () => {
            (0, render_helpers_1.renderWithProviders)(<div data-testid="test">Hello World</div>);
            (0, vitest_1.expect)(document.querySelector('[data-testid="test"]')).toBeInTheDocument();
        });
        (0, vitest_1.it)('应该支持自定义 router 配置', () => {
            (0, render_helpers_1.renderWithProviders)(<div>Test</div>, {
                router: { pathname: '/test-path' },
            });
            // 如果没有错误，说明基础设施正常
            (0, vitest_1.expect)(true).toBe(true);
        });
    });
    (0, vitest_1.describe)('Mock 数据生成器', () => {
        (0, vitest_1.it)('应该能生成有效的 Article 数据', () => {
            const mockArticle = (0, data_generators_1.createMockArticle)({
                title: '测试文章',
                author: ['测试作者'],
            });
            (0, vitest_1.expect)(mockArticle.title).toBe('测试文章');
            (0, vitest_1.expect)(mockArticle.author).toEqual(['测试作者']);
            (0, vitest_1.expect)(mockArticle.dates).toBeDefined();
        });
        (0, vitest_1.it)('应该能生成有效的 Tag 数据', () => {
            const mockTag = (0, data_generators_1.createMockTag)({
                name: '测试标签',
                type: '文稿大类',
            });
            (0, vitest_1.expect)(mockTag.name).toBe('测试标签');
            (0, vitest_1.expect)(mockTag.type).toBe('文稿大类');
        });
    });
    (0, vitest_1.describe)('测试 Fixtures', () => {
        (0, vitest_1.it)('应该提供预定义的文章数据', () => {
            const article = fixtures_1.articleFixtures.basic;
            (0, vitest_1.expect)(article.title).toBeDefined();
            (0, vitest_1.expect)(article.author).toBeDefined();
            (0, vitest_1.expect)(Array.isArray(article.tags)).toBe(true);
        });
        (0, vitest_1.it)('应该提供多种类型的测试数据', () => {
            (0, vitest_1.expect)(fixtures_1.articleFixtures.articleList).toHaveLength(5);
            (0, vitest_1.expect)(fixtures_1.articleFixtures.maoArticle.author).toEqual(['毛泽东']);
        });
    });
    (0, vitest_1.describe)('组件测试示例', () => {
        (0, vitest_1.it)('应该正确渲染文章组件', () => {
            const mockArticle = (0, data_generators_1.createMockArticle)({
                title: '示例文章',
                author: ['示例作者'],
            });
            (0, render_helpers_1.renderWithProviders)(<ExampleArticle title={mockArticle.title} author={mockArticle.author}/>);
            (0, vitest_1.expect)(react_2.screen.getByTestId('article-title')).toHaveTextContent('示例文章');
            (0, vitest_1.expect)(react_2.screen.getByTestId('article-author')).toHaveTextContent('作者：示例作者');
        });
        (0, vitest_1.it)('应该使用 fixtures 数据', () => {
            const article = fixtures_1.articleFixtures.basic;
            (0, render_helpers_1.renderWithProviders)(<ExampleArticle title={article.title} author={article.author}/>);
            (0, vitest_1.expect)(react_2.screen.getByTestId('article-title')).toBeInTheDocument();
            (0, vitest_1.expect)(react_2.screen.getByTestId('article-author')).toBeInTheDocument();
        });
    });
});
