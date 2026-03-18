import { View, ViewProps } from 'react-native';
import { cn } from '@/utils';

/**
 * Card 组件属性接口
 */
export interface CardProps extends ViewProps {
  /** 自定义类名 */
  className?: string;
}

/**
 * Card - 卡片容器组件
 *
 * 提供统一样式的卡片容器，包含白色背景、圆角、阴影和边框
 * 适用于展示信息块、列表项等场景
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Card>
 *   <Text>卡片内容</Text>
 * </Card>
 *
 * // 带内边距的内容
 * <Card className="p-4">
 *   <Text className="text-lg font-bold">标题</Text>
 *   <Text className="mt-2 text-gray-600">描述文本</Text>
 * </Card>
 *
 * // 带点击效果
 * <Card className="m-4 p-4">
 *   <AppPressable onPress={handlePress}>
 *     <Text>可点击的卡片</Text>
 *   </AppPressable>
 * </Card>
 *
 * // 组合使用
 * <Card className="m-4 overflow-hidden">
 *   <AppImage source={coverImage} height={200} />
 *   <AppView className="p-4">
 *     <AppText size="lg" weight="bold">文章标题</AppText>
 *     <AppText className="mt-2 text-gray-600">摘要内容...</AppText>
 *   </AppView>
 * </Card>
 * ```
 */
export function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}
      {...props}
    >
      {children}
    </View>
  );
}
