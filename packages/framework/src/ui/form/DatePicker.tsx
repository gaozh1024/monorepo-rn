import { useState, useCallback, useMemo } from 'react';
import { Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { AppView, AppText, AppPressable } from '@/ui/primitives';
import { Icon } from '@/ui/display';
import { cn, formatDate } from '@/utils';
import { useFormThemeColors, type FormThemeColors } from './useFormTheme';

/**
 * DatePicker 组件属性接口
 */
export interface DatePickerProps {
  /** 选中日期 */
  value?: Date;
  /** 变化回调 */
  onChange?: (date: Date) => void;
  /** 占位文字 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 日期格式 */
  format?: string;
  /** 最小日期 */
  minDate?: Date;
  /** 最大日期 */
  maxDate?: Date;
  /** 自定义样式 */
  className?: string;
  /** 弹窗取消按钮文案 */
  cancelText?: string;
  /** 弹窗确认按钮文案 */
  confirmText?: string;
  /** 弹窗标题文案 */
  pickerTitle?: string;
  /** 弹窗日期展示格式 */
  pickerDateFormat?: string;
  /** 年列标题 */
  yearLabel?: string;
  /** 月列标题 */
  monthLabel?: string;
  /** 日列标题 */
  dayLabel?: string;
  /** 快捷按钮“今天”文案 */
  todayText?: string;
  /** 快捷按钮“最早”文案 */
  minDateText?: string;
  /** 快捷按钮“最晚”文案 */
  maxDateText?: string;
}

interface PickerColumnProps {
  title: string;
  values: number[];
  selectedValue: number;
  onSelect: (value: number) => void;
  isDisabled: (value: number) => boolean;
  formatLabel?: (value: number) => string;
  showDivider?: boolean;
  colors: FormThemeColors;
}

function PickerColumn({
  title,
  values,
  selectedValue,
  onSelect,
  isDisabled,
  formatLabel = value => String(value),
  showDivider = false,
  colors,
}: PickerColumnProps) {
  return (
    <AppView
      flex
      style={[
        showDivider && styles.column,
        showDivider ? { borderRightColor: colors.divider } : undefined,
      ]}
    >
      <AppView center className="py-2" style={{ backgroundColor: colors.headerSurface }}>
        <AppText className="text-sm font-medium" style={{ color: colors.textMuted }}>
          {title}
        </AppText>
      </AppView>
      <AppView className="flex-1">
        {values.map(value => {
          const selected = selectedValue === value;
          const disabled = isDisabled(value);

          return (
            <TouchableOpacity
              key={value}
              className={cn('py-2 items-center', selected && 'bg-primary-50')}
              style={selected ? { backgroundColor: colors.primarySurface } : undefined}
              disabled={disabled}
              onPress={() => onSelect(value)}
            >
              <AppText
                className={cn(selected ? 'font-semibold' : undefined, disabled && 'opacity-30')}
                style={{
                  color: selected ? colors.primary : colors.textSecondary,
                }}
              >
                {formatLabel(value)}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </AppView>
    </AppView>
  );
}

/**
 * DatePicker - 日期选择器组件，支持浅色/深色主题
 */
export function DatePicker({
  value,
  onChange,
  placeholder = '请选择日期',
  disabled = false,
  format = 'yyyy-MM-dd',
  minDate,
  maxDate,
  className,
  cancelText = '取消',
  confirmText = '确定',
  pickerTitle = '选择日期',
  pickerDateFormat = 'yyyy年MM月dd日',
  yearLabel = '年',
  monthLabel = '月',
  dayLabel = '日',
  todayText = '今天',
  minDateText = '最早',
  maxDateText = '最晚',
}: DatePickerProps) {
  const colors = useFormThemeColors();
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  // 显示文本
  const displayText = useMemo(() => {
    return value ? formatDate(value, format) : placeholder;
  }, [value, format, placeholder]);

  // 确认选择
  const handleConfirm = useCallback(() => {
    onChange?.(tempDate);
    setVisible(false);
  }, [tempDate, onChange]);

  // 生成年份选项（前后50年）
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const arr: number[] = [];
    for (let i = currentYear - 50; i <= currentYear + 50; i++) {
      arr.push(i);
    }
    return arr;
  }, []);

  // 生成月份选项
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  // 生成日期选项
  const days = useMemo(() => {
    const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [tempDate]);

  // 检查日期是否可用
  const isDateDisabled = useCallback(
    (year: number, month: number, day: number) => {
      const date = new Date(year, month - 1, day);
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    },
    [minDate, maxDate]
  );

  // 更新临时日期
  const updateTempDate = useCallback(
    (year?: number, month?: number, day?: number) => {
      const newDate = new Date(tempDate);
      if (year !== undefined) newDate.setFullYear(year);
      if (month !== undefined) newDate.setMonth(month - 1);
      if (day !== undefined) newDate.setDate(day);
      setTempDate(newDate);
    },
    [tempDate]
  );

  return (
    <>
      {/* 触发区域 */}
      <AppPressable
        className={cn(
          'flex-row items-center justify-between px-4 py-3 rounded-lg',
          disabled ? 'opacity-60' : '',
          className
        )}
        style={[styles.trigger, { backgroundColor: colors.surface, borderColor: colors.border }]}
        disabled={disabled}
        onPress={() => {
          setTempDate(value || new Date());
          setVisible(true);
        }}
      >
        <AppText
          className="flex-1"
          style={{ color: value ? colors.text : colors.textMuted }}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <Icon name="calendar-today" size="md" color={colors.icon} />
      </AppPressable>

      {/* 日期选择弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <AppView className="flex-1" style={{ backgroundColor: colors.overlay }} justify="end">
          <AppView className="rounded-t-2xl" style={{ backgroundColor: colors.surface }}>
            {/* 头部 */}
            <AppView
              row
              between
              items="center"
              className="px-4 py-3"
              style={[styles.header, { borderBottomColor: colors.divider }]}
            >
              <TouchableOpacity onPress={() => setVisible(false)}>
                <AppText style={{ color: colors.textMuted }}>{cancelText}</AppText>
              </TouchableOpacity>
              <AppText className="text-lg font-semibold" style={{ color: colors.text }}>
                {pickerTitle}
              </AppText>
              <TouchableOpacity onPress={handleConfirm}>
                <AppText style={{ color: colors.primary }} className="font-medium">
                  {confirmText}
                </AppText>
              </TouchableOpacity>
            </AppView>

            {/* 日期显示 */}
            <AppView center className="py-4" style={{ backgroundColor: colors.headerSurface }}>
              <AppText className="text-2xl font-semibold" style={{ color: colors.text }}>
                {formatDate(tempDate, pickerDateFormat)}
              </AppText>
            </AppView>

            {/* 选择器区域 */}
            <AppView row className="h-48">
              <PickerColumn
                title={yearLabel}
                values={years}
                selectedValue={tempDate.getFullYear()}
                onSelect={year => updateTempDate(year)}
                isDisabled={year =>
                  isDateDisabled(year, tempDate.getMonth() + 1, tempDate.getDate())
                }
                colors={colors}
                showDivider
              />
              <PickerColumn
                title={monthLabel}
                values={months}
                selectedValue={tempDate.getMonth() + 1}
                onSelect={month => updateTempDate(undefined, month)}
                isDisabled={month =>
                  isDateDisabled(tempDate.getFullYear(), month, tempDate.getDate())
                }
                formatLabel={month => `${month}月`}
                colors={colors}
                showDivider
              />
              <PickerColumn
                title={dayLabel}
                values={days}
                selectedValue={tempDate.getDate()}
                onSelect={day => updateTempDate(undefined, undefined, day)}
                isDisabled={day =>
                  isDateDisabled(tempDate.getFullYear(), tempDate.getMonth() + 1, day)
                }
                colors={colors}
              />
            </AppView>

            {/* 快捷操作 */}
            <AppView
              row
              className="px-4 py-3 gap-2"
              style={[styles.footer, { borderTopColor: colors.divider }]}
            >
              <TouchableOpacity
                className="flex-1 py-2 items-center rounded-lg"
                style={{ backgroundColor: colors.surfaceMuted }}
                onPress={() => setTempDate(new Date())}
              >
                <AppText style={{ color: colors.text }}>{todayText}</AppText>
              </TouchableOpacity>
              {minDate && (
                <TouchableOpacity
                  className="flex-1 py-2 items-center rounded-lg"
                  style={{ backgroundColor: colors.surfaceMuted }}
                  onPress={() => setTempDate(minDate)}
                >
                  <AppText style={{ color: colors.text }}>{minDateText}</AppText>
                </TouchableOpacity>
              )}
              {maxDate && (
                <TouchableOpacity
                  className="flex-1 py-2 items-center rounded-lg"
                  style={{ backgroundColor: colors.surfaceMuted }}
                  onPress={() => setTempDate(maxDate)}
                >
                  <AppText style={{ color: colors.text }}>{maxDateText}</AppText>
                </TouchableOpacity>
              )}
            </AppView>
          </AppView>
        </AppView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 0.5,
  },
  header: {
    borderBottomWidth: 0.5,
  },
  column: {
    borderRightWidth: 0.5,
  },
  footer: {
    borderTopWidth: 0.5,
  },
});
