import React, { useEffect, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from '@tanstack/react-query';

/** QueryProvider 属性 */
export interface QueryProviderProps {
  /** 子组件 */
  children: React.ReactNode;
  /** 初始化回调函数，用于执行认证令牌获取等初始化逻辑 */
  onInit?: () => Promise<void> | void;
  /** 初始化完成前的加载组件 */
  loadingComponent?: React.ReactNode;
  /** React Query 客户端配置 */
  clientConfig?: QueryClientConfig;
}

/**
 * 创建默认的 QueryClient 实例
 * @param config - 自定义配置
 * @returns QueryClient 实例
 */
export function createQueryClient(config?: QueryClientConfig): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /** 查询重试次数 */
        retry: 1,
        /** 查询重试延迟（毫秒） */
        retryDelay: 1000,
        /** 窗口聚焦时是否重新获取数据 */
        refetchOnWindowFocus: false,
        /** 查询数据在后台是否变为过期 */
        staleTime: 5 * 60 * 1000,
        ...config?.defaultOptions?.queries,
      },
      mutations: {
        ...config?.defaultOptions?.mutations,
      },
    },
    ...config,
  });
}

/**
 * 通用 Query Provider 组件
 *
 * 提供全局的 React Query 客户端，并支持异步初始化逻辑。
 * 适用于需要在应用启动时执行认证检查、Token 获取等场景。
 *
 * @example
 * ```tsx
 * // 基础用法
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 *
 * // 带初始化逻辑
 * <QueryProvider
 *   onInit={async () => {
 *     const token = await storage.getToken();
 *     if (token) api.setToken(token);
 *   }}
 * >
 *   <App />
 * </QueryProvider>
 *
 * // 自定义加载组件和配置
 * <QueryProvider
 *   onInit={initAuth}
 *   loadingComponent={<SplashScreen />}
 *   clientConfig={{
 *     defaultOptions: {
 *       queries: { staleTime: 10 * 60 * 1000 }
 *     }
 *   }}
 * >
 *   <App />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({
  children,
  onInit,
  loadingComponent = null,
  clientConfig,
}: QueryProviderProps) {
  const [isReady, setIsReady] = useState(!onInit);
  const [queryClient] = useState(() => createQueryClient(clientConfig));

  useEffect(() => {
    if (!onInit) return;

    const runInit = async () => {
      try {
        await onInit();
      } catch (error) {
        console.error('[QueryProvider] 初始化失败:', error);
      } finally {
        setIsReady(true);
      }
    };

    runInit();
  }, [onInit]);

  // 等待初始化完成再渲染子组件
  if (!isReady) {
    return <>{loadingComponent}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { QueryClientProvider };
