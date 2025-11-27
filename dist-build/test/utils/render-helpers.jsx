"use strict";
/**
 * 测试工具函数库
 * 提供 React 组件测试的辅助函数和包装器
 */
const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.act = exports.userEvent = exports.cleanup = exports.within = exports.fireEvent = exports.waitFor = exports.screen = void 0;
exports.createMockRouter = createMockRouter;
exports.renderWithProviders = renderWithProviders;
exports.createQueryHelpers = createQueryHelpers;
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const styles_1 = require("@mui/material/styles");
const vitest_1 = require("vitest");
// Material-UI 主题配置（与应用保持一致）
const theme = (0, styles_1.createTheme)({
    palette: {
        primary: {
            main: '#cc0000',
        },
    },
    components: {},
});
/**
 * 创建可配置的 Next.js Router mock
 * @param overrides - 覆盖默认 router 属性的对象
 * @returns MockRouter 对象
 */
function createMockRouter(overrides = {}) {
    const defaultRouter = {
        pathname: '/',
        query: {},
        asPath: '/',
        push: vitest_1.vi.fn(() => Promise.resolve(true)),
        replace: vitest_1.vi.fn(() => Promise.resolve(true)),
        reload: vitest_1.vi.fn(),
        back: vitest_1.vi.fn(),
        prefetch: vitest_1.vi.fn(() => Promise.resolve()),
        beforePopState: vitest_1.vi.fn(),
        events: {
            on: vitest_1.vi.fn(),
            off: vitest_1.vi.fn(),
            emit: vitest_1.vi.fn(),
        },
    };
    return { ...defaultRouter, ...overrides };
}
/**
 * 测试提供者组件
 * 提供测试环境所需的所有上下文提供者
 */
function TestProviders({ children, router }) {
    // Mock Next.js router
    const mockRouter = createMockRouter(router);
    // Mock next/router module
    vitest_1.vi.doMock('next/router', () => ({
        useRouter: () => mockRouter,
    }));
    return (<styles_1.ThemeProvider theme={theme}>
      {children}
    </styles_1.ThemeProvider>);
}
/**
 * 包装的 render 函数，提供完整的测试环境
 * 包含 Material-UI ThemeProvider 和 Next.js Router mock
 *
 * @param ui - 要渲染的 React 组件
 * @param options - 渲染选项，包括 router mock 配置
 * @returns RenderResult
 *
 * @example
 * ```typescript
 * import { renderWithProviders } from '../test/utils/render-helpers';
 * import MyComponent from './MyComponent';
 *
 * const { getByText } = renderWithProviders(<MyComponent />);
 * expect(getByText('Hello')).toBeInTheDocument();
 * ```
 */
function renderWithProviders(ui, options = {}) {
    const { router, ...renderOptions } = options;
    const wrapper = ({ children }) => (<TestProviders router={router}>
      {children}
    </TestProviders>);
    return (0, react_2.render)(ui, { ...renderOptions, wrapper });
}
/**
 * 创建查询辅助函数的工厂函数
 * 提供常用的查询方法，减少重复代码
 *
 * @param result - renderWithProviders 的返回结果
 * @returns 查询辅助函数对象
 *
 * @example
 * ```typescript
 * const { container } = renderWithProviders(<MyComponent />);
 * const helpers = createQueryHelpers(container);
 * helpers.getByText('Hello');
 * ```
 */
function createQueryHelpers(result) {
    return {
        getByText: (text) => result.getByText(text),
        getByRole: (role, options) => result.getByRole(role, options),
        getByLabelText: (label) => result.getByLabelText(label),
        getByPlaceholderText: (placeholder) => result.getByPlaceholderText(placeholder),
        getByDisplayValue: (value) => result.getByDisplayValue(value),
        getAllByText: (text) => result.getAllByText(text),
        getAllByRole: (role, options) => result.getAllByRole(role, options),
        queryByText: (text) => result.queryByText(text),
        queryByRole: (role, options) => result.queryByRole(role, options),
    };
}
// 重新导出常用的 testing-library 函数，便于在测试中使用
const react_3 = require("@testing-library/react");
Object.defineProperty(exports, "screen", { enumerable: true, get: function () { return react_3.screen; } });
Object.defineProperty(exports, "waitFor", { enumerable: true, get: function () { return react_3.waitFor; } });
Object.defineProperty(exports, "fireEvent", { enumerable: true, get: function () { return react_3.fireEvent; } });
Object.defineProperty(exports, "within", { enumerable: true, get: function () { return react_3.within; } });
Object.defineProperty(exports, "cleanup", { enumerable: true, get: function () { return react_3.cleanup; } });
const user_event_1 = require("@testing-library/user-event");
Object.defineProperty(exports, "userEvent", { enumerable: true, get: function () { return user_event_1.userEvent; } });
const test_utils_1 = require("react-dom/test-utils");
Object.defineProperty(exports, "act", { enumerable: true, get: function () { return test_utils_1.act; } });
