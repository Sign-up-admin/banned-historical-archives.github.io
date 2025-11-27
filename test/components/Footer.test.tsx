/**
 * Footer 组件测试
 *
 * 测试页脚组件的渲染（当前返回 null）
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import Footer from '../../components/Footer';

describe('Footer', () => {
  it('should render null (empty footer)', () => {
    const { container } = renderWithProviders(<Footer />);

    expect(container.firstChild).toBeNull();
  });

  it('should have empty DOM element', () => {
    const { container } = renderWithProviders(<Footer />);

    expect(container).toBeEmptyDOMElement();
  });
});
