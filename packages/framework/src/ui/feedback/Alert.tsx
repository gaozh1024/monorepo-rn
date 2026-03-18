import { AppView, AppText, AppPressable } from '../primitives';

/**
 * Alert 组件属性接口
 */
export interface AlertProps {
  /** 弹窗标题 */
  title: string;
  /** 弹窗消息内容 */
  message?: string;
  /** 确认按钮文字，默认为"确认" */
  confirmText?: string;
  /** 取消按钮文字，默认为"取消" */
  cancelText?: string;
  /** 确认按钮回调 */
  onConfirm?: () => void;
  /** 取消按钮回调 */
  onCancel?: () => void;
  /** 是否显示 */
  visible?: boolean;
}

/**
 * Alert - 警告弹窗组件
 *
 * 用于显示重要的确认信息，需要用户做出选择
 * 支持确认和取消两种操作，可单独使用确认按钮
 *
 * @example
 * ```tsx
 * // 基础确认弹窗
 * <Alert
 *   title="确认删除？"
 *   onConfirm={handleDelete}
 * />
 *
 * // 带消息内容
 * <Alert
 *   title="退出登录"
 *   message="确定要退出当前账号吗？"
 *   onConfirm={handleLogout}
 *   onCancel={() => setShowAlert(false)}
 * />
 *
 * // 自定义按钮文字
 * <Alert
 *   title="保存草稿"
 *   message="是否保存当前编辑内容？"
 *   confirmText="保存"
 *   cancelText="不保存"
 *   onConfirm={handleSave}
 *   onCancel={handleDiscard}
 * />
 *
 * // 控制显示
 * const [visible, setVisible] = useState(false);
 * <Alert
 *   title="提示"
 *   message="操作成功"
 *   visible={visible}
 *   confirmText="知道了"
 *   onConfirm={() => setVisible(false)}
 * />
 * ```
 */
export function Alert({
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  visible = true,
}: AlertProps) {
  if (!visible) return null;
  return (
    <AppView center flex className="absolute inset-0 bg-black/50">
      <AppView className="w-80 p-6 bg-white rounded-xl">
        <AppText size="lg" weight="bold" className="text-center">
          {title}
        </AppText>
        {message && <AppText className="mt-2 text-center text-gray-600">{message}</AppText>}
        <AppView row gap={3} className="mt-6">
          {onCancel && (
            <AppPressable onPress={onCancel} className="flex-1 py-3 bg-gray-200 rounded-lg">
              <AppText className="text-center">{cancelText}</AppText>
            </AppPressable>
          )}
          <AppPressable onPress={onConfirm} className="flex-1 py-3 bg-primary-500 rounded-lg">
            <AppText color="white" className="text-center">
              {confirmText}
            </AppText>
          </AppPressable>
        </AppView>
      </AppView>
    </AppView>
  );
}
