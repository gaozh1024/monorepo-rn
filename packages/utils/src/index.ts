/**
 * @panther-expo/utils - React Native 通用工具函数包
 *
 * 提供 RN 开发中常用的工具函数：
 * - 表单验证：与 Zod 集成的验证错误处理
 * - 颜色工具：颜色格式转换函数
 *
 * @example
 * ```typescript
 * import { getValidationErrors, hexToRgb } from '@panther-expo/utils';
 *
 * // 处理验证错误
 * const errors = getValidationErrors(zodError);
 *
 * // 颜色转换
 * const rgb = hexToRgb('#f38b32');
 * ```
 */

export * from './validation';
export * from './color';
export * from './color-palette';
export * from './date';
