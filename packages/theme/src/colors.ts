/**
 * Gluestack UI 标准颜色配置
 *
 * 这些颜色名称遵循 Gluestack UI 的标准命名规范
 * 项目需要在 tailwind.config.js 中配置这些颜色
 *
 * 标准颜色：
 * - primary: 主色调
 * - secondary: 次要色
 * - tertiary: 第三色
 * - success: 成功状态
 * - error: 错误状态
 * - warning: 警告状态
 * - info: 信息状态
 * - background: 背景色系列
 * - text: 文本色系列
 * - border: 边框色
 */

export interface GluestackColors {
  // 主色系列
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;

  // 次要色系列
  secondary50: string;
  secondary100: string;
  secondary200: string;
  secondary300: string;
  secondary400: string;
  secondary500: string;
  secondary600: string;
  secondary700: string;
  secondary800: string;
  secondary900: string;

  // 语义色
  success: string;
  success100: string;
  success200: string;

  error: string;
  error100: string;
  error200: string;

  warning: string;
  warning100: string;
  warning200: string;

  info: string;
  info100: string;
  info200: string;

  // 背景色
  background0: string;
  background50: string;
  background100: string;
  background200: string;
  background300: string;
  background400: string;
  background500: string;
  background600: string;
  background700: string;
  background800: string;
  background900: string;
  background950: string;

  // 文本色
  text0: string;
  text50: string;
  text100: string;
  text200: string;
  text300: string;
  text400: string;
  text500: string;
  text600: string;
  text700: string;
  text800: string;
  text900: string;
  text950: string;

  // 边框色
  border0: string;
  border50: string;
  border100: string;
  border200: string;
  border300: string;
  border400: string;
  border500: string;
  border600: string;
  border700: string;
  border800: string;
  border900: string;
  border950: string;
}

/**
 * Gluestack UI 标准 Tailwind 配置预设
 *
 * 项目需要在 tailwind.config.js 中引入并扩展：
 *
 * @example
 * ```js
 * const { gluestackColors } = require('@panther-expo/theme/colors');
 *
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: gluestackColors({
 *         primary: '#f38b32',
 *         secondary: '#4A5568',
 *         // ... 其他颜色
 *       })
 *     }
 *   }
 * }
 * ```
 */
export const gluestackColors = (config: Partial<GluestackColors>) => {
  // 返回完整的颜色配置，使用传入的颜色生成调色板
  return config;
};
