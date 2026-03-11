import * as SecureStore from 'expo-secure-store';

/** 存储键配置接口 */
export interface StorageKeyConfig {
  [key: string]: string;
}

/**
 * 创建安全存储工具
 * @param config 存储键配置
 * @returns 存储工具对象
 */
export const createSecureStorage = (config: StorageKeyConfig) => {
  const keys = config;

  return {
    /**
     * 保存字符串
     * @param key 存储键
     * @param value 存储值
     */
    setString: async (key: string, value: string): Promise<void> => {
      await SecureStore.setItemAsync(key, value);
    },

    /**
     * 获取字符串
     * @param key 存储键
     * @returns 存储值，不存在则返回 null
     */
    getString: async (key: string): Promise<string | null> => {
      return await SecureStore.getItemAsync(key);
    },

    /**
     * 保存数字
     * @param key 存储键
     * @param value 存储值
     */
    setNumber: async (key: string, value: number): Promise<void> => {
      await SecureStore.setItemAsync(key, value.toString());
    },

    /**
     * 获取数字
     * @param key 存储键
     * @returns 存储值，不存在则返回 null
     */
    getNumber: async (key: string): Promise<number | null> => {
      const value = await SecureStore.getItemAsync(key);
      return value ? parseInt(value, 10) : null;
    },

    /**
     * 保存布尔值
     * @param key 存储键
     * @param value 存储值
     */
    setBoolean: async (key: string, value: boolean): Promise<void> => {
      await SecureStore.setItemAsync(key, value.toString());
    },

    /**
     * 获取布尔值
     * @param key 存储键
     * @returns 存储值，不存在则返回 null
     */
    getBoolean: async (key: string): Promise<boolean | null> => {
      const value = await SecureStore.getItemAsync(key);
      if (value === 'true') return true;
      if (value === 'false') return false;
      return null;
    },

    /**
     * 保存对象（会自动序列化为 JSON）
     * @param key 存储键
     * @param value 存储值
     */
    setObject: async <T>(key: string, value: T): Promise<void> => {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    },

    /**
     * 获取对象（会自动反序列化 JSON）
     * @param key 存储键
     * @returns 存储值，不存在或解析失败则返回 null
     */
    getObject: async <T>(key: string): Promise<T | null> => {
      const value = await SecureStore.getItemAsync(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    },

    /**
     * 删除指定键的值
     * @param key 存储键
     */
    delete: async (key: string): Promise<void> => {
      await SecureStore.deleteItemAsync(key);
    },

    /**
     * 检查键是否存在
     * @param key 存储键
     * @returns 是否存在
     */
    contains: async (key: string): Promise<boolean> => {
      const value = await SecureStore.getItemAsync(key);
      return value !== null;
    },

    /**
     * 清空所有配置的数据
     */
    clearAll: async (): Promise<void> => {
      const keyValues = Object.values(keys);
      await Promise.all(keyValues.map(key => SecureStore.deleteItemAsync(key)));
    },

    /** 存储键名 */
    keys,
  };
};

/** 存储工具类型 */
export type SecureStorage = ReturnType<typeof createSecureStorage>;
