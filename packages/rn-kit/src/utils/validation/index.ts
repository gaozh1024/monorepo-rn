import { ZodError } from 'zod';

/**
 * 将 Zod 验证错误转换为字段错误映射对象
 *
 * @param error - ZodError 实例
 * @returns 字段路径到错误消息的映射对象
 * @example
 * ```ts
 * const schema = z.object({
 *   email: z.string().email(),
 *   age: z.number().min(18)
 * });
 *
 * const result = schema.safeParse({ email: 'invalid', age: 16 });
 * if (!result.success) {
 *   getValidationErrors(result.error)
 *   // => { email: 'Invalid email', age: 'Number must be greater than or equal to 18' }
 * }
 * ```
 */
export function getValidationErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  }
  return errors;
}

/**
 * 验证邮箱地址格式是否有效
 *
 * @param email - 要验证的邮箱地址
 * @returns 是否为有效的邮箱格式
 * @example
 * ```ts
 * isValidEmail('user@example.com') // => true
 * isValidEmail('invalid-email') // => false
 * ```
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 验证中国手机号码格式是否有效
 *
 * 支持以 1 开头，第二位为 3-9 的 11 位手机号码
 *
 * @param phone - 要验证的手机号码
 * @returns 是否为有效的手机号码格式
 * @example
 * ```ts
 * isValidPhone('13800138000') // => true
 * isValidPhone('12345678901') // => false
 * ```
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}
