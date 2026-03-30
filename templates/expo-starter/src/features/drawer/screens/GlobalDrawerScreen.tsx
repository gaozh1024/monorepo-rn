import React from 'react';
import {
  AppText,
  AppView,
  Icon,
  AppPressable,
  Row,
  Col,
  useNavigation,
  useTheme,
} from '@gaozh1024/rn-kit';
import { useSessionStore } from '../../../store/session.store';
import { LogoIcon } from '../../../components/common';
import { appColors } from '../../../bootstrap/theme';
import type { RootNavigationProp } from '../../../navigation/types';

/**
 * 抽屉菜单项
 */
function DrawerMenuItem({
  icon,
  label,
  description,
  onPress,
  color = 'primary',
}: {
  icon: string;
  label: string;
  description?: string;
  onPress?: () => void;
  color?: 'primary' | 'success' | 'info' | 'warning';
}) {
  const { isDark } = useTheme();

  const colorMap: Record<string, string> = {
    primary: appColors.primary[500],
    success: appColors.success.DEFAULT,
    info: appColors.info.DEFAULT,
    warning: appColors.warning.DEFAULT,
  };

  const iconColor = colorMap[color];

  return (
    <AppPressable onPress={onPress} style={{ marginBottom: 12 }}>
      <AppView
        style={{
          backgroundColor: isDark ? appColors.slate[900] : appColors.slate[50],
          borderRadius: 16,
          padding: 16,
        }}
      >
        <Row items="center">
          <AppView
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: `${iconColor}15`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 14,
            }}
          >
            <Icon name={icon} size={22} color={iconColor} />
          </AppView>
          <Col style={{ flex: 1 }}>
            <AppText
              size="sm"
              weight="semibold"
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
          <Icon
            name="chevron-right"
            size={20}
            color={isDark ? appColors.slate[600] : appColors.slate[300]}
          />
        </Row>
      </AppView>
    </AppPressable>
  );
}

/**
 * 统计徽章
 */
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <Col
      items="center"
      style={{
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 14,
        padding: 12,
        flex: 1,
      }}
    >
      <AppText size="lg" weight="bold" style={{ color: '#ffffff' }}>
        {value}
      </AppText>
      <AppText size="xs" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
        {label}
      </AppText>
    </Col>
  );
}

/**
 * 全局抽屉页 - 现代简约侧边栏设计
 */
export function GlobalDrawerScreen() {
  const { user } = useSessionStore();
  const { isDark } = useTheme();
  const navigation = useNavigation<RootNavigationProp>();

  const quickActions = [
    {
      key: 'userInfo',
      icon: 'person-outline',
      label: '个人资料',
      description: '查看和编辑信息',
      color: 'primary' as const,
    },
    {
      key: 'files',
      icon: 'folder-open',
      label: '我的文件',
      description: '管理您的文档',
      color: 'info' as const,
    },
    {
      key: 'favorites',
      icon: 'bookmark-border',
      label: '收藏夹',
      description: '快速访问重要内容',
      color: 'warning' as const,
    },
    {
      key: 'share',
      icon: 'share',
      label: '分享应用',
      description: '推荐给好友使用',
      color: 'success' as const,
    },
  ] as const;

  const handleQuickAction = (key: (typeof quickActions)[number]['key']) => {
    switch (key) {
      case 'userInfo':
        navigation.navigate('UserInfo');
        break;
      case 'files':
        navigation.navigate('Settings');
        break;
      case 'favorites':
        navigation.navigate('About');
        break;
      case 'share':
        navigation.navigate('About');
        break;
      default:
        break;
    }
  };

  return (
    <AppView
      flex
      style={{
        backgroundColor: isDark ? appColors.slate[950] : appColors.slate[50],
      }}
    >
      {/* 顶部背景区域 */}
      <AppView
        style={{
          backgroundColor: isDark ? appColors.primary[950] : appColors.primary[500],
          paddingTop: 60,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        {/* 关闭按钮 */}
        <Row items="center" justify="between" style={{ marginBottom: 24 }}>
          <AppText size="lg" weight="bold" style={{ color: '#ffffff' }}>
            快捷入口
          </AppText>
          <AppPressable
            onPress={() => navigation.goBack()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.15)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="close" size={20} color="#ffffff" />
          </AppPressable>
        </Row>

        {/* 用户信息摘要 */}
        <Row items="center" style={{ marginBottom: 20 }}>
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
            <LogoIcon size={40} />
          </AppView>
          <Col style={{ marginLeft: 14, flex: 1 }}>
            <AppText size="sm" weight="bold" style={{ color: '#ffffff' }}>
              {user?.name || '访客用户'}
            </AppText>
            <AppText size="xs" style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
              {user?.email || '登录以获得更多功能'}
            </AppText>
          </Col>
        </Row>

        {/* 统计 */}
        <Row style={{ gap: 8 }}>
          <StatBadge value="12" label="待办" />
          <StatBadge value="38" label="已完成" />
          <StatBadge value="5" label="新消息" />
        </Row>
      </AppView>

      {/* 菜单列表 */}
      <AppView
        flex
        style={{
          paddingHorizontal: 16,
          paddingTop: 20,
        }}
      >
        <AppText
          size="xs"
          weight="semibold"
          style={{
            color: isDark ? appColors.slate[500] : appColors.slate[400],
            marginBottom: 16,
            marginLeft: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          快速操作
        </AppText>

        {quickActions.map(action => (
          <DrawerMenuItem
            key={action.key}
            icon={action.icon}
            label={action.label}
            description={action.description}
            color={action.color}
            onPress={() => handleQuickAction(action.key)}
          />
        ))}

        {/* 底部信息 */}
        <AppView style={{ marginTop: 'auto', marginBottom: 20 }}>
          <AppView
            style={{
              backgroundColor: isDark ? `${appColors.primary[500]}10` : appColors.primary[50],
              borderRadius: 20,
              padding: 16,
            }}
          >
            <Row items="center" style={{ gap: 12 }}>
              <AppView
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: appColors.primary[500],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name="headset-mic" size={22} color="#ffffff" />
              </AppView>
              <Col style={{ flex: 1 }}>
                <AppText
                  size="sm"
                  weight="medium"
                  style={{
                    color: isDark ? appColors.slate[200] : appColors.slate[700],
                  }}
                >
                  需要帮助？
                </AppText>
                <AppText
                  size="xs"
                  style={{
                    color: isDark ? appColors.slate[500] : appColors.slate[400],
                    marginTop: 4,
                  }}
                >
                  联系客服获取支持
                </AppText>
              </Col>
              <AppPressable
                style={{
                  backgroundColor: appColors.primary[500],
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <AppText size="xs" weight="medium" style={{ color: '#ffffff' }}>
                  联系
                </AppText>
              </AppPressable>
            </Row>
          </AppView>
        </AppView>
      </AppView>
    </AppView>
  );
}
