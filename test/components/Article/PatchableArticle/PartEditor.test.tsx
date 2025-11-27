/**
 * PartEditor 组件测试
 *
 * 测试段落编辑器组件的功能
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../utils/render-helpers';
import { createMockContent, createMockComment } from '../../mocks/data-generators';
import Part from '../../../../components/Article/PatchableArticle/PartEditor';
import { ContentType } from '../../../../types';

describe('PartEditor', () => {
  const mockContent = createMockContent({
    text: '这是测试段落内容。',
    type: ContentType.paragraph,
    index: 0,
  });

  const mockComments = [
    createMockComment({ index: 0, text: '注释1', part_idx: 0, offset: 5 }),
    createMockComment({ index: 1, text: '注释2', part_idx: 0, offset: 10 }),
  ];

  const mockOnChange = vi.fn();

  const defaultProps = {
    idx: 0,
    content: mockContent,
    comments: mockComments,
    onChange: mockOnChange,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render content text', () => {
    const { getByDisplayValue } = renderWithProviders(
      <Part {...defaultProps} />
    );

    expect(getByDisplayValue('这是测试段落内容。[0][1]')).toBeInTheDocument();
  });

  it('should render content type selector', () => {
    const { getByDisplayValue } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const typeSelector = getByDisplayValue('paragraph');
    expect(typeSelector).toBeInTheDocument();
  });

  it('should call onChange when content text is modified', () => {
    const { getByDisplayValue } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const textField = getByDisplayValue('这是测试段落内容。[0][1]');
    textField.value = '修改后的内容。[0][1]';
    textField.dispatchEvent(new Event('change', { bubbles: true }));

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChange when content type is changed', () => {
    const { getByDisplayValue } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const typeSelector = getByDisplayValue('paragraph');
    typeSelector.value = 'title';
    typeSelector.dispatchEvent(new Event('change', { bubbles: true }));

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should render insert buttons', () => {
    const { getByText } = renderWithProviders(
      <Part {...defaultProps} />
    );

    expect(getByText('上方插入')).toBeInTheDocument();
    expect(getByText('下方插入')).toBeInTheDocument();
  });

  it('should show insert dialog when insert before button is clicked', () => {
    const { getByText } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    // 检查是否显示插入对话框
    expect(getByText('插入段落')).toBeInTheDocument();
  });

  it('should show insert dialog when insert after button is clicked', () => {
    const { getByText } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const insertAfterButton = getByText('下方插入');
    insertAfterButton.click();

    expect(getByText('插入段落')).toBeInTheDocument();
  });

  it('should render delete checkbox', () => {
    const { getByText } = renderWithProviders(
      <Part {...defaultProps} />
    );

    expect(getByText('删除')).toBeInTheDocument();
  });

  it('should call onChange when delete checkbox is toggled', () => {
    const { getByRole } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const deleteCheckbox = getByRole('checkbox', { name: '删除' });
    deleteCheckbox.click();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should handle empty text deletion', () => {
    const propsWithEmptyText = {
      ...defaultProps,
      content: createMockContent({ text: '', type: ContentType.paragraph, index: 0 }),
    };

    const { getByDisplayValue } = renderWithProviders(
      <Part {...propsWithEmptyText} />
    );

    const textField = getByDisplayValue('');
    textField.dispatchEvent(new Event('change', { bubbles: true }));

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should handle comments integration', () => {
    const { getByDisplayValue } = renderWithProviders(
      <Part {...defaultProps} />
    );

    // 检查注释标记是否正确插入
    const textField = getByDisplayValue('这是测试段落内容。[0][1]');
    expect(textField).toBeInTheDocument();
  });

  it('should handle empty comments array', () => {
    const propsWithNoComments = {
      ...defaultProps,
      comments: [],
    };

    const { getByDisplayValue } = renderWithProviders(
      <Part {...propsWithNoComments} />
    );

    expect(getByDisplayValue('这是测试段落内容。')).toBeInTheDocument();
  });

  it('should handle different content types', () => {
    const titleContent = createMockContent({
      text: '标题内容',
      type: ContentType.title,
      index: 0,
    });

    const propsWithTitle = {
      ...defaultProps,
      content: titleContent,
    };

    const { getByDisplayValue } = renderWithProviders(
      <Part {...propsWithTitle} />
    );

    expect(getByDisplayValue('标题内容')).toBeInTheDocument();
    expect(getByDisplayValue('title')).toBeInTheDocument();
  });

  it('should render unique key for content', () => {
    const { container } = renderWithProviders(
      <Part {...defaultProps} />
    );

    // 检查是否有唯一的 key
    const textFields = container.querySelectorAll('input[type="text"]');
    expect(textFields.length).toBeGreaterThan(0);
  });

  it('should handle insert before operation', () => {
    const { getByText, getByLabelText } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    const textInput = getByLabelText('TextField');
    textInput.value = '插入的内容';
    textInput.dispatchEvent(new Event('change', { bubbles: true }));

    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should handle insert after operation', () => {
    const { getByText, getByLabelText } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const insertAfterButton = getByText('下方插入');
    insertAfterButton.click();

    const textInput = getByLabelText('TextField');
    textInput.value = '插入的内容';
    textInput.dispatchEvent(new Event('change', { bubbles: true }));

    const confirmButton = getByText('确定');
    confirmButton.click();

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should cancel insert operation', () => {
    const { getByText } = renderWithProviders(
      <Part {...defaultProps} />
    );

    const insertBeforeButton = getByText('上方插入');
    insertBeforeButton.click();

    const cancelButton = getByText('取消');
    cancelButton.click();

    // 检查对话框是否关闭
    expect(() => getByText('插入段落')).toThrow();
  });
});
