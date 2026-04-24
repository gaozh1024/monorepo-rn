import React from 'react';

let lastStackNavigatorProps: any = null;
let lastStackScreenProps: any[] = [];

const createNavigator = () => {
  const Screen = (props: any) => {
    lastStackScreenProps.push(props);
    return React.createElement(React.Fragment, null, props.children);
  };
  Screen.displayName = 'Screen';

  const Group = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children);
  Group.displayName = 'Group';

  const Navigator = ({ children, ...props }: { children: React.ReactNode }) => {
    React.Children.toArray(children).forEach(child => {
      if (!React.isValidElement(child)) {
        throw new Error(
          "A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children"
        );
      }

      if (child.type !== Screen && child.type !== Group && child.type !== React.Fragment) {
        const childName =
          typeof child.type === 'string'
            ? child.type
            : ((child.type as any)?.displayName ?? (child.type as any)?.name);
        const screenName =
          child.props != null && typeof child.props === 'object' && 'name' in child.props
            ? child.props.name
            : undefined;
        throw new Error(
          `A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found '${childName}'${screenName ? ` for the screen '${screenName}'` : ''})`
        );
      }
    });

    lastStackNavigatorProps = props;
    return React.createElement(React.Fragment, null, children);
  };
  Navigator.displayName = 'Navigator';

  return {
    Navigator,
    Screen,
    Group,
  };
};

export const createStackNavigator = () => createNavigator();

export const TransitionPresets = {
  SlideFromRightIOS: {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: 'forHorizontalIOS',
  },
};

export const __getLastStackNavigatorProps = () => lastStackNavigatorProps;
export const __getLastStackScreenProps = () => lastStackScreenProps;
export const __resetLastStackNavigatorProps = () => {
  lastStackNavigatorProps = null;
  lastStackScreenProps = [];
};
