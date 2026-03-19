import type { Theme } from '@/theme';

const grayPalette = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712',
} as const;

const staticPalettes: Record<string, Record<string, string>> = {
  gray: grayPalette,
  white: { 500: '#ffffff' },
  black: { 500: '#000000' },
};

function resolvePaletteColor(name: string, shade: string, theme: Theme) {
  const palette = theme.colors[name] ?? staticPalettes[name];
  if (!palette) return undefined;

  return palette[shade] ?? palette[500] ?? palette['500'];
}

export function resolveNamedColor(color: string | undefined, theme: Theme, isDark: boolean) {
  if (!color) return undefined;

  switch (color) {
    case 'text':
    case 'foreground':
    case 'default':
      return theme.colors.text?.[500] ?? (isDark ? '#ffffff' : '#1f2937');
    case 'muted':
    case 'text-muted':
    case 'secondary-text':
      return isDark ? '#9ca3af' : '#6b7280';
    case 'inverse':
    case 'on-primary':
      return '#ffffff';
    case 'background':
    case 'screen':
    case 'page':
      return theme.colors.background?.[500] ?? (isDark ? '#0a0a0a' : '#ffffff');
    case 'card':
    case 'surface':
      return theme.colors.card?.[500] ?? (isDark ? '#1f2937' : '#ffffff');
    case 'border':
      return theme.colors.border?.[500] ?? (isDark ? '#404040' : '#e5e5e5');
    case 'danger':
      return theme.colors.error?.[500] ?? '#ef4444';
    case 'success':
    case 'warning':
    case 'error':
    case 'info':
    case 'primary':
    case 'secondary':
      return theme.colors[color]?.[500];
    case 'transparent':
      return 'transparent';
  }

  if (color.startsWith('#') || color.startsWith('rgb(') || color.startsWith('rgba(')) {
    return color;
  }

  if (theme.colors[color]?.[500]) {
    return theme.colors[color][500];
  }

  if (color.includes('-')) {
    const [name, shade] = color.split('-');
    if (name === 'danger') {
      return theme.colors.error?.[shade] ?? theme.colors.error?.[500] ?? '#ef4444';
    }

    return resolvePaletteColor(name, shade, theme);
  }

  return undefined;
}

export function resolveSurfaceColor(
  surface: 'background' | 'card' | 'muted' | undefined,
  theme: Theme,
  isDark: boolean
) {
  switch (surface) {
    case 'background':
      return theme.colors.background?.[500] ?? (isDark ? '#0a0a0a' : '#ffffff');
    case 'card':
      return theme.colors.card?.[500] ?? (isDark ? '#1f2937' : '#ffffff');
    case 'muted':
      return isDark ? '#111827' : '#f3f4f6';
    default:
      return undefined;
  }
}

export function resolveTextTone(
  tone:
    | 'default'
    | 'muted'
    | 'inverse'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | undefined,
  theme: Theme,
  isDark: boolean
) {
  switch (tone) {
    case 'default':
      return theme.colors.text?.[500] ?? (isDark ? '#ffffff' : '#1f2937');
    case 'muted':
      return isDark ? '#9ca3af' : '#6b7280';
    case 'inverse':
      return '#ffffff';
    case 'primary':
    case 'secondary':
    case 'success':
    case 'warning':
    case 'error':
      return resolveNamedColor(tone, theme, isDark);
    default:
      return undefined;
  }
}
