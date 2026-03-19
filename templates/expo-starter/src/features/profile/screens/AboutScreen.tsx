import React from 'react';
import { ScrollView } from 'react-native';
import { AppView, AppText, Card, AppHeader, Center } from '@gaozh1024/rn-kit';
import { useNavigation } from '@react-navigation/native';
import { Logo, LogoIcon } from '../../../components/common/Logo';
import { appConfig } from '../../../bootstrap/app-config';
import { appInfo } from '../../../data/mocks/app.mock';

/**
 * 关于我们页
 */
export function AboutScreen() {
  const navigation = useNavigation();

  return (
    <AppView flex className="bg-gray-50">
      <AppHeader title="关于我们" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />

      <ScrollView>
        {/* Logo 区域 */}
        <Center className="py-12">
          <Logo size="lg" textColor="#171717" />
        </Center>

        {/* 信息列表 */}
        <Card className="mx-4 overflow-hidden">
          {[
            { label: '版本号', value: appInfo.version },
            { label: '构建号', value: appInfo.buildNumber },
            { label: '环境', value: appInfo.environment },
          ].map((item, index, arr) => (
            <AppView
              key={item.label}
              row
              items="center"
              justify="between"
              className="p-4"
              style={{
                borderBottomWidth: index < arr.length - 1 ? 0.5 : 0,
                borderBottomColor: '#e5e7eb',
              }}
            >
              <AppText color="gray-500">{item.label}</AppText>
              <AppText>{item.value}</AppText>
            </AppView>
          ))}
        </Card>

        {/* 版权信息 */}
        <Center className="mt-8 px-8">
          <AppText size="xs" color="gray-400" className="text-center">
            © 2024 Panther Team. All rights reserved.
          </AppText>
          <AppText size="xs" color="gray-400" className="text-center mt-2">
            基于 @gaozh1024/rn-kit 构建
          </AppText>
        </Center>
      </ScrollView>
    </AppView>
  );
}
