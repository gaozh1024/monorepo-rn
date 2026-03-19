import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { Slider } from '../../form/Slider';
import { theme } from './test-utils';

describe('Slider', () => {
  it('应该根据点击位置更新值', () => {
    const onChange = vi.fn();
    const onChangeEnd = vi.fn();

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <Slider onChange={onChange} onChangeEnd={onChangeEnd} min={0} max={100} step={10} />
        </ThemeProvider>
      );
    });

    const track = renderer!.root.find(
      node => typeof node.type === 'string' && typeof node.props.onTouchEnd === 'function'
    );

    act(() => {
      track.props.onLayout({ nativeEvent: { layout: { width: 100 } } });
    });

    act(() => {
      track.props.onTouchEnd({ nativeEvent: { locationX: 46 } });
    });

    expect(onChange).toHaveBeenCalledWith(50);
    expect(onChangeEnd).toHaveBeenCalledWith(50);
  });

  it('应该在禁用时忽略点击', () => {
    const onChange = vi.fn();
    const onChangeEnd = vi.fn();

    let renderer: ReturnType<typeof create>;
    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <Slider disabled onChange={onChange} onChangeEnd={onChangeEnd} />
        </ThemeProvider>
      );
    });

    const track = renderer!.root.find(
      node => typeof node.type === 'string' && typeof node.props.onTouchEnd === 'function'
    );

    act(() => {
      track.props.onLayout({ nativeEvent: { layout: { width: 100 } } });
    });

    act(() => {
      track.props.onTouchEnd({ nativeEvent: { locationX: 80 } });
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(onChangeEnd).not.toHaveBeenCalled();
  });
});
