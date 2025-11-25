/**
 * 示例测试文件
 * 验证新创建的测试基础设施是否正常工作
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/render-helpers';
import { createMockArticle, createMockTag } from '../mocks/data-generators';
import { articleFixtures } from '../fixtures';

// 示例组件（用于测试基础设施）
function ExampleArticle({ title, author }: { title: string; author: string[] }) {
  return (
    <div data-testid="article">
      <h1 data-testid="article-title">{title}</h1>
      <p data-testid="article-author">作者：{author.join(', ')}</p>
    </div>
  );
}

describe('测试基础设施验证 / Testing Infrastructure Verification', () => {
  describe('renderWithProviders 函数', () => {
    it('应该能正常渲染组件', () => {
      renderWithProviders(<div data-testid="test">Hello World</div>);

      expect(document.querySelector('[data-testid="test"]')).toBeInTheDocument();
    });

    it('应该支持自定义 router 配置', () => {
      renderWithProviders(<div>Test</div>, {
        router: { pathname: '/test-path' },
      });

      // 如果没有错误，说明基础设施正常
      expect(true).toBe(true);
    });
  });

  describe('Mock 数据生成器', () => {
    it('应该能生成有效的 Article 数据', () => {
      const mockArticle = createMockArticle({
        title: '测试文章',
        author: ['测试作者'],
      });

      expect(mockArticle.title).toBe('测试文章');
      expect(mockArticle.author).toEqual(['测试作者']);
      expect(mockArticle.dates).toBeDefined();
    });

    it('应该能生成有效的 Tag 数据', () => {
      const mockTag = createMockTag({
        name: '测试标签',
        type: '文稿大类' as any,
      });

      expect(mockTag.name).toBe('测试标签');
      expect(mockTag.type).toBe('文稿大类');
    });
  });

  describe('测试 Fixtures', () => {
    it('应该提供预定义的文章数据', () => {
      const article = articleFixtures.basic;

      expect(article.title).toBeDefined();
      expect(article.author).toBeDefined();
      expect(Array.isArray(article.tags)).toBe(true);
    });

    it('应该提供多种类型的测试数据', () => {
      expect(articleFixtures.articleList).toHaveLength(5);
      expect(articleFixtures.maoArticle.author).toEqual(['毛泽东']);
    });
  });

  describe('组件测试示例', () => {
    it('应该正确渲染文章组件', () => {
      const mockArticle = createMockArticle({
        title: '示例文章',
        author: ['示例作者'],
      });

      renderWithProviders(
        <ExampleArticle title={mockArticle.title} author={mockArticle.author} />
      );

      expect(screen.getByTestId('article-title')).toHaveTextContent('示例文章');
      expect(screen.getByTestId('article-author')).toHaveTextContent('作者：示例作者');
    });

    it('应该使用 fixtures 数据', () => {
      const article = articleFixtures.basic;

      renderWithProviders(
        <ExampleArticle title={article.title} author={article.author} />
      );

      expect(screen.getByTestId('article-title')).toBeInTheDocument();
      expect(screen.getByTestId('article-author')).toBeInTheDocument();
    });
  });
});
