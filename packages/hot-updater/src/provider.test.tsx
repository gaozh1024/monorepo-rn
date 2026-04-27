import { useEffect } from 'react';
import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHotUpdaterContext } from './provider';
import type { HotUpdaterClient, HotUpdaterContextValue } from './types';

vi.mock('@hot-updater/react-native', () => ({
  HotUpdater: {
    addListener: vi.fn(() => vi.fn()),
  },
}));

vi.mock('react-native', () => ({
  Alert: {
    alert: vi.fn(),
  },
  AppState: {
    currentState: 'active',
    addEventListener: vi.fn(() => ({ remove: vi.fn() })),
  },
}));

const flushPromises = () => act(async () => {});

function createClient(prepareLaunch: HotUpdaterClient['prepareLaunch']): HotUpdaterClient {
  return {
    getSummary: () => ({
      appVersion: '1.0.0',
      channel: 'production',
      platform: 'android',
      manifestSource: 'test',
    }),
    getTexts: () => ({
      checkingTitle: 'Checking',
      updatingTitle: 'Updating',
      preparingTitle: 'Preparing',
      forceUpdatingTitle: 'Force updating',
      upToDateTitle: 'Up to date',
      upToDateMessage: 'Up to date.',
      checkFailedTitle: 'Check failed',
      checkFailedMessage: 'Check failed.',
      downloadedReadyTitle: 'Ready',
      downloadedCompletedTitle: 'Completed',
      downloadedMessage: 'Downloaded.',
      forceUpdateCompletedMessage: 'Force update completed.',
      updateDownloadFailedMessage: 'Download failed.',
      releaseOnlyMessage: 'Release only.',
      restartNowText: 'Restart now',
      restartLaterText: 'Later',
      launchPreparingMessage: 'Preparing launch.',
      launchForceUpdatingMessage: 'Force updating launch.',
      launchForceUpdateFailedMessage: 'Force update failed.',
      launchForceUpdateCompletedMessage: 'Force update completed.',
      launchOptionalUpdateReadyMessage: 'Optional ready.',
      launchBackgroundUpdateFailedMessage: 'Background failed.',
      launchCheckFailedMessage: 'Launch check failed.',
    }),
    checkManually: vi.fn(),
    checkManuallyAndPrompt: vi.fn(),
    previewManifest: vi.fn(async () => null),
    prepareLaunch,
    reload: vi.fn(),
  };
}

function StartLaunchCheckOnMount({
  useHotUpdaterContext,
  onSettled,
}: {
  useHotUpdaterContext: () => HotUpdaterContextValue;
  onSettled?: (error?: unknown) => void;
}) {
  const { startLaunchUpdateCheck } = useHotUpdaterContext();

  useEffect(() => {
    startLaunchUpdateCheck().then(() => onSettled?.(), onSettled);
  }, [onSettled, startLaunchUpdateCheck]);

  return null;
}

describe('createHotUpdaterContext launch retry', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('allows retry after prepareLaunch returns an error result', async () => {
    const prepareLaunch = vi
      .fn<HotUpdaterClient['prepareLaunch']>()
      .mockResolvedValueOnce({ status: 'error', message: 'network failed' })
      .mockResolvedValueOnce({ status: 'ready', message: null });
    const hotUpdater = createClient(prepareLaunch);
    const { HotUpdaterProvider, useHotUpdaterContext } = createHotUpdaterContext(hotUpdater);

    let settledCount = 0;
    let tree: ReactTestRenderer;
    await act(async () => {
      tree = create(
        <HotUpdaterProvider>
          <StartLaunchCheckOnMount
            useHotUpdaterContext={useHotUpdaterContext}
            onSettled={() => {
              settledCount += 1;
            }}
          />
        </HotUpdaterProvider>
      );
    });

    await flushPromises();
    expect(prepareLaunch).toHaveBeenCalledTimes(1);
    expect(settledCount).toBe(1);

    await act(async () => {
      tree.update(
        <HotUpdaterProvider>
          <StartLaunchCheckOnMount
            key="retry"
            useHotUpdaterContext={useHotUpdaterContext}
            onSettled={() => {
              settledCount += 1;
            }}
          />
        </HotUpdaterProvider>
      );
    });

    await flushPromises();
    expect(prepareLaunch).toHaveBeenCalledTimes(2);
    expect(settledCount).toBe(2);
  });

  it('allows retry after prepareLaunch throws', async () => {
    const prepareLaunch = vi
      .fn<HotUpdaterClient['prepareLaunch']>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ status: 'ready', message: null });
    const hotUpdater = createClient(prepareLaunch);
    const { HotUpdaterProvider, useHotUpdaterContext } = createHotUpdaterContext(hotUpdater);

    const settledErrors: unknown[] = [];
    let tree: ReactTestRenderer;
    await act(async () => {
      tree = create(
        <HotUpdaterProvider>
          <StartLaunchCheckOnMount
            useHotUpdaterContext={useHotUpdaterContext}
            onSettled={error => {
              settledErrors.push(error);
            }}
          />
        </HotUpdaterProvider>
      );
    });

    await flushPromises();
    expect(prepareLaunch).toHaveBeenCalledTimes(1);
    expect(settledErrors[0]).toBeInstanceOf(Error);

    await act(async () => {
      tree.update(
        <HotUpdaterProvider>
          <StartLaunchCheckOnMount
            key="retry"
            useHotUpdaterContext={useHotUpdaterContext}
            onSettled={error => {
              settledErrors.push(error);
            }}
          />
        </HotUpdaterProvider>
      );
    });

    await flushPromises();
    expect(prepareLaunch).toHaveBeenCalledTimes(2);
    expect(settledErrors).toHaveLength(2);
    expect(settledErrors[1]).toBeUndefined();
  });
});
