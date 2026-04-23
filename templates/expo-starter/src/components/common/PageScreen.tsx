import React from 'react';
import {
  AppScreen,
  AppHeader,
  type AppHeaderProps,
  AppScrollView,
  type AppScrollViewProps,
  useNavigation,
} from '@gaozh1024/rn-kit';

export interface PageScreenProps extends Omit<AppScrollViewProps, 'children'> {
  title?: string;
  titleNode?: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
  headerProps?: Omit<AppHeaderProps, 'title' | 'titleNode' | 'onLeftPress'>;
}

export function PageScreen({
  title,
  titleNode,
  children,
  onBack,
  headerProps,
  ...scrollProps
}: PageScreenProps) {
  const navigation = useNavigation();

  return (
    // 约定：Header 页保持 AppScreen 默认 top=false，
    // 顶部安全区统一由 AppHeader 承接，确保 status bar 与 header 背景一致。
    <AppScreen surface="background">
      <AppHeader
        title={title}
        titleNode={titleNode}
        leftIcon="arrow-back"
        onLeftPress={onBack || (() => navigation.goBack())}
        {...headerProps}
      />

      <AppScrollView surface="background" dismissKeyboardOnPressOutside {...scrollProps}>
        {children}
      </AppScrollView>
    </AppScreen>
  );
}
