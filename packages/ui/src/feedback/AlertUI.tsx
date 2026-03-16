import { AppView, AppText, AppPressable } from '../primitives';

export interface AlertUIProps {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  visible?: boolean;
}

export function AlertUI({
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  visible = true,
}: AlertUIProps) {
  if (!visible) return null;
  return (
    <AppView center flex className="absolute inset-0 bg-black/50">
      <AppView className="w-80 p-6 bg-white rounded-xl">
        <AppText size="lg" weight="bold" className="text-center">
          {title}
        </AppText>
        {message && <AppText className="mt-2 text-center text-gray-600">{message}</AppText>}
        <AppView row gap={3} className="mt-6">
          {onCancel && (
            <AppPressable onPress={onCancel} className="flex-1 py-3 bg-gray-200 rounded-lg">
              <AppText className="text-center">{cancelText}</AppText>
            </AppPressable>
          )}
          <AppPressable onPress={onConfirm} className="flex-1 py-3 bg-primary-500 rounded-lg">
            <AppText color="white" className="text-center">
              {confirmText}
            </AppText>
          </AppPressable>
        </AppView>
      </AppView>
    </AppView>
  );
}
