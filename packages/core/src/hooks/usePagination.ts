import { useState, useCallback, useRef } from 'react';

interface PaginationParams {
  current: number;
  pageSize: number;
}

interface PaginationResult<T> {
  list: T[];
  total: number;
}

interface UsePaginationOptions {
  defaultCurrent?: number;
  defaultPageSize?: number;
  deps?: any[];
}

export function usePagination<T>(
  service: (params: PaginationParams) => Promise<PaginationResult<T>>,
  options: UsePaginationOptions = {}
) {
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

      if (isRefresh) {
        setData(result.list);
      } else {
        setData(prev => [...prev, ...result.list]);
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
