/**
 * 颜色调色板生成工具
 *
 * 根据基础颜色自动生成 0-950 完整色阶，用于 Gluestack UI 主题配置
 *
 * @example
 * ```typescript
 * import { generateColorPalette } from '@panther-expo/theme/palette';
 *
 * const primaryColors = generateColorPalette('#f38b32');
 * // 返回: { 0: '255 247 237', 50: '254 231 205', ..., 500: '243 139 50', ..., 950: '99 46 10' }
 * ```
 */

/**
 * 颜色调色板接口
 */
export interface ColorPalette {
  0: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

/**
 * RGB 颜色对象
 */
interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * 将十六进制颜色转换为 RGB 对象
 * @param hex - 十六进制颜色值，如 '#f38b32' 或 '#fff'
 * @returns RGB 颜色对象
 */
function hexToRgbObject(hex: string): RgbColor {
  const hexValue = hex.replace('#', '');

  if (hexValue.length === 3) {
    return {
      r: parseInt(hexValue[0] + hexValue[0], 16),
      g: parseInt(hexValue[1] + hexValue[1], 16),
      b: parseInt(hexValue[2] + hexValue[2], 16),
    };
  } else if (hexValue.length === 6) {
    return {
      r: parseInt(hexValue.substring(0, 2), 16),
      g: parseInt(hexValue.substring(2, 4), 16),
      b: parseInt(hexValue.substring(4, 6), 16),
    };
  }
  throw new Error(`Invalid hex color: ${hex}`);
}

/**
 * 将 RGB 对象转换为 NativeWind 需要的 RGB 字符串格式
 * @param rgb - RGB 颜色对象
 * @returns RGB 字符串，如 '243 139 50'
 */
function rgbObjectToNativeString(rgb: RgbColor): string {
  return `${rgb.r} ${rgb.g} ${rgb.b}`;
}

/**
 * 将 RGBA 字符串转换为 RGB 对象
 * @param rgba - RGBA 颜色字符串，如 'rgba(243, 139, 50, 0.1)'
 * @returns RGB 颜色对象
 */
function rgbaToRgbObject(rgba: string): RgbColor {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    throw new Error(`Invalid rgba color: ${rgba}`);
  }
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

/**
 * 调整颜色亮度
 * @param rgb - RGB 颜色对象
 * @param factor - 调整因子，正值变亮，负值变暗，范围 -1 到 1
 * @returns 调整后的 RGB 颜色对象
 */
function adjustBrightness(rgb: RgbColor, factor: number): RgbColor {
  const adjust = (value: number) => {
    const adjusted = Math.round(value + (255 - value) * factor);
    return Math.max(0, Math.min(255, adjusted));
  };
  return {
    r: adjust(rgb.r),
    g: adjust(rgb.g),
    b: adjust(rgb.b),
  };
}

/**
 * 生成颜色调色板（0-950 色阶）
 *
 * 根据基础颜色生成完整的色阶，适用于 Gluestack UI 的主题配置。
 * 色阶分布：
 * - 0-400: 浅色系列（用于背景、hover 状态）
 * - 500: 基础色（主要使用）
 * - 600-950: 深色系列（用于 active 状态、文本）
 *
 * @param baseColor - 基础颜色（十六进制如 '#f38b32' 或 RGBA 如 'rgba(243, 139, 50, 0.1)'）
 * @returns 包含 0-950 色阶的对象，值为 RGB 字符串格式
 *
 * @example
 * ```typescript
 * const palette = generateColorPalette('#f38b32');
 * console.log(palette[500]); // '243 139 50'
 * console.log(palette[600]); // '219 125 45' (变暗)
 * ```
 */
export function generateColorPalette(baseColor: string): ColorPalette {
  const rgb = baseColor.startsWith('rgba')
    ? rgbaToRgbObject(baseColor)
    : hexToRgbObject(baseColor);

  return {
    0: rgbObjectToNativeString(adjustBrightness(rgb, 0.95)),
    50: rgbObjectToNativeString(adjustBrightness(rgb, 0.9)),
    100: rgbObjectToNativeString(adjustBrightness(rgb, 0.75)),
    200: rgbObjectToNativeString(adjustBrightness(rgb, 0.5)),
    300: rgbObjectToNativeString(adjustBrightness(rgb, 0.3)),
    400: rgbObjectToNativeString(adjustBrightness(rgb, 0.1)),
    500: rgbObjectToNativeString(rgb),
    600: rgbObjectToNativeString(adjustBrightness(rgb, -0.1)),
    700: rgbObjectToNativeString(adjustBrightness(rgb, -0.25)),
    800: rgbObjectToNativeString(adjustBrightness(rgb, -0.4)),
    900: rgbObjectToNativeString(adjustBrightness(rgb, -0.55)),
    950: rgbObjectToNativeString(adjustBrightness(rgb, -0.7)),
  };
}

/**
 * 批量生成多个颜色的调色板
 *
 * @param colors - 颜色配置对象，key 为颜色名，value 为十六进制颜色值
 * @returns 包含所有颜色调色板的对象
 *
 * @example
 * ```typescript
 * const palettes = generateColorPalettes({
 *   primary: '#f38b32',
 *   secondary: '#4A5568',
 *   success: '#52C41A',
 * });
 *
 * // palettes.primary[500] = '243 139 50'
 * // palettes.secondary[500] = '74 85 104'
 * ```
 */
export function generateColorPalettes(
  colors: Record<string, string>
): Record<string, ColorPalette> {
  const result: Record<string, ColorPalette> = {};

  for (const [name, color] of Object.entries(colors)) {
    result[name] = generateColorPalette(color);
  }

  return result;
}

/**
 * 生成 CSS 变量配置字符串
 *
 * 将颜色调色板转换为 CSS 变量格式，可直接写入 CSS 文件
 *
 * @param name - 颜色名称，如 'primary', 'success'
 * @param palette - 颜色调色板对象
 * @returns CSS 变量字符串
 *
 * @example
 * ```typescript
 * const palette = generateColorPalette('#f38b32');
 * const css = generateCssVariables('primary', palette);
 *
 * // 输出:
 * // --color-primary-0: 255 247 237;
 * // --color-primary-50: 254 231 205;
 * // ...
 * ```
 */
export function generateCssVariables(name: string, palette: ColorPalette): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(palette)) {
    lines.push(`  --color-${name}-${key}: ${value};`);
  }

  return lines.join('\n');
}

/**
 * 生成完整的 CSS 变量配置
 *
 * @param theme - 主题颜色配置
 * @returns 完整的 CSS 代码
 *
 * @example
 * ```typescript
 * const css = generateFullCssConfig({
 *   primary: '#f38b32',
 *   secondary: '#4A5568',
 *   success: '#52C41A',
 * });
 *
 * // 输出完整的 :root CSS 代码
 * ```
 */
export function generateFullCssConfig(theme: Record<string, string>): string {
  const lines: string[] = [':root {'];

  for (const [name, color] of Object.entries(theme)) {
    const palette = generateColorPalette(color);
    lines.push(generateCssVariables(name, palette));
    lines.push(''); // 空行分隔
  }

  lines.push('}');

  return lines.join('\n');
}
