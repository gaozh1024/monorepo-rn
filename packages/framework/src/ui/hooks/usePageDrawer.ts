import { useCallback, useState } from 'react';

export interface UsePageDrawerReturn {
  /** 当前是否打开 */
  visible: boolean;
  /** 打开抽屉 */
  open: () => void;
  /** 关闭抽屉 */
  close: () => void;
  /** 切换抽屉开关状态 */
  toggle: () => void;
  /** 直接设置抽屉可见状态 */
  setVisible: (visible: boolean) => void;
}

/**
 * 页面级抽屉状态管理 Hook
 *
 * @param defaultVisible - 默认是否打开
 * @returns 抽屉可见状态和控制方法
 *
 * @example
 * ```tsx
 * const drawer = usePageDrawer();
 *
 * <AppButton onPress={drawer.open}>打开筛选</AppButton>
 * <PageDrawer visible={drawer.visible} onClose={drawer.close} />
 * ```
 */
export function usePageDrawer(defaultVisible = false): UsePageDrawerReturn {
  const [visible, setVisibleState] = useState(defaultVisible);

  const open = useCallback(() => {
    setVisibleState(true);
  }, []);

  const close = useCallback(() => {
    setVisibleState(false);
  }, []);

  const toggle = useCallback(() => {
    setVisibleState(current => !current);
  }, []);

  const setVisible = useCallback((nextVisible: boolean) => {
    setVisibleState(nextVisible);
  }, []);

  return {
    visible,
    open,
    close,
    toggle,
    setVisible,
  };
}
