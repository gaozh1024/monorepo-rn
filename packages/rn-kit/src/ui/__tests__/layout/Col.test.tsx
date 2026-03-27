import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { Col } from '../../layout/Col';

function flattenStyle(style: any) {
  if (!style) return {};
  if (Array.isArray(style))
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  return style;
}

describe('Col', () => {
  it('应该渲染垂直布局', () => {
    const { getByTestId } = render(<Col testID="col" />);
    const col = getByTestId('col');
    expect(flattenStyle(col.props.style).flexDirection).toBe('column');
  });

  it('应该应用justify样式', () => {
    const { getByTestId } = render(<Col justify="center" testID="col" />);
    const col = getByTestId('col');
    expect(flattenStyle(col.props.style).justifyContent).toBe('center');
  });
});
