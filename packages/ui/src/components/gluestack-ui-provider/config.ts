'use client';
import { vars } from 'nativewind';
import { generateColorPalette } from '@panther-expo/theme/palette';
import { lightColors, darkColors } from './configs';

/**
 * 将颜色调色板转换为 CSS 变量格式
 * @param name - 颜色名称，如 'primary', 'secondary'
 * @param palette - 颜色调色板对象 { 0: '...', 50: '...', ... }
 * @returns CSS 变量对象 { '--color-primary-0': '...', ... }
 */
const toCssVars = (name: string, palette: Record<string, string>) => {
  const vars: Record<string, string> = {};
  for (const [level, value] of Object.entries(palette)) {
    vars[`--color-${name}-${level}`] = value;
  }
  return vars;
};

/**
 * 将用户主题颜色映射到 Gluestack UI 的颜色变量
 * 使用颜色调色板生成函数，确保修改主题颜色后自动同步
 */
export const config = {
  light: vars({
    /* Primary - 使用用户的主色调橙色 */
    ...toCssVars('primary', generateColorPalette(lightColors.primary)),

    /* Secondary - 使用用户的次要色 */
    ...toCssVars('secondary', generateColorPalette(lightColors.secondary)),

    /* Tertiary - 使用用户的第三色 */
    ...toCssVars('tertiary', generateColorPalette(lightColors.tertiary)),

    /* Error - 使用用户的错误色 */
    ...toCssVars('error', generateColorPalette(lightColors.error)),

    /* Success - 使用用户的成功色 */
    ...toCssVars('success', generateColorPalette(lightColors.success)),

    /* Warning - 使用用户的警告色 */
    ...toCssVars('warning', generateColorPalette(lightColors.warning)),

    /* Info - 使用用户的信息色 */
    ...toCssVars('info', generateColorPalette(lightColors.info)),

    /* Typography - 使用用户的主要文本色 */
    ...toCssVars('typography', generateColorPalette(lightColors.text)),

    /* Outline - 使用用户的边框色 */
    ...toCssVars('outline', generateColorPalette(lightColors.border)),

    /* Background - 使用用户的背景色 */
    ...toCssVars('background', generateColorPalette(lightColors.background)),

    /* Background Special */
    '--color-background-error': lightColors.errorBg
      .replace('rgba', '')
      .replace(/[\(\)]/g, '')
      .replace(/, /g, ' '),
    '--color-background-warning': lightColors.warningBg
      .replace('rgba', '')
      .replace(/[\(\)]/g, '')
      .replace(/, /g, ' '),
    '--color-background-success': lightColors.successBg
      .replace('rgba', '')
      .replace(/[\(\)]/g, '')
      .replace(/, /g, ' '),
    '--color-background-muted': generateColorPalette(lightColors.background)['50'],
    '--color-background-info': lightColors.infoBg
      .replace('rgba', '')
      .replace(/[\(\)]/g, '')
      .replace(/, /g, ' '),

    /* Focus Ring Indicator */
    '--color-indicator-primary':
      lightColors.primary.replace('#', '').match(/.{2}/g)?.join(' ') || '243 139 50',
    '--color-indicator-info':
      lightColors.info.replace('#', '').match(/.{2}/g)?.join(' ') || '24 144 255',
    '--color-indicator-error':
      lightColors.error.replace('#', '').match(/.{2}/g)?.join(' ') || '255 77 79',
  }),
  dark: vars({
    /* Primary - 使用用户的主色调橙色 */
    ...toCssVars('primary', generateColorPalette(darkColors.primary)),

    /* Secondary - 使用用户的次要色 */
    ...toCssVars('secondary', generateColorPalette(darkColors.secondary)),

    /* Tertiary - 使用用户的第三色 */
    ...toCssVars('tertiary', generateColorPalette(darkColors.tertiary)),

    /* Error - 使用用户的错误色 */
    ...toCssVars('error', generateColorPalette(darkColors.error)),

    /* Success - 使用用户的成功色 */
    ...toCssVars('success', generateColorPalette(darkColors.success)),

    /* Warning - 使用用户的警告色 */
    ...toCssVars('warning', generateColorPalette(darkColors.warning)),

    /* Info - 使用用户的信息色 */
    ...toCssVars('info', generateColorPalette(darkColors.info)),

    /* Typography - 使用用户的主要文本色 */
    ...toCssVars('typography', generateColorPalette(darkColors.text)),

    /* Outline - 使用用户的边框色 */
    ...toCssVars('outline', generateColorPalette(darkColors.border)),

    /* Background - 使用用户的背景色 */
    ...toCssVars('background', generateColorPalette(darkColors.background)),

    /* Background Special */
    '--color-background-error': darkColors.errorBg
      .replace('rgba', '')
      .replace(/[\(\)]/g, '')
      .replace(/, /g, ' '),
    '--color-background-warning': darkColors.warningBg
      .replace('rgba', '')
      .replace(/[\(\)]/g, '')
      .replace(/, /g, ' '),
    '--color-background-success': darkColors.successBg
      .replace('rgba', '')
      .replace(/[\(\)]/g, '')
      .replace(/, /g, ' '),
    '--color-background-muted': generateColorPalette(darkColors.background)['50'],
    '--color-background-info': darkColors.infoBg
      .replace('rgba', '')
      .replace(/[\(\)]/g, '')
      .replace(/, /g, ' '),

    /* Focus Ring Indicator */
    '--color-indicator-primary':
      darkColors.primary.replace('#', '').match(/.{2}/g)?.join(' ') || '243 139 50',
    '--color-indicator-info':
      darkColors.info.replace('#', '').match(/.{2}/g)?.join(' ') || '24 144 255',
    '--color-indicator-error':
      darkColors.error.replace('#', '').match(/.{2}/g)?.join(' ') || '255 77 79',
  }),
};
