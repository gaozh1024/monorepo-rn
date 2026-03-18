/**
 * 日期格式化选项
 */
export interface DateFormatOptions {
  /** 年份格式，如 'yyyy' */
  year?: string;
  /** 月份格式，如 'MM' */
  month?: string;
  /** 日期格式，如 'dd' */
  day?: string;
}

/**
 * 将日期格式化为指定格式的字符串
 *
 * @param date - 要格式化的日期对象
 * @param format - 格式化模板，支持 'yyyy'（年）、'MM'（月）、'dd'（日），默认为 'yyyy-MM-dd'
 * @returns 格式化后的日期字符串
 * @example
 * ```ts
 * formatDate(new Date('2024-01-15'))
 * // => '2024-01-15'
 *
 * formatDate(new Date('2024-01-15'), 'yyyy年MM月dd日')
 * // => '2024年01月15日'
 * ```
 */
export function formatDate(date: Date, format: string = 'yyyy-MM-dd'): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return format.replace('yyyy', String(year)).replace('MM', month).replace('dd', day);
}

/**
 * 格式化日期为相对时间（如"刚刚"、"5分钟前"等）
 *
 * @param date - 要格式化的日期对象
 * @returns 相对时间字符串
 * @example
 * ```ts
 * formatRelativeTime(new Date()) // => '刚刚'
 * formatRelativeTime(new Date(Date.now() - 5 * 60000)) // => '5分钟前'
 * formatRelativeTime(new Date(Date.now() - 2 * 3600000)) // => '2小时前'
 * formatRelativeTime(new Date(Date.now() - 3 * 86400000)) // => '3天前'
 * formatRelativeTime(new Date('2023-01-01')) // => '2023-01-01'
 * ```
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return formatDate(date);
}
