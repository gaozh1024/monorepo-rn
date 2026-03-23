import React, { useState, useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useTheme, useThemeColors } from '@/theme';
import { AppView, AppText, AppPressable } from '@/ui/primitives';
import { Icon } from './Icon';
import { Center } from '@/ui/layout';

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
  errorTitle?: string;
  errorDescription?: string;
  retryText?: string;

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

function renderListSlot(
  slot?: React.ComponentType | React.ReactElement | null
): React.ReactElement | null {
  if (!slot) return null;
  if (React.isValidElement(slot)) return slot;
  if (typeof slot === 'function') {
    const SlotComponent = slot as React.ComponentType;
    return <SlotComponent />;
  }
  return null;
}

function SkeletonItem({ render }: { render?: () => React.ReactElement }) {
  const colors = useThemeColors();

  if (render) {
    return render();
  }

  return (
    <AppView p={4} gap={3} testID="skeleton">
      <AppView row gap={3}>
        <AppView className="w-16 h-16 rounded-lg" style={{ backgroundColor: colors.divider }} />
        <AppView flex gap={2}>
          <AppView className="h-4 w-3/4 rounded" style={{ backgroundColor: colors.divider }} />
          <AppView className="h-3 w-1/2 rounded" style={{ backgroundColor: colors.divider }} />
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
  const colors = useThemeColors();

  return (
    <Center py={20}>
      <Icon name={icon || 'inbox'} size={64} color={colors.textMuted} />
      <AppText size="lg" weight="medium" className="mt-4" style={{ color: colors.text }}>
        {title || '暂无数据'}
      </AppText>
      {description && (
        <AppText size="sm" className="mt-2" style={{ color: colors.textMuted }}>
          {description}
        </AppText>
      )}
    </Center>
  );
}

function ErrorState({
  error,
  onRetry,
  errorTitle,
  errorDescription,
  retryText,
}: {
  error: Error;
  onRetry?: () => void;
  errorTitle?: string;
  errorDescription?: string;
  retryText?: string;
}) {
  const colors = useThemeColors();

  return (
    <Center py={20}>
      <Icon name="error-outline" size={64} color="error-300" />
      <AppText size="lg" weight="medium" color="error-500" className="mt-4">
        {errorTitle || '加载失败'}
      </AppText>
      <AppText size="sm" style={{ color: colors.textMuted }} className="mt-2 text-center px-8">
        {error.message || errorDescription || '请检查网络后重试'}
      </AppText>
      {onRetry && (
        <AppPressable
          onPress={onRetry}
          className="mt-6 px-4 py-2 rounded-lg"
          style={[
            styles.retryButton,
            { backgroundColor: colors.cardElevated, borderColor: colors.border },
          ]}
        >
          <AppText style={{ color: colors.textSecondary }} className="text-center">
            {retryText || '重新加载'}
          </AppText>
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
  const colors = useThemeColors();
  return (
    <AppView
      className="h-px"
      style={[{ marginVertical: 0 }, { backgroundColor: colors.divider }, style]}
    />
  );
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
  errorTitle,
  errorDescription,
  retryText,

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

  const flatListKey = useMemo(() => {
    if (horizontal) return 'app-list-horizontal';
    return `app-list-columns-${numColumns ?? 1}`;
  }, [horizontal, numColumns]);

  if (loading && data.length === 0) {
    return (
      <FlatList
        key={`${flatListKey}-skeleton`}
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
        <ErrorState
          error={error}
          onRetry={onRetry}
          errorTitle={errorTitle}
          errorDescription={errorDescription}
          retryText={retryText}
        />
      </Center>
    );
  }

  const ListEmptyComponent = useMemo(() => {
    if (EmptyComponent) return renderListSlot(EmptyComponent);
    return <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} />;
  }, [EmptyComponent, emptyTitle, emptyDescription, emptyIcon]);

  const FooterComponent = useMemo(() => {
    return (
      <>
        <LoadMoreFooter loading={isLoadingMore} />
        {renderListSlot(ListFooterComponent)}
      </>
    );
  }, [isLoadingMore, ListFooterComponent]);

  const HeaderComponent = useMemo(() => renderListSlot(ListHeaderComponent), [ListHeaderComponent]);

  return (
    <FlatList
      key={flatListKey}
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
      ListHeaderComponent={HeaderComponent}
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

const styles = StyleSheet.create({
  retryButton: {
    borderWidth: 0.5,
  },
});
