import { AppView } from '@/ui/primitives';
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
 * 用于展示操作进度的可视化组件，支持多种尺寸和颜色
 * 自动计算百分比，确保进度值在 0-100% 范围内
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
 * <Progress value={100} color="error" />
 *
 * // 自定义最大值
 * <Progress value={3} max={5} color="primary" />
 *
 * // 自定义样式
 * <Progress
 *   value={progress}
 *   size="md"
 *   color="primary"
 *   className="mt-4"
 *   barClassName="rounded-none"
 * />
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
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <AppView
      className={cn('w-full rounded-full bg-gray-200', sizeMap[size], className)}
      testID={testID}
    >
      <AppView
        className={cn('rounded-full', sizeMap[size], colorMap[color], barClassName)}
        style={{ width: `${percentage}%` }}
      />
    </AppView>
  );
}
