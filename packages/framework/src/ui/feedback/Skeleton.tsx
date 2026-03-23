import { type AppViewProps, AppView } from '@/ui/primitives';

export interface SkeletonProps extends Omit<AppViewProps, 'children'> {
  /** 是否启用轻量脉冲动画类名 */
  animated?: boolean;
}

/**
 * Skeleton - 通用骨架块
 */
export function Skeleton({
  animated = true,
  className,
  surface = 'muted',
  style,
  ...props
}: SkeletonProps) {
  return (
    <AppView
      surface={surface}
      className={[animated ? 'animate-pulse' : '', className].filter(Boolean).join(' ')}
      style={[{ overflow: 'hidden' }, style]}
      {...props}
    />
  );
}

export interface SkeletonBlockProps extends SkeletonProps {}

/**
 * SkeletonBlock - Skeleton 的语义化别名
 */
export function SkeletonBlock(props: SkeletonBlockProps) {
  return <Skeleton {...props} />;
}

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'w' | 'h'> {
  /** 头像尺寸 */
  size?: number;
}

/**
 * SkeletonAvatar - 头像骨架
 */
export function SkeletonAvatar({ size = 40, ...props }: SkeletonAvatarProps) {
  return <Skeleton w={size} h={size} rounded="full" {...props} />;
}

export interface SkeletonTextProps extends Omit<SkeletonProps, 'children' | 'h'> {
  /** 行数 */
  lines?: number;
  /** 单行高度 */
  lineHeight?: number;
  /** 行间距 */
  spacing?: number;
  /** 每行宽度，未指定时最后一行默认缩短 */
  lineWidths?: Array<NonNullable<AppViewProps['w']>>;
}

/**
 * SkeletonText - 多行文本骨架
 */
export function SkeletonText({
  lines = 3,
  lineHeight = 14,
  spacing = 8,
  lineWidths,
  ...props
}: SkeletonTextProps) {
  return (
    <AppView gap={spacing}>
      {Array.from({ length: lines }).map((_, index) => {
        const width = lineWidths?.[index] ?? (index === lines - 1 && lines > 1 ? '72%' : '100%');

        return (
          <Skeleton
            key={`skeleton-line-${index}`}
            h={lineHeight}
            w={width}
            rounded="sm"
            {...props}
          />
        );
      })}
    </AppView>
  );
}
