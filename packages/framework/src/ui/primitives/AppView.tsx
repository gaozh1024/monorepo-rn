import { View, ViewProps } from 'react-native';
import { useOptionalTheme } from '@/theme';
import { cn } from '@/utils';
import { resolveNamedColor, resolveSurfaceColor } from '../utils/theme-color';

/**
 * AppView 组件属性接口
 */
export interface AppViewProps extends ViewProps {
  /** 是否使用 flex 布局，设为 true 使用 flex-1，设为数字使用 flex-${number} */
  flex?: boolean | number;
  /** 是否使用水平排列（flex-direction: row） */
  row?: boolean;
  /** 是否允许换行 */
  wrap?: boolean;
  /** 是否居中显示（items-center justify-center） */
  center?: boolean;
  /** 是否两端对齐（justify-between） */
  between?: boolean;
  /** 交叉轴对齐方式（align-items） */
  items?: 'start' | 'center' | 'end' | 'stretch';
  /** 主轴对齐方式（justify-content） */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** 内边距 */
  p?: number;
  /** 水平内边距 */
  px?: number;
  /** 垂直内边距 */
  py?: number;
  /** 子元素间距 */
  gap?: number;
  /** 背景颜色 */
  bg?: string;
  /** 语义化背景 */
  surface?: 'background' | 'card' | 'muted';
  /** 圆角大小 */
  rounded?: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * AppView - 基础视图容器组件
 *
 * 基于 React Native 的 View 组件封装，提供便捷的 Flexbox 布局属性
 * 和 Tailwind CSS 类名支持，简化日常布局开发
 *
 * @example
 * ```tsx
 * // 基础使用
 * <AppView>
 *   <Text>内容</Text>
 * </AppView>
 *
 * // Flex 布局
 * <AppView flex row>
 *   <Text>左侧</Text>
 *   <Text>右侧</Text>
 * </AppView>
 *
 * // 居中对齐
 * <AppView center className="h-full">
 *   <Text>居中内容</Text>
 * </AppView>
 *
 * // 带间距和背景
 * <AppView p={4} gap={2} bg="gray-100" rounded="lg">
 *   <Text>带样式的容器</Text>
 * </AppView>
 * ```
 */
export function AppView({
  flex,
  row,
  wrap,
  center,
  between,
  items,
  justify,
  p,
  px,
  py,
  gap,
  bg,
  surface,
  rounded,
  className,
  children,
  style,
  ...props
}: AppViewProps) {
  const { theme, isDark } = useOptionalTheme();
  const resolvedBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);
  const shouldUseClassBg = !!bg && !resolvedBgColor;

  return (
    <View
      className={cn(
        flex === true && 'flex-1',
        typeof flex === 'number' && `flex-${flex}`,
        row ? 'flex-row' : 'flex-col',
        wrap && 'flex-wrap',
        center && 'items-center justify-center',
        between && 'justify-between',
        items && `items-${items}`,
        justify && `justify-${justify}`,
        p !== undefined && `p-${p}`,
        px !== undefined && `px-${px}`,
        py !== undefined && `py-${py}`,
        gap !== undefined && `gap-${gap}`,
        shouldUseClassBg && `bg-${bg}`,
        rounded && `rounded-${rounded}`,
        className
      )}
      style={[resolvedBgColor ? { backgroundColor: resolvedBgColor } : undefined, style]}
      {...props}
    >
      {children}
    </View>
  );
}
