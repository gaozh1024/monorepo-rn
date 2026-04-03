import type React from 'react';

export type HotUpdaterPlatform = 'ios' | 'android';

export interface OtaManifestRelease {
  bundleId: string;
  appVersion: string;
  minNativeVersion: string;
  force: boolean;
  notes?: string;
  url: string;
  sha256?: string;
  size?: number;
}

export interface OtaManifest {
  schemaVersion: number;
  platform: HotUpdaterPlatform;
  channel: string;
  updatedAt: string;
  release?: OtaManifestRelease | null;
}

export interface HotUpdaterTexts {
  checkingTitle: string;
  updatingTitle: string;
  preparingTitle: string;
  forceUpdatingTitle: string;
  upToDateTitle: string;
  upToDateMessage: string;
  checkFailedTitle: string;
  checkFailedMessage: string;
  downloadedReadyTitle: string;
  downloadedCompletedTitle: string;
  downloadedMessage: string;
  forceUpdateCompletedMessage: string;
  updateDownloadFailedMessage: string;
  releaseOnlyMessage: string;
  restartNowText: string;
  restartLaterText: string;
  launchPreparingMessage: string;
  launchForceUpdatingMessage: string;
  launchForceUpdateFailedMessage: string;
  launchForceUpdateCompletedMessage: string;
  launchOptionalUpdateReadyMessage: string;
  launchBackgroundUpdateFailedMessage: string;
  launchCheckFailedMessage: string;
}

export interface HotUpdaterCheckParams {
  platform: HotUpdaterPlatform;
  appVersion: string;
  channel: string;
  bundleId: string;
  minBundleId: string;
  requestHeaders?: Record<string, string>;
}

export interface HotUpdaterUpdateInfo {
  id: string;
  shouldForceUpdate: boolean;
  status: 'UPDATE';
  fileUrl: string;
  fileHash: string | null;
  message: string | null;
}

export type HotUpdaterManualResult =
  | { status: 'up-to-date'; message: string }
  | { status: 'downloaded'; message: string; shouldReload: boolean }
  | { status: 'error'; message: string };

export interface HotUpdaterSummary {
  appVersion: string;
  channel: string;
  platform: HotUpdaterPlatform;
  manifestSource: string;
}

export interface HotUpdaterClient {
  getSummary: () => HotUpdaterSummary;
  getTexts: () => HotUpdaterTexts;
  checkManually: () => Promise<HotUpdaterManualResult>;
  checkManuallyAndPrompt: (promptOptions?: ManualPromptOptions) => Promise<HotUpdaterManualResult>;
  previewManifest: () => Promise<OtaManifest | null>;
  prepareLaunch: (
    options?: PrepareHotUpdaterLaunchOptions
  ) => Promise<PrepareHotUpdaterLaunchResult>;
  reload: () => Promise<void>;
}

export interface HotUpdaterContextValue {
  summary: HotUpdaterSummary;
  manifest: OtaManifest | null;
  isRefreshingManifest: boolean;
  refreshManifest: () => Promise<OtaManifest | null>;
  checkForUpdates: () => Promise<void>;
  startLaunchUpdateCheck: () => Promise<void>;
  launchUpdateState: {
    phase: 'idle' | 'checking' | 'updating-force' | 'ready' | 'error';
    message: string | null;
    progress: number;
  };
  reload: () => Promise<void>;
}

export interface OptionalUpdatePromptContext {
  message: string;
  titles: {
    downloadedTitle: string;
    restartNowText: string;
    restartLaterText: string;
  };
  actions: {
    reload: () => Promise<void>;
    markPending: () => void;
  };
}

export interface HotUpdaterLaunchState {
  phase: 'idle' | 'checking' | 'updating-force' | 'ready' | 'error';
  message: string | null;
}

export interface PrepareHotUpdaterLaunchOptions {
  downloadOptionalUpdateInBackground?: boolean;
  onStateChange?: (state: HotUpdaterLaunchState) => void;
  onOptionalUpdateReady?: (result: { message: string; shouldReload: boolean }) => void;
  onError?: (error: Error) => void;
}

export interface PrepareHotUpdaterLaunchResult {
  status: 'ready' | 'reloading' | 'error';
  message: string | null;
  shouldPromptReload?: boolean;
}

export interface ManifestProviderContext extends HotUpdaterCheckParams {}

export type ManifestProvider = (context: ManifestProviderContext) => Promise<OtaManifest | null>;

export interface CreateHotUpdaterOptions {
  appVersion?: string;
  defaultChannel?: string;
  getChannel?: () => string;
  getManifest: ManifestProvider;
  texts?: Partial<HotUpdaterTexts>;
  describeManifestSource?: (context: { platform: HotUpdaterPlatform; channel: string }) => string;
}

export interface CreateOssHotUpdaterOptions {
  manifestBaseURL: string;
  appVersion?: string;
  defaultChannel?: string;
  getChannel?: () => string;
  requestHeaders?: Record<string, string>;
  texts?: Partial<HotUpdaterTexts>;
}

export interface WrapAppOptions {
  reloadOnForceUpdate?: boolean;
  updateMode?: 'auto' | 'manual';
  defaultUI?: DefaultHotUpdaterUIOptions;
  fallbackComponent?: React.FC<{
    status: string;
    progress: number;
    message: string | null;
  }>;
  onError?: (error: Error | unknown) => void;
  onUpdateProcessCompleted?: (result: {
    status: 'ROLLBACK' | 'UPDATE' | 'UP_TO_DATE';
    shouldForceUpdate: boolean;
    message: string | null;
    id: string;
  }) => void;
}

export interface ManualPromptOptions {
  upToDateTitle?: string;
  upToDateMessage?: string;
  errorTitle?: string;
  downloadedTitle?: string;
  restartNowText?: string;
  restartLaterText?: string;
  promptHandler?: (context: ManualPromptContext) => Promise<void> | void;
}

export interface ManualPromptContext {
  result: HotUpdaterManualResult;
  titles: {
    upToDateTitle: string;
    upToDateMessage?: string;
    errorTitle: string;
    downloadedTitle: string;
    restartNowText: string;
    restartLaterText: string;
  };
  actions: {
    reload: () => Promise<void>;
  };
}

export interface DefaultHotUpdaterUIOptions {
  backgroundColor?: string;
  spinnerColor?: string;
  titleColor?: string;
  messageColor?: string;
  progressColor?: string;
  checkingTitle?: string;
  updatingTitle?: string;
  texts?: Partial<HotUpdaterTexts>;
}

export interface DefaultHotUpdaterLaunchUIOptions {
  backgroundColor?: string;
  spinnerColor?: string;
  titleColor?: string;
  messageColor?: string;
  preparingTitle?: string;
  forceUpdatingTitle?: string;
  texts?: Partial<HotUpdaterTexts>;
}

export interface CreateHotUpdaterContextOptions {
  autoRefreshManifestOnMount?: boolean;
  optionalUpdatePromptHandler?: (context: OptionalUpdatePromptContext) => Promise<void> | void;
  manualPromptHandler?: (context: ManualPromptContext) => Promise<void> | void;
}
