import { useState, useEffect, useCallback } from 'react';
import { storage } from '../storage';

/**
 * 本地存储同步 Hook
 * @param key - 存储键名
 * @param defaultValue - 默认值
 * @returns [值, 设置值, 删除值]
 *
 * @example
 * ```tsx
 * const [darkMode, setDarkMode] = useStorage('settings.darkMode', false);
 *
 * <Switch value={darkMode} onValueChange={setDarkMode} />
 * ```
 */
export function useStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const [, setIsLoaded] = useState(false);

  // 初始加载
  useEffect(() => {
    const loadValue = async () => {
      try {
        const stored = await storage.getItem(key);
        if (stored !== null) {
          setValue(JSON.parse(stored));
        }
      } catch (error) {
        console.warn(`Failed to load storage key "${key}":`, error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadValue();
  }, [key]);

  // 设置值
  const setStoredValue = useCallback(
    async (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        await storage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Failed to save storage key "${key}":`, error);
      }
    },
    [key, value]
  );

  // 删除值
  const removeValue = useCallback(async () => {
    try {
      setValue(defaultValue);
      await storage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove storage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue];
}
