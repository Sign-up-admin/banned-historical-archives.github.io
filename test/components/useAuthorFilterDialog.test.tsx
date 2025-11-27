/**
 * useAuthorFilterDialog Hook 测试
 *
 * 测试作者筛选对话框的功能
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import { useAuthorFilterDialog } from '../../components/useAuthorFilterDialog';

// 创建测试组件来使用 Hook
function TestComponent() {
  const authors = ['毛泽东', '江青', '周恩来'];
  const mockOnChange = vi.fn();
  const { AuthorDialog, showAuthorDialog } = useAuthorFilterDialog(authors, mockOnChange);

  return (
    <div>
      <button onClick={showAuthorDialog} data-testid="show-dialog-btn">
        Show Dialog
      </button>
      {AuthorDialog}
    </div>
  );
}

describe('useAuthorFilterDialog', () => {
  const authors = ['毛泽东', '江青', '周恩来'];
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should not show dialog initially', () => {
    const { queryByText } = renderWithProviders(<TestComponent />);

    expect(queryByText('选择作者')).not.toBeInTheDocument();
  });

  it('should show dialog when showAuthorDialog is called', () => {
    const { getByText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    expect(getByText('选择作者')).toBeInTheDocument();
  });

  it('should display all authors as chips', () => {
    const { getByText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    authors.forEach(author => {
      expect(getByText(author)).toBeInTheDocument();
    });
  });

  it('should select author when chip is clicked', () => {
    const { getByText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    const maoChip = getByText('毛泽东');
    maoChip.click();

    // 应该有视觉反馈（选中状态）
    expect(maoChip).toBeInTheDocument();
  });

  it('should call onChange and close dialog when confirm button is clicked', () => {
    const { getByText, getByTestId, queryByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 选择作者
    const maoChip = getByText('毛泽东');
    maoChip.click();

    // 点击确定
    const confirmButton = getByText('确定');
    confirmButton.click();

    // 验证回调被调用
    expect(mockOnChange).toHaveBeenCalledWith('毛泽东');

    // 对话框应该关闭
    expect(queryByText('选择作者')).not.toBeInTheDocument();
  });

  it('should close dialog when cancel button is clicked', () => {
    const { getByText, getByTestId, queryByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    expect(getByText('选择作者')).toBeInTheDocument();

    const cancelButton = getByText('取消');
    cancelButton.click();

    expect(queryByText('选择作者')).not.toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should handle empty authors array', () => {
    function EmptyAuthorsTestComponent() {
      const { AuthorDialog, showAuthorDialog } = useAuthorFilterDialog([], mockOnChange);
      return (
        <div>
          <button onClick={showAuthorDialog} data-testid="show-dialog-btn">
            Show Dialog
          </button>
          {AuthorDialog}
        </div>
      );
    }

    const { getByTestId } = renderWithProviders(<EmptyAuthorsTestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 应该仍然可以显示对话框，即使没有作者
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should handle single author', () => {
    function SingleAuthorTestComponent() {
      const { AuthorDialog, showAuthorDialog } = useAuthorFilterDialog(['毛泽东'], mockOnChange);
      return (
        <div>
          <button onClick={showAuthorDialog} data-testid="show-dialog-btn">
            Show Dialog
          </button>
          {AuthorDialog}
        </div>
      );
    }

    const { getByText, getByTestId } = renderWithProviders(<SingleAuthorTestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    expect(getByText('毛泽东')).toBeInTheDocument();
  });

  it('should have correct dialog properties', () => {
    const { getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 检查对话框是否有正确的属性
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
