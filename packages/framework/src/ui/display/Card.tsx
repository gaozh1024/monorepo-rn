import { View, ViewProps } from 'react-native';
import { useTheme } from '@/theme';
import { cn } from '@/utils';

/**
 * Card 组件属性接口
 */
export interface CardProps extends ViewProps {
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
  className,
  style,
  noShadow = false,
  noBorder = false,
  noRadius = false,
  ...props
}: CardProps) {
  const { isDark } = useTheme();

  // 主题颜色
  const bgColor = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <View
      className={cn(
        !noRadius && 'rounded-lg',
        !noShadow && 'shadow-sm',
        'overflow-hidden',
        className
      )}
      style={[
        {
          backgroundColor: bgColor,
          ...(noBorder ? {} : { borderWidth: 0.5, borderColor }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
