import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Row } from '../../layout/Row';

function flattenStyle(style: any) {
  if (!style) return {};
  if (Array.isArray(style))
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  return style;
}

describe('Row', () => {
  it('应该渲染水平布局', () => {
    const { getByTestId } = render(<Row testID="row" />);
    const row = getByTestId('row');
    expect(flattenStyle(row.props.style).flexDirection).toBe('row');
  });

  it('应该应用justify样式', () => {
    const { getByTestId } = render(<Row justify="between" testID="row" />);
    const row = getByTestId('row');
    expect(flattenStyle(row.props.style).justifyContent).toBe('space-between');
  });

  it('应该应用items样式', () => {
    const { getByTestId } = render(<Row items="center" testID="row" />);
    const row = getByTestId('row');
    expect(flattenStyle(row.props.style).alignItems).toBe('center');
  });

  it('应该支持换行', () => {
    const { getByTestId } = render(<Row wrap testID="row" />);
    const row = getByTestId('row');
    expect(flattenStyle(row.props.style).flexWrap).toBe('wrap');
  });
});
