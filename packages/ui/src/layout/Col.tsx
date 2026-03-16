import { AppView, type AppViewProps } from '../primitives/AppView';
import { cn } from '@gaozh1024/rn-utils';

export interface ColProps extends AppViewProps {
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function Col({ justify = 'start', align = 'stretch', className, ...props }: ColProps) {
  const justifyMap: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };
  const alignMap: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  return <AppView className={cn(justifyMap[justify], alignMap[align], className)} {...props} />;
}
