// API 响应包装
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

// 分页响应
export interface PagedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 性别枚举
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// 用户类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  gender?: Gender;
  createdAt?: string;
  updatedAt?: string;
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

// 注册请求
export interface RegisterRequest extends LoginRequest {
  name: string;
  confirmPassword: string;
}
