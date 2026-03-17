import { useState, useCallback, useMemo } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { AppView, AppText, AppPressable } from '../primitives';
import { Icon } from '../components';
import { cn, formatDate } from '@/utils';

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
 * 日期选择器组件
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
          'flex-row items-center justify-between px-4 py-3 border rounded-lg bg-white',
          disabled ? 'bg-gray-100 opacity-60' : 'border-gray-300',
          className
        )}
        disabled={disabled}
        onPress={() => {
          setTempDate(value || new Date());
          setVisible(true);
        }}
      >
        <AppText
          className={cn('flex-1', value ? 'text-gray-900' : 'text-gray-400')}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <Icon name="calendar-today" size="md" color="gray-400" />
      </AppPressable>

      {/* 日期选择弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <AppView className="flex-1 bg-black/50" justify="end">
          <AppView className="bg-white rounded-t-2xl">
            {/* 头部 */}
            <AppView row between items="center" className="px-4 py-3 border-b border-gray-200">
              <TouchableOpacity onPress={() => setVisible(false)}>
                <AppText className="text-gray-500">取消</AppText>
              </TouchableOpacity>
              <AppText className="text-lg font-semibold text-gray-900">选择日期</AppText>
              <TouchableOpacity onPress={handleConfirm}>
                <AppText className="text-primary-600 font-medium">确定</AppText>
              </TouchableOpacity>
            </AppView>

            {/* 日期显示 */}
            <AppView center className="py-4 bg-gray-50">
              <AppText className="text-2xl font-semibold text-gray-900">
                {formatDate(tempDate, 'yyyy年MM月dd日')}
              </AppText>
            </AppView>

            {/* 选择器区域 */}
            <AppView row className="h-48">
              {/* 年份 */}
              <AppView flex className="border-r border-gray-200">
                <AppView center className="py-2 bg-gray-100">
                  <AppText className="text-sm font-medium text-gray-600">年</AppText>
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
                        className={cn(
                          'py-2 items-center',
                          isSelected && 'bg-primary-50',
                          disabled && 'opacity-30'
                        )}
                        disabled={disabled}
                        onPress={() => updateTempDate(year)}
                      >
                        <AppText
                          className={cn(
                            isSelected ? 'text-primary-600 font-semibold' : 'text-gray-700'
                          )}
                        >
                          {year}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </AppView>
              </AppView>

              {/* 月份 */}
              <AppView flex className="border-r border-gray-200">
                <AppView center className="py-2 bg-gray-100">
                  <AppText className="text-sm font-medium text-gray-600">月</AppText>
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
                        className={cn(
                          'py-2 items-center',
                          isSelected && 'bg-primary-50',
                          disabled && 'opacity-30'
                        )}
                        disabled={disabled}
                        onPress={() => updateTempDate(undefined, month)}
                      >
                        <AppText
                          className={cn(
                            isSelected ? 'text-primary-600 font-semibold' : 'text-gray-700'
                          )}
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
                <AppView center className="py-2 bg-gray-100">
                  <AppText className="text-sm font-medium text-gray-600">日</AppText>
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
                        className={cn(
                          'py-2 items-center',
                          isSelected && 'bg-primary-50',
                          disabled && 'opacity-30'
                        )}
                        disabled={disabled}
                        onPress={() => updateTempDate(undefined, undefined, day)}
                      >
                        <AppText
                          className={cn(
                            isSelected ? 'text-primary-600 font-semibold' : 'text-gray-700'
                          )}
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
            <AppView row className="px-4 py-3 border-t border-gray-200 gap-2">
              <TouchableOpacity
                className="flex-1 py-2 items-center bg-gray-100 rounded-lg"
                onPress={() => setTempDate(new Date())}
              >
                <AppText className="text-gray-700">今天</AppText>
              </TouchableOpacity>
              {minDate && (
                <TouchableOpacity
                  className="flex-1 py-2 items-center bg-gray-100 rounded-lg"
                  onPress={() => setTempDate(minDate)}
                >
                  <AppText className="text-gray-700">最早</AppText>
                </TouchableOpacity>
              )}
              {maxDate && (
                <TouchableOpacity
                  className="flex-1 py-2 items-center bg-gray-100 rounded-lg"
                  onPress={() => setTempDate(maxDate)}
                >
                  <AppText className="text-gray-700">最晚</AppText>
                </TouchableOpacity>
              )}
            </AppView>
          </AppView>
        </AppView>
      </Modal>
    </>
  );
}
