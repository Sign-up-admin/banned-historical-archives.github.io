/**
 * Authors 组件测试
 *
 * 测试作者列表显示和点击导航功能
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import Authors from '../../components/Authors';

// Mock window.open
const mockWindowOpen = vi.fn();
global.window.open = mockWindowOpen;

describe('Authors', () => {
  const mockAuthors = ['毛泽东', '江青', '周恩来'];

  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  it('should render all authors as chips', () => {
    const { getByText } = renderWithProviders(
      <Authors authors={mockAuthors} />
    );

    mockAuthors.forEach(author => {
      expect(getByText(author)).toBeInTheDocument();
    });
  });

  it('should navigate to author search page when chip is clicked without onClick prop', () => {
    const { getByText } = renderWithProviders(
      <Authors authors={mockAuthors} />
    );

    const firstAuthorChip = getByText('毛泽东');
    firstAuthorChip.click();

    expect(mockWindowOpen).toHaveBeenCalledWith(
      '/articles?author=%E6%AF%9B%E6%B3%BD%E4%B8%9C',
      '_blank'
    );
  });

  it('should call onClick callback when chip is clicked with onClick prop', () => {
    const mockOnClick = vi.fn();
    const { getByText } = renderWithProviders(
      <Authors authors={mockAuthors} onClick={mockOnClick} />
    );

    const firstAuthorChip = getByText('毛泽东');
    firstAuthorChip.click();

    expect(mockOnClick).toHaveBeenCalledWith('毛泽东');
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it('should render empty component when authors array is empty', () => {
    const { container } = renderWithProviders(
      <Authors authors={[]} />
    );

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('should handle single author', () => {
    const singleAuthor = ['毛泽东'];
    const { getByText } = renderWithProviders(
      <Authors authors={singleAuthor} />
    );

    expect(getByText('毛泽东')).toBeInTheDocument();
  });

  it('should handle duplicate authors', () => {
    const duplicateAuthors = ['毛泽东', '毛泽东', '江青'];
    const { getAllByText } = renderWithProviders(
      <Authors authors={duplicateAuthors} />
    );

    const maoChips = getAllByText('毛泽东');
    expect(maoChips).toHaveLength(2);
  });
});
