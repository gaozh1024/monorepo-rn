import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { cn } from '@/utils';
import { useFormThemeColors } from './useFormTheme';
import {
  type CommonLayoutProps,
  type LayoutSurface,
  resolveLayoutStyle,
  resolveRoundedStyle,
  resolveSizingStyle,
  resolveSpacingStyle,
} from '../utils/layout-shortcuts';
import { useOptionalTheme } from '@/theme';
import { resolveNamedColor, resolveSurfaceColor } from '../utils/theme-color';

export interface SliderProps extends Pick<
  CommonLayoutProps,
  'flex' | 'm' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr' | 'w' | 'minW' | 'maxW' | 'rounded'
> {
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
  bg?: string;
  surface?: LayoutSurface;
}

export function Slider({
  flex,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  w,
  minW,
  maxW,
  rounded,
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
  bg,
  surface,
}: SliderProps) {
  const colors = useFormThemeColors();
  const { theme, isDark } = useOptionalTheme();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const currentValue = value !== undefined ? value : internalValue;
  const range = max - min;
  const progress = range <= 0 ? 0 : ((currentValue - min) / range) * 100;
  const disabledOpacity = 0.4;
  const resolvedTrackBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);

  const clampValue = useCallback(
    (nextValue: number) => {
      if (!Number.isFinite(nextValue)) return currentValue;
      return Math.min(max, Math.max(min, nextValue));
    },
    [currentValue, max, min]
  );

  const setValue = useCallback(
    (nextValue: number, commit = false) => {
      const clampedValue = clampValue(nextValue);
      if (value === undefined) {
        setInternalValue(clampedValue);
      }
      onChange?.(clampedValue);
      if (commit) {
        onChangeEnd?.(clampedValue);
      }
    },
    [clampValue, onChange, onChangeEnd, value]
  );

  const rangeInputStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: 32,
      opacity: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }),
    [disabled]
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const input = useMemo(
    () =>
      typeof document === 'undefined'
        ? null
        : // Raw input keeps browser range semantics, keyboard support and form accessibility.
          React.createElement('input', {
            type: 'range',
            'data-testid': 'slider-range-input',
            min,
            max,
            step,
            value: currentValue,
            disabled,
            'aria-valuemin': min,
            'aria-valuemax': max,
            'aria-valuenow': currentValue,
            style: rangeInputStyle,
            onMouseDown: () => setIsDragging(true),
            onMouseUp: () => {
              setIsDragging(false);
              onChangeEnd?.(currentValue);
            },
            onTouchStart: () => setIsDragging(true),
            onTouchEnd: () => {
              setIsDragging(false);
              onChangeEnd?.(currentValue);
            },
            onBlur: () => {
              setIsDragging(false);
              onChangeEnd?.(currentValue);
            },
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              setValue(Number(event.currentTarget.value));
            },
          }),
    [currentValue, disabled, max, min, onChangeEnd, rangeInputStyle, setValue, step]
  );

  return (
    <AppView
      className={cn('py-2', className)}
      style={[
        resolveLayoutStyle({ flex }),
        resolveSpacingStyle({ m, mx, my, mt, mb, ml, mr }),
        resolveSizingStyle({ w, minW, maxW }),
      ]}
    >
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
          <AppView style={[styles.tooltipArrow, { borderTopColor: colors.surfaceMuted }]} />
        </AppView>
      )}

      <AppView
        className={cn(rounded === undefined && 'rounded-full')}
        style={[
          styles.track,
          resolveRoundedStyle(rounded ?? 'full'),
          {
            backgroundColor: resolvedTrackBgColor ?? colors.divider,
            opacity: disabled ? disabledOpacity : 1,
          },
        ]}
      >
        <AppView
          className={cn(rounded === undefined && 'rounded-full')}
          style={[
            styles.filledTrack,
            resolveRoundedStyle(rounded ?? 'full'),
            { backgroundColor: colors.primary, width: `${progress}%` },
          ]}
        />
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
        >
          <AppView
            className="rounded-full"
            style={[styles.thumbDot, { backgroundColor: colors.primary }]}
          />
        </AppView>
        {input}
      </AppView>
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
