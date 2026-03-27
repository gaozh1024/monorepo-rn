export const motionDurations = {
  instant: 0,
  fast: 120,
  normal: 180,
  medium: 220,
  slow: 320,
  slower: 420,
} as const;

export const motionDistances = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const motionScales = {
  pressSoft: 0.98,
  pressStrong: 0.96,
  dialogEnter: 0.96,
  toastEnter: 0.98,
} as const;

export const motionOpacity = {
  press: 0.9,
  overlay: 0.45,
} as const;

export const motionSprings = {
  snappy: { damping: 18, stiffness: 220, mass: 1 },
  smooth: { damping: 22, stiffness: 180, mass: 1 },
  bouncy: { damping: 14, stiffness: 240, mass: 1 },
} as const;
