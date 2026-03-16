import { Text, TextProps } from 'react-native';
import { cn } from '@gaozh1024/rn-utils';

export interface AppTextProps extends TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  className?: string;
}

export function AppText({
  size = 'md',
  weight = 'normal',
  color,
  className,
  children,
  ...props
}: AppTextProps) {
  const sizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };
  const weightMap: Record<string, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  return (
    <Text
      className={cn(sizeMap[size], weightMap[weight], color && `text-${color}`, className)}
      {...props}
    >
      {children}
    </Text>
  );
}
