import React from 'react';
import { AppText, Icon } from '@gaozh1024/rn-kit';
import { ListItem, ListSection, PageScreen } from '../../../components/common';
import { useUIStore } from '../../../store/ui.store';
import { LANGUAGES, type Language } from '../../../bootstrap/constants';

/**
 * 语言设置页
 */
export function LanguageScreen() {
  const { language, setLanguage } = useUIStore();

  const options: { value: Language; label: string }[] = [
    { value: LANGUAGES.ZH_CN, label: '简体中文' },
    { value: LANGUAGES.EN, label: 'English' },
  ];

  return (
    <PageScreen title="语言设置" p={4}>
      <ListSection className="mt-0" cardClassName="mx-0">
        {options.map((option, index) => (
          <ListItem
            key={option.value}
            onPress={() => setLanguage(option.value)}
            showDivider={index < options.length - 1}
            right={
              language === option.value ? (
                <Icon name="check" size={22} color="primary-500" />
              ) : undefined
            }
          >
            <AppText>{option.label}</AppText>
          </ListItem>
        ))}
      </ListSection>
    </PageScreen>
  );
}
