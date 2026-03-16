// Navigation 类型定义

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// 路由参数类型（用户需扩展）
export type RootStackParamList = {
  [key: string]: object | undefined;
};

export type RootTabParamList = {
  [key: string]: object | undefined;
};

// 导航 Props 类型
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type RootTabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  T
>;

// 导航器配置类型
export interface StackScreenOptions {
  title?: string;
  headerShown?: boolean;
  header?: (props: any) => React.ReactElement | null;
  animation?: 'default' | 'fade' | 'slide_from_right' | 'slide_from_left';
}

export interface TabBarOptions {
  showLabel?: boolean;
  activeTintColor?: string;
  inactiveTintColor?: string;
  activeBackgroundColor?: string;
  hideOnKeyboard?: boolean;
}

export interface DrawerOptions {
  drawerType?: 'front' | 'back' | 'slide' | 'permanent';
  drawerWidth?: number;
  overlayColor?: string;
}
