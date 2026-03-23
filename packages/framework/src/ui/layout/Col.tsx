import { AppView, type AppViewProps } from '@/ui/primitives';

/**
 * Col 组件属性接口
 */
export interface ColProps extends AppViewProps {
  /** 主轴对齐方式（justify-content） */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** 交叉轴对齐方式（align-items） */
  items?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Col - 垂直布局组件
 *
 * 基于 AppView 封装的垂直排列布局组件，默认使用 flex-col
 * 提供便捷的 justify 和 items 属性控制对齐方式
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Col>
 *   <Text>第一行</Text>
 *   <Text>第二行</Text>
 * </Col>
 *
 * // 两端对齐
 * <Col justify="between" flex>
 *   <Text>顶部内容</Text>
 *   <Text>底部内容</Text>
 * </Col>
 *
 * // 水平居中
 * <Col items="center" gap={3}>
 *   <Icon name="check-circle" size="xl" color="success-500" />
 *   <AppText weight="bold">操作成功</AppText>
 *   <AppText color="gray-500">您的订单已提交</AppText>
 * </Col>
 *
 * // 带间距
 * <Col gap={4}>
 *   <Input placeholder="用户名" />
 *   <Input placeholder="密码" secureTextEntry />
 *   <Button>登录</Button>
 * </Col>
 *
 * // 组合使用
 * <Col className="p-4 bg-white rounded-lg">
 *   <AppText size="lg" weight="bold">订单详情</AppText>
 *   <Row justify="between" className="mt-2">
 *     <AppText color="gray-500">订单号</AppText>
 *     <AppText>12345678</AppText>
 *   </Row>
 *   <Row justify="between" className="mt-2">
 *     <AppText color="gray-500">金额</AppText>
 *     <AppText color="danger-500" weight="bold">¥99.00</AppText>
 *   </Row>
 * </Col>
 * ```
 */
export function Col({ justify = 'start', items = 'stretch', ...props }: ColProps) {
  return <AppView justify={justify} items={items} {...props} />;
}
