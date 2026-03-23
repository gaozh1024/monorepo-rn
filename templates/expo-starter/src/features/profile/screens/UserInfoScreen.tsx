import React from 'react';
import {
  AppText,
  Icon,
  AppPressable,
  AppScreen,
  AppView,
  AppScrollView,
  Row,
  Col,
  useTheme,
  useNavigation,
  AppHeader,
} from '@gaozh1024/rn-kit';
import { useSessionStore } from '../../../store/session.store';
import { appColors } from '../../../bootstrap/theme';

/**
 * 信息项组件
 */
function InfoItem({
  icon,
  label,
  value,
  onPress,
  showDivider = true,
}: {
  icon: string;
  label: string;
  value?: string;
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
          <Icon name={icon} size={20} color={appColors.primary[500]} />
        </AppView>
        <Col style={{ flex: 1 }}>
          <AppText
            size="xs"
            style={{
              color: isDark ? appColors.slate[500] : appColors.slate[400],
            }}
          >
            {label}
          </AppText>
          <AppText
            size="sm"
            weight="medium"
            style={{
              marginTop: 4,
              color: isDark ? appColors.slate[200] : appColors.slate[700],
            }}
          >
            {value || '-'}
          </AppText>
        </Col>
        {onPress && (
          <Icon
            name="edit"
            size={18}
            color={isDark ? appColors.slate[500] : appColors.slate[400]}
          />
        )}
      </Row>
    </AppPressable>
  );
}

/**
 * 用户信息页 - 使用 AppHeader
 */
export function UserInfoScreen() {
  const { user } = useSessionStore();
  const { isDark } = useTheme();
  const navigation = useNavigation();

  const userInfoGroups = [
    {
      title: '基本信息',
      items: [
        { icon: 'badge', label: '姓名', value: user?.name, key: 'name' },
        { icon: 'phone', label: '手机号', value: user?.mobile, key: 'mobile' },
        { icon: 'email', label: '邮箱', value: user?.email, key: 'email' },
      ],
    },
    {
      title: '工作信息',
      items: [
        { icon: 'business', label: '部门', value: user?.department, key: 'department' },
        { icon: 'work-outline', label: '职位', value: user?.role, key: 'role' },
        { icon: 'location-on', label: '办公地点', value: '北京总部', key: 'location' },
      ],
    },
  ];

  return (
    <AppScreen
      style={{
        backgroundColor: isDark ? appColors.slate[950] : '#f1f5f9',
      }}
    >
      <AppHeader title="用户信息" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />
      <AppScrollView
        flex
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
        }}
      >
        {/* 头像区域 */}
        <AppView
          style={{
            backgroundColor: appColors.primary[500],
            borderRadius: 24,
            padding: 32,
            marginBottom: 24,
          }}
        >
          <Col items="center">
            {/* 头像 */}
            <AppView style={{ position: 'relative' }}>
              <AppView
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 32,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 4,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Icon name="person" size={48} color="#ffffff" />
              </AppView>
              <AppPressable
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: 12,
                  backgroundColor: '#ffffff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: appColors.slate[900],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Icon name="camera-alt" size={16} color={appColors.primary[500]} />
              </AppPressable>
            </AppView>

            {/* 姓名和角色 */}
            <AppText size="xl" weight="bold" style={{ color: '#ffffff', marginTop: 20 }}>
              {user?.name || '未设置姓名'}
            </AppText>
            <AppView
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 12,
                marginTop: 10,
              }}
            >
              <AppText size="xs" style={{ color: '#ffffff' }}>
                {user?.role || '普通用户'}
              </AppText>
            </AppView>

            {/* 底部统计 */}
            <Row style={{ marginTop: 24, width: '100%' }}>
              <Col items="center" style={{ flex: 1 }}>
                <AppText size="lg" weight="bold" style={{ color: '#ffffff' }}>
                  128
                </AppText>
                <AppText size="xs" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                  已完成任务
                </AppText>
              </Col>
              <AppView style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <Col items="center" style={{ flex: 1 }}>
                <AppText size="lg" weight="bold" style={{ color: '#ffffff' }}>
                  365
                </AppText>
                <AppText size="xs" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                  加入天数
                </AppText>
              </Col>
              <AppView style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <Col items="center" style={{ flex: 1 }}>
                <AppText size="lg" weight="bold" style={{ color: '#ffffff' }}>
                  98%
                </AppText>
                <AppText size="xs" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                  好评率
                </AppText>
              </Col>
            </Row>
          </Col>
        </AppView>

        {/* 信息分组 */}
        <AppView>
          {userInfoGroups.map((group, groupIndex) => (
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
                  <InfoItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    onPress={() => {}}
                    showDivider={index < group.items.length - 1}
                  />
                ))}
              </AppView>
            </AppView>
          ))}
        </AppView>

        {/* 底部占位 */}
        <AppView style={{ height: 32 }} />
      </AppScrollView>
    </AppScreen>
  );
}
