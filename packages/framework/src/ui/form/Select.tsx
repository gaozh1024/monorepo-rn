import { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  GestureResponderEvent,
} from 'react-native';
import { AppView, AppText, AppPressable } from '../primitives';
import { Icon } from '../components';
import { cn } from '@/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  /** 选中值 */
  value?: string | string[];
  /** 变化回调 */
  onChange?: (value: string | string[]) => void;
  /** 选项列表 */
  options: SelectOption[];
  /** 占位文字 */
  placeholder?: string;
  /** 是否多选 */
  multiple?: boolean;
  /** 是否可搜索 */
  searchable?: boolean;
  /** 搜索回调（异步搜索时使用） */
  onSearch?: (keyword: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 自定义样式 */
  className?: string;
}

/**
 * 底部弹出选择器组件
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = '请选择',
  multiple = false,
  searchable = false,
  onSearch,
  disabled = false,
  clearable = true,
  className,
}: SelectProps) {
  const [visible, setVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 处理值格式
  const selectedValues = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    return value ? [value] : [];
  }, [value, multiple]);

  // 显示文本
  const displayText = useMemo(() => {
    if (selectedValues.length === 0) return placeholder;
    const selectedLabels = options
      .filter(opt => selectedValues.includes(opt.value))
      .map(opt => opt.label);
    return selectedLabels.join(', ') || placeholder;
  }, [selectedValues, options, placeholder]);

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchKeyword) return options;
    return options.filter(opt => opt.label.toLowerCase().includes(searchKeyword.toLowerCase()));
  }, [options, searchable, searchKeyword]);

  // 选择处理
  const handleSelect = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter(v => v !== optionValue)
          : [...currentValues, optionValue];
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setVisible(false);
      }
    },
    [multiple, value, onChange]
  );

  // 清空
  const handleClear = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : '');
    },
    [multiple, onChange]
  );

  // 搜索处理
  const handleSearch = useCallback(
    (text: string) => {
      setSearchKeyword(text);
      onSearch?.(text);
    },
    [onSearch]
  );

  // 渲染选项
  const renderOption = useCallback(
    ({ item }: { item: SelectOption }) => {
      const isSelected = selectedValues.includes(item.value);
      return (
        <AppPressable
          className={cn(
            'flex-row items-center justify-between px-4 py-3 border-b border-gray-100',
            isSelected && 'bg-primary-50'
          )}
          onPress={() => handleSelect(item.value)}
        >
          <AppText className={cn(isSelected ? 'text-primary-600' : 'text-gray-900')}>
            {item.label}
          </AppText>
          {isSelected && <Icon name="check" size="sm" color="primary-600" />}
        </AppPressable>
      );
    },
    [selectedValues, handleSelect]
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
        onPress={() => setVisible(true)}
      >
        <AppText
          className={cn('flex-1', selectedValues.length === 0 ? 'text-gray-400' : 'text-gray-900')}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <View className="flex-row items-center">
          {clearable && selectedValues.length > 0 && !disabled && (
            <TouchableOpacity onPress={handleClear} className="mr-2 p-1">
              <Icon name="close" size="sm" color="gray-400" />
            </TouchableOpacity>
          )}
          <Icon name="keyboard-arrow-down" size="md" color="gray-400" />
        </View>
      </AppPressable>

      {/* 选择弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <AppView className="flex-1 bg-black/50" justify="end">
          <AppView className="bg-white rounded-t-2xl max-h-[70%]">
            {/* 头部 */}
            <AppView row between items="center" className="px-4 py-3 border-b border-gray-200">
              <AppText className="text-lg font-semibold text-gray-900">
                {multiple ? '选择选项' : '请选择'}
              </AppText>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Icon name="close" size="md" color="gray-500" />
              </TouchableOpacity>
            </AppView>

            {/* 搜索框 */}
            {searchable && (
              <AppView className="px-4 py-3 border-b border-gray-100">
                <AppView row items="center" className="px-3 py-2 bg-gray-100 rounded-lg">
                  <View style={{ marginRight: 8 }}>
                    <Icon name="search" size="sm" color="gray-400" />
                  </View>
                  <TextInput
                    className="flex-1 text-base text-gray-900"
                    placeholder="搜索..."
                    value={searchKeyword}
                    onChangeText={handleSearch}
                    autoFocus
                  />
                  {searchKeyword.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchKeyword('')}>
                      <Icon name="close" size="sm" color="gray-400" />
                    </TouchableOpacity>
                  )}
                </AppView>
              </AppView>
            )}

            {/* 选项列表 */}
            <FlatList
              data={filteredOptions}
              keyExtractor={item => item.value}
              renderItem={renderOption}
              ListEmptyComponent={
                <AppView center className="py-8">
                  <AppText className="text-gray-400">暂无选项</AppText>
                </AppView>
              }
            />

            {/* 多选底部操作栏 */}
            {multiple && (
              <AppView row between items="center" className="px-4 py-3 border-t border-gray-200">
                <AppText className="text-gray-500">已选择 {selectedValues.length} 项</AppText>
                <TouchableOpacity
                  className="px-4 py-2 bg-primary-500 rounded-lg"
                  onPress={() => setVisible(false)}
                >
                  <AppText className="text-white font-medium">确定</AppText>
                </TouchableOpacity>
              </AppView>
            )}
          </AppView>
        </AppView>
      </Modal>
    </>
  );
}
