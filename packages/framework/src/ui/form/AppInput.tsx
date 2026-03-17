import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '@/utils';

/**
 * 输入框组件
 * @example
 * ```tsx
 * <AppInput placeholder="请输入内容" />
 * <AppInput label="用户名" error="不能为空" />
 * ```
 */

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function AppInput({ label, error, className, ...props }: AppInputProps) {
  return (
    <View className="flex-col gap-1">
      {label && <Text className="text-sm font-medium text-gray-700">{label}</Text>}
      <TextInput
        className={cn(
          'px-4 py-3 border rounded-lg text-base',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <Text className="text-sm text-red-500">{error}</Text>}
    </View>
  );
}
