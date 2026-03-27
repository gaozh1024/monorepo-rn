import type { ReactNode } from 'react';

export interface PushResult {
  code: string;
  errorMsg?: string;
  aliasList?: string;
  tagsList?: string;
}

export interface CreateAndroidChannelParams {
  id: string;
  name: string;
  importance: number;
  desc: string;
  groupId?: string;
  allowBubbles?: boolean;
  light?: boolean;
  lightColor?: number;
  showBadge?: boolean;
  soundPath?: string;
  soundUsage?: number;
  soundContentType?: number;
  soundFlag?: number;
  vibration?: boolean;
  vibrationPattern?: number[];
}

export interface AliyunPushPlatformConfig {
  appKey: string;
  appSecret: string;
}

export interface AliyunPushIOSConfig extends AliyunPushPlatformConfig {
  apsEnvironment?: 'development' | 'production';
  enableBackgroundRemoteNotifications?: boolean;
}

export interface AliyunPushVendorConfig {
  huaweiAppId?: string;
  vivoAppId?: string;
  vivoApiKey?: string;
  honorAppId?: string;
  oppoKey?: string;
  oppoSecret?: string;
  xiaomiAppId?: string;
  xiaomiAppKey?: string;
  meizuAppId?: string;
  meizuAppKey?: string;
  fcmSenderId?: string;
  fcmAppId?: string;
  fcmProjectId?: string;
  fcmApiKey?: string;
}

export interface AliyunPushRuntimeConfig {
  enabled?: boolean;
  debug?: boolean;
  autoBindAccount?: boolean;
  autoInitThirdPush?: boolean;
  requestAndroidNotificationPermission?: boolean;
  showNoticeWhenForeground?: boolean;
  android?: Partial<AliyunPushPlatformConfig>;
  ios?: Partial<AliyunPushIOSConfig>;
  vendors?: AliyunPushVendorConfig;
  androidChannel?: CreateAndroidChannelParams | null;
}

export interface AliyunPushInitContext {
  deviceId: string | null;
  apnsDeviceToken: string | null;
  initResult: PushResult;
  thirdPushResult: PushResult | null;
}

export interface AliyunPushCallbacks {
  onNotification?: (event: unknown) => void;
  onMessage?: (event: unknown) => void;
  onNotificationOpened?: (event: unknown) => void;
  onNotificationRemoved?: (event: unknown) => void;
  onNotificationReceivedInApp?: (event: unknown) => void;
  onNotificationClickedWithNoAction?: (event: unknown) => void;
  onChannelOpen?: (event: unknown) => void;
  onRegisterDeviceTokenSuccess?: (event: unknown) => void;
  onRegisterDeviceTokenFailed?: (event: unknown) => void;
}

export interface AliyunPushContextValue {
  isConfigured: boolean;
  isInitialized: boolean;
  deviceId: string | null;
  apnsDeviceToken: string | null;
  error: Error | null;
  refresh: () => Promise<AliyunPushInitContext | null>;
}

export interface AliyunPushProviderProps<UserType = { id?: string | null }> {
  children: ReactNode;
  config: AliyunPushRuntimeConfig;
  user?: UserType | null;
  isLoggedIn?: boolean;
  accountResolver?: (user: UserType | null) => string | null;
  autoNavigateOnNotificationOpen?: boolean;
  openNotificationTarget?: (event: unknown) => Promise<string | null> | string | null;
  onInitSuccess?: (context: AliyunPushInitContext) => void;
  onInitError?: (error: Error) => void;
  onNotificationReceive?: (event: unknown) => void;
  onMessage?: (event: unknown) => void;
  onNotificationOpen?: (event: unknown) => void;
  onNotificationRemoved?: (event: unknown) => void;
  onNotificationReceivedInApp?: (event: unknown) => void;
  onNotificationClickedWithNoAction?: (event: unknown) => void;
  onRegisterDeviceTokenSuccess?: (event: unknown) => void;
  onRegisterDeviceTokenFailed?: (event: unknown) => void;
  onChannelOpen?: (event: unknown) => void;
}

export type AliyunPushLoggerMethod = (message: string, data?: unknown, namespace?: string) => void;

export interface AliyunPushLogger {
  debug: AliyunPushLoggerMethod;
  info: AliyunPushLoggerMethod;
  warn: AliyunPushLoggerMethod;
  error: AliyunPushLoggerMethod;
}
