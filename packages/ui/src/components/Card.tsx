import { View, ViewProps } from 'react-native';
import { cn } from '@gaozh/rn-utils';

export interface CardProps extends ViewProps {
  className?: string;
}

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
