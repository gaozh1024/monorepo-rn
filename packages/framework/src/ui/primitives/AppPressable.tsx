import * as React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { cn } from '@/utils';

/**
 * AppPressable 组件属性接口
 */
export interface AppPressableProps extends PressableProps {
  /** 自定义类名 */
  className?: string;
  /** 按下状态时的类名 */
  pressedClassName?: string;
}

/**
 * AppPressable - 可按压组件
 *
 * 基于 React Native 的 Pressable 组件封装，支持按下状态样式切换
 * 自动管理按下状态，支持自定义普通状态和按下状态的样式
 *
 * @example
 * ```tsx
 * // 基础使用
 * <AppPressable onPress={() => console.log('pressed')}>
 *   <Text>点击我</Text>
 * </AppPressable>
 *
 * // 带按下效果
 * <AppPressable
 *   className="p-4 bg-blue-500"
 *   pressedClassName="bg-blue-600"
 *   onPress={handlePress}
 * >
 *   <Text className="text-white">按钮</Text>
 * </AppPressable>
 *
 * // 带透明度变化
 * <AppPressable
 *   className="p-3 rounded-lg"
 *   pressedClassName="opacity-70"
 *   onPress={handlePress}
 * >
 *   <Icon name="arrow-forward" />
 * </AppPressable>
 * ```
 */
export function AppPressable({
  className,
  pressedClassName,
  children,
  ...props
}: AppPressableProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Pressable
      className={cn(className, isPressed && pressedClassName)}
      onPressIn={e => {
        setIsPressed(true);
        props.onPressIn?.(e);
      }}
      onPressOut={e => {
        setIsPressed(false);
        props.onPressOut?.(e);
      }}
      {...props}
    >
      {children}
    </Pressable>
  );
}
