import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { AppPressable } from '@/ui/primitives/AppPressable';
import { cn } from '@/utils';

/**
 * 滑块组件 Props
 */
export interface SliderProps {
  /** 当前值 */
  value: number;
  /** 值变化回调 */
  onChange: (value: number) => void;
  /** 最小值（默认 0） */
  min?: number;
  /** 最大值（默认 100） */
  max?: number;
  /** 步长（默认 1） */
  step?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示当前值 */
  showValue?: boolean;
  /** 值格式化函数 */
  formatValue?: (value: number) => string;
  /** 自定义样式 */
  style?: ViewStyle;
  /** 轨道高度 */
  trackHeight?: number;
  /** 滑块大小 */
  thumbSize?: number;
  /** 测试 ID */
  testID?: string;
}

/**
 * 滑块组件
 *
 * 用于在范围内选择数值的交互组件
 *
 * @example
 * ```tsx
 * // 基础使用
 * const [value, setValue] = useState(50);
 * <Slider value={value} onChange={setValue} />
 *
 * // 带数值显示
 * <Slider
 *   value={value}
 *   onChange={setValue}
 *   min={0}
 *   max={100}
 *   step={5}
 *   showValue
 *   formatValue={(v) => `${v}%`}
 * />
 * ```
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showValue = false,
  formatValue = v => String(v),
  style,
  trackHeight = 4,
  thumbSize = 20,
  testID,
}: SliderProps) {
  // 确保值在范围内
  const clampedValue = Math.max(min, Math.min(max, value));

  // 计算百分比
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const handlePress = () => {
    if (disabled || !onChange) return;
    // 简化的点击处理，实际应该根据点击位置计算值
    // 这里仅作演示，实际应使用 PanResponder 实现拖拽
    const newValue = Math.min(max, clampedValue + step);
    onChange(newValue);
  };

  return (
    <AppView style={style} className={cn('w-full', disabled && 'opacity-50')} testID={testID}>
      {/* 数值显示 */}
      {showValue && (
        <AppText className="text-sm text-gray-600 mb-2">{formatValue(clampedValue)}</AppText>
      )}

      {/* 滑块轨道 */}
      <AppPressable
        className="relative w-full justify-center"
        style={{ height: Math.max(trackHeight, thumbSize) }}
        onPress={handlePress}
        disabled={disabled}
      >
        {/* 背景轨道 */}
        <View
          className="absolute w-full rounded-full bg-gray-200"
          style={{ height: trackHeight }}
        />

        {/* 进度轨道 */}
        <View
          className="absolute left-0 rounded-full bg-primary-500"
          style={{
            height: trackHeight,
            width: `${percentage}%`,
          }}
        />

        {/* 滑块 */}
        <View
          className="absolute rounded-full bg-white border-2 border-primary-500 shadow-sm"
          style={{
            width: thumbSize,
            height: thumbSize,
            left: `${percentage}%`,
            marginLeft: -thumbSize / 2,
          }}
        />
      </AppPressable>

      {/* 最小/最大值显示 */}
      <AppView row between className="mt-1">
        <AppText className="text-xs text-gray-400">{formatValue(min)}</AppText>
        <AppText className="text-xs text-gray-400">{formatValue(max)}</AppText>
      </AppView>
    </AppView>
  );
}
