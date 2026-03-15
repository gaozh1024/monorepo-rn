import { createSecureStorage } from '@panther-expo/core/storage';

const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data',
  SETTINGS: '@app_settings',
} as const;

export const secureStorage = {
  ...createSecureStorage(STORAGE_KEYS),

  // Token 快捷方法
  getToken: () => createSecureStorage(STORAGE_KEYS).getString(STORAGE_KEYS.TOKEN),
  setToken: (token: string) =>
    createSecureStorage(STORAGE_KEYS).setString(STORAGE_KEYS.TOKEN, token),
  removeToken: () => createSecureStorage(STORAGE_KEYS).delete(STORAGE_KEYS.TOKEN),

  // User 快捷方法
  getUser: async () => {
    const data = await createSecureStorage(STORAGE_KEYS).getObject(STORAGE_KEYS.USER);
    return data as { id: string; name: string; email: string } | null;
  },
  setUser: (user: object) => createSecureStorage(STORAGE_KEYS).setObject(STORAGE_KEYS.USER, user),
  removeUser: () => createSecureStorage(STORAGE_KEYS).delete(STORAGE_KEYS.USER),

  // 清除所有
  clearAll: () => createSecureStorage(STORAGE_KEYS).clearAll(),
};

export type StorageKeys = keyof typeof STORAGE_KEYS;
