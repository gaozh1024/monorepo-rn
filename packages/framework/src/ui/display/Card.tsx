import { View, ViewProps } from 'react-native';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';

/**
 * Card 组件属性接口
 */
export interface CardProps extends ViewProps {
  /** 内边距 */
  p?: number;
  /** 水平内边距 */
  px?: number;
  /** 垂直内边距 */
  py?: number;
  /** 子元素间距 */
  gap?: number;
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
  p,
  px,
  py,
  gap,
  className,
  style,
  noShadow = false,
  noBorder = false,
  noRadius = false,
  ...props
}: CardProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cn(
        !noRadius && 'rounded-lg',
        !noShadow && 'shadow-sm',
        'overflow-hidden',
        p !== undefined && `p-${p}`,
        px !== undefined && `px-${px}`,
        py !== undefined && `py-${py}`,
        gap !== undefined && `gap-${gap}`,
        className
      )}
      style={[
        {
          backgroundColor: colors.card,
          ...(noBorder ? {} : { borderWidth: 0.5, borderColor: colors.divider }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
