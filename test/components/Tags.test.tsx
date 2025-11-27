/**
 * Tags 组件测试
 *
 * 测试标签显示、悬停提示和点击导航功能
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import { createMockTags } from '../mocks/data-generators';
import Tags from '../../components/Tags';

// Mock window.open
const mockWindowOpen = vi.fn();
global.window.open = mockWindowOpen;

describe('Tags', () => {
  const mockTags = createMockTags(3, (index) => ({
    name: `测试标签${index + 1}`,
    type: ['articleCategory', 'character', 'place'][index % 3] as any,
  }));

  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  it('should render all tags as chips', () => {
    const { getByText } = renderWithProviders(
      <Tags tags={mockTags} />
    );

    mockTags.forEach(tag => {
      expect(getByText(tag.name)).toBeInTheDocument();
    });
  });

  it('should navigate to tag search page when chip is clicked without onClick prop', () => {
    const { getByText } = renderWithProviders(
      <Tags tags={mockTags} />
    );

    const firstTagChip = getByText('测试标签1');
    firstTagChip.click();

    expect(mockWindowOpen).toHaveBeenCalledWith(
      `/articles?tag=%E6%B5%8B%E8%AF%95%E6%A0%87%E7%AD%BE1`,
      '_blank'
    );
  });

  it('should call onClick callback when chip is clicked with onClick prop', () => {
    const mockOnClick = vi.fn();
    const { getByText } = renderWithProviders(
      <Tags tags={mockTags} onClick={mockOnClick} />
    );

    const firstTagChip = getByText('测试标签1');
    firstTagChip.click();

    expect(mockOnClick).toHaveBeenCalledWith(mockTags[0]);
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it('should show popover with tag type on mouse enter', async () => {
    const { getByText, getByRole } = renderWithProviders(
      <Tags tags={mockTags} />
    );

    const firstTagChip = getByText('测试标签1');
    firstTagChip.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // 等待 Popover 显示
    await new Promise(resolve => setTimeout(resolve, 0));

    // 检查是否有 popover 显示标签类型
    expect(getByText('articleCategory')).toBeInTheDocument();
  });

  it('should hide popover on mouse leave', async () => {
    const { getByText, queryByText } = renderWithProviders(
      <Tags tags={mockTags} />
    );

    const firstTagChip = getByText('测试标签1');
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
      <Tags tags={[]} />
    );

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should handle single tag', () => {
    const singleTag = [mockTags[0]];
    const { getByText } = renderWithProviders(
      <Tags tags={singleTag} />
    );

    expect(getByText('测试标签1')).toBeInTheDocument();
  });

  it('should generate unique keys for chips', () => {
    const tagsWithSameName = [
      { id: '1', name: '历史文献', type: 'articleCategory' as any },
      { id: '2', name: '历史文献', type: 'character' as any },
    ];

    const { getAllByText } = renderWithProviders(
      <Tags tags={tagsWithSameName} />
    );

    const chips = getAllByText('历史文献');
    expect(chips).toHaveLength(2);
  });
});
