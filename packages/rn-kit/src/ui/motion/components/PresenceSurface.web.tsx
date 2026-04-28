import { View, type ViewProps } from 'react-native';

type WebPresenceSurfaceProps = ViewProps & {
  entering?: unknown;
  exiting?: unknown;
  layout?: unknown;
};

export function PresenceSurface({
  entering: _entering,
  exiting: _exiting,
  layout: _layout,
  ...props
}: WebPresenceSurfaceProps) {
  return <View {...props} />;
}
