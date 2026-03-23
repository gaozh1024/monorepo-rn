import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, create } from 'react-test-renderer';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { KeyboardDismissView } from '@/ui/primitives';
import { AppText } from '@/ui/primitives';

describe('KeyboardDismissView', () => {
  it('启用时点击空白区域应该收起键盘', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <KeyboardDismissView>
          <AppText>内容</AppText>
        </KeyboardDismissView>
      );
    });

    const dismissWrapper = renderer!.root.findByType(TouchableWithoutFeedback);

    act(() => {
      dismissWrapper.props.onPress();
    });

    expect(Keyboard.dismiss).toHaveBeenCalled();
  });

  it('禁用时不应包裹点击收键盘逻辑', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <KeyboardDismissView enabled={false}>
          <AppText>内容</AppText>
        </KeyboardDismissView>
      );
    });

    expect(renderer!.root.findAllByType(TouchableWithoutFeedback)).toHaveLength(0);
  });
});
