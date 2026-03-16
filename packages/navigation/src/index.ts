// Provider
export { NavigationProvider, type NavigationProviderProps } from './provider';

// Navigators
export { StackNavigator, type StackNavigatorProps } from './navigators/StackNavigator';
export { TabNavigator, type TabNavigatorProps } from './navigators/TabNavigator';

// Components
export { AppHeader, type AppHeaderProps } from './components/AppHeader';

// Hooks
export { useNavigation, useRoute, useNavigationState, useBackHandler } from './hooks/useNavigation';

// Types
export type {
  RootStackParamList,
  RootTabParamList,
  RootStackScreenProps,
  RootTabScreenProps,
  StackScreenOptions,
  TabBarOptions,
} from './types';

// Utils
export { createNavigationTheme } from './utils/navigation-theme';

// Re-export from react-navigation
export { useFocusEffect, useIsFocused, useScrollToTop } from '@react-navigation/native';
