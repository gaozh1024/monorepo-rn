import { View, ViewProps } from 'react-native';
import { cn } from '@/utils';

export interface AppViewProps extends ViewProps {
  flex?: boolean | number;
  row?: boolean;
  center?: boolean;
  between?: boolean;
  items?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  p?: number;
  px?: number;
  py?: number;
  gap?: number;
  bg?: string;
  rounded?: string;
  className?: string;
}

export function AppView({
  flex,
  row,
  center,
  between,
  items,
  justify,
  p,
  px,
  py,
  gap,
  bg,
  rounded,
  className,
  children,
  ...props
}: AppViewProps) {
  return (
    <View
      className={cn(
        flex === true && 'flex-1',
        typeof flex === 'number' && `flex-${flex}`,
        !flex && 'flex',
        row ? 'flex-row' : 'flex-col',
        center && 'items-center justify-center',
        between && 'justify-between',
        items && `items-${items}`,
        justify && `justify-${justify}`,
        p !== undefined && `p-${p}`,
        px !== undefined && `px-${px}`,
        py !== undefined && `py-${py}`,
        gap !== undefined && `gap-${gap}`,
        bg && `bg-${bg}`,
        rounded && `rounded-${rounded}`,
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
