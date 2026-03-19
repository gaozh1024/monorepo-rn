import { ActivityIndicator } from 'react-native';
import { AppView, AppText } from '../primitives';

/**
 * Loading 组件属性接口
 */
export interface LoadingProps {
  /** 加载提示文字 */
  text?: string;
  /** 指示器颜色 */
  color?: string;
  /** 是否显示遮罩层 */
  overlay?: boolean;
  /** 是否显示 */
  visible?: boolean;
  /** 测试 ID */
  testID?: string;
}

/**
 * Loading - 加载指示器组件
 *
 * 用于显示操作正在进行的视觉反馈，支持内联和遮罩两种模式
 * 遮罩模式会覆盖整个屏幕，阻止用户操作
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Loading />
 *
 * // 带提示文字
 * <Loading text="正在加载..." />
 *
 * // 遮罩模式（全屏）
 * <Loading overlay text="保存中..." />
 *
 * // 条件显示
 * {isLoading && <Loading text="加载中" />}
 *
 * // 配合请求使用
 * const [loading, setLoading] = useState(false);
 *
 * const fetchData = async () => {
 *   setLoading(true);
 *   try {
 *     const data = await api.getData();
 *     setData(data);
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 *
 * return (
 *   <>
 *     <FlatList data={data} renderItem={renderItem} />
 *     <Loading overlay visible={loading} text="加载中..." />
 *   </>
 * );
 * ```
 */
export function Loading({ text, color, overlay = false, visible = true, testID }: LoadingProps) {
  if (!visible) return null;
  const content = (
    <AppView center gap={3} testID={testID}>
      <ActivityIndicator size="large" color={color} />
      {text && <AppText style={color ? { color } : undefined}>{text}</AppText>}
    </AppView>
  );
  if (overlay) {
    return (
      <AppView center flex className="absolute inset-0 bg-black/30" testID={testID}>
        {content}
      </AppView>
    );
  }
  return content;
}
