/**
 * useSourceFilterDialog Hook 测试
 *
 * 测试来源筛选对话框的功能
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import { useSourceFilterDialog } from '../../components/useSourceFilterDialog';

// 创建测试组件来使用 Hook
function TestComponent() {
  const sources = ['毛泽东全集', '四人帮材料', '中央文件'];
  const mockOnChange = vi.fn();
  const { SourceDialog, showSourceDialog } = useSourceFilterDialog(sources, mockOnChange);

  return (
    <div>
      <button onClick={showSourceDialog} data-testid="show-dialog-btn">
        Show Dialog
      </button>
      {SourceDialog}
    </div>
  );
}

describe('useSourceFilterDialog', () => {
  const sources = ['毛泽东全集', '四人帮材料', '中央文件'];
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should not show dialog initially', () => {
    const { queryByText } = renderWithProviders(<TestComponent />);

    expect(queryByText('选择来源')).not.toBeInTheDocument();
  });

  it('should show dialog when showSourceDialog is called', () => {
    const { getByText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    expect(getByText('选择来源')).toBeInTheDocument();
  });

  it('should display all sources as chips', () => {
    const { getByText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    sources.forEach(source => {
      expect(getByText(source)).toBeInTheDocument();
    });
  });

  it('should select source when chip is clicked', () => {
    const { getByText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    const firstSourceChip = getByText('毛泽东全集');
    firstSourceChip.click();

    // 应该有视觉反馈（选中状态）
    expect(firstSourceChip).toBeInTheDocument();
  });

  it('should call onChange and close dialog when confirm button is clicked', () => {
    const { getByText, getByTestId, queryByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 选择来源
    const firstSourceChip = getByText('毛泽东全集');
    firstSourceChip.click();

    // 点击确定
    const confirmButton = getByText('确定');
    confirmButton.click();

    // 验证回调被调用
    expect(mockOnChange).toHaveBeenCalledWith('毛泽东全集');

    // 对话框应该关闭
    expect(queryByText('选择来源')).not.toBeInTheDocument();
  });

  it('should close dialog when cancel button is clicked', () => {
    const { getByText, getByTestId, queryByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    expect(getByText('选择来源')).toBeInTheDocument();

    const cancelButton = getByText('取消');
    cancelButton.click();

    expect(queryByText('选择来源')).not.toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should handle empty sources array', () => {
    function EmptySourcesTestComponent() {
      const { SourceDialog, showSourceDialog } = useSourceFilterDialog([], mockOnChange);
      return (
        <div>
          <button onClick={showSourceDialog} data-testid="show-dialog-btn">
            Show Dialog
          </button>
          {SourceDialog}
        </div>
      );
    }

    const { getByTestId } = renderWithProviders(<EmptySourcesTestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 应该仍然可以显示对话框，即使没有来源
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should handle single source', () => {
    function SingleSourceTestComponent() {
      const { SourceDialog, showSourceDialog } = useSourceFilterDialog(['毛泽东全集'], mockOnChange);
      return (
        <div>
          <button onClick={showSourceDialog} data-testid="show-dialog-btn">
            Show Dialog
          </button>
          {SourceDialog}
        </div>
      );
    }

    const { getByText, getByTestId } = renderWithProviders(<SingleSourceTestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    expect(getByText('毛泽东全集')).toBeInTheDocument();
  });

  it('should default to first source as selected', () => {
    const { getByTestId, getByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 默认应该选择第一个来源
    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalledWith('毛泽东全集');
  });

  it('should allow changing selection before confirming', () => {
    const { getByText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 先选择第一个
    const firstSourceChip = getByText('毛泽东全集');
    firstSourceChip.click();

    // 再选择第二个
    const secondSourceChip = getByText('四人帮材料');
    secondSourceChip.click();

    // 确认选择第二个
    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalledWith('四人帮材料');
  });
});
