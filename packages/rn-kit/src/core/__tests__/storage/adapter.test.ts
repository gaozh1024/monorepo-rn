import { afterEach, describe, expect, it, vi } from 'vitest';
import { getStorageAdapter, resetStorageAdapter, setStorageAdapter, storage } from '../../storage';
import { MemoryStorage } from '../../storage/memory-storage';

describe('storage adapter', () => {
  afterEach(() => {
    resetStorageAdapter();
  });

  it('默认应该使用 MemoryStorage', () => {
    expect(getStorageAdapter()).toBeInstanceOf(MemoryStorage);
  });

  it('应该允许在运行时注入自定义 storage adapter', async () => {
    const adapter = {
      getItem: vi.fn(async (key: string) => (key === 'token' ? 'persisted-token' : null)),
      setItem: vi.fn(async () => {}),
      removeItem: vi.fn(async () => {}),
    };

    setStorageAdapter(adapter);

    await storage.setItem('token', 'persisted-token');
    await expect(storage.getItem('token')).resolves.toBe('persisted-token');
    await storage.removeItem('token');

    expect(adapter.setItem).toHaveBeenCalledWith('token', 'persisted-token');
    expect(adapter.getItem).toHaveBeenCalledWith('token');
    expect(adapter.removeItem).toHaveBeenCalledWith('token');
    expect(getStorageAdapter()).toBe(adapter);
  });

  it('重置后应该恢复到默认 MemoryStorage', async () => {
    const adapter = {
      getItem: vi.fn(async () => 'custom'),
      setItem: vi.fn(async () => {}),
      removeItem: vi.fn(async () => {}),
    };

    setStorageAdapter(adapter);
    resetStorageAdapter();

    expect(getStorageAdapter()).toBeInstanceOf(MemoryStorage);

    await storage.setItem('key', 'value');
    await expect(storage.getItem('key')).resolves.toBe('value');
  });
});
