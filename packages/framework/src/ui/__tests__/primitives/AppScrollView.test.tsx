import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { TouchableWithoutFeedback } from 'react-native';
import { AppScrollView } from '@/ui';

describe('AppScrollView', () => {
  it('应该正确渲染滚动内容', () => {
    const { getByTestId } = render(
      <AppScrollView testID="scroll" className="bg-gray-50">
        <div testID="child">content</div>
      </AppScrollView>
    );

    expect(getByTestId('scroll')).toBeTruthy();
    expect(getByTestId('child')).toBeTruthy();
  });

  it('应该应用布局类名', () => {
    const { getByTestId } = render(
      <AppScrollView testID="scroll" flex p={4} bg="gray-50">
        <div>content</div>
      </AppScrollView>
    );

    const node = getByTestId('scroll');
    expect(node.className).toContain('flex-1');
    expect(node.className).toContain('p-4');
    expect(node.props.style[0].backgroundColor).toBe('#f9fafb');
  });

  it('开启点击空白收起键盘时应设置 keyboardShouldPersistTaps 并包裹 dismiss 逻辑', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AppScrollView dismissKeyboardOnPressOutside>
          <div>content</div>
        </AppScrollView>
      );
    });

    const scrollView = renderer!.root.findByType('ScrollView');

    expect(scrollView.props.keyboardShouldPersistTaps).toBe('handled');
    expect(renderer!.root.findAllByType(TouchableWithoutFeedback)).toHaveLength(1);
  });

  it('应该支持语义化背景', () => {
    const { getByTestId } = render(
      <AppScrollView testID="scroll" surface="background">
        <div>content</div>
      </AppScrollView>
    );

    const node = getByTestId('scroll');
    expect(node.props.style[0].backgroundColor).toBe('#ffffff');
  });
});
