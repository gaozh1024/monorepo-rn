import { useState, useEffect, useCallback } from 'react';
import { secureStorage } from '@/storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await secureStorage.getToken();
      const userData = await secureStorage.getUser();

      if (token && userData) {
        setState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    // TODO: 替换为实际 API 调用
    const mockUser = {
      id: '1',
      name: '测试用户',
      email,
    };

    await secureStorage.setToken('mock-token');
    await secureStorage.setUser(mockUser);

    setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await secureStorage.clearAll();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    login,
    logout,
  };
}
