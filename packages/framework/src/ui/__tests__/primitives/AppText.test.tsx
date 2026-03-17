import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { AppText } from '../../primitives/AppText';

describe('AppText', () => {
  it('应该正确渲染文本', () => {
    const { getByText } = render(<AppText>Hello</AppText>);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('应该应用size样式', () => {
    const { getByText } = render(<AppText size="lg">Text</AppText>);
    const text = getByText('Text');
    expect(text.props.className).toContain('text-lg');
  });

  it('应该应用weight样式', () => {
    const { getByText } = render(<AppText weight="bold">Text</AppText>);
    const text = getByText('Text');
    expect(text.props.className).toContain('font-bold');
  });

  it('应该应用color样式', () => {
    const { getByText } = render(<AppText color="primary-500">Text</AppText>);
    const text = getByText('Text');
    expect(text.props.className).toContain('text-primary-500');
  });

  it('应该合并多个样式', () => {
    const { getByText } = render(
      <AppText size="xl" weight="semibold" color="red-500">
        Text
      </AppText>
    );
    const text = getByText('Text');
    expect(text.props.className).toContain('text-xl');
    expect(text.props.className).toContain('font-semibold');
    expect(text.props.className).toContain('text-red-500');
  });
});
