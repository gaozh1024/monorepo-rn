import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react-native';
import { withSpring, withTiming } from 'react-native-reanimated';
import { ThemeProvider, createTheme } from '@/theme';
import { Progress } from '../../display/Progress';
import { Switch } from '../../form/Switch';

const theme = createTheme({
  colors: { primary: '#f38b32', card: '#ffffff', border: '#e5e7eb' },
});

describe('motion spring hooks', () => {
  beforeEach(() => {
    vi.mocked(withSpring).mockClear();
    vi.mocked(withTiming).mockClear();
  });

  it('Progress 在传入 motionSpringPreset 时应使用 withSpring', () => {
    render(
      <ThemeProvider light={theme}>
        <Progress value={72} motionSpringPreset="smooth" />
      </ThemeProvider>
    );

    expect(withSpring).toHaveBeenCalled();
    expect(withSpring).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        damping: 22,
        stiffness: 180,
        mass: 1,
      })
    );
  });

  it('Switch 在传入 motionSpringPreset 时应使用 withSpring', () => {
    render(
      <ThemeProvider light={theme}>
        <Switch checked motionSpringPreset="bouncy" />
      </ThemeProvider>
    );

    expect(withSpring).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        damping: 14,
        stiffness: 240,
        mass: 1,
      })
    );
  });
});
