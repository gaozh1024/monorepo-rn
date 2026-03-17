import React, { useState, useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';
import { AppView, AppText, AppPressable } from '../primitives';
import { Icon } from './Icon';
import { Center } from '../layout';

export interface AppListProps<T = any> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;

  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void | Promise<void>;

  hasMore?: boolean;
  onEndReached?: () => void | Promise<void>;
  onEndReachedThreshold?: number;

  error?: Error | null;
  onRetry?: () => void;

  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  EmptyComponent?: React.ComponentType;

  divider?: boolean;
  dividerStyle?: StyleProp<ViewStyle>;

  skeletonCount?: number;
  skeletonRender?: () => React.ReactElement;

  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  numColumns?: number;
  columnWrapperStyle?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
}

function SkeletonItem({ render }: { render?: () => React.ReactElement }) {
  if (render) {
    return render();
  }
  return (
    <AppView p={4} gap={3} testID="skeleton">
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
    <Center py={20}>
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

function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Center py={20}>
      <Icon name="error-outline" size={64} color="error-300" />
      <AppText size="lg" weight="medium" color="error-500" className="mt-4">
        加载失败
      </AppText>
      <AppText size="sm" color="gray-400" className="mt-2 text-center px-8">
        {error.message || '请检查网络后重试'}
      </AppText>
      {onRetry && (
        <AppPressable
          onPress={onRetry}
          className="mt-6 px-4 py-2 border border-gray-300 rounded-lg"
        >
          <AppText className="text-center">重新加载</AppText>
        </AppPressable>
      )}
    </Center>
  );
}

function LoadMoreFooter({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return (
    <Center py={4}>
      <ActivityIndicator size="small" />
    </Center>
  );
}

function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <AppView className="h-px bg-gray-200" style={[{ marginVertical: 0 }, style]} />;
}

export function AppList<T = any>({
  data,
  renderItem,
  keyExtractor,

  loading = false,
  refreshing = false,
  onRefresh,

  hasMore = false,
  onEndReached,
  onEndReachedThreshold = 0.5,

  error,
  onRetry,

  emptyTitle,
  emptyDescription,
  emptyIcon,
  EmptyComponent,

  divider = false,
  dividerStyle,

  skeletonCount = 6,
  skeletonRender,

  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  style,
  numColumns,
  columnWrapperStyle,
  horizontal,
  showsVerticalScrollIndicator,
  showsHorizontalScrollIndicator,
}: AppListProps<T>) {
  const { theme } = useTheme();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleEndReached = useCallback(async () => {
    if (isLoadingMore || !hasMore || !onEndReached) return;

    setIsLoadingMore(true);
    try {
      await onEndReached();
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, onEndReached]);

  const defaultKeyExtractor = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) return keyExtractor(item, index);
      return `item-${index}`;
    },
    [keyExtractor]
  );

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

  const skeletonData = useMemo(
    () => new Array(skeletonCount).fill(null).map((_, i) => ({ _skeletonId: i })),
    [skeletonCount]
  );

  const skeletonRenderItem = useCallback(
    () => <SkeletonItem render={skeletonRender} />,
    [skeletonRender]
  );

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

  if (error && data.length === 0) {
    return (
      <Center style={style}>
        <ErrorState error={error} onRetry={onRetry} />
      </Center>
    );
  }

  const ListEmptyComponent = useMemo(() => {
    if (EmptyComponent) return <EmptyComponent />;
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />;
  }, [EmptyComponent, emptyTitle, emptyDescription, emptyIcon]);

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
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary?.[500]}
            colors={[theme.colors.primary?.[500]]}
          />
        ) : undefined
      }
      onEndReached={onEndReached ? handleEndReached : undefined}
      onEndReachedThreshold={onEndReachedThreshold}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={FooterComponent}
      contentContainerStyle={contentContainerStyle}
      style={style}
      numColumns={numColumns}
      columnWrapperStyle={columnWrapperStyle}
      horizontal={horizontal}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
    />
  );
}
