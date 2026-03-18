import { AppView, AppText } from '../primitives';
import { cn } from '@/utils';

/**
 * Toast 组件属性接口
 */
export interface ToastProps {
  /** 提示消息内容 */
  message: string;
  /** 提示类型，决定背景颜色 */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** 是否显示 */
  visible?: boolean;
}

/** 类型样式映射表 */
const typeStyles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

/**
 * Toast - 轻提示组件
 *
 * 用于显示简短的操作反馈信息，自动根据类型显示不同颜色
 * 通常配合 Toast 管理器使用，支持自动消失
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Toast message="操作成功" />
 *
 * // 不同类型
 * <Toast message="保存成功" type="success" />
 * <Toast message="网络错误" type="error" />
 * <Toast message="请注意" type="warning" />
 * <Toast message="提示信息" type="info" />
 *
 * // 控制显示
 * <Toast
 *   message="正在加载..."
 *   type="info"
 *   visible={isLoading}
 * />
 *
 * // 配合管理器使用
 * const { showToast } = useToast();
 * showToast({ message: '操作成功', type: 'success' });
 * ```
 */
export function Toast({ message, type = 'info', visible = true }: ToastProps) {
  if (!visible) return null;
  return (
    <AppView className={cn('px-4 py-3 rounded-lg', typeStyles[type])}>
      <AppText color="white">{message}</AppText>
    </AppView>
  );
}
