/**
 * render-helpers 工具函数验证测试
 * 验证测试工具函数是否正常工作
 */

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import React from 'react';
import { renderWithProviders, createMockRouter } from './render-helpers';

describe('render-helpers 工具函数验证 / render-helpers Utility Functions Verification', () => {

  describe('renderWithProviders 函数', () => {
    it('应该能正常渲染简单组件', () => {
      renderWithProviders(
        <div data-testid="test-element">Hello World</div>
      );

      expect(screen.getByTestId('test-element')).toHaveTextContent('Hello World');
    });

    it('应该支持自定义 router 配置', () => {
      const mockRouter = createMockRouter({
        pathname: '/custom-path',
        query: { id: '123' },
        asPath: '/custom-path?id=123',
      });

      renderWithProviders(
        <div data-testid="router-test">Router Test</div>,
        { router: mockRouter }
      );

      expect(screen.getByTestId('router-test')).toBeInTheDocument();
      // 验证 router 配置是否正确传递
      expect(mockRouter.pathname).toBe('/custom-path');
      expect(mockRouter.query.id).toBe('123');
    });

    it('应该提供默认 router 配置', () => {
      renderWithProviders(
        <div data-testid="default-router">Default Router</div>
      );

      expect(screen.getByTestId('default-router')).toBeInTheDocument();
    });
  });

  describe('createMockRouter 函数', () => {
    it('应该创建具有默认值的 router 对象', () => {
      const router = createMockRouter();

      expect(router.pathname).toBe('/');
      expect(router.query).toEqual({});
      expect(router.asPath).toBe('/');
      expect(typeof router.push).toBe('function');
      expect(typeof router.replace).toBe('function');
      expect(typeof router.reload).toBe('function');
    });

    it('应该支持部分覆盖默认值', () => {
      const router = createMockRouter({
        pathname: '/test',
        query: { param: 'value' },
      });

      expect(router.pathname).toBe('/test');
      expect(router.query.param).toBe('value');
      // 其他属性应该保持默认值
      expect(router.asPath).toBe('/');
    });

    it('应该提供可工作的 mock 函数', () => {
      const router = createMockRouter();

      // 验证函数存在且可调用
      expect(() => {
        void router.push('/test');
      }).not.toThrow();
      expect(() => {
        void router.replace('/test');
      }).not.toThrow();
      expect(() => {
        router.reload();
      }).not.toThrow();
      expect(() => {
        router.back();
      }).not.toThrow();
    });
  });
});
