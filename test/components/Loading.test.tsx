/**
 * Loading 组件测试
 *
 * 测试加载状态组件的显示
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../utils/render-helpers';
import Loading from '../../components/Loading';

describe('Loading', () => {
  it('should render Backdrop with open=true', () => {
    const { getByRole } = renderWithProviders(<Loading />);

    const backdrop = getByRole('presentation');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop).toHaveAttribute('open');
  });

  it('should render CircularProgress inside Backdrop', () => {
    const { getByRole } = renderWithProviders(<Loading />);

    const progress = getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('should have transparent background on Backdrop', () => {
    const { getByRole } = renderWithProviders(<Loading />);

    const backdrop = getByRole('presentation');
    expect(backdrop).toHaveStyle('background: transparent');
  });

  it('should have correct z-index for Backdrop', () => {
    const { getByRole } = renderWithProviders(<Loading />);

    const backdrop = getByRole('presentation');
    expect(backdrop).toHaveStyle('z-index: 3');
  });

  it('should render CircularProgress with default variant', () => {
    const { getByRole } = renderWithProviders(<Loading />);

    const progress = getByRole('progressbar');
    expect(progress).toHaveClass('MuiCircularProgress-root');
  });
});
