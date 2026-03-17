import { useEffect, useRef, useState } from 'react';

/**
 * 节流 Hook
 * @param value - 需要节流的值
 * @param delay - 节流间隔（毫秒），默认 200ms
 * @returns 节流后的值
 *
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0);
 * const throttledScrollY = useThrottle(scrollY, 200);
 *
 * // 使用 throttledScrollY 更新 UI（如头部透明度）
 * const headerOpacity = Math.min(throttledScrollY / 200, 1);
 * ```
 */
export function useThrottle<T>(value: T, delay = 200): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdatedRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeElapsed = now - lastUpdatedRef.current;

    if (timeElapsed >= delay) {
      lastUpdatedRef.current = now;
      setThrottledValue(value);
      return undefined;
    } else {
      const timer = setTimeout(() => {
        lastUpdatedRef.current = Date.now();
        setThrottledValue(value);
      }, delay - timeElapsed);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, delay]);

  return throttledValue;
}
