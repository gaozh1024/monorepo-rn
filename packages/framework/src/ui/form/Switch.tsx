import { Switch as RNSwitch } from 'react-native';
import { AppView, AppText } from '@/ui/primitives';
import { useTheme } from '@/theme';
import { cn } from '@/utils';

/**
 * Switch 组件属性接口
 */
export interface SwitchProps {
  /** 是否开启 */
  checked?: boolean;
  /** 状态变化回调 */
  onChange?: (checked: boolean) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 开关颜色 */
  color?: string;
  /** 开关尺寸：sm(小)、md(中)、lg(大) */
  size?: 'sm' | 'md' | 'lg';
  /** 开关标签内容 */
  children?: React.ReactNode;
  /** 自定义样式 */
  className?: string;
}

/** 尺寸映射表 */
const sizeMap = {
  sm: { scale: 0.8, height: 28 },
  md: { scale: 1, height: 32 },
  lg: { scale: 1.2, height: 36 },
};

/**
 * Switch - 开关组件
 *
 * 用于表示两种状态的切换，常用于设置项的开启/关闭
 * 支持自定义颜色、尺寸和标签，提供流畅的交互体验
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Switch checked={enabled} onChange={setEnabled} />
 *
 * // 带标签
 * <Switch checked={notifications} onChange={setNotifications}>
 *   接收通知
 * </Switch>
 *
 * // 禁用状态
 * <Switch checked={true} disabled>
 *   不可更改
 * </Switch>
 *
 * // 不同尺寸
 * <Switch checked={value} onChange={setValue} size="sm" />
 * <Switch checked={value} onChange={setValue} size="lg" />
 *
 * // 自定义颜色
 * <Switch checked={darkMode} onChange={setDarkMode} color="purple-500">
 *   深色模式
 * </Switch>
 *
 * // 设置列表中使用
 * <Col className="bg-white rounded-lg">
 *   <Row justify="between" items="center" className="p-4 border-b border-gray-100">
 *     <AppText>消息推送</AppText>
 *     <Switch checked={pushEnabled} onChange={setPushEnabled} />
 *   </Row>
 *   <Row justify="between" items="center" className="p-4 border-b border-gray-100">
 *     <AppText>声音提醒</AppText>
 *     <Switch checked={soundEnabled} onChange={setSoundEnabled} />
 *   </Row>
 *   <Row justify="between" items="center" className="p-4">
 *     <AppText>自动更新</AppText>
 *     <Switch checked={autoUpdate} onChange={setAutoUpdate} />
 *   </Row>
 * </Col>
 * ```
 */
export function Switch({
  checked = false,
  onChange,
  disabled = false,
  color = 'primary-500',
  size = 'md',
  children,
  className,
}: SwitchProps) {
  const { theme } = useTheme();
  const { scale } = sizeMap[size];

  const trackColor = theme.colors[color.split('-')[0]];
  const trackColorValue = trackColor?.[500] || '#f38b32';

  return (
    <AppView row items="center" gap={3} className={cn(disabled && 'opacity-50', className)}>
      <RNSwitch
        value={checked}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: '#d1d5db', true: trackColorValue }}
        thumbColor={checked ? trackColorValue : '#f9fafb'}
        style={{ transform: [{ scale }] }}
      />
      {children && <AppText className={checked ? '' : 'text-gray-600'}>{children}</AppText>}
    </AppView>
  );
}
