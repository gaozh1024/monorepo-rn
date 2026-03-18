/**
 * 路由相关 Hooks
 * @module navigation/hooks/useRoute
 */

import { useRoute as useRNRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackParamList } from '../types';

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
