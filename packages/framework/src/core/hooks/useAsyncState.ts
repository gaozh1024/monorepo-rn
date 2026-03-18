/**
 * @fileoverview 异步状态管理 Hook
 * @module core/hooks/useAsyncState
 * @description 提供用于异步操作状态管理的 React Hook
 */

import { useState, useCallback } from 'react';
import type { AppError } from '@/core/error/types';
import { enhanceError } from '@/core/error/helpers';

/**
 * useAsyncState Hook 返回的状态接口
 * @template T - 数据的类型
 * @example
 * ```typescript
 * const { data, error, loading, execute, reset } = useAsyncState<User>();
 * ```
 */
export interface UseAsyncState<T> {
  /** 异步操作返回的数据 */
  data: T | null;
  /** 错误对象（如果发生错误） */
  error:
    | (AppError & {
        isValidation: boolean;
        isNetwork: boolean;
        isAuth: boolean;
        isRetryable: boolean;
      })
    | null;
  /** 是否正在加载 */
  loading: boolean;
}

/**
 * 管理异步操作状态的 React Hook
 * @template T - 异步操作返回数据的类型，默认为 any
 * @returns 包含数据、错误、加载状态和操作方法的对象
 * @example
 * ```typescript
 * function UserProfile({ userId }: { userId: number }) {
 *   const { data: user, error, loading, execute } = useAsyncState<User>();
 *
 *   useEffect(() => {
 *     execute(fetchUser(userId));
 *   }, [userId, execute]);
 *
 *   if (loading) return <Loading />;
 *   if (error?.isAuth) return <RedirectToLogin />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <UserCard user={user} />;
 * }
 * ```
 */
export function useAsyncState<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<UseAsyncState<T>['error']>(null);
  const [loading, setLoading] = useState(false);

  /**
   * 执行异步操作
   * @param promise - 要执行的 Promise
   * @returns Promise 的解析结果
   * @throws 增强后的错误对象
   */
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

  /**
   * 重置所有状态到初始值
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, error, loading, execute, reset };
}
