/**
 * 将十六进制颜色转换为 RGB 格式
 * @param hex - 十六进制颜色值，如 '#f38b32' 或 '#fff'
 * @returns RGB 格式字符串，如 '243 139 50'
 */
export function hexToRgb(hex: string): string {
  const hexValue = hex.replace('#', '');

  let r: string;
  let g: string;
  let b: string;

  if (hexValue.length === 3) {
    r = parseInt(hexValue[0] + hexValue[0], 16).toString();
    g = parseInt(hexValue[1] + hexValue[1], 16).toString();
    b = parseInt(hexValue[2] + hexValue[2], 16).toString();
  } else if (hexValue.length === 6) {
    r = parseInt(hexValue.substring(0, 2), 16).toString();
    g = parseInt(hexValue.substring(2, 4), 16).toString();
    b = parseInt(hexValue.substring(4, 6), 16).toString();
  } else {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return `${r} ${g} ${b}`;
}

/**
 * 将 RGBA 颜色转换为 RGB 格式
 * @param rgba - RGBA 颜色值，如 'rgba(243, 139, 50, 0.1)'
 * @returns RGB 格式字符串，如 '243 139 50'
 */
export function rgbaToRgb(rgba: string): string {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    throw new Error(`Invalid rgba color: ${rgba}`);
  }
  return `${match[1]} ${match[2]} ${match[3]}`;
}
