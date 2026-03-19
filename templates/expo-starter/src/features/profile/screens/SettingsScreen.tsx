import React from 'react';
import { ScrollView, Alert } from 'react-native';
import {
  AppView,
  AppText,
  Card,
  AppHeader,
  Icon,
  AppPressable,
  AppButton,
} from '@gaozh1024/rn-kit';
import { useNavigation } from '@react-navigation/native';
import { useSessionStore } from '../../../store/session.store';
import { settingsSections } from '../../../data/mocks/settings.mock';
import type { MyStackParamList } from '../../../navigation/types';
import type { StackNavigationProp } from '@react-navigation/stack';

type MyNavigationProp = StackNavigationProp<MyStackParamList>;

/**
 * 设置页
 */
export function SettingsScreen() {
  const navigation = useNavigation<MyNavigationProp>();
  const { logout } = useSessionStore();

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
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
    <AppView flex className="bg-gray-50">
      <AppHeader title="设置" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />

      <ScrollView>
        {settingsSections.map(section => (
          <AppView key={section.title} className="mt-4">
            <AppText size="sm" color="gray-500" className="px-4 mb-2">
              {section.title}
            </AppText>
            <Card className="mx-4 overflow-hidden">
              {section.items.map((item, index) => (
                <AppPressable
                  key={item.key}
                  onPress={() => item.type === 'link' && handleItemPress(item.key)}
                >
                  <AppView
                    row
                    items="center"
                    justify="between"
                    className="p-4"
                    style={{
                      borderBottomWidth: index < section.items.length - 1 ? 0.5 : 0,
                      borderBottomColor: '#e5e7eb',
                    }}
                  >
                    <AppText>{item.label}</AppText>
                    {item.type === 'link' ? (
                      <AppView row items="center">
                        <AppText size="sm" color="gray-500">
                          {item.value}
                        </AppText>
                        <Icon name="chevron-right" size={20} color="gray-400" />
                      </AppView>
                    ) : (
                      <AppText size="sm" color="gray-500">
                        {item.value}
                      </AppText>
                    )}
                  </AppView>
                </AppPressable>
              ))}
            </Card>
          </AppView>
        ))}

        {/* 退出登录 */}
        <AppView className="px-4 mt-8 mb-8">
          <AppButton color="danger" variant="outline" onPress={handleLogout}>
            退出登录
          </AppButton>
        </AppView>
      </ScrollView>
    </AppView>
  );
}
