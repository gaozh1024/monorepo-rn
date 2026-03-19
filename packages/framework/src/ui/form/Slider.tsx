import { useState, useCallback, useRef } from 'react';
import {
  View,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { cn } from '@/utils';
import { useFormThemeColors } from './useFormTheme';

/**
 * Slider 组件属性接口
 */
export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showTooltip?: boolean;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  className?: string;
}

/**
 * Slider - 滑块组件，支持浅色/深色主题
 */
export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showTooltip = false,
  onChange,
  onChangeEnd,
  className,
}: SliderProps) {
  const colors = useFormThemeColors();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const currentValue = value !== undefined ? value : internalValue;

  // 主题颜色
  const disabledOpacity = 0.4;

  // 计算进度百分比
  const progress = ((currentValue - min) / (max - min)) * 100;

  // 根据位置计算值
  const getValueFromPosition = useCallback(
    (position: number) => {
      const percentage = Math.max(0, Math.min(1, position / trackWidth));
      const rawValue = min + percentage * (max - min);
      // 对齐到 step
      const steppedValue = Math.round(rawValue / step) * step;
      return Math.min(max, Math.max(min, steppedValue));
    },
    [trackWidth, min, max, step]
  );

  // 设置值
  const setValue = useCallback(
    (newValue: number) => {
      const clampedValue = Math.min(max, Math.max(min, newValue));
      if (value === undefined) {
        setInternalValue(clampedValue);
      }
      onChange?.(clampedValue);
    },
    [value, min, max, onChange]
  );

  // PanResponder 处理手势
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const position = (progress / 100) * trackWidth + gestureState.dx;
        const newValue = getValueFromPosition(position);
        setValue(newValue);
      },
      onPanResponderRelease: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const position = (progress / 100) * trackWidth + gestureState.dx;
        const newValue = getValueFromPosition(position);
        setValue(newValue);
        setIsDragging(false);
        onChangeEnd?.(newValue);
      },
    })
  ).current;

  // 处理点击轨道
  const handleTrackPress = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;
      const { locationX } = event.nativeEvent;
      const newValue = getValueFromPosition(locationX);
      setValue(newValue);
      onChangeEnd?.(newValue);
    },
    [disabled, getValueFromPosition, setValue, onChangeEnd]
  );

  // 测量轨道宽度
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <AppView className={cn('py-2', className)}>
      {/* Tooltip */}
      {showTooltip && isDragging && (
        <AppView
          className="absolute rounded px-2 py-1 -top-8"
          style={[
            styles.tooltip,
            {
              backgroundColor: colors.surfaceMuted,
              left: `${progress}%`,
              transform: [{ translateX: -16 }],
            },
          ]}
        >
          <AppText size="xs" style={{ color: colors.text }}>
            {Math.round(currentValue)}
          </AppText>
          {/* Tooltip arrow */}
          <AppView
            style={[
              styles.tooltipArrow,
              {
                borderTopColor: colors.surfaceMuted,
              },
            ]}
          />
        </AppView>
      )}

      {/* Track */}
      <View
        onLayout={onLayout}
        className="rounded-full"
        style={[
          styles.track,
          { backgroundColor: colors.divider, opacity: disabled ? disabledOpacity : 1 },
        ]}
        onTouchEnd={handleTrackPress}
      >
        {/* Filled track */}
        <AppView
          className="rounded-full"
          style={[
            styles.filledTrack,
            {
              backgroundColor: colors.primary,
              width: `${progress}%`,
            },
          ]}
        />

        {/* Thumb */}
        <AppView
          className="absolute rounded-full items-center justify-center"
          style={[
            styles.thumb,
            {
              backgroundColor: colors.textInverse,
              left: `${progress}%`,
              transform: [{ translateX: -12 }],
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 2,
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Thumb inner dot */}
          <AppView
            className="rounded-full"
            style={[
              styles.thumbDot,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />
        </AppView>
      </View>
    </AppView>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    width: '100%',
  },
  filledTrack: {
    height: 6,
  },
  thumb: {
    width: 24,
    height: 24,
    top: -9,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thumbDot: {
    width: 8,
    height: 8,
  },
  tooltip: {
    minWidth: 32,
    alignItems: 'center',
    elevation: 4,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
