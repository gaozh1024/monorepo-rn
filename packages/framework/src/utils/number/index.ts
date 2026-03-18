/**
 * 将数字格式化为中文地区的字符串表示
 *
 * 使用千分位分隔符格式化数字
 *
 * @param num - 要格式化的数字
 * @returns 格式化后的字符串
 * @example
 * ```ts
 * formatNumber(1234567.89)
 * // => '1,234,567.89'
 *
 * formatNumber(1000)
 * // => '1,000'
 * ```
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/**
 * 将数字格式化为货币字符串
 *
 * @param num - 要格式化的数字
 * @param currency - 货币符号，默认为 '¥'
 * @returns 格式化后的货币字符串
 * @example
 * ```ts
 * formatCurrency(1234.5)
 * // => '¥1,234.5'
 *
 * formatCurrency(1234.5, '$')
 * // => '$1,234.5'
 * ```
 */
export function formatCurrency(num: number, currency: string = '¥'): string {
  return `${currency}${formatNumber(num)}`;
}

/**
 * 将小数格式化为百分比字符串
 *
 * @param num - 要格式化的小数（如 0.25 表示 25%）
 * @param decimals - 小数位数，默认为 2
 * @returns 格式化后的百分比字符串
 * @example
 * ```ts
 * formatPercent(0.25)
 * // => '25.00%'
 *
 * formatPercent(0.25, 0)
 * // => '25%'
 *
 * formatPercent(0.1234, 1)
 * // => '12.3%'
 * ```
 */
export function formatPercent(num: number, decimals: number = 2): string {
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * 将数字限制在指定的最小值和最大值之间
 *
 * @param num - 要限制的数字
 * @param min - 最小值
 * @param max - 最大值
 * @returns 限制后的数字
 * @example
 * ```ts
 * clamp(50, 0, 100) // => 50
 * clamp(150, 0, 100) // => 100
 * clamp(-10, 0, 100) // => 0
 * ```
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
