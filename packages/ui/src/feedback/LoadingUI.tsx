import { ActivityIndicator } from 'react-native';
import { AppView, AppText } from '../primitives';

export interface LoadingUIProps {
  text?: string;
  overlay?: boolean;
  visible?: boolean;
}

export function LoadingUI({ text, overlay = false, visible = true }: LoadingUIProps) {
  if (!visible) return null;
  const content = (
    <AppView center gap={3}>
      <ActivityIndicator size="large" />
      {text && <AppText>{text}</AppText>}
    </AppView>
  );
  if (overlay) {
    return (
      <AppView center flex className="absolute inset-0 bg-black/30">
        {content}
      </AppView>
    );
  }
  return content;
}
