import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Keyboard } from 'react-native';
import { AppButton } from '../../actions/AppButton';
import { AppPressable } from '../../primitives/AppPressable';
import { act, create } from 'react-test-renderer';

describe('AppButton', () => {
  it('应该显示文本', () => {
    const { getByText } = render(<AppButton>Click me</AppButton>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('应该响应onPress', () => {
    const onPress = vi.fn();
    const { getByText } = render(<AppButton onPress={onPress}>Click</AppButton>);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });

  it('应该在disabled时不响应', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <AppButton onPress={onPress} disabled>
        Click
      </AppButton>
    );
    fireEvent.press(getByText('Click'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('应该显示加载指示器', () => {
    const { queryByText } = render(<AppButton loading>Click</AppButton>);
    expect(queryByText('Click')).toBeNull();
  });

  it('outline变体应该有边框样式', () => {
    const { getByText } = render(<AppButton variant="outline">Outline</AppButton>);
    let button: any = getByText('Outline');
    while (button?.props && !('borderWidth' in (button.props.style || {}))) {
      button = button.parent;
    }

    expect(button.props.style).toMatchObject({
      borderWidth: 0.5,
      backgroundColor: 'transparent',
    });
  });

  it('应该支持 success 语义色', () => {
    const { getByText } = render(
      <AppButton color="success" variant="outline">
        Success
      </AppButton>
    );
    let button: any = getByText('Success');
    while (button?.props && !('borderWidth' in (button.props.style || {}))) {
      button = button.parent;
    }

    expect(button.props.style).toMatchObject({
      borderWidth: 0.5,
      borderColor: '#22c55e',
    });
  });

  it('默认点击前应该先收起键盘', () => {
    const callOrder: string[] = [];
    (Keyboard.dismiss as any).mockImplementation(() => callOrder.push('dismiss'));
    const onPress = vi.fn(() => callOrder.push('press'));

    const { getByText } = render(<AppButton onPress={onPress}>Submit</AppButton>);
    fireEvent.press(getByText('Submit'));

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(onPress).toHaveBeenCalled();
    expect(callOrder).toEqual(['dismiss', 'press']);
  });

  it('可以关闭点击前自动收起键盘', () => {
    const onPress = vi.fn();

    const { getByText } = render(
      <AppButton onPress={onPress} dismissKeyboardOnPress={false}>
        Submit
      </AppButton>
    );
    fireEvent.press(getByText('Submit'));

    expect(Keyboard.dismiss).not.toHaveBeenCalled();
    expect(onPress).toHaveBeenCalled();
  });

  it('应该支持按钮外层基础快捷参数', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AppButton w={180} h={44} rounded="full" mt={12}>
          Shortcut
        </AppButton>
      );
    });

    const button = renderer!.root.findByType(AppPressable);

    expect(button.props.w).toBe(180);
    expect(button.props.h).toBe(44);
    expect(button.props.mt).toBe(12);
    expect(button.props.rounded).toBe('full');
  });

  it('应该用内联快捷参数提供 Web 关键布局和尺寸', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<AppButton size="lg">Web Button</AppButton>);
    });

    const button = renderer!.root.findByType(AppPressable);

    expect(button.props.row).toBe(true);
    expect(button.props.items).toBe('center');
    expect(button.props.justify).toBe('center');
    expect(button.props.px).toBe(24);
    expect(button.props.py).toBe(16);
  });
});
