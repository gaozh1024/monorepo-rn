import React from 'react';
import { vi, beforeEach } from 'vitest';

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

const createNavigator = () => ({
  Navigator: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  Screen: ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
});

global.fetch = vi.fn();

vi.mock('@testing-library/react-native', async () => {
  const ReactTestRenderer = await vi.importActual<any>('react-test-renderer');
  const { act, create } = ReactTestRenderer;
  const React = await vi.importActual<any>('react');

  const getTextContent = (node: any): string => {
    if (typeof node === 'string') return node;
    if (!node || !node.children) return '';
    return node.children.map((child: any) => getTextContent(child)).join('');
  };

  const findByTestId = (root: any, testId: string) => {
    const node = root.find(
      (item: any) =>
        typeof item?.type === 'string' &&
        (item?.props?.testID === testId || item?.props?.['data-testid'] === testId)
    );
    let current = node;
    while (current && current.props && current.props.className === undefined && current.parent) {
      current = current.parent;
    }
    return current ?? node;
  };

  const findByText = (root: any, text: string) =>
    (() => {
      const candidates = root.findAll((node: any) => {
        if (typeof node?.type !== 'string') return false;
        return getTextContent(node) === text;
      });
      if (!candidates.length) {
        throw new Error(`Unable to find text: ${text}`);
      }
      const interactive = candidates.find(
        (item: any) =>
          typeof item?.parent?.props?.onPress === 'function' ||
          item?.parent?.props?.disabled !== undefined
      );
      if (interactive) return interactive;
      const preferred = candidates.find((item: any) => item.type === 'Text');
      return preferred ?? candidates[candidates.length - 1];
    })();

  const decorateNode = (node: any) => {
    if (node && node.props) {
      (node as any).className = node.props.className;
    }
    return node;
  };

  const withInteractiveParent = (node: any) => {
    let current = node?.parent;
    let onPressParent: any = null;
    while (current) {
      if (
        typeof current?.props?.className === 'string' &&
        (current.props.className.includes('border-2') || current.props.className.includes('bg-'))
      ) {
        return {
          props: node.props,
          parent: current,
          children: node.children,
          type: node.type,
        };
      }
      if (!onPressParent && typeof current?.props?.onPress === 'function') {
        onPressParent = current;
      }
      current = current.parent;
    }
    if (onPressParent) {
      return {
        props: node.props,
        parent: onPressParent,
        children: node.children,
        type: node.type,
      };
    }
    return node;
  };

  const findPressHandler = (node: any): (() => void) | undefined => {
    let current = node;
    while (current) {
      if (current?.props?.disabled === true) return undefined;
      if (typeof current?.props?.onPress === 'function') return current.props.onPress;
      current = current.parent;
    }
    return undefined;
  };

  return {
    render: (ui: React.ReactElement) => {
      let renderer: any;
      act(() => {
        renderer = create(ui);
      });

      const getRoot = () => renderer.root;
      const getByTestId = (testId: string) => decorateNode(findByTestId(getRoot(), testId));
      const getAllByTestId = (testId: string) =>
        getRoot()
          .findAll(
            (item: any) =>
              typeof item?.type === 'string' &&
              (item?.props?.testID === testId || item?.props?.['data-testid'] === testId)
          )
          .map((item: any) => decorateNode(item));
      const queryByTestId = (testId: string) => {
        try {
          return decorateNode(findByTestId(getRoot(), testId));
        } catch {
          return null;
        }
      };
      const getByText = (text: string) =>
        decorateNode(withInteractiveParent(findByText(getRoot(), text)));
      const queryByText = (text: string) => {
        try {
          return decorateNode(withInteractiveParent(findByText(getRoot(), text)));
        } catch {
          return null;
        }
      };

      const flattenStyle = (style: any): Record<string, any> => {
        if (!style) return {};
        if (Array.isArray(style)) {
          return style.reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
        }
        if (typeof style === 'object') return style;
        return {};
      };

      const container = {
        querySelector: (selector: string) => {
          const nodes = getRoot().findAll((node: any) => typeof node?.type === 'string');
          if (selector.startsWith('.')) {
            const className = selector.slice(1);
            const found = nodes.find((node: any) =>
              (node.props?.className || '').includes(className)
            );
            return found ? decorateNode(found) : null;
          }
          const widthMatch = selector.match(/width:\s*([0-9.]+%)/);
          if (widthMatch) {
            const width = widthMatch[1];
            const found = nodes.find(
              (node: any) => flattenStyle(node.props?.style).width === width
            );
            return found ? decorateNode(found) : null;
          }
          return null;
        },
      };

      return {
        container,
        getByTestId,
        getAllByTestId,
        queryByTestId,
        getByText,
        queryByText,
        unmount: () => renderer.unmount(),
        rerender: (nextUi: React.ReactElement) => {
          act(() => {
            renderer.update(nextUi);
          });
        },
      };
    },
    renderHook: (hook: any, options?: any) => {
      let result: any = { current: null };
      const TestComponent = () => {
        result.current = hook();
        return null;
      };
      const wrapper = options?.wrapper;
      const WrappedComponent = wrapper
        ? () => React.createElement(wrapper, { children: React.createElement(TestComponent) })
        : TestComponent;
      let renderer: any;
      act(() => {
        renderer = create(React.createElement(WrappedComponent));
      });
      return {
        result,
        unmount: () => renderer?.unmount(),
        rerender: () => {
          act(() => {
            renderer.update(React.createElement(WrappedComponent));
          });
        },
      };
    },
    fireEvent: {
      press: (element: any) => {
        const onPress = findPressHandler(element);
        if (onPress) {
          act(() => {
            onPress();
          });
        }
      },
      changeText: (element: any, value: string) => {
        if (typeof element?.props?.onChangeText === 'function') {
          act(() => {
            element.props.onChangeText(value);
          });
          return;
        }
        if (typeof element?.props?.onChange === 'function') {
          act(() => {
            element.props.onChange({ nativeEvent: { text: value } });
          });
        }
      },
    },
  };
});

// Mock Animated
const AnimatedValue = vi.fn().mockImplementation((value: number) => ({
  setValue: vi.fn(),
  interpolate: vi.fn(() => ({ __getValue: () => value })),
  __getValue: () => value,
}));

const Animated = {
  Value: AnimatedValue,
  timing: vi.fn(() => ({ start: vi.fn((cb?: any) => cb && cb()) })),
  sequence: vi.fn((animations: any[]) => ({
    start: vi.fn((cb?: any) => {
      animations.forEach(anim => anim.start?.());
      if (cb) cb();
    }),
  })),
  delay: vi.fn(() => ({ start: vi.fn((cb?: any) => cb && cb()) })),
  View: createNativeComponent('Animated.View'),
  Text: createNativeComponent('Animated.Text'),
};

vi.mock('react-native', () => {
  const View = createNativeComponent('View');
  const Text = createNativeComponent('Text');
  const Pressable = createNativeComponent('Pressable');
  const TouchableOpacity = createNativeComponent('TouchableOpacity');
  const ScrollView = createNativeComponent('ScrollView');
  const SafeAreaView = createNativeComponent('SafeAreaView');
  const ActivityIndicator = createNativeComponent('ActivityIndicator');
  const TextInput = createNativeComponent('TextInput');
  const Image = createNativeComponent('Image');
  const Modal = createNativeComponent('Modal');
  const RefreshControl = createNativeComponent('RefreshControl');
  const FlatList = ({
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

  return {
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
    Animated,
    StyleSheet: {
      create: (styles: any) => styles,
      flatten: (styles: any) => styles,
      compose: (a: any, b: any) => [a, b],
      hairlineWidth: 1,
      absoluteFillObject: {},
    },
    Platform: {
      OS: 'ios',
      Version: '17',
      select: (config: Record<string, any>) => config.ios ?? config.default,
    },
    Dimensions: {
      get: () => ({ width: 390, height: 844, scale: 3, fontScale: 2 }),
      addEventListener: vi.fn(() => ({ remove: vi.fn() })),
      removeEventListener: vi.fn(),
    },
    I18nManager: {
      isRTL: false,
      allowRTL: vi.fn(),
      forceRTL: vi.fn(),
    },
    Appearance: {
      getColorScheme: () => 'light',
      addChangeListener: vi.fn(() => ({ remove: vi.fn() })),
    },
    useColorScheme: () => 'light',
    NativeModules: {},
    PixelRatio: {
      get: () => 3,
      roundToNearestPixel: (value: number) => value,
    },
  };
});

vi.mock('react-native-vector-icons/MaterialIcons', () => ({
  default: createNativeComponent('MaterialIcon'),
}));

vi.mock('expo-secure-store', () => ({
  setItemAsync: vi.fn(() => Promise.resolve()),
  getItemAsync: vi.fn(() => Promise.resolve(null)),
  deleteItemAsync: vi.fn(() => Promise.resolve()),
}));

vi.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useNavigation: () => ({
    navigate: vi.fn(),
    goBack: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

vi.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => createNavigator(),
}));

vi.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: () => createNavigator(),
}));

vi.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => createNavigator(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});
