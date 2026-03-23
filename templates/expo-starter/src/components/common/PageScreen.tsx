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
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  headerProps?: Omit<AppHeaderProps, 'title' | 'onLeftPress'>;
}

export function PageScreen({
  title,
  children,
  onBack,
  headerProps,
  ...scrollProps
}: PageScreenProps) {
  const navigation = useNavigation();

  return (
    <AppScreen>
      <AppHeader
        title={title}
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
