/**
 * 截断字符串，超出指定长度时添加后缀
 *
 * @param str - 要截断的字符串
 * @param length - 目标长度（包含后缀长度）
 * @param suffix - 截断后添加的后缀，默认为 '...'
 * @returns 截断后的字符串
 * @example
 * ```ts
 * truncate('Hello World', 8)
 * // => 'Hello...'
 *
 * truncate('Hello World', 8, '>>')
 * // => 'Hello >>'
 *
 * truncate('Hi', 8)
 * // => 'Hi'
 * ```
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * 将字符串转换为 URL 友好的 slug 格式
 *
 * 移除特殊字符，将空格转换为连字符，合并多个连字符
 *
 * @param str - 要转换的字符串
 * @returns slug 格式的字符串
 * @example
 * ```ts
 * slugify('Hello World!')
 * // => 'hello-world'
 *
 * slugify('This is a -- test!!!')
 * // => 'this-is-a-test'
 * ```
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * 将字符串首字母大写
 *
 * @param str - 要转换的字符串
 * @returns 首字母大写的字符串
 * @example
 * ```ts
 * capitalize('hello world')
 * // => 'Hello world'
 *
 * capitalize('HELLO')
 * // => 'HELLO'
 * ```
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
