import { AppPressable, AppText } from '@/ui/primitives';
import { Icon, IconSize } from '@/ui/display';
import { cn } from '@/utils';

/**
 * Checkbox 组件属性接口
 */
export interface CheckboxProps {
  /** 是否选中 */
  checked?: boolean;
  /** 状态变化回调 */
  onChange?: (checked: boolean) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 选中状态的颜色 */
  color?: string;
  /** 选中时的图标名称 */
  checkedIcon?: string;
  /** 未选中时的图标名称 */
  uncheckedIcon?: string;
  /** 图标尺寸 */
  size?: IconSize;
  /** 复选框标签内容 */
  children?: React.ReactNode;
  /** 测试 ID */
  testID?: string;
  /** 自定义样式 */
  className?: string;
}

/**
 * Checkbox - 复选框组件
 *
 * 用于多选场景的表单组件，支持自定义图标、颜色和尺寸
 * 可配合标签文字使用，提供良好的触摸交互体验
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Checkbox checked={checked} onChange={setChecked} />
 *
 * // 带标签
 * <Checkbox checked={agreed} onChange={setAgreed}>
 *   我同意用户协议
 * </Checkbox>
 *
 * // 禁用状态
 * <Checkbox checked={true} disabled>
 *   不可更改
 * </Checkbox>
 *
 * // 自定义颜色
 * <Checkbox checked={selected} onChange={setSelected} color="success-500">
 *   已选中
 * </Checkbox>
 *
 * // 自定义图标
 * <Checkbox
 *   checked={liked}
 *   onChange={setLiked}
 *   checkedIcon="favorite"
 *   uncheckedIcon="favorite-border"
 *   color="red-500"
 * >
 *   收藏
 * </Checkbox>
 *
 * // 列表中使用
 * {items.map(item => (
 *   <Checkbox
 *     key={item.id}
 *     checked={selectedIds.includes(item.id)}
 *     onChange={() => toggleSelection(item.id)}
 *   >
 *     {item.name}
 *   </Checkbox>
 * ))}
 * ```
 */
export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  color = 'primary-500',
  checkedIcon = 'check-box',
  uncheckedIcon = 'check-box-outline-blank',
  size = 'md',
  children,
  testID,
  className,
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <AppPressable
      disabled={disabled}
      onPress={handlePress}
      testID={testID}
      className={cn('flex-row items-center gap-2', disabled && 'opacity-50', className)}
    >
      <Icon
        name={checked ? checkedIcon : uncheckedIcon}
        size={size}
        color={checked ? color : 'gray-400'}
      />
      {children && <AppText className={checked ? '' : 'text-gray-600'}>{children}</AppText>}
    </AppPressable>
  );
}
