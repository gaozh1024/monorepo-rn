export interface RgbObject {
  r: number;
  g: number;
  b: number;
}

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

export function hexToRgb(hex: string): RgbObject {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function rgbToHex(rgb: RgbObject): string {
  return '#' + [rgb.r, rgb.g, rgb.b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function adjustBrightness(rgb: RgbObject, factor: number): RgbObject {
  const adjust = (c: number) =>
    Math.max(0, Math.min(255, c + (factor > 0 ? (255 - c) * factor : c * factor)));
  return { r: adjust(rgb.r), g: adjust(rgb.g), b: adjust(rgb.b) };
}

export function generateColorPalette(baseHex: string): ColorPalette {
  const rgb = hexToRgb(baseHex);
  const factors: Record<number, number> = {
    0: 0.95,
    50: 0.9,
    100: 0.75,
    200: 0.5,
    300: 0.3,
    400: 0.1,
    500: 0,
    600: -0.1,
    700: -0.25,
    800: -0.4,
    900: -0.55,
    950: -0.7,
  };
  const result = {} as ColorPalette;
  for (const [level, factor] of Object.entries(factors)) {
    result[parseInt(level) as keyof ColorPalette] = rgbToHex(adjustBrightness(rgb, factor));
  }
  return result;
}
