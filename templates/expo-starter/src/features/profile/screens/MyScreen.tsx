import React from 'react';
import {
  AppScrollView,
  AppView,
  AppText,
  Icon,
  AppPressable,
  useNavigation,
  Row,
  Col,
  useTheme,
  AppFocusedStatusBar,
} from '@gaozh1024/rn-kit';
import { LogoIcon } from '../../../components/common/Logo';
import { useSessionStore } from '../../../store/session.store';
import type { RootNavigationProp } from '../../../navigation/types';
import { appColors } from '../../../bootstrap/theme';

/**
 * 菜单项组件 - 带白色背景
 */
function MenuItem({
  icon,
  label,
  badge,
  onPress,
  showDivider = true,
}: {
  icon: string;
  label: string;
  badge?: string;
  onPress?: () => void;
  showDivider?: boolean;
}) {
  const { isDark } = useTheme();

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
            backgroundColor: isDark ? appColors.slate[700] : appColors.slate[100],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}
        >
          <Icon name={icon} size={22} color={appColors.primary[500]} />
        </AppView>
        <AppText
          size="sm"
          weight="medium"
          style={{
            flex: 1,
            color: isDark ? appColors.slate[100] : appColors.slate[800],
          }}
        >
          {label}
        </AppText>
        {badge && (
          <AppView
            style={{
              backgroundColor: appColors.error.DEFAULT,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              marginRight: 12,
            }}
          >
            <AppText size="xs" weight="medium" style={{ color: '#ffffff' }}>
              {badge}
            </AppText>
          </AppView>
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
 * 统计数字项
 */
function StatItem({ value, label }: { value: string; label: string }) {
  const { isDark } = useTheme();

  return (
    <Col items="center" style={{ flex: 1 }}>
      <AppText
        size="xl"
        weight="bold"
        style={{
          color: isDark ? appColors.slate[50] : appColors.slate[900],
        }}
      >
        {value}
      </AppText>
      <AppText
        size="xs"
        style={{
          color: isDark ? appColors.slate[400] : appColors.slate[500],
          marginTop: 4,
        }}
      >
        {label}
      </AppText>
    </Col>
  );
}

/**
 * 我的页面 - 现代简约设计 v2
 * 修复StatusBar、列表背景区分
 */
export function MyScreen() {
  const navigation = useNavigation<RootNavigationProp>();
  const { user, logout } = useSessionStore();
  const { isDark } = useTheme();

  const menuGroups = [
    {
      title: '账户管理',
      items: [
        { icon: 'person-outline', label: '用户信息', key: 'userInfo' },
        { icon: 'notifications-none', label: '消息通知', key: 'notifications', badge: '3' },
        { icon: 'shield-outline', label: '安全中心', key: 'security' },
      ],
    },
    {
      title: '应用设置',
      items: [
        { icon: 'settings', label: '设置', key: 'settings' },
        { icon: 'help-outline', label: '帮助与反馈', key: 'help' },
        { icon: 'info-outline', label: '关于我们', key: 'about' },
      ],
    },
  ];

  const handleMenuPress = (key: string) => {
    switch (key) {
      case 'userInfo':
        navigation.navigate('UserInfo');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      case 'about':
        navigation.navigate('About');
        break;
    }
  };

  return (
    <>
      <AppFocusedStatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AppScrollView
        flex
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: isDark ? appColors.slate[950] : '#f1f5f9',
        }}
      >
        {/* 顶部渐变背景区域 */}
        <AppView
          style={{
            backgroundColor: appColors.primary[500],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            paddingTop: 60,
            paddingBottom: 100,
            paddingHorizontal: 20,
          }}
        >
          {/* Header */}
          <Row items="center" justify="between" style={{ marginBottom: 24 }}>
            <AppText size="lg" weight="bold" style={{ color: '#ffffff' }}>
              个人中心
            </AppText>
            <AppPressable
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.15)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name="settings" size={24} color="#ffffff" />
            </AppPressable>
          </Row>
        </AppView>

        {/* 用户信息卡片 - 白色背景带阴影 */}
        <AppView style={{ paddingHorizontal: 20, marginTop: -76 }}>
          <AppView
            style={{
              backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
              borderRadius: 24,
              padding: 24,
              shadowColor: isDark ? '#000000' : appColors.slate[900],
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: isDark ? 0.35 : 0.08,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            <Row items="center">
              {/* 头像 */}
              <AppView
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 24,
                  backgroundColor: appColors.primary[500],
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: appColors.primary[500],
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <LogoIcon size={44} />
              </AppView>

              <Col style={{ marginLeft: 18, flex: 1 }}>
                <AppText
                  size="xl"
                  weight="bold"
                  style={{
                    color: isDark ? appColors.slate[50] : appColors.slate[900],
                  }}
                >
                  {user?.name || '未登录'}
                </AppText>
                <Row items="center" style={{ marginTop: 6 }}>
                  <Icon name="verified" size={18} color={appColors.success.DEFAULT} />
                  <AppText
                    size="sm"
                    style={{
                      color: isDark ? appColors.slate[400] : appColors.slate[500],
                      marginLeft: 6,
                    }}
                  >
                    {user?.role || '普通用户'}
                  </AppText>
                </Row>
              </Col>

              <AppPressable
                onPress={() => navigation.navigate('UserInfo')}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: isDark ? appColors.slate[700] : appColors.slate[100],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name="edit"
                  size={20}
                  color={isDark ? appColors.slate[300] : appColors.slate[500]}
                />
              </AppPressable>
            </Row>

            {/* 分割线 */}
            <AppView
              style={{
                height: 1,
                backgroundColor: isDark ? appColors.slate[700] : appColors.slate[100],
                marginVertical: 20,
              }}
            />

            {/* 统计数据 */}
            <Row>
              <StatItem value="128" label="已完成" />
              <StatItem value="12" label="进行中" />
              <StatItem value="98%" label="好评率" />
            </Row>
          </AppView>
        </AppView>

        {/* 菜单列表 - 白色卡片背景 */}
        <AppView style={{ paddingHorizontal: 20, marginTop: 24 }}>
          {menuGroups.map((group, groupIndex) => (
            <AppView key={group.title} style={{ marginTop: groupIndex > 0 ? 24 : 0 }}>
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
                {group.title}
              </AppText>
              {/* 白色卡片容器 */}
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
                {group.items.map((item, index) => (
                  <MenuItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    onPress={() => handleMenuPress(item.key)}
                    showDivider={index < group.items.length - 1}
                  />
                ))}
              </AppView>
            </AppView>
          ))}

          {/* 退出登录按钮 */}
          <AppView style={{ marginTop: 32, marginBottom: 32 }}>
            <AppPressable onPress={logout}>
              <AppView
                style={{
                  backgroundColor: isDark ? `${appColors.error.DEFAULT}15` : appColors.error.light,
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: 'center',
                }}
              >
                <AppText size="sm" weight="semibold" style={{ color: appColors.error.DEFAULT }}>
                  退出登录
                </AppText>
              </AppView>
            </AppPressable>
          </AppView>
        </AppView>
      </AppScrollView>
    </>
  );
}
