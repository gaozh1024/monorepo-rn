import * as React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { cn } from '@gaozh/rn-utils';

export interface AppPressableProps extends PressableProps {
  className?: string;
  pressedClassName?: string;
}

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
