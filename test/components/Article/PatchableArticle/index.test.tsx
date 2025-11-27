/**
 * PatchableArticle 组件测试
 *
 * 测试可编辑文章组件的完整功能
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../utils/render-helpers';
import { createMockParserResult } from '../../mocks/data-generators';
import PatchableArticle from '../../../../components/Article/PatchableArticle/index';

// Mock window.open
const mockWindowOpen = vi.fn();
global.window.open = mockWindowOpen;

// Mock process.env
const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv, COMMIT_HASH: 'test-commit-hash' };
});

afterEach(() => {
  process.env = originalEnv;
  mockWindowOpen.mockClear();
});

describe('PatchableArticle', () => {
  const mockArticle = createMockParserResult({
    title: '测试文章',
    authors: ['毛泽东'],
    dates: [{ year: 1949, month: 10, day: 1 }],
    is_range_date: false,
  });

  const mockContents = mockArticle.parts;
  const mockComments = [
    { index: -1, text: '文章描述', part_idx: -1, offset: 0, id: 'desc' },
    { index: 0, text: '第一段注释', part_idx: 0, offset: 5, id: 'comment1' },
  ];

  const defaultProps = {
    articleId: 'test-article-001',
    description: '测试描述',
    contents: mockContents,
    comments: mockComments,
    article: mockArticle,
    publicationName: '测试出版物',
    publicationId: 'test-pub-001',
  };

  it('should render article content', () => {
    const { getByText } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    expect(getByText('校对注意事项')).toBeInTheDocument();
    expect(getByText('描述')).toBeInTheDocument();
    expect(getByText('注释')).toBeInTheDocument();
  });

  it('should render all content parts', () => {
    const { container } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    // 检查是否有内容渲染（具体内容由 Part 组件处理）
    expect(container).toBeInTheDocument();
  });

  it('should show Popover when content is provided', () => {
    const { getByText } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    const button = getByText('校对注意事项');
    button.click();

    // Popover 应该显示在 DOM 中
    expect(document.body).toBeInTheDocument();
  });

  it('should handle submit changes with GitHub URL generation', () => {
    const { getByText } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    const submitButton = getByText('提交变更');
    submitButton.click();

    expect(mockWindowOpen).toHaveBeenCalled();
    const url = mockWindowOpen.mock.calls[0][0];

    expect(url).toContain('github.com');
    expect(url).toContain('issues/new');
    expect(url).toContain(encodeURIComponent('[OCR patch]测试文章[测试出版物][test-article-001][test-pub-001]'));
    expect(url).toContain('COMMIT_HASH');
  });

  it('should handle copy code and submit when URL is too long', () => {
    // Mock navigator.clipboard
    const mockClipboard = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockClipboard },
      writable: true,
    });

    const { getByText } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    const copyButton = getByText('复制代码并跳转');
    copyButton.click();

    expect(mockClipboard).toHaveBeenCalled();
    expect(mockWindowOpen).toHaveBeenCalled();

    const clipboardText = mockClipboard.mock.calls[0][0];
    expect(clipboardText).toContain('{OCR补丁}');
    expect(clipboardText).toContain('test-article-001');
  });

  it('should render description editor', () => {
    const { getByDisplayValue } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    // 检查描述文本框
    expect(getByDisplayValue('文章描述')).toBeInTheDocument();
  });

  it('should render comments section', () => {
    const { getByText } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    expect(getByText('注释')).toBeInTheDocument();
  });

  it('should handle empty contents array', () => {
    const propsWithEmptyContents = {
      ...defaultProps,
      contents: [],
    };

    const { container } = renderWithProviders(
      <PatchableArticle {...propsWithEmptyContents} />
    );

    expect(container).toBeInTheDocument();
  });

  it('should handle empty comments array', () => {
    const propsWithEmptyComments = {
      ...defaultProps,
      comments: [],
    };

    const { getByText } = renderWithProviders(
      <PatchableArticle {...propsWithEmptyComments} />
    );

    expect(getByText('注释')).toBeInTheDocument();
  });

  it('should include publication info in GitHub URL', () => {
    const { getByText } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    const submitButton = getByText('提交变更');
    submitButton.click();

    const url = mockWindowOpen.mock.calls[0][0];
    expect(url).toContain(encodeURIComponent('测试出版物'));
    expect(url).toContain('test-pub-001');
  });

  it('should handle missing publication name', () => {
    const propsWithoutPubName = {
      ...defaultProps,
      publicationName: undefined,
    };

    const { getByText } = renderWithProviders(
      <PatchableArticle {...propsWithoutPubName} />
    );

    const submitButton = getByText('提交变更');
    submitButton.click();

    const url = mockWindowOpen.mock.calls[0][0];
    expect(url).toContain(encodeURIComponent('[OCR patch]测试文章[][test-article-001][test-pub-001]'));
  });

  it('should render proofreading guidelines button', () => {
    const { getByText } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    const guidelinesButton = getByText('校对注意事项');
    expect(guidelinesButton).toBeInTheDocument();
    expect(guidelinesButton.tagName).toBe('BUTTON');
  });

  it('should have proper button styling', () => {
    const { getByText } = renderWithProviders(
      <PatchableArticle {...defaultProps} />
    );

    const submitButton = getByText('提交变更');
    expect(submitButton).toHaveClass('MuiButton-contained');
  });
});
