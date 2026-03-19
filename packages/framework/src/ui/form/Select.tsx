import { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import { AppView, AppText, AppPressable } from '@/ui/primitives';
import { Icon } from '@/ui/display';
import { useTheme } from '@/theme';
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
 * 底部弹出选择器组件，支持浅色/深色主题
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
  const { theme, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 主题颜色
  const bgColor = isDark ? theme.colors.card?.[800] || '#1f2937' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1f2937';
  const placeholderColor = isDark ? '#6b7280' : '#9ca3af';
  const borderColor = isDark ? theme.colors.border?.[600] || '#4b5563' : '#d1d5db';
  const headerBorderColor = isDark ? theme.colors.border?.[700] || '#374151' : '#e5e7eb';
  const optionBorderColor = isDark ? theme.colors.border?.[700] || '#374151' : '#f3f4f6';
  const selectedBgColor = isDark ? theme.colors.primary?.[900] || '#7c2d12' : '#fff7ed';

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
            'flex-row items-center justify-between px-4 py-3',
            isSelected && 'bg-primary-50'
          )}
          style={[
            styles.optionItem,
            { borderBottomColor: optionBorderColor },
            isSelected && { backgroundColor: selectedBgColor },
          ]}
          onPress={() => handleSelect(item.value)}
        >
          <AppText
            className={cn(isSelected ? 'text-primary-600' : 'text-gray-900')}
            style={{ color: isSelected ? theme.colors.primary?.[500] : textColor }}
          >
            {item.label}
          </AppText>
          {isSelected && <Icon name="check" size="sm" color="primary-500" />}
        </AppPressable>
      );
    },
    [
      selectedValues,
      handleSelect,
      textColor,
      theme.colors.primary,
      optionBorderColor,
      selectedBgColor,
    ]
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
        onPress={() => setVisible(true)}
      >
        <AppText
          className="flex-1"
          style={{ color: selectedValues.length === 0 ? placeholderColor : textColor }}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <View className="flex-row items-center">
          {clearable && selectedValues.length > 0 && !disabled && (
            <TouchableOpacity onPress={handleClear} className="mr-2 p-1">
              <Icon name="close" size="sm" color={isDark ? '#6b7280' : 'gray-400'} />
            </TouchableOpacity>
          )}
          <Icon name="keyboard-arrow-down" size="md" color={isDark ? '#6b7280' : 'gray-400'} />
        </View>
      </AppPressable>

      {/* 选择弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <AppView className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} justify="end">
          <AppView className="rounded-t-2xl max-h-[70%]" style={{ backgroundColor: bgColor }}>
            {/* 头部 */}
            <AppView
              row
              between
              items="center"
              className="px-4 py-3"
              style={[styles.header, { borderBottomColor: headerBorderColor }]}
            >
              <AppText className="text-lg font-semibold" style={{ color: textColor }}>
                {multiple ? '选择选项' : '请选择'}
              </AppText>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Icon name="close" size="md" color={isDark ? '#9ca3af' : 'gray-500'} />
              </TouchableOpacity>
            </AppView>

            {/* 搜索框 */}
            {searchable && (
              <AppView
                className="px-4 py-3"
                style={[styles.searchBox, { borderBottomColor: optionBorderColor }]}
              >
                <AppView
                  row
                  items="center"
                  className="px-3 py-2 rounded-lg"
                  style={{ backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                >
                  <View style={{ marginRight: 8 }}>
                    <Icon name="search" size="sm" color={isDark ? '#6b7280' : 'gray-400'} />
                  </View>
                  <TextInput
                    className="flex-1 text-base"
                    style={{ color: textColor }}
                    placeholder="搜索..."
                    placeholderTextColor={placeholderColor}
                    value={searchKeyword}
                    onChangeText={handleSearch}
                    autoFocus
                  />
                  {searchKeyword.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchKeyword('')}>
                      <Icon name="close" size="sm" color={isDark ? '#6b7280' : 'gray-400'} />
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
                  <AppText style={{ color: placeholderColor }}>暂无选项</AppText>
                </AppView>
              }
            />

            {/* 多选底部操作栏 */}
            {multiple && (
              <AppView
                row
                between
                items="center"
                className="px-4 py-3"
                style={[styles.footer, { borderTopColor: headerBorderColor }]}
              >
                <AppText style={{ color: placeholderColor }}>
                  已选择 {selectedValues.length} 项
                </AppText>
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: theme.colors.primary?.[500] || '#f38b32' }}
                  onPress={() => setVisible(false)}
                >
                  <AppText className="font-medium" style={{ color: '#ffffff' }}>
                    确定
                  </AppText>
                </TouchableOpacity>
              </AppView>
            )}
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
  searchBox: {
    borderBottomWidth: 0.5,
  },
  optionItem: {
    borderBottomWidth: 0.5,
  },
  footer: {
    borderTopWidth: 0.5,
  },
});
