import { AppPressable, AppText } from '@/ui/primitives';
import { Icon, IconSize } from '@/ui/display';
import { cn } from '@/utils';

/**
 * Radio 组件属性接口
 */
export interface RadioProps {
  /** 是否选中 */
  checked?: boolean;
  /** 点击回调 */
  onPress?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 选中状态的颜色 */
  color?: string;
  /** 图标尺寸 */
  size?: IconSize;
  /** 单选框标签内容 */
  children?: React.ReactNode;
  /** 测试 ID */
  testID?: string;
  /** 自定义样式 */
  className?: string;
}

/**
 * Radio - 单选框组件
 *
 * 用于单选场景的表单组件，支持自定义颜色和尺寸
 * 通常配合 RadioGroup 使用，实现互斥选择
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Radio checked={selected} onPress={() => setSelected(true)} />
 *
 * // 带标签
 * <Radio checked={gender === 'male'} onPress={() => setGender('male')}>
 *   男
 * </Radio>
 * <Radio checked={gender === 'female'} onPress={() => setGender('female')}>
 *   女
 * </Radio>
 *
 * // 禁用状态
 * <Radio checked={false} disabled>
 *   不可用选项
 * </Radio>
 *
 * // 自定义颜色和尺寸
 * <Radio checked={priority === 'high'} onPress={() => setPriority('high')} color="error-500" size="lg">
 *   高优先级
 * </Radio>
 *
 * // 单选组实现
 * const options = [
 *   { label: '选项 A', value: 'a' },
 *   { label: '选项 B', value: 'b' },
 *   { label: '选项 C', value: 'c' },
 * ];
 *
 * {options.map(option => (
 *   <Radio
 *     key={option.value}
 *     checked={selectedValue === option.value}
 *     onPress={() => setSelectedValue(option.value)}
 *   >
 *     {option.label}
 *   </Radio>
 * ))}
 * ```
 */
export function Radio({
  checked = false,
  onPress,
  disabled = false,
  color = 'primary-500',
  size = 'md',
  children,
  testID,
  className,
}: RadioProps) {
  const iconSize = typeof size === 'number' ? size * 1.2 : size;

  return (
    <AppPressable
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      className={cn('flex-row items-center gap-2', disabled && 'opacity-50', className)}
    >
      <Icon
        name={checked ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={iconSize}
        color={checked ? color : 'gray-400'}
      />
      {children && <AppText className={checked ? '' : 'text-gray-600'}>{children}</AppText>}
    </AppPressable>
  );
}
