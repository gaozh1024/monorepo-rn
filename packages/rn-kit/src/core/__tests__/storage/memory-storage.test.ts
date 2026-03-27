import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryStorage } from '../../storage/memory-storage';

describe('MemoryStorage', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it('应该存储和读取字符串', async () => {
    await storage.setItem('key', 'value');
    const value = await storage.getItem('key');
    expect(value).toBe('value');
  });

  it('应该返回null当key不存在', async () => {
    const value = await storage.getItem('non-existent');
    expect(value).toBeNull();
  });

  it('应该删除项目', async () => {
    await storage.setItem('key', 'value');
    await storage.removeItem('key');
    const value = await storage.getItem('key');
    expect(value).toBeNull();
  });

  it('应该更新已存在的值', async () => {
    await storage.setItem('key', 'value1');
    await storage.setItem('key', 'value2');
    const value = await storage.getItem('key');
    expect(value).toBe('value2');
  });
});
