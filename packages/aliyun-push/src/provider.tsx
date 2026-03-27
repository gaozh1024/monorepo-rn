import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { normalizeAliyunPushConfig } from './config';
import { pushLogger } from './logger';
import {
  bindAliyunPushAccount,
  initAliyunPush,
  isAliyunPushConfigured,
  registerAliyunPushCallbacks,
  removeAliyunPushCallbacks,
  unbindAliyunPushAccount,
} from './service';
import type { AliyunPushContextValue, AliyunPushProviderProps } from './types';

const AliyunPushContext = createContext<AliyunPushContextValue | undefined>(undefined);

export function AliyunPushProvider<UserType = { id?: string | null }>({
  children,
  config,
  user = null,
  isLoggedIn = false,
  accountResolver,
  autoNavigateOnNotificationOpen = true,
  openNotificationTarget,
  onInitSuccess,
  onInitError,
  onNotificationReceive,
  onMessage,
  onNotificationOpen,
  onNotificationRemoved,
  onNotificationReceivedInApp,
  onNotificationClickedWithNoAction,
  onRegisterDeviceTokenSuccess,
  onRegisterDeviceTokenFailed,
  onChannelOpen,
}: AliyunPushProviderProps<UserType>) {
  const normalizedConfig = useMemo(() => normalizeAliyunPushConfig(config), [config]);
  const isConfigured = useMemo(() => isAliyunPushConfigured(normalizedConfig), [normalizedConfig]);

  const [isInitialized, setIsInitialized] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [apnsDeviceToken, setApnsDeviceToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef(true);
  const lastBoundAccountRef = useRef<string | null>(null);
  const callbacksRef = useRef({
    onInitSuccess,
    onInitError,
    onNotificationReceive,
    onMessage,
    onNotificationOpen,
    onNotificationRemoved,
    onNotificationReceivedInApp,
    onNotificationClickedWithNoAction,
    onRegisterDeviceTokenSuccess,
    onRegisterDeviceTokenFailed,
    onChannelOpen,
  });

  callbacksRef.current = {
    onInitSuccess,
    onInitError,
    onNotificationReceive,
    onMessage,
    onNotificationOpen,
    onNotificationRemoved,
    onNotificationReceivedInApp,
    onNotificationClickedWithNoAction,
    onRegisterDeviceTokenSuccess,
    onRegisterDeviceTokenFailed,
    onChannelOpen,
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleNotificationOpen = useCallback(
    async (event: unknown, userHandler?: (event: unknown) => void) => {
      pushLogger.info('[通知事件] 收到通知点击事件', event);
      if (autoNavigateOnNotificationOpen) {
        if (!openNotificationTarget) {
          pushLogger.warn('[通知事件] 未提供通知点击跳转处理器');
        } else {
          try {
            const targetUrl = await openNotificationTarget(event);
            if (targetUrl) {
              pushLogger.info('[通知事件] 已执行通知点击跳转', { targetUrl });
            } else {
              pushLogger.warn('[通知事件] 未从通知 payload 中解析出跳转目标', event);
            }
          } catch (navigationError) {
            pushLogger.warn('[通知事件] 通知点击跳转失败', navigationError);
          }
        }
      }

      userHandler?.(event);
    },
    [autoNavigateOnNotificationOpen, openNotificationTarget]
  );

  const refresh = useCallback(async () => {
    pushLogger.info('[Provider] 手动/自动触发推送初始化', {
      enabled: normalizedConfig.enabled,
      isConfigured,
    });

    if (!normalizedConfig.enabled) {
      return null;
    }

    try {
      const context = await initAliyunPush(normalizedConfig);
      if (context && mountedRef.current) {
        pushLogger.info('[Provider] 推送初始化成功', context);
        setIsInitialized(true);
        setDeviceId(context.deviceId);
        setApnsDeviceToken(context.apnsDeviceToken);
        setError(null);
        callbacksRef.current.onInitSuccess?.(context);
      }
      return context;
    } catch (initError) {
      const nextError =
        initError instanceof Error ? initError : new Error('Aliyun Push 初始化失败');
      pushLogger.error('[Provider] 推送初始化失败', nextError);
      if (mountedRef.current) {
        setError(nextError);
      }
      callbacksRef.current.onInitError?.(nextError);
      return null;
    }
  }, [isConfigured, normalizedConfig]);

  useEffect(() => {
    if (!normalizedConfig.enabled) {
      pushLogger.warn('[Provider] 推送未启用，跳过注册回调和初始化');
      return;
    }

    pushLogger.info('[Provider] 开始注册 JS 层推送回调');
    registerAliyunPushCallbacks({
      onNotification: event => {
        pushLogger.info('[通知事件] 收到通知', event);
        callbacksRef.current.onNotificationReceive?.(event);
      },
      onMessage: event => {
        pushLogger.info('[通知事件] 收到透传消息', event);
        callbacksRef.current.onMessage?.(event);
      },
      onNotificationOpened: event => {
        void handleNotificationOpen(event, callbacksRef.current.onNotificationOpen);
      },
      onNotificationRemoved: event => {
        pushLogger.info('[通知事件] 通知被移除', event);
        callbacksRef.current.onNotificationRemoved?.(event);
      },
      onNotificationReceivedInApp: event => {
        pushLogger.info('[通知事件] 前台收到通知', event);
        callbacksRef.current.onNotificationReceivedInApp?.(event);
      },
      onNotificationClickedWithNoAction: event => {
        void handleNotificationOpen(event, callbacksRef.current.onNotificationClickedWithNoAction);
      },
      onRegisterDeviceTokenSuccess: event => {
        pushLogger.info('[通知事件] APNs token 注册成功', event);
        callbacksRef.current.onRegisterDeviceTokenSuccess?.(event);
      },
      onRegisterDeviceTokenFailed: event => {
        pushLogger.warn('[通知事件] APNs token 注册失败', event);
        callbacksRef.current.onRegisterDeviceTokenFailed?.(event);
      },
      onChannelOpen: event => {
        pushLogger.info('[通知事件] iOS 通道建连成功', event);
        callbacksRef.current.onChannelOpen?.(event);
      },
    });

    void refresh();

    return () => {
      pushLogger.info('[Provider] 卸载推送 Provider，清理回调');
      removeAliyunPushCallbacks();
    };
  }, [handleNotificationOpen, normalizedConfig, refresh]);

  useEffect(() => {
    if (!normalizedConfig.enabled || normalizedConfig.autoBindAccount === false || !isInitialized) {
      pushLogger.debug('[Provider] 跳过账号自动绑定', {
        enabled: normalizedConfig.enabled,
        autoBindAccount: normalizedConfig.autoBindAccount,
        isInitialized,
      });
      return;
    }

    const resolvedAccount = accountResolver ? accountResolver(user) : null;
    let cancelled = false;

    const syncAccount = async () => {
      try {
        pushLogger.info('[Provider] 检查推送账号绑定状态', {
          isLoggedIn,
          resolvedAccount,
          lastBoundAccount: lastBoundAccountRef.current,
        });

        if (isLoggedIn && resolvedAccount) {
          const account = resolvedAccount.trim();
          if (!account || lastBoundAccountRef.current === account) {
            pushLogger.debug('[Provider] 当前账号无需重复绑定', { account });
            return;
          }

          if (lastBoundAccountRef.current && lastBoundAccountRef.current !== account) {
            pushLogger.info('[Provider] 检测到账号变化，先解绑旧账号', {
              previous: lastBoundAccountRef.current,
              next: account,
            });
            await unbindAliyunPushAccount(normalizedConfig);
          }

          const result = await bindAliyunPushAccount(account, normalizedConfig);
          if (!cancelled && result) {
            lastBoundAccountRef.current = account;
          }
          return;
        }

        if (lastBoundAccountRef.current) {
          pushLogger.info('[Provider] 用户退出登录，解绑推送账号', {
            previous: lastBoundAccountRef.current,
          });
          await unbindAliyunPushAccount(normalizedConfig);
          if (!cancelled) {
            lastBoundAccountRef.current = null;
          }
        }
      } catch (syncError) {
        pushLogger.warn('[Provider] 同步推送账号状态失败', syncError);
      }
    };

    void syncAccount();

    return () => {
      cancelled = true;
    };
  }, [accountResolver, isInitialized, isLoggedIn, normalizedConfig, user]);

  const value = useMemo<AliyunPushContextValue>(
    () => ({
      isConfigured,
      isInitialized,
      deviceId,
      apnsDeviceToken,
      error,
      refresh,
    }),
    [apnsDeviceToken, deviceId, error, isConfigured, isInitialized, refresh]
  );

  return <AliyunPushContext.Provider value={value}>{children}</AliyunPushContext.Provider>;
}

export function useAliyunPush(): AliyunPushContextValue {
  const context = useContext(AliyunPushContext);
  if (!context) {
    throw new Error('useAliyunPush must be used within AliyunPushProvider');
  }
  return context;
}
