import React from 'react';
import {
  AppButton,
  AppText,
  AppView,
  Col,
  Icon,
  Row,
  Switch,
  useAlert,
  useNavigation,
  useTheme,
} from '@gaozh1024/rn-kit';
import { ListItem, ListSection, PageScreen } from '../../../components/common';
import {
  LANGUAGES,
  THEME_MODES,
  type Language,
  type ThemeMode,
} from '../../../bootstrap/constants';
import { appColors } from '../../../bootstrap/theme';
import { appInfo } from '../../../data/mocks/app.mock';
import type { RootNavigationProp } from '../../../navigation/types';
import { useSessionStore } from '../../../store/session.store';
import { useUIStore } from '../../../store/ui.store';

function SettingIcon({ icon, destructive = false }: { icon: string; destructive?: boolean }) {
  const { isDark } = useTheme();

  return (
    <AppView
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: destructive
          ? isDark
            ? `${appColors.error.DEFAULT}15`
            : appColors.error.light
          : isDark
            ? appColors.slate[700]
            : appColors.slate[100],
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon
        name={icon}
        size={22}
        color={destructive ? appColors.error.DEFAULT : appColors.primary[500]}
      />
    </AppView>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { logout } = useSessionStore();
  const { themeMode, language } = useUIStore();
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
    <PageScreen
      title="设置"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
    >
      <ListSection title="外观">
        <ListItem
          left={<SettingIcon icon="palette" />}
          onPress={() => navigation.navigate('Theme')}
          showDivider
          right={
            <Row items="center">
              <AppText
                size="xs"
                style={{
                  color: isDark ? appColors.slate[500] : appColors.slate[400],
                  marginRight: 12,
                }}
              >
                {themeLabelMap[themeMode]}
              </AppText>
              <Icon
                name="chevron-right"
                size={22}
                color={isDark ? appColors.slate[500] : appColors.slate[300]}
              />
            </Row>
          }
        >
          <AppText
            size="sm"
            weight="medium"
            style={{ color: isDark ? appColors.slate[200] : appColors.slate[700] }}
          >
            主题模式
          </AppText>
        </ListItem>
        <ListItem
          left={<SettingIcon icon="language" />}
          onPress={() => navigation.navigate('Language')}
          right={
            <Row items="center">
              <AppText
                size="xs"
                style={{
                  color: isDark ? appColors.slate[500] : appColors.slate[400],
                  marginRight: 12,
                }}
              >
                {languageLabelMap[language]}
              </AppText>
              <Icon
                name="chevron-right"
                size={22}
                color={isDark ? appColors.slate[500] : appColors.slate[300]}
              />
            </Row>
          }
        >
          <AppText
            size="sm"
            weight="medium"
            style={{ color: isDark ? appColors.slate[200] : appColors.slate[700] }}
          >
            语言设置
          </AppText>
        </ListItem>
      </ListSection>

      <AppView style={{ marginTop: 24 }}>
        <ListSection title="通知">
          <ListItem
            left={<SettingIcon icon="notifications-none" />}
            showDivider
            right={
              <Switch checked={notifications} onChange={() => setNotifications(!notifications)} />
            }
          >
            <Col style={{ flex: 1 }}>
              <AppText
                size="sm"
                weight="medium"
                style={{ color: isDark ? appColors.slate[200] : appColors.slate[700] }}
              >
                推送通知
              </AppText>
              <AppText
                size="xs"
                style={{
                  color: isDark ? appColors.slate[500] : appColors.slate[400],
                  marginTop: 4,
                }}
              >
                接收应用更新和消息提醒
              </AppText>
            </Col>
          </ListItem>
          <ListItem
            left={<SettingIcon icon="update" />}
            right={<Switch checked={autoUpdate} onChange={() => setAutoUpdate(!autoUpdate)} />}
          >
            <Col style={{ flex: 1 }}>
              <AppText
                size="sm"
                weight="medium"
                style={{ color: isDark ? appColors.slate[200] : appColors.slate[700] }}
              >
                自动更新
              </AppText>
              <AppText
                size="xs"
                style={{
                  color: isDark ? appColors.slate[500] : appColors.slate[400],
                  marginTop: 4,
                }}
              >
                Wi-Fi 环境下自动下载更新
              </AppText>
            </Col>
          </ListItem>
        </ListSection>
      </AppView>

      <AppView style={{ marginTop: 24 }}>
        <ListSection title="关于">
          <ListItem
            left={<SettingIcon icon="info-outline" />}
            onPress={() => navigation.navigate('About')}
            showDivider
            right={
              <Icon
                name="chevron-right"
                size={22}
                color={isDark ? appColors.slate[500] : appColors.slate[300]}
              />
            }
          >
            <AppText
              size="sm"
              weight="medium"
              style={{ color: isDark ? appColors.slate[200] : appColors.slate[700] }}
            >
              关于我们
            </AppText>
          </ListItem>
          <ListItem
            left={<SettingIcon icon="description" />}
            onPress={() => {}}
            showDivider
            right={
              <Icon
                name="chevron-right"
                size={22}
                color={isDark ? appColors.slate[500] : appColors.slate[300]}
              />
            }
          >
            <AppText
              size="sm"
              weight="medium"
              style={{ color: isDark ? appColors.slate[200] : appColors.slate[700] }}
            >
              用户协议
            </AppText>
          </ListItem>
          <ListItem
            left={<SettingIcon icon="policy" />}
            onPress={() => {}}
            showDivider
            right={
              <Icon
                name="chevron-right"
                size={22}
                color={isDark ? appColors.slate[500] : appColors.slate[300]}
              />
            }
          >
            <AppText
              size="sm"
              weight="medium"
              style={{ color: isDark ? appColors.slate[200] : appColors.slate[700] }}
            >
              隐私政策
            </AppText>
          </ListItem>
          <ListItem
            left={<SettingIcon icon="smartphone" />}
            right={
              <AppText
                size="xs"
                style={{ color: isDark ? appColors.slate[500] : appColors.slate[400] }}
              >
                v{appInfo.version}
              </AppText>
            }
          >
            <AppText
              size="sm"
              weight="medium"
              style={{ color: isDark ? appColors.slate[200] : appColors.slate[700] }}
            >
              版本号
            </AppText>
          </ListItem>
        </ListSection>
      </AppView>

      <AppView style={{ marginTop: 32 }}>
        <AppButton variant="outline" color="error" size="lg" onPress={handleLogout}>
          退出登录
        </AppButton>
      </AppView>
    </PageScreen>
  );
}
