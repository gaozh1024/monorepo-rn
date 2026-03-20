import React from 'react';
import { AppText, Icon } from '@gaozh1024/rn-kit';
import { ListItem, ListSection, PageScreen } from '../../../components/common';
import { useUIStore } from '../../../store/ui.store';
import { THEME_MODES, type ThemeMode } from '../../../bootstrap/constants';

/**
 * 主题设置页
 */
export function ThemeScreen() {
  const { themeMode, setThemeMode } = useUIStore();

  const options: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: '浅色模式', icon: 'wb-sunny' },
    { value: 'dark', label: '深色模式', icon: 'nights-stay' },
    { value: 'system', label: '跟随系统', icon: 'settings-suggest' },
  ];

  return (
    <PageScreen title="主题模式" p={4}>
      <ListSection className="mt-0" cardClassName="mx-0">
        {options.map((option, index) => (
          <ListItem
            key={option.value}
            onPress={() => setThemeMode(option.value)}
            showDivider={index < options.length - 1}
            left={<Icon name={option.icon} size={22} color="muted" />}
            right={
              themeMode === option.value ? (
                <Icon name="check" size={22} color="primary-500" />
              ) : undefined
            }
          >
            <AppText>{option.label}</AppText>
          </ListItem>
        ))}
      </ListSection>

      <AppText size="sm" tone="muted" className="mt-4 px-2">
        选择深色模式可降低屏幕亮度，有助于在暗光环境下减少眼睛疲劳。
      </AppText>
    </PageScreen>
  );
}
