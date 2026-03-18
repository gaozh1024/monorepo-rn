/**
 * @fileoverview API 类型定义模块
 * @module core/api/types
 * @description 定义 API 端点和配置的核心类型接口
 */

import { z } from 'zod';

/**
 * API 端点配置接口
 * @template TInput - 请求输入数据的类型
 * @template TOutput - 响应输出数据的类型
 * @example
 * ```typescript
 * const userEndpoint: ApiEndpointConfig<{ id: number }, User> = {
 *   method: 'GET',
 *   path: '/users/:id',
 *   input: z.object({ id: z.number() }),
 *   output: z.instanceof(User)
 * };
 * ```
 */
export interface ApiEndpointConfig<TInput, TOutput> {
  /** HTTP 请求方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** API 路径（相对于 baseURL） */
  path: string;
  /** 请求数据的 Zod 校验模式（可选） */
  input?: z.ZodSchema<TInput>;
  /** 响应数据的 Zod 校验模式（可选） */
  output?: z.ZodSchema<TOutput>;
}

/**
 * API 配置接口
 * @template TEndpoints - 端点配置映射类型
 * @example
 * ```typescript
 * const config: ApiConfig<typeof myEndpoints> = {
 *   baseURL: 'https://api.example.com/v1',
 *   endpoints: {
 *     getUser: { method: 'GET', path: '/users/:id' },
 *     createUser: { method: 'POST', path: '/users' }
 *   }
 * };
 * ```
 */
export interface ApiConfig<TEndpoints extends Record<string, ApiEndpointConfig<any, any>>> {
  /** API 基础 URL */
  baseURL: string;
  /** 端点配置映射 */
  endpoints: TEndpoints;
}
