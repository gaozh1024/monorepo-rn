import { useState, useCallback, useMemo } from 'react';
import { Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { AppView, AppText, AppPressable } from '@/ui/primitives';
import { Icon } from '@/ui/display';
import { useTheme } from '@/theme';
import { cn, formatDate } from '@/utils';

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
}: DatePickerProps) {
  const { theme, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());

  // 主题颜色
  const bgColor = isDark ? theme.colors.card?.[800] || '#1f2937' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const placeholderColor = isDark ? '#6b7280' : '#9ca3af';
  const borderColor = isDark ? theme.colors.border?.[600] || '#4b5563' : '#d1d5db';
  const headerBorderColor = isDark ? theme.colors.border?.[700] || '#374151' : '#e5e7eb';
  const columnBorderColor = isDark ? theme.colors.border?.[700] || '#374151' : '#e5e7eb';
  const headerBgColor = isDark ? '#111827' : '#f3f4f6';
  const selectedBgColor = isDark ? theme.colors.primary?.[900] || '#7c2d12' : '#fff7ed';

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
        style={[styles.trigger, { backgroundColor: bgColor, borderColor }]}
        disabled={disabled}
        onPress={() => {
          setTempDate(value || new Date());
          setVisible(true);
        }}
      >
        <AppText
          className="flex-1"
          style={{ color: value ? textColor : placeholderColor }}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <Icon name="calendar-today" size="md" color={isDark ? '#6b7280' : 'gray-400'} />
      </AppPressable>

      {/* 日期选择弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <AppView className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} justify="end">
          <AppView className="rounded-t-2xl" style={{ backgroundColor: bgColor }}>
            {/* 头部 */}
            <AppView
              row
              between
              items="center"
              className="px-4 py-3"
              style={[styles.header, { borderBottomColor: headerBorderColor }]}
            >
              <TouchableOpacity onPress={() => setVisible(false)}>
                <AppText style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>取消</AppText>
              </TouchableOpacity>
              <AppText className="text-lg font-semibold" style={{ color: textColor }}>
                选择日期
              </AppText>
              <TouchableOpacity onPress={handleConfirm}>
                <AppText
                  style={{ color: theme.colors.primary?.[500] || '#f38b32' }}
                  className="font-medium"
                >
                  确定
                </AppText>
              </TouchableOpacity>
            </AppView>

            {/* 日期显示 */}
            <AppView center className="py-4" style={{ backgroundColor: headerBgColor }}>
              <AppText className="text-2xl font-semibold" style={{ color: textColor }}>
                {formatDate(tempDate, 'yyyy年MM月dd日')}
              </AppText>
            </AppView>

            {/* 选择器区域 */}
            <AppView row className="h-48">
              {/* 年份 */}
              <AppView flex style={[styles.column, { borderRightColor: columnBorderColor }]}>
                <AppView center className="py-2" style={{ backgroundColor: headerBgColor }}>
                  <AppText
                    className="text-sm font-medium"
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                  >
                    年
                  </AppText>
                </AppView>
                <AppView className="flex-1">
                  {years.map(year => {
                    const isSelected = tempDate.getFullYear() === year;
                    const disabled = isDateDisabled(
                      year,
                      tempDate.getMonth() + 1,
                      tempDate.getDate()
                    );
                    return (
                      <TouchableOpacity
                        key={year}
                        className={cn('py-2 items-center', isSelected && 'bg-primary-50')}
                        style={isSelected ? { backgroundColor: selectedBgColor } : undefined}
                        disabled={disabled}
                        onPress={() => updateTempDate(year)}
                      >
                        <AppText
                          className={cn(
                            isSelected ? 'font-semibold' : 'text-gray-700',
                            disabled && 'opacity-30'
                          )}
                          style={{
                            color: isSelected
                              ? theme.colors.primary?.[500] || '#f38b32'
                              : isDark
                                ? '#d1d5db'
                                : '#374151',
                          }}
                        >
                          {year}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </AppView>
              </AppView>

              {/* 月份 */}
              <AppView flex style={[styles.column, { borderRightColor: columnBorderColor }]}>
                <AppView center className="py-2" style={{ backgroundColor: headerBgColor }}>
                  <AppText
                    className="text-sm font-medium"
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                  >
                    月
                  </AppText>
                </AppView>
                <AppView className="flex-1">
                  {months.map(month => {
                    const isSelected = tempDate.getMonth() + 1 === month;
                    const disabled = isDateDisabled(
                      tempDate.getFullYear(),
                      month,
                      tempDate.getDate()
                    );
                    return (
                      <TouchableOpacity
                        key={month}
                        className={cn('py-2 items-center', isSelected && 'bg-primary-50')}
                        style={isSelected ? { backgroundColor: selectedBgColor } : undefined}
                        disabled={disabled}
                        onPress={() => updateTempDate(undefined, month)}
                      >
                        <AppText
                          className={cn(
                            isSelected ? 'font-semibold' : 'text-gray-700',
                            disabled && 'opacity-30'
                          )}
                          style={{
                            color: isSelected
                              ? theme.colors.primary?.[500] || '#f38b32'
                              : isDark
                                ? '#d1d5db'
                                : '#374151',
                          }}
                        >
                          {month}月
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </AppView>
              </AppView>

              {/* 日期 */}
              <AppView flex>
                <AppView center className="py-2" style={{ backgroundColor: headerBgColor }}>
                  <AppText
                    className="text-sm font-medium"
                    style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                  >
                    日
                  </AppText>
                </AppView>
                <AppView className="flex-1">
                  {days.map(day => {
                    const isSelected = tempDate.getDate() === day;
                    const disabled = isDateDisabled(
                      tempDate.getFullYear(),
                      tempDate.getMonth() + 1,
                      day
                    );
                    return (
                      <TouchableOpacity
                        key={day}
                        className={cn('py-2 items-center', isSelected && 'bg-primary-50')}
                        style={isSelected ? { backgroundColor: selectedBgColor } : undefined}
                        disabled={disabled}
                        onPress={() => updateTempDate(undefined, undefined, day)}
                      >
                        <AppText
                          className={cn(
                            isSelected ? 'font-semibold' : 'text-gray-700',
                            disabled && 'opacity-30'
                          )}
                          style={{
                            color: isSelected
                              ? theme.colors.primary?.[500] || '#f38b32'
                              : isDark
                                ? '#d1d5db'
                                : '#374151',
                          }}
                        >
                          {day}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </AppView>
              </AppView>
            </AppView>

            {/* 快捷操作 */}
            <AppView
              row
              className="px-4 py-3 gap-2"
              style={[styles.footer, { borderTopColor: headerBorderColor }]}
            >
              <TouchableOpacity
                className="flex-1 py-2 items-center rounded-lg"
                style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                onPress={() => setTempDate(new Date())}
              >
                <AppText style={{ color: textColor }}>今天</AppText>
              </TouchableOpacity>
              {minDate && (
                <TouchableOpacity
                  className="flex-1 py-2 items-center rounded-lg"
                  style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                  onPress={() => setTempDate(minDate)}
                >
                  <AppText style={{ color: textColor }}>最早</AppText>
                </TouchableOpacity>
              )}
              {maxDate && (
                <TouchableOpacity
                  className="flex-1 py-2 items-center rounded-lg"
                  style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                  onPress={() => setTempDate(maxDate)}
                >
                  <AppText style={{ color: textColor }}>最晚</AppText>
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
