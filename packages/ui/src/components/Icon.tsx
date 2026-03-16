import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@gaozh/rn-theme';
import { AppPressable } from '../primitives';

export type IconSize = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

const sizeMap: Record<string, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

function resolveSize(size: IconSize = 'md'): number {
  if (typeof size === 'number') return size;
  return sizeMap[size] || 24;
}

function resolveColor(color: string = 'gray-600', theme: any): string {
  if (color.includes('-')) {
    const [colorName, shade] = color.split('-');
    const colorPalette = theme.colors[colorName];
    if (colorPalette && shade in colorPalette) {
      return colorPalette[shade as keyof typeof colorPalette];
    }
  }
  return color;
}

export function Icon({ name, size = 'md', color = 'gray-600', style, onPress }: IconProps) {
  const { theme } = useTheme();
  const resolvedSize = resolveSize(size);
  const resolvedColor = resolveColor(color, theme);

  const icon = (
    <MaterialIcons name={name as any} size={resolvedSize} color={resolvedColor} style={style} />
  );

  if (onPress) {
    return <AppPressable onPress={onPress}>{icon}</AppPressable>;
  }

  return icon;
}

// 预设图标常量
export const NavigationIcons = {
  home: 'home',
  explore: 'explore',
  profile: 'person',
  settings: 'settings',
  back: 'arrow-back',
  forward: 'arrow-forward',
  close: 'close',
  menu: 'menu',
  more: 'more-vert',
} as const;

export const ActionIcons = {
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  search: 'search',
  share: 'share',
  favorite: 'favorite',
  favoriteBorder: 'favorite-border',
  check: 'check',
  checkCircle: 'check-circle',
  close: 'close',
  closeCircle: 'cancel',
  copy: 'content-copy',
  download: 'download',
  upload: 'upload',
} as const;

export const StatusIcons = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  error: 'error',
  help: 'help',
  loading: 'refresh',
} as const;

export const FileIcons = {
  file: 'insert-drive-file',
  image: 'image',
  video: 'videocam',
  audio: 'audiotrack',
  folder: 'folder',
  folderOpen: 'folder-open',
} as const;
