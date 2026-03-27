import { useState, useCallback } from 'react';

export interface UseInfiniteOptions {
  /** 默认页码 */
  defaultPage?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 是否自动加载 */
  autoLoad?: boolean;
}

export interface UseInfiniteReturn<T> {
  /** 累积的数据列表 */
  data: T[];
  /** 当前页码 */
  page: number;
  /** 是否初始加载中 */
  loading: boolean;
  /** 是否加载更多中 */
  loadingMore: boolean;
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 错误信息 */
  error: Error | undefined;
  /** 加载数据 */
  load: () => Promise<void>;
  /** 加载更多 */
  loadMore: () => Promise<void>;
  /** 刷新（重置到第一页） */
  refresh: () => Promise<void>;
  /** 重置 */
  reset: () => void;
}

/**
 * 无限滚动获取参数
 * 支持扩展自定义参数
 */
export interface InfiniteFetchParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 其他自定义参数 */
  [key: string]: any;
}

/**
 * 无限滚动获取结果
 * 支持 data 或 list 作为数据字段
 */
export interface InfiniteFetchResult<T> {
  /** 数据列表（推荐） */
  data?: T[];
  /** 数据列表（兼容旧版本） */
  list?: T[];
  /** 是否还有更多数据 */
  hasMore: boolean;
}

/**
 * 无限滚动逻辑 Hook
 * @param fetcher - 数据获取函数，接收 { page, pageSize, ...其他参数 } 参数
 * @param options - 配置选项
 * @returns 无限滚动状态和控制方法
 *
 * @example
 * ```tsx
 * const { data, loading, loadingMore, hasMore, loadMore, refresh } = useInfinite(
 *   async ({ page, pageSize, keyword }) => {
 *     const res = await api.getList({ page, size: pageSize, keyword });
 *     return { data: res.items, hasMore: res.hasMore };
 *   },
 *   { pageSize: 20 }
 * );
 *
 * <FlatList
 *   data={data}
 *   onEndReached={hasMore && !loadingMore ? loadMore : null}
 *   refreshing={loading}
 *   onRefresh={refresh}
 * />
 * ```
 */
export function useInfinite<T>(
  fetcher: (params: InfiniteFetchParams) => Promise<InfiniteFetchResult<T>>,
  options: UseInfiniteOptions = {}
): UseInfiniteReturn<T> {
  const { defaultPage = 1, pageSize = 10 } = options;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(defaultPage);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchData = useCallback(
    async (targetPage: number, isLoadMore: boolean) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(undefined);

      try {
        const result = await fetcher({ page: targetPage, pageSize });

        // 支持 data 或 list 字段
        const items = result.data ?? result.list ?? [];

        if (isLoadMore) {
          setData(prev => [...prev, ...items]);
        } else {
          setData(items);
        }

        setHasMore(result.hasMore);
        setPage(targetPage);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [fetcher, pageSize]
  );

  const load = useCallback(async () => {
    await fetchData(defaultPage, false);
  }, [fetchData, defaultPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    await fetchData(page + 1, true);
  }, [fetchData, page, loadingMore, hasMore]);

  const refresh = useCallback(async () => {
    await fetchData(defaultPage, false);
  }, [fetchData, defaultPage]);

  const reset = useCallback(() => {
    setData([]);
    setPage(defaultPage);
    setLoading(false);
    setLoadingMore(false);
    setHasMore(true);
    setError(undefined);
  }, [defaultPage]);

  return {
    data,
    page,
    loading,
    loadingMore,
    hasMore,
    error,
    load,
    loadMore,
    refresh,
    reset,
  };
}
