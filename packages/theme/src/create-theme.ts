import { generateColorPalette, type ColorPalette } from '@gaozh1024/rn-utils';
import type { ColorToken } from './types';
import type { Theme, ThemeConfig } from './types';

const defaultSpacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

const defaultBorderRadius = {
  none: 0,
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

function resolveColor(token: ColorToken): ColorPalette {
  return typeof token === 'string' ? generateColorPalette(token) : token;
}

export function createTheme(config: ThemeConfig): Theme {
  const colors: Record<string, ColorPalette> = {};
  for (const [name, token] of Object.entries(config.colors)) {
    colors[name] = resolveColor(token);
  }
  return {
    colors,
    spacing: config.spacing ?? defaultSpacing,
    borderRadius: config.borderRadius ?? defaultBorderRadius,
  };
}
