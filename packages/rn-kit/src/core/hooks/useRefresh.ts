import { useState, useCallback } from 'react';

export interface UseRefreshReturn<T> {
  /** 数据 */
  data: T | undefined;
  /** 是否刷新中 */
  refreshing: boolean;
  /** 错误信息 */
  error: Error | undefined;
  /** 触发刷新 */
  refresh: () => Promise<void>;
}

/**
 * 下拉刷新逻辑 Hook
 * @param fetcher - 数据获取函数
 * @returns 刷新状态和触发方法
 *
 * @example
 * ```tsx
 * const { data, refreshing, refresh } = useRefresh(() => fetchUserList());
 *
 * <FlatList
 *   refreshing={refreshing}
 *   onRefresh={refresh}
 *   data={data}
 * />
 * ```
 */
export function useRefresh<T>(fetcher: () => Promise<T>): UseRefreshReturn<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(undefined);

    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
    } finally {
      setRefreshing(false);
    }
  }, [fetcher]);

  return {
    data,
    refreshing,
    error,
    refresh,
  };
}
