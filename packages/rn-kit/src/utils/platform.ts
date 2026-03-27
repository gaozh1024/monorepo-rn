/**
 * 检查当前是否为开发环境
 *
 * 通过检查 process.env.NODE_ENV 是否为 'development' 来判断
 *
 * @returns 如果当前是开发环境返回 true，否则返回 false
 * @example
 * ```ts
 * if (isDevelopment()) {
 *   console.log('Running in development mode');
 * }
 * ```
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
