import { describe, expect, it } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { AppButton } from '../../actions/AppButton';
import { AppPressable } from '../../primitives/AppPressable';

describe('AppButton motion props', () => {
  it('应该透传按压动画配置给内部 AppPressable', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AppButton motionPreset="strong" motionDuration={240} motionReduceMotion>
          Submit
        </AppButton>
      );
    });

    const pressable = renderer!.root.findByType(AppPressable);

    expect(pressable.props).toMatchObject({
      motionPreset: 'strong',
      motionDuration: 240,
      motionReduceMotion: true,
    });
  });
});
