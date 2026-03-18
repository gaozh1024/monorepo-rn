/**
 * @fileoverview 内存存储实现模块
 * @module core/storage/memory-storage
 * @description 提供基于内存的键值存储实现，适用于测试环境或不需要持久化的场景
 */

/**
 * 内存存储类
 * @description 使用 Map 实现的异步键值存储，数据仅在内存中保存，应用重启后丢失
 * @example
 * ```typescript
 * const storage = new MemoryStorage();
 *
 * // 存储数据
 * await storage.setItem('user', JSON.stringify({ id: 1, name: 'John' }));
 *
 * // 读取数据
 * const userData = await storage.getItem('user');
 * console.log(userData); // '{"id":1,"name":"John"}'
 *
 * // 删除数据
 * await storage.removeItem('user');
 *
 * // 检查数据是否存在
 * const exists = await storage.getItem('user'); // null
 * ```
 */
export class MemoryStorage {
  /** 内部存储的 Map 实例 */
  private memory = new Map<string, string>();

  /**
   * 存储键值对
   * @param key - 存储键名
   * @param value - 要存储的字符串值
   * @returns 解析为 void 的 Promise
   */
  async setItem(key: string, value: string): Promise<void> {
    this.memory.set(key, value);
  }

  /**
   * 根据键名获取值
   * @param key - 存储键名
   * @returns 存储的字符串值，如果不存在则返回 null
   */
  async getItem(key: string): Promise<string | null> {
    return this.memory.get(key) ?? null;
  }

  /**
   * 删除指定键名的存储项
   * @param key - 要删除的键名
   * @returns 解析为 void 的 Promise
   */
  async removeItem(key: string): Promise<void> {
    this.memory.delete(key);
  }
}

/**
 * 默认的内存存储实例
 * @description 全局共享的内存存储单例，可用于跨模块的简单数据共享
 * @example
 * ```typescript
 * import { storage } from './memory-storage';
 *
 * // 模块 A
 * await storage.setItem('session', 'abc123');
 *
 * // 模块 B
 * const session = await storage.getItem('session');
 * console.log(session); // 'abc123'
 * ```
 */
export const storage = new MemoryStorage();
