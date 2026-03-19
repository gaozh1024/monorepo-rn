import React from 'react';
import { ScrollView } from 'react-native';
import { AppView, AppText, Card, AppHeader, Icon, AppPressable } from '@gaozh1024/rn-kit';
import { useNavigation } from '@react-navigation/native';
import { useUIStore } from '../../../store/ui.store';
import { THEME_MODES, type ThemeMode } from '../../../bootstrap/constants';

/**
 * 主题设置页
 */
export function ThemeScreen() {
  const navigation = useNavigation();
  const { themeMode, setThemeMode } = useUIStore();

  const options: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: '浅色模式', icon: 'wb-sunny' },
    { value: 'dark', label: '深色模式', icon: 'nights-stay' },
    { value: 'system', label: '跟随系统', icon: 'settings-suggest' },
  ];

  return (
    <AppView flex className="bg-gray-50">
      <AppHeader title="主题模式" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />

      <ScrollView className="p-4">
        <Card className="overflow-hidden">
          {options.map((option, index) => (
            <AppPressable key={option.value} onPress={() => setThemeMode(option.value)}>
              <AppView
                row
                items="center"
                className="p-4"
                style={{
                  borderBottomWidth: index < options.length - 1 ? 0.5 : 0,
                  borderBottomColor: '#e5e7eb',
                }}
              >
                <Icon name={option.icon} size={22} color="gray-600" />
                <AppText className="ml-3 flex-1">{option.label}</AppText>
                {themeMode === option.value && <Icon name="check" size={22} color="primary-500" />}
              </AppView>
            </AppPressable>
          ))}
        </Card>

        <AppText size="sm" color="gray-500" className="mt-4 px-2">
          选择深色模式可降低屏幕亮度，有助于在暗光环境下减少眼睛疲劳。
        </AppText>
      </ScrollView>
    </AppView>
  );
}
