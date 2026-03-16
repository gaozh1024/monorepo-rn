import type { Theme } from '@react-navigation/native';
import type { Theme as PantherTheme } from '@gaozh/rn-theme';

export function createNavigationTheme(pantherTheme: PantherTheme, isDark: boolean): Theme {
  const { colors } = pantherTheme;

  return {
    dark: isDark,
    colors: {
      primary: colors.primary?.[500] || '#f38b32',
      background: colors.background?.[500] || (isDark ? '#000000' : '#ffffff'),
      card: colors.card?.[500] || (isDark ? '#1a1a1a' : '#ffffff'),
      text: colors.text?.[500] || (isDark ? '#ffffff' : '#000000'),
      border: colors.border?.[200] || '#e5e5e5',
      notification: colors.error?.[500] || '#ef4444',
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '900' },
    },
  };
}
