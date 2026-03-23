import { View, ViewProps } from 'react-native';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';
import {
  type CommonLayoutProps,
  type LayoutSurface,
  resolveLayoutStyle,
  resolveRoundedStyle,
  resolveSizingStyle,
  resolveSpacingStyle,
} from '../utils/layout-shortcuts';
import { useOptionalTheme } from '@/theme';
import { resolveNamedColor, resolveSurfaceColor } from '../utils/theme-color';

/**
 * Card 组件属性接口
 */
export interface CardProps extends ViewProps, CommonLayoutProps {
  /** 背景颜色 */
  bg?: string;
  /** 语义化背景 */
  surface?: LayoutSurface;
  /** Tailwind / NativeWind 类名 */
  className?: string;
  /** 是否禁用阴影 */
  noShadow?: boolean;
  /** 是否禁用边框 */
  noBorder?: boolean;
  /** 是否禁用圆角 */
  noRadius?: boolean;
}

/**
 * Card - 卡片容器组件，支持浅色/深色主题
 */
export function Card({
  children,
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
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  gap,
  rounded,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  bg,
  surface,
  className,
  style,
  noShadow = false,
  noBorder = false,
  noRadius = false,
  ...props
}: CardProps) {
  const colors = useThemeColors();
  const { theme, isDark } = useOptionalTheme();
  const resolvedBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);

  return (
    <View
      className={cn(!noShadow && 'shadow-sm', 'overflow-hidden', className)}
      style={[
        {
          backgroundColor: resolvedBgColor ?? colors.card,
          ...(noBorder ? {} : { borderWidth: 0.5, borderColor: colors.divider }),
        },
        resolveLayoutStyle({
          flex,
          row,
          wrap,
          center,
          between,
          items,
          justify,
          gap,
        }),
        resolveSpacingStyle({
          p,
          px,
          py,
          pt,
          pb,
          pl,
          pr,
          m,
          mx,
          my,
          mt,
          mb,
          ml,
          mr,
        }),
        resolveSizingStyle({
          w,
          h,
          minW,
          minH,
          maxW,
          maxH,
        }),
        noRadius ? undefined : resolveRoundedStyle(rounded ?? 'lg'),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
