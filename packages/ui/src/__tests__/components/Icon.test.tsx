import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Icon } from '../../components/Icon';

describe('Icon', () => {
  it('应该渲染图标', () => {
    const { getByTestId } = render(<Icon testID="icon" name="home" />);
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('应该支持点击', () => {
    const onPress = vi.fn();
    const { getByTestId } = render(<Icon testID="icon" name="home" onPress={onPress} />);

    fireEvent.press(getByTestId('icon'));
    expect(onPress).toHaveBeenCalled();
  });

  it('应该支持数字尺寸', () => {
    const { getByTestId } = render(<Icon testID="icon" name="home" size={32} />);
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('应该支持预设尺寸', () => {
    const { getByTestId } = render(<Icon testID="icon" name="home" size="lg" />);
    expect(getByTestId('icon')).toBeTruthy();
  });
});
