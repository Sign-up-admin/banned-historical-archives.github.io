/**
 * DiffViewer 组件测试
 *
 * 测试差异查看器显示功能
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import { DiffViewer } from '../../components/DiffViewer';
import { diff_match_patch } from 'diff-match-patch';

describe('DiffViewer', () => {
  it('should render nothing when diff is undefined', () => {
    const { container } = renderWithProviders(
      <DiffViewer />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when diff is null', () => {
    const { container } = renderWithProviders(
      <DiffViewer diff={null} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when diff is empty array', () => {
    const { container } = renderWithProviders(
      <DiffViewer diff={[]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render single diff with equal parts', () => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main('hello world', 'hello world');

    const { getByText } = renderWithProviders(
      <DiffViewer diff={[diff]} />
    );

    expect(getByText('hello world')).toBeInTheDocument();
  });

  it('should render single diff with insertions in green', () => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main('hello', 'hello world');

    const { getByText } = renderWithProviders(
      <DiffViewer diff={[diff]} />
    );

    const insertedText = getByText(' world');
    expect(insertedText).toBeInTheDocument();
    expect(insertedText).toHaveStyle('color: green');
  });

  it('should render single diff with deletions in red', () => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main('hello world', 'hello');

    const { getByText } = renderWithProviders(
      <DiffViewer diff={[diff]} />
    );

    const deletedText = getByText(' world');
    expect(deletedText).toBeInTheDocument();
    expect(deletedText).toHaveStyle('color: red');
  });

  it('should render multiple diffs', () => {
    const dmp = new diff_match_patch();
    const diff1 = dmp.diff_main('hello', 'hi');
    const diff2 = dmp.diff_main('world', 'universe');

    const { getByText } = renderWithProviders(
      <DiffViewer diff={[diff1, diff2]} />
    );

    // 检查第一个 diff
    expect(getByText('hi')).toBeInTheDocument();

    // 检查第二个 diff
    expect(getByText('universe')).toBeInTheDocument();
  });

  it('should render complex diff with mixed operations', () => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main('The quick brown fox', 'The fast brown dog');

    const { getByText } = renderWithProviders(
      <DiffViewer diff={[diff]} />
    );

    // 检查相等部分
    expect(getByText('The ')).toBeInTheDocument();
    expect(getByText(' brown ')).toBeInTheDocument();

    // 检查删除部分（红色）
    const deletedText = getByText('quick');
    expect(deletedText).toBeInTheDocument();
    expect(deletedText).toHaveStyle('color: red');

    // 检查插入部分（绿色）
    const insertedText = getByText('fast');
    expect(insertedText).toBeInTheDocument();
    expect(insertedText).toHaveStyle('color: green');
  });

  it('should handle empty diff parts', () => {
    const emptyDiff: any[] = [[]];

    const { container } = renderWithProviders(
      <DiffViewer diff={emptyDiff} />
    );

    // 应该渲染 Typography 组件但内容为空
    expect(container.firstChild).not.toBeNull();
  });

  it('should handle diff with only -1, 0, 1 operations', () => {
    const dmp = new diff_match_patch();
    const diff = dmp.diff_main('', 'added text');

    const { getByText } = renderWithProviders(
      <DiffViewer diff={[diff]} />
    );

    const addedText = getByText('added text');
    expect(addedText).toBeInTheDocument();
    expect(addedText).toHaveStyle('color: green');
  });
});
