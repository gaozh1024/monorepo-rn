import React from 'react';
import {
  AppText,
  Icon,
  AppPressable,
  useAlert,
  AppView,
  AppScrollView,
  Row,
  Col,
  useTheme,
  useNavigation,
  AppHeader,
} from '@gaozh1024/rn-kit';
import { useSessionStore } from '../../../store/session.store';
import { useUIStore } from '../../../store/ui.store';
import {
  LANGUAGES,
  THEME_MODES,
  type Language,
  type ThemeMode,
} from '../../../bootstrap/constants';
import { appInfo } from '../../../data/mocks/app.mock';
import type { RootNavigationProp } from '../../../navigation/types';
import { appColors } from '../../../bootstrap/theme';

/**
 * 设置项组件
 */
function SettingItem({
  icon,
  label,
  value,
  onPress,
  showDivider = true,
  destructive = false,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showDivider?: boolean;
  destructive?: boolean;
}) {
  const { isDark } = useTheme();

  const iconBgColor = destructive
    ? isDark
      ? `${appColors.error.DEFAULT}15`
      : appColors.error.light
    : isDark
      ? appColors.slate[700]
      : appColors.slate[100];

  const iconColor = destructive ? appColors.error.DEFAULT : appColors.primary[500];

  const textColor = destructive
    ? appColors.error.DEFAULT
    : isDark
      ? appColors.slate[200]
      : appColors.slate[700];

  return (
    <AppPressable onPress={onPress}>
      <Row
        items="center"
        style={{
          paddingVertical: 16,
          paddingHorizontal: 18,
          borderBottomWidth: showDivider ? 1 : 0,
          borderBottomColor: isDark ? appColors.slate[700] : appColors.slate[100],
        }}
      >
        <AppView
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: iconBgColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}
        >
          <Icon name={icon} size={22} color={iconColor} />
        </AppView>
        <AppText size="sm" weight="medium" style={{ flex: 1, color: textColor }}>
          {label}
        </AppText>
        {value && (
          <AppText
            size="xs"
            style={{
              color: isDark ? appColors.slate[500] : appColors.slate[400],
              marginRight: 12,
            }}
          >
            {value}
          </AppText>
        )}
        <Icon
          name="chevron-right"
          size={22}
          color={isDark ? appColors.slate[500] : appColors.slate[300]}
        />
      </Row>
    </AppPressable>
  );
}

/**
 * 开关设置项
 */
function SwitchSettingItem({
  icon,
  label,
  description,
  enabled,
  onToggle,
  showDivider = true,
}: {
  icon: string;
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
  showDivider?: boolean;
}) {
  const { isDark } = useTheme();

  return (
    <AppPressable onPress={onToggle}>
      <Row
        items="center"
        style={{
          paddingVertical: 16,
          paddingHorizontal: 18,
          borderBottomWidth: showDivider ? 1 : 0,
          borderBottomColor: isDark ? appColors.slate[700] : appColors.slate[100],
        }}
      >
        <AppView
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: isDark ? appColors.slate[700] : appColors.slate[100],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}
        >
          <Icon name={icon} size={22} color={appColors.primary[500]} />
        </AppView>
        <Col style={{ flex: 1 }}>
          <AppText
            size="sm"
            weight="medium"
            style={{
              color: isDark ? appColors.slate[200] : appColors.slate[700],
            }}
          >
            {label}
          </AppText>
          {description && (
            <AppText
              size="xs"
              style={{
                color: isDark ? appColors.slate[500] : appColors.slate[400],
                marginTop: 4,
              }}
            >
              {description}
            </AppText>
          )}
        </Col>
        <AppView
          style={{
            width: 52,
            height: 32,
            borderRadius: 16,
            backgroundColor: enabled
              ? appColors.primary[500]
              : isDark
                ? appColors.slate[600]
                : appColors.slate[300],
            justifyContent: 'center',
            paddingHorizontal: 4,
          }}
        >
          <AppView
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#ffffff',
              transform: [{ translateX: enabled ? 20 : 0 }],
            }}
          />
        </AppView>
      </Row>
    </AppPressable>
  );
}

/**
 * 设置页 - 使用 AppHeader
 */
export function SettingsScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { logout } = useSessionStore();
  const { themeMode, language, setThemeMode, setLanguage } = useUIStore();
  const { confirm } = useAlert();
  const { isDark } = useTheme();

  const [notifications, setNotifications] = React.useState(true);
  const [autoUpdate, setAutoUpdate] = React.useState(false);

  const themeLabelMap: Record<ThemeMode, string> = {
    [THEME_MODES.LIGHT]: '浅色模式',
    [THEME_MODES.DARK]: '深色模式',
    [THEME_MODES.SYSTEM]: '跟随系统',
  };

  const languageLabelMap: Record<Language, string> = {
    [LANGUAGES.ZH_CN]: '简体中文',
    [LANGUAGES.EN]: 'English',
  };

  const handleLogout = () => {
    confirm({
      title: '确认退出',
      message: '确定要退出登录吗？',
      cancelText: '取消',
      confirmText: '确定',
      onConfirm: () => void logout(),
    });
  };

  return (
    <AppView
      flex
      style={{
        backgroundColor: isDark ? appColors.slate[950] : '#f1f5f9',
      }}
    >
      <AppHeader title="设置" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />
      <AppScrollView
        flex
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
        }}
      >
        {/* 外观设置 */}
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
          外观
        </AppText>
        <AppView
          style={{
            backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24,
            shadowColor: isDark ? '#000000' : appColors.slate[900],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.25 : 0.04,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <SettingItem
            icon="palette"
            label="主题模式"
            value={themeLabelMap[themeMode]}
            onPress={() => navigation.navigate('Theme')}
            showDivider
          />
          <SettingItem
            icon="language"
            label="语言设置"
            value={languageLabelMap[language]}
            onPress={() => navigation.navigate('Language')}
            showDivider={false}
          />
        </AppView>

        {/* 通知设置 */}
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
          通知
        </AppText>
        <AppView
          style={{
            backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24,
            shadowColor: isDark ? '#000000' : appColors.slate[900],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.25 : 0.04,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <SwitchSettingItem
            icon="notifications-none"
            label="推送通知"
            description="接收应用更新和消息提醒"
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
            showDivider
          />
          <SwitchSettingItem
            icon="update"
            label="自动更新"
            description="Wi-Fi 环境下自动下载更新"
            enabled={autoUpdate}
            onToggle={() => setAutoUpdate(!autoUpdate)}
            showDivider={false}
          />
        </AppView>

        {/* 关于 */}
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
          关于
        </AppText>
        <AppView
          style={{
            backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24,
            shadowColor: isDark ? '#000000' : appColors.slate[900],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.25 : 0.04,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <SettingItem
            icon="info-outline"
            label="关于我们"
            onPress={() => navigation.navigate('About')}
            showDivider
          />
          <SettingItem icon="description" label="用户协议" onPress={() => {}} showDivider />
          <SettingItem icon="policy" label="隐私政策" onPress={() => {}} showDivider />
          <SettingItem
            icon="smartphone"
            label="版本号"
            value={`v${appInfo.version}`}
            showDivider={false}
          />
        </AppView>

        {/* 退出登录 */}
        <AppView style={{ marginBottom: 32 }}>
          <AppView
            style={{
              backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: isDark ? '#000000' : appColors.slate[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.25 : 0.04,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <SettingItem
              icon="logout"
              label="退出登录"
              onPress={handleLogout}
              showDivider={false}
              destructive
            />
          </AppView>
        </AppView>
      </AppScrollView>
    </AppView>
  );
}
