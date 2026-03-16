# AppList 组件设计文档

> 位置: `packages/ui/src/components/AppList.tsx`
> 依赖: React Native FlatList + 主题系统

---

## 1. 设计目标

- **功能完善**: 下拉刷新、上拉加载、空状态、错误重试一站式解决
- **性能优化**: 自动处理列表优化（memo、keyExtractor）
- **体验一致**: 默认骨架屏、加载指示器、分割线主题集成
- **开发便捷**: 简化 FlatList 配置，提供常用模式预设

---

## 2. 架构决策

### 2.1 与 FlatList 的关系

```typescript
// AppList 是对 FlatList 的封装，不是替代
// 保留 FlatList 的所有能力，添加常用功能

// 完整转发 FlatList 的 ref
// 支持所有 FlatListProps（除了被覆盖的）
```

### 2.2 状态管理策略

```
AppList 自身管理的状态：
├── refreshing（下拉刷新状态）
├── loadingMore（上拉加载状态）
└── skeletonVisible（骨架屏显示）

外部传入的状态：
├── data（列表数据）
├── loading（初始加载状态）
├── error（错误状态）
└── empty（空状态）
```

---

## 3. API 设计

### 3.1 基础用法

```tsx
import { AppList } from '@gaozh1024/rn-ui';

// 最简用法（只需 data 和 renderItem）
<AppList
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
/>

// 完整用法
<AppList
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
  keyExtractor={(item) => item.id}

  // 下拉刷新
  onRefresh={fetchProducts}
  refreshing={isRefreshing}

  // 上拉加载
  onEndReached={loadMore}
  hasMore={hasMore}

  // 空状态
  emptyTitle="暂无商品"
  emptyDescription="去逛逛其他分类吧"
  emptyIcon="shopping-bag"

  // 错误处理
  error={error}
  onRetry={fetchProducts}

  // 骨架屏
  skeletonCount={6}
  skeletonRender={() => <ProductSkeleton />}

  // 分割线
  divider
  dividerStyle={{ marginVertical: 8 }}

  // 列表头部/尾部
  ListHeaderComponent={<BannerCarousel />}
  ListFooterComponent={<Copyright />}
/>
```

### 3.2 Props 定义

```typescript
import type { FlatListProps, ListRenderItem, ViewStyle, StyleProp } from 'react-native';

interface AppListProps<T> extends Omit<
  FlatListProps<T>,
  'refreshing' | 'onRefresh' | 'onEndReached' | 'ListEmptyComponent' | 'ListFooterComponent'
> {
  /**
   * 列表数据
   */
  data: T[];

  /**
   * 渲染每一项
   */
  renderItem: ListRenderItem<T>;

  /**
   * 唯一标识（默认使用 index，建议传入）
   */
  keyExtractor?: (item: T, index: number) => string;

  /**
   * 是否正在加载初始数据（显示骨架屏）
   * @default false
   */
  loading?: boolean;

  /**
   * 是否正在刷新
   * @default false
   */
  refreshing?: boolean;

  /**
   * 下拉刷新回调
   */
  onRefresh?: () => void | Promise<void>;

  /**
   * 是否还有更多数据（上拉加载）
   * @default false
   */
  hasMore?: boolean;

  /**
   * 上拉加载回调
   */
  onEndReached?: () => void | Promise<void>;

  /**
   * 距离底部多少距离触发加载（像素）
   * @default 50
   */
  onEndReachedThreshold?: number;

  /**
   * 错误对象（存在时显示错误状态）
   */
  error?: Error | null;

  /**
   * 错误重试回调
   */
  onRetry?: () => void;

  /**
   * 空状态标题
   * @default "暂无数据"
   */
  emptyTitle?: string;

  /**
   * 空状态描述
   */
  emptyDescription?: string;

  /**
   * 空状态图标名称
   * @default "inbox"
   */
  emptyIcon?: string;

  /**
   * 自定义空状态组件
   */
  EmptyComponent?: React.ComponentType;

  /**
   * 是否显示分割线
   * @default false
   */
  divider?: boolean;

  /**
   * 分割线样式
   */
  dividerStyle?: StyleProp<ViewStyle>;

  /**
   * 骨架屏数量（loading 时显示）
   * @default 6
   */
  skeletonCount?: number;

  /**
   * 骨架屏渲染函数
   */
  skeletonRender?: () => React.ReactElement;

  /**
   * 列表容器样式
   */
  contentContainerStyle?: StyleProp<ViewStyle>;

  /**
   * 是否自动处理滚动性能优化
   * @default true
   */
  optimized?: boolean;
}
```

### 3.3 预设模式

```typescript
// 为常见场景提供预设配置

// 1. 商品列表模式
<AppList.Product
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
  numColumns={2}  // 两列网格
  onRefresh={refresh}
  onEndReached={loadMore}
  hasMore={hasMore}
/>

// 2. 消息列表模式
<AppList.Message
  data={messages}
  renderItem={({ item }) => <MessageItem message={item} />}
  divider  // 自带分割线
  onRefresh={refresh}
/>

// 3. 卡片列表模式
<AppList.Card
  data={items}
  renderItem={({ item }) => <CardItem item={item} />}
  cardGap={16}
  onRefresh={refresh}
  onEndReached={loadMore}
/>
```

---

## 4. 实现细节

### 4.1 核心组件实现

```tsx
// src/components/AppList.tsx

import React, { useCallback, useRef, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@gaozh1024/rn-theme';
import { cn } from '@gaozh1024/rn-utils';
import { AppView, AppText, AppButton } from '../primitives';
import { Icon } from './Icon';
import { Center } from '../layout';

export interface AppListProps<T = any> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;

  // 加载状态
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;

  // 加载更多
  hasMore?: boolean;
  onEndReached?: () => void | Promise<void>;
  onEndReachedThreshold?: number;

  // 错误状态
  error?: Error | null;
  onRetry?: () => void;

  // 空状态
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  EmptyComponent?: React.ComponentType;

  // 分割线
  divider?: boolean;
  dividerStyle?: StyleProp<ViewStyle>;

  // 骨架屏
  skeletonCount?: number;
  skeletonRender?: () => React.ReactElement;

  // FlatList 原生属性
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  numColumns?: number;
  columnWrapperStyle?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  onScroll?: (event: any) => void;
  scrollEventThrottle?: number;
}

// 骨架屏占位
function SkeletonItem({ render }: { render?: () => React.ReactElement }) {
  if (render) {
    return render();
  }
  return (
    <AppView p={4} gap={3}>
      <AppView row gap={3}>
        <AppView className="w-16 h-16 rounded-lg bg-gray-200" />
        <AppView flex gap={2}>
          <AppView className="h-4 w-3/4 rounded bg-gray-200" />
          <AppView className="h-3 w-1/2 rounded bg-gray-200" />
        </AppView>
      </AppView>
    </AppView>
  );
}

// 空状态组件
function EmptyState({
  title,
  description,
  icon,
}: {
  title?: string;
  description?: string;
  icon?: string;
}) {
  return (
    <Center flex py={20}>
      <Icon name={icon || 'inbox'} size={64} color="gray-300" />
      <AppText size="lg" weight="medium" color="gray-500" className="mt-4">
        {title || '暂无数据'}
      </AppText>
      {description && (
        <AppText size="sm" color="gray-400" className="mt-2">
          {description}
        </AppText>
      )}
    </Center>
  );
}

// 错误状态组件
function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Center flex py={20}>
      <Icon name="error-outline" size={64} color="error-300" />
      <AppText size="lg" weight="medium" color="error-500" className="mt-4">
        加载失败
      </AppText>
      <AppText size="sm" color="gray-400" className="mt-2 text-center px-8">
        {error.message || '请检查网络后重试'}
      </AppText>
      {onRetry && (
        <AppButton variant="outline" size="sm" className="mt-6" onPress={onRetry}>
          重新加载
        </AppButton>
      )}
    </Center>
  );
}

// 加载更多指示器
function LoadMoreFooter({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return (
    <Center py={4}>
      <ActivityIndicator size="small" />
    </Center>
  );
}

// 分割线
function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <AppView className="h-px bg-gray-200" style={[{ marginVertical: 0 }, style]} />;
}

export function AppList<T = any>({
  data,
  renderItem,
  keyExtractor,

  // 加载状态
  loading = false,
  refreshing = false,
  onRefresh,

  // 加载更多
  hasMore = false,
  onEndReached,
  onEndReachedThreshold = 0.5,

  // 错误状态
  error,
  onRetry,

  // 空状态
  emptyTitle,
  emptyDescription,
  emptyIcon,
  EmptyComponent,

  // 分割线
  divider = false,
  dividerStyle,

  // 骨架屏
  skeletonCount = 6,
  skeletonRender,

  // FlatList 属性
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  style,
  numColumns,
  columnWrapperStyle,
  horizontal,
  showsVerticalScrollIndicator,
  showsHorizontalScrollIndicator,
  onScroll,
  scrollEventThrottle,
}: AppListProps<T>) {
  const { theme } = useTheme();
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // 处理上拉加载
  const handleEndReached = useCallback(async () => {
    if (isLoadingMore || !hasMore || !onEndReached) return;

    setIsLoadingMore(true);
    try {
      await onEndReached();
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, onEndReached]);

  // 默认 keyExtractor
  const defaultKeyExtractor = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) return keyExtractor(item, index);
      return `item-${index}`;
    },
    [keyExtractor]
  );

  // 包裹 renderItem 添加分割线
  const wrappedRenderItem = useCallback(
    (info: any) => {
      return (
        <>
          {divider && info.index > 0 && <Divider style={dividerStyle} />}
          {renderItem(info)}
        </>
      );
    },
    [renderItem, divider, dividerStyle]
  );

  // 骨架屏数据
  const skeletonData = useMemo(
    () => new Array(skeletonCount).fill(null).map((_, i) => ({ _skeletonId: i })),
    [skeletonCount]
  );

  // 骨架屏渲染
  const skeletonRenderItem = useCallback(
    () => <SkeletonItem render={skeletonRender} />,
    [skeletonRender]
  );

  // 显示骨架屏
  if (loading && data.length === 0) {
    return (
      <FlatList
        data={skeletonData}
        renderItem={skeletonRenderItem}
        keyExtractor={(_, index) => `skeleton-${index}`}
        contentContainerStyle={contentContainerStyle}
        style={style}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      />
    );
  }

  // 显示错误状态
  if (error && data.length === 0) {
    return (
      <Center flex style={style}>
        <ErrorState error={error} onRetry={onRetry} />
      </Center>
    );
  }

  // 空状态组件
  const ListEmptyComponent = useMemo(() => {
    if (EmptyComponent) return <EmptyComponent />;
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />;
  }, [EmptyComponent, emptyTitle, emptyDescription, emptyIcon]);

  // 尾部组件（加载更多 + 自定义尾部）
  const FooterComponent = useMemo(() => {
    return (
      <>
        <LoadMoreFooter loading={isLoadingMore} />
        {ListFooterComponent}
      </>
    );
  }, [isLoadingMore, ListFooterComponent]);

  return (
    <FlatList
      data={data}
      renderItem={wrappedRenderItem}
      keyExtractor={defaultKeyExtractor}
      // 刷新控制
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary[500]}
            colors={[theme.colors.primary[500]]}
          />
        ) : undefined
      }
      // 上拉加载
      onEndReached={onEndReached ? handleEndReached : undefined}
      onEndReachedThreshold={onEndReachedThreshold}
      // 空状态
      ListEmptyComponent={ListEmptyComponent}
      // 头部/尾部
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={FooterComponent}
      // 样式
      contentContainerStyle={contentContainerStyle}
      style={style}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      horizontal={horizontal}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      // 性能优化
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
    />
  );
}
```

### 4.2 预设模式实现

```tsx
// 商品列表预设（两列网格）
AppList.Product = function ProductList<T>(props: AppListProps<T>) {
  return (
    <AppList
      {...props}
      numColumns={2}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
};

// 消息列表预设（带分割线）
AppList.Message = function MessageList<T>(props: AppListProps<T>) {
  return (
    <AppList
      {...props}
      divider
      skeletonRender={() => (
        <AppView p={4} gap={3}>
          <AppView row gap={3}>
            <AppView className="w-10 h-10 rounded-full bg-gray-200" />
            <AppView flex gap={2}>
              <AppView className="h-4 w-24 rounded bg-gray-200" />
              <AppView className="h-3 w-full rounded bg-gray-200" />
            </AppView>
          </AppView>
        </AppView>
      )}
    />
  );
};

// 卡片列表预设
AppList.Card = function CardList<T>(props: AppListProps<T> & { cardGap?: number }) {
  const { cardGap = 16, contentContainerStyle, ...rest } = props;
  return (
    <AppList
      {...rest}
      contentContainerStyle={[{ padding: cardGap, gap: cardGap }, contentContainerStyle]}
    />
  );
};
```

---

## 5. 使用示例

### 5.1 基础列表

```tsx
import { AppList } from '@gaozh1024/rn-ui';

function ProductList() {
  const { data, refreshing, loading, fetchProducts } = useProducts();

  return (
    <AppList
      data={data}
      renderItem={({ item }) => (
        <ProductCard name={item.name} price={item.price} image={item.image} />
      )}
      keyExtractor={item => item.id}
      loading={loading}
      onRefresh={fetchProducts}
      refreshing={refreshing}
    />
  );
}
```

### 5.2 带分页的列表

```tsx
function MessageList() {
  const { messages, refreshing, loadingMore, hasMore, refresh, loadMore, error } = useMessages();

  return (
    <AppList
      data={messages}
      renderItem={({ item }) => <MessageItem message={item} />}
      keyExtractor={item => item.id}
      // 刷新
      onRefresh={refresh}
      refreshing={refreshing}
      // 分页
      onEndReached={loadMore}
      hasMore={hasMore}
      // 错误处理
      error={error}
      onRetry={refresh}
      // 空状态
      emptyTitle="暂无消息"
      emptyDescription="您还没有收到任何消息"
      emptyIcon="chat-bubble-outline"
    />
  );
}
```

### 5.3 两列商品网格

```tsx
function ProductGrid() {
  const { products, hasMore, loadMore, refresh, refreshing } = useProducts();

  return (
    <AppList.Product
      data={products}
      renderItem={({ item }) => <ProductGridItem product={item} style={{ flex: 1 }} />}
      keyExtractor={item => item.id}
      onRefresh={refresh}
      refreshing={refreshing}
      onEndReached={loadMore}
      hasMore={hasMore}
      skeletonCount={6}
    />
  );
}
```

### 5.4 自定义骨架屏

```tsx
<AppList
  data={articles}
  renderItem={({ item }) => <ArticleCard article={item} />}
  loading={loading}
  skeletonCount={4}
  skeletonRender={() => (
    <AppView p={4} gap={3}>
      <AppView className="h-48 rounded-lg bg-gray-200" />
      <AppView className="h-6 w-3/4 rounded bg-gray-200" />
      <AppView className="h-4 w-full rounded bg-gray-200" />
      <AppView className="h-4 w-2/3 rounded bg-gray-200" />
    </AppView>
  )}
/>
```

### 5.5 水平滚动列表

```tsx
<AppList
  data={categories}
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
  renderItem={({ item }) => <CategoryCard category={item} style={{ width: 100 }} />}
  keyExtractor={item => item.id}
/>
```

---

## 6. 依赖清单

```json
{
  "peerDependencies": {
    "@gaozh1024/rn-utils": "^0.1.0",
    "@gaozh1024/rn-theme": "^0.1.0",
    "@gaozh1024/rn-ui": "^0.1.0",
    "react": "*",
    "react-native": "*"
  }
}
```

---

## 7. 验收标准

- [ ] 支持下拉刷新（RefreshControl 主题色）
- [ ] 支持上拉加载更多（自动 loading 状态）
- [ ] 支持骨架屏（默认样式 + 自定义）
- [ ] 支持空状态（自定义文案 + 图标）
- [ ] 支持错误状态（错误信息 + 重试按钮）
- [ ] 支持分割线（自动处理间距）
- [ ] 支持多列网格（numColumns）
- [ ] 支持水平滚动
- [ ] 内置性能优化（removeClippedSubviews 等）
- [ ] 提供 3 种预设模式（Product/Message/Card）
- [ ] 完整 TypeScript 类型支持

---

**审核状态**: 📝 待审核  
**预计开发时间**: 2-3 天  
**优先级**: P0（核心组件）
