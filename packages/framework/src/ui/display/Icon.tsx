import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useOptionalTheme } from '@/theme';
import { AppPressable } from '@/ui/primitives';
import { resolveNamedColor } from '../utils/theme-color';

/** 图标尺寸类型 */
export type IconSize = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Icon 组件属性接口
 */
export interface IconProps {
  /** 图标名称，参考 MaterialIcons 图标库 */
  name: string;
  /** 图标尺寸：预设值 xs(16px)、sm(20px)、md(24px)、lg(32px)、xl(48px) 或直接指定数字 */
  size?: IconSize;
  /** 图标颜色，支持 Tailwind 颜色格式（如 'primary-500'、'gray-600'）或十六进制值 */
  color?: string;
  /** 自定义样式 */
  style?: StyleProp<TextStyle>;
  /** 点击回调，设置了此属性后图标将变为可点击 */
  onPress?: () => void;
  /** 测试 ID */
  testID?: string;
}

/**
 * 预设尺寸映射表
 */
const sizeMap: Record<string, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

/**
 * 解析图标尺寸
 * @param size - 图标尺寸
 * @returns 解析后的数字尺寸
 */
function resolveSize(size: IconSize = 'md'): number {
  if (typeof size === 'number') return size;
  return sizeMap[size] || 24;
}

/**
 * 解析图标颜色
 * @param color - 颜色值
 * @param theme - 主题对象
 * @returns 解析后的颜色值
 */
/**
 * Icon - 图标组件
 *
 * 基于 MaterialIcons 的图标组件，支持主题颜色、多种尺寸和点击交互
 * 提供了常用的图标常量集合，方便开发使用
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Icon name="home" />
 *
 * // 指定尺寸
 * <Icon name="search" size="lg" />
 * <Icon name="settings" size={32} />
 *
 * // 指定颜色
 * <Icon name="check-circle" color="success-500" />
 * <Icon name="error" color="red-500" />
 *
 * // 可点击图标
 * <Icon name="close" onPress={() => setVisible(false)} />
 *
 * // 使用预设常量
 * <Icon name={NavigationIcons.home} />
 * <Icon name={ActionIcons.delete} color="danger-500" />
 * ```
 */
export function Icon({ name, size = 'md', color = 'gray-600', style, onPress, testID }: IconProps) {
  const { theme, isDark } = useOptionalTheme();
  const resolvedSize = resolveSize(size);
  const resolvedColor = resolveNamedColor(color, theme, isDark) ?? color;

  if (onPress) {
    return (
      <AppPressable onPress={onPress} testID={testID}>
        <MaterialIcons name={name as any} size={resolvedSize} color={resolvedColor} style={style} />
      </AppPressable>
    );
  }

  return (
    <MaterialIcons
      name={name as any}
      size={resolvedSize}
      color={resolvedColor}
      style={style}
      testID={testID}
    />
  );
}

/**
 * 导航图标常量
 */
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

/**
 * 操作图标常量
 */
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

/**
 * 状态图标常量
 */
export const StatusIcons = {
  info: 'info',
  success: 'check-circle',
  warning: 'warning',
  error: 'error',
  help: 'help',
  loading: 'refresh',
} as const;

/**
 * 文件图标常量
 */
export const FileIcons = {
  file: 'insert-drive-file',
  image: 'image',
  video: 'videocam',
  audio: 'audiotrack',
  folder: 'folder',
  folderOpen: 'folder-open',
} as const;
