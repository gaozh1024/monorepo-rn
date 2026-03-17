import * as React from 'react';

export const NavigationContainer = ({ children }: { children: any }) =>
  React.createElement('div', null, children);

export const useNavigation = () => ({
  navigate: () => {},
  goBack: () => {},
});

export const useRoute = () => ({
  params: {},
});

export default {
  NavigationContainer,
  useNavigation,
  useRoute,
};
