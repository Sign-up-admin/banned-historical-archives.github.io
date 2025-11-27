/**
 * ImageTags 组件测试
 *
 * 测试图片标签显示和悬停提示功能
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import ImageTags from '../../components/ImageTags';

describe('ImageTags', () => {
  const mockTags = [
    { name: '历史文献', type: 'articleCategory' },
    { name: '毛泽东', type: 'character' },
    { name: '1966年', type: 'time' },
  ];

  it('should render all tags as chips', () => {
    const { getByText } = renderWithProviders(
      <ImageTags tags={mockTags} />
    );

    mockTags.forEach(tag => {
      expect(getByText(tag.name)).toBeInTheDocument();
    });
  });

  it('should show popover with tag type on mouse enter', async () => {
    const { getByText } = renderWithProviders(
      <ImageTags tags={mockTags} />
    );

    const firstTagChip = getByText('历史文献');
    firstTagChip.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // 等待 Popover 显示
    await new Promise(resolve => setTimeout(resolve, 0));

    // 检查是否有 popover 显示标签类型
    expect(getByText('articleCategory')).toBeInTheDocument();
  });

  it('should hide popover on mouse leave', async () => {
    const { getByText, queryByText } = renderWithProviders(
      <ImageTags tags={mockTags} />
    );

    const firstTagChip = getByText('历史文献');
    firstTagChip.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // 等待 Popover 显示
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(getByText('articleCategory')).toBeInTheDocument();

    // 触发 mouse leave
    firstTagChip.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    // 等待 Popover 隐藏
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(queryByText('articleCategory')).not.toBeInTheDocument();
  });

  it('should render empty component when tags array is empty', () => {
    const { container } = renderWithProviders(
      <ImageTags tags={[]} />
    );

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should handle single tag', () => {
    const singleTag = [mockTags[0]];
    const { getByText } = renderWithProviders(
      <ImageTags tags={singleTag} />
    );

    expect(getByText('历史文献')).toBeInTheDocument();
  });

  it('should generate unique keys for chips with same name but different types', () => {
    const tagsWithSameName = [
      { name: '历史文献', type: 'articleCategory' },
      { name: '历史文献', type: 'character' },
    ];

    const { getAllByText } = renderWithProviders(
      <ImageTags tags={tagsWithSameName} />
    );

    const chips = getAllByText('历史文献');
    expect(chips).toHaveLength(2);
  });

  it('should handle various tag types', () => {
    const variousTags = [
      { name: '中央文件', type: 'document' },
      { name: '江青', type: 'person' },
      { name: '文化大革命', type: 'event' },
      { name: '北京市', type: 'location' },
    ];

    const { getByText } = renderWithProviders(
      <ImageTags tags={variousTags} />
    );

    variousTags.forEach(tag => {
      expect(getByText(tag.name)).toBeInTheDocument();
    });
  });
});
