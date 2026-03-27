import React from 'react';

const createNavigator = () => ({
  Navigator: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  Screen: ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  Group: ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
});

export const createStackNavigator = () => createNavigator();

export const TransitionPresets = {
  SlideFromRightIOS: {
    gestureDirection: 'horizontal',
  },
};
