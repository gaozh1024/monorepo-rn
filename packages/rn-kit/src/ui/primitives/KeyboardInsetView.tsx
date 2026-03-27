import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '../hooks/useKeyboard';
import { AppView, type AppViewProps } from './AppView';

export interface KeyboardInsetViewProps extends AppViewProps {
  /** 是否启用键盘避让 */
  enabled?: boolean;
  /** 是否自动带上底部安全区 */
  bottomSafeArea?: boolean;
  /** 额外的键盘偏移量 */
  keyboardOffset?: number;
}

/**
 * KeyboardInsetView - 适合底部输入栏 / 评论框 / 聊天输入区的键盘避让容器
 */
export function KeyboardInsetView({
  enabled = true,
  bottomSafeArea = true,
  keyboardOffset = 0,
  p,
  py,
  pb,
  children,
  style,
  ...props
}: KeyboardInsetViewProps) {
  const insets = useSafeAreaInsets();
  const { visible, height } = useKeyboard();

  const paddingBottom = useMemo(() => {
    const basePaddingBottom = pb ?? py ?? p ?? 0;
    const safeAreaInset = bottomSafeArea ? insets.bottom : 0;

    if (!enabled) {
      return basePaddingBottom + safeAreaInset;
    }

    if (!visible || height <= 0) {
      return basePaddingBottom + safeAreaInset;
    }

    const keyboardInset = Math.max(0, height - safeAreaInset);

    return basePaddingBottom + safeAreaInset + keyboardInset + keyboardOffset;
  }, [bottomSafeArea, enabled, height, insets.bottom, keyboardOffset, p, pb, py, visible]);

  return (
    <AppView {...props} p={p} py={py} pb={pb} style={[style, { paddingBottom }]}>
      {children}
    </AppView>
  );
}
