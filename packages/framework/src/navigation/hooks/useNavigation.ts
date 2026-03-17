import React from 'react';
import {
  useNavigation as useRNNavigation,
  useRoute as useRNRoute,
  useNavigationState as useRNNavigationState,
} from '@react-navigation/native';

export function useNavigation() {
  const navigation = useRNNavigation();
  return navigation;
}

export function useRoute() {
  const route = useRNRoute();
  return route;
}

export function useNavigationState() {
  const state = useRNNavigationState(state => state);
  return state;
}

export function useBackHandler(handler: () => boolean) {
  const navigation = useRNNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!handler()) {
        e.preventDefault();
      }
    });

    return unsubscribe;
  }, [navigation, handler]);
}
