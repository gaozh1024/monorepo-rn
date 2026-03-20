import React from 'react';
import { render } from '@testing-library/react-native';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Icon fallback', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('MaterialIcons 不可用时应渲染兜底字符且不崩溃', async () => {
    vi.doMock('@expo/vector-icons', () => ({
      MaterialIcons: undefined,
    }));

    const { Icon } = await import('../../display/Icon');
    const { getByText } = render(<Icon name="home" color="muted" />);

    expect(getByText('□')).toBeTruthy();
  });
});
