import React from 'react';
import { AppText, Icon, AppPressable, AppView, Row, Col, useTheme } from '@gaozh1024/rn-kit';
import { PageScreen } from '../../../components/common';
import { useUIStore } from '../../../store/ui.store';
import { LANGUAGES, type Language } from '../../../bootstrap/constants';
import { appColors } from '../../../bootstrap/theme';

/**
 * 语言选项卡片
 */
function LanguageOption({
  code,
  name,
  nativeName,
  flag,
  isSelected,
  onSelect,
}: {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { isDark } = useTheme();

  return (
    <AppPressable onPress={onSelect} style={{ marginBottom: 12 }}>
      <AppView
        style={{
          backgroundColor: isSelected
            ? isDark
              ? `${appColors.primary[500]}15`
              : appColors.primary[50]
            : isDark
              ? appColors.slate[800]
              : '#ffffff',
          borderRadius: 20,
          padding: 18,
          borderWidth: 2,
          borderColor: isSelected
            ? appColors.primary[500]
            : isDark
              ? appColors.slate[700]
              : appColors.slate[100],
          shadowColor: isDark ? '#000000' : appColors.slate[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.25 : 0.04,
          shadowRadius: 8,
          elevation: isSelected ? 4 : 2,
        }}
      >
        <Row items="center">
          {/* 国旗/语言标识 */}
          <AppView
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: isDark ? appColors.slate[700] : appColors.slate[100],
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}
          >
            <AppText size="3xl">{flag}</AppText>
          </AppView>

          <Col style={{ flex: 1 }}>
            <AppText
              size="md"
              weight={isSelected ? 'semibold' : 'normal'}
              style={{
                color: isSelected
                  ? appColors.primary[500]
                  : isDark
                    ? appColors.slate[200]
                    : appColors.slate[700],
              }}
            >
              {name}
            </AppText>
            <AppText
              size="sm"
              style={{
                color: isDark ? appColors.slate[500] : appColors.slate[400],
                marginTop: 4,
              }}
            >
              {nativeName}
            </AppText>
          </Col>

          {/* 选中标记 */}
          {isSelected ? (
            <AppView
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: appColors.primary[500],
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name="check" size={18} color="#ffffff" />
            </AppView>
          ) : (
            <AppView
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: isDark ? appColors.slate[600] : appColors.slate[300],
              }}
            />
          )}
        </Row>
      </AppView>
    </AppPressable>
  );
}

/**
 * 语言设置页 - 使用 AppHeader
 */
export function LanguageScreen() {
  const { language, setLanguage } = useUIStore();
  const { isDark } = useTheme();

  const options: {
    value: Language;
    name: string;
    nativeName: string;
    flag: string;
  }[] = [
    { value: LANGUAGES.ZH_CN, name: '简体中文', nativeName: 'Simplified Chinese', flag: '🇨🇳' },
    { value: LANGUAGES.EN, name: 'English', nativeName: 'English', flag: '🇬🇧' },
  ];

  return (
    <PageScreen
      title="语言设置"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* 当前语言 */}
      <AppView style={{ marginBottom: 24 }}>
        <AppText
          size="xs"
          weight="semibold"
          style={{
            color: isDark ? appColors.slate[500] : appColors.slate[500],
            marginBottom: 12,
            marginLeft: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          当前语言
        </AppText>
        <AppView
          style={{
            backgroundColor: isDark ? `${appColors.primary[500]}15` : appColors.primary[50],
            borderRadius: 20,
            padding: 20,
            borderWidth: 2,
            borderColor: isDark ? `${appColors.primary[500]}30` : appColors.primary[200],
          }}
        >
          <Row items="center">
            <AppView
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                backgroundColor: isDark ? `${appColors.primary[500]}25` : appColors.primary[100],
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 18,
              }}
            >
              <AppText size="3xl">{options.find(o => o.value === language)?.flag}</AppText>
            </AppView>
            <Col style={{ flex: 1 }}>
              <AppText size="md" weight="bold" style={{ color: appColors.primary[500] }}>
                {options.find(o => o.value === language)?.name}
              </AppText>
              <AppText
                size="sm"
                style={{
                  color: isDark ? appColors.slate[400] : appColors.slate[500],
                  marginTop: 4,
                }}
              >
                {options.find(o => o.value === language)?.nativeName}
              </AppText>
            </Col>
            <Icon name="check-circle" size={32} color={appColors.primary[500]} />
          </Row>
        </AppView>
      </AppView>

      {/* 可用语言 */}
      <AppView>
        <AppText
          size="xs"
          weight="semibold"
          style={{
            color: isDark ? appColors.slate[500] : appColors.slate[500],
            marginBottom: 12,
            marginLeft: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          可用语言
        </AppText>
        {options.map(option => (
          <LanguageOption
            key={option.value}
            code={option.value}
            name={option.name}
            nativeName={option.nativeName}
            flag={option.flag}
            isSelected={language === option.value}
            onSelect={() => setLanguage(option.value)}
          />
        ))}
      </AppView>

      {/* 提示信息 */}
      <AppView
        style={{
          backgroundColor: isDark ? `${appColors.warning.DEFAULT}10` : appColors.warning.light,
          borderRadius: 16,
          padding: 16,
          marginTop: 8,
          marginBottom: 16,
        }}
      >
        <Row items="start" style={{ gap: 12 }}>
          <Icon name="translate" size={22} color={appColors.warning.DEFAULT} />
          <Col style={{ flex: 1 }}>
            <AppText size="sm" weight="medium" style={{ color: appColors.warning.DEFAULT }}>
              更多语言即将到来
            </AppText>
            <AppText
              size="xs"
              style={{
                color: appColors.warning.DEFAULT,
                opacity: 0.8,
                marginTop: 6,
                lineHeight: 20,
              }}
            >
              我们正在努力支持更多语言。如果您希望添加特定语言的支持，请通过反馈渠道告知我们。
            </AppText>
          </Col>
        </Row>
      </AppView>
    </PageScreen>
  );
}
