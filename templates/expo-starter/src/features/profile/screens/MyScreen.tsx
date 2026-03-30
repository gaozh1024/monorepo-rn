import React from 'react';
import {
  AppButton,
  AppFocusedStatusBar,
  AppPressable,
  AppScrollView,
  AppText,
  AppView,
  Col,
  Icon,
  Row,
  useNavigation,
  useTheme,
} from '@gaozh1024/rn-kit';
import { ListItem, ListSection, LogoIcon } from '../../../components/common';
import { appColors } from '../../../bootstrap/theme';
import type { RootNavigationProp } from '../../../navigation/types';
import { useSessionStore } from '../../../store/session.store';

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

function MenuIcon({ icon }: { icon: string }) {
  const { isDark } = useTheme();

  return (
    <AppView
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: isDark ? appColors.slate[700] : appColors.slate[100],
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon name={icon} size={22} color={appColors.primary[500]} />
    </AppView>
  );
}

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
  ] as const;

  const handleMenuPress = (key: (typeof menuGroups)[number]['items'][number]['key']) => {
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
      default:
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
          paddingBottom: 32,
        }}
      >
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
          <Row items="center" justify="between" style={{ marginBottom: 24 }}>
            <AppText size="lg" weight="bold" style={{ color: '#ffffff' }}>
              个人中心
            </AppText>
            <AppPressable
              onPress={() => navigation.navigate('Settings')}
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

            <AppView
              style={{
                height: 1,
                backgroundColor: isDark ? appColors.slate[700] : appColors.slate[100],
                marginVertical: 20,
              }}
            />

            <Row>
              <StatItem value="128" label="已完成" />
              <StatItem value="12" label="进行中" />
              <StatItem value="98%" label="好评率" />
            </Row>
          </AppView>

          <AppView style={{ marginTop: 24 }}>
            {menuGroups.map((group, groupIndex) => (
              <AppView key={group.title} style={{ marginTop: groupIndex > 0 ? 24 : 0 }}>
                <ListSection title={group.title}>
                  {group.items.map((item, index) => (
                    <ListItem
                      key={item.key}
                      left={<MenuIcon icon={item.icon} />}
                      onPress={() => handleMenuPress(item.key)}
                      showDivider={index < group.items.length - 1}
                      right={
                        <Row items="center">
                          {'badge' in item && item.badge ? (
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
                                {item.badge}
                              </AppText>
                            </AppView>
                          ) : null}
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
                        style={{
                          color: isDark ? appColors.slate[100] : appColors.slate[800],
                        }}
                      >
                        {item.label}
                      </AppText>
                    </ListItem>
                  ))}
                </ListSection>
              </AppView>
            ))}

            <AppView style={{ marginTop: 32 }}>
              <AppButton variant="outline" color="error" size="lg" onPress={() => void logout()}>
                退出登录
              </AppButton>
            </AppView>
          </AppView>
        </AppView>
      </AppScrollView>
    </>
  );
}
