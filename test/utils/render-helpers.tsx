/**
 * 测试工具函数库
 * 提供 React 组件测试的辅助函数和包装器
 */

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';

// Material-UI 主题配置（与应用保持一致）
const theme = createTheme({
  palette: {
    primary: {
      main: '#cc0000',
    },
  },
  components: {},
});

/**
 * Next.js Router mock 类型定义
 */
export interface MockRouter {
  pathname: string;
  query: Record<string, string | string[]>;
  asPath: string;
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  reload: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
  beforePopState: ReturnType<typeof vi.fn>;
  events: {
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
    emit: ReturnType<typeof vi.fn>;
  };
}

/**
 * 创建可配置的 Next.js Router mock
 * @param overrides - 覆盖默认 router 属性的对象
 * @returns MockRouter 对象
 */
export function createMockRouter(overrides: Partial<MockRouter> = {}): MockRouter {
const defaultRouter: MockRouter = {
  pathname: '/',
  query: {},
  asPath: '/',
  push: vi.fn(() => Promise.resolve(true)),
  replace: vi.fn(() => Promise.resolve(true)),
  reload: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(() => Promise.resolve()),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
};

  return { ...defaultRouter, ...overrides };
}

/**
 * 测试提供者组件的 Props 类型
 */
interface TestProvidersProps {
  children: ReactNode;
  router?: Partial<MockRouter>;
}

/**
 * 测试提供者组件
 * 提供测试环境所需的所有上下文提供者
 */
function TestProviders({ children, router }: TestProvidersProps) {
  // Mock Next.js router
  const mockRouter = createMockRouter(router);

  // Mock next/router module
  vi.doMock('next/router', () => ({
    useRouter: () => mockRouter,
  }));

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

/**
 * 扩展的 RenderOptions 类型
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  router?: Partial<MockRouter>;
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
export function renderWithProviders(
  ui: ReactElement,
  options: ExtendedRenderOptions = {}
): RenderResult {
  const { router, ...renderOptions } = options;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <TestProviders router={router}>
      {children}
    </TestProviders>
  );

  return render(ui, { ...renderOptions, wrapper });
}

/**
 * 查询辅助函数类型
 */
interface QueryHelpers {
  getByText: (text: string | RegExp) => HTMLElement;
  getByRole: (role: string) => HTMLElement;
  getByLabelText: (label: string | RegExp) => HTMLElement;
  getByPlaceholderText: (placeholder: string | RegExp) => HTMLElement;
  getByDisplayValue: (value: string | RegExp) => HTMLElement;
  getAllByText: (text: string | RegExp) => HTMLElement[];
  getAllByRole: (role: string) => HTMLElement[];
  queryByText: (text: string | RegExp) => HTMLElement | null;
  queryByRole: (role: string) => HTMLElement | null;
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
export function createQueryHelpers(result: RenderResult): QueryHelpers {
  return {
    getByText: (text: string | RegExp) => result.getByText(text),
    getByRole: (role: string, options?: any) => result.getByRole(role, options),
    getByLabelText: (label: string | RegExp) => result.getByLabelText(label),
    getByPlaceholderText: (placeholder: string | RegExp) => result.getByPlaceholderText(placeholder),
    getByDisplayValue: (value: string | RegExp) => result.getByDisplayValue(value),
    getAllByText: (text: string | RegExp) => result.getAllByText(text),
    getAllByRole: (role: string, options?: any) => result.getAllByRole(role, options),
    queryByText: (text: string | RegExp) => result.queryByText(text),
    queryByRole: (role: string, options?: any) => result.queryByRole(role, options),
  };
}

// 重新导出常用的 testing-library 函数，便于在测试中使用
export {
  screen,
  waitFor,
  fireEvent,
  within,
  cleanup,
} from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
export { act } from 'react-dom/test-utils';
