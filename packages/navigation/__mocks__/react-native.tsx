import * as React from 'react';

export const View = ({ children, testID, ...props }: any) =>
  React.createElement('div', { 'data-testid': testID, ...props }, children);

export const Text = ({ children, ...props }: any) => React.createElement('span', props, children);

export const Pressable = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: any) => {
  const handleClick = (e: any) => {
    if (!disabled && onPress) {
      onPress(e);
    }
  };
  return React.createElement(
    'button',
    {
      onClick: handleClick,
      onMouseDown: onPressIn,
      onMouseUp: onPressOut,
      disabled,
      ...props,
    },
    children
  );
};

export const ActivityIndicator = ({ size, color, testID, ...props }: any) =>
  React.createElement('div', {
    'data-testid': testID || 'activity-indicator',
    'data-size': size,
    'data-color': color,
    ...props,
  });

export const StyleSheet = {
  create: (styles: any) => styles,
};

export const Platform = {
  OS: 'ios',
  select: (obj: any) => obj.ios || obj.default,
};

export default {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Platform,
};
