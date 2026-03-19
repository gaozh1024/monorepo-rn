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
import { cn } from '@/utils';
import { useFormThemeColors } from './useFormTheme';

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
  const colors = useFormThemeColors();
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
            'flex-row items-center justify-between px-4 py-3',
            isSelected && 'bg-primary-50'
          )}
          style={[
            styles.optionItem,
            { borderBottomColor: colors.divider },
            isSelected && { backgroundColor: colors.primarySurface },
          ]}
          onPress={() => handleSelect(item.value)}
        >
          <AppText style={{ color: isSelected ? colors.primary : colors.text }}>
            {item.label}
          </AppText>
          {isSelected && <Icon name="check" size="sm" color="primary-500" />}
        </AppPressable>
      );
    },
    [selectedValues, handleSelect, colors]
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
        onPress={() => setVisible(true)}
      >
        <AppText
          className="flex-1"
          style={{ color: selectedValues.length === 0 ? colors.textMuted : colors.text }}
          numberOfLines={1}
        >
          {displayText}
        </AppText>
        <View className="flex-row items-center">
          {clearable && selectedValues.length > 0 && !disabled && (
            <TouchableOpacity onPress={handleClear} className="mr-2 p-1">
              <Icon name="close" size="sm" color={colors.icon} />
            </TouchableOpacity>
          )}
          <Icon name="keyboard-arrow-down" size="md" color={colors.icon} />
        </View>
      </AppPressable>

      {/* 选择弹窗 */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <AppView className="flex-1" style={{ backgroundColor: colors.overlay }} justify="end">
          <AppView
            className="rounded-t-2xl max-h-[70%]"
            style={{ backgroundColor: colors.surface }}
          >
            {/* 头部 */}
            <AppView
              row
              between
              items="center"
              className="px-4 py-3"
              style={[styles.header, { borderBottomColor: colors.divider }]}
            >
              <AppText className="text-lg font-semibold" style={{ color: colors.text }}>
                {multiple ? '选择选项' : '请选择'}
              </AppText>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Icon name="close" size="md" color={colors.icon} />
              </TouchableOpacity>
            </AppView>

            {/* 搜索框 */}
            {searchable && (
              <AppView
                className="px-4 py-3"
                style={[styles.searchBox, { borderBottomColor: colors.divider }]}
              >
                <AppView
                  row
                  items="center"
                  className="px-3 py-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceMuted }}
                >
                  <View style={{ marginRight: 8 }}>
                    <Icon name="search" size="sm" color={colors.icon} />
                  </View>
                  <TextInput
                    className="flex-1 text-base"
                    style={{ color: colors.text }}
                    placeholder="搜索..."
                    placeholderTextColor={colors.textMuted}
                    value={searchKeyword}
                    onChangeText={handleSearch}
                    autoFocus
                  />
                  {searchKeyword.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchKeyword('')}>
                      <Icon name="close" size="sm" color={colors.icon} />
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
                  <AppText style={{ color: colors.textMuted }}>暂无选项</AppText>
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
                style={[styles.footer, { borderTopColor: colors.divider }]}
              >
                <AppText style={{ color: colors.textMuted }}>
                  已选择 {selectedValues.length} 项
                </AppText>
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                  onPress={() => setVisible(false)}
                >
                  <AppText className="font-medium" style={{ color: colors.textInverse }}>
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
