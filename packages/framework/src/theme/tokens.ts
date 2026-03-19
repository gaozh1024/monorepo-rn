import { useMemo } from 'react';
import { useOptionalTheme } from './provider';
import type { Theme } from './types';

export interface ThemeColorTokens {
  primary: string;
  primarySurface: string;
  background: string;
  card: string;
  cardElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  divider: string;
  iconMuted: string;
}

export function getThemeColors(theme: Theme, isDark: boolean): ThemeColorTokens {
  return {
    primary: theme.colors.primary?.[500] || '#f38b32',
    primarySurface: isDark
      ? theme.colors.primary?.[900] || '#7c2d12'
      : theme.colors.primary?.[50] || '#fff7ed',
    background: theme.colors.background?.[500] || (isDark ? '#0a0a0a' : '#ffffff'),
    card: theme.colors.card?.[500] || (isDark ? '#1f2937' : '#ffffff'),
    cardElevated:
      (isDark ? theme.colors.card?.[800] || theme.colors.card?.[700] : theme.colors.card?.[500]) ||
      (isDark ? '#1f2937' : '#ffffff'),
    text: theme.colors.text?.[500] || (isDark ? '#ffffff' : '#1f2937'),
    textSecondary: isDark ? '#d1d5db' : '#374151',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    textInverse: '#ffffff',
    border: isDark
      ? theme.colors.border?.[600] || theme.colors.border?.[500] || '#4b5563'
      : theme.colors.border?.[500] || '#d1d5db',
    divider: isDark
      ? theme.colors.border?.[700] || theme.colors.border?.[500] || '#374151'
      : theme.colors.border?.[500] || '#e5e7eb',
    iconMuted: isDark ? '#9ca3af' : '#6b7280',
  };
}

export function useThemeColors(): ThemeColorTokens {
  const { theme, isDark } = useOptionalTheme();

  return useMemo(() => getThemeColors(theme, isDark), [theme, isDark]);
}
