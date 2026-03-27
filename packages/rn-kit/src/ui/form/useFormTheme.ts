import { useMemo } from 'react';
import { useOptionalTheme, useThemeColors } from '@/theme';

export interface FormThemeColors {
  primary: string;
  primarySurface: string;
  surface: string;
  surfaceMuted: string;
  headerSurface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  divider: string;
  icon: string;
  overlay: string;
}

export function useFormThemeColors(): FormThemeColors {
  const { isDark } = useOptionalTheme();
  const colors = useThemeColors();

  return useMemo(
    () => ({
      primary: colors.primary,
      primarySurface: colors.primarySurface,
      surface: colors.cardElevated,
      surfaceMuted: isDark ? colors.divider : '#f3f4f6',
      headerSurface: isDark ? '#111827' : '#f3f4f6',
      text: colors.text,
      textSecondary: colors.textSecondary,
      textMuted: colors.textMuted,
      textInverse: colors.textInverse,
      border: colors.border,
      divider: colors.divider,
      icon: colors.textMuted,
      overlay: 'rgba(0,0,0,0.5)',
    }),
    [colors, isDark]
  );
}
