import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  useMotionConfig,
  type PressMotionPreset,
  type PressMotionProps,
  type SheetMotionProps,
} from '@/ui/motion';
import { Icon } from '@/ui/display';
import { AppPressable, AppScrollView, AppText, AppView } from '@/ui/primitives';
import { cn } from '@/utils';
import { BottomSheetModal } from './BottomSheetModal.web';
import { type FormThemeColors, useFormThemeColors } from './useFormTheme';
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

export type PickerValue = string | number;

export interface PickerOption {
  label: string;
  value: PickerValue;
  disabled?: boolean;
}

export interface PickerColumn {
  key: string;
  title?: string;
  options: PickerOption[];
}

export interface PickerRenderFooterContext {
  close: () => void;
  setTempValues: (values: PickerValue[]) => void;
  tempValues: PickerValue[];
}

export interface PickerProps
  extends
    Pick<
      CommonLayoutProps,
      | 'flex'
      | 'm'
      | 'mx'
      | 'my'
      | 'mt'
      | 'mb'
      | 'ml'
      | 'mr'
      | 'w'
      | 'h'
      | 'minW'
      | 'minH'
      | 'maxW'
      | 'maxH'
      | 'rounded'
    >,
    SheetMotionProps,
    PressMotionProps {
  value?: PickerValue[];
  onChange?: (values: PickerValue[]) => void;
  columns: PickerColumn[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  bg?: string;
  surface?: LayoutSurface;
  pickerTitle?: string;
  cancelText?: string;
  confirmText?: string;
  triggerIconName?: string;
  renderDisplayText?: (selectedOptions: Array<PickerOption | undefined>) => string;
  renderFooter?: (context: PickerRenderFooterContext) => React.ReactNode;
  tempValue?: PickerValue[];
  defaultTempValue?: PickerValue[];
  onTempChange?: (values: PickerValue[]) => void;
  onOpen?: () => void;
  rowHeight?: number;
  visibleRows?: number;
}

function findFirstEnabledValue(column: PickerColumn) {
  return column.options.find(option => !option.disabled)?.value;
}

function normalizeValues(columns: PickerColumn[], values?: PickerValue[]) {
  return columns.map((column, index) => {
    const candidate = values?.[index];
    const matched = column.options.find(option => option.value === candidate && !option.disabled);
    return matched?.value ?? findFirstEnabledValue(column) ?? column.options[0]?.value ?? '';
  });
}

interface WebPickerColumnProps {
  colors: FormThemeColors;
  column: PickerColumn;
  columnIndex: number;
  motionPreset: PressMotionPreset;
  motionDuration?: number;
  motionReduceMotion?: boolean;
  onChange: (value: PickerValue) => void;
  selectedValue?: PickerValue;
  showDivider?: boolean;
}

function WebPickerColumn({
  colors,
  column,
  columnIndex,
  motionPreset,
  motionDuration,
  motionReduceMotion,
  onChange,
  selectedValue,
  showDivider = false,
}: WebPickerColumnProps) {
  return (
    <AppView
      flex
      style={[
        showDivider ? styles.columnDivider : undefined,
        showDivider ? { borderRightColor: colors.divider } : undefined,
      ]}
    >
      {column.title && (
        <AppView center className="py-2" style={{ backgroundColor: colors.headerSurface }}>
          <AppText className="text-sm font-medium" style={{ color: colors.textMuted }}>
            {column.title}
          </AppText>
        </AppView>
      )}

      <AppScrollView
        testID={`picker-column-${column.key}`}
        accessibilityRole="list"
        style={styles.columnOptions}
        showsVerticalScrollIndicator
      >
        {column.options.map((option, index) => {
          const selected = option.value === selectedValue;
          return (
            <AppPressable
              key={`${column.key}-${String(option.value)}-${index}`}
              testID={`picker-option-${columnIndex}-${String(option.value)}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: Boolean(option.disabled), selected }}
              disabled={option.disabled}
              onPress={() => {
                if (!option.disabled) onChange(option.value);
              }}
              style={[
                styles.optionButton,
                {
                  opacity: option.disabled ? 0.35 : selected ? 1 : 0.72,
                  backgroundColor: selected ? colors.primarySurface : 'transparent',
                },
              ]}
              motionPreset={motionPreset}
              motionDuration={motionDuration}
              motionReduceMotion={motionReduceMotion}
            >
              <AppText
                className={cn(selected ? 'font-semibold' : undefined)}
                style={{ color: selected ? colors.primary : colors.text }}
              >
                {option.label}
              </AppText>
            </AppPressable>
          );
        })}
      </AppScrollView>
    </AppView>
  );
}

export function Picker({
  flex,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  rounded,
  value,
  onChange,
  columns,
  placeholder = '请选择',
  disabled = false,
  className,
  bg,
  surface,
  pickerTitle = '请选择',
  cancelText = '取消',
  confirmText = '确定',
  triggerIconName = 'keyboard-arrow-down',
  renderDisplayText,
  renderFooter,
  tempValue,
  defaultTempValue,
  onTempChange,
  onOpen,
  motionPreset,
  motionDistance,
  motionOverlayOpacity,
  motionSwipeThreshold,
  motionVelocityThreshold,
  motionReduceMotion,
  motionDuration,
  motionOpenDuration,
  motionCloseDuration,
}: PickerProps) {
  const motionConfig = useMotionConfig();
  const colors = useFormThemeColors();
  const { theme, isDark } = useOptionalTheme();
  const [visible, setVisible] = useState(false);
  const [internalTempValues, setInternalTempValues] = useState<PickerValue[]>(
    normalizeValues(columns, defaultTempValue ?? value)
  );
  const resolvedBgColor =
    resolveSurfaceColor(surface, theme, isDark) ?? resolveNamedColor(bg, theme, isDark);
  const resolvedMotionPreset = motionPreset ?? motionConfig.defaultPressPreset ?? 'soft';
  const isControlledTemp = tempValue !== undefined;
  const tempValues = useMemo(
    () => (isControlledTemp ? normalizeValues(columns, tempValue) : internalTempValues),
    [columns, internalTempValues, isControlledTemp, tempValue]
  );

  useEffect(() => {
    if (!isControlledTemp) {
      setInternalTempValues(previous => normalizeValues(columns, previous));
    }
  }, [columns, isControlledTemp]);

  const selectedOptions = useMemo(
    () =>
      columns.map((column, index) =>
        column.options.find(option => option.value === value?.[index] && !option.disabled)
      ),
    [columns, value]
  );

  const displayText = useMemo(() => {
    if (!value || value.length === 0) return placeholder;
    if (renderDisplayText) return renderDisplayText(selectedOptions);
    const labels = selectedOptions.map(option => option?.label).filter(Boolean);
    return labels.length > 0 ? labels.join(' / ') : placeholder;
  }, [placeholder, renderDisplayText, selectedOptions, value]);

  const setTempValues = useCallback(
    (nextValues: PickerValue[]) => {
      const normalized = normalizeValues(columns, nextValues);
      if (!isControlledTemp) {
        setInternalTempValues(normalized);
      }
      onTempChange?.(normalized);
    },
    [columns, isControlledTemp, onTempChange]
  );

  const updateColumnValue = useCallback(
    (columnIndex: number, nextValue: PickerValue) => {
      const nextValues = [...tempValues];
      nextValues[columnIndex] = nextValue;
      setTempValues(nextValues);
    },
    [setTempValues, tempValues]
  );

  const close = useCallback(() => setVisible(false), []);

  const openModal = useCallback(() => {
    const normalized = normalizeValues(columns, tempValue ?? value ?? defaultTempValue);
    if (!isControlledTemp) {
      setInternalTempValues(normalized);
    }
    onTempChange?.(normalized);
    onOpen?.();
    setVisible(true);
  }, [columns, defaultTempValue, isControlledTemp, onOpen, onTempChange, tempValue, value]);

  const handleConfirm = useCallback(() => {
    onChange?.(tempValues);
    setVisible(false);
  }, [onChange, tempValues]);

  return (
    <AppView
      style={[
        resolveLayoutStyle({ flex }),
        resolveSpacingStyle({ m, mx, my, mt, mb, ml, mr }),
        resolveSizingStyle({ w }),
      ]}
    >
      <AppPressable
        testID="picker-trigger"
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: visible }}
        row
        items="center"
        justify="between"
        px={16}
        py={12}
        rounded={rounded ?? 'lg'}
        className={cn(disabled ? 'opacity-60' : '', className)}
        style={[
          styles.trigger,
          resolveSizingStyle({ h, minW, minH, maxW, maxH }),
          resolveRoundedStyle(rounded),
          { backgroundColor: resolvedBgColor ?? colors.surface, borderColor: colors.border },
        ]}
        disabled={disabled}
        onPress={openModal}
        motionPreset={resolvedMotionPreset}
        motionDuration={motionDuration}
        motionReduceMotion={motionReduceMotion}
      >
        <AppText
          className="flex-1"
          style={{ color: value && value.length > 0 ? colors.text : colors.textMuted }}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <Icon name={triggerIconName} size="md" color={colors.icon} />
      </AppPressable>

      <BottomSheetModal
        visible={visible}
        onRequestClose={close}
        overlayColor={colors.overlay}
        surfaceColor={colors.surface}
        closeOnBackdropPress
        motionDuration={motionDuration}
        motionOpenDuration={motionOpenDuration}
        motionCloseDuration={motionCloseDuration}
        motionDistance={motionDistance}
        motionOverlayOpacity={motionOverlayOpacity}
        motionSwipeThreshold={motionSwipeThreshold}
        motionVelocityThreshold={motionVelocityThreshold}
        motionReduceMotion={motionReduceMotion}
      >
        <>
          <AppView
            row
            between
            items="center"
            className="px-4 py-3"
            style={[styles.header, { borderBottomColor: colors.divider }]}
          >
            <AppPressable
              testID="picker-cancel"
              onPress={close}
              py={4}
              pressedClassName="opacity-70"
              motionPreset={resolvedMotionPreset}
              motionDuration={motionDuration}
              motionReduceMotion={motionReduceMotion}
            >
              <AppText style={{ color: colors.textMuted }}>{cancelText}</AppText>
            </AppPressable>
            <AppText className="text-lg font-semibold" style={{ color: colors.text }}>
              {pickerTitle}
            </AppText>
            <AppPressable
              testID="picker-confirm"
              onPress={handleConfirm}
              py={4}
              pressedClassName="opacity-70"
              motionPreset={resolvedMotionPreset}
              motionDuration={motionDuration}
              motionReduceMotion={motionReduceMotion}
            >
              <AppText className="font-medium" style={{ color: colors.primary }}>
                {confirmText}
              </AppText>
            </AppPressable>
          </AppView>

          <AppView row>
            {columns.map((column, index) => (
              <WebPickerColumn
                key={column.key}
                colors={colors}
                column={column}
                columnIndex={index}
                motionPreset={resolvedMotionPreset}
                motionDuration={motionDuration}
                motionReduceMotion={motionReduceMotion}
                onChange={nextValue => updateColumnValue(index, nextValue)}
                selectedValue={tempValues[index]}
                showDivider={index < columns.length - 1}
              />
            ))}
          </AppView>

          {renderFooter && (
            <AppView
              className="px-4 py-3"
              style={[styles.footer, { borderTopColor: colors.divider }]}
            >
              {renderFooter({ close, setTempValues, tempValues })}
            </AppView>
          )}
        </>
      </BottomSheetModal>
    </AppView>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 0.5,
  },
  header: {
    borderBottomWidth: 0.5,
  },
  footer: {
    borderTopWidth: 0.5,
  },
  columnDivider: {
    borderRightWidth: 0.5,
  },
  columnOptions: {
    maxHeight: 320,
  },
  optionButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
});
