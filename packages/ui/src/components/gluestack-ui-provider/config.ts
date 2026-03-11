'use client';
import { vars } from 'nativewind';
import { generateColorPalette } from '@panther-expo/theme/palette';
import { lightColors, darkColors } from '@/configs';

/**
 * 将用户主题颜色映射到 Gluestack UI 的颜色变量
 * 使用颜色调色板生成函数，确保修改主题颜色后自动同步
 */
export const config = {
  light: vars({
    /* Primary - 使用用户的主色调橙色 */
    ...generateColorPalette(lightColors.primary),

    /* Secondary - 使用用户的次要色 */
    ...generateColorPalette(lightColors.secondary),

    /* Tertiary - 使用用户的第三色 */
    ...generateColorPalette(lightColors.tertiary),

    /* Error - 使用用户的错误色 */
    ...generateColorPalette(lightColors.error),

    /* Success - 使用用户的成功色 */
    ...generateColorPalette(lightColors.success),

    /* Warning - 使用用户的警告色 */
    ...generateColorPalette(lightColors.warning),

    /* Info - 使用用户的信息色 */
    ...generateColorPalette(lightColors.info),

    /* Typography - 使用用户的主要文本色 */
    ...generateColorPalette(lightColors.text),

    /* Outline - 使用用户的边框色 */
    ...generateColorPalette(lightColors.border),

    /* Background - 使用用户的背景色 */
    ...generateColorPalette(lightColors.background),

    /* Background Special */
    '--color-background-error': lightColors.errorBg.replace('rgba', '').replace(/[\(\)]/g, '').replace(/, /g, ' '),
    '--color-background-warning': lightColors.warningBg.replace('rgba', '').replace(/[\(\)]/g, '').replace(/, /g, ' '),
    '--color-background-success': lightColors.successBg.replace('rgba', '').replace(/[\(\)]/g, '').replace(/, /g, ' '),
    '--color-background-muted': generateColorPalette(lightColors.background)['50'],
    '--color-background-info': lightColors.infoBg.replace('rgba', '').replace(/[\(\)]/g, '').replace(/, /g, ' '),

    /* Focus Ring Indicator */
    '--color-indicator-primary': lightColors.primary.replace('#', '').match(/.{2}/g)?.join(' ') || '243 139 50',
    '--color-indicator-info': lightColors.info.replace('#', '').match(/.{2}/g)?.join(' ') || '24 144 255',
    '--color-indicator-error': lightColors.error.replace('#', '').match(/.{2}/g)?.join(' ') || '255 77 79',
  }),
  dark: vars({
    /* Primary - 使用用户的主色调橙色 */
    ...generateColorPalette(darkColors.primary),

    /* Secondary - 使用用户的次要色 */
    ...generateColorPalette(darkColors.secondary),

    /* Tertiary - 使用用户的第三色 */
    ...generateColorPalette(darkColors.tertiary),

    /* Error - 使用用户的错误色 */
    ...generateColorPalette(darkColors.error),

    /* Success - 使用用户的成功色 */
    ...generateColorPalette(darkColors.success),

    /* Warning - 使用用户的警告色 */
    ...generateColorPalette(darkColors.warning),

    /* Info - 使用用户的信息色 */
    ...generateColorPalette(darkColors.info),

    /* Typography - 使用用户的主要文本色 */
    ...generateColorPalette(darkColors.text),

    /* Outline - 使用用户的边框色 */
    ...generateColorPalette(darkColors.border),

    /* Background - 使用用户的背景色 */
    ...generateColorPalette(darkColors.background),

    /* Background Special */
    '--color-background-error': darkColors.errorBg.replace('rgba', '').replace(/[\(\)]/g, '').replace(/, /g, ' '),
    '--color-background-warning': darkColors.warningBg.replace('rgba', '').replace(/[\(\)]/g, '').replace(/, /g, ' '),
    '--color-background-success': darkColors.successBg.replace('rgba', '').replace(/[\(\)]/g, '').replace(/, /g, ' '),
    '--color-background-muted': generateColorPalette(darkColors.background)['50'],
    '--color-background-info': darkColors.infoBg.replace('rgba', '').replace(/[\(\)]/g, '').replace(/, /g, ' '),

    /* Focus Ring Indicator */
    '--color-indicator-primary': darkColors.primary.replace('#', '').match(/.{2}/g)?.join(' ') || '243 139 50',
    '--color-indicator-info': darkColors.info.replace('#', '').match(/.{2}/g)?.join(' ') || '24 144 255',
    '--color-indicator-error': darkColors.error.replace('#', '').match(/.{2}/g)?.join(' ') || '255 77 79',
  }),
};
