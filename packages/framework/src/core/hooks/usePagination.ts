import { useState, useCallback, useRef } from 'react';

/**
 * 分页参数
 */
export interface PaginationParams {
  /** 当前页码 */
  current: number;
  /** 每页数量 */
  pageSize: number;
  /** 其他自定义参数 */
  [key: string]: any;
}

/**
 * 分页结果
 * 支持 data 或 list 作为数据字段
 */
export interface PaginationResult<T> {
  /** 数据列表（推荐） */
  data?: T[];
  /** 数据列表（兼容旧版本） */
  list?: T[];
  /** 总数据条数 */
  total: number;
}

/**
 * 分页选项
 */
export interface UsePaginationOptions {
  /** 默认当前页码 */
  defaultCurrent?: number;
  /** 默认每页数量 */
  defaultPageSize?: number;
  /** 依赖数组 */
  deps?: any[];
}

/**
 * 分页返回值
 */
export interface UsePaginationReturn<T> {
  /** 数据列表 */
  data: T[];
  /** 当前页码 */
  current: number;
  /** 每页数量 */
  pageSize: number;
  /** 总数据条数 */
  total: number;
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 是否加载中 */
  loading: boolean;
  /** 是否刷新中 */
  refreshing: boolean;
  /** 是否加载更多中 */
  loadingMore: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => Promise<void>;
  /** 加载更多数据 */
  loadMore: () => Promise<void>;
  /** 切换页码 */
  changePage: (page: number) => Promise<void>;
}

/**
 * 分页逻辑 Hook
 * @param service - 分页数据请求函数
 * @param options - 配置选项
 * @returns 分页状态和控制方法
 *
 * @example
 * ```tsx
 * const {
 *   data,
 *   current,
 *   total,
 *   hasMore,
 *   loading,
 *   refreshing,
 *   loadingMore,
 *   refresh,
 *   loadMore,
 * } = usePagination(
 *   async ({ current, pageSize, keyword }) => {
 *     const res = await api.getList({ page: current, size: pageSize, keyword });
 *     return { data: res.items, total: res.total };
 *   },
 *   { defaultPageSize: 20 }
 * );
 * ```
 */
export function usePagination<T>(
  service: (params: PaginationParams) => Promise<PaginationResult<T>>,
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const { defaultCurrent = 1, defaultPageSize = 10 } = options;

  const [data, setData] = useState<T[]>([]);
  const [current, setCurrent] = useState(defaultCurrent);
  const [pageSize] = useState(defaultPageSize);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const serviceRef = useRef(service);
  serviceRef.current = service;

  const hasMore = data.length < total;

  const fetch = useCallback(async (params: PaginationParams, isRefresh = false) => {
    try {
      const result = await serviceRef.current(params);

      // 支持 data 或 list 字段
      const items = result.data ?? result.list ?? [];

      if (isRefresh) {
        setData(items);
      } else {
        setData(prev => [...prev, ...items]);
      }
      setTotal(result.total);
      setError(null);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw err;
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetch({ current: 1, pageSize }, true);
      setCurrent(1);
    } finally {
      setRefreshing(false);
    }
  }, [fetch, pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = current + 1;
      await fetch({ current: nextPage, pageSize }, false);
      setCurrent(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [fetch, current, pageSize, loadingMore, hasMore]);

  const changePage = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        await fetch({ current: page, pageSize }, true);
        setCurrent(page);
      } finally {
        setLoading(false);
      }
    },
    [fetch, pageSize]
  );

  return {
    data,
    current,
    pageSize,
    total,
    hasMore,
    loading,
    refreshing,
    loadingMore,
    error,
    refresh,
    loadMore,
    changePage,
  };
}
