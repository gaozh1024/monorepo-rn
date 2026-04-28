import React from 'react';
import Animated from 'react-native-reanimated';

type PresenceSurfaceProps = React.ComponentProps<typeof Animated.View>;

export function PresenceSurface(props: PresenceSurfaceProps) {
  return <Animated.View {...props} />;
}
