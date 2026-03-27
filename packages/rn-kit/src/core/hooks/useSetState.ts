import { useState, useCallback } from 'react';

export function useSetState<T extends Record<string, any>>(
  initialState: T
): [T, (patch: Partial<T> | ((prev: T) => Partial<T>)) => void, () => void] {
  const [state, setState] = useState<T>(initialState);

  const setMergeState = useCallback((patch: Partial<T> | ((prev: T) => Partial<T>)) => {
    setState(prev => ({
      ...prev,
      ...(typeof patch === 'function' ? patch(prev) : patch),
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return [state, setMergeState, resetState];
}
