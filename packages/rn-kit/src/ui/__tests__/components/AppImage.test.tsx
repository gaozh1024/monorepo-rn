import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, create } from 'react-test-renderer';
import { AppImage } from '@/ui';
import { AppView } from '../../primitives/AppView';

describe('AppImage', () => {
  it('应该基于 expo-image 渲染并映射 resizeMode', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AppImage
          source={{ uri: 'https://example.com/avatar.png' }}
          resizeMode="stretch"
          placeholder={{ uri: 'https://example.com/placeholder.png' }}
        />
      );
    });

    const image = renderer!.root.findByType('ExpoImage');

    expect(image.props.contentFit).toBe('fill');
    expect(image.props.placeholderContentFit).toBe('fill');
    expect(image.props.cachePolicy).toBe('memory-disk');
    expect(image.props.transition).toBe(150);
  });

  it('应该响应加载成功和失败事件', () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AppImage
          source={{ uri: 'https://example.com/avatar.png' }}
          onLoad={onLoad}
          onError={onError}
        />
      );
    });

    const image = renderer!.root.findByType('ExpoImage');

    act(() => {
      image.props.onLoad?.();
      image.props.onError?.({ nativeEvent: { error: 'failed' } });
    });

    expect(onLoad).toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });

  it('应该支持基础快捷参数', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AppImage
          source={{ uri: 'https://example.com/avatar.png' }}
          placeholder={{ uri: 'https://example.com/placeholder.png' }}
          w={120}
          h={80}
          mt={12}
          rounded="xl"
          bg="primary-500"
        />
      );
    });

    const wrapper = renderer!.root.findByType(AppView);

    expect(wrapper.props.w).toBe(120);
    expect(wrapper.props.h).toBe(80);
    expect(wrapper.props.mt).toBe(12);
    expect(wrapper.props.rounded).toBe('xl');
    expect(wrapper.props.bg).toBe('primary-500');
  });

  it('应该从 style 中提取宽高作为 wrapper 的 fallback', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(
        <AppImage
          source={{ uri: 'https://example.com/photo.png' }}
          style={{ width: 300, height: 200 }}
        />
      );
    });

    const wrapper = renderer!.root.findByType(AppView);
    const wrapperStyle = wrapper.props.style;
    const flatStyle = Array.isArray(wrapperStyle)
      ? Object.assign({}, ...wrapperStyle)
      : wrapperStyle;

    expect(flatStyle.width).toBe(300);
    expect(flatStyle.height).toBe(200);
  });
});
