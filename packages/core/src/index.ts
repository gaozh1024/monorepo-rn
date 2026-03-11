/**
 * @panther-expo/core - React Native 核心基础设施包
 *
 * 提供 RN 应用开发的基础能力：
 * - API 客户端：封装 HTTP 请求、错误处理、认证管理
 * - 安全存储：基于 expo-secure-store 的加密存储封装
 * - 日志管理：统一的日志记录和级别控制
 *
 * @example
 * ```typescript
 * import { BaseAPI, createSecureStorage, logger, createLogger } from '@panther-expo/core';
 *
 * // 创建 API 客户端
 * const api = new BaseAPI({ baseURL: 'https://api.example.com' });
 *
 * // 创建存储工具
 * const storage = createSecureStorage({ TOKEN: 'auth_token' });
 *
 * // 使用 logger
 * const log = createLogger('App');
 * log.info('应用启动');
 * ```
 */

export * from './api';
export * from './storage';
export * from './query';
export * from './logger';
