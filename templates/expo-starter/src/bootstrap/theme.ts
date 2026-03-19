import { createTheme } from '@gaozh1024/rn-kit';

/**
 * 亮色主题配置
 */
export const lightTheme = createTheme({
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f38b32',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    background: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      500: '#ffffff',
    },
    card: {
      500: '#ffffff',
      600: '#f5f5f5',
      800: '#e5e5e5',
    },
    text: {
      500: '#171717',
      600: '#525252',
      700: '#737373',
    },
    border: {
      500: '#e5e5e5',
      600: '#d4d4d4',
      700: '#a3a3a3',
    },
  },
});

/**
 * 暗色主题配置
 */
export const darkTheme = createTheme({
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f38b32',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    background: {
      50: '#171717',
      100: '#262626',
      200: '#404040',
      500: '#0a0a0a',
    },
    card: {
      500: '#1f2937',
      600: '#374151',
      800: '#4b5563',
    },
    text: {
      500: '#ffffff',
      600: '#d4d4d4',
      700: '#a3a3a3',
    },
    border: {
      500: '#404040',
      600: '#525252',
      700: '#737373',
    },
  },
});
