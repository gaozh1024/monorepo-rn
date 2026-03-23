import { AppView, type AppViewProps } from '@/ui/primitives';

/**
 * Center 组件属性接口
 */
export interface CenterProps extends Omit<AppViewProps, 'center'> {
  /** 是否使用 flex 布局，默认为 false */
  flex?: boolean | number;
}

/**
 * Center - 居中布局组件
 *
 * 基于 AppView 封装的居中布局组件，内容在水平和垂直方向都居中
 * 默认不会自动撑满剩余空间；如需铺满可显式传入 `flex`
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Center>
 *   <Text>居中内容</Text>
 * </Center>
 *
 * // 全屏居中
 * <Center flex>
 *   <Icon name="inbox" size="xl" />
 *   <Text>暂无数据</Text>
 * </Center>
 *
 * // 指定 flex 值
 * <Center flex={2}>
 *   <Text>占据更多空间</Text>
 * </Center>
 *
 * // 组合使用
 * <Center flex className="bg-gray-50">
 *   <AppImage source={emptyImage} width={120} height={120} />
 *   <AppText size="lg" weight="bold" className="mt-4">暂无订单</AppText>
 *   <AppText color="gray-500" className="mt-2">快去选购商品吧</AppText>
 *   <AppButton className="mt-6" onPress={goShopping}>去购物</AppButton>
 * </Center>
 * ```
 */
export function Center({ flex = false, ...props }: CenterProps) {
  return <AppView center flex={flex} {...props} />;
}
