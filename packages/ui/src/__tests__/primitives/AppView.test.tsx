import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { AppView } from '../../primitives/AppView';

describe('AppView', () => {
  it('应该正确渲染', () => {
    const { getByTestId } = render(<AppView testID="view">Content</AppView>);
    expect(getByTestId('view')).toBeTruthy();
  });

  it('应该应用flex样式', () => {
    const { getByTestId } = render(<AppView flex testID="view" />);
    const view = getByTestId('view');
    expect(view.props.className).toContain('flex-1');
  });

  it('应该应用row样式', () => {
    const { getByTestId } = render(<AppView row testID="view" />);
    const view = getByTestId('view');
    expect(view.props.className).toContain('flex-row');
  });

  it('应该应用center样式', () => {
    const { getByTestId } = render(<AppView center testID="view" />);
    const view = getByTestId('view');
    expect(view.props.className).toContain('items-center');
    expect(view.props.className).toContain('justify-center');
  });

  it('应该应用间距样式', () => {
    const { getByTestId } = render(<AppView p={4} px={2} py={3} testID="view" />);
    const view = getByTestId('view');
    expect(view.props.className).toContain('p-4');
    expect(view.props.className).toContain('px-2');
    expect(view.props.className).toContain('py-3');
  });

  it('应该应用背景色样式', () => {
    const { getByTestId } = render(<AppView bg="primary-500" testID="view" />);
    const view = getByTestId('view');
    expect(view.props.className).toContain('bg-primary-500');
  });

  it('应该应用圆角样式', () => {
    const { getByTestId } = render(<AppView rounded="lg" testID="view" />);
    const view = getByTestId('view');
    expect(view.props.className).toContain('rounded-lg');
  });
});
