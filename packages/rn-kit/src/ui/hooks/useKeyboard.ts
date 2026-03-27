import { useEffect, useState, useCallback } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export interface UseKeyboardReturn {
  /** 键盘是否显示 */
  visible: boolean;
  /** 键盘高度 */
  height: number;
  /** 关闭键盘 */
  dismiss: () => void;
}

/**
 * 键盘状态监听 Hook
 * @returns 键盘状态和控制方法
 *
 * @example
 * ```tsx
 * const { visible, height, dismiss } = useKeyboard();
 *
 * <ScrollView contentContainerStyle={{ paddingBottom: visible ? height : 0 }}>
 *   {\/* 内容 *\/}
 * </ScrollView>
 * ```
 */
export function useKeyboard(): UseKeyboardReturn {
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleKeyboardWillShow = (event: KeyboardEvent) => {
      setVisible(true);
      setHeight(event.endCoordinates.height);
    };

    const handleKeyboardDidShow = (event: KeyboardEvent) => {
      setVisible(true);
      setHeight(event.endCoordinates.height);
    };

    const handleKeyboardWillHide = () => {
      setVisible(false);
      setHeight(0);
    };

    const handleKeyboardDidHide = () => {
      setVisible(false);
      setHeight(0);
    };

    // iOS 使用 will 事件获得更流畅的动画
    const willShowSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      Platform.OS === 'ios' ? handleKeyboardWillShow : handleKeyboardDidShow
    );
    const willHideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      Platform.OS === 'ios' ? handleKeyboardWillHide : handleKeyboardDidHide
    );

    return () => {
      willShowSub.remove();
      willHideSub.remove();
    };
  }, []);

  const dismiss = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return { visible, height, dismiss };
}
