import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { act, create } from 'react-test-renderer';
import { ThemeProvider } from '@/theme';
import { AppView } from '../../primitives';
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

  it('应该在拖动时计算出正确值而不是 NaN', () => {
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

    const thumb = renderer!.root.find(
      node => typeof node.type === 'string' && typeof node.props.onPanResponderMove === 'function'
    );

    act(() => {
      thumb.props.onPanResponderGrant();
      thumb.props.onPanResponderMove({}, { dx: 46 });
      thumb.props.onPanResponderRelease({}, { dx: 46 });
    });

    expect(onChange).toHaveBeenCalledWith(50);
    expect(onChangeEnd).toHaveBeenCalledWith(50);
    expect(onChange).not.toHaveBeenCalledWith(Number.NaN);
    expect(onChangeEnd).not.toHaveBeenCalledWith(Number.NaN);
  });

  it('应该支持基础快捷参数', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <ThemeProvider light={theme}>
          <Slider w={240} mt={12} rounded="xl" bg="primary-500" />
        </ThemeProvider>
      );
    });

    const container = renderer!.root
      .findAllByType(AppView)
      .find(node => node.props.className?.includes?.('py-2'));
    const track = renderer!.root.find(
      node => typeof node.type === 'string' && typeof node.props.onTouchEnd === 'function'
    );

    expect(container?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ marginTop: 12 }),
        expect.objectContaining({ width: 240 }),
      ])
    );
    expect(track.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: 16 }),
        expect.objectContaining({ backgroundColor: '#f38b32' }),
      ])
    );
  });
});
