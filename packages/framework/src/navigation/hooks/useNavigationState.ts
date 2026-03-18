/**
 * 导航状态 Hooks
 * @module navigation/hooks/useNavigationState
 */

import {
  useNavigationState as useRNNavigationState,
  useIsFocused,
  useFocusEffect,
  useScrollToTop,
} from '@react-navigation/native';
import type { NavigationState } from '@react-navigation/native';

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
