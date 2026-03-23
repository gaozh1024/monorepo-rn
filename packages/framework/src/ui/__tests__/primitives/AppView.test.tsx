import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { AppView } from '../../primitives/AppView';

function flattenStyle(style: any) {
  if (!style) return {};
  if (Array.isArray(style))
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  return style;
}

describe('AppView', () => {
  it('应该正确渲染', () => {
    const { getByTestId } = render(<AppView testID="view">Content</AppView>);
    expect(getByTestId('view')).toBeTruthy();
  });

  it('应该应用flex样式', () => {
    const { getByTestId } = render(<AppView flex testID="view" />);
    const view = getByTestId('view');
    expect(flattenStyle(view.props.style).flex).toBe(1);
  });

  it('应该应用row样式', () => {
    const { getByTestId } = render(<AppView row testID="view" />);
    const view = getByTestId('view');
    expect(flattenStyle(view.props.style).flexDirection).toBe('row');
  });

  it('应该支持换行样式', () => {
    const { getByTestId } = render(<AppView wrap testID="view" />);
    const view = getByTestId('view');
    expect(flattenStyle(view.props.style).flexWrap).toBe('wrap');
  });

  it('应该应用center样式', () => {
    const { getByTestId } = render(<AppView center testID="view" />);
    const view = getByTestId('view');
    expect(flattenStyle(view.props.style).alignItems).toBe('center');
    expect(flattenStyle(view.props.style).justifyContent).toBe('center');
  });

  it('应该应用间距样式', () => {
    const { getByTestId } = render(
      <AppView p={4} px={2} py={3} pt={5} mx={6} w={120} h={48} testID="view" />
    );
    const view = getByTestId('view');
    const style = flattenStyle(view.props.style);
    expect(style.paddingTop).toBe(5);
    expect(style.paddingBottom).toBe(3);
    expect(style.paddingLeft).toBe(2);
    expect(style.paddingRight).toBe(2);
    expect(style.marginLeft).toBe(6);
    expect(style.marginRight).toBe(6);
    expect(style.width).toBe(120);
    expect(style.height).toBe(48);
  });

  it('应该应用背景色样式', () => {
    const { getByTestId } = render(<AppView bg="primary-500" testID="view" />);
    const view = getByTestId('view');
    expect(view.props.style[0].backgroundColor).toBe('#f38b32');
  });

  it('应该应用圆角样式', () => {
    const { getByTestId } = render(<AppView rounded="lg" testID="view" />);
    const view = getByTestId('view');
    expect(flattenStyle(view.props.style).borderRadius).toBe(12);
  });

  it('应该支持语义化背景', () => {
    const { getByTestId } = render(<AppView surface="background" testID="view" />);
    const view = getByTestId('view');
    expect(view.props.style[0].backgroundColor).toBe('#ffffff');
  });
});
