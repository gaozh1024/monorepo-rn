/**
 * 屏幕选项类型
 * @module navigation/types/screens
 */

/**
 * 屏幕选项配置 - 堆栈
 */
export interface StackScreenOptions {
  /** 标题 */
  title?: string;
  /** 是否显示头部 */
  headerShown?: boolean;
  /** 自定义头部 */
  header?: (props: any) => React.ReactElement | null;
  /** 动画类型 */
  animation?:
    | 'default'
    | 'fade'
    | 'slide_from_right'
    | 'slide_from_left'
    | 'slide_from_bottom'
    | 'none';
  /** 是否支持全屏手势返回（主要用于 iOS） */
  fullScreenGestureEnabled?: boolean;
  /** 自定义后退按钮标题（iOS） */
  headerBackTitle?: string;
  /** 是否显示后退按钮 */
  headerBackVisible?: boolean;
  /** 内容样式 */
  contentStyle?: object;
}

/**
 * 屏幕选项配置 - 标签
 */
export interface TabScreenOptions {
  /** 标签标题 */
  title?: string;
  /** 标签栏标签 */
  tabBarLabel?: string | ((props: { focused: boolean; color: string }) => React.ReactNode);
  /** 标签栏图标 */
  tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  /** 是否显示标签栏 */
  tabBarVisible?: boolean;
  /** 是否支持滑动切换 */
  swipeEnabled?: boolean;
}

/**
 * 标签栏配置
 */
export interface TabBarOptions {
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 激活状态颜色 */
  activeTintColor?: string;
  /** 非激活状态颜色 */
  inactiveTintColor?: string;
  /** 激活背景色 */
  activeBackgroundColor?: string;
  /** 非激活背景色 */
  inactiveBackgroundColor?: string;
  /** 键盘弹出时是否隐藏 */
  hideOnKeyboard?: boolean;
  /** 标签位置 */
  labelPosition?: 'below-icon' | 'beside-icon';
  /** 标签样式 */
  labelStyle?: object;
  /** 图标样式 */
  iconStyle?: object;
  /** 标签栏样式 */
  style?: object;
}

/**
 * 屏幕选项配置 - 抽屉
 */
export interface DrawerScreenOptions {
  /** 标题 */
  title?: string;
  /** 是否显示头部 */
  headerShown?: boolean;
  /** 抽屉标签 */
  drawerLabel?: string | ((props: { focused: boolean; color: string }) => React.ReactNode);
  /** 抽屉图标 */
  drawerIcon?: (props: { focused: boolean; size: number; color: string }) => React.ReactNode;
  /** 激活状态颜色 */
  drawerActiveTintColor?: string;
  /** 非激活状态颜色 */
  drawerInactiveTintColor?: string;
  /** 激活背景色 */
  drawerActiveBackgroundColor?: string;
  /** 非激活背景色 */
  drawerInactiveBackgroundColor?: string;
}

/**
 * 抽屉配置
 */
export interface DrawerOptions {
  /** 抽屉类型 */
  drawerType?: 'front' | 'back' | 'slide' | 'permanent';
  /** 抽屉宽度 */
  drawerWidth?: number;
  /** 遮罩层颜色 */
  overlayColor?: string;
  /** 是否支持边缘滑动打开 */
  edgeWidth?: number;
  /** 最小滑动距离 */
  minSwipeDistance?: number;
  /** 隐藏状态下是否响应手势 */
  gestureHandlerProps?: object;
}
