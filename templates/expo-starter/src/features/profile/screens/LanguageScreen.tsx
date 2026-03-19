import React from 'react';
import { AppView, AppText, Card, Icon, AppPressable, useThemeColors } from '@gaozh1024/rn-kit';
import { PageScreen } from '../../../components/common';
import { useUIStore } from '../../../store/ui.store';
import { LANGUAGES, type Language } from '../../../bootstrap/constants';

/**
 * 语言设置页
 */
export function LanguageScreen() {
  const { language, setLanguage } = useUIStore();
  const colors = useThemeColors();

  const options: { value: Language; label: string }[] = [
    { value: LANGUAGES.ZH_CN, label: '简体中文' },
    { value: LANGUAGES.EN, label: 'English' },
  ];

  return (
    <PageScreen title="语言设置" p={4}>
      <Card className="overflow-hidden">
        {options.map((option, index) => (
          <AppPressable key={option.value} onPress={() => setLanguage(option.value)}>
            <AppView
              row
              items="center"
              className="p-4"
              style={{
                borderBottomWidth: index < options.length - 1 ? 0.5 : 0,
                borderBottomColor: colors.divider,
              }}
            >
              <AppText className="flex-1">{option.label}</AppText>
              {language === option.value && <Icon name="check" size={22} color="primary-500" />}
            </AppView>
          </AppPressable>
        ))}
      </Card>
    </PageScreen>
  );
}
