import { useState, useCallback } from 'react';
import type { AppError } from './types';
import { enhanceError } from './helpers';

export interface UseAsyncState<T> {
  data: T | null;
  error:
    | (AppError & {
        isValidation: boolean;
        isNetwork: boolean;
        isAuth: boolean;
        isRetryable: boolean;
      })
    | null;
  loading: boolean;
}

export function useAsyncState<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<UseAsyncState<T>['error']>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (promise: Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await promise;
      setData(result);
      return result;
    } catch (err: any) {
      const appError: AppError = {
        code: err.code || 'UNKNOWN',
        message: err.message || 'Unknown error',
        ...err,
      };
      const enhanced = enhanceError(appError);
      setError(enhanced);
      throw enhanced;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, execute, reset };
}
