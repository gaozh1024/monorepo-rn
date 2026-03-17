import { AppView, type AppViewProps } from '@/ui/primitives';
import { cn } from '@/utils';

export interface ColProps extends AppViewProps {
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  items?: 'start' | 'center' | 'end' | 'stretch';
}

export function Col({ justify = 'start', items = 'stretch', className, ...props }: ColProps) {
  const justifyMap: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };
  const itemsMap: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  return <AppView className={cn(justifyMap[justify], itemsMap[items], className)} {...props} />;
}
