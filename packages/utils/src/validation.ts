import type { z } from 'zod';

/**
 * 获取验证错误消息
 * @param error Zod 验证错误对象
 * @returns 字段错误映射对象
 */
export const getValidationErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.issues.forEach(err => {
    if (err.path.length > 0) {
      const field = err.path[0] as string;
      errors[field] = err.message;
    }
  });
  return errors;
};

/**
 * 检查表单是否有错误
 * @param errors 字段错误映射对象
 * @returns 是否存在错误
 */
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * 获取指定字段的错误消息
 * @param errors 字段错误映射对象
 * @param field 字段名称
 * @returns 错误消息或 undefined
 */
export const getFieldError = (
  errors: Record<string, string>,
  field: string
): string | undefined => {
  return errors[field];
};
