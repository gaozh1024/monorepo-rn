import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, AppState } from 'react-native';
import { HotUpdater } from '@hot-updater/react-native';
import { hotUpdaterLogger } from './logger';
import type {
  CreateHotUpdaterContextOptions,
  HotUpdaterClient,
  HotUpdaterContextValue,
  ManualPromptContext,
  OtaManifest,
  OptionalUpdatePromptContext,
} from './types';

interface HotUpdaterProviderProps {
  children: React.ReactNode;
  optionalUpdatePromptHandler?: CreateHotUpdaterContextOptions['optionalUpdatePromptHandler'];
  manualPromptHandler?: CreateHotUpdaterContextOptions['manualPromptHandler'];
}

export function createHotUpdaterContext(
  hotUpdater: HotUpdaterClient,
  options: CreateHotUpdaterContextOptions = {}
) {
  const HotUpdaterContext = createContext<HotUpdaterContextValue | undefined>(undefined);

  function HotUpdaterProvider({
    children,
    optionalUpdatePromptHandler,
    manualPromptHandler,
  }: HotUpdaterProviderProps) {
    const summary = useMemo(() => hotUpdater.getSummary(), []);
    const [manifest, setManifest] = useState<OtaManifest | null>(null);
    const [isRefreshingManifest, setIsRefreshingManifest] = useState(false);
    const [launchUpdateState, setLaunchUpdateState] = useState<
      HotUpdaterContextValue['launchUpdateState']
    >({
      phase: 'idle',
      message: null,
      progress: 0,
    });
    const hasStartedLaunchUpdateRef = useRef(false);
    const hasForceUpdateRef = useRef(false);
    const hasPendingDownloadedUpdateRef = useRef(false);
    const appStateRef = useRef(AppState.currentState);
    const texts = hotUpdater.getTexts();

    const markPendingDownloadedUpdate = useCallback((message?: string) => {
      hasPendingDownloadedUpdateRef.current = true;
      hotUpdaterLogger('info', '[HotUpdater] 用户选择稍后更新，下次打开应用时自动生效', {
        message: message ?? null,
      });
    }, []);

    const promptOptionalUpdate = useCallback(
      async (message: string) => {
        const promptContext: OptionalUpdatePromptContext = {
          message,
          titles: {
            downloadedTitle: texts.downloadedReadyTitle,
            restartNowText: texts.restartNowText,
            restartLaterText: texts.restartLaterText,
          },
          actions: {
            reload: () => hotUpdater.reload(),
            markPending: () => markPendingDownloadedUpdate(message),
          },
        };

        const promptHandler = optionalUpdatePromptHandler ?? options.optionalUpdatePromptHandler;
        if (promptHandler) {
          hotUpdaterLogger('debug', '[HotUpdater] 使用自定义可选更新提示框', {
            message,
          });
          await promptHandler(promptContext);
          return;
        }

        hotUpdaterLogger('debug', '[HotUpdater] 使用默认 Alert 可选更新提示框', {
          message,
        });
        Alert.alert(promptContext.titles.downloadedTitle, promptContext.message, [
          {
            text: promptContext.titles.restartLaterText,
            style: 'cancel',
            onPress: () => promptContext.actions.markPending(),
          },
          {
            text: promptContext.titles.restartNowText,
            onPress: () => {
              hotUpdaterLogger('info', '[HotUpdater] 用户选择立即更新，开始重启应用', {
                message,
              });
              void promptContext.actions.reload();
            },
          },
        ]);
      },
      [
        hotUpdater,
        markPendingDownloadedUpdate,
        optionalUpdatePromptHandler,
        options.optionalUpdatePromptHandler,
        texts.downloadedReadyTitle,
        texts.restartLaterText,
        texts.restartNowText,
      ]
    );

    const promptManualUpdate = useCallback(
      async (context: ManualPromptContext) => {
        const handler = manualPromptHandler ?? options.manualPromptHandler;
        if (handler) {
          hotUpdaterLogger('debug', '[HotUpdater] 使用自定义手动检查提示框', {
            status: context.result.status,
            message: context.result.message,
          });
          await handler(context);
          return;
        }

        if (context.result.status !== 'downloaded' || !context.result.shouldReload) {
          return;
        }

        await promptOptionalUpdate(context.result.message);
      },
      [manualPromptHandler, options.manualPromptHandler, promptOptionalUpdate]
    );

    const refreshManifest = useCallback(async () => {
      setIsRefreshingManifest(true);
      try {
        const nextManifest = await hotUpdater.previewManifest();
        setManifest(nextManifest);
        return nextManifest;
      } finally {
        setIsRefreshingManifest(false);
      }
    }, []);

    const checkForUpdates = useCallback(async () => {
      const handler = manualPromptHandler ?? options.manualPromptHandler;
      if (handler) {
        await hotUpdater.checkManuallyAndPrompt({
          promptHandler: promptManualUpdate,
        });
      } else {
        await hotUpdater.checkManuallyAndPrompt();
      }
      await refreshManifest();
    }, [manualPromptHandler, options.manualPromptHandler, promptManualUpdate, refreshManifest]);

    const startLaunchUpdateCheck = useCallback(async () => {
      if (hasStartedLaunchUpdateRef.current) return;
      hasStartedLaunchUpdateRef.current = true;

      const unsubscribe = HotUpdater.addListener(
        'onProgress',
        ({ progress }: { progress: number }) => {
          setLaunchUpdateState(previous => ({
            ...previous,
            progress,
          }));
        }
      );

      try {
        const result = await hotUpdater.prepareLaunch({
          downloadOptionalUpdateInBackground: true,
          onStateChange: state => {
            setLaunchUpdateState(previous => ({
              phase: state.phase,
              message: state.message,
              progress: state.phase === 'updating-force' ? previous.progress : 0,
            }));

            if (state.phase === 'updating-force') {
              hasForceUpdateRef.current = true;
            }
          },
          onOptionalUpdateReady: ({ message, shouldReload }) => {
            if (!shouldReload) return;

            hotUpdaterLogger('info', '[HotUpdater] 后台更新已下载完成，提示用户是否立即更新', {
              message,
              shouldReload,
              appState: appStateRef.current,
            });

            if (appStateRef.current !== 'active') {
              hotUpdaterLogger(
                'info',
                '[HotUpdater] 下载完成时应用不在前台，跳过提示框，下次打开自动生效',
                {
                  message,
                  appState: appStateRef.current,
                }
              );
              markPendingDownloadedUpdate(message);
              return;
            }

            void promptOptionalUpdate(message);
          },
        });

        if (result.status === 'reloading') {
          return;
        }

        if (result.status === 'error') {
          hasStartedLaunchUpdateRef.current = false;
          return;
        }

        if (result.shouldPromptReload) {
          hotUpdaterLogger('info', '[HotUpdater] 冷启动检测到已有已下载更新，立即应用更新', {
            message: result.message,
          });
          await hotUpdater.reload();
          return;
        }

        setLaunchUpdateState({
          phase: 'ready',
          message: null,
          progress: 0,
        });
      } catch (error) {
        hasStartedLaunchUpdateRef.current = false;
        throw error;
      } finally {
        unsubscribe();
      }
    }, [markPendingDownloadedUpdate, promptOptionalUpdate]);

    useEffect(() => {
      if (!options.autoRefreshManifestOnMount) return;
      void refreshManifest();
    }, [refreshManifest]);

    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        const previousAppState = appStateRef.current;
        appStateRef.current = nextAppState;

        if (
          previousAppState.match(/inactive|background/) &&
          nextAppState === 'active' &&
          hasPendingDownloadedUpdateRef.current &&
          !hasForceUpdateRef.current
        ) {
          hotUpdaterLogger('info', '[HotUpdater] 应用重新回到前台，自动应用已下载更新', {
            previousAppState,
            nextAppState,
          });
          hasPendingDownloadedUpdateRef.current = false;
          void hotUpdater.reload();
          return;
        }

        hotUpdaterLogger('debug', '[HotUpdater] 应用状态切换', {
          previousAppState,
          nextAppState,
          hasPendingDownloadedUpdate: hasPendingDownloadedUpdateRef.current,
          hasForceUpdate: hasForceUpdateRef.current,
        });
      });

      return () => {
        subscription.remove();
      };
    }, []);

    const value = useMemo<HotUpdaterContextValue>(
      () => ({
        summary,
        manifest,
        isRefreshingManifest,
        refreshManifest,
        checkForUpdates,
        startLaunchUpdateCheck,
        launchUpdateState,
        reload: () => hotUpdater.reload(),
      }),
      [
        summary,
        manifest,
        isRefreshingManifest,
        refreshManifest,
        checkForUpdates,
        startLaunchUpdateCheck,
        launchUpdateState,
      ]
    );

    return <HotUpdaterContext.Provider value={value}>{children}</HotUpdaterContext.Provider>;
  }

  function useHotUpdaterContext() {
    const context = useContext(HotUpdaterContext);
    if (!context) {
      throw new Error('useHotUpdaterContext must be used within a HotUpdaterProvider');
    }

    return context;
  }

  return {
    HotUpdaterProvider,
    useHotUpdaterContext,
  };
}
