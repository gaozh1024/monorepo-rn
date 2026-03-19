import { storage } from '@gaozh1024/rn-kit';
import { STORAGE_KEYS } from '../bootstrap/constants';
import type { User } from './schemas';

/**
 * Session 管理
 */
export const session = {
  /**
   * 获取 Token
   */
  async getToken(): Promise<string | null> {
    return storage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * 设置 Token
   */
  async setToken(token: string): Promise<void> {
    await storage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  /**
   * 清除 Token
   */
  async clearToken(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * 获取用户信息
   */
  async getUser(): Promise<User | null> {
    const userStr = await storage.getItem(STORAGE_KEYS.USER_INFO);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * 设置用户信息
   */
  async setUser(user: User): Promise<void> {
    await storage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
  },

  /**
   * 清除用户信息
   */
  async clearUser(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.USER_INFO);
  },

  /**
   * 清除所有 Session
   */
  async clearAll(): Promise<void> {
    await this.clearToken();
    await this.clearUser();
  },

  /**
   * 是否已登录
   */
  async isLoggedIn(): Promise<boolean> {
    return !!(await this.getToken());
  },
};
