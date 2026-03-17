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

export type ColorToken = string | ColorPalette;

export interface ThemeConfig {
  colors: Record<string, ColorToken>;
  spacing?: Record<string, number>;
  borderRadius?: Record<string, number>;
}

export interface Theme {
  colors: Record<string, ColorPalette>;
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
}
