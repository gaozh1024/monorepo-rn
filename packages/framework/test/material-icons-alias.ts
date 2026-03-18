import React from 'react';

const MaterialIcons = React.forwardRef<any, any>(({ children, onPress, testID, ...props }, ref) =>
  React.createElement(
    'MaterialIcon',
    {
      ...props,
      ref,
      onClick: onPress,
      'data-testid': testID,
    },
    children
  )
);

MaterialIcons.displayName = 'MaterialIcons';

export default MaterialIcons;
