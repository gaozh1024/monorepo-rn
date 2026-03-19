import { memoryStorage } from '@gaozh1024/rn-kit';
import { STORAGE_KEYS } from '../bootstrap/constants';
import type { User } from './schemas';

/**
 * Session 管理
 */
export const session = {
  /**
   * 获取 Token
   */
  getToken(): string | null {
    return memoryStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * 设置 Token
   */
  setToken(token: string): void {
    memoryStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  /**
   * 清除 Token
   */
  clearToken(): void {
    memoryStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * 获取用户信息
   */
  getUser(): User | null {
    const userStr = memoryStorage.getItem(STORAGE_KEYS.USER_INFO);
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
  setUser(user: User): void {
    memoryStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
  },

  /**
   * 清除用户信息
   */
  clearUser(): void {
    memoryStorage.removeItem(STORAGE_KEYS.USER_INFO);
  },

  /**
   * 清除所有 Session
   */
  clearAll(): void {
    this.clearToken();
    this.clearUser();
  },

  /**
   * 是否已登录
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  },
};
