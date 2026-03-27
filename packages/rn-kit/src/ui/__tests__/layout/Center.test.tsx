import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Center } from '../../layout/Center';

function flattenStyle(style: any) {
  if (!style) return {};
  if (Array.isArray(style))
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  return style;
}

describe('Center', () => {
  it('应该渲染居中内容', () => {
    const { getByTestId } = render(<Center testID="center" />);
    const center = getByTestId('center');
    const style = flattenStyle(center.props.style);
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('center');
  });

  it('默认不应该占满剩余空间', () => {
    const { getByTestId } = render(<Center testID="center" />);
    const center = getByTestId('center');
    expect(flattenStyle(center.props.style).flex).toBeUndefined();
  });

  it('显式传入 flex 时应该占满剩余空间', () => {
    const { getByTestId } = render(<Center flex testID="center" />);
    const center = getByTestId('center');
    expect(flattenStyle(center.props.style).flex).toBe(1);
  });
});
