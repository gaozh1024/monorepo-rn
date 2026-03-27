import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名，自动处理类名冲突
 *
 * 使用 clsx 进行条件类名合并，使用 tailwind-merge 解决 Tailwind 类名冲突
 *
 * @param inputs - 要合并的类名数组，支持字符串、对象、数组等多种格式
 * @returns 合并后的类名字符串
 * @example
 * ```ts
 * cn('px-4 py-2', 'bg-blue-500', { 'text-white': true })
 * // => 'px-4 py-2 bg-blue-500 text-white'
 *
 * cn('px-4', 'px-6') // 后者覆盖前者
 * // => 'px-6'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { clsx, type ClassValue, twMerge };
