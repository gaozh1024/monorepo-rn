import Constants from 'expo-constants';

export const APP_NAME = Constants.expoConfig?.name ?? 'RN Starter';
export const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export const ENV = {
  isDev: __DEV__,
  isProd: !__DEV__,
};

export const API_BASE_URL = ENV.isDev ? 'http://localhost:3000/api' : 'https://api.example.com/api';

export const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data',
  SETTINGS: '@app_settings',
} as const;
