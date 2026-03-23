import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react-native';
import { act, create } from 'react-test-renderer';
import { Skeleton, SkeletonAvatar, SkeletonText } from '@/ui';

function flattenStyle(style: any) {
  if (!style) return {};
  if (Array.isArray(style))
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  return style;
}

describe('Skeleton', () => {
  it('应该支持基础尺寸与圆角参数', () => {
    const { getByTestId } = render(<Skeleton testID="skeleton" w={120} h={24} rounded="md" />);

    const node = getByTestId('skeleton');
    const style = flattenStyle(node.props.style);

    expect(style.width).toBe(120);
    expect(style.height).toBe(24);
    expect(style.borderRadius).toBe(8);
  });

  it('SkeletonAvatar 应该生成圆形占位', () => {
    const { getByTestId } = render(<SkeletonAvatar testID="avatar" size={48} />);

    const node = getByTestId('avatar');
    const style = flattenStyle(node.props.style);

    expect(style.width).toBe(48);
    expect(style.height).toBe(48);
    expect(style.borderRadius).toBe(9999);
  });

  it('SkeletonText 应该按行数渲染文本骨架', () => {
    let renderer: ReturnType<typeof create>;

    act(() => {
      renderer = create(<SkeletonText lines={3} lineWidths={['100%', '80%', '60%']} />);
    });

    const widths = renderer!.root
      .findAll(node => !!node?.props?.style)
      .map(node => flattenStyle(node.props.style).width)
      .filter(Boolean);

    expect(widths).toContain('100%');
    expect(widths).toContain('80%');
    expect(widths).toContain('60%');
  });
});
