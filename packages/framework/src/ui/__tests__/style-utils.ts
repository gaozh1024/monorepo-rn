import { StyleSheet } from 'react-native';

type InteractionState = {
  pressed?: boolean;
  hovered?: boolean;
  focused?: boolean;
};

export function flattenStyle(style: any): Record<string, any> {
  if (!style) return {};

  if (Array.isArray(style)) {
    return style.filter(Boolean).reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }

  const flattened = StyleSheet.flatten(style);
  if (Array.isArray(flattened)) {
    return flattenStyle(flattened);
  }

  return flattened ?? {};
}

export function resolveInteractiveStyle(style: any, state: InteractionState = {}) {
  const resolved =
    typeof style === 'function'
      ? style({
          pressed: state.pressed ?? false,
          hovered: state.hovered ?? false,
          focused: state.focused ?? false,
        })
      : style;

  return flattenStyle(resolved);
}
