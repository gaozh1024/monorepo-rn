import { AppView } from '@/ui/primitives';
import { useTheme } from '@/theme';
import { cn } from '@/utils';

/**
 * Progress 组件属性接口
 */
export interface ProgressProps {
  /** 当前进度值 */
  value: number;
  /** 最大值，默认为 100 */
  max?: number;
  /** 进度条高度：xs(4px)、sm(6px)、md(8px)、lg(12px)、xl(16px) */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 进度条颜色 */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  /** 测试 ID */
  testID?: string;
  /** 自定义容器样式 */
  className?: string;
  /** 自定义进度条样式 */
  barClassName?: string;
}

/** 尺寸映射表 */
const sizeMap = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3', xl: 'h-4' };

/** 颜色映射表 */
const colorMap = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

/**
 * Progress - 进度条组件
 *
 * 用于展示操作进度的可视化组件，支持浅色/深色主题
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Progress value={50} />
 *
 * // 不同尺寸
 * <Progress value={30} size="sm" />
 * <Progress value={60} size="lg" />
 *
 * // 不同颜色
 * <Progress value={75} color="success" />
 * <Progress value={90} color="warning" />
 * ```
 */
export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  testID,
  className,
  barClassName,
}: ProgressProps) {
  const { theme, isDark } = useTheme();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // 深色主题下使用更深的背景色
  const trackBgColor = isDark ? theme.colors.border?.[700] || '#374151' : '#e5e7eb';

  return (
    <AppView
      className={cn('w-full rounded-full', sizeMap[size], className)}
      style={{ backgroundColor: trackBgColor }}
      testID={testID}
    >
      <AppView
        className={cn('rounded-full', sizeMap[size], colorMap[color], barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </AppView>
  );
}
