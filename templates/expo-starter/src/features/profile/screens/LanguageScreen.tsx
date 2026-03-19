import React from 'react';
import { ScrollView } from 'react-native';
import { AppView, AppText, Card, AppHeader, Icon, AppPressable } from '@gaozh1024/rn-kit';
import { useNavigation } from '@react-navigation/native';
import { useUIStore } from '../../../store/ui.store';
import { LANGUAGES, type Language } from '../../../bootstrap/constants';

/**
 * 语言设置页
 */
export function LanguageScreen() {
  const navigation = useNavigation();
  const { language, setLanguage } = useUIStore();

  const options: { value: Language; label: string }[] = [
    { value: LANGUAGES.ZH_CN, label: '简体中文' },
    { value: LANGUAGES.EN, label: 'English' },
  ];

  return (
    <AppView flex className="bg-gray-50">
      <AppHeader title="语言设置" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />

      <ScrollView className="p-4">
        <Card className="overflow-hidden">
          {options.map((option, index) => (
            <AppPressable key={option.value} onPress={() => setLanguage(option.value)}>
              <AppView
                row
                items="center"
                className="p-4"
                style={{
                  borderBottomWidth: index < options.length - 1 ? 0.5 : 0,
                  borderBottomColor: '#e5e7eb',
                }}
              >
                <AppText className="flex-1">{option.label}</AppText>
                {language === option.value && <Icon name="check" size={22} color="primary-500" />}
              </AppView>
            </AppPressable>
          ))}
        </Card>
      </ScrollView>
    </AppView>
  );
}
