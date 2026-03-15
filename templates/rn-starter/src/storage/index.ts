import { createSecureStorage } from '@panther-expo/core/storage';

const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data',
  SETTINGS: '@app_settings',
} as const;

// 单例模式：只创建一次 storage 实例
const storage = createSecureStorage(STORAGE_KEYS);

export const secureStorage = {
  ...storage,

  // Token 快捷方法
  getToken: () => storage.getString(STORAGE_KEYS.TOKEN),
  setToken: (token: string) => storage.setString(STORAGE_KEYS.TOKEN, token),
  removeToken: () => storage.delete(STORAGE_KEYS.TOKEN),

  // User 快捷方法
  getUser: async () => {
    const data = await storage.getObject(STORAGE_KEYS.USER);
    return data as { id: string; name: string; email: string } | null;
  },
  setUser: (user: object) => storage.setObject(STORAGE_KEYS.USER, user),
  removeUser: () => storage.delete(STORAGE_KEYS.USER),

  // 清除所有
  clearAll: () => storage.clearAll(),
};

export type StorageKeys = keyof typeof STORAGE_KEYS;
