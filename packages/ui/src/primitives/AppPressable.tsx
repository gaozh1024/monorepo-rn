import { Pressable, PressableProps } from 'react-native';
import { cn } from '@gaozh1024/rn-utils';

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
  return (
    <Pressable
      className={({ pressed }: { pressed: boolean }) => cn(className, pressed && pressedClassName)}
      {...props}
    >
      {children}
    </Pressable>
  );
}
