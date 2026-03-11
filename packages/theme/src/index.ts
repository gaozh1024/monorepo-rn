/**
 * @panther-expo/theme - Expo 主题系统包
 *
 * 提供 Expo 应用的主题管理能力：
 * - ThemeProvider：主题上下文和切换逻辑
 * - Spacing：统一的间距系统
 * - Typography：排版系统规范
 * - Colors：Gluestack UI 标准颜色配置
 * - Palette：颜色调色板生成工具
 *
 * @example
 * ```typescript
 * import { ThemeProvider, useTheme } from '@panther-expo/theme';
 *
 * // 在应用根组件中使用
 * <ThemeProvider lightColors={light} darkColors={dark}>
 *   <App />
 * </ThemeProvider>
 *
 * // 在组件中获取主题
 * const { colors, isDark } = useTheme();
 * ```
 */

export * from './theme';
export * from './colors';
export * from './palette';
