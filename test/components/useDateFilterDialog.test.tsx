/**
 * useDateFilterDialog Hook 测试
 *
 * 测试日期筛选对话框的功能
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import { useDateFilterDialog, DateFilter } from '../../components/useDateFilterDialog';
import { fireEvent, waitFor } from '@testing-library/react';

// 创建测试组件来使用 Hook
function TestComponent() {
  const defaultFilter: DateFilter = {};
  const mockOnChange = vi.fn();
  const { DateFilterDialog, showDateFilterDialog } = useDateFilterDialog(defaultFilter, mockOnChange);

  return (
    <div>
      <button onClick={showDateFilterDialog} data-testid="show-dialog-btn">
        Show Dialog
      </button>
      {DateFilterDialog}
    </div>
  );
}

describe('useDateFilterDialog', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should not show dialog initially', () => {
    const { queryByText } = renderWithProviders(<TestComponent />);

    expect(queryByText('时间过滤器')).not.toBeInTheDocument();
  });

  it('should show dialog when showDateFilterDialog is called', () => {
    const { getByText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    expect(getByText('时间过滤器')).toBeInTheDocument();
  });

  it('should display date input fields', () => {
    const { getByLabelText, getByTestId } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 检查开始日期字段
    expect(getByLabelText('年')).toBeInTheDocument();
    expect(getByLabelText('月')).toBeInTheDocument();
    expect(getByLabelText('日')).toBeInTheDocument();
  });

  it('should accept valid date inputs', () => {
    const { getByLabelText, getByTestId, getByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 输入有效的日期范围
    const yearStart = getByLabelText('年'); // 开始年
    const monthStart = getByLabelText('月'); // 开始月
    const dayStart = getByLabelText('日'); // 开始日

    fireEvent.change(yearStart, { target: { value: '1949' } });
    fireEvent.change(monthStart, { target: { value: '10' } });
    fireEvent.change(dayStart, { target: { value: '1' } });

    const yearEnd = getByLabelText('年'); // 结束年（第二个）
    const monthEnd = getByLabelText('月'); // 结束月（第二个）
    const dayEnd = getByLabelText('日'); // 结束日（第二个）

    // 获取所有年输入字段（开始和结束）
    const yearFields = document.querySelectorAll('input[placeholder="年"]');
    const monthFields = document.querySelectorAll('input[placeholder="月"]');
    const dayFields = document.querySelectorAll('input[placeholder="日"]');

    fireEvent.change(yearFields[1], { target: { value: '1976' } });
    fireEvent.change(monthFields[1], { target: { value: '9' } });
    fireEvent.change(dayFields[1], { target: { value: '9' } });

    // 点击确定
    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalledWith({
      year_a: 1949,
      month_a: 10,
      day_a: 1,
      year_b: 1976,
      month_b: 9,
      day_b: 9,
    });
  });

  it('should reject invalid date inputs', () => {
    const { getByTestId, getByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 输入无效的月份
    const monthFields = document.querySelectorAll('input[placeholder="月"]');
    fireEvent.change(monthFields[0], { target: { value: '13' } });

    const confirmButton = getByText('确定');
    confirmButton.click();

    // 不应该调用回调
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should close dialog when cancel button is clicked', () => {
    const { getByText, getByTestId, queryByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    expect(getByText('时间过滤器')).toBeInTheDocument();

    const cancelButton = getByText('取消');
    cancelButton.click();

    expect(queryByText('时间过滤器')).not.toBeInTheDocument();
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should handle partial date inputs', () => {
    const { getByTestId, getByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 只输入年份
    const yearFields = document.querySelectorAll('input[placeholder="年"]');
    fireEvent.change(yearFields[0], { target: { value: '1949' } });
    fireEvent.change(yearFields[1], { target: { value: '1976' } });

    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalledWith({
      year_a: 1949,
      year_b: 1976,
    });
  });

  it('should convert string inputs to numbers', () => {
    const { getByTestId, getByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    const yearFields = document.querySelectorAll('input[placeholder="年"]');
    fireEvent.change(yearFields[0], { target: { value: '1949' } });
    fireEvent.change(yearFields[1], { target: { value: '1976' } });

    const monthFields = document.querySelectorAll('input[placeholder="月"]');
    fireEvent.change(monthFields[0], { target: { value: '10' } });
    fireEvent.change(monthFields[1], { target: { value: '9' } });

    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalledWith({
      year_a: 1949,
      month_a: 10,
      year_b: 1976,
      month_b: 9,
    });
  });

  it('should reject invalid day inputs', () => {
    const { getByTestId, getByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    const dayFields = document.querySelectorAll('input[placeholder="日"]');
    fireEvent.change(dayFields[0], { target: { value: '32' } }); // 无效日期

    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should handle empty inputs', () => {
    const { getByTestId, getByText } = renderWithProviders(<TestComponent />);

    const showButton = getByTestId('show-dialog-btn');
    showButton.click();

    // 不输入任何值
    const confirmButton = getByText('确定');
    confirmButton.click();

    // 不应该调用回调
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
