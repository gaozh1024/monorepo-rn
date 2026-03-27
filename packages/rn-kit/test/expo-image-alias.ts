import React from 'react';

export const Image = React.forwardRef<any, any>(({ children, testID, ...props }, ref) =>
  React.createElement(
    'ExpoImage',
    {
      ...props,
      ref,
      'data-testid': testID,
    },
    children
  )
);

Image.displayName = 'ExpoImage';
