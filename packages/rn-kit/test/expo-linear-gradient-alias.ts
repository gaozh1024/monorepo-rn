import React from 'react';

export interface LinearGradientProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function LinearGradient({ children, ...props }: LinearGradientProps) {
  return React.createElement('LinearGradient', props, children);
}
