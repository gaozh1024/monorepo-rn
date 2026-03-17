import { useState, useCallback, useRef, useEffect } from 'react';

interface UseRequestOptions<T, P extends any[]> {
  manual?: boolean;
  deps?: any[];
  defaultParams?: P;
  onSuccess?: (data: T, params: P) => void;
  onError?: (error: Error, params: P) => void;
  onFinally?: (params: P) => void;
  retryCount?: number;
  retryDelay?: number;
}

export function useRequest<T, P extends any[] = any[]>(
  service: (...params: P) => Promise<T>,
  options: UseRequestOptions<T, P> = {}
) {
  const {
    manual = false,
    deps = [],
    defaultParams,
    onSuccess,
    onError,
    onFinally,
    retryCount = 0,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(!manual);
  const [error, setError] = useState<Error | undefined>(undefined);

  const serviceRef = useRef(service);
  const paramsRef = useRef<P | undefined>(defaultParams as P);
  const retryCountRef = useRef(0);
  const canceledRef = useRef(false);

  serviceRef.current = service;

  const run = useCallback(
    async (...params: P) => {
      paramsRef.current = params;

      setLoading(true);
      setError(undefined);

      try {
        const result = await serviceRef.current(...params);

        if (!canceledRef.current) {
          setData(result);
          retryCountRef.current = 0;
          onSuccess?.(result, params);
        }

        return result;
      } catch (err) {
        if (!canceledRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error, params);

          if (retryCountRef.current < retryCount) {
            retryCountRef.current++;
            setTimeout(() => {
              if (!canceledRef.current) {
                run(...params);
              }
            }, retryDelay * retryCountRef.current);
          }
        }

        throw err;
      } finally {
        if (!canceledRef.current) {
          setLoading(false);
          onFinally?.(params);
        }
      }
    },
    [onSuccess, onError, onFinally, retryCount, retryDelay]
  );

  const refresh = useCallback(() => {
    if (paramsRef.current) {
      return run(...paramsRef.current);
    }
    throw new Error('No params to refresh');
  }, [run]);

  const cancel = useCallback(() => {
    canceledRef.current = true;
  }, []);

  const mutate = useCallback((newData: T | ((prev: T | undefined) => T)) => {
    setData(prev => {
      if (typeof newData === 'function') {
        return (newData as Function)(prev);
      }
      return newData;
    });
  }, []);

  useEffect(() => {
    if (!manual) {
      run(...(defaultParams || ([] as unknown as P)));
    }

    return () => {
      canceledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    loading,
    error,
    run,
    refresh,
    cancel,
    mutate,
  };
}
