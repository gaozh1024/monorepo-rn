/**
 * 导航 Hooks
 *
 * @module navigation/hooks/useNavigation
 * @description 提供导航相关的 React Hooks
 */

import { useEffect } from 'react';
import { useNavigation as useRNNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '../vendor/stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
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
