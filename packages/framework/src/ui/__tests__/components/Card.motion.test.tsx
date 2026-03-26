import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { Card } from '../../display/Card';
import { AppPressable, AppText } from '../../primitives';

describe('Card motion props', () => {
  it('应该透传按压动画配置给可点击卡片', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <Card onPress={vi.fn()} motionPreset="strong" motionDuration={220} motionReduceMotion>
          <AppText>内容</AppText>
        </Card>
      );
    });

    const pressable = renderer!.root.findByType(AppPressable);

    expect(pressable.props).toMatchObject({
      motionPreset: 'strong',
      motionDuration: 220,
      motionReduceMotion: true,
    });
  });
});
