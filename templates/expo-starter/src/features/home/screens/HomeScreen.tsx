import React from 'react';
import {
  AppScrollView,
  AppView,
  AppText,
  AppPressable,
  Icon,
  AppFocusedStatusBar,
  useTheme,
  useNavigation,
  Row,
  Col,
} from '@gaozh1024/rn-kit';
import { homeStats, quickActions } from '../../../data/mocks/home.mock';
import { useSessionStore } from '../../../store/session.store';
import { appColors } from '../../../bootstrap/theme';
import type { RootNavigationProp } from '../../../navigation/types';

/**
 * 统计卡片组件 - 带阴影
 */
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  const { isDark } = useTheme();

  return (
    <AppView
      style={{
        flex: 1,
        backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 4,
        shadowColor: isDark ? '#000000' : appColors.slate[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <AppView
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: `${color}15`,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Icon name={icon} size={22} color={color} />
      </AppView>
      <AppText
        size="2xl"
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
    </AppView>
  );
}

/**
 * 快捷入口按钮 - 紧凑设计
 */
function QuickActionButton({
  title,
  icon,
  color,
  onPress,
}: {
  title: string;
  icon: string;
  color: string;
  onPress?: () => void;
}) {
  const { isDark } = useTheme();

  return (
    <AppPressable onPress={onPress} style={{ flex: 1 }}>
      <AppView
        style={{
          backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
          borderRadius: 16,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: isDark ? '#000000' : appColors.slate[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.25 : 0.04,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <AppView
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: `${color}12`,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Icon name={icon} size={20} color={color} />
        </AppView>
        <AppText
          size="sm"
          weight="medium"
          style={{
            flex: 1,
            color: isDark ? appColors.slate[200] : appColors.slate[700],
          }}
        >
          {title}
        </AppText>
      </AppView>
    </AppPressable>
  );
}

/**
 * 首页 - 现代简约设计 v2
 * 添加阴影、Tab导航分层、紧凑快捷入口
 */
export function HomeScreen() {
  const { user } = useSessionStore();
  const { isDark } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const statColors = [appColors.primary[500], appColors.success.DEFAULT, appColors.info.DEFAULT];

  const actionColors = [
    appColors.primary[500],
    appColors.info.DEFAULT,
    appColors.success.DEFAULT,
    appColors.warning.DEFAULT,
  ];

  const actionIcons = ['person-outline', 'settings', 'palette', 'language'];

  // 快捷入口点击处理
  const handleQuickAction = (key: string) => {
    switch (key) {
      case 'profile':
        navigation.navigate('UserInfo');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      case 'theme':
        navigation.navigate('Theme');
        break;
      case 'language':
        navigation.navigate('Language');
        break;
    }
  };

  return (
    <>
      <AppFocusedStatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <AppView flex style={{ backgroundColor: isDark ? appColors.slate[950] : '#f1f5f9' }}>
        {/* 顶部渐变区域 */}
        <AppView
          style={{
            backgroundColor: appColors.primary[500],
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            paddingTop: 60,
            paddingBottom: 90,
            paddingHorizontal: 20,
          }}
        >
          {/* Header */}
          <Row items="center" justify="between" style={{ marginBottom: 28 }}>
            <Row items="center">
              <AppView
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 14,
                }}
              >
                <Icon name="person" size={24} color="#ffffff" />
              </AppView>
              <Col>
                <AppText size="xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  欢迎回来
                </AppText>
                <AppText size="lg" weight="bold" style={{ color: '#ffffff', marginTop: 2 }}>
                  {user?.name || '用户'}
                </AppText>
              </Col>
            </Row>
            <AppPressable
              onPress={() => navigation.navigate('GlobalDrawer')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.15)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name="notifications-none" size={24} color="#ffffff" />
            </AppPressable>
          </Row>

          {/* 主标题 */}
          <AppText size="2xl" weight="bold" style={{ color: '#ffffff', marginBottom: 8 }}>
            工作台
          </AppText>
          <AppText size="sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
            今天是个好日子，开始工作吧！
          </AppText>
        </AppView>

        {/* 统计卡片 - 浮动带阴影 */}
        <AppView style={{ paddingHorizontal: 12, marginTop: -56 }}>
          <Row>
            {homeStats.map((stat, index) => (
              <StatCard
                key={stat.key}
                label={stat.label}
                value={stat.value}
                icon={
                  stat.key === 'tasks' ? 'schedule' : stat.key === 'done' ? 'check-circle' : 'mail'
                }
                color={statColors[index] || statColors[0]}
              />
            ))}
          </Row>
        </AppView>

        {/* Banner 区域 */}
        <AppView style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <AppView
            style={{
              backgroundColor: isDark ? `${appColors.primary[900]}80` : appColors.primary[50],
              borderRadius: 24,
              padding: 24,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: isDark ? '#000000' : appColors.primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.2 : 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <AppView style={{ flex: 1 }}>
              <AppText
                size="lg"
                weight="bold"
                style={{
                  color: isDark ? appColors.primary[300] : appColors.primary[700],
                  marginBottom: 6,
                }}
              >
                新功能上线
              </AppText>
              <AppText
                size="sm"
                style={{
                  color: isDark ? appColors.primary[400] : appColors.primary[600],
                }}
              >
                探索更多高效工作方式
              </AppText>
              <AppPressable
                style={{
                  marginTop: 16,
                  backgroundColor: appColors.primary[500],
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignSelf: 'flex-start',
                  shadowColor: appColors.primary[500],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <AppText size="xs" weight="semibold" style={{ color: '#ffffff' }}>
                  了解更多
                </AppText>
              </AppPressable>
            </AppView>
            <AppView
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: isDark
                  ? `${appColors.primary[700]}40`
                  : `${appColors.primary[500]}15`,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 16,
              }}
            >
              <Icon
                name="rocket-launch"
                size={32}
                color={isDark ? appColors.primary[400] : appColors.primary[500]}
              />
            </AppView>
          </AppView>
        </AppView>

        {/* 快捷入口 - 紧凑2x2网格 */}
        <AppView style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Row items="center" justify="between" style={{ marginBottom: 16 }}>
            <AppText
              size="sm"
              weight="semibold"
              style={{
                color: isDark ? appColors.slate[200] : appColors.slate[700],
              }}
            >
              快捷入口
            </AppText>
            <AppPressable>
              <AppText size="xs" style={{ color: appColors.primary[500] }}>
                查看全部
              </AppText>
            </AppPressable>
          </Row>
          {/* 2x2 紧凑网格 */}
          <Row gap={10} style={{ marginBottom: 10 }}>
            <QuickActionButton
              title="个人资料"
              icon={actionIcons[0]}
              color={actionColors[0]}
              onPress={() => handleQuickAction('profile')}
            />
            <QuickActionButton
              title="设置"
              icon={actionIcons[1]}
              color={actionColors[1]}
              onPress={() => handleQuickAction('settings')}
            />
          </Row>
          <Row gap={10}>
            <QuickActionButton
              title="主题"
              icon={actionIcons[2]}
              color={actionColors[2]}
              onPress={() => handleQuickAction('theme')}
            />
            <QuickActionButton
              title="语言"
              icon={actionIcons[3]}
              color={actionColors[3]}
              onPress={() => handleQuickAction('language')}
            />
          </Row>
        </AppView>

        {/* 最近活动 */}
        <AppView style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <AppText
            size="sm"
            weight="semibold"
            style={{
              color: isDark ? appColors.slate[200] : appColors.slate[700],
              marginBottom: 16,
            }}
          >
            最近活动
          </AppText>
          <AppView
            style={{
              backgroundColor: isDark ? appColors.slate[800] : '#ffffff',
              borderRadius: 20,
              padding: 18,
              shadowColor: isDark ? '#000000' : appColors.slate[900],
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.25 : 0.04,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Row items="center">
              <AppView
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: `${appColors.success.DEFAULT}12`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Icon name="update" size={24} color={appColors.success.DEFAULT} />
              </AppView>
              <Col style={{ flex: 1 }}>
                <AppText
                  size="sm"
                  weight="medium"
                  style={{
                    color: isDark ? appColors.slate[200] : appColors.slate[700],
                  }}
                >
                  系统更新完成
                </AppText>
                <AppText
                  size="xs"
                  style={{
                    color: isDark ? appColors.slate[500] : appColors.slate[400],
                    marginTop: 4,
                  }}
                >
                  2 小时前
                </AppText>
              </Col>
              <Icon
                name="chevron-right"
                size={20}
                color={isDark ? appColors.slate[600] : appColors.slate[300]}
              />
            </Row>
          </AppView>
        </AppView>

        {/* 底部占位 */}
        <AppView style={{ height: 32 }} />
      </AppView>
    </>
  );
}
