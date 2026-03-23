import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AppView, type AppViewProps } from './AppView';

export interface KeyboardDismissViewProps extends AppViewProps {
  /** 是否启用点击空白收起键盘 */
  enabled?: boolean;
}

/**
 * KeyboardDismissView - 点击空白区域时自动收起键盘
 */
export function KeyboardDismissView({
  enabled = true,
  children,
  ...props
}: KeyboardDismissViewProps) {
  const content = <AppView {...props}>{children}</AppView>;

  if (!enabled) {
    return content;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {content}
    </TouchableWithoutFeedback>
  );
}
