import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { AppInput, AppTextInput } from '../../form/AppInput';
import { renderWithTheme } from './test-utils';

describe('AppInput', () => {
  it('应该兼容导出 AppTextInput', () => {
    const { getByTestId } = renderWithTheme(<AppTextInput testID="text-input" value="" />);

    expect(getByTestId('text-input')).toBeTruthy();
  });

  it('应该渲染标签、错误信息和禁用态', () => {
    const { getByText, getByTestId } = renderWithTheme(
      <AppInput testID="input" label="用户名" error="请输入用户名" disabled />
    );

    expect(getByText('用户名')).toBeTruthy();
    expect(getByText('请输入用户名')).toBeTruthy();
    expect(getByTestId('input').props.editable).toBe(false);
  });

  it('应该透传输入、聚焦和失焦事件', () => {
    const onChangeText = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { getByTestId } = renderWithTheme(
      <AppInput
        testID="input"
        value=""
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );

    const input = getByTestId('input');

    fireEvent.changeText(input, 'panther');
    input.props.onFocus?.({ nativeEvent: {} });
    input.props.onBlur?.({ nativeEvent: {} });

    expect(onChangeText).toHaveBeenCalledWith('panther');
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
