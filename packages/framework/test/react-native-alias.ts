import React from 'react';

const createNativeComponent = (displayName: string) => {
  const Component = React.forwardRef<any, any>(({ children, onPress, testID, ...props }, ref) =>
    React.createElement(
      displayName,
      {
        ...props,
        ref,
        onClick: onPress,
        'data-testid': testID,
      },
      children
    )
  );
  Component.displayName = displayName;
  return Component;
};

export const View = createNativeComponent('View');
export const Text = createNativeComponent('Text');
export const Pressable = createNativeComponent('Pressable');
export const TouchableOpacity = createNativeComponent('TouchableOpacity');
export const ScrollView = createNativeComponent('ScrollView');
export const SafeAreaView = createNativeComponent('SafeAreaView');
export const ActivityIndicator = createNativeComponent('ActivityIndicator');
export const TextInput = createNativeComponent('TextInput');
export const Image = createNativeComponent('Image');
export const Modal = createNativeComponent('Modal');
export const RefreshControl = createNativeComponent('RefreshControl');

export const FlatList = ({
  data = [],
  renderItem,
  keyExtractor,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  testID,
  className,
  style,
}: any) => {
  const renderMaybeComponent = (value: any) => {
    if (!value) return null;
    if (React.isValidElement(value)) return value;
    if (typeof value === 'function') return React.createElement(value);
    return null;
  };

  const content =
    Array.isArray(data) && data.length > 0
      ? data.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item, index) : String(index);
          return React.createElement(
            React.Fragment,
            { key },
            renderItem ? renderItem({ item, index, separators: {} }) : null
          );
        })
      : renderMaybeComponent(ListEmptyComponent);

  return React.createElement(
    'FlatList',
    {
      className,
      style,
      'data-testid': testID,
    },
    renderMaybeComponent(ListHeaderComponent),
    content,
    renderMaybeComponent(ListFooterComponent)
  );
};

export const ListRenderItem = {};
export const StyleProp = {};
export const ViewStyle = {};
export const ImageSourcePropType = {};
export const ImageStyle = {};
export const PressableProps = {};
export const ViewProps = {};

export const StyleSheet = {
  create: (styles: any) => styles,
  flatten: (styles: any) => styles,
  compose: (a: any, b: any) => [a, b],
  hairlineWidth: 1,
  absoluteFillObject: {},
};

export const Platform = {
  OS: 'ios',
  Version: '17',
  select: (config: Record<string, any>) => config.ios ?? config.default,
};

export const Dimensions = {
  get: () => ({ width: 390, height: 844, scale: 3, fontScale: 2 }),
  addEventListener: () => ({ remove: () => {} }),
  removeEventListener: () => {},
};

export const I18nManager = {
  isRTL: false,
  allowRTL: () => {},
  forceRTL: () => {},
};

export const Appearance = {
  getColorScheme: () => 'light',
  addChangeListener: () => ({ remove: () => {} }),
};

export const PixelRatio = {
  get: () => 3,
  roundToNearestPixel: (value: number) => value,
};

export const NativeModules = {};
export const useColorScheme = () => 'light';
export const unstable_batchedUpdates = (fn: () => void) => fn();

const ReactNative = {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Image,
  Modal,
  FlatList,
  RefreshControl,
  StyleSheet,
  Platform,
  Dimensions,
  I18nManager,
  Appearance,
  PixelRatio,
  NativeModules,
  useColorScheme,
  unstable_batchedUpdates,
};

export default ReactNative;
