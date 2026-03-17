import * as React from 'react';

export const View = ({ children, testID, style, ...props }: any) =>
  React.createElement('div', { 'data-testid': testID, style, ...props }, children);

export const Text = ({ children, ...props }: any) => React.createElement('span', props, children);

export const Pressable = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  testID,
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
      'data-testid': testID,
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

// FlatList mock
export const FlatList = ({
  data,
  renderItem,
  keyExtractor,
  ListEmptyComponent,
  ListFooterComponent,
  ...props
}: any) => {
  if (!data || data.length === 0) {
    // Handle both component and element
    if (ListEmptyComponent) {
      if (typeof ListEmptyComponent === 'function') {
        return React.createElement(ListEmptyComponent);
      }
      return ListEmptyComponent;
    }
    return null;
  }
  return React.createElement(
    'div',
    { 'data-testid': 'flatlist', ...props },
    data.map((item: any, index: number) => {
      const key = keyExtractor ? keyExtractor(item, index) : `item-${index}`;
      return React.createElement('div', { key }, renderItem({ item, index }));
    }),
    ListFooterComponent
  );
};

// RefreshControl mock
export const RefreshControl = ({ refreshing, ...props }: any) =>
  refreshing ? React.createElement('div', { 'data-testid': 'refresh-control', ...props }) : null;

export const StyleSheet = {
  create: (styles: any) => styles,
  flatten: (style: any) => style,
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
  FlatList,
  RefreshControl,
  StyleSheet,
  Platform,
};
