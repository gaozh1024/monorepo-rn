import * as React from 'react';

const MaterialIcons = ({ name, size, color, style, ...props }: any) =>
  React.createElement(
    'span',
    {
      'data-testid': props.testID || `icon-${name}`,
      'data-name': name,
      style: { fontSize: size, color, ...style },
      ...props,
    },
    name
  );

export default MaterialIcons;
