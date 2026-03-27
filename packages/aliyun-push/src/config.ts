import type {
  AliyunPushIOSConfig,
  AliyunPushPlatformConfig,
  AliyunPushRuntimeConfig,
  AliyunPushVendorConfig,
} from './types';

export const defaultAliyunPushConfig: Required<
  Pick<
    AliyunPushRuntimeConfig,
    | 'enabled'
    | 'debug'
    | 'autoBindAccount'
    | 'autoInitThirdPush'
    | 'requestAndroidNotificationPermission'
    | 'showNoticeWhenForeground'
  >
> & {
  android: Partial<AliyunPushPlatformConfig>;
  ios: Partial<AliyunPushIOSConfig>;
  vendors: AliyunPushVendorConfig;
  androidChannel: AliyunPushRuntimeConfig['androidChannel'];
} = {
  enabled: false,
  debug: false,
  autoBindAccount: true,
  autoInitThirdPush: true,
  requestAndroidNotificationPermission: true,
  showNoticeWhenForeground: true,
  android: {},
  ios: {},
  vendors: {},
  androidChannel: null,
};

export function normalizeAliyunPushConfig(
  config: AliyunPushRuntimeConfig | null | undefined
): AliyunPushRuntimeConfig {
  return {
    ...defaultAliyunPushConfig,
    ...config,
    android: {
      ...defaultAliyunPushConfig.android,
      ...(config?.android ?? {}),
    },
    ios: {
      ...defaultAliyunPushConfig.ios,
      ...(config?.ios ?? {}),
    },
    vendors: {
      ...defaultAliyunPushConfig.vendors,
      ...(config?.vendors ?? {}),
    },
    androidChannel: config?.androidChannel ?? defaultAliyunPushConfig.androidChannel,
  };
}

export function hasVendorPushConfig(config: AliyunPushRuntimeConfig): boolean {
  return Object.values(config.vendors ?? {}).some(
    value => typeof value === 'string' && value.trim().length > 0
  );
}

export function getCurrentPlatformCredentials(
  platform: 'android' | 'ios',
  config: AliyunPushRuntimeConfig
) {
  const target = platform === 'ios' ? config.ios : config.android;
  const appKey = target?.appKey?.trim();
  const appSecret = target?.appSecret?.trim();

  if (!appKey || !appSecret) {
    return null;
  }

  return { appKey, appSecret };
}
