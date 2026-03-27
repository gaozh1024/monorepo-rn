import type { DimensionValue, ViewStyle } from 'react-native';

export type LayoutItems = 'start' | 'center' | 'end' | 'stretch';
export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type LayoutSurface = 'background' | 'card' | 'muted';
export type LayoutRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number;
export type LayoutSize = DimensionValue;

export interface CommonLayoutProps {
  flex?: boolean | number;
  row?: boolean;
  wrap?: boolean;
  center?: boolean;
  between?: boolean;
  items?: LayoutItems;
  justify?: LayoutJustify;
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  gap?: number;
  rounded?: LayoutRounded;
  w?: LayoutSize;
  h?: LayoutSize;
  minW?: LayoutSize;
  minH?: LayoutSize;
  maxW?: LayoutSize;
  maxH?: LayoutSize;
}

const itemsMap: Record<LayoutItems, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const justifyMap: Record<LayoutJustify, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

const roundedMap: Record<Exclude<LayoutRounded, number>, number> = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

function assignIfDefined<T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | undefined
) {
  if (value !== undefined) {
    target[key] = value;
  }
}

export function resolveLayoutStyle(props: CommonLayoutProps): ViewStyle {
  const style: ViewStyle = {
    flexDirection: props.row ? 'row' : 'column',
  };

  if (props.flex === true) {
    style.flex = 1;
  } else if (typeof props.flex === 'number') {
    style.flex = props.flex;
  }

  if (props.wrap) {
    style.flexWrap = 'wrap';
  }

  if (props.center) {
    style.alignItems = 'center';
    style.justifyContent = 'center';
  }

  if (props.between) {
    style.justifyContent = 'space-between';
  }

  if (props.items) {
    style.alignItems = itemsMap[props.items];
  }

  if (props.justify) {
    style.justifyContent = justifyMap[props.justify];
  }

  assignIfDefined(style, 'gap', props.gap);

  return style;
}

export function resolveSpacingStyle(props: CommonLayoutProps): ViewStyle {
  const style: ViewStyle = {};

  assignIfDefined(style, 'paddingTop', props.pt ?? props.py ?? props.p);
  assignIfDefined(style, 'paddingBottom', props.pb ?? props.py ?? props.p);
  assignIfDefined(style, 'paddingLeft', props.pl ?? props.px ?? props.p);
  assignIfDefined(style, 'paddingRight', props.pr ?? props.px ?? props.p);

  assignIfDefined(style, 'marginTop', props.mt ?? props.my ?? props.m);
  assignIfDefined(style, 'marginBottom', props.mb ?? props.my ?? props.m);
  assignIfDefined(style, 'marginLeft', props.ml ?? props.mx ?? props.m);
  assignIfDefined(style, 'marginRight', props.mr ?? props.mx ?? props.m);

  return style;
}

export function resolveSizingStyle(props: CommonLayoutProps): ViewStyle {
  const style: ViewStyle = {};

  assignIfDefined(style, 'width', props.w);
  assignIfDefined(style, 'height', props.h);
  assignIfDefined(style, 'minWidth', props.minW);
  assignIfDefined(style, 'minHeight', props.minH);
  assignIfDefined(style, 'maxWidth', props.maxW);
  assignIfDefined(style, 'maxHeight', props.maxH);

  return style;
}

export function resolveRoundedStyle(rounded?: LayoutRounded): ViewStyle {
  if (rounded === undefined) return {};

  return {
    borderRadius: typeof rounded === 'number' ? rounded : roundedMap[rounded],
  };
}
