import type { ThemeConfig } from '@gaozh1024/rn-kit';

/**
 * 亮色主题配置 - 现代简约风格
 * 主色调：Indigo (靛蓝) - 更专业、现代
 */
export const lightTheme: ThemeConfig = {
  colors: {
    primary: '#6366f1', // Indigo-500
    background: '#fafafa', // 极浅灰背景，更柔和
    card: '#ffffff',
    text: '#0f172a', // Slate-900
    border: '#e2e8f0', // Slate-200
  },
};

/**
 * 暗色主题配置 - 深邃优雅
 */
export const darkTheme: ThemeConfig = {
  colors: {
    primary: '#818cf8', // Indigo-400 - 在深色模式下更柔和
    background: '#020617', // Slate-950 - 更深的背景
    card: '#0f172a', // Slate-900
    text: '#f8fafc', // Slate-50
    border: '#1e293b', // Slate-800
  },
};

/**
 * 扩展颜色配置
 */
export const appColors = {
  // 主色阶
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  // 辅助色
  success: {
    light: '#dcfce7',
    DEFAULT: '#22c55e',
    dark: '#166534',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#92400e',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#991b1b',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1e40af',
  },
  // 中性色
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // 渐变配置
  gradients: {
    primary: ['#6366f1', '#8b5cf6'] as const, // Indigo to Violet
    secondary: ['#3b82f6', '#06b6d4'] as const, // Blue to Cyan
    success: ['#22c55e', '#10b981'] as const,
    dark: ['#0f172a', '#1e293b'] as const,
    sunset: ['#f59e0b', '#ef4444'] as const,
  },
};
