import { ActivityIndicator } from 'react-native';
import { AppView, AppText } from '../primitives';

export interface LoadingProps {
  text?: string;
  overlay?: boolean;
  visible?: boolean;
  testID?: string;
}

export function Loading({ text, overlay = false, visible = true, testID }: LoadingProps) {
  if (!visible) return null;
  const content = (
    <AppView center gap={3} testID={testID}>
      <ActivityIndicator size="large" />
      {text && <AppText>{text}</AppText>}
    </AppView>
  );
  if (overlay) {
    return (
      <AppView center flex className="absolute inset-0 bg-black/30" testID={testID}>
        {content}
      </AppView>
    );
  }
  return content;
}
