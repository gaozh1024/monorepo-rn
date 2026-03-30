import React from 'react';
import { AppText, Icon, AppPressable, AppView, Row, Col, useTheme } from '@gaozh1024/rn-kit';
import { PageScreen } from '../../../components/common';
import { useUIStore } from '../../../store/ui.store';
import { THEME_MODES, type ThemeMode } from '../../../bootstrap/constants';
import { appColors } from '../../../bootstrap/theme';

/**
 * 主题选项卡片
 */
function ThemeOption({
  mode,
  label,
  icon,
  description,
  isSelected,
  onSelect,
  previewColors,
}: {
  mode: ThemeMode;
  label: string;
  icon: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  previewColors: { bg: string; card: string; text: string };
}) {
  const { isDark } = useTheme();

  return (
    <AppPressable onPress={onSelect} style={{ marginBottom: 12 }}>
      <AppView
        style={{
          backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
          borderRadius: 20,
          padding: 16,
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
          {/* 预览图 */}
          <AppView
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: previewColors.bg,
              marginRight: 16,
            }}
          >
            <AppView
              style={{
                margin: 8,
                borderRadius: 8,
                flex: 1,
                backgroundColor: previewColors.card,
              }}
            >
              <AppView
                style={{
                  margin: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: previewColors.text,
                  width: '60%',
                }}
              />
              <AppView
                style={{
                  marginHorizontal: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: `${previewColors.text}40`,
                  width: '40%',
                }}
              />
            </AppView>
          </AppView>

          <Col style={{ flex: 1 }}>
            <Row items="center" style={{ gap: 8 }}>
              <Icon
                name={icon}
                size={22}
                color={
                  isSelected
                    ? appColors.primary[500]
                    : isDark
                      ? appColors.slate[400]
                      : appColors.slate[500]
                }
              />
              <AppText
                size="sm"
                weight={isSelected ? 'semibold' : 'normal'}
                style={{
                  color: isDark ? appColors.slate[200] : appColors.slate[700],
                }}
              >
                {label}
              </AppText>
            </Row>
            <AppText
              size="xs"
              style={{
                color: isDark ? appColors.slate[500] : appColors.slate[400],
                marginTop: 6,
              }}
            >
              {description}
            </AppText>
          </Col>

          {/* 选中标记 */}
          {isSelected && (
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
          )}
        </Row>
      </AppView>
    </AppPressable>
  );
}

/**
 * 主题设置页 - 使用 AppHeader
 */
export function ThemeScreen() {
  const { themeMode, setThemeMode } = useUIStore();
  const { isDark } = useTheme();

  const options: {
    value: ThemeMode;
    label: string;
    icon: string;
    description: string;
    preview: { bg: string; card: string; text: string };
  }[] = [
    {
      value: THEME_MODES.LIGHT,
      label: '浅色模式',
      icon: 'wb-sunny',
      description: '明亮的界面，适合日间使用',
      preview: {
        bg: appColors.slate[100],
        card: appColors.slate[50],
        text: appColors.slate[900],
      },
    },
    {
      value: THEME_MODES.DARK,
      label: '深色模式',
      icon: 'nights-stay',
      description: '暗色界面，降低眼睛疲劳',
      preview: {
        bg: appColors.slate[950],
        card: appColors.slate[900],
        text: appColors.slate[50],
      },
    },
    {
      value: THEME_MODES.SYSTEM,
      label: '跟随系统',
      icon: 'settings-suggest',
      description: '自动切换浅色或深色模式',
      preview: {
        bg: isDark ? appColors.slate[950] : appColors.slate[100],
        card: isDark ? appColors.slate[900] : appColors.slate[50],
        text: isDark ? appColors.slate[50] : appColors.slate[900],
      },
    },
  ];

  return (
    <PageScreen
      title="主题模式"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* 当前主题预览 */}
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
          当前预览
        </AppText>
        <AppView
          style={{
            backgroundColor: appColors.primary[500],
            borderRadius: 24,
            padding: 24,
          }}
        >
          <Row items="center">
            <AppView
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                backgroundColor: 'rgba(255,255,255,0.15)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name={isDark ? 'nights-stay' : 'wb-sunny'} size={28} color="#ffffff" />
            </AppView>
            <Col style={{ marginLeft: 16, flex: 1 }}>
              <AppText size="md" weight="bold" style={{ color: '#ffffff' }}>
                {options.find(o => o.value === themeMode)?.label}
              </AppText>
              <AppText size="sm" style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                已启用
              </AppText>
            </Col>
          </Row>
        </AppView>
      </AppView>

      {/* 主题选项 */}
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
          选择主题
        </AppText>
        {options.map(option => (
          <ThemeOption
            key={option.value}
            mode={option.value}
            label={option.label}
            icon={option.icon}
            description={option.description}
            isSelected={themeMode === option.value}
            onSelect={() => setThemeMode(option.value)}
            previewColors={option.preview}
          />
        ))}
      </AppView>

      {/* 提示信息 */}
      <AppView
        style={{
          backgroundColor: isDark ? `${appColors.info.DEFAULT}10` : appColors.info.light,
          borderRadius: 16,
          padding: 16,
          marginTop: 8,
          marginBottom: 16,
        }}
      >
        <Row items="start" style={{ gap: 12 }}>
          <Icon name="info" size={22} color={appColors.info.DEFAULT} />
          <Col style={{ flex: 1 }}>
            <AppText size="sm" weight="medium" style={{ color: appColors.info.DEFAULT }}>
              提示
            </AppText>
            <AppText
              size="xs"
              style={{
                color: appColors.info.DEFAULT,
                opacity: 0.8,
                marginTop: 6,
                lineHeight: 20,
              }}
            >
              选择深色模式可降低屏幕亮度，有助于在暗光环境下减少眼睛疲劳。跟随系统模式会根据设备设置自动切换。
            </AppText>
          </Col>
        </Row>
      </AppView>
    </PageScreen>
  );
}
