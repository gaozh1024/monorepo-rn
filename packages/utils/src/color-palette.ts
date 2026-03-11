/**
 * 颜色调色板生成工具
 * 根据基础颜色生成 0-950 色阶
 */

/**
 * 将十六进制颜色转换为 RGB 对象
 */
function hexToRgbObject(hex: string): { r: number; g: number; b: number } {
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
 * 将 RGB 对象转换为 NativeWind 需要的格式
 */
function rgbObjectToNativeString(rgb: { r: number; g: number; b: number }): string {
  return `${rgb.r} ${rgb.g} ${rgb.b}`;
}

/**
 * 将 RGBA 字符串转换为 RGB 对象
 */
function rgbaToRgbObject(rgba: string): { r: number; g: number; b: number } {
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
 * @param factor - 调整因子，正值变亮，负值变暗，范围 -1 到 1
 */
function adjustBrightness(rgb: { r: number; g: number; b: number }, factor: number): { r: number; g: number; b: number } {
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
 * @param baseColor - 基础颜色（十六进制或 RGBA 字符串）
 * @returns 包含 0-950 色阶的对象
 */
export function generateColorPalette(baseColor: string): {
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
} {
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
