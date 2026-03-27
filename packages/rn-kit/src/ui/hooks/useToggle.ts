import { useCallback, useState } from 'react';

export interface UseToggleActions {
  /** 切换布尔值 */
  toggle: () => void;
  /** 设置为指定值 */
  set: (value: boolean) => void;
  /** 设置为 true */
  setTrue: () => void;
  /** 设置为 false */
  setFalse: () => void;
}

/**
 * 布尔值切换 Hook
 * @param defaultValue - 默认值
 * @returns [当前值, 操作集合]
 *
 * @example
 * ```tsx
 * const [visible, { toggle, setTrue, setFalse }] = useToggle(false);
 *
 * <Button onPress={toggle}>{visible ? '隐藏' : '显示'}</Button>
 * {visible && <Modal onClose={setFalse} />}
 * ```
 */
export function useToggle(defaultValue = false): [boolean, UseToggleActions] {
  const [value, setValue] = useState(defaultValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const set = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, { toggle, set, setTrue, setFalse }];
}
