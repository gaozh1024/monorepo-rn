/**
 * 导航 Hooks 模块
 * @module navigation/hooks
 */

// 基础导航 Hooks
export {
  useStackNavigation,
  useTabNavigation,
  useDrawerNavigation,
  useBackHandler,
  // 类型导出
  type NativeStackNavigationProp,
  type NativeStackScreenProps,
  type BottomTabNavigationProp,
  type BottomTabScreenProps,
  type DrawerNavigationProp,
  type DrawerScreenProps,
  type RouteProp,
  type NavigationProp,
} from './useNavigation';

// 路由 Hooks
export { useRoute } from './useRoute';

// 导航状态 Hooks
export {
  useNavigationState,
  useIsFocused,
  useFocusEffect,
  useScrollToTop,
} from './useNavigationState';
