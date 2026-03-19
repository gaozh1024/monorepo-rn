import React from 'react';
import { AppView, AppText, Card, Icon, AppPressable, useThemeColors } from '@gaozh1024/rn-kit';
import { PageScreen } from '../../../components/common';
import { useUIStore } from '../../../store/ui.store';
import { THEME_MODES, type ThemeMode } from '../../../bootstrap/constants';

/**
 * 主题设置页
 */
export function ThemeScreen() {
  const { themeMode, setThemeMode } = useUIStore();
  const colors = useThemeColors();

  const options: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: '浅色模式', icon: 'wb-sunny' },
    { value: 'dark', label: '深色模式', icon: 'nights-stay' },
    { value: 'system', label: '跟随系统', icon: 'settings-suggest' },
  ];

  return (
    <PageScreen title="主题模式" p={4}>
      <Card className="overflow-hidden">
        {options.map((option, index) => (
          <AppPressable key={option.value} onPress={() => setThemeMode(option.value)}>
            <AppView
              row
              items="center"
              className="p-4"
              style={{
                borderBottomWidth: index < options.length - 1 ? 0.5 : 0,
                borderBottomColor: colors.divider,
              }}
            >
              <Icon name={option.icon} size={22} color="muted" />
              <AppText className="ml-3 flex-1">{option.label}</AppText>
              {themeMode === option.value && <Icon name="check" size={22} color="primary-500" />}
            </AppView>
          </AppPressable>
        ))}
      </Card>

      <AppText size="sm" tone="muted" className="mt-4 px-2">
        选择深色模式可降低屏幕亮度，有助于在暗光环境下减少眼睛疲劳。
      </AppText>
    </PageScreen>
  );
}
