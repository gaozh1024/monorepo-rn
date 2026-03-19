import { create } from 'zustand';
import { session } from '../data/session';
import type { User } from '../data/schemas';

/**
 * Session Store 状态
 */
interface SessionState {
  // 状态
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;

  // 动作
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  restoreSession: () => void;
}

/**
 * Session Store
 * 管理登录态、当前用户、token
 */
export const useSessionStore = create<SessionState>(set => ({
  // 初始状态
  isLoggedIn: false,
  user: null,
  token: null,
  isLoading: true,

  // 登录
  login: (token, user) => {
    session.setToken(token);
    session.setUser(user);
    set({ isLoggedIn: true, token, user, isLoading: false });
  },

  // 登出
  logout: () => {
    session.clearAll();
    set({ isLoggedIn: false, token: null, user: null, isLoading: false });
  },

  // 更新用户信息
  updateUser: userData => {
    set(state => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...userData };
      session.setUser(newUser);
      return { user: newUser };
    });
  },

  // 恢复 Session
  restoreSession: () => {
    const token = session.getToken();
    const user = session.getUser();
    if (token && user) {
      set({ isLoggedIn: true, token, user, isLoading: false });
    } else {
      set({ isLoggedIn: false, token: null, user: null, isLoading: false });
    }
  },
}));
