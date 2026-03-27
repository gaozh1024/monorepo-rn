/**
 * 深度合并两个对象
 *
 * 递归合并 source 对象的属性到 target 对象，嵌套对象也会被合并
 *
 * @param target - 目标对象
 * @param source - 源对象
 * @returns 合并后的新对象
 * @example
 * ```ts
 * deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 })
 * // => { a: 1, b: { x: 1, y: 2 }, c: 3 }
 * ```
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      (result as any)[key] = deepMerge(result[key] || {}, source[key] as any);
    } else {
      (result as any)[key] = source[key];
    }
  }
  return result;
}

/**
 * 从对象中选取指定的属性
 *
 * @param obj - 源对象
 * @param keys - 要选取的属性键数组
 * @returns 仅包含指定属性的新对象
 * @example
 * ```ts
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])
 * // => { a: 1, c: 3 }
 * ```
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

/**
 * 从对象中排除指定的属性
 *
 * @param obj - 源对象
 * @param keys - 要排除的属性键数组
 * @returns 不包含指定属性的新对象
 * @example
 * ```ts
 * omit({ a: 1, b: 2, c: 3 }, ['b'])
 * // => { a: 1, c: 3 }
 * ```
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) delete (result as any)[key];
  return result;
}
