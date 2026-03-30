import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { AppPressable, AppView, useThemeColors } from '@gaozh1024/rn-kit';

export interface ListItemProps {
  children: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
  className?: string;
  contentClassName?: string;
  pressedClassName?: string;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * 通用列表项
 * 统一处理：
 * - 行内布局
 * - 点击态
 * - 分隔线颜色
 */
export function ListItem({
  children,
  left,
  right,
  onPress,
  showDivider = false,
  className,
  contentClassName,
  pressedClassName = 'opacity-70',
  contentStyle,
}: ListItemProps) {
  const colors = useThemeColors();

  const content = (
    <AppView
      row
      items="center"
      className={['p-4', contentClassName].filter(Boolean).join(' ')}
      style={[
        {
          borderBottomWidth: showDivider ? 0.5 : 0,
          borderBottomColor: colors.divider,
        },
        contentStyle,
      ]}
    >
      {left ? <AppView className="mr-3">{left}</AppView> : null}
      <AppView className="flex-1">{children}</AppView>
      {right ? (
        <AppView row items="center">
          {right}
        </AppView>
      ) : null}
    </AppView>
  );

  if (onPress) {
    return (
      <AppPressable className={className} pressedClassName={pressedClassName} onPress={onPress}>
        {content}
      </AppPressable>
    );
  }

  return <AppView className={className}>{content}</AppView>;
}
