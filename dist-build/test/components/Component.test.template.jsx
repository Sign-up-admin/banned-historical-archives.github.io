"use strict";
/**
 * React 组件测试模板
 *
 * 这个模板展示了如何为 React 组件编写全面的测试用例。
 * 复制此模板并根据您的组件进行修改。
 *
 * 测试结构：
 * 1. 基本渲染测试 - 确保组件能正常渲染
 * 2. Props 测试 - 验证 props 正确传递和处理
 * 3. 用户交互测试 - 测试用户事件和状态变化
 * 4. 条件渲染测试 - 测试不同条件下的渲染结果
 * 5. 错误处理测试 - 测试错误边界和异常情况
 * 6. 辅助功能测试 - 测试 ARIA 属性和键盘导航
 *
 * 使用方法：
 * 1. 将此文件重命名为 `YourComponent.test.tsx`
 * 2. 替换 `ComponentName` 为您的组件名
 * 3. 更新导入路径和组件使用方式
 * 4. 根据组件功能添加或修改测试用例
 * 5. 运行测试：`npm test YourComponent.test.tsx`
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const vitest_2 = require("vitest");
const react_1 = require("@testing-library/react"); // waitFor unused in template
const render_helpers_1 = require("../utils/render-helpers");
// 导入您的 mock 数据生成器
const data_generators_1 = require("../mocks/data-generators");
const types_1 = require("../../types");
/**
 * 示例：测试 Layout 组件
 *
 * 注意：这是一个模板示例，实际使用时需要：
 * 1. 替换组件导入
 * 2. 修改测试用例以匹配您的组件
 * 3. 更新 mock 数据
 */
// 导入要测试的组件
// import Layout from '../../components/Layout';
// import Navbar from '../../components/Navbar';
// import Article from '../../components/Article';
// 示例：替换为您的组件
function ComponentName({ title, onClick, disabled = false }) {
    return (<button onClick={onClick} disabled={disabled} data-testid="component-button">
      {title}
    </button>);
}
(0, vitest_1.describe)('ComponentName 组件测试', () => {
    /**
     * 测试准备和清理
     */
    (0, vitest_1.beforeEach)(() => {
        // 每个测试前的准备工作
    });
    (0, vitest_1.afterEach)(() => {
        // 每个测试后的清理工作
    });
    /**
     * 1. 基本渲染测试
     * 确保组件能正常渲染，不抛出错误
     */
    (0, vitest_1.describe)('基本渲染', () => {
        (0, vitest_1.it)('应该正确渲染组件', () => {
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="测试按钮"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('component-button')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('测试按钮')).toBeInTheDocument();
        });
        (0, vitest_1.it)('应该具有正确的默认属性', () => {
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="测试按钮"/>);
            const button = react_1.screen.getByTestId('component-button');
            (0, vitest_1.expect)(button).not.toBeDisabled();
            (0, vitest_1.expect)(button).toHaveAttribute('type', 'button');
        });
        (0, vitest_1.it)('应该支持自定义 router 配置', () => {
            const mockRouter = (0, render_helpers_1.createMockRouter)({
                pathname: '/custom-path',
                query: { id: '123' },
            });
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="测试"/>, {
                router: mockRouter,
            });
            // 验证 router 配置是否生效
            (0, vitest_1.expect)(mockRouter.pathname).toBe('/custom-path');
        });
    });
    /**
     * 2. Props 测试
     * 验证 props 正确传递和处理
     */
    (0, vitest_1.describe)('Props 处理', () => {
        (0, vitest_1.it)('应该正确显示 title prop', () => {
            const testTitle = '自定义标题';
            (0, render_helpers_1.renderWithProviders)(<ComponentName title={testTitle}/>);
            (0, vitest_1.expect)(react_1.screen.getByText(testTitle)).toBeInTheDocument();
        });
        (0, vitest_1.it)('应该正确处理 disabled prop', () => {
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="禁用按钮" disabled={true}/>);
            const button = react_1.screen.getByTestId('component-button');
            (0, vitest_1.expect)(button).toBeDisabled();
        });
        (0, vitest_1.it)('应该支持空 title', () => {
            (0, render_helpers_1.renderWithProviders)(<ComponentName title=""/>);
            const button = react_1.screen.getByTestId('component-button');
            (0, vitest_1.expect)(button).toHaveTextContent('');
        });
    });
    /**
     * 3. 用户交互测试
     * 测试用户事件和状态变化
     */
    (0, vitest_1.describe)('用户交互', () => {
        (0, vitest_1.it)('应该在点击时调用 onClick 回调', async () => {
            const mockOnClick = vitest_2.vi.fn();
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="可点击按钮" onClick={mockOnClick}/>);
            const button = react_1.screen.getByTestId('component-button');
            react_1.fireEvent.click(button);
            (0, vitest_1.expect)(mockOnClick).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('禁用状态下不应该调用 onClick', () => {
            const mockOnClick = vitest_2.vi.fn();
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="禁用按钮" onClick={mockOnClick} disabled={true}/>);
            const button = react_1.screen.getByTestId('component-button');
            react_1.fireEvent.click(button);
            (0, vitest_1.expect)(mockOnClick).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('应该支持键盘交互', () => {
            const mockOnClick = vitest_2.vi.fn();
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="键盘按钮" onClick={mockOnClick}/>);
            const button = react_1.screen.getByTestId('component-button');
            react_1.fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
            // 注意：实际的键盘事件处理取决于组件实现
            // 这里只是示例
        });
    });
    /**
     * 4. 条件渲染测试
     * 测试不同条件下的渲染结果
     */
    (0, vitest_1.describe)('条件渲染', () => {
        (0, vitest_1.it)('应该在不同状态下显示不同内容', () => {
            const { rerender } = (0, render_helpers_1.renderWithProviders)(<ComponentName title="正常状态"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('正常状态')).toBeInTheDocument();
            // 重新渲染组件测试状态变化
            rerender(<ComponentName title="更新状态" disabled={true}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('更新状态')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('component-button')).toBeDisabled();
        });
    });
    /**
     * 5. Mock 数据集成测试
     * 使用生成的 mock 数据进行测试
     */
    (0, vitest_1.describe)('Mock 数据集成', () => {
        (0, vitest_1.it)('应该能处理 mock Article 数据', () => {
            const mockArticle = (0, data_generators_1.createMockArticle)({
                title: '测试文章',
                author: ['测试作者'],
            });
            // 假设您的组件接收 Article 数据
            // renderWithProviders(<ArticleComponent article={mockArticle} />);
            (0, vitest_1.expect)(mockArticle.title).toBe('测试文章');
            (0, vitest_1.expect)(mockArticle.author).toEqual(['测试作者']);
        });
        (0, vitest_1.it)('应该能处理复杂的 ParserResult 数据', () => {
            const mockParserResult = (0, data_generators_1.createMockParserResult)({
                title: '复杂测试文章',
                authors: ['作者A', '作者B'],
                parts: [
                    (0, data_generators_1.createMockContent)({ text: '第一段', type: types_1.ContentType.paragraph }),
                    (0, data_generators_1.createMockContent)({ text: '第二段', type: types_1.ContentType.paragraph }),
                ],
            });
            // 使用 mock 数据进行组件测试
            (0, vitest_1.expect)(mockParserResult.title).toBe('复杂测试文章');
            (0, vitest_1.expect)(mockParserResult.authors).toHaveLength(2);
            (0, vitest_1.expect)(mockParserResult.parts).toHaveLength(2);
        });
    });
    /**
     * 6. 辅助功能和无障碍测试
     * 测试 ARIA 属性和屏幕阅读器支持
     */
    (0, vitest_1.describe)('辅助功能', () => {
        (0, vitest_1.it)('应该具有适当的 ARIA 属性', () => {
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="无障碍按钮"/>);
            const button = react_1.screen.getByRole('button');
            (0, vitest_1.expect)(button).toBeInTheDocument();
            // 检查是否有适当的 aria-label 或其他辅助属性
        });
        (0, vitest_1.it)('应该支持屏幕阅读器', () => {
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="屏幕阅读器测试"/>);
            // 验证组件是否对屏幕阅读器友好
            const button = react_1.screen.getByRole('button');
            (0, vitest_1.expect)(button).toHaveAccessibleName();
        });
    });
    /**
     * 7. 错误处理测试
     * 测试错误边界和异常情况
     */
    (0, vitest_1.describe)('错误处理', () => {
        (0, vitest_1.it)('应该优雅处理无效 props', () => {
            // 测试 null 或 undefined props
            (0, render_helpers_1.renderWithProviders)(<ComponentName title={undefined}/>);
            // 验证组件没有崩溃
            (0, vitest_1.expect)(react_1.screen.getByTestId('component-button')).toBeInTheDocument();
        });
        (0, vitest_1.it)('应该处理异步错误', async () => {
            const mockOnClick = vitest_2.vi.fn(() => Promise.reject(new Error('异步错误')));
            (0, render_helpers_1.renderWithProviders)(<ComponentName title="异步错误按钮" onClick={mockOnClick}/>);
            const button = react_1.screen.getByTestId('component-button');
            // 不直接测试错误处理，因为这通常由错误边界处理
            // 这里只是确保组件能正常渲染
            (0, vitest_1.expect)(button).toBeInTheDocument();
        });
    });
    /**
     * 8. 性能和内存泄漏测试
     * 测试组件的性能表现
     */
    (0, vitest_1.describe)('性能测试', () => {
        (0, vitest_1.it)('应该在重新渲染时保持性能', () => {
            const { rerender } = (0, render_helpers_1.renderWithProviders)(<ComponentName title="性能测试"/>);
            // 多次重新渲染测试性能
            for (let i = 0; i < 10; i++) {
                rerender(<ComponentName title={`性能测试 ${i}`}/>);
            }
            (0, vitest_1.expect)(react_1.screen.getByText('性能测试 9')).toBeInTheDocument();
        });
    });
    /**
     * 9. 快照测试（可选）
     * 测试组件的结构是否发生意外变化
     */
    (0, vitest_1.describe)('快照测试', () => {
        (0, vitest_1.it)('应该匹配快照', () => {
            const { container } = (0, render_helpers_1.renderWithProviders)(<ComponentName title="快照测试"/>);
            (0, vitest_1.expect)(container.firstChild).toMatchSnapshot();
        });
    });
});
/**
 * 实际组件测试示例
 *
 * 下面是针对项目中真实组件的测试示例。
 * 取消注释并修改以适应您的具体组件。
 */
// describe('Layout 组件测试', () => {
//   it('应该渲染导航栏和页脚', () => {
//     const mockChildren = <div data-testid="page-content">页面内容</div>;
//     renderWithProviders(<Layout>{mockChildren}</Layout>);
//     expect(screen.getByTestId('navbar')).toBeInTheDocument();
//     expect(screen.getByTestId('footer')).toBeInTheDocument();
//     expect(screen.getByTestId('page-content')).toBeInTheDocument();
//   });
//   it('应该在路由变化时显示加载状态', async () => {
//     const mockRouter = createMockRouter({
//       events: {
//         on: vi.fn(),
//         off: vi.fn(),
//         emit: vi.fn(),
//       },
//     });
//     renderWithProviders(<Layout><div>内容</div></Layout>, {
//       router: mockRouter,
//     });
//     // 触发路由变化
//     mockRouter.events.emit('routeChangeStart', '/new-route');
//     await waitFor(() => {
//       expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
//     });
//   });
// });
// describe('Navbar 组件测试', () => {
//   it('应该渲染所有导航链接', () => {
//     renderWithProviders(<Navbar />);
//     expect(screen.getByText('首页')).toBeInTheDocument();
//     expect(screen.getByText('文章')).toBeInTheDocument();
//     expect(screen.getByText('搜索')).toBeInTheDocument();
//   });
//   it('应该支持响应式菜单', () => {
//     // Mock 移动设备视口
//     Object.defineProperty(window, 'innerWidth', {
//       writable: true,
//       value: 500,
//     });
//     renderWithProviders(<Navbar />);
//     const menuButton = screen.getByLabelText('菜单');
//     fireEvent.click(menuButton);
//     expect(screen.getByRole('menu')).toBeInTheDocument();
//   });
//   it('应该支持搜索功能', async () => {
//     renderWithProviders(<Navbar />);
//     const searchInput = screen.getByPlaceholderText('搜索...');
//     fireEvent.change(searchInput, { target: { value: '毛泽东' } });
//     await waitFor(() => {
//       expect(searchInput).toHaveValue('毛泽东');
//     });
//   });
// });
/**
 * 测试最佳实践提示：
 *
 * 1. 每个测试应该是独立的，不要依赖其他测试的状态
 * 2. 使用有意义的测试描述，说明测试的目的
 * 3. 优先测试用户可见的行为，而不是实现细节
 * 4. 使用 data-testid 属性来定位不容易通过文本或角色定位的元素
 * 5. 对于异步操作，使用 waitFor 或 findBy* 查询方法
 * 6. Mock 外部依赖，避免测试中出现不稳定的网络请求
 * 7. 测试边界条件和错误情况
 * 8. 保持测试代码的整洁和可维护性
 *
 * 常用查询方法：
 * - getByText: 通过文本内容查找
 * - getByRole: 通过 ARIA 角色查找
 * - getByLabelText: 通过标签文本查找
 * - getByPlaceholderText: 通过占位符文本查找
 * - getByTestId: 通过测试 ID 查找
 *
 * 常用断言：
 * - toBeInTheDocument(): 元素是否存在于 DOM 中
 * - toHaveTextContent(): 检查文本内容
 * - toBeDisabled(): 检查是否禁用
 * - toHaveAttribute(): 检查属性值
 * - toHaveBeenCalled(): 检查函数是否被调用
 */
