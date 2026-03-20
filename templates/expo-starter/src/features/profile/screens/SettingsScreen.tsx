import React from 'react';
import { AppText, Icon, AppButton, useAlert, useNavigation, AppView } from '@gaozh1024/rn-kit';
import { ListItem, ListSection, PageScreen } from '../../../components/common';
import { useSessionStore } from '../../../store/session.store';
import { useUIStore } from '../../../store/ui.store';
import {
  LANGUAGES,
  THEME_MODES,
  type Language,
  type ThemeMode,
} from '../../../bootstrap/constants';
import { appInfo } from '../../../data/mocks/app.mock';
import { settingsSections } from '../../../data/mocks/settings.mock';
import type { MyNavigationProp } from '../../../navigation/types';

/**
 * 设置页
 */
export function SettingsScreen() {
  const navigation = useNavigation<MyNavigationProp>();
  const { logout } = useSessionStore();
  const { themeMode, language } = useUIStore();
  const { confirm } = useAlert();
  const themeLabelMap: Record<ThemeMode, string> = {
    [THEME_MODES.LIGHT]: '浅色模式',
    [THEME_MODES.DARK]: '深色模式',
    [THEME_MODES.SYSTEM]: '跟随系统',
  };
  const languageLabelMap: Record<Language, string> = {
    [LANGUAGES.ZH_CN]: '简体中文',
    [LANGUAGES.EN]: 'English',
  };

  const resolvedSections = settingsSections.map(section => ({
    ...section,
    items: section.items.map(item => {
      switch (item.key) {
        case 'theme':
          return { ...item, value: themeLabelMap[themeMode] };
        case 'language':
          return { ...item, value: languageLabelMap[language] };
        case 'version':
          return { ...item, value: appInfo.version };
        default:
          return item;
      }
    }),
  }));

  const handleLogout = () => {
    confirm({
      title: '确认退出',
      message: '确定要退出登录吗？',
      cancelText: '取消',
      confirmText: '确定',
      onConfirm: () => void logout(),
    });
  };

  const handleItemPress = (key: string) => {
    switch (key) {
      case 'theme':
        navigation.navigate('Theme');
        break;
      case 'language':
        navigation.navigate('Language');
        break;
      case 'userInfo':
        navigation.navigate('UserInfo');
        break;
      case 'about':
        navigation.navigate('About');
        break;
    }
  };

  return (
    <PageScreen title="设置">
      {resolvedSections.map(section => (
        <ListSection key={section.title} title={section.title}>
          {section.items.map((item, index) => (
            <ListItem
              key={item.key}
              onPress={() => item.type === 'link' && handleItemPress(item.key)}
              showDivider={index < section.items.length - 1}
              right={
                item.type === 'link' ? (
                  <>
                    <AppText size="sm" tone="muted">
                      {item.value}
                    </AppText>
                    <Icon name="chevron-right" size={20} color="muted" />
                  </>
                ) : (
                  <AppText size="sm" tone="muted">
                    {item.value}
                  </AppText>
                )
              }
            >
              <AppText>{item.label}</AppText>
            </ListItem>
          ))}
        </ListSection>
      ))}

      {/* 退出登录 */}
      <AppView className="px-4 mt-8 mb-8">
        <AppButton color="danger" variant="outline" onPress={handleLogout}>
          退出登录
        </AppButton>
      </AppView>
    </PageScreen>
  );
}
