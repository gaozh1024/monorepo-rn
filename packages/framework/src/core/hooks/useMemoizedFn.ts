import { useRef, useCallback } from 'react';

export function useMemoizedFn<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const memoizedFn = useCallback(
    ((...args: any[]) => {
      return fnRef.current(...args);
    }) as T,
    []
  );

  return memoizedFn;
}
