import * as SecureStore from 'expo-secure-store';
import { setStorageAdapter } from '@gaozh1024/rn-kit';

let initialized = false;

const secureStorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[Storage] Failed to read key "${key}" from SecureStore.`, error);
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn(`[Storage] Failed to persist key "${key}" to SecureStore.`, error);
      throw error;
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`[Storage] Failed to delete key "${key}" from SecureStore.`, error);
    }
  },
};

export function setupStorage() {
  if (initialized) {
    return;
  }

  setStorageAdapter(secureStorageAdapter);
  initialized = true;
}
