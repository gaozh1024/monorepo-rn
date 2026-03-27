import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { GradientView } from '../../display/GradientView';
import { AppText } from '../../primitives';

describe('GradientView', () => {
  it('应该渲染渐变容器和子元素', () => {
    const { getByText, getByTestId } = render(
      <GradientView colors={['#111111', '#222222']} testID="gradient">
        <AppText>渐变内容</AppText>
      </GradientView>
    );

    expect(getByText('渐变内容')).toBeTruthy();
    expect(getByTestId('gradient').props.colors).toEqual(['#111111', '#222222']);
  });

  it('应该支持自定义起止点和样式', () => {
    const { getByTestId } = render(
      <GradientView
        colors={['#f38b32', '#fb923c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        p={4}
        rounded="xl"
        w={240}
        style={{ borderRadius: 16 }}
        testID="gradient"
      />
    );

    const node = getByTestId('gradient');
    const resolvedStyle = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(node.props.start).toEqual({ x: 0, y: 0 });
    expect(node.props.end).toEqual({ x: 0, y: 1 });
    expect(resolvedStyle.borderRadius).toBe(16);
  });
});
