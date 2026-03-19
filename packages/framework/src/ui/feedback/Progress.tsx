import { StyleSheet } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { useTheme } from '@/theme';
import { cn } from '@/utils';

/**
 * Progress 组件属性接口
 */
export interface ProgressProps {
  progress: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Progress - 进度条组件，支持浅色/深色主题
 */
export function Progress({
  progress,
  color,
  showLabel = false,
  size = 'md',
  className,
}: ProgressProps) {
  const { theme, isDark } = useTheme();

  // 主题颜色
  const trackColor = isDark ? '#374151' : '#e5e7eb';
  const defaultProgressColor = theme.colors.primary?.[500] || '#f38b32';
  const progressColor = color || defaultProgressColor;
  const labelColor = isDark ? '#9ca3af' : '#6b7280';

  // 尺寸配置
  const sizes = {
    sm: { height: 4, fontSize: 10 },
    md: { height: 8, fontSize: 12 },
    lg: { height: 12, fontSize: 14 },
  };

  const config = sizes[size];

  // 限制进度值在 0-100 之间
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <AppView row items="center" gap={3} className={cn(className)}>
      <AppView
        flex
        className="rounded-full overflow-hidden"
        style={[styles.track, { backgroundColor: trackColor }]}
      >
        <AppView
          className="rounded-full"
          style={[
            styles.progress,
            {
              height: config.height,
              backgroundColor: progressColor,
              width: `${normalizedProgress}%`,
            },
          ]}
        />
      </AppView>
      {showLabel && (
        <AppText
          size="sm"
          style={[
            styles.label,
            {
              fontSize: config.fontSize,
              color: labelColor,
            },
          ]}
        >
          {Math.round(normalizedProgress)}%
        </AppText>
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
  },
  progress: {
    height: 4,
  },
  label: {
    minWidth: 32,
    textAlign: 'right',
  },
});
