import { BaseAPI } from '@panther-expo/core/api';
import type { ApiResponse, LoginRequest, RegisterRequest, User } from '@/types';

class AuthAPI extends BaseAPI {
  constructor() {
    super({
      baseURL: process.env.EXPO_PUBLIC_API_URL,
    });
  }

  async login(data: LoginRequest): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.post('/auth/login', data);
  }

  async register(data: RegisterRequest): Promise<ApiResponse<{ token: string; user: User }>> {
    return this.post('/auth/register', data);
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.get('/auth/profile');
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.post('/auth/logout');
  }
}

export const authAPI = new AuthAPI();
