/**
 * 导航 Hooks
 *
 * @module navigation/hooks
 * @description 提供导航相关的 React Hooks
 */

import { useEffect } from 'react';
import {
  useNavigation as useRNNavigation,
  useRoute as useRNRoute,
  useNavigationState as useRNNavigationState,
  useIsFocused,
  useFocusEffect,
  useScrollToTop,
} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import type { RouteProp, NavigationProp, NavigationState } from '@react-navigation/native';
import type {
  StackParamList,
  TabParamList,
  DrawerParamList,
  StackNavigation,
  TabNavigation,
  DrawerNavigation,
} from '../types';

// ============================================================================
// 基础导航 Hooks
// ============================================================================

/**
 * 获取堆栈导航实例
 *
 * @returns 堆栈导航对象，包含 navigate、goBack、push 等方法
 *
 * @example
 * ```tsx
 * function HomeScreen() {
 *   const navigation = useStackNavigation();
 *
 *   const goToDetail = () => {
 *     navigation.navigate('Detail', { id: '123' });
 *   };
 *
 *   return <Button onPress={goToDetail} title="查看详情" />;
 * }
 * ```
 */
export function useStackNavigation(): StackNavigation {
  return useRNNavigation<NativeStackNavigationProp<StackParamList>>();
}

/**
 * 获取标签导航实例
 *
 * @returns 标签导航对象
 *
 * @example
 * ```tsx
 * function ProfileScreen() {
 *   const navigation = useTabNavigation();
 *
 *   const switchToHome = () => {
 *     navigation.navigate('Home');
 *   };
 *
 *   return <Button onPress={switchToHome} title="返回首页" />;
 * }
 * ```
 */
export function useTabNavigation(): TabNavigation {
  return useRNNavigation<BottomTabNavigationProp<TabParamList>>();
}

/**
 * 获取抽屉导航实例
 *
 * @returns 抽屉导航对象
 *
 * @example
 * ```tsx
 * function SettingsScreen() {
 *   const navigation = useDrawerNavigation();
 *
 *   const openDrawer = () => {
 *     navigation.openDrawer();
 *   };
 *
 *   return <Button onPress={openDrawer} title="打开菜单" />;
 * }
 * ```
 */
export function useDrawerNavigation(): DrawerNavigation {
  return useRNNavigation<DrawerNavigationProp<DrawerParamList>>();
}

/**
 * 获取当前路由信息
 *
 * @returns 当前路由对象，包含 name、params、key 等
 *
 * @example
 * ```tsx
 * function DetailScreen() {
 *   const route = useRoute<'Detail'>();
 *   const { id } = route.params;
 *
 *   return <Text>详情 ID: {id}</Text>;
 * }
 * ```
 */
export function useRoute<T extends keyof StackParamList>(): RouteProp<StackParamList, T> {
  return useRNRoute<RouteProp<StackParamList, T>>();
}

// ============================================================================
// 导航状态 Hooks
// ============================================================================

/**
 * 获取导航状态
 *
 * @param selector - 状态选择器函数
 * @returns 选中的状态值
 *
 * @example
 * ```tsx
 * // 获取当前路由名称
 * const routeName = useNavigationState(state => state.routes[state.index].name);
 *
 * // 获取路由历史
 * const routes = useNavigationState(state => state.routes);
 * ```
 */
export function useNavigationState<T>(selector: (state: NavigationState) => T): T {
  return useRNNavigationState(selector);
}

/**
 * 监听屏幕聚焦状态
 *
 * @returns 屏幕是否处于聚焦状态
 *
 * @example
 * ```tsx
 * function ProfileScreen() {
 *   const isFocused = useIsFocused();
 *
 *   useEffect(() => {
 *     if (isFocused) {
 *       // 刷新数据
 *       refreshData();
 *     }
 *   }, [isFocused]);
 *
 *   return <ProfileView />;
 * }
 * ```
 */
export { useIsFocused };

/**
 * 屏幕聚焦时执行副作用
 *
 * 每次屏幕获得焦点时都会执行回调函数
 *
 * @param callback - 回调函数，可以返回清理函数
 *
 * @example
 * ```tsx
 * function HomeScreen() {
 *   useFocusEffect(
 *     useCallback(() => {
 *       // 获取最新数据
 *       fetchData();
 *
 *       // 可选：返回清理函数
 *       return () => {
 *         // 取消请求等清理操作
 *       };
 *     }, [])
 *   );
 *
 *   return <HomeView />;
 * }
 * ```
 */
export { useFocusEffect };

// ============================================================================
// 特殊功能 Hooks
// ============================================================================

/**
 * 处理安卓返回键
 *
 * 仅在安卓设备上有效，iOS 无效果
 *
 * @param handler - 返回 true 阻止默认返回行为，返回 false 允许默认行为
 *
 * @example
 * ```tsx
 * function ConfirmExitScreen() {
 *   const navigation = useStackNavigation();
 *
 *   useBackHandler(() => {
 *     // 显示确认对话框
 *     if (hasUnsavedChanges) {
 *       showConfirmDialog();
 *       return true; // 阻止默认返回
 *     }
 *     return false; // 允许默认返回
 *   });
 *
 *   return <ScreenContent />;
 * }
 * ```
 */
export function useBackHandler(handler: () => boolean): void {
  const navigation = useRNNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!handler()) {
        e.preventDefault();
      }
    });

    return unsubscribe;
  }, [navigation, handler]);
}

/**
 * 滚动到顶部
 *
 * 当用户点击标签栏已激活的 Tab 时，自动滚动到顶部
 *
 * @param ref - 可滚动组件的 ref（ScrollView、FlatList 等）
 *
 * @example
 * ```tsx
 * function HomeScreen() {
 *   const scrollViewRef = useRef<ScrollView>(null);
 *
 *   useScrollToTop(scrollViewRef);
 *
 *   return (
 *     <ScrollView ref={scrollViewRef}>
 *       <LongContent />
 *     </ScrollView>
 *   );
 * }
 * ```
 */
export { useScrollToTop };

// ============================================================================
// 类型导出
// ============================================================================

export type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
  BottomTabNavigationProp,
  BottomTabScreenProps,
  DrawerNavigationProp,
  DrawerScreenProps,
  RouteProp,
  NavigationProp,
};
