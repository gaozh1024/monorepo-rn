import { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { AppView } from '@/ui/primitives';
import { useThemeColors } from '@/theme';
import { cn } from '@/utils';

/**
 * Switch 组件属性接口
 */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  testID?: string;
  style?: ViewStyle;
}

/**
 * Switch - 开关组件，支持浅色/深色主题
 */
export function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = 'md',
  className,
  testID,
  style,
}: SwitchProps) {
  const colors = useThemeColors();
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);

  const isChecked = checked !== undefined ? checked : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const newChecked = !isChecked;
    if (checked === undefined) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  // 主题颜色
  const uncheckedTrackColor = colors.divider;
  const checkedTrackColor = colors.primary;
  const disabledOpacity = 0.4;

  // 尺寸配置
  const sizes = {
    sm: { width: 36, height: 20, thumb: 16, padding: 2 },
    md: { width: 48, height: 26, thumb: 22, padding: 2 },
    lg: { width: 60, height: 32, thumb: 28, padding: 2 },
  };

  const config = sizes[size];

  const thumbPosition = isChecked ? config.width - config.thumb - config.padding : config.padding;

  return (
    <TouchableOpacity
      onPress={toggle}
      disabled={disabled}
      className={cn(className)}
      testID={testID}
      activeOpacity={disabled ? 1 : 0.8}
    >
      <AppView
        className="rounded-full"
        style={[
          styles.track,
          {
            width: config.width,
            height: config.height,
            backgroundColor: isChecked ? checkedTrackColor : uncheckedTrackColor,
            opacity: disabled ? disabledOpacity : 1,
          },
          style,
        ]}
      >
        <AppView
          className="rounded-full"
          style={[
            styles.thumb,
            {
              width: config.thumb,
              height: config.thumb,
              backgroundColor: colors.textInverse,
              transform: [{ translateX: thumbPosition }],
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.25,
              shadowRadius: 1,
            },
          ]}
        />
      </AppView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});
