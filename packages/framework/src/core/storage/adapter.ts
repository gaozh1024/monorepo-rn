import { MemoryStorage } from './memory-storage';
import type { StorageAdapter } from './types';

let currentStorageAdapter: StorageAdapter = new MemoryStorage();

export function setStorageAdapter(adapter: StorageAdapter) {
  currentStorageAdapter = adapter;
}

export function getStorageAdapter() {
  return currentStorageAdapter;
}

export function resetStorageAdapter() {
  currentStorageAdapter = new MemoryStorage();
}

export const storage: StorageAdapter = {
  getItem(key) {
    return currentStorageAdapter.getItem(key);
  },
  setItem(key, value) {
    return currentStorageAdapter.setItem(key, value);
  },
  removeItem(key) {
    return currentStorageAdapter.removeItem(key);
  },
};
