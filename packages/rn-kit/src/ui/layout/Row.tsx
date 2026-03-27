import { AppView, type AppViewProps } from '@/ui/primitives';

/**
 * Row 组件属性接口
 */
export interface RowProps extends AppViewProps {
  /** 主轴对齐方式（justify-content） */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** 交叉轴对齐方式（align-items） */
  items?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Row - 水平布局组件
 *
 * 基于 AppView 封装的水平排列布局组件，默认使用 flex-row
 * 提供便捷的 justify 和 items 属性控制对齐方式
 *
 * @example
 * ```tsx
 * // 基础使用
 * <Row>
 *   <Text>左侧</Text>
 *   <Text>右侧</Text>
 * </Row>
 *
 * // 两端对齐
 * <Row justify="between">
 *   <Text>标题</Text>
 *   <Icon name="arrow-forward" />
 * </Row>
 *
 * // 居中对齐
 * <Row justify="center" items="center" gap={4}>
 *   <Icon name="star" />
 *   <Text>评分</Text>
 * </Row>
 *
 * // 带间距
 * <Row gap={3}>
 *   <Button>取消</Button>
 *   <Button>确认</Button>
 * </Row>
 *
 * // 组合使用
 * <Row justify="between" items="center" className="p-4">
 *   <AppView row gap={2}>
 *     <Avatar source={avatar} />
 *     <AppView>
 *       <AppText weight="bold">用户名</AppText>
 *       <AppText size="sm" color="gray-500">描述信息</AppText>
 *     </AppView>
 *   </AppView>
 *   <Icon name="more-vert" />
 * </Row>
 * ```
 */
export function Row({ justify = 'start', items = 'center', ...props }: RowProps) {
  return <AppView row justify={justify} items={items} {...props} />;
}
