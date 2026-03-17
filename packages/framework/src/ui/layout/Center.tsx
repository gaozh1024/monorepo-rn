import { AppView, type AppViewProps } from '@/ui/primitives';

export interface CenterProps extends Omit<AppViewProps, 'center'> {
  flex?: boolean | number;
}

export function Center({ flex = true, ...props }: CenterProps) {
  return <AppView center flex={flex} {...props} />;
}
