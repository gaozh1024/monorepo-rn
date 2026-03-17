import { useEffect, useState } from 'react';

/**
 * 防抖 Hook
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒），默认 500ms
 * @returns 防抖后的值
 *
 * @example
 * ```tsx
 * const [keyword, setKeyword] = useState('');
 * const debouncedKeyword = useDebounce(keyword, 500);
 *
 * // 使用 debouncedKeyword 进行搜索
 * useEffect(() => {
 *   search(debouncedKeyword);
 * }, [debouncedKeyword]);
 * ```
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
