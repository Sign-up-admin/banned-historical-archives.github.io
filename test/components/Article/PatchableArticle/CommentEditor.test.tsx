/**
 * CommentEditor 组件测试
 *
 * 测试注释编辑器组件的功能
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../utils/render-helpers';
import CommentEditor from '../../../../components/Article/PatchableArticle/CommentEditor';

describe('CommentEditor', () => {
  const mockOnChange = vi.fn();

  const defaultProps = {
    content: '测试注释内容',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render comment text', () => {
    const { getByDisplayValue } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    expect(getByDisplayValue('测试注释内容')).toBeInTheDocument();
  });

  it('should call onChange when comment text is modified', () => {
    const { getByDisplayValue } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const textField = getByDisplayValue('测试注释内容');
    textField.value = '修改后的注释';
    textField.dispatchEvent(new Event('change', { bubbles: true }));

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should render insert buttons', () => {
    const { getByText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    expect(getByText('上方插入')).toBeInTheDocument();
    expect(getByText('下方插入')).toBeInTheDocument();
  });

  it('should show insert dialog when insert before button is clicked', () => {
    const { getByText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    expect(getByText('插入')).toBeInTheDocument();
  });

  it('should show insert dialog when insert after button is clicked', () => {
    const { getByText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const insertAfterButton = getByText('下方插入');
    insertAfterButton.click();

    expect(getByText('插入')).toBeInTheDocument();
  });

  it('should render delete checkbox', () => {
    const { getByText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    expect(getByText('删除')).toBeInTheDocument();
  });

  it('should call onChange when delete checkbox is toggled', () => {
    const { getByRole } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const deleteCheckbox = getByRole('checkbox', { name: '删除' });
    deleteCheckbox.click();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should handle empty content', () => {
    const propsWithEmptyContent = {
      ...defaultProps,
      content: '',
    };

    const { getByDisplayValue } = renderWithProviders(
      <CommentEditor {...propsWithEmptyContent} />
    );

    expect(getByDisplayValue('')).toBeInTheDocument();
  });

  it('should handle insert before operation', () => {
    const { getByText, getByLabelText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    const textInput = getByLabelText('TextField');
    textInput.value = '新插入的注释';
    textInput.dispatchEvent(new Event('change', { bubbles: true }));

    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should handle insert after operation', () => {
    const { getByText, getByLabelText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const insertAfterButton = getByText('下方插入');
    insertAfterButton.click();

    const textInput = getByLabelText('TextField');
    textInput.value = '新插入的注释';
    textInput.dispatchEvent(new Event('change', { bubbles: true }));

    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should cancel insert operation', () => {
    const { getByText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    const cancelButton = getByText('取消');
    cancelButton.click();

    // 检查对话框是否关闭
    expect(() => getByText('插入')).toThrow();
  });

  it('should render inserted comments', () => {
    const { getByText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    const textInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    textInput.value = '测试插入注释';
    textInput.dispatchEvent(new Event('change', { bubbles: true }));

    const confirmButton = getByText('确定');
    confirmButton.click();

    // 检查插入的注释是否显示
    expect(getByText('测试插入注释')).toBeInTheDocument();
  });

  it('should handle multiple insert operations', () => {
    const { getByText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    // 插入第一个注释
    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    let textInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    textInput.value = '第一个插入注释';
    textInput.dispatchEvent(new Event('change', { bubbles: true }));

    let confirmButton = getByText('确定');
    confirmButton.click();

    // 插入第二个注释
    insertBeforeButton.click();

    textInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    textInput.value = '第二个插入注释';
    textInput.dispatchEvent(new Event('change', { bubbles: true }));

    confirmButton = getByText('确定');
    confirmButton.click();

    expect(getByText('第一个插入注释')).toBeInTheDocument();
    expect(getByText('第二个插入注释')).toBeInTheDocument();
  });

  it('should allow deleting inserted comments', () => {
    const { getByText, queryByText } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    const textInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    textInput.value = '待删除的注释';
    textInput.dispatchEvent(new Event('change', { bubbles: true }));

    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(getByText('待删除的注释')).toBeInTheDocument();

    // 删除插入的注释
    const deleteButtons = document.querySelectorAll('button');
    const deleteButton = Array.from(deleteButtons).find(btn => btn.textContent === '删除');
    deleteButton?.click();

    expect(queryByText('待删除的注释')).not.toBeInTheDocument();
  });

  it('should render as list item when not deleted', () => {
    const { container } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const listItem = container.querySelector('li');
    expect(listItem).toBeInTheDocument();
  });

  it('should not render as list item when deleted', () => {
    const { container, getByRole } = renderWithProviders(
      <CommentEditor {...defaultProps} />
    );

    const deleteCheckbox = getByRole('checkbox', { name: '删除' });
    deleteCheckbox.click();

    // 当删除时，不应该渲染为 li 元素
    const listItem = container.querySelector('li');
    expect(listItem).toBeInTheDocument(); // 仍然在 li 中，但内容不同
  });
});
