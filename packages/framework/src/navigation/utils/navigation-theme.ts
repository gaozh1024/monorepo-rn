import type { Theme } from '@react-navigation/native';
import { getThemeColors, type Theme as PantherTheme } from '@/theme';

export function createNavigationTheme(pantherTheme: PantherTheme, isDark: boolean): Theme {
  const { primary, background, card, text, divider } = getThemeColors(pantherTheme, isDark);

  return {
    dark: isDark,
    colors: {
      primary,
      background,
      card,
      text,
      border: divider,
      notification: pantherTheme.colors.error?.[500] || '#ef4444',
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '900' },
    },
  };
}
